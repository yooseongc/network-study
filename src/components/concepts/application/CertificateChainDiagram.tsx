import { useCallback } from 'react'
import { createColorMap,themeColors,useIsDark , D3Container } from '@study-ui/components'
import * as d3 from 'd3'

const FONT = "'Pretendard Variable', Pretendard, sans-serif"
const MONO = "'JetBrains Mono', monospace"

export function CertificateChainDiagram() {
    const isDark = useIsDark()

    const render = useCallback(
        (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, height: number) => {
            const c = themeColors(isDark)
            const cm = createColorMap(c, ['red', 'amber', 'green', 'blue', 'cyan'])
            const g = svg.append('g')

            const mid = width / 2
            const boxW = Math.min(width * 0.55, 340)
            const boxH = 64
            const gapY = 40

            // ── helpers ──
            function drawArrow(x1: number, y1: number, x2: number, y2: number, color: string, label?: string) {
                const headLen = 6
                const angle = Math.atan2(y2 - y1, x2 - x1)
                g.append('line')
                    .attr('x1', x1)
                    .attr('y1', y1)
                    .attr('x2', x2 - headLen * Math.cos(angle))
                    .attr('y2', y2 - headLen * Math.sin(angle))
                    .attr('stroke', color)
                    .attr('stroke-width', 1.5)
                g.append('polygon')
                    .attr(
                        'points',
                        [
                            [x2, y2],
                            [x2 - headLen * Math.cos(angle - 0.4), y2 - headLen * Math.sin(angle - 0.4)],
                            [x2 - headLen * Math.cos(angle + 0.4), y2 - headLen * Math.sin(angle + 0.4)],
                        ]
                            .map((p) => p.join(','))
                            .join(' '),
                    )
                    .attr('fill', color)
                if (label) {
                    const mx = (x1 + x2) / 2
                    const my = (y1 + y2) / 2
                    g.append('text')
                        .attr('x', mx + 10)
                        .attr('y', my + 3)
                        .attr('font-size', 10)
                        .attr('font-weight', '600')
                        .attr('fill', color)
                        .attr('font-family', FONT)
                        .text(label)
                }
            }

            // ── Title ──
            g.append('text')
                .attr('x', mid)
                .attr('y', 22)
                .attr('text-anchor', 'middle')
                .attr('font-size', 14)
                .attr('font-weight', 'bold')
                .attr('fill', c.text)
                .attr('font-family', FONT)
                .text('TLS Certificate Chain of Trust')

            // ── Certs ──
            const certs = [
                {
                    name: 'Root CA',
                    issuer: 'Self-signed',
                    validity: 'Trust Anchor (pre-installed)',
                    colorKey: 'red' as const,
                },
                {
                    name: 'Intermediate CA',
                    issuer: 'Issued by Root CA',
                    validity: 'Cross-signed / delegated',
                    colorKey: 'amber' as const,
                },
                {
                    name: 'End-Entity Certificate',
                    issuer: 'Issued by Intermediate CA',
                    validity: 'www.example.com',
                    colorKey: 'green' as const,
                },
            ]

            const startY = 42

            certs.forEach((cert, i) => {
                const y = startY + i * (boxH + gapY)
                const m = cm[cert.colorKey]

                // Box
                g.append('rect')
                    .attr('x', mid - boxW / 2)
                    .attr('y', y)
                    .attr('width', boxW)
                    .attr('height', boxH)
                    .attr('rx', 6)
                    .attr('fill', m.fill)
                    .attr('stroke', m.stroke)
                    .attr('stroke-width', 1.5)

                // Cert name
                g.append('text')
                    .attr('x', mid)
                    .attr('y', y + 20)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', 12)
                    .attr('font-weight', 'bold')
                    .attr('fill', m.text)
                    .attr('font-family', FONT)
                    .text(cert.name)

                // Issuer
                g.append('text')
                    .attr('x', mid)
                    .attr('y', y + 36)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', 9)
                    .attr('fill', c.textMuted)
                    .attr('font-family', MONO)
                    .text(cert.issuer)

                // Validity concept
                g.append('text')
                    .attr('x', mid)
                    .attr('y', y + 52)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', 9)
                    .attr('fill', c.textDim)
                    .attr('font-family', MONO)
                    .text(cert.validity)

                // "signs" arrow between certs
                if (i < certs.length - 1) {
                    drawArrow(mid, y + boxH, mid, y + boxH + gapY, m.stroke, 'signs')
                }
            })

            // ── "Chain of Trust" side label ──
            const chainX = mid - boxW / 2 - 30
            const chainTopY = startY + 10
            const chainBotY = startY + 2 * (boxH + gapY) + boxH - 10

            // vertical bracket line
            g.append('line')
                .attr('x1', chainX)
                .attr('y1', chainTopY)
                .attr('x2', chainX)
                .attr('y2', chainBotY)
                .attr('stroke', cm.blue.stroke)
                .attr('stroke-width', 1.5)
            // top tick
            g.append('line')
                .attr('x1', chainX)
                .attr('y1', chainTopY)
                .attr('x2', chainX + 8)
                .attr('y2', chainTopY)
                .attr('stroke', cm.blue.stroke)
                .attr('stroke-width', 1.5)
            // bottom tick
            g.append('line')
                .attr('x1', chainX)
                .attr('y1', chainBotY)
                .attr('x2', chainX + 8)
                .attr('y2', chainBotY)
                .attr('stroke', cm.blue.stroke)
                .attr('stroke-width', 1.5)

            // rotated label
            const chainMidY = (chainTopY + chainBotY) / 2
            g.append('text')
                .attr('x', chainX - 10)
                .attr('y', chainMidY)
                .attr('text-anchor', 'middle')
                .attr('font-size', 11)
                .attr('font-weight', 'bold')
                .attr('fill', cm.blue.text)
                .attr('font-family', FONT)
                .attr('transform', `rotate(-90, ${chainX - 10}, ${chainMidY})`)
                .text('Chain of Trust')

            // ── Bottom annotation ──
            g.append('text')
                .attr('x', mid)
                .attr('y', height - 18)
                .attr('text-anchor', 'middle')
                .attr('font-size', 10)
                .attr('fill', c.textMuted)
                .attr('font-family', FONT)
                .text('Browser trusts Root CA → validates chain → accepts end-entity')
        },
        [isDark],
    )

    return (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2">
            <D3Container renderFn={render} height={420} />
        </div>
    )
}
