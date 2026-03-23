import { useCallback, useState } from 'react'
import * as d3 from 'd3'
import { createColorMap,themeColors,useIsDark , D3Container, createD3Theme } from '@study-ui/components'

type ColorName = 'blue' | 'amber' | 'red' | 'green' | 'cyan' | 'purple' | 'indigo'

interface DeviceNode {
    id: string
    label: string
    sublabel: string
    /** Fraction 0..1 of usable width */
    fx: number
    /** 0 = top row, 1 = bottom row */
    row: 0 | 1
    color: ColorName
}

interface FlowArrow {
    from: string
    to: string
    label: string
    sublabel?: string
}

const devices: Omit<DeviceNode, 'x' | 'y'>[] = [
    // Top row (left to right): Client → Switch → Router → Firewall
    { id: 'client', label: 'Client', sublabel: '192.168.1.10', fx: 0, row: 0, color: 'cyan' },
    { id: 'switch', label: 'L2 Switch', sublabel: 'VLAN 10', fx: 1 / 3, row: 0, color: 'green' },
    { id: 'router', label: 'Router', sublabel: 'Gateway', fx: 2 / 3, row: 0, color: 'amber' },
    { id: 'firewall', label: 'Firewall', sublabel: 'Stateful Inspection', fx: 1, row: 0, color: 'red' },
    // Bottom row (right to left): LB → Web → WAS → DB
    { id: 'lb', label: 'Load Balancer', sublabel: 'VIP: 203.0.113.80', fx: 1, row: 1, color: 'purple' },
    { id: 'web', label: 'Web Server', sublabel: '10.10.1.11', fx: 2 / 3, row: 1, color: 'blue' },
    { id: 'was', label: 'WAS', sublabel: '10.10.2.21', fx: 1 / 3, row: 1, color: 'indigo' },
    { id: 'db', label: 'Database', sublabel: '10.10.3.31', fx: 0, row: 1, color: 'green' },
]

const flows: FlowArrow[] = [
    { from: 'client', to: 'switch', label: 'Ethernet Frame', sublabel: 'MAC 주소 기반 전달' },
    { from: 'switch', to: 'router', label: 'IP Routing', sublabel: 'L3 경로 결정' },
    { from: 'router', to: 'firewall', label: 'Filtered', sublabel: 'ACL / Stateful 검사' },
    { from: 'firewall', to: 'lb', label: 'DNAT', sublabel: 'VIP → Real IP 변환' },
    { from: 'lb', to: 'web', label: 'HTTP Request', sublabel: '서버 선택 (RR/WRR)' },
    { from: 'web', to: 'was', label: 'API Call', sublabel: '비즈니스 로직 처리' },
    { from: 'was', to: 'db', label: 'SQL Query', sublabel: '데이터 조회/저장' },
]

const explanations = [
    'Client가 DNS로 IP를 확인 후 SYN 패킷 전송 (MAC: Gateway 주소)',
    'L2 Switch가 MAC 주소 테이블로 프레임을 포워딩',
    'Router가 목적지 IP 기반 라우팅 결정, Next Hop으로 전달',
    'Firewall이 세션 테이블 확인, 정책에 따라 허용/차단',
    'Load Balancer가 DNAT으로 VIP를 실제 서버 IP로 변환',
    'Web Server가 정적 콘텐츠 처리 후 동적 요청을 WAS로 전달',
    'WAS가 비즈니스 로직 처리, 필요시 DB에 쿼리',
]

