// Aurora Finance dashboard for the Bonjourr web edition.
// Browser extensions remain unchanged: the feeds use the Vercel /api/aurora route.

interface AuroraQuote {
    name: string
    value: number | null
    unit?: string
    changePercent?: number | null
    observedOn?: string | null
    source?: string
    url?: string
    error?: string
}

interface AuroraNews {
    category: string
    title: string
    source: string
    url: string
    publishedAt: string | null
}

interface AuroraPayload {
    generatedAt: string
    news: AuroraNews[]
    markets: AuroraQuote[]
    energy: AuroraQuote[]
    electricity: AuroraQuote
}

const MARKET_LINK = 'https://www.google.com/finance/'
const ENERGY_LINK = 'https://www.enexgroup.gr/web/guest/markets-publications-el-day-ahead-market'
const NEWS_LINK = 'https://news.google.com/'

export function auroraDashboard(): void {
    // The original Chrome/Firefox extensions have no same-origin Vercel API.
    // Do not make cross-origin requests or modify extension permissions.
    if (!['http:', 'https:'].includes(location.protocol) || !document.getElementById('interface')) {
        return
    }

    if (document.getElementById('aurora-board')) {
        return
    }

    const font = document.createElement('link')
    font.rel = 'stylesheet'
    font.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap'
    document.head.appendChild(font)

    const root = document.createElement('section')
    root.id = 'aurora-board'
    root.setAttribute('aria-label', 'Aurora Finance dashboard')
    root.innerHTML = [
        '<header class="aurora-header">',
        '<div class="aurora-brand"><span class="aurora-orb" aria-hidden="true"></span>',
        '<div><strong>AURORA <em>DESK</em></strong><small>NEWS · MARKETS · ENERGY</small></div></div>',
        '<div class="aurora-actions"><span id="aurora-status" role="status" aria-live="polite">Φόρτωση δεδομένων…</span>',
        '<button type="button" id="aurora-refresh" title="Ανανέωση">↻ Ανανέωση</button>',
        '<button type="button" id="aurora-toggle" aria-expanded="true" aria-controls="aurora-content">−</button></div>',
        '</header>',
        '<div id="aurora-content">',
        '<div class="aurora-top-grid">',
        '<section class="aurora-panel" aria-label="Αγορές">',
        '<div class="aurora-panel-head"><h2>Αγορές</h2><a href="' + MARKET_LINK + '" target="_blank" rel="noopener noreferrer">Google Finance ↗</a></div>',
        '<div id="aurora-markets" class="aurora-tile-grid"><p class="aurora-empty">Αναμονή…</p></div>',
        '</section>',
        '<section class="aurora-panel" aria-label="Ενέργεια">',
        '<div class="aurora-panel-head"><h2>Ενέργεια</h2><a href="' + ENERGY_LINK + '" target="_blank" rel="noopener noreferrer">ΕΧΕ ↗</a></div>',
        '<div id="aurora-energy" class="aurora-tile-grid"><p class="aurora-empty">Αναμονή…</p></div>',
        '</section></div>',
        '<section class="aurora-panel aurora-news" aria-label="Σημαντικές ειδήσεις">',
        '<div class="aurora-panel-head"><h2>Σημαντικές ειδήσεις</h2><a href="' + NEWS_LINK + '" target="_blank" rel="noopener noreferrer">Google News ↗</a></div>',
        '<div id="aurora-news" class="aurora-news-grid"><p class="aurora-empty">Αναμονή…</p></div>',
        '</section>',
        '<p class="aurora-disclaimer">Οι χρηματιστηριακές και ενεργειακές τιμές είναι ιστορικές παρατηρήσεις, όχι real-time προσφορές. Έλεγξε την ημερομηνία κάθε τιμής πριν τη χρησιμοποιήσεις.</p>',
        '</div>',
    ].join('')

    document.getElementById('interface')?.insertAdjacentElement('afterend', root)
    const content = root.querySelector<HTMLElement>('#aurora-content')
    const toggle = root.querySelector<HTMLButtonElement>('#aurora-toggle')
    const refresh = root.querySelector<HTMLButtonElement>('#aurora-refresh')

    toggle?.addEventListener('click', () => {
        if (!content || !toggle) return
        const expanded = toggle.getAttribute('aria-expanded') !== 'true'
        content.hidden = !expanded
        toggle.setAttribute('aria-expanded', String(expanded))
        toggle.textContent = expanded ? '−' : '+'
    })
    refresh?.addEventListener('click', () => { void load() })

    function status(value: string): void {
        const el = root.querySelector<HTMLElement>('#aurora-status')
        if (el) el.textContent = value
    }

    function makeText(tag: string, className: string, value: string): HTMLElement {
        const node = document.createElement(tag)
        node.className = className
        node.textContent = value
        return node
    }

    function createQuote(q: AuroraQuote): HTMLElement {
        const item = document.createElement('article')
        item.className = 'aurora-tile'
        item.appendChild(makeText('span', 'aurora-label', q.name))

        const value = typeof q.value === 'number' && Number.isFinite(q.value)
            ? new Intl.NumberFormat('el-GR', { maximumFractionDigits: 2 }).format(q.value)
            : '—'
        const number = makeText('strong', 'aurora-value', value)
        if (q.unit && value !== '—') {
            number.appendChild(makeText('small', 'aurora-unit', ' ' + q.unit))
        }
        item.appendChild(number)

        if (typeof q.changePercent === 'number' && Number.isFinite(q.changePercent)) {
            const sign = q.changePercent > 0 ? '+' : ''
            const change = makeText('span', 'aurora-change', sign + q.changePercent.toFixed(2) + '% vs πρ. κλείσιμο')
            change.dataset.direction = q.changePercent > 0 ? 'up' : q.changePercent < 0 ? 'down' : 'flat'
            item.appendChild(change)
        }

        const date = q.observedOn ? 'Στοιχεία ' + q.observedOn : (q.error || 'Μη διαθέσιμα δεδομένα')
        item.appendChild(makeText('span', 'aurora-meta', date))
        if (q.url?.startsWith('https://')) {
            const link = document.createElement('a')
            link.href = q.url
            link.target = '_blank'
            link.rel = 'noopener noreferrer'
            link.className = 'aurora-source'
            link.textContent = 'Πηγή ↗'
            item.appendChild(link)
        }
        return item
    }

    function displayQuotes(selector: string, values: AuroraQuote[]): void {
        const target = root.querySelector<HTMLElement>(selector)
        if (!target) return
        target.replaceChildren()
        for (const q of values) target.appendChild(createQuote(q))
    }

    function displayNews(news: AuroraNews[]): void {
        const target = root.querySelector<HTMLElement>('#aurora-news')
        if (!target) return
        target.replaceChildren()
        if (!news.length) {
            target.appendChild(makeText('p', 'aurora-empty', 'Δεν είναι διαθέσιμες ειδήσεις αυτή τη στιγμή. Δες το Google News.'))
            return
        }
        for (const newsItem of news) {
            if (!newsItem.url?.startsWith('https://')) continue
            const item = document.createElement('a')
            item.className = 'aurora-story'
            item.href = newsItem.url
            item.target = '_blank'
            item.rel = 'noopener noreferrer'
            item.appendChild(makeText('span', 'aurora-story-category', newsItem.category))
            item.appendChild(makeText('strong', 'aurora-story-title', newsItem.title))
            const published = newsItem.publishedAt && !Number.isNaN(Date.parse(newsItem.publishedAt))
                ? ' · ' + new Intl.DateTimeFormat('el-GR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(newsItem.publishedAt))
                : ''
            item.appendChild(makeText('span', 'aurora-meta', (newsItem.source || 'Google News') + published))
            target.appendChild(item)
        }
    }

    let pending = false
    async function load(): Promise<void> {
        if (pending) return
        pending = true
        if (refresh) refresh.disabled = true
        status('Ενημέρωση πηγών…')
        try {
            const response = await fetch('/api/aurora', { signal: AbortSignal.timeout(16000), cache: 'no-store' })
            if (!response.ok) throw new Error('HTTP ' + response.status)
            const result = (await response.json()) as AuroraPayload
            if (!Array.isArray(result.markets) || !Array.isArray(result.energy) || !Array.isArray(result.news)) {
                throw new Error('Μη έγκυρη απάντηση')
            }
            displayQuotes('#aurora-markets', result.markets)
            displayQuotes('#aurora-energy', [
                ...result.energy,
                result.electricity || { name: 'Ελλάδα · Ηλεκτρισμός', value: null, error: 'Μη διαθέσιμα' },
            ])
            displayNews(result.news)
            const observed = new Date(result.generatedAt)
            status(Number.isNaN(observed.getTime()) ? 'Ενημερωμένο' :
                'Έλεγχος πηγών ' + new Intl.DateTimeFormat('el-GR', { hour: '2-digit', minute: '2-digit' }).format(observed))
        } catch (_error) {
            status('Αδυναμία ενημέρωσης · δοκίμασε ξανά')
            const targets = ['#aurora-markets', '#aurora-energy', '#aurora-news']
            for (const selector of targets) {
                const target = root.querySelector<HTMLElement>(selector)
                if (target && target.querySelector('.aurora-empty')) {
                    target.replaceChildren(makeText('p', 'aurora-empty', 'Η πηγή δεδομένων δεν ανταποκρίνεται.'))
                }
            }
        } finally {
            pending = false
            if (refresh) refresh.disabled = false
        }
    }

    void load()
    window.setInterval(() => { if (!document.hidden) void load() }, 15 * 60 * 1000)
    document.addEventListener('visibilitychange', () => { if (!document.hidden) void load() })
}
