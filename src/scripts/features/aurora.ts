// Aurora Mini Desk — optional, compact overlay for the Bonjourr web edition.
// Bonjourr's original grid, clock, photo, weather, search and links are untouched.

type AuroraTab = 'today' | 'holidays' | 'ideas' | 'markets' | 'energy' | 'news'

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
interface Milestone {
    name: string
    date: string
}
interface Countdown {
    name: string
    date: string
    days: number
    personal: boolean
}
interface ProjectIdea {
    name: string
    area: string
    difficulty: string
    description: string
    prompt: string
}

const MILESTONE_KEY = 'aurora-personal-dates-v1'
const FAVORITE_KEY = 'aurora-favorite-ideas-v1'
const ATHENS_TIMEZONE = 'Europe/Athens'
const IDEAS: ProjectIdea[] = [
    {
        name: 'Policy Diff',
        area: 'Οικονομία',
        difficulty: 'Μεσαίο',
        description: 'Τι άλλαξε σήμερα σε επίσημες αποφάσεις, κανονισμούς και δημόσια δεδομένα;',
        prompt: 'Build Policy Diff: compare official public regulation and ministry feeds daily, show factual changes with source URLs, dates, keyword alerts, and clear no-update states. Greek and English UI.',
    },
    {
        name: 'Data Gap Hunter',
        area: 'Open Data',
        difficulty: 'Μεσαίο',
        description: 'Βρίσκει ποια δημόσια datasets σταμάτησαν να ενημερώνονται.',
        prompt: 'Create Data Gap Hunter: monitor selected official open-data endpoints and report missing updates, stale timestamps, broken links, and data quality without inventing values.',
    },
    {
        name: 'Deadline Atlas',
        area: 'Παραγωγικότητα',
        difficulty: 'Εύκολο',
        description: 'Μικρό ημερολόγιο με προθεσμίες, αντίστροφες μετρήσεις και επίσημες πηγές.',
        prompt: 'Build Deadline Atlas: compact calendar with user-added deadlines and official verified dates, customizable reminders, Greece timezone, exports, and no assumed obligations.',
    },
    {
        name: 'Source DNA',
        area: 'Ειδήσεις',
        difficulty: 'Δύσκολο',
        description: 'Συγκρίνει πώς καλύπτουν διαφορετικές πηγές το ίδιο γεγονός.',
        prompt: 'Build Source DNA: cluster news articles by event, display original headlines and sources, separate verified facts from interpretation and never fabricate coverage counts.',
    },
    {
        name: 'Climate Threshold',
        area: 'Κλίμα',
        difficulty: 'Δύσκολο',
        description: 'Παρακολουθεί ENSO, θερμοκρασία ωκεανών και όρια κλιματικών δεικτών.',
        prompt: 'Build Climate Threshold using NOAA public datasets: show ENSO indices, uncertainty, anomalies and observed dates. Distinguish measurements from forecasts.',
    },
    {
        name: 'Time Machine Cities',
        area: 'Χάρτες',
        difficulty: 'Δύσκολο',
        description: 'Ένα slider που συγκρίνει ιστορικούς χάρτες με σημερινές πόλεις.',
        prompt: 'Create Time Machine Cities: align licensed historical maps and current maps on a before-after slider, document source and accuracy, avoid false real-time satellite claims.',
    },
    {
        name: 'Market Narrative Audit',
        area: 'Αγορές',
        difficulty: 'Μεσαίο',
        description: 'Ελέγχει αν τα πρωτοσέλιδα για τις αγορές συμφωνούν με τα δεδομένα.',
        prompt: 'Build Market Narrative Audit: pair date-stamped market observations with linked news claims, show lags, explicit metrics and an evidence-based explanation, not investment advice.',
    },
    {
        name: 'Life Admin Radar',
        area: 'Παραγωγικότητα',
        difficulty: 'Εύκολο',
        description: 'Πίνακας για λήξεις εγγράφων, εγγυήσεις, συνδρομές και προσωπικές ημερομηνίες.',
        prompt: 'Create Life Admin Radar with local-first private storage for expiry dates, recurring items, reminders, import/export and a minimal card interface.',
    },
    {
        name: 'What Changed Overnight?',
        area: 'Έρευνα',
        difficulty: 'Μεσαίο',
        description: 'Σύντομη αναφορά μόνο για τις ουσιαστικές αλλαγές σε επιλεγμένα θέματα.',
        prompt: 'Build an overnight change report with user-selected official sources, deduplicated links, change-only summaries, timestamps and explicit no-change outcomes.',
    },
    {
        name: 'Public Money Map',
        area: 'Οικονομία',
        difficulty: 'Δύσκολο',
        description: 'Οπτικοποιεί δημόσιες δαπάνες και συγκρίσεις ανά περιοχή.',
        prompt: 'Create Public Money Map from licensed official procurement and public-spending open data, with comparable date periods, inflation notes, maps and raw source links.',
    },
    {
        name: 'Reverse Search Lab',
        area: 'Εργαλεία',
        difficulty: 'Μεσαίο',
        description: 'Ξεκινά από ένα πρόβλημα και προτείνει τις καλύτερες πηγές δεδομένων.',
        prompt: 'Build Reverse Search Lab: enter a problem, recommend verified public datasets and practical methods, document limitations, offer a reproducible starter project.',
    },
    {
        name: 'Decision Journal',
        area: 'Έρευνα',
        difficulty: 'Εύκολο',
        description: 'Κρατά προβλέψεις, πιθανότητες και αργότερα ελέγχει την ακρίβειά τους.',
        prompt: 'Build Decision Journal: local-first prediction entries with probability and resolution criteria, Brier score, calibration plots, date-stamped outcomes and exportable history.',
    },
]

