import type { ReactNode } from 'react'

interface CardGridProps {
    children: ReactNode
    cols?: 2 | 3 | 4
    className?: string
}

const colsClass = {
    2: 'grid grid-cols-1 sm:grid-cols-2 gap-3',
    3: 'grid grid-cols-1 sm:grid-cols-3 gap-3',
    4: 'grid grid-cols-2 sm:grid-cols-4 gap-3',
}

export function CardGrid({ children, cols = 2, className = '' }: CardGridProps) {
    return <div className={`${colsClass[cols]} ${className}`}>{children}</div>
}
