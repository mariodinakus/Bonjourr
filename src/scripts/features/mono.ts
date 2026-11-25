/**
 * MONO START widgets for Bonjourr
 *
 * - Kicker above the clock ("LOCAL TIME · CITY")
 * - Chips under the clock: ISO week number, moon phase with illumination
 * - Live weather details + 3-day forecast (Open-Meteo, cached 30 min)
 * - "Crazy science facts" card next to the weather card
 */

import type { LastWeather } from '../../types/local.ts'
import type { Sync } from '../../types/sync.ts'

interface MonoForecast {
    timestamp: number
    lat: number
    lon: number
    wind: number
    humidity: number
    sunrise: string
    sunset: string
    rainNextHour: number
    days: {
        date: string
        code: number
        max: number
        min: number
        rain: number
    }[]
}

const CACHE_KEY = 'mono-forecast'
const CACHE_DURATION = 30 * 60 * 1000

const DAYS = ['ΚΥΡ', 'ΔΕΥ', 'ΤΡΙ', 'ΤΕΤ', 'ΠΕΜ', 'ΠΑΡ', 'ΣΑΒ']

const FACTS: [string, string][] = [
    ['🍯', 'Το μέλι δεν χαλάει ποτέ — βρέθηκε βρώσιμο μέλι 3.000 ετών σε αιγυπτιακούς τάφους.'],
    ['🐙', 'Το χταπόδι έχει 3 καρδιές και μπλε αίμα· 2 καρδιές στέλνουν αίμα στα βράγχια, 1 στο σώμα.'],
    ['⚛️', 'Το 99,9999999% ενός ατόμου είναι κενός χώρος.'],
    ['🌋', 'Στην Αφροδίτη μια μέρα (243 γήινες) διαρκεί περισσότερο από τον χρόνο της (225).'],
    ['🧠', 'Ο εγκέφαλός σου καταναλώνει ~20 W — όσο μια αμυδρή λάμπα — αλλά διαχειρίζεται ~86 δισ. νευρώνες.'],
    ['🍌', 'Οι μπανάνες είναι ελαφρώς ραδιενεργές λόγω του καλίου-40.'],
    ['🦠', 'Στο σώμα σου υπάρχουν περίπου τόσα βακτήρια όσα και ανθρώπινα κύτταρα.'],
    ['🕳️', 'Μια κουταλιά από άστρο νετρονίων θα ζύγιζε περίπου ένα δισεκατομμύριο τόνους.'],
    ['⚡', 'Ο κεραυνός θερμαίνει τον αέρα γύρω του σε ~30.000 °C, 5 φορές πιο ζεστό από την επιφάνεια του Ήλιου.'],
    ['🌳', 'Ένα δέντρο παίρνει το μεγαλύτερο μέρος της μάζας του από τον αέρα (CO₂), όχι από το χώμα.'],
    ['🧊', 'Το ζεστό νερό σε ορισμένες συνθήκες παγώνει πιο γρήγορα από το κρύο (φαινόμενο Μπέμπα).'],
    ['🌠', 'Το φως χρειάζεται ~8 λεπτά από τον Ήλιο ως εμάς, αλλά ~100.000 χρόνια για να βγει από τον πυρήνα του.'],
    ['🧬', 'Το DNA ενός κυττάρου, ξετυλιγμένο, θα είχε μήκος περίπου 2 μέτρα.'],
    ['🪐', 'Στον Κρόνο θα έπλεε μια μπάλα — η μέση πυκνότητά του είναι μικρότερη από του νερού.'],
]

export function mono(sync: Sync, lastWeather?: LastWeather): void {
    try {
        document.documentElement.classList.add('mono')
        kickerAndChips(sync)
        weatherCard()
        factsCard()
        forecast(sync, lastWeather)
    } catch (error) {
        console.warn('MONO widgets failed', error)
    }
}

// Clock

