import { useCallback, useState } from 'react'
import * as d3 from 'd3'
import { D3Container } from '../../viz/D3Container'
import { useTheme } from '../../../hooks/useTheme'
import { themeColors } from '../../../lib/colors'

const FONT = "'Pretendard Variable', Pretendard, sans-serif"
const MONO = "'JetBrains Mono', monospace"

interface DeviceNode {
    id: string
    label: string
    sublabel: string
    x: number
    y: number
    color: 'blue' | 'amber' | 'red' | 'green' | 'cyan' | 'purple' | 'indigo'
}

interface FlowArrow {
    from: string
    to: string
    label: string
    sublabel?: string
}

export function TrafficFlowDiagram() {
    const { theme } = useTheme()
    const isDark = theme === 'dark'
    const [step, setStep] = useState(-1)

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
                .text('End-to-End Request Flow')

            const colorMap = (c: string) => {
                const m: Record<string, { fill: string; stroke: string; text: string }> = {
                    blue: { fill: tc.blueFill, stroke: tc.blueStroke, text: tc.blueText },
                    amber: { fill: tc.amberFill, stroke: tc.amberStroke, text: tc.amberText },
                    red: { fill: tc.redFill, stroke: tc.redStroke, text: tc.redText },
                    green: { fill: tc.greenFill, stroke: tc.greenStroke, text: tc.greenText },
                    cyan: { fill: tc.cyanFill, stroke: tc.cyanStroke, text: tc.cyanText },
                    purple: { fill: tc.purpleFill, stroke: tc.purpleStroke, text: tc.purpleText },
                    indigo: { fill: tc.indigoFill, stroke: tc.indigoStroke, text: tc.indigoText },
                }
                return m[c] || m.blue
            }

            const devices: DeviceNode[] = [
                { id: 'client', label: 'Client', sublabel: '192.168.1.10', x: cx, y: 55, color: 'cyan' },
                { id: 'switch', label: 'L2 Switch', sublabel: 'VLAN 10', x: cx, y: 115, color: 'green' },
                { id: 'router', label: 'Router', sublabel: 'Gateway', x: cx, y: 175, color: 'amber' },
                { id: 'firewall', label: 'Firewall', sublabel: 'Stateful Inspection', x: cx, y: 235, color: 'red' },
                { id: 'lb', label: 'Load Balancer', sublabel: 'VIP: 203.0.113.80', x: cx, y: 295, color: 'purple' },
                { id: 'web', label: 'Web Server', sublabel: '10.10.1.11', x: cx - 120, y: 365, color: 'blue' },
                { id: 'was', label: 'WAS', sublabel: '10.10.2.21', x: cx, y: 425, color: 'indigo' },
                { id: 'db', label: 'Database', sublabel: '10.10.3.31', x: cx + 120, y: 425, color: 'green' },
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

            const devMap = new Map(devices.map(d => [d.id, d]))

            // Draw flow arrows
            flows.forEach((flow, i) => {
                const s = devMap.get(flow.from)!
                const t = devMap.get(flow.to)!
                const active = step === -1 || step === i
                const opacity = active ? 1 : 0.25

                const arrowG = g.append('g').attr('opacity', opacity)

                // Arrow line
                arrowG.append('line')
                    .attr('x1', s.x).attr('y1', s.y + 18)
                    .attr('x2', t.x).attr('y2', t.y - 18)
                    .attr('stroke', active ? tc.blueStroke : tc.border)
                    .attr('stroke-width', active ? 2 : 1)
                    .attr('marker-end', 'url(#arrowhead)')

                // Arrow label
                const mx = (s.x + t.x) / 2
                const my = (s.y + 18 + t.y - 18) / 2
                const offset = s.x === t.x ? 8 : 0

                if (active && step !== -1) {
                    arrowG.append('text')
                        .attr('x', mx + 75 + offset).attr('y', my - 4)
                        .attr('text-anchor', 'start')
                        .attr('font-size', 9).attr('font-weight', 600)
                        .attr('fill', tc.blueText).attr('font-family', MONO)
                        .text(flow.label)

                    if (flow.sublabel) {
                        arrowG.append('text')
                            .attr('x', mx + 75 + offset).attr('y', my + 8)
                            .attr('text-anchor', 'start')
                            .attr('font-size', 8)
                            .attr('fill', tc.textDim).attr('font-family', FONT)
                            .text(flow.sublabel)
                    }
                }
            })

            // Arrowhead marker
            svg.append('defs').append('marker')
                .attr('id', 'arrowhead')
                .attr('viewBox', '0 0 10 7')
                .attr('refX', 10).attr('refY', 3.5)
                .attr('markerWidth', 8).attr('markerHeight', 6)
                .attr('orient', 'auto')
                .append('polygon')
                .attr('points', '0 0, 10 3.5, 0 7')
                .attr('fill', tc.blueStroke)

            // Draw device nodes
            devices.forEach((dev, _i) => {
                const colors = colorMap(dev.color)
                const nodeG = g.append('g').attr('transform', `translate(${dev.x},${dev.y})`)

                nodeG.append('rect')
                    .attr('x', -60).attr('y', -16)
                    .attr('width', 120).attr('height', 32)
                    .attr('rx', 8)
                    .attr('fill', colors.fill)
                    .attr('stroke', colors.stroke)
                    .attr('stroke-width', 1.5)

                nodeG.append('text')
                    .attr('y', -2)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', 10).attr('font-weight', 700)
                    .attr('fill', colors.text).attr('font-family', FONT)
                    .text(dev.label)

                nodeG.append('text')
                    .attr('y', 10)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', 7.5)
                    .attr('fill', tc.textDim).attr('font-family', MONO)
                    .text(dev.sublabel)
            })

            // Step explanation
            const explanations = [
                'Client가 DNS로 IP를 확인 후 SYN 패킷 전송 (MAC: Gateway 주소)',
                'L2 Switch가 MAC 주소 테이블로 프레임을 포워딩',
                'Router가 목적지 IP 기반 라우팅 결정, Next Hop으로 전달',
                'Firewall이 세션 테이블 확인, 정책에 따라 허용/차단',
                'Load Balancer가 DNAT으로 VIP를 실제 서버 IP로 변환',
                'Web Server가 정적 콘텐츠 처리 후 동적 요청을 WAS로 전달',
                'WAS가 비즈니스 로직 처리, 필요시 DB에 쿼리',
            ]

            if (step >= 0 && step < explanations.length) {
                // Explanation box
                const boxY = height - 35
                g.append('rect')
                    .attr('x', 20).attr('y', boxY - 14)
                    .attr('width', width - 40).attr('height', 28)
                    .attr('rx', 6)
                    .attr('fill', tc.blueFill).attr('stroke', tc.blueStroke)

                g.append('text')
                    .attr('x', cx).attr('y', boxY + 3)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', 10)
                    .attr('fill', tc.blueText).attr('font-family', FONT)
                    .text(`Step ${step + 1}: ${explanations[step]}`)
            }
        },
        [isDark, step],
    )

    return (
        <div className="space-y-3">
            <D3Container
                renderFn={renderFn}
                deps={[isDark, step]}
                height={480}
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
