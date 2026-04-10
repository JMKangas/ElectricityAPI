import { useState, useEffect } from 'react'
//import aspireLogo from '/Aspire.png'
import jkLogo from '/jk-logo.png'
import Header from './Header'
import Footer from './Footer'
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

echarts.use([
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  SVGRenderer,
])

interface WeatherForecast {
  date: string
  temperatureC: number
  temperatureF: number
  summary: string
}

interface SpotPrice {
  aikaleima_suomi: string
  aikaleima_utc: string
  hinta: number
}

function App() {
  const [spotData, setSpotData] = useState<SpotPrice[]>([])
  const [spotLoading, setSpotLoading] = useState(false)
  const [spotError, setSpotError] = useState<string | null>(null)
  const [useHourly, setUseHourly] = useState(false)

  const [weatherData, setWeatherData] = useState<WeatherForecast[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useCelsius, setUseCelsius] = useState(false)

  //ELECTRICITY
  const fetchSpotPrices = async () => {
    setSpotLoading(true)
    setSpotError(null)

    try {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const aikaraja = `${year}-${month}-${day}`

      const response = await fetch(
        `/spotprice/cheap?vartit=96&aikaraja=${aikaraja}`
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
  }

  //FORECAST
  const fetchWeatherForecast = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/weatherforecast')

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: WeatherForecast[] = await response.json()
      setWeatherData(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch weather data'
      )
      console.error('Error fetching weather forecast:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSpotPrices()
    fetchWeatherForecast()
  }, [])

  //Electricity data
  const getDisplayedSpotData = () => {
    if (!useHourly) return spotData

    // Hourly: group every 4 x 15min entries
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

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

        <section className="weather-section" aria-labelledby="weather-heading">
          <div className="card">
            <div className="section-header">
              <h2 id="weather-heading" className="section-title">
                Weather Forecast
              </h2>
              <div className="header-actions">
                <fieldset
                  className="toggle-switch"
                  aria-label="Temperature unit selection"
                >
                  <legend className="visually-hidden">Temperature unit</legend>
                  <button
                    className={`toggle-option ${useCelsius ? 'active' : ''}`}
                    onClick={() => setUseCelsius(true)}
                    aria-pressed={useCelsius}
                    type="button"
                  >
                    <span aria-hidden="true">°C</span>
                    <span className="visually-hidden">Celsius</span>
                  </button>
                  <button
                    className={`toggle-option ${!useCelsius ? 'active' : ''}`}
                    onClick={() => setUseCelsius(false)}
                    aria-pressed={!useCelsius}
                    type="button"
                  >
                    <span aria-hidden="true">°F</span>
                    <span className="visually-hidden">Fahrenheit</span>
                  </button>
                </fieldset>
                <button
                  className="refresh-button"
                  onClick={fetchWeatherForecast}
                  disabled={loading}
                  aria-label={
                    loading
                      ? 'Loading weather forecast'
                      : 'Refresh weather forecast'
                  }
                  type="button"
                >
                  <svg
                    className={`refresh-icon ${loading ? 'spinning' : ''}`}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                  </svg>
                  <span>{loading ? 'Loading...' : 'Refresh'}</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="error-message" role="alert" aria-live="polite">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {loading && weatherData.length === 0 && (
              <div
                className="loading-skeleton"
                role="status"
                aria-live="polite"
                aria-label="Loading weather data"
              >
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="skeleton-row" aria-hidden="true" />
                ))}
                <span className="visually-hidden">
                  Loading weather forecast data...
                </span>
              </div>
            )}

            {weatherData.length > 0 && (
              <div className="weather-grid">
                {weatherData.map((forecast, index) => (
                  <article
                    key={index}
                    className="weather-card"
                    aria-label={`Weather for ${formatDate(forecast.date)}`}
                  >
                    <h3 className="weather-date">
                      <time dateTime={forecast.date}>
                        {formatDate(forecast.date)}
                      </time>
                    </h3>
                    <p className="weather-summary">{forecast.summary}</p>
                    <div
                      className="weather-temps"
                      aria-label={`Temperature: ${
                        useCelsius
                          ? forecast.temperatureC
                          : forecast.temperatureF
                      } degrees ${useCelsius ? 'Celsius' : 'Fahrenheit'}`}
                    >
                      <div className="temp-group">
                        <span className="temp-value" aria-hidden="true">
                          {useCelsius
                            ? forecast.temperatureC
                            : forecast.temperatureF}
                          °
                        </span>
                        <span className="temp-unit" aria-hidden="true">
                          {useCelsius ? 'Celsius' : 'Fahrenheit'}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      {/* <footer className="app-footer">
        <nav aria-label="Footer navigation">
          <img src={jkLogo} className="logo" alt="Aspire logo" />
          <a
            href="https://github.com/JMKangas/ElectricityAPI"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more about this project
            <span className="visually-hidden"> (opens in new tab)</span>
          </a>
          <a
            href="https://github.com/JMKangas/ElectricityAPI"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
            aria-label="View this project on GitHub (opens in new tab)"
          >
            <img
              src="/github.svg"
              alt=""
              width="24"
              height="24"
              aria-hidden="true"
            />
            <span className="visually-hidden">GitHub</span>
          </a>
        </nav>
      </footer> */}
    </div>
  )
}

export default App
