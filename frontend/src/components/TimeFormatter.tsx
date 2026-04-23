type Props = {
    iso: string
    format?: Intl.DateTimeFormatOptions
}

export default function TimeFormatter({ iso, format }: Props) {
    const date = new Date(iso)

    const opts: Intl.DateTimeFormatOptions = format ?? {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    }

    return <>{date.toLocaleString('fi-FI', opts)}</>
}
