// src/hooks/useWeather.ts
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Forecast } from '../types/weather'

export function useWeather(initialId: string, initialCity: string) {
    const [weatherData, setWeatherData] = useState<Forecast[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const controllerRef = useRef<AbortController | null>(null)
    const idRef = useRef(initialId)
    const cityRef = useRef(initialCity)

    const fetchWeatherForecast = useCallback(async () => {
        controllerRef.current?.abort()
        const controller = new AbortController()
        controllerRef.current = controller

        setLoading(true)
        setError(null)

        try {
            const url = `/api/weather?id=${encodeURIComponent(idRef.current)}&city=${encodeURIComponent(cityRef.current)}`
            const res = await fetch(url, { signal: controller.signal })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const data = await res.json()

            //const mapped: Forecast[] = Array.isArray(data.forecast)
            //    ? data.forecast.map((f: any) => ({
            //        date: f.time ?? f.date ?? new Date().toISOString(),
            //        summary: f.summary ?? `Wind ${f.windSpeed ?? 'N/A'} m/s, Humidity ${f.humidity ?? 'N/A'}%`,
            //        temperatureC: typeof f.temperature === 'number' ? f.temperature : (f.temperatureC ?? 0),
            //        temperatureF: typeof f.temperature === 'number'
            //            ? Math.round((f.temperature * 1.8 + 32) * 10) / 10
            //            : (f.temperatureF ?? Math.round(((f.temperatureC ?? 0) * 1.8 + 32) * 10) / 10),
            //    }))
            //    : []
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

                    // ✅ Add these two fields
                    wind: f.windSpeed ?? 0,
                    humidity: f.humidity ?? 0,
                }))
                : []

            setWeatherData(mapped)
        } catch (err: any) {
            if (err?.name === 'AbortError') return
            setError(err instanceof Error ? err.message : 'Failed to fetch weather')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [])

    // optional: allow changing id/city from caller
    const setLocation = useCallback((id: string, city: string) => {
        idRef.current = id
        cityRef.current = city
    }, [])

    useEffect(() => {
        fetchWeatherForecast()
        return () => controllerRef.current?.abort()
    }, [fetchWeatherForecast])

    return { weatherData, loading, error, fetchWeatherForecast, setLocation }
}
