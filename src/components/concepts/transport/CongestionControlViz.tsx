import { useCallback } from 'react'
import { createD3Theme,themeColors,useIsDark , D3Container } from '@study-ui/components'
import * as d3 from 'd3'

/**
 * Generate TCP congestion window data points simulating:
 * 1. Slow Start (exponential growth)
 * 2. Congestion Avoidance (linear growth after ssthresh)
 * 3. Packet Loss → Fast Retransmit (halve cwnd, set new ssthresh)
 * 4. Recovery + Congestion Avoidance again
 */
function generateCwndData() {
    const points: { rtt: number; cwnd: number; phase: string }[] = []
    let cwnd = 1
    let ssthresh = 32
    let rtt = 0

    // Phase 1: Slow Start (exponential)
    while (cwnd < ssthresh && rtt < 50) {
        points.push({ rtt, cwnd, phase: 'slow-start' })
        cwnd *= 2
        rtt++
    }

    // Phase 2: Congestion Avoidance (linear)
    const caStart = rtt
    while (rtt < caStart + 12) {
        points.push({ rtt, cwnd, phase: 'congestion-avoidance' })
        cwnd += 1
        rtt++
    }

    // Phase 3: Packet loss event
    const lossCwnd = cwnd
    points.push({ rtt, cwnd: lossCwnd, phase: 'loss' })
    rtt++

    // Fast retransmit: set ssthresh = cwnd/2, cwnd = ssthresh
    ssthresh = Math.floor(lossCwnd / 2)
    cwnd = ssthresh

    // Phase 4: Recovery + Congestion Avoidance again
    const recoveryStart = rtt
    while (rtt < recoveryStart + 16) {
        points.push({ rtt, cwnd, phase: 'recovery' })
        cwnd += 1
        rtt++
    }

    return { points, firstSsthresh: 32, secondSsthresh: ssthresh }
}