const TABS: { key: AuroraTab; label: string }[] = [
    { key: 'today', label: 'Σήμερα' },
    { key: 'holidays', label: 'Αργίες' },
    { key: 'ideas', label: 'Vibe Lab' },
    { key: 'markets', label: 'Αγορές' },
    { key: 'energy', label: 'Ενέργεια' },
    { key: 'news', label: 'Ειδήσεις' },
]

function athensToday(): string {
    const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: ATHENS_TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(new Date())
    const pick = (type: string): string => parts.find((part) => part.type === type)?.value ?? ''
    return pick('year') + '-' + pick('month') + '-' + pick('day')
}

function dateMs(date: string): number {
    return Date.parse(date + 'T00:00:00Z')
}

function addDays(date: Date, days: number): string {
    const copy = new Date(date.getTime())
    copy.setUTCDate(copy.getUTCDate() + days)
    return copy.toISOString().slice(0, 10)
}

// Julian Easter converted to Gregorian calendar for 1900-2099 (13-day offset).
function orthodoxEaster(year: number): Date {
    const a = year % 4
    const b = year % 7
    const c = year % 19
    const d = (19 * c + 15) % 30
    const e = (2 * a + 4 * b - d + 34) % 7
    return new Date(Date.UTC(year, 2, 22 + d + e + 13))
}

function greekHolidays(year: number): Milestone[] {
    const easter = orthodoxEaster(year)
    return [
        { name: 'Πρωτοχρονιά', date: year + '-01-01' },
        { name: 'Θεοφάνεια', date: year + '-01-06' },
        { name: 'Καθαρά Δευτέρα', date: addDays(easter, -48) },
        { name: '25η Μαρτίου', date: year + '-03-25' },
        { name: 'Μεγάλη Παρασκευή', date: addDays(easter, -2) },
        { name: 'Δευτέρα του Πάσχα', date: addDays(easter, 1) },
        { name: 'Πρωτομαγιά', date: year + '-05-01' },
        { name: 'Δεκαπενταύγουστος', date: year + '-08-15' },
        { name: '28η Οκτωβρίου', date: year + '-10-28' },
        { name: 'Χριστούγεννα', date: year + '-12-25' },
        { name: '26η Δεκεμβρίου', date: year + '-12-26' },
    ]
}

function readMilestones(): Milestone[] {
    try {
        const parsed: unknown = JSON.parse(localStorage.getItem(MILESTONE_KEY) || '[]')
        if (!Array.isArray(parsed)) return []
        return parsed.filter((item): item is Milestone =>
            typeof item?.name === 'string' && typeof item?.date === 'string' &&
            /^\d{4}-\d{2}-\d{2}$/.test(item.date) && Number.isFinite(dateMs(item.date))
        ).slice(0, 30)
    } catch (_) {
        return []
    }
}

function saveMilestones(items: Milestone[]): void {
    try {
        localStorage.setItem(MILESTONE_KEY, JSON.stringify(items))
    } catch (_) { /* Private browsing may disable storage. */ }
}

function readFavorites(): string[] {
    try {
        const parsed: unknown = JSON.parse(localStorage.getItem(FAVORITE_KEY) || '[]')
        return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : []
    } catch (_) {
        return []
    }
}

