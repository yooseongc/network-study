import { useCallback } from 'react'
import * as d3 from 'd3'
import { D3Container } from '../../viz/D3Container'
import { useIsDark } from '../../../hooks/useIsDark'
import { themeColors, createColorMap } from '../../../lib/colors'

interface NodeDef {
    id: string
    label: string
    x: number
    y: number
    color: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'cyan'
    shape?: 'rect' | 'diamond'
}

interface LinkDef {
    source: string
    target: string
}

const FONT = "'Pretendard Variable', Pretendard, sans-serif"
const MONO = "'JetBrains Mono', monospace"

export function HomeVsEnterprise() {
    const isDark = useIsDark()

    const renderFn = useCallback(
        (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, height: number) => {
            const tc = themeColors(isDark)
            const g = svg.append('g')
            const half = width / 2
            const dividerX = half

            // Divider line
            g.append('line')
                .attr('x1', dividerX)
                .attr('y1', 20)
                .attr('x2', dividerX)
                .attr('y2', height - 20)
                .attr('stroke', tc.textMuted)
                .attr('stroke-dasharray', '6,4')
                .attr('stroke-width', 1)
                .attr('opacity', 0.5)

            // Section titles
            g.append('text').attr('x', half / 2).attr('y', 30).attr('text-anchor', 'middle')
                .attr('fill', tc.blueText).attr('font-family', MONO).attr('font-size', 13).attr('font-weight', 700)
                .text('Home Network')

            g.append('text').attr('x', dividerX + half / 2).attr('y', 30).attr('text-anchor', 'middle')
                .attr('fill', tc.purpleText).attr('font-family', MONO).attr('font-size', 13).attr('font-weight', 700)
                .text('Enterprise Network')

            // ── Home Network (left) ─────────────────────────────────────
            const homeNodes: NodeDef[] = [
                { id: 'h-isp', label: 'ISP', x: half / 2, y: 70, color: 'amber' },
                { id: 'h-router', label: '공유기\n(Router+AP+Switch)', x: half / 2, y: 150, color: 'blue' },
                { id: 'h-pc', label: 'PC', x: half / 2 - 90, y: 250, color: 'green' },
                { id: 'h-phone', label: 'Phone', x: half / 2, y: 250, color: 'green' },
                { id: 'h-tv', label: 'Smart TV', x: half / 2 + 90, y: 250, color: 'green' },
            ]
            const homeLinks: LinkDef[] = [
                { source: 'h-isp', target: 'h-router' },
                { source: 'h-router', target: 'h-pc' },
                { source: 'h-router', target: 'h-phone' },
                { source: 'h-router', target: 'h-tv' },
            ]

            // ── Enterprise Network (right) ──────────────────────────────
            const ox = dividerX + 15
            const ew = half - 30
            const cx = ox + ew / 2
            const entNodes: NodeDef[] = [
                { id: 'e-isp', label: 'ISP', x: cx, y: 70, color: 'amber' },
                { id: 'e-border', label: 'Border\nRouter', x: cx, y: 120, color: 'red' },
                { id: 'e-fw', label: 'Firewall', x: cx, y: 175, color: 'red', shape: 'diamond' },
                { id: 'e-core', label: 'Core\nSwitch', x: cx, y: 235, color: 'purple' },
                { id: 'e-dmz', label: 'DMZ\n(Web/Mail)', x: cx + ew * 0.35, y: 175, color: 'cyan' },
                { id: 'e-dist1', label: 'Dist SW\n(서버망)', x: cx - ew * 0.28, y: 305, color: 'blue' },
                { id: 'e-dist2', label: 'Dist SW\n(사용자망)', x: cx + ew * 0.28, y: 305, color: 'blue' },
                { id: 'e-srv', label: 'Servers', x: cx - ew * 0.28, y: 375, color: 'green' },
                { id: 'e-usr', label: 'Users', x: cx + ew * 0.28, y: 375, color: 'green' },
            ]
            const entLinks: LinkDef[] = [
                { source: 'e-isp', target: 'e-border' },
                { source: 'e-border', target: 'e-fw' },
                { source: 'e-fw', target: 'e-core' },
                { source: 'e-fw', target: 'e-dmz' },
                { source: 'e-core', target: 'e-dist1' },
                { source: 'e-core', target: 'e-dist2' },
                { source: 'e-dist1', target: 'e-srv' },
                { source: 'e-dist2', target: 'e-usr' },
            ]

            const _colorMap = createColorMap(tc, ['blue', 'green', 'amber', 'red', 'purple', 'cyan'])
            const colorLookup = (c: string) => _colorMap[c] || _colorMap.blue

            const allNodes = [...homeNodes, ...entNodes]
            const allLinks = [...homeLinks, ...entLinks]
            const nodeMap = new Map(allNodes.map(n => [n.id, n]))

            // Draw links
            for (const link of allLinks) {
                const s = nodeMap.get(link.source)!
                const t = nodeMap.get(link.target)!
                g.append('line')
                    .attr('x1', s.x).attr('y1', s.y)
                    .attr('x2', t.x).attr('y2', t.y)
                    .attr('stroke', tc.textMuted)
                    .attr('stroke-width', 1.5)
                    .attr('opacity', 0.7)
            }

            // Draw nodes
            for (const node of allNodes) {
                const c = colorLookup(node.color)
                const ng = g.append('g').attr('transform', `translate(${node.x},${node.y})`)

                if (node.shape === 'diamond') {
                    ng.append('polygon')
                        .attr('points', '0,-22 30,0 0,22 -30,0')
                        .attr('fill', c.fill).attr('stroke', c.stroke).attr('stroke-width', 1.5)
                } else {
                    const hasKorean = /[\uAC00-\uD7AF]/.test(node.label)
                    const w = hasKorean ? 92 : 72, h = 32
                    ng.append('rect')
                        .attr('x', -w / 2).attr('y', -h / 2)
                        .attr('width', w).attr('height', h)
                        .attr('rx', 6)
                        .attr('fill', c.fill).attr('stroke', c.stroke).attr('stroke-width', 1.5)
                }

                const lines = node.label.split('\n')
                lines.forEach((line, i) => {
                    const hasKorean = /[\uAC00-\uD7AF]/.test(line)
                    ng.append('text')
                        .attr('x', 0)
                        .attr('y', lines.length === 1 ? 4 : -4 + i * 13)
                        .attr('text-anchor', 'middle')
                        .attr('fill', c.text)
                        .attr('font-family', FONT)
                        .attr('font-size', hasKorean ? 8 : 9)
                        .attr('font-weight', 600)
                        .text(line)
                })
            }

            // IP annotations
            const annotStyle = { fill: tc.textMuted, fontFamily: MONO, fontSize: '8px' }

            // Home IP annotation — 공유기(y=150) 우측 아래
            g.append('text').attr('x', half / 2 + 52).attr('y', 155)
                .attr('fill', annotStyle.fill).attr('font-family', annotStyle.fontFamily).attr('font-size', annotStyle.fontSize)
                .text('192.168.0.1')

            // Enterprise IP annotations — 각 박스 하단 바깥에 배치
            g.append('text').attr('x', cx + 40).attr('y', 145)
                .attr('fill', annotStyle.fill).attr('font-family', annotStyle.fontFamily).attr('font-size', annotStyle.fontSize)
                .text('211.x.x.x')

            g.append('text').attr('x', cx - ew * 0.28 + 52).attr('y', 330)
                .attr('fill', annotStyle.fill).attr('font-family', annotStyle.fontFamily).attr('font-size', annotStyle.fontSize)
                .text('10.10.x.x')

            g.append('text').attr('x', cx + ew * 0.28 + 52).attr('y', 330)
                .attr('fill', annotStyle.fill).attr('font-family', annotStyle.fontFamily).attr('font-size', annotStyle.fontSize)
                .text('10.20.x.x')
        },
        [isDark]
    )

    return (
        <D3Container
            renderFn={renderFn}
            deps={[isDark]}
            height={420}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
            zoomable
        />
    )
}
