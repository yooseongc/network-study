interface RfcRefProps {
    rfc: number
    section?: string
    label?: string
}

export function RfcRef({ rfc, section, label }: RfcRefProps) {
    const href = section
        ? `https://www.rfc-editor.org/rfc/rfc${rfc}#section-${section}`
        : `https://www.rfc-editor.org/rfc/rfc${rfc}`
    const display = label ?? `RFC ${rfc}${section ? ` §${section}` : ''}`

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={`RFC ${rfc}${section ? ` Section ${section}` : ''}`}
            className="inline-flex items-center gap-1 font-mono text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded px-1.5 py-0.5 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors no-underline"
        >
            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
            </svg>
            {display}
        </a>
    )
}