function saveFavorites(items: string[]): void {
    try {
        localStorage.setItem(FAVORITE_KEY, JSON.stringify(items))
    } catch (_) { /* Private browsing may disable storage. */ }
}

function countDowns(): Countdown[] {
    const today = athensToday()
    const year = Number(today.slice(0, 4))
    const events = [
        ...greekHolidays(year),
        ...greekHolidays(year + 1),
        ...readMilestones().map((item) => ({ ...item, personal: true })),
    ]
    return events.map((event) => ({
        ...event,
        personal: 'personal' in event,
        days: Math.round((dateMs(event.date) - dateMs(today)) / 86400000),
    })).filter((event) => event.days >= 0).sort((a, b) => a.days - b.days)
}

function node(tag: string, className: string, textValue?: string): HTMLElement {
    const element = document.createElement(tag)
    element.className = className
    if (textValue !== undefined) element.textContent = textValue
    return element
}

function action(label: string, click: () => void, className = 'aurora-btn'): HTMLButtonElement {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = className
    button.textContent = label
    button.addEventListener('click', click)
    return button
}

function countdownLabel(days: number): string {
    if (days === 0) return 'Σήμερα!'
    if (days === 1) return 'σε 1 ημέρα'
    return 'σε ' + days + ' ημέρες'
}

function formatDay(date: string): string {
    return new Intl.DateTimeFormat('el-GR', { day: 'numeric', month: 'short' })
        .format(new Date(date + 'T12:00:00Z'))
}

