// Aurora Finance — read-only public data proxy for the Vercel web edition.
// No credentials, no invented prices, no claim of real-time market data.
// Individual upstream failures degrade their own section only.

const TIMEOUT_MS = 6500;

async function getText(url) {
    const response = await fetch(url, {
        headers: { 'User-Agent': 'AuroraFinanceDashboard/1.0 (+https://github.com/mariodinakus/Bonjourr)' },
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) throw new Error('Upstream HTTP ' + response.status);
    return response.text();
}

function xmlText(block, tag) {
    const pattern = new RegExp('<' + tag + '(?:\\s[^>]*)?>([\\s\\S]*?)<\\/' + tag + '>', 'i');
    return (block.match(pattern)?.[1] || '').replace(/^<!\[CDATA\[|\]\]>$/g, '').trim();
}

function decodeEntities(value) {
    return value.replace(/&#(x[0-9a-f]+|[0-9]+);/gi, (_, code) => {
        const point = code.toLowerCase().startsWith('x') ? parseInt(code.slice(1), 16) : parseInt(code, 10);
        return Number.isFinite(point) && point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : '';
    }).replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

async function loadNews() {
    const queries = [
        { category: 'Κόσμος', query: 'international major world events' },
        { category: 'Οικονομία', query: 'global economy financial markets' },
        { category: 'Ενέργεια', query: 'energy oil natural gas electricity Europe' },
    ];
    const responses = await Promise.allSettled(queries.map(async ({ category, query }) => {
        const url = 'https://news.google.com/rss/search?q=' + encodeURIComponent(query)
            + '&hl=el&gl=GR&ceid=GR:el';
        const xml = await getText(url);
        const blocks = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];
        return blocks.slice(0, 3).map((block) => {
            const source = decodeEntities(xmlText(block, 'source'));
            const rawTitle = decodeEntities(xmlText(block, 'title'));
            const title = source && rawTitle.endsWith(' - ' + source)
                ? rawTitle.slice(0, -source.length - 3)
                : rawTitle;
            const link = decodeEntities(xmlText(block, 'link'));
            const date = Date.parse(xmlText(block, 'pubDate'));
            return {
                category,
                title: title.slice(0, 190),
                source: source.slice(0, 70),
                url: link.startsWith('https://') ? link : '',
                publishedAt: Number.isFinite(date) ? new Date(date).toISOString() : null,
            };
        }).filter((item) => item.title && item.url);
    }));
    return responses.flatMap((r) => r.status === 'fulfilled' ? r.value : []).slice(0, 9);
}

function utcDay(d) {
    return d.toISOString().slice(0, 10).replaceAll('-', '');
}

async function loadMarket(name, symbol) {
    const start = new Date(Date.now() - 21 * 86400000);
    const url = 'https://stooq.com/q/d/l/?s=' + encodeURIComponent(symbol)
        + '&i=d&d1=' + utcDay(start) + '&d2=' + utcDay(new Date());
    const csv = await getText(url);
    const rows = csv.trim().split(/\r?\n/).slice(1).map((line) => {
        const [date, , , , close] = line.split(',');
        return { date, close: Number(close) };
    }).filter((row) => /^\d{4}-\d{2}-\d{2}$/.test(row.date) && row.close > 0);
    if (!rows.length) throw new Error('No market observations');
    const current = rows[rows.length - 1];
    const previous = rows.length > 1 ? rows[rows.length - 2] : null;
    return {
        name,
        value: current.close,
        unit: 'points',
        changePercent: previous ? Math.round((current.close / previous.close - 1) * 10000) / 100 : null,
        observedOn: current.date,
        source: 'Stooq (historical daily close)',
        delayed: true,
        url: 'https://stooq.com/',
    };
}

async function loadEnergy(name, fredSeries) {
    const from = new Date(Date.now() - 50 * 86400000).toISOString().slice(0, 10);
    const url = 'https://fred.stlouisfed.org/graph/fredgraph.csv?id='
        + encodeURIComponent(fredSeries) + '&cosd=' + from;
    const csv = await getText(url);
    const rows = csv.trim().split(/\r?\n/).slice(1).map((line) => {
        const [date, value] = line.split(',');
        return { date, value: Number(value) };
    }).filter((row) => /^\d{4}-\d{2}-\d{2}$/.test(row.date) && row.value > 0);
    if (!rows.length) throw new Error('No energy observations');
    const current = rows[rows.length - 1];
    return {
        name,
        value: current.value,
        unit: 'USD/bbl',
        changePercent: null,
        observedOn: current.date,
        source: 'FRED / EIA (daily observation)',
        delayed: true,
        url: 'https://fred.stlouisfed.org/series/' + fredSeries,
    };
}

function settledItems(results, specs) {
    return results.map((result, index) => result.status === 'fulfilled'
        ? result.value
        : {
            name: specs[index][0], value: null, changePercent: null,
            observedOn: null, delayed: true, error: 'Η πηγή δεν είναι διαθέσιμη',
        });
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=1800');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    if (req.method !== 'GET') {
        res.statusCode = 405;
        res.setHeader('Allow', 'GET');
        res.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    const indices = [['S&P 500', '^spx'], ['Nasdaq 100', '^ndx'], ['DAX', '^dax']];
    const energy = [['Brent', 'DCOILBRENTEU'], ['WTI', 'DCOILWTICO']];
    const [newsResult, marketResults, energyResults] = await Promise.all([
        loadNews().catch(() => []),
        Promise.allSettled(indices.map(([name, symbol]) => loadMarket(name, symbol))),
        Promise.allSettled(energy.map(([name, series]) => loadEnergy(name, series))),
    ]);

    res.statusCode = 200;
    res.end(JSON.stringify({
        generatedAt: new Date().toISOString(),
        freshness: 'Market and energy values are historical daily observations, NOT live quotes.',
        news: newsResult,
        markets: settledItems(marketResults, indices),
        energy: settledItems(energyResults, energy),
        electricity: {
            name: 'Ηλεκτρική ενέργεια Ελλάδας',
            value: null,
            unit: '€/MWh',
            error: 'Επισκέψου την επίσημη αγορά για τη δημοσιευμένη τιμή',
            url: 'https://www.enexgroup.gr/web/guest/markets-publications-el-day-ahead-market',
            source: 'Hellenic Energy Exchange',
        },
    }));
}