export function CongestionControlViz() {
    const isDark = useIsDark()

    const render = useCallback(
        (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, height: number) => {
            const c = themeColors(isDark)
            const theme = createD3Theme(isDark)
            const { points, firstSsthresh, secondSsthresh } = generateCwndData()
            const g = svg.append('g')

            const margin = { top: 40, right: 30, bottom: 50, left: 55 }
            const innerW = width - margin.left - margin.right
            const innerH = height - margin.top - margin.bottom

            const chartG = g.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

            const xMax = d3.max(points, (d) => d.rtt)! + 1
            const yMax = d3.max(points, (d) => d.cwnd)! + 4

            const x = d3.scaleLinear().domain([0, xMax]).range([0, innerW])
            const y = d3.scaleLinear().domain([0, yMax]).range([innerH, 0])

            // Grid lines
            const yTicks = y.ticks(6)
            yTicks.forEach((tick) => {
                chartG
                    .append('line')
                    .attr('x1', 0)
                    .attr('y1', y(tick))
                    .attr('x2', innerW)
                    .attr('y2', y(tick))
                    .attr('stroke', c.border)
                    .attr('stroke-width', 0.5)
            })

            // ssthresh lines
            // First ssthresh
            chartG
                .append('line')
                .attr('x1', 0)
                .attr('y1', y(firstSsthresh))
                .attr('x2', innerW)
                .attr('y2', y(firstSsthresh))
                .attr('stroke', c.amberStroke)
                .attr('stroke-width', 1.5)
                .attr('stroke-dasharray', '6,4')

            chartG
                .append('text')
                .attr('x', innerW - 4)
                .attr('y', y(firstSsthresh) - 6)
                .attr('text-anchor', 'end')
                .attr('font-size', 10)
                .attr('font-family', theme.fonts.mono)
                .attr('fill', c.amberText)
                .text(`ssthresh = ${firstSsthresh}`)

            // Second ssthresh
            chartG
                .append('line')
                .attr('x1', x(points.find((p) => p.phase === 'loss')!.rtt))
                .attr('y1', y(secondSsthresh))
                .attr('x2', innerW)
                .attr('y2', y(secondSsthresh))
                .attr('stroke', c.redStroke)
                .attr('stroke-width', 1.5)
                .attr('stroke-dasharray', '6,4')

            chartG
                .append('text')
                .attr('x', innerW - 4)
                .attr('y', y(secondSsthresh) - 6)
                .attr('text-anchor', 'end')
                .attr('font-size', 10)
                .attr('font-family', theme.fonts.mono)
                .attr('fill', c.redText)
                .text(`new ssthresh = ${secondSsthresh}`)

            // Color mapping per phase
            const phaseColor: Record<string, string> = {
                'slow-start': c.blueStroke,
                'congestion-avoidance': c.greenStroke,
                loss: c.redStroke,
                recovery: c.purpleStroke,
            }

            // Draw line segments by phase
            const line = d3
                .line<{ rtt: number; cwnd: number }>()
                .x((d) => x(d.rtt))
                .y((d) => y(d.cwnd))

            // Group consecutive points by phase
            type DataPoint = { rtt: number; cwnd: number; phase: string }
            const segments: DataPoint[][] = []
            let current: DataPoint[] = []
            points.forEach((p, i) => {
                if (i === 0 || p.phase !== points[i - 1].phase) {
                    if (current.length > 0) {
                        // Overlap: include last point of previous segment in new segment
                        segments.push(current)
                        current = [points[i - 1]]
                    }
                }
                current.push(p)
            })
            if (current.length > 0) segments.push(current)

            segments.forEach((seg) => {
                chartG
                    .append('path')
                    .datum(seg)
                    .attr('d', line)
                    .attr('fill', 'none')
                    .attr('stroke', phaseColor[seg[0].phase] || c.textMuted)
                    .attr('stroke-width', 2.5)
                    .attr('stroke-linejoin', 'round')
            })

            // Data points
            points.forEach((p) => {
                if (p.phase === 'loss') {
                    // Loss marker: X shape
                    const px = x(p.rtt)
                    const py = y(p.cwnd)
                    const s = 6
                    chartG
                        .append('line')
                        .attr('x1', px - s)
                        .attr('y1', py - s)
                        .attr('x2', px + s)
                        .attr('y2', py + s)
                        .attr('stroke', c.redStroke)
                        .attr('stroke-width', 3)
                    chartG
                        .append('line')
                        .attr('x1', px + s)
                        .attr('y1', py - s)
                        .attr('x2', px - s)
                        .attr('y2', py + s)
                        .attr('stroke', c.redStroke)
                        .attr('stroke-width', 3)
                } else {
                    chartG
                        .append('circle')
                        .attr('cx', x(p.rtt))
                        .attr('cy', y(p.cwnd))
                        .attr('r', 3)
                        .attr('fill', phaseColor[p.phase] || c.textMuted)
                }
            })

            // Phase labels
            const phases = [
                { phase: 'slow-start', label: 'Slow Start', labelKo: '지수 증가' },
                { phase: 'congestion-avoidance', label: 'Congestion Avoidance', labelKo: '선형 증가' },
                { phase: 'loss', label: 'Packet Loss', labelKo: '패킷 손실!' },
                { phase: 'recovery', label: 'Fast Recovery', labelKo: '빠른 회복' },
            ]

            const phaseFirstPoint = phases.map((ph) => {
                const p = points.find((pt) => pt.phase === ph.phase)
                return p ? { ...ph, rtt: p.rtt, cwnd: p.cwnd } : null
            })

            phaseFirstPoint.forEach((ph) => {
                if (!ph) return
                const px = x(ph.rtt) + 4
                const py = Math.max(y(ph.cwnd) - 14, margin.top - 30)
                chartG
                    .append('text')
                    .attr('x', px)
                    .attr('y', py)
                    .attr('font-size', 10)
                    .attr('font-weight', 'bold')
                    .attr('font-family', theme.fonts.sans)
                    .attr('fill', phaseColor[ph.phase])
                    .text(ph.labelKo)
            })

            // Axes
            const xAxis = d3.axisBottom(x).ticks(8).tickSize(-4)
            const yAxis = d3.axisLeft(y).ticks(6).tickSize(-4)

            chartG
                .append('g')
                .attr('transform', `translate(0,${innerH})`)
                .call(xAxis)
                .call((sel) => {
                    sel.select('.domain').attr('stroke', c.border)
                    sel.selectAll('.tick line').attr('stroke', c.border)
                    sel.selectAll('.tick text')
                        .attr('fill', c.textMuted)
                        .attr('font-size', 10)
                        .attr('font-family', theme.fonts.mono)
                })

            chartG
                .append('g')
                .call(yAxis)
                .call((sel) => {
                    sel.select('.domain').attr('stroke', c.border)
                    sel.selectAll('.tick line').attr('stroke', c.border)
                    sel.selectAll('.tick text')
                        .attr('fill', c.textMuted)
                        .attr('font-size', 10)
                        .attr('font-family', theme.fonts.mono)
                })

            // Axis labels
            chartG
                .append('text')
                .attr('x', innerW / 2)
                .attr('y', innerH + 38)
                .attr('text-anchor', 'middle')
                .attr('font-size', 12)
                .attr('fill', c.textMuted)
                .attr('font-family', theme.fonts.sans)
                .text('전송 라운드 (RTT)')

            chartG
                .append('text')
                .attr('x', -innerH / 2)
                .attr('y', -40)
                .attr('text-anchor', 'middle')
                .attr('transform', 'rotate(-90)')
                .attr('font-size', 12)
                .attr('fill', c.textMuted)
                .attr('font-family', theme.fonts.sans)
                .text('혼잡 윈도우 (cwnd, segments)')

            // Title
            g.append('text')
                .attr('x', width / 2)
                .attr('y', 20)
                .attr('text-anchor', 'middle')
                .attr('font-size', 13)
                .attr('font-weight', 'bold')
                .attr('fill', c.text)
                .attr('font-family', theme.fonts.sans)
                .text('TCP 혼잡 제어: cwnd 변화 과정')

            // Legend — positioned at top-right to avoid X-axis RTT label overlap
            const legendItems = [
                { label: 'Slow Start', color: c.blueStroke },
                { label: 'Congestion Avoidance', color: c.greenStroke },
                { label: 'Packet Loss', color: c.redStroke },
                { label: 'Fast Recovery', color: c.purpleStroke },
            ]
            const legendX = margin.left + innerW - 4
            const legendY0 = margin.top + 8

            legendItems.forEach((item, i) => {
                const ly = legendY0 + i * 16
                g.append('rect')
                    .attr('x', legendX - 130)
                    .attr('y', ly - 4)
                    .attr('width', 14)
                    .attr('height', 3)
                    .attr('rx', 1.5)
                    .attr('fill', item.color)
                g.append('text')
                    .attr('x', legendX - 112)
                    .attr('y', ly)
                    .attr('font-size', 9)
                    .attr('fill', c.textMuted)
                    .attr('font-family', theme.fonts.sans)
                    .text(item.label)
            })
        },
        [isDark],
    )

    return <D3Container renderFn={render} deps={[isDark]} height={380} />
}
