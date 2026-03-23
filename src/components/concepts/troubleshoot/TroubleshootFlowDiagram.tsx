import { useCallback, useState } from 'react'
import { createD3Theme,themeColors,useIsDark , D3Container } from '@study-ui/components'
import * as d3 from 'd3'

interface FlowNode {
    id: string
    label: string
    sublabel?: string
    type: 'start' | 'decision' | 'action' | 'result'
    x: number
    y: number
}

interface FlowEdge {
    from: string
    to: string
    label?: string
    path?: 'left' | 'right' | 'down'
}

const nodes: FlowNode[] = [
    { id: 'start', label: '접속 불가 발생', type: 'start', x: 300, y: 30 },
    { id: 'd1', label: 'ping 게이트웨이', sublabel: '로컬 네트워크 확인', type: 'decision', x: 300, y: 110 },
    { id: 'a1', label: 'L1/L2 점검', sublabel: '케이블, NIC, 스위치 확인', type: 'result', x: 80, y: 110 },
    { id: 'd2', label: 'ping 목적지', sublabel: '원격 도달성 확인', type: 'decision', x: 300, y: 200 },
    { id: 'a2', label: '경로 분석', sublabel: 'traceroute/mtr로 구간 확인', type: 'result', x: 80, y: 200 },
    { id: 'd3', label: 'DNS 확인', sublabel: 'dig/nslookup 테스트', type: 'decision', x: 300, y: 290 },
    { id: 'a3', label: 'DNS 장애 처리', sublabel: 'resolv.conf, DNS 서버 확인', type: 'result', x: 80, y: 290 },
    { id: 'd4', label: 'TCP 연결 확인', sublabel: 'telnet/curl/ss 확인', type: 'decision', x: 300, y: 380 },
    { id: 'a4', label: 'TCP/방화벽 점검', sublabel: 'SYN 차단, RST, timeout 분석', type: 'result', x: 80, y: 380 },
    { id: 'd5', label: '응용 계층 확인', sublabel: 'HTTP 상태, TLS, 로그 확인', type: 'decision', x: 300, y: 470 },
    { id: 'a5', label: '서비스/앱 점검', sublabel: '설정, 로그, 프로세스 확인', type: 'result', x: 80, y: 470 },
    { id: 'end', label: '정상 동작 확인', type: 'action', x: 300, y: 545 },
]

const edges: FlowEdge[] = [
    { from: 'start', to: 'd1', path: 'down' },
    { from: 'd1', to: 'a1', label: '실패', path: 'left' },
    { from: 'd1', to: 'd2', label: '성공', path: 'down' },
    { from: 'd2', to: 'a2', label: '실패', path: 'left' },
    { from: 'd2', to: 'd3', label: '성공', path: 'down' },
    { from: 'd3', to: 'a3', label: '실패', path: 'left' },
    { from: 'd3', to: 'd4', label: '성공', path: 'down' },
    { from: 'd4', to: 'a4', label: '실패', path: 'left' },
    { from: 'd4', to: 'd5', label: '성공', path: 'down' },
    { from: 'd5', to: 'a5', label: '실패', path: 'left' },
    { from: 'd5', to: 'end', label: '성공', path: 'down' },
]

