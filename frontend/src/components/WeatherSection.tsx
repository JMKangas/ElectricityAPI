import { useState } from 'react'
import type { Forecast } from '../types/weather'
import LocationPicker from './LocationPicker'
import type { Location } from './LocationPicker'
import TimeFormatter from './TimeFormatter'
import MetricBox from './MetricBox'

type Props = {
  weatherData: Forecast[]
  loading: boolean
  error: string | null
  fetchWeatherForecast: () => void
  locations: Location[]
  onSelectLocation: (loc: Location) => void
}

const WeatherSection = ({
  weatherData,
  loading,
  error,
  fetchWeatherForecast,
  locations,
  onSelectLocation,
}: Props) => {
  const [useCelsius, setUseCelsius] = useState(true)

  return (
    <section className="weather-section" aria-labelledby="weather-heading">
      <div className="card">
        {/* Header */}
        <div className="section-header">
          {/* Title + LocationPicker */}
          <div className="header-left">
            <h2 id="weather-heading" className="section-title">
              Weather Forecast
            </h2>

            <LocationPicker
              id="weather-city-input"
              locations={locations}
              onSelect={onSelectLocation}
              placeholder="Type a city..."
              debounceMs={400}
              maxResults={6}
            />
          </div>

          <div className="header-actions">
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
                className={`refresh-icon ${loading ? 'spinning' : 'idle'}`}
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
        {weatherData.length > 0 &&
          (() => {
            const forecast = weatherData[0]

            return (
              <div className="weather-grid">
                <article className="weather-card">
                  <MetricBox
                    label="Time"
                    value={<TimeFormatter iso={forecast.date} />}
                  />
                </article>

                <article className="weather-card">
                  <MetricBox label="Wind" value={`${forecast.wind} m/s`} />
                </article>

                <article className="weather-card">
                  <MetricBox label="Humidity" value={`${forecast.humidity}%`} />
                </article>

                <article className="weather-card">
                  <MetricBox
                    label="Temp"
                    value={`${
                      useCelsius ? forecast.temperatureC : forecast.temperatureF
                    }°`}
                  />
                </article>
              </div>
            )
          })()}
      </div>
    </section>
  )
}

export default WeatherSection
