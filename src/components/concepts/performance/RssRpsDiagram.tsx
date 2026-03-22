import { useCallback, useState } from 'react'
import { D3Container } from '../../viz/D3Container'
import { themeColors, createColorMap } from '../../../lib/colors'
import { useIsDark } from '../../../hooks/useIsDark'
import * as d3 from 'd3'

type Mode = 'rss' | 'rps'

export function RssRpsDiagram() {
    const isDark = useIsDark()
    const [mode, setMode] = useState<Mode>('rss')

    const render = useCallback(
        (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, _height: number) => {
            const c = themeColors(isDark)
            const g = svg.append('g')
            const font = "'Pretendard Variable', Pretendard, sans-serif"
            const mono = "'JetBrains Mono', monospace"

            const pad = { top: 40, left: 20, right: 20, bottom: 20 }
            const innerW = width - pad.left - pad.right
            const centerX = width / 2

            // Title
            g.append('text')
                .attr('x', centerX)
                .attr('y', 22)
                .attr('text-anchor', 'middle')
                .attr('font-size', 14)
                .attr('font-weight', 'bold')
                .attr('fill', c.text)
                .attr('font-family', font)
                .text(mode === 'rss' ? 'RSS: 하드웨어 기반 패킷 분산' : 'RPS: 소프트웨어 기반 패킷 분산')

            const queueCount = 4
            const cpuCount = 4
            const queueW = Math.min(100, (innerW - 60) / queueCount)
            const queueH = 36
            const cpuW = queueW
            const cpuH = 36

            // === NIC section ===
            const nicY = pad.top + 10
            const nicW = Math.min(innerW, queueCount * (queueW + 12) + 40)
            const nicX = centerX - nicW / 2

            g.append('rect')
                .attr('x', nicX)
                .attr('y', nicY)
                .attr('width', nicW)
                .attr('height', 120)
                .attr('rx', 8)
                .attr('fill', c.blueFill)
                .attr('stroke', c.blueStroke)
                .attr('stroke-width', 1.5)

            g.append('text')
                .attr('x', centerX)
                .attr('y', nicY + 18)
                .attr('text-anchor', 'middle')
                .attr('font-size', 12)
                .attr('font-weight', 'bold')
                .attr('fill', c.blueText)
                .attr('font-family', font)
                .text('NIC (Network Interface Card)')

            // Incoming packets arrow
            g.append('text')
                .attr('x', centerX)
                .attr('y', nicY - 6)
                .attr('text-anchor', 'middle')
                .attr('font-size', 10)
                .attr('fill', c.textMuted)
                .attr('font-family', font)
                .text('Incoming Packets')

            // RSS hash or single queue label
            const hashLabelY = nicY + 38
            if (mode === 'rss') {
                g.append('text')
                    .attr('x', centerX)
                    .attr('y', hashLabelY)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', 10)
                    .attr('fill', c.amberText)
                    .attr('font-family', mono)
                    .text('RSS Hash(src_ip, dst_ip, src_port, dst_port)')
            } else {
                g.append('text')
                    .attr('x', centerX)
                    .attr('y', hashLabelY)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', 10)
                    .attr('fill', c.textMuted)
                    .attr('font-family', mono)
                    .text('Single HW Queue (or few queues)')
            }

            // RX queues inside NIC
            const queueStartX = centerX - ((queueCount * (queueW + 8) - 8) / 2)
            const queueY = nicY + 55
            const cm = createColorMap(c, ['green', 'amber', 'purple', 'cyan'])
            const queueColors = [cm.green, cm.amber, cm.purple, cm.cyan]

            for (let i = 0; i < queueCount; i++) {
                const qx = queueStartX + i * (queueW + 8)
                const qColor = queueColors[i]

                if (mode === 'rss') {
                    g.append('rect')
                        .attr('x', qx)
                        .attr('y', queueY)
                        .attr('width', queueW)
                        .attr('height', queueH)
                        .attr('rx', 5)
                        .attr('fill', qColor.fill)
                        .attr('stroke', qColor.stroke)
                        .attr('stroke-width', 1.2)

                    g.append('text')
                        .attr('x', qx + queueW / 2)
                        .attr('y', queueY + queueH / 2 + 4)
                        .attr('text-anchor', 'middle')
                        .attr('font-size', 10)
                        .attr('font-weight', 'bold')
                        .attr('fill', qColor.text)
                        .attr('font-family', mono)
                        .text(`RX-Q${i}`)
                } else {
                    // RPS mode: single queue highlighted, others dimmed
                    const opacity = i === 0 ? 1 : 0.25
                    g.append('rect')
                        .attr('x', qx)
                        .attr('y', queueY)
                        .attr('width', queueW)
                        .attr('height', queueH)
                        .attr('rx', 5)
                        .attr('fill', i === 0 ? qColor.fill : c.bgCard)
                        .attr('stroke', i === 0 ? qColor.stroke : c.border)
                        .attr('stroke-width', 1.2)
                        .attr('opacity', opacity)

                    g.append('text')
                        .attr('x', qx + queueW / 2)
                        .attr('y', queueY + queueH / 2 + 4)
                        .attr('text-anchor', 'middle')
                        .attr('font-size', 10)
                        .attr('font-weight', 'bold')
                        .attr('fill', i === 0 ? qColor.text : c.textDim)
                        .attr('font-family', mono)
                        .attr('opacity', opacity)
                        .text(i === 0 ? 'RX-Q0' : `RX-Q${i}`)
                }
            }

            // === Middle section: IRQ / softirq ===
            const midY = nicY + 140
            const midH = mode === 'rps' ? 50 : 30

            if (mode === 'rps') {
                // Show software hash step
                const hashBoxW = Math.min(innerW - 40, 340)
                g.append('rect')
                    .attr('x', centerX - hashBoxW / 2)
                    .attr('y', midY)
                    .attr('width', hashBoxW)
                    .attr('height', midH)
                    .attr('rx', 6)
                    .attr('fill', c.amberFill)
                    .attr('stroke', c.amberStroke)
                    .attr('stroke-width', 1.2)

                g.append('text')
                    .attr('x', centerX)
                    .attr('y', midY + 16)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', 11)
                    .attr('font-weight', 'bold')
                    .attr('fill', c.amberText)
                    .attr('font-family', font)
                    .text('Software Hash (get_rps_cpu)')

                g.append('text')
                    .attr('x', centerX)
                    .attr('y', midY + 34)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', 9)
                    .attr('fill', c.amberText)
                    .attr('font-family', mono)
                    .text('hash(src_ip, dst_ip, src_port, dst_port) % num_cpus')
            } else {
                g.append('text')
                    .attr('x', centerX)
                    .attr('y', midY + 16)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', 11)
                    .attr('fill', c.textMuted)
                    .attr('font-family', font)
                    .text('IRQ -> softirq (NET_RX_SOFTIRQ)')
            }

            // === CPU section ===
            const cpuY = midY + midH + 20
            const cpuStartX = centerX - ((cpuCount * (cpuW + 8) - 8) / 2)

            for (let i = 0; i < cpuCount; i++) {
                const cx = cpuStartX + i * (cpuW + 8)
                const qColor = queueColors[i]

                g.append('rect')
                    .attr('x', cx)
                    .attr('y', cpuY)
                    .attr('width', cpuW)
                    .attr('height', cpuH)
                    .attr('rx', 5)
                    .attr('fill', qColor.fill)
                    .attr('stroke', qColor.stroke)
                    .attr('stroke-width', 1.5)

                g.append('text')
                    .attr('x', cx + cpuW / 2)
                    .attr('y', cpuY + cpuH / 2 + 4)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', 10)
                    .attr('font-weight', 'bold')
                    .attr('fill', qColor.text)
                    .attr('font-family', mono)
                    .text(`CPU ${i}`)
            }

            // CPU label
            g.append('text')
                .attr('x', centerX)
                .attr('y', cpuY + cpuH + 18)
                .attr('text-anchor', 'middle')
                .attr('font-size', 10)
                .attr('fill', c.textMuted)
                .attr('font-family', font)
                .text('Protocol Stack Processing')

            // === Arrows from queues to CPUs ===
            const arrowStartY = queueY + queueH
            const arrowEndY = cpuY

            for (let i = 0; i < queueCount; i++) {
                const qColor = queueColors[i]

                if (mode === 'rss') {
                    // Direct 1:1 mapping from queue to CPU
                    const startX = queueStartX + i * (queueW + 8) + queueW / 2
                    const endX = cpuStartX + i * (cpuW + 8) + cpuW / 2

                    g.append('line')
                        .attr('x1', startX)
                        .attr('y1', arrowStartY + 2)
                        .attr('x2', endX)
                        .attr('y2', arrowEndY - 2)
                        .attr('stroke', qColor.stroke)
                        .attr('stroke-width', 2)
                        .attr('stroke-dasharray', '4,3')
                        .attr('marker-end', `url(#arrow-${i})`)

                    // Arrow marker
                    svg.append('defs')
                        .append('marker')
                        .attr('id', `arrow-${i}`)
                        .attr('viewBox', '0 0 10 10')
                        .attr('refX', 9)
                        .attr('refY', 5)
                        .attr('markerWidth', 6)
                        .attr('markerHeight', 6)
                        .attr('orient', 'auto')
                        .append('path')
                        .attr('d', 'M 0 0 L 10 5 L 0 10 z')
                        .attr('fill', qColor.stroke)
                } else {
                    // RPS: from single queue, fan-out through hash to all CPUs
                    const startX = queueStartX + queueW / 2
                    const endX = cpuStartX + i * (cpuW + 8) + cpuW / 2

                    // From queue to hash box
                    if (i === 0) {
                        g.append('line')
                            .attr('x1', startX)
                            .attr('y1', arrowStartY + 2)
                            .attr('x2', startX)
                            .attr('y2', midY - 2)
                            .attr('stroke', queueColors[0].stroke)
                            .attr('stroke-width', 2)
                            .attr('stroke-dasharray', '4,3')
                    }

                    // From hash box to CPU
                    g.append('line')
                        .attr('x1', centerX)
                        .attr('y1', midY + midH + 2)
                        .attr('x2', endX)
                        .attr('y2', arrowEndY - 2)
                        .attr('stroke', qColor.stroke)
                        .attr('stroke-width', 1.5)
                        .attr('stroke-dasharray', '4,3')
                        .attr('marker-end', `url(#arrow-rps-${i})`)

                    svg.append('defs')
                        .append('marker')
                        .attr('id', `arrow-rps-${i}`)
                        .attr('viewBox', '0 0 10 10')
                        .attr('refX', 9)
                        .attr('refY', 5)
                        .attr('markerWidth', 6)
                        .attr('markerHeight', 6)
                        .attr('orient', 'auto')
                        .append('path')
                        .attr('d', 'M 0 0 L 10 5 L 0 10 z')
                        .attr('fill', qColor.stroke)
                }
            }

            // === Legend ===
            const legendY = cpuY + cpuH + 38
            const legendItems = mode === 'rss'
                ? [
                    { label: 'NIC 하드웨어가 해시 계산', color: c.blueText },
                    { label: 'MSI-X IRQ로 큐별 CPU 직접 매핑', color: c.greenText },
                ]
                : [
                    { label: '단일 큐에서 수신 후 커널이 해시', color: c.amberText },
                    { label: 'IPI로 타겟 CPU에 패킷 전달', color: c.greenText },
                ]

            legendItems.forEach((item, i) => {
                const lx = centerX - 140
                const ly = legendY + i * 16

                g.append('circle')
                    .attr('cx', lx)
                    .attr('cy', ly)
                    .attr('r', 4)
                    .attr('fill', item.color)

                g.append('text')
                    .attr('x', lx + 10)
                    .attr('y', ly + 4)
                    .attr('font-size', 10)
                    .attr('fill', c.textMuted)
                    .attr('font-family', font)
                    .text(item.label)
            })
        },
        [isDark, mode],
    )

    return (
        <div className="space-y-3">
            {/* Toggle buttons */}
            <div className="flex gap-2 justify-center">
                <button
                    onClick={() => setMode('rss')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        mode === 'rss'
                            ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                    }`}
                >
                    RSS (Hardware)
                </button>
                <button
                    onClick={() => setMode('rps')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        mode === 'rps'
                            ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                    }`}
                >
                    RPS (Software)
                </button>
            </div>

            <D3Container renderFn={render} deps={[isDark, mode]} height={380} />
        </div>
    )
}