function kickerAndChips(sync: Sync): void {
    const time = document.getElementById('time')
    const container = document.getElementById('time-container')

    if (!time || !container || document.getElementById('mono-kicker')) {
        return
    }

    const city = (sync.weather?.city || 'Thessaloniki').split(',')[0].trim()
    const kicker = document.createElement('div')
    kicker.id = 'mono-kicker'
    kicker.textContent = `LOCAL TIME · ${city.toUpperCase()}`
    time.insertBefore(kicker, container)

    const chips = document.createElement('div')
    chips.id = 'mono-chips'
    time.appendChild(chips)

    const render = () => {
        const now = new Date()
        const moon = moonPhase(now)
        chips.innerHTML = ''
        chips.appendChild(chip(`W${isoWeek(now)}`))
        chips.appendChild(chip(`${moon.icon} ${moon.name} ${moon.illumination}%`))
    }

    render()
    setInterval(render, 60 * 60 * 1000)
}

function chip(text: string): HTMLSpanElement {
    const span = document.createElement('span')
    span.className = 'mono-chip'
    span.textContent = text
    return span
}

export function isoWeek(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const day = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - day)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

export function moonPhase(date: Date): { name: string; icon: string; illumination: number } {
    const synodic = 29.530588853
    const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14)
    const days = (date.getTime() - knownNewMoon) / 86400000
    const age = ((days % synodic) + synodic) % synodic
    const illumination = Math.round(((1 - Math.cos((2 * Math.PI * age) / synodic)) / 2) * 100)

    const phases: [number, string, string][] = [
        [1.84566, '🌑', 'Νέα Σελήνη'],
        [5.53699, '🌒', 'Αύξων μηνίσκος'],
        [9.22831, '🌓', 'Πρώτο τέταρτο'],
        [12.91963, '🌔', 'Αύξων αμφίκυρτος'],
        [16.61096, '🌕', 'Πανσέληνος'],
        [20.30228, '🌖', 'Φθίνων αμφίκυρτος'],
        [23.99361, '🌗', 'Τελευταίο τέταρτο'],
        [27.68493, '🌘', 'Φθίνων μηνίσκος'],
        [synodic + 1, '🌑', 'Νέα Σελήνη'],
    ]

    const [, icon, name] = phases.find(([limit]) => age < limit) ?? phases[0]
    return { name, icon, illumination }
}

// Weather card

function weatherCard(): void {
    const main = document.getElementById('main')
    const greetings = document.getElementById('greetings')
    const weather = document.getElementById('weather')

    if (!main || !greetings || !weather || document.getElementById('mono-weather')) {
        return
    }

    const card = document.createElement('div')
    card.id = 'mono-weather'
    card.className = 'mono-card'

    const details = document.createElement('p')
    details.id = 'mono-details'

    const days = document.createElement('div')
    days.id = 'mono-days'

    main.insertBefore(card, greetings)
    card.append(greetings, weather, details, days)
}

function factsCard(): void {
    const main = document.getElementById('main')

    if (!main || document.getElementById('mono-facts')) {
        return
    }

    const card = document.createElement('div')
    card.id = 'mono-facts'
    card.className = 'mono-card'

    const inner = document.createElement('div')
    inner.className = 'mono-fact'

    const icon = document.createElement('span')
    icon.className = 'mono-fact-icon'

    const text = document.createElement('p')

    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'mono-fact-next'
    button.textContent = 'Άλλο ένα ↻'

    inner.append(icon, text)
    card.append(inner, button)
    main.appendChild(card)

    let index = Math.floor(Math.random() * FACTS.length)

    const show = () => {
        const [emoji, fact] = FACTS[index]
        icon.textContent = emoji
        text.textContent = fact
    }

    button.addEventListener('click', () => {
        index = (index + 1 + Math.floor(Math.random() * (FACTS.length - 1))) % FACTS.length
        show()
    })

    show()
}

// Forecast (Open-Meteo)

async function forecast(sync: Sync, lastWeather?: LastWeather): Promise<void> {
    const cached = readCache()

    if (cached) {
        renderForecast(cached)
    }

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return
    }

    if (!navigator.onLine) {
        return
    }

    try {
        const coords = await getCoords(sync, lastWeather)

        if (!coords) {
            return
        }

        const fresh = await requestForecast(coords.lat, coords.lon)
        localStorage.setItem(CACHE_KEY, JSON.stringify(fresh))
        renderForecast(fresh)
    } catch (error) {
        console.warn('MONO forecast failed', error)
    }
}

function readCache(): MonoForecast | undefined {
    try {
        const raw = localStorage.getItem(CACHE_KEY)
        return raw ? JSON.parse(raw) as MonoForecast : undefined
    } catch (_) {
        return undefined
    }
}

