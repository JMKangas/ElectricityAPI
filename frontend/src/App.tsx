import { useState, useEffect, useRef, useCallback } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import './App.css'
import EChartsReact from 'echarts-for-react'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
    GridComponent,
    TooltipComponent,
    LegendComponent,
} from 'echarts/components'
import { SVGRenderer } from 'echarts/renderers'
import WeatherSection from './components/WeatherSection'
import type { Forecast } from './types/weather'

echarts.use([
    LineChart,
    GridComponent,
    TooltipComponent,
    LegendComponent,
    SVGRenderer,
])

interface SpotPrice {
    aikaleima_suomi: string
    aikaleima_utc: string
    hinta: number
}

type WeatherCityDto = {
    id: string
    name: string
}

const DEFAULT_WEATHER_ID = '3f2c1c8e-9b1d-4b0e-8a9f-2c1d4f9a7b33'
const DEFAULT_CITY = 'Helsinki'

function App() {
    // ELECTRICITY (no cancellation)
    const [spotData, setSpotData] = useState<SpotPrice[]>([])
    const [spotLoading, setSpotLoading] = useState(false)
    const [spotError, setSpotError] = useState<string | null>(null)
    const [useHourly, setUseHourly] = useState(false)

    // WEATHER
    const [weatherData, setWeatherData] = useState<Forecast[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Selected location
    const [selectedId, setSelectedId] = useState<string>(DEFAULT_WEATHER_ID)
    const [selectedCity, setSelectedCity] = useState<string>(DEFAULT_CITY)

    // Locations + suggestions UI
    const [locations, setLocations] = useState<WeatherCityDto[]>([])

    // Controllers
    const weatherControllerRef = useRef<AbortController | null>(null)
    const locationsControllerRef = useRef<AbortController | null>(null)

    // --- Spot prices (unchanged, no cancellation) ---
    const fetchSpotPrices = useCallback(async () => {
        setSpotLoading(true)
        setSpotError(null)

        try {
            const now = new Date()
            const year = now.getFullYear()
            const month = String(now.getMonth() + 1).padStart(2, '0')
            const day = String(now.getDate()).padStart(2, '0')
            const aikaraja = `${year}-${month}-${day}`

            const response = await fetch(
                `/api/spotprice/cheap?vartit=96&aikaraja=${aikaraja}`
            )

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data: SpotPrice[] = await response.json()
            setSpotData(data)
        } catch (err) {
            setSpotError(
                err instanceof Error ? err.message : 'Failed to fetch spot prices'
            )
            console.error('Error fetching spot prices:', err)
        } finally {
            setSpotLoading(false)
        }
    }, [])

    // --- Fetch all locations (with cancellation) ---
    const fetchAllLocations = useCallback(async () => {
        locationsControllerRef.current?.abort()
        const controller = new AbortController()
        locationsControllerRef.current = controller

        try {
            const res = await fetch('/api/weather_locations', { signal: controller.signal })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const data = await res.json()

            // Normalize keys (backend might return PascalCase)
            const normalized: WeatherCityDto[] = (data as any[]).map((d) => ({
                id: (d.id ?? d.Id ?? '').toString(),
                name: d.name ?? d.Name ?? '',
            }))

            setLocations(normalized)
        } catch (err: any) {
            if (err?.name === 'AbortError') return
            console.error('Failed to fetch locations:', err)
        }
    }, [])

    // --- Fetch weather (cancellable) ---
    const fetchWeatherForecast = useCallback(
        async (idParam?: string, cityParam?: string) => {
            // allow explicit params (used on selection) or fall back to state
            const id = idParam ?? selectedId
            const city = cityParam ?? selectedCity

            weatherControllerRef.current?.abort()
            const controller = new AbortController()
            weatherControllerRef.current = controller

            setLoading(true)
            setError(null)

            try {
                const url = `/api/weather?id=${encodeURIComponent(id)}&city=${encodeURIComponent(city)}`
                const response = await fetch(url, { signal: controller.signal })

                if (!response.ok) {
                    let msg = `HTTP error! status: ${response.status}`
                    try {
                        const body = await response.json()
                        if (body?.message) msg = body.message
                    } catch { }
                    throw new Error(msg)
                }
                console.log(city)
                const data = await response.json()

                const mapped: Forecast[] = Array.isArray(data.forecast)
                    ? data.forecast.map((f: any) => ({
                        date: f.time ?? f.date ?? new Date().toISOString(),

                        summary:
                            f.summary ??
                            `Wind ${f.windSpeed ?? 'N/A'} m/s, Humidity ${f.humidity ?? 'N/A'}%`,

                        temperatureC:
                            typeof f.temperature === 'number'
                                ? f.temperature
                                : f.temperatureC ?? 0,

                        temperatureF:
                            typeof f.temperature === 'number'
                                ? Math.round((f.temperature * 1.8 + 32) * 10) / 10
                                : f.temperatureF ??
                                Math.round(((f.temperatureC ?? 0) * 1.8 + 32) * 10) / 10,

                        // ⭐ REQUIRED FIELDS
                        wind: f.windSpeed ?? 0,
                        humidity: f.humidity ?? 0,
                    }))
                    : []

                setWeatherData(mapped)
            } catch (err: any) {
                if (err?.name === 'AbortError') return
                setError(err instanceof Error ? err.message : 'Failed to fetch weather data')
                console.error('Error fetching weather forecast:', err)
            } finally {
                setLoading(false)
            }
        },
        [selectedId, selectedCity]
    )

    // --- Initial load ---
    useEffect(() => {
        fetchAllLocations()
        fetchSpotPrices()
        fetchWeatherForecast(DEFAULT_WEATHER_ID, DEFAULT_CITY)

        return () => {
            weatherControllerRef.current?.abort()
            locationsControllerRef.current?.abort()
        }
    }, [])   // <-- empty deps, runs only once


    // --- Utilities ---
    const getDisplayedSpotData = () => {
        if (!useHourly) return spotData

        const hourly: SpotPrice[] = []
        for (let i = 0; i < spotData.length; i += 4) {
            const slice = spotData.slice(i, i + 4)
            const avgPrice = slice.reduce((acc, x) => acc + x.hinta, 0) / slice.length

            hourly.push({
                aikaleima_suomi: slice[0].aikaleima_suomi,
                aikaleima_utc: slice[0].aikaleima_utc,
                hinta: Number(avgPrice.toFixed(3)),
            })
        }
        return hourly
    }

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        })

  const utc2 = new Date()

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <section className="spot-section" aria-labelledby="spot-heading">
          <div className="card">
            <div className="section-header">
              <h2 id="spot-heading" className="section-title">
                Electricity Spot Prices
              </h2>
              <fieldset
                className="toggle-switch"
                aria-label="Spot resolution selection"
              >
                <legend className="visually-hidden">Time resolution</legend>
                <button
                  className={`toggle-option ${!useHourly ? 'active' : ''}`}
                  onClick={() => setUseHourly(false)}
                  aria-pressed={!useHourly}
                  type="button"
                >
                  15 min
                </button>
                <button
                  className={`toggle-option ${useHourly ? 'active' : ''}`}
                  onClick={() => setUseHourly(true)}
                  aria-pressed={useHourly}
                  type="button"
                >
                  Hourly
                </button>
              </fieldset>

              <button
                className="refresh-button"
                onClick={fetchSpotPrices}
                disabled={spotLoading}
              >
                {spotLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
            <h4 id="spot-heading">{utc2.toDateString()}</h4>

            {spotError && <div className="error-message">{spotError}</div>}

            {spotLoading && spotData.length === 0 && (
              <div className="loading-skeleton">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="skeleton-row" />
                ))}
              </div>
            )}
            {spotData.length > 0 && (
              <div style={{ width: '100%', height: '300px' }}>
                <EChartsReact
                  echarts={echarts}
                  option={{
                    tooltip: {
                      trigger: 'axis',
                      formatter: (params: any) => {
                        const item = params[0]
                        return `
              <strong>${item.axisValue}</strong><br/>
              Spot price: ${item.data} c/kWh`
                      },
                    },
                    xAxis: {
                      type: 'category',
                      data: getDisplayedSpotData().map(
                        (x) => x.aikaleima_suomi
                      ),
                      axisLabel: {
                        fontSize: 10,
                        formatter: (value: string) => value.substring(11, 16),
                      },
                    },
                    yAxis: {
                      type: 'value',
                      axisLabel: { formatter: '{value} c/kWh' },
                    },
                    series: [
                      {
                        data: getDisplayedSpotData().map((x) => x.hinta),
                        type: 'bar',
                        smooth: true,
                        lineStyle: {
                          width: 2,
                          color: '#ff7300',
                        },
                        showSymbol: false,

                        // HIGHLIGHT CURRENT TIME
                        markLine: {
                          symbol: 'none',
                          lineStyle: {
                            color: '#00ffff',
                            width: 2,
                          },
                          label: {
                            show: true,
                            formatter: (params: any) => {
                              return params.value.substring(11, 16)
                            },
                          },
                          data: (function () {
                            const mins = utc2.getMinutes()
                            const rounded = Math.floor(mins / 15) * 15
                            utc2.setMinutes(rounded)
                            utc2.setSeconds(0)
                            utc2.setMilliseconds(0)

                            const pad = (n: number) =>
                              String(n).padStart(2, '0')

                            const currentSlot =
                              `${utc2.getFullYear()}-${pad(
                                utc2.getMonth() + 1
                              )}-${pad(utc2.getDate())}T` +
                              `${pad(utc2.getHours())}:${pad(
                                utc2.getMinutes()
                              )}`

                            const displayed = getDisplayedSpotData()
                            const categories = displayed.map(
                              (x) => x.aikaleima_suomi
                            )

                            const highlightIndex =
                              categories.indexOf(currentSlot)

                            return highlightIndex >= 0
                              ? [{ xAxis: categories[highlightIndex] }]
                              : []
                          })(),
                        },
                      },
                    ],
                  }}
                  opts={{ renderer: 'svg' }}
                  style={{ height: '100%', width: '100%' }}
                />
              </div>
            )}
                  </div>

        </section>
              <WeatherSection
                  weatherData={weatherData}
                  loading={loading}
                  error={error}
                  fetchWeatherForecast={() => fetchWeatherForecast(selectedId, selectedCity)}
                  locations={locations}
                  onSelectLocation={(loc) => {
                      console.log("Selected from picker:", loc)
                      setSelectedId(loc.id)
                      setSelectedCity(loc.name)
                      fetchWeatherForecast(loc.id, loc.name)
                  }}
              />

      </main>
      <Footer />
    </div>
  )
}

export default App
