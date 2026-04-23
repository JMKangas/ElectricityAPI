import type { ReactNode } from 'react'

type Props = {
    label: string
    value: ReactNode
}

export default function MetricBox({ label, value }: Props) {
    return (
        <div className="metric-box">
            <span className="metric-label">{label}</span>
            <span className="metric-value">{value}</span>
        </div>
    )
}