export function TroubleshootFlowDiagram() {
    const isDark = useIsDark()
    const [activeStep, setActiveStep] = useState(0)

    const stepOrder = ['start', 'd1', 'd2', 'd3', 'd4', 'd5', 'end']

    const render = useCallback(
        (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, _height: number) => {
            const c = themeColors(isDark)
            const theme = createD3Theme(isDark)
            const g = svg.append('g')

            const scaleX = Math.min(width / 600, 1)
            const offsetX = (width - 600 * scaleX) / 2

            g.attr('transform', `translate(${offsetX}, 10) scale(${scaleX}, 1)`)

            const font = theme.fonts.sans


            // Title
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', 18)
                .attr('text-anchor', 'middle')
                .attr('font-size', 13)
                .attr('font-weight', 'bold')
                .attr('fill', c.text)
                .attr('font-family', font)
                .text('체계적 장애 분석 흐름도')

            const colorMap = {
                start: { fill: c.amberFill, stroke: c.amberStroke, text: c.amberText },
                decision: { fill: c.blueFill, stroke: c.blueStroke, text: c.blueText },
                action: { fill: c.greenFill, stroke: c.greenStroke, text: c.greenText },
                result: { fill: c.redFill, stroke: c.redStroke, text: c.redText },
            }

            // Draw edges with animation
            edges.forEach((edge) => {
                const fromNode = nodes.find((n) => n.id === edge.from)!
                const toNode = nodes.find((n) => n.id === edge.to)!

                const fromIdx = stepOrder.indexOf(edge.from)
                const isActive = fromIdx <= activeStep && fromIdx >= 0

                let pathData: string
                const boxW = 180
                const boxH = 55

                if (edge.path === 'left') {
                    const startX = fromNode.x - boxW / 2
                    const startY = fromNode.y + boxH / 2
                    const endX = toNode.x + 75
                    const endY = toNode.y + boxH / 2
                    pathData = `M${startX},${startY} L${startX - 20},${startY} L${endX + 20},${endY} L${endX},${endY}`
                } else {
                    const startX = fromNode.x
                    const startY = fromNode.y + boxH
                    const endX = toNode.x
                    const endY = toNode.y
                    pathData = `M${startX},${startY} L${endX},${endY}`
                }

                g.append('path')
                    .attr('d', pathData)
                    .attr('fill', 'none')
                    .attr('stroke', isActive ? c.blueStroke : c.border)
                    .attr('stroke-width', isActive ? 2 : 1.2)
                    .attr('stroke-dasharray', isActive ? 'none' : '4,3')
                    .attr('marker-end', 'none')
                    .attr('opacity', isActive ? 1 : 0.5)

                // Edge label
                if (edge.label) {
                    let lx: number, ly: number
                    if (edge.path === 'left') {
                        lx = fromNode.x - boxW / 2 - 15
                        ly = fromNode.y + boxH / 2 - 6
                    } else {
                        lx = fromNode.x + 12
                        ly = (fromNode.y + boxH + toNode.y) / 2
                    }

                    const isSuccess = edge.label === '성공'
                    g.append('text')
                        .attr('x', lx)
                        .attr('y', ly)
                        .attr('text-anchor', 'middle')
                        .attr('font-size', 10)
                        .attr('font-family', font)
                        .attr('fill', isSuccess ? c.greenText : c.redText)
                        .attr('font-weight', '600')
                        .text(edge.label)
                }
            })

            // Draw nodes
            nodes.forEach((node) => {
                const col = colorMap[node.type]
                const stepIdx = stepOrder.indexOf(node.id)
                const isActive = stepIdx >= 0 && stepIdx <= activeStep
                const isCurrent = stepIdx === activeStep
                const isResultNode = node.type === 'result'

                // result nodes are smaller
                const boxW = isResultNode ? 150 : 180
                const boxH = isResultNode ? 50 : 55
                const rx = node.type === 'start' ? 24 : node.type === 'action' ? 24 : 8
                const x = isResultNode ? node.x - boxW / 2 : node.x - boxW / 2
                const y = node.y

                // Glow for current step
                if (isCurrent && !isResultNode) {
                    g.append('rect')
                        .attr('x', x - 3)
                        .attr('y', y - 3)
                        .attr('width', boxW + 6)
                        .attr('height', boxH + 6)
                        .attr('rx', rx + 2)
                        .attr('fill', 'none')
                        .attr('stroke', col.stroke)
                        .attr('stroke-width', 2)
                        .attr('opacity', 0.5)
                        .append('animate')
                        .attr('attributeName', 'opacity')
                        .attr('values', '0.5;1;0.5')
                        .attr('dur', '2s')
                        .attr('repeatCount', 'indefinite')
                }

                g.append('rect')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('width', boxW)
                    .attr('height', boxH)
                    .attr('rx', rx)
                    .attr('fill', isActive || isResultNode ? col.fill : c.bgCard)
                    .attr('stroke', isActive || isResultNode ? col.stroke : c.border)
                    .attr('stroke-width', isActive ? 2 : 1.2)
                    .attr('opacity', isActive || isResultNode ? 1 : 0.4)

                g.append('text')
                    .attr('x', x + boxW / 2)
                    .attr('y', y + (node.sublabel ? 20 : boxH / 2 + 4))
                    .attr('text-anchor', 'middle')
                    .attr('font-size', isResultNode ? 11 : 12)
                    .attr('font-weight', '600')
                    .attr('fill', isActive || isResultNode ? col.text : c.textMuted)
                    .attr('font-family', font)
                    .text(node.label)

                if (node.sublabel) {
                    g.append('text')
                        .attr('x', x + boxW / 2)
                        .attr('y', y + 37)
                        .attr('text-anchor', 'middle')
                        .attr('font-size', 9)
                        .attr('fill', isActive || isResultNode ? c.textMuted : c.textDim)
                        .attr('font-family', font)
                        .text(node.sublabel)
                }
            })
        },
        [isDark, activeStep],
    )

    return (
        <div className="space-y-3">
            <D3Container renderFn={render} deps={[isDark, activeStep]} height={640} />
            <div className="flex items-center justify-center gap-2">
                <button
                    onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                    disabled={activeStep === 0}
                    className="px-3 py-1.5 text-xs font-mono rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
                >
                    이전 단계
                </button>
                <span className="text-xs font-mono text-gray-500 dark:text-gray-400 min-w-[60px] text-center">
                    {activeStep + 1} / {stepOrder.length}
                </span>
                <button
                    onClick={() => setActiveStep(Math.min(stepOrder.length - 1, activeStep + 1))}
                    disabled={activeStep === stepOrder.length - 1}
                    className="px-3 py-1.5 text-xs font-mono rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
                >
                    다음 단계
                </button>
                <button
                    onClick={() => setActiveStep(0)}
                    className="px-3 py-1.5 text-xs font-mono rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    초기화
                </button>
            </div>
        </div>
    )
}