export function auroraDashboard(): void {
    if (!['http:', 'https:'].includes(location.protocol) ||
        !document.getElementById('interface') || document.getElementById('aurora-board')) return

    const font = document.createElement('link')
    font.rel = 'stylesheet'
    font.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap'
    document.head.appendChild(font)

    const board = node('aside', 'aurora-mini-desk')
    board.id = 'aurora-board'
    board.setAttribute('aria-label', 'Aurora Mini Desk')
    const header = node('header', 'aurora-mini-header')
    const expand = action('', () => toggle(), 'aurora-mini-toggle')
    expand.setAttribute('aria-controls', 'aurora-mini-content')
    expand.setAttribute('aria-expanded', 'false')
    expand.appendChild(node('span', 'aurora-mini-logo', '✦ AURORA'))
    const hint = node('span', 'aurora-mini-hint')
    expand.appendChild(hint)
    expand.appendChild(node('span', 'aurora-mini-chevron', '⌃'))
    header.appendChild(expand)
    board.appendChild(header)

    const content = node('div', 'aurora-mini-content')
    content.id = 'aurora-mini-content'
    content.hidden = true
    const tabs = node('nav', 'aurora-mini-tabs')
    tabs.setAttribute('aria-label', 'Ενότητες Aurora')
    const body = node('div', 'aurora-mini-body')
    const footer = node('footer', 'aurora-mini-footer',
        'Δεδομένα αγοράς: ημερήσια και ενδεχομένως καθυστερημένα · όχι live.')
    content.append(tabs, body, footer)
    board.appendChild(content)
    document.body.appendChild(board)

    let selected: AuroraTab = 'today'
    let data: AuroraPayload | null = null
    let loading = false
    let fetchedAt = 0
    let ideaIndex = Math.floor(dateMs(athensToday()) / 86400000) % IDEAS.length
    const tabButtons = new Map<AuroraTab, HTMLButtonElement>()

    for (const tab of TABS) {
        const button = action(tab.label, () => select(tab.key), 'aurora-mini-tab')
        tabButtons.set(tab.key, button)
        tabs.appendChild(button)
    }

    function refreshHeader(): void {
        const next = countDowns().find((item) => !item.personal)
        hint.textContent = next ? next.name + ' ' + countdownLabel(next.days) : 'Αργίες · Ιδέες · Νέα'
    }

    function toggle(): void {
        const opening = content.hidden
        content.hidden = !opening
        expand.setAttribute('aria-expanded', String(opening))
        if (opening) {
            select(selected)
        }
    }

    function select(tab: AuroraTab): void {
        selected = tab
        for (const [key, button] of tabButtons) {
            const active = key === tab
            button.classList.toggle('active', active)
            button.setAttribute('aria-current', active ? 'page' : 'false')
        }
        render()
        if (['markets', 'energy', 'news'].includes(tab)) void loadFeed()
    }

    function showCountdowns(limit: number, editor: boolean): void {
        const upcoming = countDowns().slice(0, limit)
        const list = node('div', 'aurora-mini-list')
        for (const item of upcoming) {
            const row = node('div', 'aurora-countdown')
            row.appendChild(node('span', 'aurora-countdown-title', item.name))
            const days = node('strong', 'aurora-countdown-days', countdownLabel(item.days))
            row.appendChild(days)
            row.appendChild(node('small', 'aurora-mini-meta', formatDay(item.date)))
            if (editor && item.personal) {
                row.appendChild(action('×', () => {
                    saveMilestones(readMilestones().filter((entry) => !(entry.name === item.name && entry.date === item.date)))
                    refreshHeader()
                    render()
                }, 'aurora-remove'))
            }
            list.appendChild(row)
        }
        body.appendChild(list)
        if (!editor) return
        const form = document.createElement('form')
        form.className = 'aurora-date-form'
        const name = document.createElement('input')
        name.type = 'text'
        name.placeholder = 'Όνομα ημερομηνίας'
        name.required = true
        name.maxLength = 38
        name.setAttribute('aria-label', 'Όνομα ημερομηνίας')
        const date = document.createElement('input')
        date.type = 'date'
        date.required = true
        date.setAttribute('aria-label', 'Ημερομηνία')
        date.min = athensToday()
        const save = document.createElement('button')
        save.type = 'submit'
        save.textContent = 'Προσθήκη'
        form.append(name, date, save)
        form.addEventListener('submit', (event) => {
            event.preventDefault()
            if (!name.value.trim() || !date.value || date.value < athensToday()) return
            saveMilestones([...readMilestones(), { name: name.value.trim(), date: date.value }].slice(-30))
            refreshHeader()
            render()
        })
        body.appendChild(form)
        body.appendChild(node('p', 'aurora-mini-meta', 'Οι προσωπικές ημερομηνίες αποθηκεύονται μόνο σε αυτόν τον browser.'))
    }

    function showIdea(): void {
        const item = IDEAS[(ideaIndex + IDEAS.length) % IDEAS.length]
        const card = node('article', 'aurora-idea')
        card.appendChild(node('span', 'aurora-idea-topic', item.area + ' · ' + item.difficulty))
        card.appendChild(node('strong', 'aurora-idea-name', item.name))
        card.appendChild(node('p', 'aurora-idea-desc', item.description))
        const buttons = node('div', 'aurora-idea-actions')
        buttons.appendChild(action('Άλλη ιδέα ↻', () => { ideaIndex++; render() }))
        const favorites = readFavorites()
        buttons.appendChild(action(favorites.includes(item.name) ? '★ Αποθηκεύτηκε' : '☆ Αποθήκευση', () => {
            const current = readFavorites()
            saveFavorites(current.includes(item.name)
                ? current.filter((name) => name !== item.name)
                : [...current, item.name])
            render()
        }))
        const copy = action('Αντιγραφή brief', () => {
            if (!navigator.clipboard) {
                copy.textContent = 'Μη διαθέσιμο'
                return
            }
            void navigator.clipboard.writeText(item.prompt).then(() => {
                copy.textContent = 'Αντιγράφηκε ✓'
            }).catch(() => {
                copy.textContent = 'Μη διαθέσιμο'
            })
        })
        buttons.appendChild(copy)
        card.appendChild(buttons)
        body.appendChild(card)
        if (selected === 'ideas') {
            const saved = readFavorites()
            if (saved.length) body.appendChild(node('p', 'aurora-mini-meta', 'Αποθηκευμένες ιδέες: ' + saved.join(' · ')))
        }
    }

    function showQuotes(quotes: AuroraQuote[]): void {
        for (const item of quotes) {
            const row = node('div', 'aurora-quote')
            row.appendChild(node('span', 'aurora-quote-name', item.name))
            const value = typeof item.value === 'number' && Number.isFinite(item.value)
                ? new Intl.NumberFormat('el-GR', { maximumFractionDigits: 2 }).format(item.value) +
                  (item.unit ? ' ' + item.unit : '')
                : 'Μη διαθέσιμο'
            const number = node('strong', 'aurora-quote-value', value)
            row.appendChild(number)
            if (typeof item.changePercent === 'number') {
                const change = node('span', 'aurora-mini-change',
                    (item.changePercent > 0 ? '+' : '') + item.changePercent.toFixed(2) + '%')
                change.dataset.direction = item.changePercent > 0 ? 'up' : item.changePercent < 0 ? 'down' : 'flat'
                row.appendChild(change)
            }
            row.appendChild(node('small', 'aurora-mini-meta', item.observedOn || item.error || 'Ημερομηνία μη διαθέσιμη'))
            if (item.url?.startsWith('https://')) {
                const link = document.createElement('a')
                link.href = item.url
                link.target = '_blank'
                link.rel = 'noopener noreferrer'
                link.textContent = 'Πηγή ↗'
                row.appendChild(link)
            }
            body.appendChild(row)
        }
    }

    function showNews(items: AuroraNews[]): void {
        if (!items.length) {
            body.appendChild(node('p', 'aurora-mini-meta', 'Δεν υπάρχουν διαθέσιμες ειδήσεις αυτή τη στιγμή.'))
            return
        }
        for (const item of items.slice(0, 6)) {
            if (!item.url?.startsWith('https://')) continue
            const link = document.createElement('a')
            link.className = 'aurora-news-link'
            link.href = item.url
            link.target = '_blank'
            link.rel = 'noopener noreferrer'
            link.appendChild(node('span', 'aurora-idea-topic', item.category))
            link.appendChild(node('strong', 'aurora-news-title', item.title))
            link.appendChild(node('span', 'aurora-mini-meta', item.source || 'Google News'))
            body.appendChild(link)
        }
    }

    function render(): void {
        body.replaceChildren()
        if (selected === 'today') {
            body.appendChild(node('h3', 'aurora-mini-section-title', 'Επόμενες αργίες'))
            showCountdowns(2, false)
            body.appendChild(node('h3', 'aurora-mini-section-title', 'Vibe ιδέα της ημέρας'))
            showIdea()
            return
        }
        if (selected === 'holidays') {
            body.appendChild(node('h3', 'aurora-mini-section-title', 'Ημερομηνίες & αντίστροφη μέτρηση'))
            showCountdowns(8, true)
            return
        }
        if (selected === 'ideas') {
            body.appendChild(node('h3', 'aurora-mini-section-title', 'Vibe Coding Lab'))
            showIdea()
            return
        }
        if (!data) {
            body.appendChild(node('p', 'aurora-mini-meta', loading ? 'Ενημέρωση πηγών…' : 'Φόρτωση δεδομένων…'))
            return
        }
        if (selected === 'markets') showQuotes(data.markets)
        if (selected === 'energy') showQuotes([...data.energy, data.electricity || {
            name: 'Ελληνική αγορά ηλεκτρισμού', value: null, error: 'Πηγή μη διαθέσιμη',
        }])
        if (selected === 'news') showNews(data.news)
        const refresh = action('Ανανέωση ↻', () => { void loadFeed(true) })
        refresh.classList.add('aurora-refresh')
        body.appendChild(refresh)
        if (data.generatedAt) {
            const generated = new Date(data.generatedAt)
            if (!Number.isNaN(generated.getTime())) {
                body.appendChild(node('p', 'aurora-mini-meta', 'Έλεγχος πηγών: ' +
                    new Intl.DateTimeFormat('el-GR', { hour: '2-digit', minute: '2-digit' }).format(generated)))
            }
        }
    }

    async function loadFeed(force = false): Promise<void> {
        if (loading || (!force && data && Date.now() - fetchedAt < 15 * 60 * 1000)) return
        loading = true
        if (!data) render()
        try {
            const response = await fetch('/api/aurora', {
                signal: AbortSignal.timeout(16000),
                cache: 'no-store',
            })
            if (!response.ok) throw new Error('HTTP ' + response.status)
            const result = (await response.json()) as AuroraPayload
            if (!Array.isArray(result.news) || !Array.isArray(result.markets) ||
                !Array.isArray(result.energy)) throw new Error('Invalid data')
            data = result
            fetchedAt = Date.now()
        } catch (_) {
            body.replaceChildren(node('p', 'aurora-mini-meta',
                'Δεν είναι διαθέσιμα τα δεδομένα. Δοκίμασε αργότερα.'))
            if (selected === 'markets' || selected === 'energy' || selected === 'news') {
                body.appendChild(action('Ξανά ↻', () => { void loadFeed(true) }))
            }
        } finally {
            loading = false
            if (data && !content.hidden) render()
        }
    }

    refreshHeader()
    window.setInterval(() => {
        refreshHeader()
        if (!content.hidden && !document.hidden) {
            if (selected === 'today' || selected === 'holidays') render()
            if (selected === 'markets' || selected === 'energy' || selected === 'news') void loadFeed()
        }
    }, 15 * 60 * 1000)
}
