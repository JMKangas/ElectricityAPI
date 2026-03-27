import { useState, useEffect } from 'react'
//import aspireLogo from '/Aspire.png'
import jkLogo from '/jk-logo.png'
import './App.css'
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts'

interface WeatherForecast {
  date: string
  temperatureC: number
  temperatureF: number
  summary: string
}

interface SpotPrice {
    aikaleima_suomi: string;
    aikaleima_utc: string;
    hinta: number;
}

function App() {
    const [spotData, setSpotData] = useState<SpotPrice[]>([]);
    const [spotLoading, setSpotLoading] = useState(false);
    const [spotError, setSpotError] = useState<string | null>(null);
    const [useHourly, setUseHourly] = useState(false); // <--- 15min vs hourly toggle


    const [weatherData, setWeatherData] = useState<WeatherForecast[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [useCelsius, setUseCelsius] = useState(false)

    //ELECTRICITY
    const fetchSpotPrices = async () => {
        setSpotLoading(true);
        setSpotError(null);

        try {
            const response = await fetch('/spotprice/cheap?vartit=96&aikaraja=2026-03-25');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: SpotPrice[] = await response.json();
            setSpotData(data);
        } catch (err) {
            setSpotError(err instanceof Error ? err.message : 'Failed to fetch spot prices');
            console.error('Error fetching spot prices:', err);
        } finally {
            setSpotLoading(false);
        }
    };





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
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data')
      console.error('Error fetching weather forecast:', err)
    } finally {
      setLoading(false)
    }
  }

    useEffect(() => {
        fetchSpotPrices();
        fetchWeatherForecast();
    }, [])

    //Electricity data
    const getDisplayedSpotData = () => {
        if (!useHourly) return spotData;

        // Hourly: group every 4 x 15min entries
        const hourly: SpotPrice[] = [];

        for (let i = 0; i < spotData.length; i += 4) {
            const slice = spotData.slice(i, i + 4);
            const avgPrice =
                slice.reduce((acc, x) => acc + x.hinta, 0) / slice.length;

            hourly.push({
                aikaleima_suomi: slice[0].aikaleima_suomi,
                aikaleima_utc: slice[0].aikaleima_utc,
                hinta: Number(avgPrice.toFixed(3))
            });
        }

        return hourly;
    };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <a 
          href="https://aspire.dev" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Visit Aspire website (opens in new tab)"
          className="logo-link"
              >
                  <img src={jkLogo} className="logo" alt="Aspire logo" />
        </a>
        <h1 className="app-title">Fingrid electricity app</h1>
        <p className="app-subtitle">Modern minimal api</p>
      </header>

          <main className="main-content">
              <section className="spot-section" aria-labelledby="spot-heading">
                  <div className="card">
                      <div className="section-header">
                          <h2 id="spot-heading" className="section-title">Electricity Spot Prices</h2>

                          <fieldset className="toggle-switch" aria-label="Spot resolution selection">
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

                      {spotError && <div className="error-message">{spotError}</div>}

                      {spotLoading && spotData.length === 0 && (
                          <div className="loading-skeleton">
                              {[...Array(5)].map((_, i) => (
                                  <div key={i} className="skeleton-row" />
                              ))}
                          </div>
                      )}
                      {/*{spotData.length > 0 && (*/}
                      {/*    <ResponsiveContainer width="100%" height={300}>*/}
                      {/*        <LineChart data={getDisplayedSpotData()}>*/}
                      {/*            <CartesianGrid strokeDasharray="3 3" />*/}
                      {/*            <XAxis dataKey="aikaleima_suomi" tick={{ fontSize: 12 }} />*/}
                      {/*            <YAxis tick={{ fontSize: 12 }} />*/}
                      {/*            <Tooltip*/}
                      {/*                formatter={(value) => `${value} c/kWh`}*/}
                      {/*                labelFormatter={(label) => `Time: ${label}`}*/}
                      {/*            />*/}
                      {/*            <Line*/}
                      {/*                type="monotone"*/}
                      {/*                dataKey="hinta"*/}
                      {/*                stroke="#ff7300"*/}
                      {/*                strokeWidth={2}*/}
                      {/*                dot={false}*/}
                      {/*            />*/}
                      {/*        </LineChart>*/}
                      {/*    </ResponsiveContainer>*/}
                      {/*)}*/}
                      {/*{spotData.length > 0 && (*/}
                      {/*    <div className="weather-grid">*/}
                      {/*        {getDisplayedSpotData().map((item, index) => (*/}
                      {/*            <article key={index} className="weather-card">*/}
                      {/*                <h3 className="weather-date">*/}
                      {/*                    <time>{item.aikaleima_suomi}</time>*/}
                      {/*                </h3>*/}
                      {/*                <p className="weather-summary">Spot Price</p>*/}
                      {/*                <div className="weather-temps">*/}
                      {/*                    <div className="temp-group">*/}
                      {/*                        <span className="temp-value">{item.hinta} c/kWh</span>*/}
                      {/*                    </div>*/}
                      {/*                </div>*/}
                      {/*            </article>*/}
                      {/*        ))}*/}
                      {/*    </div>*/}
                      {/*)}*/}
                  </div>
              </section>





          
        <section className="weather-section" aria-labelledby="weather-heading">
          <div className="card">
            <div className="section-header">
              <h2 id="weather-heading" className="section-title">Weather Forecast</h2>
              <div className="header-actions">
                <fieldset className="toggle-switch" aria-label="Temperature unit selection">
                  <legend className="visually-hidden">Temperature unit</legend>
                  <button 
                    className={`toggle-option ${!useCelsius ? 'active' : ''}`}
                    onClick={() => setUseCelsius(false)}
                    aria-pressed={!useCelsius}
                    type="button"
                  >
                    <span aria-hidden="true">°F</span>
                    <span className="visually-hidden">Fahrenheit</span>
                  </button>
                  <button 
                    className={`toggle-option ${useCelsius ? 'active' : ''}`}
                    onClick={() => setUseCelsius(true)}
                    aria-pressed={useCelsius}
                    type="button"
                  >
                    <span aria-hidden="true">°C</span>
                    <span className="visually-hidden">Celsius</span>
                  </button>
                </fieldset>
                <button 
                  className="refresh-button"
                  onClick={fetchWeatherForecast} 
                  disabled={loading}
                  aria-label={loading ? 'Loading weather forecast' : 'Refresh weather forecast'}
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
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                  </svg>
                  <span>{loading ? 'Loading...' : 'Refresh'}</span>
                </button>
              </div>
            </div>
            
            {error && (
              <div className="error-message" role="alert" aria-live="polite">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            {loading && weatherData.length === 0 && (
              <div className="loading-skeleton" role="status" aria-live="polite" aria-label="Loading weather data">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="skeleton-row" aria-hidden="true" />
                ))}
                <span className="visually-hidden">Loading weather forecast data...</span>
              </div>
            )}
            
            {weatherData.length > 0 && (
              <div className="weather-grid">
                {weatherData.map((forecast, index) => (
                  <article key={index} className="weather-card" aria-label={`Weather for ${formatDate(forecast.date)}`}>
                    <h3 className="weather-date">
                      <time dateTime={forecast.date}>{formatDate(forecast.date)}</time>
                    </h3>
                    <p className="weather-summary">{forecast.summary}</p>
                    <div className="weather-temps" aria-label={`Temperature: ${useCelsius ? forecast.temperatureC : forecast.temperatureF} degrees ${useCelsius ? 'Celsius' : 'Fahrenheit'}`}>
                      <div className="temp-group">
                        <span className="temp-value" aria-hidden="true">
                          {useCelsius ? forecast.temperatureC : forecast.temperatureF}°
                        </span>
                        <span className="temp-unit" aria-hidden="true">{useCelsius ? 'Celsius' : 'Fahrenheit'}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <nav aria-label="Footer navigation">
          <a href="https://aspire.dev" target="_blank" rel="noopener noreferrer">
            Learn more about Aspire<span className="visually-hidden"> (opens in new tab)</span>
          </a>
          <a 
            href="https://github.com/dotnet/aspire" 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-link"
            aria-label="View Aspire on GitHub (opens in new tab)"
          >
            <img src="/github.svg" alt="" width="24" height="24" aria-hidden="true" />
            <span className="visually-hidden">GitHub</span>
          </a>
        </nav>
      </footer>
    </div>
  )
}

export default App
