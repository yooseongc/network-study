import { useCallback } from 'react'
import { D3Container } from '../../viz/D3Container'
import { themeColors, createColorMap } from '../../../lib/colors'
import { useIsDark } from '../../../hooks/useIsDark'
import * as d3 from 'd3'

export function L4vsL7Diagram() {
    const isDark = useIsDark()

    const render = useCallback(
        (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, height: number) => {
            const c = themeColors(isDark)
            const g = svg.append('g')
            const mid = width / 2
            const colW = Math.min(mid - 20, 300)
            const font = "'Pretendard Variable', Pretendard, sans-serif"
            const mono = "'JetBrains Mono', monospace"

            // ── Title ──
            g.append('text')
                .attr('x', width / 2)
                .attr('y', 22)
                .attr('text-anchor', 'middle')
                .attr('font-size', 14)
                .attr('font-weight', 'bold')
                .attr('fill', c.text)
                .attr('font-family', font)
                .text('L4 vs L7 Load Balancing')

            // ── Divider ──
            g.append('line')
                .attr('x1', mid)
                .attr('y1', 38)
                .attr('x2', mid)
                .attr('y2', height - 10)
                .attr('stroke', c.border)
                .attr('stroke-width', 1)
                .attr('stroke-dasharray', '4,4')

            // ── Column Labels ──
            const cols = [
                { x: mid / 2, label: 'L4 Load Balancer', sub: '(Transport Layer)', fillKey: 'blue' as const },
                { x: mid + mid / 2, label: 'L7 Load Balancer', sub: '(Application Layer)', fillKey: 'green' as const },
            ]

            const colorMap = createColorMap(c, ['blue', 'green', 'amber', 'purple', 'cyan', 'red'])

            cols.forEach((col) => {
                const cm = colorMap[col.fillKey]
                g.append('text')
                    .attr('x', col.x)
                    .attr('y', 52)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', 13)
                    .attr('font-weight', 'bold')
                    .attr('fill', cm.text)
                    .attr('font-family', font)
                    .text(col.label)
                g.append('text')
                    .attr('x', col.x)
                    .attr('y', 66)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', 10)
                    .attr('fill', c.textMuted)
                    .attr('font-family', mono)
                    .text(col.sub)
            })

            // ── Helper: draw box ──
            function drawBox(
                x: number,
                y: number,
                w: number,
                h: number,
                label: string,
                fk: 'blue' | 'green' | 'amber' | 'purple' | 'cyan' | 'red',
                sublabel?: string,
            ) {
                const cm = colorMap[fk]
                g.append('rect')
                    .attr('x', x - w / 2)
                    .attr('y', y)
                    .attr('width', w)
                    .attr('height', h)
                    .attr('rx', 6)
                    .attr('fill', cm.fill)
                    .attr('stroke', cm.stroke)
                    .attr('stroke-width', 1.5)
                const labelFontSize = label.length > 6 ? Math.min(11, w / (label.length * 0.7)) : 11
                g.append('text')
                    .attr('x', x)
                    .attr('y', sublabel ? y + h / 2 - 4 : y + h / 2 + 4)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', labelFontSize)
                    .attr('font-weight', '600')
                    .attr('fill', cm.text)
                    .attr('font-family', font)
                    .text(label)
                if (sublabel) {
                    g.append('text')
                        .attr('x', x)
                        .attr('y', y + h / 2 + 10)
                        .attr('text-anchor', 'middle')
                        .attr('font-size', Math.min(9, w / (sublabel.length * 0.55)))
                        .attr('fill', c.textMuted)
                        .attr('font-family', mono)
                        .text(sublabel)
                }
            }

            // ── Helper: draw arrow ──
            function drawArrow(x1: number, y1: number, x2: number, y2: number, label?: string) {
                const headLen = 6
                const angle = Math.atan2(y2 - y1, x2 - x1)
                g.append('line')
                    .attr('x1', x1)
                    .attr('y1', y1)
                    .attr('x2', x2 - headLen * Math.cos(angle))
                    .attr('y2', y2 - headLen * Math.sin(angle))
                    .attr('stroke', c.textMuted)
                    .attr('stroke-width', 1.5)
                // arrowhead
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
                    .attr('fill', c.textMuted)
                if (label) {
                    const mx = (x1 + x2) / 2
                    const my = (y1 + y2) / 2
                    g.append('text')
                        .attr('x', mx + 6)
                        .attr('y', my)
                        .attr('font-size', 8)
                        .attr('fill', c.textDim)
                        .attr('font-family', mono)
                        .text(label)
                }
            }

            // ── L4 Side ──
            const l4x = mid / 2
            const boxW4 = Math.min(colW - 30, 200)
            const startY = 82

            drawBox(l4x, startY, boxW4, 34, 'Client', 'purple')
            drawArrow(l4x, startY + 34, l4x, startY + 50, 'TCP SYN')

            drawBox(l4x, startY + 52, boxW4, 44, 'L4 LB', 'blue', 'TCP/IP 포워딩')
            drawArrow(l4x - 30, startY + 96, l4x - 30, startY + 114, 'DST NAT')
            drawArrow(l4x + 30, startY + 96, l4x + 30, startY + 114)

            // Two servers
            const svOff = 50
            drawBox(l4x - svOff, startY + 116, boxW4 / 2 - 8, 34, 'Server A', 'amber')
            drawBox(l4x + svOff, startY + 116, boxW4 / 2 - 8, 34, 'Server B', 'amber')

            // L4 notes
            const noteY = startY + 176
            const notes4 = [
                'TCP 연결을 종료하지 않음',
                'IP/Port 기반 라우팅',
                '패킷 레벨 포워딩 (DSR 가능)',
                'HTTP 내용 해석 불가',
                '낮은 지연시간, 높은 처리량',
            ]
            notes4.forEach((n, i) => {
                g.append('text')
                    .attr('x', l4x - colW / 2 + 16)
                    .attr('y', noteY + i * 16)
                    .attr('font-size', Math.min(9, colW / 28))
                    .attr('fill', c.textMuted)
                    .attr('font-family', font)
                    .text(`• ${n}`)
            })

            // ── L7 Side ──
            const l7x = mid + mid / 2
            const boxW7 = Math.min(colW - 30, 200)

            drawBox(l7x, startY, boxW7, 34, 'Client', 'purple')
            drawArrow(l7x, startY + 34, l7x, startY + 50, 'HTTPS')

            drawBox(l7x, startY + 52, boxW7, 44, 'L7 LB', 'green', 'HTTP 라우팅/TLS 종료')

            // Multiple routing paths — wider spacing
            const svOff7 = Math.min(colW / 3, 80)
            const svBoxW7 = Math.min(svOff7 - 10, 58)

            drawArrow(l7x - 30, startY + 96, l7x - svOff7, startY + 118, '/api')
            drawArrow(l7x, startY + 96, l7x, startY + 118, '/web')
            drawArrow(l7x + 30, startY + 96, l7x + svOff7, startY + 118, '/ws')

            drawBox(l7x - svOff7, startY + 120, svBoxW7, 34, 'API', 'cyan')
            drawBox(l7x, startY + 120, svBoxW7, 34, 'Web', 'cyan')
            drawBox(l7x + svOff7, startY + 120, svBoxW7, 34, 'WS', 'cyan')

            // L7 notes
            const notes7 = [
                'TLS 종료 (SSL offload)',
                'URL/Header/Cookie 기반 라우팅',
                'HTTP 요청 수정/주입 가능',
                'WebSocket, gRPC 지원',
                '상대적으로 높은 지연시간',
            ]
            notes7.forEach((n, i) => {
                g.append('text')
                    .attr('x', l7x - colW / 2 + 16)
                    .attr('y', noteY + i * 16)
                    .attr('font-size', Math.min(9, colW / 28))
                    .attr('fill', c.textMuted)
                    .attr('font-family', font)
                    .text(`• ${n}`)
            })
        },
        [isDark],
    )

    return (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2">
            <D3Container renderFn={render} height={380} />
        </div>
    )
}
