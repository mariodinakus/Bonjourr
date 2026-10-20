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
    // Render INSIDE the original quotes widget. Do not add a new window, column or overlay.
    if (!['http:', 'https:'].includes(location.protocol)) return
    const quotesContainer = document.getElementById('quotes_container')
    if (!quotesContainer || document.getElementById('aurora-board')) return

    const font = document.createElement('link')
    font.rel = 'stylesheet'
    font.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap'
    document.head.appendChild(font)

    type Slide = 'quote' | 'holidays' | 'ideas' | 'news' | 'markets' | 'energy'
    const slides: { key: Slide; label: string }[] = [
        { key: 'quote', label: 'Γνωμικό' },
        { key: 'holidays', label: 'Αργίες' },
        { key: 'ideas', label: 'Vibe idea' },
        { key: 'news', label: 'Ειδήσεις' },
        { key: 'markets', label: 'Αγορές' },
        { key: 'energy', label: 'Ενέργεια' },
    ]

    const info = node('div', 'aurora-inline')
    info.id = 'aurora-board'
    info.setAttribute('aria-live', 'off')
    const switcher = node('nav', 'aurora-switcher')
    switcher.setAttribute('aria-label', 'Εναλλαγή γνωμικών και ενημερώσεων')
    quotesContainer.append(info, switcher)
    quotesContainer.classList.add('aurora-ready')

    let active: Slide = 'quote'
    let currentIdea = Math.floor(dateMs(athensToday()) / 86400000) % IDEAS.length
    let newsCursor = 0
    let data: AuroraPayload | null = null
    let lastAttempt = 0
    let loading = false
    let interactedAt = 0
    const buttons = new Map<Slide, HTMLButtonElement>()
    const hasPointerHover = (): boolean => quotesContainer.matches(':hover') ||
        quotesContainer.contains(document.activeElement)

    for (const slide of slides) {
        const button = action(slide.label, () => {
            interactedAt = Date.now()
            select(slide.key)
        }, 'aurora-switch')
        switcher.append(button)
        buttons.set(slide.key, button)
    }

    function select(next: Slide): void {
        active = next
        quotesContainer.dataset.auroraView = next
        for (const [key, button] of buttons) {
            const selected = key === next
            button.classList.toggle('active', selected)
            button.setAttribute('aria-current', selected ? 'true' : 'false')
        }
        render()
        if (next === 'news' || next === 'markets' || next === 'energy') void load()
    }

    function addLine(main: string, detail: string, linkUrl?: string): void {
        const inner = node('div', 'aurora-inline-inner')
        if (linkUrl?.startsWith('https://')) {
            const link = document.createElement('a')
            link.href = linkUrl
            link.target = '_blank'
            link.rel = 'noopener noreferrer'
            link.className = 'aurora-inline-primary'
            link.textContent = main
            inner.appendChild(link)
        } else {
            inner.appendChild(node('strong', 'aurora-inline-primary', main))
        }
        inner.appendChild(node('span', 'aurora-inline-secondary', detail))
        info.append(inner)
    }

    function addInlineButton(label: string, callback: () => void): void {
        info.appendChild(action(label, () => {
            interactedAt = Date.now()
            callback()
        }, 'aurora-inline-action'))
    }

    function showHoliday(): void {
        const holidays = countDowns()
        const nearest = holidays.find((item) => !item.personal)
        const personal = holidays.find((item) => item.personal)
        if (nearest) {
            addLine(
                nearest.name + ' · ' + countdownLabel(nearest.days),
                formatDay(nearest.date) +
                    (personal ? '   |   ' + personal.name + ' ' + countdownLabel(personal.days) : '')
            )
        }
        addInlineButton('+ Ημερομηνία', () => {
            const label = window.prompt('Ποια προσωπική ημερομηνία θέλεις να παρακολουθείς;')
            if (!label?.trim()) return
            const date = window.prompt('Ημερομηνία (ΕΕΕΕ-ΜΜ-ΗΗ), π.χ. 2026-12-01')
            if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
                !Number.isFinite(dateMs(date)) || new Date(date + 'T00:00:00Z').toISOString().slice(0, 10) !== date ||
                date < athensToday()) return
            const previous = readMilestones()
            saveMilestones([...previous, { name: label.trim().slice(0, 38), date }].slice(-30))
            render()
        })
    }

    function showIdea(): void {
        const idea = IDEAS[currentIdea % IDEAS.length]
        addLine('✦ ' + idea.name, idea.description + ' · ' + idea.difficulty)
        addInlineButton('↻', () => {
            currentIdea += 1
            render()
        })
        addInlineButton('Brief ↗', () => {
            if (!navigator.clipboard) return
            void navigator.clipboard.writeText(idea.prompt).then(() => {
                const message = info.querySelector<HTMLElement>('.aurora-inline-secondary')
                if (message) message.textContent = 'Το brief αντιγράφηκε — κάνε επικόλληση στο ChatGPT.'
            }).catch(() => {
                const message = info.querySelector<HTMLElement>('.aurora-inline-secondary')
                if (message) message.textContent = 'Δεν επιτρέπεται η αντιγραφή σε αυτόν τον browser.'
            })
        })
    }

    function showNews(): void {
        const articles = data?.news ?? []
        if (!articles.length) {
            addLine('Ειδήσεις κόσμου', loading ? 'Φόρτωση…' : 'Δεν υπάρχουν διαθέσιμες ενημερώσεις.')
            return
        }
        const article = articles[newsCursor % articles.length]
        addLine(article.title, article.category + ' · ' + (article.source || 'Google News'), article.url)
        addInlineButton('↻', () => {
            newsCursor += 1
            render()
        })
    }

    function showQuotes(quotes: AuroraQuote[], category: string): void {
        const available = quotes.filter((entry) => typeof entry.value === 'number' && Number.isFinite(entry.value))
        if (!available.length) {
            addLine(category, loading ? 'Φόρτωση…' : 'Οι τελευταίες τιμές δεν είναι διαθέσιμες.')
            return
        }
        const text = available.slice(0, 3).map((entry) => {
            const amount = new Intl.NumberFormat('el-GR', { maximumFractionDigits: 2 }).format(entry.value as number)
            return entry.name + ' ' + amount
        }).join('   ·   ')
        const days = [...new Set(available.map((entry) => entry.observedOn).filter(Boolean))]
        addLine(text, 'Ιστορικά δεδομένα' + (days.length ? ' · ' + days.join(', ') : '') + ' · όχι ζωντανές τιμές')
    }

    function render(): void {
        info.replaceChildren()
        if (active === 'quote') return
        if (active === 'holidays') showHoliday()
        if (active === 'ideas') showIdea()
        if (active === 'news') showNews()
        if (active === 'markets') showQuotes(data?.markets ?? [], 'Δείκτες')
        if (active === 'energy') showQuotes([...(data?.energy ?? []), ...(data?.electricity ? [data.electricity] : [])], 'Ενέργεια')
    }

    async function load(): Promise<void> {
        if (loading || (lastAttempt && Date.now() - lastAttempt < 15 * 60 * 1000)) return
        lastAttempt = Date.now()
        loading = true
        render()
        try {
            const response = await fetch('/api/aurora', {
                cache: 'no-store',
                signal: AbortSignal.timeout(15000),
            })
            if (!response.ok) throw new Error('Feed unavailable')
            const payload = (await response.json()) as AuroraPayload
            if (!Array.isArray(payload.news) || !Array.isArray(payload.markets) || !Array.isArray(payload.energy)) {
                throw new Error('Invalid feed')
            }
            data = payload
        } catch (_) {
            // Unavailable source -> neutral empty state. Never pretend historical values are live.
        } finally {
            loading = false
            render()
        }
    }

    select('quote')
    // A single, quiet rotation in the SAME quote location. Hover, focus or clicking pauses it.
    window.setInterval(() => {
        if (document.hidden || hasPointerHover() || Date.now() - interactedAt < 90_000 ||
            quotesContainer.classList.contains('hidden')) return
        const index = slides.findIndex((slide) => slide.key === active)
        select(slides[(index + 1) % slides.length].key)
    }, 18_000)
}
