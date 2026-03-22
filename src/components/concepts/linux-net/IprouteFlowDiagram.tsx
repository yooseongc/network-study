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
        (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, height: number) => {
            const c = themeColors(isDark)
            const cm = createColorMap(c, ['blue', 'green', 'amber', 'cyan', 'purple', 'red'])
            const g = svg.append('g')

            const pad = 24
            const innerW = width - pad * 2
            const mid = width / 2

            // ── helpers ──
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
                    .attr('stroke-width', 1.5)
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
                        .attr('x', mx)
                        .attr('y', my - 6)
                        .attr('text-anchor', 'middle')
                        .attr('font-size', 8)
                        .attr('fill', c.textDim)
                        .attr('font-family', MONO)
                        .text(label)
                }
            }

            function drawDiamond(cx: number, cy: number, w: number, h: number, label: string, colorKey: 'blue' | 'green' | 'amber' | 'cyan' | 'purple' | 'red') {
                const m = cm[colorKey]
                const points = [
                    [cx, cy - h / 2],
                    [cx + w / 2, cy],
                    [cx, cy + h / 2],
                    [cx - w / 2, cy],
                ]
                    .map((p) => p.join(','))
                    .join(' ')
                g.append('polygon')
                    .attr('points', points)
                    .attr('fill', m.fill)
                    .attr('stroke', m.stroke)
                    .attr('stroke-width', 1.5)
                g.append('text')
                    .attr('x', cx)
                    .attr('y', cy + 4)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', Math.min(10, w / (label.length * 0.65)))
                    .attr('font-weight', '600')
                    .attr('fill', m.text)
                    .attr('font-family', FONT)
                    .text(label)
            }

            function drawProcessBox(
                x: number,
                y: number,
                w: number,
                h: number,
                label: string,
                colorKey: 'blue' | 'green' | 'amber' | 'cyan' | 'purple' | 'red',
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
                    .attr('font-family', FONT)
                    .text(label)
                if (sublabel) {
                    g.append('text')
                        .attr('x', x)
                        .attr('y', y + h / 2 + 10)
                        .attr('text-anchor', 'middle')
                        .attr('font-size', Math.min(9, w / (sublabel.length * 0.5)))
                        .attr('fill', c.textMuted)
                        .attr('font-family', MONO)
                        .text(sublabel)
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
                .text('Linux RPDB (Routing Policy Database) Flow')

            // ── Layout: 3 columns across width ──
            const col1X = pad + innerW * 0.12
            const col2X = pad + innerW * 0.45

            // ── Step 0: Packet arrives ──
            const packetY = 46
            drawProcessBox(col1X, packetY, Math.min(innerW * 0.2, 120), 32, 'Packet In', 'purple')

            // ── Step 1: ip rule match ──
            const stepLabelY = 44
            g.append('text')
                .attr('x', col2X)
                .attr('y', stepLabelY)
                .attr('text-anchor', 'middle')
                .attr('font-size', 11)
                .attr('font-weight', 'bold')
                .attr('fill', cm.blue.text)
                .attr('font-family', FONT)
                .text('Step 1: ip rule match')

            const diamondY = packetY + 16
            drawArrow(col1X + Math.min(innerW * 0.1, 60), packetY + 16, col2X - Math.min(innerW * 0.1, 70), diamondY, cm.blue.stroke)

            const diamondW = Math.min(innerW * 0.18, 110)
            drawDiamond(col2X, diamondY + 36, diamondW, 36, 'rule match?', 'blue')

            // Rule list (right side of diamond)
            const rules = [
                { prio: '0', rule: 'from all lookup local', match: false },
                { prio: '100', rule: 'from 10.0.0.0/8 lookup custom', match: true },
                { prio: '32766', rule: 'from all lookup main', match: false },
                { prio: '32767', rule: 'from all lookup default', match: false },
            ]

            const ruleBoxW = Math.min(innerW * 0.42, 260)
            const ruleStartY = diamondY + 8
            const ruleH = 22
            const ruleGap = 4

            rules.forEach((r, i) => {
                const ry = ruleStartY + i * (ruleH + ruleGap)
                const isMatch = r.match
                const fillColor = isMatch ? cm.blue.fill : c.bgCard
                const strokeColor = isMatch ? cm.blue.stroke : c.border
                const textColor = isMatch ? cm.blue.text : c.textMuted

                const rx = col2X + diamondW / 2 + 16
                g.append('rect')
                    .attr('x', rx)
                    .attr('y', ry)
                    .attr('width', ruleBoxW)
                    .attr('height', ruleH)
                    .attr('rx', 3)
                    .attr('fill', fillColor)
                    .attr('stroke', strokeColor)
                    .attr('stroke-width', isMatch ? 2 : 1)

                const fontSize = Math.min(9, ruleBoxW / ((`priority ${r.prio}: ${r.rule}`).length * 0.55))
                g.append('text')
                    .attr('x', rx + 8)
                    .attr('y', ry + ruleH / 2 + 3)
                    .attr('font-size', fontSize)
                    .attr('font-family', MONO)
                    .attr('fill', textColor)
                    .text(`priority ${r.prio}: ${r.rule}`)

                if (isMatch) {
                    g.append('text')
                        .attr('x', rx + ruleBoxW - 8)
                        .attr('y', ry + ruleH / 2 + 3)
                        .attr('text-anchor', 'end')
                        .attr('font-size', 8)
                        .attr('font-weight', 'bold')
                        .attr('fill', cm.blue.text)
                        .attr('font-family', FONT)
                        .text('← MATCH')
                }
            })

            // ── Step 2: Table lookup ──
            const step2Y = ruleStartY + rules.length * (ruleH + ruleGap) + 24
            g.append('text')
                .attr('x', col2X)
                .attr('y', step2Y)
                .attr('text-anchor', 'middle')
                .attr('font-size', 11)
                .attr('font-weight', 'bold')
                .attr('fill', cm.green.text)
                .attr('font-family', FONT)
                .text('Step 2: Routing table lookup')

            drawArrow(col2X, diamondY + 36 + 18, col2X, step2Y + 6, cm.blue.stroke, 'matched rule')

            const tableY = step2Y + 14
            const tableW = Math.min(innerW * 0.5, 310)
            const tableH = 90
            const tableX = col2X - tableW / 2

            // table border
            g.append('rect')
                .attr('x', tableX)
                .attr('y', tableY)
                .attr('width', tableW)
                .attr('height', tableH)
                .attr('rx', 6)
                .attr('fill', cm.green.fill)
                .attr('stroke', cm.green.stroke)
                .attr('stroke-width', 1.5)

            // table header
            g.append('text')
                .attr('x', tableX + 10)
                .attr('y', tableY + 16)
                .attr('font-size', 10)
                .attr('font-weight', 'bold')
                .attr('fill', cm.green.text)
                .attr('font-family', MONO)
                .text('table custom:')

            const routes = [
                { dst: '10.0.1.0/24', gw: 'via 10.0.0.1', dev: 'dev eth0', match: true },
                { dst: '10.0.2.0/24', gw: 'via 10.0.0.2', dev: 'dev eth1', match: false },
                { dst: 'default', gw: 'via 10.0.0.254', dev: 'dev eth0', match: false },
            ]

            const routeFontSize = Math.min(9, tableW / 38)
            routes.forEach((rt, i) => {
                const ry = tableY + 30 + i * 18
                const text = `${rt.dst}  ${rt.gw}  ${rt.dev}`
                g.append('text')
                    .attr('x', tableX + 14)
                    .attr('y', ry + 4)
                    .attr('font-size', routeFontSize)
                    .attr('fill', rt.match ? cm.blue.text : c.textMuted)
                    .attr('font-weight', rt.match ? 'bold' : 'normal')
                    .attr('font-family', MONO)
                    .text(text)
                if (rt.match) {
                    g.append('text')
                        .attr('x', tableX + tableW - 10)
                        .attr('y', ry + 4)
                        .attr('text-anchor', 'end')
                        .attr('font-size', 8)
                        .attr('font-weight', 'bold')
                        .attr('fill', cm.blue.text)
                        .attr('font-family', FONT)
                        .text('← MATCH')
                }
            })

            // ── Step 3: Nexthop / output interface ──
            const step3Y = tableY + tableH + 20
            g.append('text')
                .attr('x', col2X)
                .attr('y', step3Y)
                .attr('text-anchor', 'middle')
                .attr('font-size', 11)
                .attr('font-weight', 'bold')
                .attr('fill', cm.cyan.text)
                .attr('font-family', FONT)
                .text('Step 3: Nexthop selection')

            drawArrow(col2X, tableY + tableH, col2X, step3Y + 4, cm.green.stroke)

            const nhY = step3Y + 12
            const nhBoxW = Math.min(innerW * 0.35, 200)

            // Nexthop box
            drawProcessBox(col2X, nhY, nhBoxW, 36, 'nexthop 10.0.0.1', 'cyan', 'dev eth0')

            // ── Output arrow ──
            const outY = nhY + 36 + 10
            drawProcessBox(col2X, outY, Math.min(innerW * 0.2, 120), 32, 'Packet Out', 'blue', 'eth0')
            drawArrow(col2X, nhY + 36, col2X, outY, cm.cyan.stroke)

            // ── Bottom annotation ──
            g.append('text')
                .attr('x', mid)
                .attr('y', height - 10)
                .attr('text-anchor', 'middle')
                .attr('font-size', 10)
                .attr('fill', c.textMuted)
                .attr('font-family', FONT)
                .text('ip rule → routing table → nexthop → output interface')
        },
        [isDark],
    )

    return (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2">
            <D3Container renderFn={render} height={520} />
        </div>
    )
}
