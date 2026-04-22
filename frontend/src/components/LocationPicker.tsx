import React, { useEffect, useRef, useState } from 'react'
import type { WeatherLocation } from '../types/location'

export type Location = WeatherLocation

type Props = {
    locations: Location[]
    value?: string
    placeholder?: string
    debounceMs?: number
    maxResults?: number
    onChange?: (value: string) => void
    onSelect: (loc: Location) => void
    id?: string
}

export default function LocationPicker({
    locations,
    value = '',
    placeholder = 'Type a city...',
    debounceMs = 1000,
    maxResults = 5,
    onChange,
    onSelect,
    id = 'city-input',
}: Props) {
    const [input, setInput] = useState(value)
    const [suggestions, setSuggestions] = useState<Location[]>([])
    const [open, setOpen] = useState(false)
    const [highlight, setHighlight] = useState(-1)

    const timerRef = useRef<number | null>(null)
    const listRef = useRef<HTMLUListElement | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        setInput(value)
    }, [value])

    useEffect(() => {
        if (!input) {
            setSuggestions([])
            setOpen(false)
            setHighlight(-1)
            return
        }

        if (timerRef.current) {
            window.clearTimeout(timerRef.current)
            timerRef.current = null
        }

        timerRef.current = window.setTimeout(() => {
            const q = input.trim().toLowerCase()
            if (!q) {
                setSuggestions([])
                setOpen(false)
                setHighlight(-1)
                return
            }

            const matches = locations
                .map((loc) => ({ loc, idx: loc.name.toLowerCase().indexOf(q) }))
                .filter((x) => x.idx >= 0)
                .sort((a, b) => (a.idx !== b.idx ? a.idx - b.idx : a.loc.name.localeCompare(b.loc.name)))
                .slice(0, maxResults)
                .map((x) => x.loc)

            setSuggestions(matches)
            setOpen(matches.length > 0)
            setHighlight(-1)
        }, debounceMs)

        return () => {
            if (timerRef.current) {
                window.clearTimeout(timerRef.current)
                timerRef.current = null
            }
        }
    }, [input, locations, debounceMs, maxResults])

    const handleInput = (v: string) => {
        setInput(v)
        onChange?.(v)
        setOpen(true)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!open) return
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setHighlight((h) => Math.min(h + 1, suggestions.length - 1))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setHighlight((h) => Math.max(h - 1, 0))
        } else if (e.key === 'Enter') {
            e.preventDefault()
            const sel = highlight >= 0 ? suggestions[highlight] : suggestions[0]
            if (sel) selectItem(sel)
        } else if (e.key === 'Escape') {
            setOpen(false)
            setHighlight(-1)
        }
    }

    const selectItem = (loc: Location) => {
        setInput(loc.name)
        onChange?.(loc.name)
        setOpen(false)
        setHighlight(-1)
        onSelect(loc)
        inputRef.current?.focus()
    }

    useEffect(() => {
        const onDoc = (ev: MouseEvent) => {
            if (!inputRef.current) return
            if (ev.target instanceof Node && (inputRef.current.contains(ev.target) || listRef.current?.contains(ev.target))) return
            setOpen(false)
            setHighlight(-1)
        }
        document.addEventListener('mousedown', onDoc)
        return () => document.removeEventListener('mousedown', onDoc)
    }, [])

    return (
        <div className="location-picker" style={{ position: 'relative' }}>
            <label htmlFor={id} className="visually-hidden">City</label>
            <input
                id={id}
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => handleInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                aria-autocomplete="list"
                aria-controls={`${id}-listbox`}
                aria-expanded={open}
                aria-activedescendant={highlight >= 0 ? `${id}-option-${highlight}` : undefined}
                aria-haspopup="listbox"
                autoComplete="off"
            />

            {open && suggestions.length > 0 && (
                <ul
                    id={`${id}-listbox`}
                    ref={listRef}
                    role="listbox"
                    style={{
                        position: 'absolute',
                        zIndex: 40,
                        background: 'white',
                        border: '1px solid #ddd',
                        width: '100%',
                        marginTop: 4,
                        listStyle: 'none',
                        padding: 0,
                        maxHeight: 240,
                        overflowY: 'auto',
                    }}
                >
                    {suggestions.map((s, i) => (
                        <li
                            id={`${id}-option-${i}`}
                            key={s.id}
                            role="option"
                            aria-selected={highlight === i}
                            onMouseDown={(ev) => {
                                ev.preventDefault()
                                selectItem(s)
                            }}
                            onMouseEnter={() => setHighlight(i)}
                            style={{
                                padding: '8px 12px',
                                background: highlight === i ? '#eef' : 'transparent',
                                cursor: 'pointer',
                            }}
                        >
                            {s.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
