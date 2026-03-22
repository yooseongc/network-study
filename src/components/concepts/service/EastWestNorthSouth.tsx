import { useCallback, useState } from 'react'
import * as d3 from 'd3'
import { D3Container } from '../../viz/D3Container'
import { useTheme } from '../../../hooks/useTheme'
import { themeColors } from '../../../lib/colors'

const FONT = "'Pretendard Variable', Pretendard, sans-serif"
const MONO = "'JetBrains Mono', monospace"

type ViewMode = 'both' | 'ns' | 'ew'

export function EastWestNorthSouth() {
    const { theme } = useTheme()
    const isDark = theme === 'dark'
    const [view, setView] = useState<ViewMode>('both')

    const renderFn = useCallback(
        (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, height: number) => {
            const tc = themeColors(isDark)
            const g = svg.append('g')
            const cx = width / 2

            // Title
            g.append('text')
                .attr('x', cx).attr('y', 22)
                .attr('text-anchor', 'middle')
                .attr('font-size', 13).attr('font-weight', 'bold')
                .attr('fill', tc.text).attr('font-family', FONT)
                .text('Datacenter Traffic Patterns')

            // Border Router / Internet zone
            const borderY = 55
            const dcTop = 100
            const dcBottom = 380
            const dcLeft = 40
            const dcRight = width - 40

            // Internet cloud
            g.append('ellipse')
                .attr('cx', cx).attr('cy', borderY)
                .attr('rx', 80).attr('ry', 20)
                .attr('fill', tc.cyanFill).attr('stroke', tc.cyanStroke)
                .attr('stroke-dasharray', '4,3')

            g.append('text')
                .attr('x', cx).attr('y', borderY + 4)
                .attr('text-anchor', 'middle')
                .attr('font-size', 10).attr('font-weight', 600)
                .attr('fill', tc.cyanText).attr('font-family', FONT)
                .text('Internet / Client')

            // Datacenter box
            g.append('rect')
                .attr('x', dcLeft).attr('y', dcTop)
                .attr('width', dcRight - dcLeft).attr('height', dcBottom - dcTop)
                .attr('rx', 12)
                .attr('fill', 'transparent')
                .attr('stroke', tc.border)
                .attr('stroke-width', 1.5)
                .attr('stroke-dasharray', '6,4')

            g.append('text')
                .attr('x', dcLeft + 12).attr('y', dcTop + 18)
                .attr('font-size', 10).attr('font-weight', 700)
                .attr('fill', tc.textMuted).attr('font-family', MONO)
                .text('Datacenter')

            // Border devices
            const borderDevY = dcTop + 40
            const borderDevices = [
                { label: 'Border Router', x: cx, y: borderDevY },
                { label: 'Core Firewall', x: cx, y: borderDevY + 45 },
                { label: 'Core Switch', x: cx, y: borderDevY + 90 },
            ]

            borderDevices.forEach(dev => {
                const devG = g.append('g').attr('transform', `translate(${dev.x},${dev.y})`)
                devG.append('rect')
                    .attr('x', -55).attr('y', -13)
                    .attr('width', 110).attr('height', 26)
                    .attr('rx', 6)
                    .attr('fill', tc.amberFill).attr('stroke', tc.amberStroke)
                devG.append('text')
                    .attr('text-anchor', 'middle').attr('y', 4)
                    .attr('font-size', 9).attr('font-weight', 600)
                    .attr('fill', tc.amberText).attr('font-family', FONT)
                    .text(dev.label)
            })

            // Connect border devices vertically
            for (let i = 0; i < borderDevices.length - 1; i++) {
                g.append('line')
                    .attr('x1', cx).attr('y1', borderDevices[i].y + 13)
                    .attr('x2', cx).attr('y2', borderDevices[i + 1].y - 13)
                    .attr('stroke', tc.border).attr('stroke-width', 1)
            }

            // Connect Internet to Border Router
            g.append('line')
                .attr('x1', cx).attr('y1', borderY + 20)
                .attr('x2', cx).attr('y2', borderDevices[0].y - 13)
                .attr('stroke', tc.border).attr('stroke-width', 1)

            // Server racks (bottom)
            const rackY = dcBottom - 60
            const racks = [
                { label: 'Web Tier', sublabel: 'Web 1~3', x: cx - 150, color: 'blue' as const },
                { label: 'App Tier', sublabel: 'WAS 1~3', x: cx - 50, color: 'indigo' as const },
                { label: 'Cache', sublabel: 'Redis/Memcached', x: cx + 50, color: 'purple' as const },
                { label: 'DB Tier', sublabel: 'DB Primary/Replica', x: cx + 150, color: 'green' as const },
            ]

            const colorMap: Record<string, { fill: string; stroke: string; text: string }> = {
                blue: { fill: tc.blueFill, stroke: tc.blueStroke, text: tc.blueText },
                indigo: { fill: tc.indigoFill, stroke: tc.indigoStroke, text: tc.indigoText },
                purple: { fill: tc.purpleFill, stroke: tc.purpleStroke, text: tc.purpleText },
                green: { fill: tc.greenFill, stroke: tc.greenStroke, text: tc.greenText },
            }

            racks.forEach(rack => {
                const rc = colorMap[rack.color]
                const rg = g.append('g').attr('transform', `translate(${rack.x},${rackY})`)
                rg.append('rect')
                    .attr('x', -42).attr('y', -20)
                    .attr('width', 84).attr('height', 40)
                    .attr('rx', 6)
                    .attr('fill', rc.fill).attr('stroke', rc.stroke).attr('stroke-width', 1.5)
                rg.append('text')
                    .attr('text-anchor', 'middle').attr('y', -4)
                    .attr('font-size', 9).attr('font-weight', 700)
                    .attr('fill', rc.text).attr('font-family', FONT)
                    .text(rack.label)
                rg.append('text')
                    .attr('text-anchor', 'middle').attr('y', 10)
                    .attr('font-size', 7.5)
                    .attr('fill', tc.textDim).attr('font-family', MONO)
                    .text(rack.sublabel)
            })

            // Connect Core Switch to racks
            racks.forEach(rack => {
                g.append('line')
                    .attr('x1', cx).attr('y1', borderDevices[2].y + 13)
                    .attr('x2', rack.x).attr('y2', rackY - 20)
                    .attr('stroke', tc.border).attr('stroke-width', 1)
            })

            // ── North-South traffic arrows ──
            const showNS = view === 'both' || view === 'ns'
            if (showNS) {
                // Arrow defs
                svg.select('defs').remove()
                const defs = svg.append('defs')
                defs.append('marker')
                    .attr('id', 'ns-arrow')
                    .attr('viewBox', '0 0 10 7').attr('refX', 10).attr('refY', 3.5)
                    .attr('markerWidth', 8).attr('markerHeight', 6).attr('orient', 'auto')
                    .append('polygon').attr('points', '0 0, 10 3.5, 0 7').attr('fill', tc.blueStroke)

                defs.append('marker')
                    .attr('id', 'ew-arrow')
                    .attr('viewBox', '0 0 10 7').attr('refX', 10).attr('refY', 3.5)
                    .attr('markerWidth', 8).attr('markerHeight', 6).attr('orient', 'auto')
                    .append('polygon').attr('points', '0 0, 10 3.5, 0 7').attr('fill', tc.amberStroke)

                // NS down arrow (left side)
                const nsX = dcLeft + 18
                g.append('line')
                    .attr('x1', nsX).attr('y1', borderY + 20)
                    .attr('x2', nsX).attr('y2', rackY - 10)
                    .attr('stroke', tc.blueStroke).attr('stroke-width', 2.5)
                    .attr('stroke-dasharray', '6,3')
                    .attr('marker-end', 'url(#ns-arrow)')
                    .attr('opacity', 0.8)

                // NS up arrow (slightly right)
                g.append('line')
                    .attr('x1', nsX + 10).attr('y1', rackY - 10)
                    .attr('x2', nsX + 10).attr('y2', borderY + 20)
                    .attr('stroke', tc.blueStroke).attr('stroke-width', 2.5)
                    .attr('stroke-dasharray', '6,3')
                    .attr('marker-end', 'url(#ns-arrow)')
                    .attr('opacity', 0.8)

                // NS label
                g.append('text')
                    .attr('x', nsX + 5).attr('y', (borderY + 20 + rackY - 10) / 2)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', 9).attr('font-weight', 700)
                    .attr('fill', tc.blueText).attr('font-family', MONO)
                    .attr('transform', `rotate(-90, ${nsX + 5}, ${(borderY + 20 + rackY - 10) / 2})`)
                    .text('North-South (N-S)')

                // NS badge
                g.append('rect')
                    .attr('x', 10).attr('y', height - 50)
                    .attr('width', 180).attr('height', 22)
                    .attr('rx', 4)
                    .attr('fill', tc.blueFill).attr('stroke', tc.blueStroke)

                g.append('text')
                    .attr('x', 100).attr('y', height - 35)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', 8.5).attr('font-weight', 600)
                    .attr('fill', tc.blueText).attr('font-family', FONT)
                    .text('N-S: Client - Server (외부-내부)')
            }

            // ── East-West traffic arrows ──
            const showEW = view === 'both' || view === 'ew'
            if (showEW) {
                if (!svg.select('defs').node()) {
                    const defs = svg.append('defs')
                    defs.append('marker')
                        .attr('id', 'ew-arrow')
                        .attr('viewBox', '0 0 10 7').attr('refX', 10).attr('refY', 3.5)
                        .attr('markerWidth', 8).attr('markerHeight', 6).attr('orient', 'auto')
                        .append('polygon').attr('points', '0 0, 10 3.5, 0 7').attr('fill', tc.amberStroke)
                }

                const ewY = rackY + 30
                // EW arrows between racks
                const ewPairs = [
                    { from: racks[0].x, to: racks[1].x, label: 'API Call' },
                    { from: racks[1].x, to: racks[2].x, label: 'Cache R/W' },
                    { from: racks[1].x, to: racks[3].x, label: 'DB Query' },
                ]

                ewPairs.forEach((pair, i) => {
                    const y = ewY + i * 14
                    g.append('line')
                        .attr('x1', pair.from + 42).attr('y1', rackY + 2 + i * 4)
                        .attr('x2', pair.to - 42).attr('y2', rackY + 2 + i * 4)
                        .attr('stroke', tc.amberStroke).attr('stroke-width', 2)
                        .attr('stroke-dasharray', '4,3')
                        .attr('marker-end', 'url(#ew-arrow)')
                        .attr('opacity', 0.8)

                    g.append('text')
                        .attr('x', (pair.from + pair.to) / 2).attr('y', y + 22)
                        .attr('text-anchor', 'middle')
                        .attr('font-size', 7.5)
                        .attr('fill', tc.amberText).attr('font-family', MONO)
                        .text(pair.label)
                })

                // EW badge
                g.append('rect')
                    .attr('x', width - 200).attr('y', height - 50)
                    .attr('width', 190).attr('height', 22)
                    .attr('rx', 4)
                    .attr('fill', tc.amberFill).attr('stroke', tc.amberStroke)

                g.append('text')
                    .attr('x', width - 105).attr('y', height - 35)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', 8.5).attr('font-weight', 600)
                    .attr('fill', tc.amberText).attr('font-family', FONT)
                    .text('E-W: Server - Server (내부-내부)')
            }
        },
        [isDark, view],
    )

    return (
        <div className="space-y-3">
            <D3Container
                renderFn={renderFn}
                deps={[isDark, view]}
                height={450}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                zoomable
            />
            <div className="flex justify-center gap-2">
                {([
                    ['both', '전체 보기'],
                    ['ns', 'North-South만'],
                    ['ew', 'East-West만'],
                ] as [ViewMode, string][]).map(([mode, label]) => (
                    <button
                        key={mode}
                        onClick={() => setView(mode)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                            view === mode
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    )
}
