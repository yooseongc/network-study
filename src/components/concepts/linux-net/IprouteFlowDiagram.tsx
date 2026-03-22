import { useCallback } from 'react'
import { D3Container } from '../../viz/D3Container'
import { themeColors, createColorMap } from '../../../lib/colors'
import { useIsDark } from '../../../hooks/useIsDark'
import * as d3 from 'd3'

const FONT = "'Pretendard Variable', Pretendard, sans-serif"
const MONO = "'JetBrains Mono', monospace"

export function IprouteFlowDiagram() {
    const isDark = useIsDark()

    const render = useCallback(
        (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, _height: number) => {
            const c = themeColors(isDark)
            const cm = createColorMap(c, ['blue', 'green', 'amber', 'cyan', 'purple', 'red'])
            const g = svg.append('g')

            const padX = Math.max(16, width * 0.03)
            const cx = width / 2
            const boxW = Math.min(160, width * 0.28)
            const boxH = 34
            const ruleBoxW = Math.min(width - padX * 2 - 20, 500)

            // ── helpers ──
            function drawBox(x: number, y: number, w: number, h: number, label: string, colorKey: string, sub?: string) {
                const m = cm[colorKey]
                g.append('rect').attr('x', x - w / 2).attr('y', y).attr('width', w).attr('height', h)
                    .attr('rx', 6).attr('fill', m.fill).attr('stroke', m.stroke).attr('stroke-width', 1.5)
                const labelY = sub ? y + h / 2 - 3 : y + h / 2 + 4
                g.append('text').attr('x', x).attr('y', labelY).attr('text-anchor', 'middle')
                    .attr('font-size', Math.min(11, w / (label.length * 0.6))).attr('font-weight', 600)
                    .attr('fill', m.text).attr('font-family', FONT).text(label)
                if (sub) {
                    g.append('text').attr('x', x).attr('y', y + h / 2 + 10).attr('text-anchor', 'middle')
                        .attr('font-size', Math.min(9, w / (sub.length * 0.5)))
                        .attr('fill', c.textMuted).attr('font-family', MONO).text(sub)
                }
            }

            function drawArrow(x1: number, y1: number, x2: number, y2: number, color: string) {
                g.append('line').attr('x1', x1).attr('y1', y1).attr('x2', x2).attr('y2', y2)
                    .attr('stroke', color).attr('stroke-width', 2)
                const angle = Math.atan2(y2 - y1, x2 - x1)
                const hl = 7
                g.append('polygon')
                    .attr('points', [
                        [x2, y2],
                        [x2 - hl * Math.cos(angle - 0.4), y2 - hl * Math.sin(angle - 0.4)],
                        [x2 - hl * Math.cos(angle + 0.4), y2 - hl * Math.sin(angle + 0.4)],
                    ].map(p => p.join(',')).join(' '))
                    .attr('fill', color)
            }

            function stepLabel(x: number, y: number, text: string, color: string) {
                g.append('text').attr('x', x).attr('y', y).attr('text-anchor', 'middle')
                    .attr('font-size', 11).attr('font-weight', 'bold')
                    .attr('fill', color).attr('font-family', FONT).text(text)
            }

            // ── Title ──
            g.append('text').attr('x', cx).attr('y', 20).attr('text-anchor', 'middle')
                .attr('font-size', 13).attr('font-weight', 'bold')
                .attr('fill', c.text).attr('font-family', FONT)
                .text('Linux RPDB (Routing Policy Database) Flow')

            // ── Vertical flow layout ──
            let curY = 40

            // Packet In
            drawBox(cx, curY, boxW, boxH, 'Packet In', 'purple')
            curY += boxH
            drawArrow(cx, curY, cx, curY + 16, cm.purple.stroke)
            curY += 20

            // Step 1: ip rule match
            stepLabel(cx, curY + 10, 'Step 1: ip rule match (priority 순서)', cm.blue.text)
            curY += 20

            // Rule boxes
            const rules = [
                { prio: '0', rule: 'from all lookup local', match: false },
                { prio: '100', rule: 'from 10.0.0.0/8 lookup custom', match: true },
                { prio: '32766', rule: 'from all lookup main', match: false },
                { prio: '32767', rule: 'from all lookup default', match: false },
            ]
            const ruleH = 24
            const ruleGap = 5
            const ruleX = cx - ruleBoxW / 2

            rules.forEach((r, i) => {
                const ry = curY + i * (ruleH + ruleGap)
                const isMatch = r.match
                g.append('rect').attr('x', ruleX).attr('y', ry).attr('width', ruleBoxW).attr('height', ruleH)
                    .attr('rx', 4)
                    .attr('fill', isMatch ? cm.blue.fill : c.bgCard)
                    .attr('stroke', isMatch ? cm.blue.stroke : c.border)
                    .attr('stroke-width', isMatch ? 2 : 1)

                const text = `priority ${r.prio}: ${r.rule}`
                g.append('text').attr('x', ruleX + 10).attr('y', ry + ruleH / 2 + 4)
                    .attr('font-size', Math.min(10, ruleBoxW / (text.length * 0.52)))
                    .attr('fill', isMatch ? cm.blue.text : c.textMuted)
                    .attr('font-weight', isMatch ? 'bold' : 'normal')
                    .attr('font-family', MONO).text(text)

                if (isMatch) {
                    g.append('text').attr('x', ruleX + ruleBoxW - 10).attr('y', ry + ruleH / 2 + 4)
                        .attr('text-anchor', 'end').attr('font-size', 9).attr('font-weight', 'bold')
                        .attr('fill', cm.blue.text).attr('font-family', FONT).text('✓ MATCH')
                }
            })

            curY += rules.length * (ruleH + ruleGap) + 8
            drawArrow(cx, curY, cx, curY + 18, cm.blue.stroke)
            curY += 22

            // Step 2: Routing table lookup
            stepLabel(cx, curY + 10, 'Step 2: Routing table lookup', cm.green.text)
            curY += 18

            const tableW = Math.min(ruleBoxW, 420)
            const tableX = cx - tableW / 2
            const tableH = 96

            g.append('rect').attr('x', tableX).attr('y', curY).attr('width', tableW).attr('height', tableH)
                .attr('rx', 6).attr('fill', cm.green.fill).attr('stroke', cm.green.stroke).attr('stroke-width', 1.5)

            g.append('text').attr('x', tableX + 12).attr('y', curY + 16)
                .attr('font-size', 10).attr('font-weight', 'bold')
                .attr('fill', cm.green.text).attr('font-family', MONO).text('table custom:')

            const routes = [
                { dst: '10.0.1.0/24', gw: 'via 10.0.0.1', dev: 'dev eth0', match: true },
                { dst: '10.0.2.0/24', gw: 'via 10.0.0.2', dev: 'dev eth1', match: false },
                { dst: 'default', gw: 'via 10.0.0.254', dev: 'dev eth0', match: false },
            ]
            routes.forEach((rt, i) => {
                const ry = curY + 30 + i * 20
                const text = `${rt.dst}  ${rt.gw}  ${rt.dev}`
                g.append('text').attr('x', tableX + 16).attr('y', ry + 4)
                    .attr('font-size', Math.min(9.5, tableW / (text.length * 0.52)))
                    .attr('fill', rt.match ? cm.blue.text : c.textMuted)
                    .attr('font-weight', rt.match ? 'bold' : 'normal')
                    .attr('font-family', MONO).text(text)
                if (rt.match) {
                    g.append('text').attr('x', tableX + tableW - 12).attr('y', ry + 4)
                        .attr('text-anchor', 'end').attr('font-size', 9).attr('font-weight', 'bold')
                        .attr('fill', cm.blue.text).attr('font-family', FONT).text('✓ longest prefix')
                }
            })

            curY += tableH + 4
            drawArrow(cx, curY, cx, curY + 18, cm.green.stroke)
            curY += 22

            // Step 3: Nexthop
            stepLabel(cx, curY + 10, 'Step 3: Nexthop selection', cm.cyan.text)
            curY += 16
            drawBox(cx, curY, Math.min(220, width * 0.4), 36, 'nexthop 10.0.0.1', 'cyan', 'dev eth0')
            curY += 36
            drawArrow(cx, curY, cx, curY + 18, cm.cyan.stroke)
            curY += 20

            // Packet Out
            drawBox(cx, curY, boxW, boxH, 'Packet Out', 'blue', 'eth0')

            // Bottom annotation
            g.append('text').attr('x', cx).attr('y', curY + boxH + 22).attr('text-anchor', 'middle')
                .attr('font-size', 10).attr('fill', c.textMuted).attr('font-family', FONT)
                .text('ip rule → routing table → nexthop → output interface')
        },
        [isDark],
    )

    return (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2">
            <D3Container renderFn={render} height={620} />
        </div>
    )
}
