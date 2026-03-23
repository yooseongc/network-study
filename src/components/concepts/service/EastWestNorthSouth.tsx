import { useCallback, useState } from 'react'
import * as d3 from 'd3'
import { createColorMap,themeColors,useIsDark , D3Container, createD3Theme } from '@study-ui/components'

type ViewMode = 'both' | 'ns' | 'ew'

export function EastWestNorthSouth() {
    const isDark = useIsDark()
    const [view, setView] = useState<ViewMode>('both')

    const renderFn = useCallback(
        (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, height: number) => {
            const tc = themeColors(isDark)
            const theme = createD3Theme(isDark)
            const g = svg.append('g')
            const cx = width / 2

            // ── Responsive metrics ──
            const fontSize = Math.max(7.5, Math.min(11, width / 45))
            const subFontSize = Math.max(6, fontSize * 0.75)
            const titleSize = Math.max(10, Math.min(14, width / 35))
            const padX = Math.max(50, width * 0.10)

            // Rack sizing - responsive
            const rackW = Math.min(80, (width - 120) / 4)
            const rackH = Math.max(32, rackW * 0.5)
            const rackR = Math.min(6, rackH / 5)

            // Border device sizing
            const borderDevW = Math.min(120, width * 0.25)
            const borderDevH = Math.max(22, borderDevW * 0.22)

            // Vertical layout
            const titleY = Math.max(16, height * 0.04)
            const internetY = titleY + titleSize * 2.2
            const cloudRx = Math.min(80, width * 0.15)
            const cloudRy = Math.min(20, height * 0.04)

            const dcTop = internetY + cloudRy + 22
            const dcBottom = height - 50
            const dcLeft = padX
            const dcRight = width - padX

            // Border devices in top part of DC
            const borderDevStartY = dcTop + 28
            const borderDevGap = Math.max(28, (dcBottom - dcTop) * 0.1)

            // Rack row — leave space below for E-W arrows
            const rackY = dcBottom - rackH * 2.2

            // ── Title ──
            g.append('text')
                .attr('x', cx).attr('y', titleY)
                .attr('text-anchor', 'middle')
                .attr('font-size', titleSize).attr('font-weight', 'bold')
                .attr('fill', tc.text).attr('font-family', theme.fonts.sans)
                .text('Datacenter Traffic Patterns')

            // ── Marker definitions (single block) ──
            const defs = svg.append('defs')
            defs.append('marker')
                .attr('id', 'ns-arrow')
                .attr('viewBox', '0 0 10 7').attr('refX', 10).attr('refY', 3.5)
                .attr('markerWidth', 8).attr('markerHeight', 6).attr('orient', 'auto')
                .append('polygon').attr('points', '0 0, 10 3.5, 0 7').attr('fill', tc.blueStroke)

            defs.append('marker')
                .attr('id', 'ns-arrow-up')
                .attr('viewBox', '0 0 10 7').attr('refX', 0).attr('refY', 3.5)
                .attr('markerWidth', 8).attr('markerHeight', 6).attr('orient', 'auto-start-reverse')
                .append('polygon').attr('points', '0 0, 10 3.5, 0 7').attr('fill', tc.blueStroke)

            defs.append('marker')
                .attr('id', 'ew-arrow')
                .attr('viewBox', '0 0 10 7').attr('refX', 10).attr('refY', 3.5)
                .attr('markerWidth', 8).attr('markerHeight', 6).attr('orient', 'auto')
                .append('polygon').attr('points', '0 0, 10 3.5, 0 7').attr('fill', tc.amberStroke)

            // ── Internet cloud ──
            g.append('ellipse')
                .attr('cx', cx).attr('cy', internetY)
                .attr('rx', cloudRx).attr('ry', cloudRy)
                .attr('fill', tc.cyanFill).attr('stroke', tc.cyanStroke)
                .attr('stroke-dasharray', '4,3')

            g.append('text')
                .attr('x', cx).attr('y', internetY + fontSize * 0.35)
                .attr('text-anchor', 'middle')
                .attr('font-size', fontSize).attr('font-weight', 600)
                .attr('fill', tc.cyanText).attr('font-family', theme.fonts.sans)
                .text('Internet / Client')

            // ── Datacenter box ──
            g.append('rect')
                .attr('x', dcLeft).attr('y', dcTop)
                .attr('width', dcRight - dcLeft).attr('height', dcBottom - dcTop)
                .attr('rx', 12)
                .attr('fill', 'transparent')
                .attr('stroke', tc.border)
                .attr('stroke-width', 1.5)
                .attr('stroke-dasharray', '6,4')

            g.append('text')
                .attr('x', dcRight - 10).attr('y', dcTop + fontSize + 4)
                .attr('text-anchor', 'end')
                .attr('font-size', fontSize).attr('font-weight', 700)
                .attr('fill', tc.textMuted).attr('font-family', theme.fonts.mono)
                .text('Datacenter')

            // ── Border devices (centered vertically) ──
            const borderDevices = [
                { label: 'Border Router', y: borderDevStartY },
                { label: 'Core Firewall', y: borderDevStartY + borderDevGap },
                { label: 'Core Switch', y: borderDevStartY + borderDevGap * 2 },
            ]

            borderDevices.forEach(dev => {
                const devG = g.append('g').attr('transform', `translate(${cx},${dev.y})`)
                devG.append('rect')
                    .attr('x', -borderDevW / 2).attr('y', -borderDevH / 2)
                    .attr('width', borderDevW).attr('height', borderDevH)
                    .attr('rx', rackR)
                    .attr('fill', tc.amberFill).attr('stroke', tc.amberStroke)
                devG.append('text')
                    .attr('text-anchor', 'middle').attr('y', fontSize * 0.35)
                    .attr('font-size', fontSize * 0.85).attr('font-weight', 600)
                    .attr('fill', tc.amberText).attr('font-family', theme.fonts.sans)
                    .text(dev.label)
            })

            // Connect border devices vertically
            for (let i = 0; i < borderDevices.length - 1; i++) {
                g.append('line')
                    .attr('x1', cx).attr('y1', borderDevices[i].y + borderDevH / 2)
                    .attr('x2', cx).attr('y2', borderDevices[i + 1].y - borderDevH / 2)
                    .attr('stroke', tc.border).attr('stroke-width', 1)
            }

            // Connect Internet to Border Router
            g.append('line')
                .attr('x1', cx).attr('y1', internetY + cloudRy)
                .attr('x2', cx).attr('y2', borderDevices[0].y - borderDevH / 2)
                .attr('stroke', tc.border).attr('stroke-width', 1)

            // ── Server racks (evenly spaced) ──
            const racks = [
                { label: 'Web Tier', sublabel: 'Web 1~3', color: 'blue' as const },
                { label: 'App Tier', sublabel: 'WAS 1~3', color: 'indigo' as const },
                { label: 'Cache', sublabel: 'Redis/Memcached', color: 'purple' as const },
                { label: 'DB Tier', sublabel: 'DB Primary/Replica', color: 'green' as const },
            ]

            const rackAreaLeft = dcLeft + padX
            const rackAreaRight = dcRight - padX
            const rackSpacing = (rackAreaRight - rackAreaLeft - rackW) / (racks.length - 1)

            const colorMap = createColorMap(tc, ['blue', 'indigo', 'purple', 'green'])

            const rackPositions = racks.map((rack, i) => ({
                ...rack,
                x: rackAreaLeft + rackW / 2 + i * rackSpacing,
            }))

            rackPositions.forEach(rack => {
                const rc = colorMap[rack.color]
                const rg = g.append('g').attr('transform', `translate(${rack.x},${rackY})`)
                rg.append('rect')
                    .attr('x', -rackW / 2).attr('y', -rackH / 2)
                    .attr('width', rackW).attr('height', rackH)
                    .attr('rx', rackR)
                    .attr('fill', rc.fill).attr('stroke', rc.stroke).attr('stroke-width', 1.5)
                rg.append('text')
                    .attr('text-anchor', 'middle').attr('y', -rackH * 0.08)
                    .attr('font-size', fontSize * 0.85).attr('font-weight', 700)
                    .attr('fill', rc.text).attr('font-family', theme.fonts.sans)
                    .text(rack.label)
                // sublabel: truncate to fit inside rack box
                const maxChars = Math.max(4, Math.floor(rackW / (subFontSize * 0.55)))
                const subText = rack.sublabel.length > maxChars
                    ? rack.sublabel.slice(0, maxChars - 1) + '…'
                    : rack.sublabel
                rg.append('text')
                    .attr('text-anchor', 'middle').attr('y', rackH * 0.28)
                    .attr('font-size', subFontSize)
                    .attr('fill', tc.textDim).attr('font-family', theme.fonts.mono)
                    .text(subText)
            })

            // Connect Core Switch to racks
            const coreSwitchY = borderDevices[2].y
            rackPositions.forEach(rack => {
                g.append('line')
                    .attr('x1', cx).attr('y1', coreSwitchY + borderDevH / 2)
                    .attr('x2', rack.x).attr('y2', rackY - rackH / 2)
                    .attr('stroke', tc.border).attr('stroke-width', 1)
            })

            // ── North-South traffic arrows ──
            const showNS = view === 'both' || view === 'ns'
            if (showNS) {
                // N-S arrows run outside the DC box (left side)
                const nsArrowX = Math.max(22, dcLeft - 14)

                // NS down arrow
                g.append('line')
                    .attr('x1', nsArrowX).attr('y1', internetY + cloudRy)
                    .attr('x2', nsArrowX).attr('y2', rackY - rackH / 2 - 4)
                    .attr('stroke', tc.blueStroke).attr('stroke-width', 2.5)
                    .attr('stroke-dasharray', '6,3')
                    .attr('marker-end', 'url(#ns-arrow)')
                    .attr('opacity', 0.8)

                // NS up arrow
                g.append('line')
                    .attr('x1', nsArrowX + 10).attr('y1', rackY - rackH / 2 - 4)
                    .attr('x2', nsArrowX + 10).attr('y2', internetY + cloudRy)
                    .attr('stroke', tc.blueStroke).attr('stroke-width', 2.5)
                    .attr('stroke-dasharray', '6,3')
                    .attr('marker-end', 'url(#ns-arrow)')
                    .attr('opacity', 0.8)

                // NS rotated label — positioned well left of arrows so it doesn't overlap
                const nsMidY = (internetY + cloudRy + rackY - rackH / 2) / 2
                const nsLabelX = Math.max(8, nsArrowX - 12)
                g.append('text')
                    .attr('x', nsLabelX).attr('y', nsMidY)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', fontSize * 0.75).attr('font-weight', 700)
                    .attr('fill', tc.blueText).attr('font-family', theme.fonts.mono)
                    .attr('transform', `rotate(-90, ${nsLabelX}, ${nsMidY})`)
                    .text('N-S Traffic')

                // NS badge - responsive position
                const badgeW = Math.min(180, width * 0.4)
                const badgeH = Math.max(18, fontSize * 2)
                g.append('rect')
                    .attr('x', padX).attr('y', height - badgeH - 6)
                    .attr('width', badgeW).attr('height', badgeH)
                    .attr('rx', 4)
                    .attr('fill', tc.blueFill).attr('stroke', tc.blueStroke)

                g.append('text')
                    .attr('x', padX + badgeW / 2).attr('y', height - badgeH / 2 - 6 + fontSize * 0.35)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', fontSize * 0.8).attr('font-weight', 600)
                    .attr('fill', tc.blueText).attr('font-family', theme.fonts.sans)
                    .text('N-S: Client ↔ Server')
            }

            // ── East-West traffic arrows ──
            const showEW = view === 'both' || view === 'ew'
            if (showEW) {
                const ewPairs = [
                    { from: 0, to: 1, label: 'API Call' },
                    { from: 1, to: 2, label: 'Cache R/W' },
                    { from: 1, to: 3, label: 'DB Query' },
                ]

                ewPairs.forEach((pair, i) => {
                    const fromX = rackPositions[pair.from].x
                    const toX = rackPositions[pair.to].x
                    const yOff = rackY + rackH / 2 + 8 + i * (fontSize + 6)

                    g.append('line')
                        .attr('x1', fromX + rackW / 2 - 4)
                        .attr('y1', yOff)
                        .attr('x2', toX - rackW / 2 + 4)
                        .attr('y2', yOff)
                        .attr('stroke', tc.amberStroke).attr('stroke-width', 2)
                        .attr('stroke-dasharray', '4,3')
                        .attr('marker-end', 'url(#ew-arrow)')
                        .attr('opacity', 0.8)

                    g.append('text')
                        .attr('x', (fromX + toX) / 2).attr('y', yOff - 4)
                        .attr('text-anchor', 'middle')
                        .attr('font-size', subFontSize)
                        .attr('fill', tc.amberText).attr('font-family', theme.fonts.mono)
                        .text(pair.label)
                })

                // EW badge - responsive position
                const badgeW = Math.min(180, width * 0.4)
                const badgeH = Math.max(18, fontSize * 2)
                g.append('rect')
                    .attr('x', width - padX - badgeW).attr('y', height - badgeH - 6)
                    .attr('width', badgeW).attr('height', badgeH)
                    .attr('rx', 4)
                    .attr('fill', tc.amberFill).attr('stroke', tc.amberStroke)

                g.append('text')
                    .attr('x', width - padX - badgeW / 2).attr('y', height - badgeH / 2 - 6 + fontSize * 0.35)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', fontSize * 0.8).attr('font-weight', 600)
                    .attr('fill', tc.amberText).attr('font-family', theme.fonts.sans)
                    .text('E-W: Server ↔ Server')
            }
        },
        [isDark, view],
    )

    return (
        <div className="space-y-3">
            <D3Container
                renderFn={renderFn}
                deps={[isDark, view]}
                height={560}
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
