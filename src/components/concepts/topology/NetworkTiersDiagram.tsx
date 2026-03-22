import { useCallback } from 'react'
import * as d3 from 'd3'
import { D3Container } from '../../viz/D3Container'
import { useTheme } from '../../../hooks/useTheme'
import { themeColors } from '../../../lib/colors'

const FONT = "'Pretendard Variable', Pretendard, sans-serif"
const MONO = "'JetBrains Mono', monospace"

interface TierNode {
    id: string
    label: string
    x: number
    y: number
}

export function NetworkTiersDiagram() {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    const renderFn = useCallback(
        (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, _height: number) => {
            const tc = themeColors(isDark)
            const g = svg.append('g')
            const cx = width / 2

            // ── Tier backgrounds ────────────────────────────────────
            const tiers = [
                { y: 30, h: 90, label: 'Core Layer', sublabel: '고속 백본, 라우팅 집중', fill: tc.redFill, stroke: tc.redStroke, text: tc.redText },
                { y: 135, h: 110, label: 'Distribution Layer', sublabel: '정책, VLAN 간 라우팅, ACL', fill: tc.amberFill, stroke: tc.amberStroke, text: tc.amberText },
                { y: 260, h: 110, label: 'Access Layer', sublabel: '사용자/서버 연결, PoE', fill: tc.greenFill, stroke: tc.greenStroke, text: tc.greenText },
            ]

            for (const tier of tiers) {
                g.append('rect')
                    .attr('x', 30).attr('y', tier.y)
                    .attr('width', width - 60).attr('height', tier.h)
                    .attr('rx', 10)
                    .attr('fill', tier.fill)
                    .attr('stroke', tier.stroke)
                    .attr('stroke-width', 1)
                    .attr('stroke-dasharray', '4,3')

                g.append('text')
                    .attr('x', 50).attr('y', tier.y + 20)
                    .attr('fill', tier.text)
                    .attr('font-family', MONO).attr('font-size', 11).attr('font-weight', 700)
                    .text(tier.label)

                g.append('text')
                    .attr('x', 50).attr('y', tier.y + 35)
                    .attr('fill', tc.textDim)
                    .attr('font-family', FONT).attr('font-size', 9)
                    .text(tier.sublabel)
            }

            // ── Nodes ───────────────────────────────────────────────
            const coreNodes: TierNode[] = [
                { id: 'core1', label: 'Core SW 1', x: cx - 70, y: 85 },
                { id: 'core2', label: 'Core SW 2', x: cx + 70, y: 85 },
            ]

            const distNodes: TierNode[] = [
                { id: 'dist1', label: 'Dist SW 1', x: cx - 130, y: 195 },
                { id: 'dist2', label: 'Dist SW 2', x: cx - 10, y: 195 },
                { id: 'dist3', label: 'Dist SW 3', x: cx + 120, y: 195 },
            ]

            const accessNodes: TierNode[] = [
                { id: 'acc1', label: 'Access 1', x: cx - 170, y: 305 },
                { id: 'acc2', label: 'Access 2', x: cx - 80, y: 305 },
                { id: 'acc3', label: 'Access 3', x: cx + 30, y: 305 },
                { id: 'acc4', label: 'Access 4', x: cx + 140, y: 305 },
            ]

            // Device labels at the bottom
            const devices = [
                { x: cx - 170, y: 350, label: 'Servers' },
                { x: cx - 80, y: 350, label: 'Dev PCs' },
                { x: cx + 30, y: 350, label: 'Office PCs' },
                { x: cx + 140, y: 350, label: 'IP Phones' },
            ]

            // Links: core to core (redundancy)
            drawLink(g, coreNodes[0], coreNodes[1], tc.redStroke, true)

            // Links: core to distribution (full mesh)
            for (const core of coreNodes) {
                for (const dist of distNodes) {
                    drawLink(g, core, dist, tc.amberStroke, false)
                }
            }

            // Links: dist to access
            const distAccMap = [
                [0, 0], [0, 1], [1, 1], [1, 2], [2, 2], [2, 3],
            ]
            for (const [di, ai] of distAccMap) {
                drawLink(g, distNodes[di], accessNodes[ai], tc.greenStroke, false)
            }

            // Draw all nodes
            const drawNodeGroup = (nodes: TierNode[], fill: string, stroke: string, textColor: string) => {
                for (const node of nodes) {
                    const ng = g.append('g').attr('transform', `translate(${node.x},${node.y})`)
                    ng.append('rect')
                        .attr('x', -40).attr('y', -16)
                        .attr('width', 80).attr('height', 32)
                        .attr('rx', 6)
                        .attr('fill', fill).attr('stroke', stroke).attr('stroke-width', 1.5)
                    ng.append('text')
                        .attr('x', 0).attr('y', 4)
                        .attr('text-anchor', 'middle')
                        .attr('fill', textColor)
                        .attr('font-family', FONT).attr('font-size', 9).attr('font-weight', 600)
                        .text(node.label)
                }
            }

            drawNodeGroup(coreNodes, tc.redFill, tc.redStroke, tc.redText)
            drawNodeGroup(distNodes, tc.amberFill, tc.amberStroke, tc.amberText)
            drawNodeGroup(accessNodes, tc.greenFill, tc.greenStroke, tc.greenText)

            // Draw device icons (small circles + label)
            for (let i = 0; i < devices.length; i++) {
                const dev = devices[i]
                const acc = accessNodes[i]

                g.append('line')
                    .attr('x1', acc.x).attr('y1', acc.y + 16)
                    .attr('x2', dev.x).attr('y2', dev.y - 8)
                    .attr('stroke', tc.border).attr('stroke-width', 1).attr('stroke-dasharray', '3,2')

                g.append('circle')
                    .attr('cx', dev.x).attr('cy', dev.y)
                    .attr('r', 6)
                    .attr('fill', tc.cyanFill).attr('stroke', tc.cyanStroke).attr('stroke-width', 1)

                g.append('text')
                    .attr('x', dev.x).attr('y', dev.y + 20)
                    .attr('text-anchor', 'middle')
                    .attr('fill', tc.textMuted)
                    .attr('font-family', FONT).attr('font-size', 8)
                    .text(dev.label)
            }

            // Redundancy annotation
            g.append('text')
                .attr('x', cx).attr('y', 68)
                .attr('text-anchor', 'middle')
                .attr('fill', tc.textDim)
                .attr('font-family', MONO).attr('font-size', 8)
                .text('redundant link')
        },
        [isDark]
    )

    return (
        <D3Container
            renderFn={renderFn}
            deps={[isDark]}
            height={390}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
            zoomable
        />
    )
}

function drawLink(
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    s: TierNode,
    t: TierNode,
    stroke: string,
    dashed: boolean
) {
    const line = g.append('line')
        .attr('x1', s.x).attr('y1', s.y + 16)
        .attr('x2', t.x).attr('y2', t.y - 16)
        .attr('stroke', stroke)
        .attr('stroke-width', dashed ? 2 : 1.2)
    if (dashed) line.attr('stroke-dasharray', '5,3')
}
