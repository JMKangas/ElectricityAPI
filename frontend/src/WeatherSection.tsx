import { useState } from 'react'
import type { Forecast } from './types/weather'

type Props = {
  weatherData: Forecast[]
  loading: boolean
  error: string | null
  fetchWeatherForecast: () => void
}

const WeatherSection = ({
  weatherData,
  loading,
  error,
  fetchWeatherForecast,
}: Props) => {
  const [useCelsius, setUseCelsius] = useState(true)

  return (
    <section className="weather-section" aria-labelledby="weather-heading">
      <div className="card">
        {/* Header */}
        <div className="section-header">
          <h2 id="weather-heading" className="section-title">
            Weather Forecast
          </h2>

          <div className="header-actions">
            {/* Temperature toggle */}
            <fieldset
              className="toggle-switch"
              aria-label="Temperature unit selection"
            >
              <legend className="visually-hidden">Temperature unit</legend>

              <button
                type="button"
                className={`toggle-option ${useCelsius ? 'active' : ''}`}
                aria-pressed={useCelsius}
                onClick={() => setUseCelsius(true)}
              >
                <span aria-hidden="true">°C</span>
                <span className="visually-hidden">Celsius</span>
              </button>

              <button
                type="button"
                className={`toggle-option ${!useCelsius ? 'active' : ''}`}
                aria-pressed={!useCelsius}
                onClick={() => setUseCelsius(false)}
              >
                <span aria-hidden="true">°F</span>
                <span className="visually-hidden">Fahrenheit</span>
              </button>
            </fieldset>

            {/* Refresh */}
            <button
              type="button"
              className="refresh-button"
              onClick={fetchWeatherForecast}
              disabled={loading}
              aria-label={
                loading
                  ? 'Loading weather forecast'
                  : 'Refresh weather forecast'
              }
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

        {/* Error */}
        {error && (
          <div className="error-message" role="alert" aria-live="polite">
            <span>{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading && weatherData.length === 0 && (
          <div
            className="loading-skeleton"
            role="status"
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

        {/* Grid */}
        {weatherData.length > 0 && (
          <div className="weather-grid">
            {weatherData.map((forecast) => (
              <article
                key={forecast.date}
                className="weather-card"
                aria-label={`Weather for ${forecast.date}`}
              >
                <h3 className="weather-date">
                  <time dateTime={forecast.date}>{forecast.date}</time>
                </h3>

                <p className="weather-summary">{forecast.summary}</p>

                <div className="weather-temps">
                  <span className="temp-value">
                    {useCelsius ? forecast.temperatureC : forecast.temperatureF}
                    °
                  </span>
                  <span className="temp-unit">{useCelsius ? 'C' : 'F'}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default WeatherSection