async function getCoords(sync: Sync, lastWeather?: LastWeather): Promise<{ lat: number; lon: number } | undefined> {
    const approx = lastWeather?.approximation

    if (approx?.lat && approx?.lon) {
        return { lat: approx.lat, lon: approx.lon }
    }

    const city = (sync.weather?.city || 'Thessaloniki').split(',')[0].trim()
    const url = new URL('https://geocoding-api.open-meteo.com/v1/search')
    url.searchParams.set('name', city)
    url.searchParams.set('count', '1')
    url.searchParams.set('language', 'el')

    const response = await fetch(url)
    const json = await response.json()
    const result = json?.results?.[0]

    return result ? { lat: result.latitude, lon: result.longitude } : undefined
}

async function requestForecast(lat: number, lon: number): Promise<MonoForecast> {
    const url = new URL('https://api.open-meteo.com/v1/forecast')
    url.searchParams.set('latitude', lat.toString())
    url.searchParams.set('longitude', lon.toString())
    url.searchParams.set('current', 'wind_speed_10m,relative_humidity_2m')
    url.searchParams.set('minutely_15', 'precipitation')
    url.searchParams.set(
        'daily',
        'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset',
    )
    url.searchParams.set('timezone', 'auto')
    url.searchParams.set('forecast_days', '4')
    url.searchParams.set('forecast_minutely_15', '4')

    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Open-Meteo ${response.status}`)
    }

    const json = await response.json()
    const daily = json.daily
    const rainNextHour = (json.minutely_15?.precipitation ?? []).reduce((a: number, b: number) => a + (b ?? 0), 0)

    return {
        timestamp: Date.now(),
        lat,
        lon,
        wind: Math.round(json.current?.wind_speed_10m ?? 0),
        humidity: Math.round(json.current?.relative_humidity_2m ?? 0),
        sunrise: (daily.sunrise?.[0] ?? '').slice(11, 16),
        sunset: (daily.sunset?.[0] ?? '').slice(11, 16),
        rainNextHour,
        days: daily.time.slice(1, 4).map((date: string, i: number) => ({
            date,
            code: daily.weather_code[i + 1],
            max: Math.round(daily.temperature_2m_max[i + 1]),
            min: Math.round(daily.temperature_2m_min[i + 1]),
            rain: daily.precipitation_probability_max?.[i + 1] ?? 0,
        })),
    }
}

function renderForecast(data: MonoForecast): void {
    const details = document.getElementById('mono-details')
    const days = document.getElementById('mono-days')

    if (!details || !days) {
        return
    }

    const rain = data.rainNextHour > 0.1
        ? `Βροχή την επόμενη ώρα (${data.rainNextHour.toFixed(1)} mm)`
        : 'Χωρίς βροχή την επόμενη ώρα'
    details.textContent = `${rain} · 💨 ${data.wind} km/h · 💧 ${data.humidity}% · ☀️ ${data.sunrise}–${data.sunset}`

    days.innerHTML = ''

    for (const day of data.days) {
        const el = document.createElement('div')
        el.className = 'mono-day'

        const name = document.createElement('span')
        name.className = 'mono-day-name'
        name.textContent = DAYS[new Date(`${day.date}T12:00:00`).getDay()]

        const icon = document.createElement('span')
        icon.className = 'mono-day-icon'
        icon.textContent = weatherEmoji(day.code)

        const temps = document.createElement('span')
        temps.className = 'mono-day-temps'
        temps.textContent = `${day.max}°/${day.min}°`

        const rainChance = document.createElement('span')
        rainChance.className = 'mono-day-rain'
        rainChance.textContent = `${day.rain}% 💧`

        el.append(name, icon, temps, rainChance)
        days.appendChild(el)
    }
}

export function weatherEmoji(code: number): string {
    if (code === 0) return '☀️'
    if (code <= 2) return '🌤️'
    if (code === 3) return '☁️'
    if (code <= 48) return '🌫️'
    if (code <= 57) return '🌦️'
    if (code <= 67) return '🌧️'
    if (code <= 77) return '🌨️'
    if (code <= 82) return '🌧️'
    if (code <= 86) return '🌨️'
    return '⛈️'
}
