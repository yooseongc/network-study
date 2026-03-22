/**
 * GlossaryTooltip — <T id="tcp">TCP</T>
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { glossary, CATEGORY_LABEL, CATEGORY_COLOR } from '../../data/glossary'

const glossaryMap = new Map(glossary.map((g) => [g.id, g]))

interface Props {
    id: string
    children: React.ReactNode
}

interface TooltipPos {
    top: number
    left: number
    flipY: boolean
}

const TOOLTIP_WIDTH = 320
const TOOLTIP_GAP = 6
const SCREEN_MARGIN = 12

export function T({ id, children }: Props) {
    const entry = glossaryMap.get(id)

    const [open, setOpen] = useState(false)
    const [pos, setPos] = useState<TooltipPos>({ top: 0, left: 0, flipY: false })
    const triggerRef = useRef<HTMLSpanElement>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const calcPos = useCallback(() => {
        if (!triggerRef.current) return
        const rect = triggerRef.current.getBoundingClientRect()

        let left = rect.left
        if (left + TOOLTIP_WIDTH > window.innerWidth - SCREEN_MARGIN) {
            left = Math.max(SCREEN_MARGIN, rect.right - TOOLTIP_WIDTH)
        }

        const spaceBelow = window.innerHeight - rect.bottom - TOOLTIP_GAP
        const flipY = spaceBelow < 160
        const top = flipY ? rect.top - TOOLTIP_GAP : rect.bottom + TOOLTIP_GAP

        setPos({ top, left, flipY })
    }, [])

    const cancelClose = useCallback(() => {
        if (closeTimer.current) clearTimeout(closeTimer.current)
    }, [])

    const scheduleClose = useCallback(() => {
        cancelClose()
        closeTimer.current = setTimeout(() => setOpen(false), 120)
    }, [cancelClose])

    const openTooltip = useCallback(() => {
        cancelClose()
        calcPos()
        setOpen(true)
    }, [cancelClose, calcPos])

    useEffect(() => {
        if (!open) return
        const onMouseDown = (e: MouseEvent) => {
            if (triggerRef.current?.contains(e.target as Node) || tooltipRef.current?.contains(e.target as Node)) return
            setOpen(false)
        }
        document.addEventListener('mousedown', onMouseDown)
        return () => document.removeEventListener('mousedown', onMouseDown)
    }, [open])

    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false)
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [open])

    useEffect(
        () => () => {
            if (closeTimer.current) clearTimeout(closeTimer.current)
        },
        [],
    )

    if (!entry) {
        return <span title={`glossary: unknown id "${id}"`}>{children}</span>
    }

    const tooltipCard = open
        ? createPortal(
            <div
                ref={tooltipRef}
                role="tooltip"
                id={`glossary-tip-${id}`}
                style={{
                    position: 'fixed',
                    top: pos.top,
                    left: pos.left,
                    width: TOOLTIP_WIDTH,
                    zIndex: 9999,
                    transformOrigin: pos.flipY ? 'bottom left' : 'top left',
                }}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl p-4 animate-in fade-in slide-in-from-top-1 duration-150"
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
            >
                <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono font-semibold text-sm text-gray-900 dark:text-gray-100 leading-snug">
                        {entry.term}
                        {entry.aliases && entry.aliases.length > 0 && (
                            <span className="ml-1.5 font-normal text-gray-400 dark:text-gray-500 text-xs">
                                  ({entry.aliases[0]})
                            </span>
                        )}
                    </span>
                    <span
                        className={`text-xs border rounded-full px-2 py-0.5 shrink-0 font-medium ${CATEGORY_COLOR[entry.category]}`}
                    >
                        {CATEGORY_LABEL[entry.category]}
                    </span>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{entry.definition}</p>

                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                    <Link
                        to={`/glossary#${entry.id}`}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        onClick={() => setOpen(false)}
                    >
                          용어사전에서 보기 →
                    </Link>
                </div>
            </div>,
            document.body,
        )
        : null

    return (
        <>
            <span
                ref={triggerRef}
                role="button"
                tabIndex={0}
                aria-expanded={open}
                aria-describedby={open ? `glossary-tip-${id}` : undefined}
                className="border-b border-dotted border-current cursor-help opacity-90 hover:opacity-100 transition-opacity"
                onMouseEnter={openTooltip}
                onMouseLeave={scheduleClose}
                onFocus={openTooltip}
                onBlur={(e) => {
                    if (!tooltipRef.current?.contains(e.relatedTarget as Node)) {
                        scheduleClose()
                    }
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        if (open) setOpen(false)
                        else openTooltip()
                    }
                }}
            >
                {children}
            </span>
            {tooltipCard}
        </>
    )
}
