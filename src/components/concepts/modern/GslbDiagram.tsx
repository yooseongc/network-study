import { useCallback } from 'react'
import { createColorMap,themeColors,useIsDark , D3Container, createD3Theme } from '@study-ui/components'
import * as d3 from 'd3'

export function GslbDiagram() {
    const isDark = useIsDark()

    const render = useCallback(
        (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, height: number) => {
            const c = themeColors(isDark)
            const theme = createD3Theme(isDark)
            const cm = createColorMap(c, ['blue', 'green', 'red', 'amber', 'cyan', 'purple'])
            const g = svg.append('g')

            const mid = width / 2
            const boxW = Math.min(width * 0.22, 140)
            const boxH = 36
            const wideBoxW = Math.min(width * 0.3, 180)

            // ── helpers ──
            function drawBox(
                x: number,
                y: number,
                w: number,
                h: number,
                label: string,
                colorKey: 'blue' | 'green' | 'red' | 'amber' | 'cyan' | 'purple',
                sublabel?: string,
            ) {
                const m = cm[colorKey]
                g.append('rect')
                    .attr('x', x - w / 2)
                    .attr('y', y)
                    .attr('width', w)
                    .attr('height', h)
                    .attr('rx', 6)
                    .attr('fill', m.fill)
                    .attr('stroke', m.stroke)
                    .attr('stroke-width', 1.5)
                g.append('text')
                    .attr('x', x)
                    .attr('y', sublabel ? y + h / 2 - 4 : y + h / 2 + 4)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', Math.min(11, w / (label.length * 0.6)))
                    .attr('font-weight', '600')
                    .attr('fill', m.text)
                    .attr('font-family', theme.fonts.sans)
                    .text(label)
                if (sublabel) {
                    g.append('text')
                        .attr('x', x)
                        .attr('y', y + h / 2 + 10)
                        .attr('text-anchor', 'middle')
                        .attr('font-size', Math.min(9, w / (sublabel.length * 0.5)))
                        .attr('fill', c.textMuted)
                        .attr('font-family', theme.fonts.mono)
                        .text(sublabel)
                }
            }

            function drawArrow(
                x1: number,
                y1: number,
                x2: number,
                y2: number,
                color: string,
                label?: string,
                dashed?: boolean,
            ) {
                const headLen = 6
                const angle = Math.atan2(y2 - y1, x2 - x1)
                g.append('line')
                    .attr('x1', x1)
                    .attr('y1', y1)
                    .attr('x2', x2 - headLen * Math.cos(angle))
                    .attr('y2', y2 - headLen * Math.sin(angle))
                    .attr('stroke', color)
                    .attr('stroke-width', dashed ? 1 : 1.5)
                    .attr('stroke-dasharray', dashed ? '4,3' : 'none')
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
                        .attr('x', mx + 8)
                        .attr('y', my - 2)
                        .attr('font-size', 8)
                        .attr('fill', c.textDim)
                        .attr('font-family', theme.fonts.mono)
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
                .attr('font-family', theme.fonts.sans)
                .text('GSLB (Global Server Load Balancing)')

            // ── Client ──
            const clientY = 44
            drawBox(mid, clientY, wideBoxW, boxH, 'Client', 'purple', 'www.example.com')

            // ── DNS Resolver ──
            const resolverY = clientY + boxH + 36
            drawBox(mid, resolverY, wideBoxW, boxH, 'DNS Resolver', 'cyan', 'ISP / Public DNS')

            // Arrow: Client → Resolver
            drawArrow(mid, clientY + boxH, mid, resolverY, cm.blue.stroke, 'DNS query')

            // ── GSLB Controller ──
            const gslbY = resolverY + boxH + 36
            const gslbH = 46
            drawBox(mid, gslbY, wideBoxW + 20, gslbH, 'GSLB Controller', 'blue', 'DNS-based load balancing')

            // Arrow: Resolver → GSLB
            drawArrow(mid, resolverY + boxH, mid, gslbY, cm.blue.stroke, 'recursive query')

            // ── Datacenters ──
            const dcY = gslbY + gslbH + 50
            const dcSpacing = Math.min(width * 0.32, 200)
            const dcs = [
                { name: 'US-East', status: 'healthy', color: 'green' as const, x: mid - dcSpacing },
                { name: 'EU-West', status: 'degraded', color: 'amber' as const, x: mid },
                { name: 'AP-Seoul', status: 'healthy', color: 'green' as const, x: mid + dcSpacing },
            ]

            // Selected DC index (AP-Seoul = nearest)
            const selectedIdx = 2

            dcs.forEach((dc, i) => {
                const dcBoxW = Math.min(boxW + 10, 130)
                const dcBoxH = 52

                // DC box
                const m = cm[dc.color]
                g.append('rect')
                    .attr('x', dc.x - dcBoxW / 2)
                    .attr('y', dcY)
                    .attr('width', dcBoxW)
                    .attr('height', dcBoxH)
                    .attr('rx', 6)
                    .attr('fill', m.fill)
                    .attr('stroke', i === selectedIdx ? cm.blue.stroke : m.stroke)
                    .attr('stroke-width', i === selectedIdx ? 2.5 : 1.5)

                // DC name
                g.append('text')
                    .attr('x', dc.x)
                    .attr('y', dcY + 18)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', 11)
                    .attr('font-weight', '600')
                    .attr('fill', m.text)
                    .attr('font-family', theme.fonts.sans)
                    .text(dc.name)

                // Status indicator
                const statusColor =
                    dc.status === 'healthy' ? cm.green.stroke : cm.amber.stroke
                g.append('circle')
                    .attr('cx', dc.x - 20)
                    .attr('cy', dcY + 36)
                    .attr('r', 4)
                    .attr('fill', statusColor)
                g.append('text')
                    .attr('x', dc.x - 12)
                    .attr('y', dcY + 40)
                    .attr('font-size', 9)
                    .attr('fill', c.textMuted)
                    .attr('font-family', theme.fonts.mono)
                    .text(dc.status)

                if (i === selectedIdx) {
                    // Selected path: solid bold arrow
                    drawArrow(mid, gslbY + gslbH, dc.x, dcY, cm.blue.stroke)
                } else {
                    // Health check: dashed thin arrow
                    drawArrow(mid, gslbY + gslbH, dc.x, dcY, c.textDim, undefined, true)
                }
            })

            // ── "health check" label near non-selected DC ──
            g.append('text')
                .attr('x', dcs[0].x + 10)
                .attr('y', dcY - 8)
                .attr('font-size', 8)
                .attr('fill', c.textDim)
                .attr('font-family', theme.fonts.mono)
                .text('health check')

            // ── "geo-routing: lowest latency" label on the selected path ──
            const selDc = dcs[selectedIdx]
            const labelX = (mid + selDc.x) / 2
            const labelY = gslbY + gslbH + 22
            g.append('rect')
                .attr('x', labelX - 72)
                .attr('y', labelY - 10)
                .attr('width', 144)
                .attr('height', 16)
                .attr('rx', 3)
                .attr('fill', cm.blue.fill)
                .attr('stroke', cm.blue.stroke)
                .attr('stroke-width', 1)
            g.append('text')
                .attr('x', labelX)
                .attr('y', labelY + 2)
                .attr('text-anchor', 'middle')
                .attr('font-size', 9)
                .attr('font-weight', '600')
                .attr('fill', cm.blue.text)
                .attr('font-family', theme.fonts.mono)
                .text('geo-routing: lowest latency')

            // ── Bottom annotation ──
            g.append('text')
                .attr('x', mid)
                .attr('y', height - 14)
                .attr('text-anchor', 'middle')
                .attr('font-size', 10)
                .attr('fill', c.textMuted)
                .attr('font-family', theme.fonts.sans)
                .text('GSLB는 DNS 응답을 통해 클라이언트를 최적의 데이터센터로 유도합니다')
        },
        [isDark],
    )

    return (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2">
            <D3Container renderFn={render} height={440} />
        </div>
    )
}