export function TrafficFlowDiagram() {
    const isDark = useIsDark()
    const [step, setStep] = useState(-1)

    const renderFn = useCallback(
        (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, height: number) => {
            const tc = themeColors(isDark)
            const theme = createD3Theme(isDark)
            const g = svg.append('g')
            const cx = width / 2

            // ── Responsive metrics ──
            const fontSize = Math.max(8, Math.min(12, width / 45))
            const subFontSize = Math.max(6.5, fontSize * 0.75)
            const titleSize = Math.max(10, Math.min(14, width / 35))
            const boxW = Math.max(90, Math.min(150, (width - 80) / 4.5))
            const boxH = Math.max(28, Math.min(40, boxW * 0.3))
            const boxR = Math.min(8, boxH / 4)

            // Padding from edges
            const padX = Math.max(20, width * 0.06)
            const usableW = width - padX * 2 - boxW

            // Vertical layout
            const titleY = Math.max(18, height * 0.05)
            const topRowY = titleY + boxH * 1.5
            const bottomRowY = height - boxH * 2.5

            // ── Title ──
            g.append('text')
                .attr('x', cx).attr('y', titleY)
                .attr('text-anchor', 'middle')
                .attr('font-size', titleSize).attr('font-weight', 'bold')
                .attr('fill', tc.text).attr('font-family', theme.fonts.sans)
                .text('End-to-End Request Flow')

            // ── Color map ──
            const _colorMap = createColorMap(tc, ['blue', 'amber', 'red', 'green', 'cyan', 'purple', 'indigo'])
            const colorMap = (c: string) => _colorMap[c] || _colorMap.blue

            // ── Compute positions ──
            const positioned = devices.map(d => ({
                ...d,
                x: padX + boxW / 2 + d.fx * usableW,
                y: d.row === 0 ? topRowY : bottomRowY,
            }))
            const devMap = new Map(positioned.map(d => [d.id, d]))

            // ── Arrowhead marker ──
            const defs = svg.append('defs')
            defs.append('marker')
                .attr('id', 'flow-arrow')
                .attr('viewBox', '0 0 10 7')
                .attr('refX', 10).attr('refY', 3.5)
                .attr('markerWidth', 8).attr('markerHeight', 6)
                .attr('orient', 'auto')
                .append('polygon')
                .attr('points', '0 0, 10 3.5, 0 7')
                .attr('fill', tc.blueStroke)

            defs.append('marker')
                .attr('id', 'flow-arrow-dim')
                .attr('viewBox', '0 0 10 7')
                .attr('refX', 10).attr('refY', 3.5)
                .attr('markerWidth', 8).attr('markerHeight', 6)
                .attr('orient', 'auto')
                .append('polygon')
                .attr('points', '0 0, 10 3.5, 0 7')
                .attr('fill', tc.border)

            // ── Draw flow arrows ──
            flows.forEach((flow, i) => {
                const s = devMap.get(flow.from)!
                const t = devMap.get(flow.to)!
                const active = step === -1 || step === i
                const opacity = active ? 1 : 0.2

                const arrowG = g.append('g').attr('opacity', opacity)

                // The U-turn arrow (firewall → lb) is vertical; others are horizontal within rows
                const isVertical = s.row !== t.row

                if (isVertical) {
                    // Vertical connector on the right side (U-shape turn)
                    arrowG.append('line')
                        .attr('x1', s.x).attr('y1', s.y + boxH / 2)
                        .attr('x2', t.x).attr('y2', t.y - boxH / 2)
                        .attr('stroke', active ? tc.blueStroke : tc.border)
                        .attr('stroke-width', active ? 2 : 1)
                        .attr('marker-end', active ? 'url(#flow-arrow)' : 'url(#flow-arrow-dim)')
                } else {
                    // Horizontal within same row
                    const dir = t.x > s.x ? 1 : -1
                    arrowG.append('line')
                        .attr('x1', s.x + dir * boxW / 2).attr('y1', s.y)
                        .attr('x2', t.x - dir * boxW / 2).attr('y2', t.y)
                        .attr('stroke', active ? tc.blueStroke : tc.border)
                        .attr('stroke-width', active ? 2 : 1)
                        .attr('marker-end', active ? 'url(#flow-arrow)' : 'url(#flow-arrow-dim)')
                }

                // Step number badge on the arrow midpoint
                const mx = (s.x + t.x) / 2
                const my = isVertical
                    ? (s.y + boxH / 2 + t.y - boxH / 2) / 2
                    : s.y

                const badgeR = Math.max(7, fontSize * 0.7)
                const badgeOffsetX = isVertical ? -badgeR * 2.2 : 0
                const badgeOffsetY = isVertical ? 0 : -badgeR * 1.6

                arrowG.append('circle')
                    .attr('cx', mx + badgeOffsetX).attr('cy', my + badgeOffsetY)
                    .attr('r', badgeR)
                    .attr('fill', active ? tc.blueFill : tc.bgCard)
                    .attr('stroke', active ? tc.blueStroke : tc.border)

                arrowG.append('text')
                    .attr('x', mx + badgeOffsetX).attr('y', my + badgeOffsetY + badgeR * 0.35)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', badgeR * 1.1).attr('font-weight', 700)
                    .attr('fill', active ? tc.blueText : tc.textDim)
                    .attr('font-family', theme.fonts.mono)
                    .text(String(i + 1))

                // Arrow label (only when this step is active and in step mode)
                if (active && step !== -1) {
                    const labelX = isVertical ? mx - badgeR * 4 : mx
                    const labelY = isVertical ? my : my - badgeR * 3
                    const anchor = isVertical ? 'end' : 'middle'

                    arrowG.append('text')
                        .attr('x', labelX).attr('y', labelY - subFontSize * 0.3)
                        .attr('text-anchor', anchor)
                        .attr('font-size', subFontSize * 1.1).attr('font-weight', 600)
                        .attr('fill', tc.blueText).attr('font-family', theme.fonts.mono)
                        .text(flow.label)

                    if (flow.sublabel) {
                        arrowG.append('text')
                            .attr('x', labelX).attr('y', labelY + subFontSize * 1.1)
                            .attr('text-anchor', anchor)
                            .attr('font-size', subFontSize)
                            .attr('fill', tc.textDim).attr('font-family', theme.fonts.sans)
                            .text(flow.sublabel)
                    }
                }
            })

            // ── Draw device nodes ──
            positioned.forEach(dev => {
                const colors = colorMap(dev.color)
                const nodeG = g.append('g').attr('transform', `translate(${dev.x},${dev.y})`)

                nodeG.append('rect')
                    .attr('x', -boxW / 2).attr('y', -boxH / 2)
                    .attr('width', boxW).attr('height', boxH)
                    .attr('rx', boxR)
                    .attr('fill', colors.fill)
                    .attr('stroke', colors.stroke)
                    .attr('stroke-width', 1.5)

                nodeG.append('text')
                    .attr('y', -boxH * 0.08)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', fontSize).attr('font-weight', 700)
                    .attr('fill', colors.text).attr('font-family', theme.fonts.sans)
                    .text(dev.label)

                nodeG.append('text')
                    .attr('y', boxH * 0.28)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', subFontSize)
                    .attr('fill', tc.textDim).attr('font-family', theme.fonts.mono)
                    .text(dev.sublabel)
            })

            // ── U-shape flow guide (dimmed path outline) ──
            const topLeft = devMap.get('client')!
            const topRight = devMap.get('firewall')!
            const botRight = devMap.get('lb')!
            const botLeft = devMap.get('db')!

            g.append('path')
                .attr('d', `M ${topLeft.x} ${topLeft.y - boxH / 2 - 6}
                    L ${topRight.x} ${topRight.y - boxH / 2 - 6}
                    L ${botRight.x} ${botRight.y + boxH / 2 + 6}
                    L ${botLeft.x} ${botLeft.y + boxH / 2 + 6}`)
                .attr('fill', 'none')
                .attr('stroke', tc.border)
                .attr('stroke-width', 1)
                .attr('stroke-dasharray', '4,4')
                .attr('opacity', 0.4)

            // Row direction labels
            const arrowLabelSize = Math.max(7, fontSize * 0.7)
            g.append('text')
                .attr('x', cx).attr('y', topRowY - boxH / 2 - 10)
                .attr('text-anchor', 'middle')
                .attr('font-size', arrowLabelSize)
                .attr('fill', tc.textDim).attr('font-family', theme.fonts.sans)
                .text('→ Request 방향 →')

            g.append('text')
                .attr('x', cx).attr('y', bottomRowY + boxH / 2 + arrowLabelSize + 8)
                .attr('text-anchor', 'middle')
                .attr('font-size', arrowLabelSize)
                .attr('fill', tc.textDim).attr('font-family', theme.fonts.sans)
                .text('← 내부 처리 방향 ←')

            // ── Step explanation box ──
            if (step >= 0 && step < explanations.length) {
                const boxPad = Math.max(12, width * 0.03)
                const expBoxH = Math.max(24, boxH * 0.8)
                const boxY = height - expBoxH - 6

                g.append('rect')
                    .attr('x', boxPad).attr('y', boxY)
                    .attr('width', width - boxPad * 2).attr('height', expBoxH)
                    .attr('rx', 6)
                    .attr('fill', tc.blueFill).attr('stroke', tc.blueStroke)

                const stepText = `Step ${step + 1}: ${explanations[step]}`
                const expFontSize = Math.max(7.5, Math.min(10, width / 55))

                g.append('text')
                    .attr('x', cx).attr('y', boxY + expBoxH / 2 + expFontSize * 0.35)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', expFontSize)
                    .attr('fill', tc.blueText).attr('font-family', theme.fonts.sans)
                    .text(stepText)
            }
        },
        [isDark, step],
    )

    return (
        <div className="space-y-3">
            <D3Container
                renderFn={renderFn}
                deps={[isDark, step]}
                height={380}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                zoomable
            />
            <div className="flex justify-center gap-3">
                <button
                    onClick={() => setStep(prev => (prev > -1 ? prev - 1 : 6))}
                    className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    {step <= 0 ? '전체 보기' : '이전'}
                </button>
                <span className="self-center text-xs text-gray-500 dark:text-gray-400 font-mono">
                    {step === -1 ? '전체 경로' : `Step ${step + 1} / 7`}
                </span>
                <button
                    onClick={() => setStep(prev => (prev < 6 ? prev + 1 : -1))}
                    className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
                >
                    {step === -1 ? '단계별 보기' : step < 6 ? '다음' : '전체 보기'}
                </button>
            </div>
        </div>
    )
}
