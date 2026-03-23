import { useCallback } from 'react'
import * as d3 from 'd3'
import { createColorMap,themeColors,useIsDark , D3Container } from '@study-ui/components'

const osiLayers = [
    { name: '7. 응용 계층', en: 'Application', protocols: 'HTTP, FTP, DNS, SMTP', color: 'purple' as const },
    { name: '6. 표현 계층', en: 'Presentation', protocols: 'SSL/TLS, JPEG, ASCII', color: 'purple' as const },
    { name: '5. 세션 계층', en: 'Session', protocols: 'NetBIOS, RPC', color: 'purple' as const },
    { name: '4. 전송 계층', en: 'Transport', protocols: 'TCP, UDP', color: 'blue' as const },
    { name: '3. 네트워크 계층', en: 'Network', protocols: 'IP, ICMP, ARP', color: 'green' as const },
    { name: '2. 데이터링크 계층', en: 'Data Link', protocols: 'Ethernet, Wi-Fi', color: 'amber' as const },
    { name: '1. 물리 계층', en: 'Physical', protocols: '전기 신호, 광섬유', color: 'amber' as const },
]

const tcpipLayers = [
    { name: '응용 계층', en: 'Application', protocols: 'HTTP, FTP, DNS, SMTP, SSH', color: 'purple' as const, span: 3 },
    { name: '전송 계층', en: 'Transport', protocols: 'TCP, UDP, QUIC', color: 'blue' as const, span: 1 },
    { name: '인터넷 계층', en: 'Internet', protocols: 'IP, ICMP, ARP', color: 'green' as const, span: 1 },
    { name: '네트워크 접근 계층', en: 'Network Access', protocols: 'Ethernet, Wi-Fi, PPP', color: 'amber' as const, span: 2 },
]

type ColorKey = 'purple' | 'blue' | 'green' | 'amber'

function getColorPair(c: ReturnType<typeof themeColors>, key: ColorKey) {
    const map = createColorMap(c, ['purple', 'blue', 'green', 'amber'])
    return map[key]
}

export function OsiTcpIpCompare() {
    const isDark = useIsDark()

    const render = useCallback(
        (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, height: number) => {
            const c = themeColors(isDark)
            const margin = { top: 44, bottom: 16, left: 16, right: 16 }
            const gap = 40
            const colW = (width - margin.left - margin.right - gap) / 2
            const layerH = (height - margin.top - margin.bottom) / 7
            const layerGap = 2

            const g = svg.append('g')

            // Titles
            g.append('text')
                .attr('x', margin.left + colW / 2)
                .attr('y', 28)
                .attr('text-anchor', 'middle')
                .attr('fill', c.text)
                .attr('font-size', 14)
                .attr('font-weight', 700)
                .attr('font-family', "'Pretendard Variable', Pretendard, sans-serif")
                .text('OSI 7계층 모델')

            g.append('text')
                .attr('x', margin.left + colW + gap + colW / 2)
                .attr('y', 28)
                .attr('text-anchor', 'middle')
                .attr('fill', c.text)
                .attr('font-size', 14)
                .attr('font-weight', 700)
                .attr('font-family', "'Pretendard Variable', Pretendard, sans-serif")
                .text('TCP/IP 4계층 모델')

            // OSI layers
            osiLayers.forEach((layer, i) => {
                const cp = getColorPair(c, layer.color)
                const y = margin.top + i * layerH
                const h = layerH - layerGap

                g.append('rect')
                    .attr('x', margin.left)
                    .attr('y', y)
                    .attr('width', colW)
                    .attr('height', h)
                    .attr('rx', 6)
                    .attr('fill', cp.fill)
                    .attr('stroke', cp.stroke)
                    .attr('stroke-width', 1.5)

                g.append('text')
                    .attr('x', margin.left + 12)
                    .attr('y', y + h / 2 - 6)
                    .attr('dominant-baseline', 'middle')
                    .attr('fill', cp.text)
                    .attr('font-size', 12)
                    .attr('font-weight', 600)
                    .attr('font-family', "'Pretendard Variable', Pretendard, sans-serif")
                    .text(layer.name)

                g.append('text')
                    .attr('x', margin.left + 12)
                    .attr('y', y + h / 2 + 10)
                    .attr('dominant-baseline', 'middle')
                    .attr('fill', c.textMuted)
                    .attr('font-size', 10)
                    .attr('font-family', "'JetBrains Mono', monospace")
                    .text(layer.protocols)
            })

            // TCP/IP layers
            let tcpY = margin.top
            tcpipLayers.forEach((layer) => {
                const cp = getColorPair(c, layer.color)
                const h = layerH * layer.span - layerGap
                const x = margin.left + colW + gap

                g.append('rect')
                    .attr('x', x)
                    .attr('y', tcpY)
                    .attr('width', colW)
                    .attr('height', h)
                    .attr('rx', 6)
                    .attr('fill', cp.fill)
                    .attr('stroke', cp.stroke)
                    .attr('stroke-width', 1.5)

                g.append('text')
                    .attr('x', x + 12)
                    .attr('y', tcpY + h / 2 - 6)
                    .attr('dominant-baseline', 'middle')
                    .attr('fill', cp.text)
                    .attr('font-size', 12)
                    .attr('font-weight', 600)
                    .attr('font-family', "'Pretendard Variable', Pretendard, sans-serif")
                    .text(layer.name)

                g.append('text')
                    .attr('x', x + 12)
                    .attr('y', tcpY + h / 2 + 10)
                    .attr('dominant-baseline', 'middle')
                    .attr('fill', c.textMuted)
                    .attr('font-size', 10)
                    .attr('font-family', "'JetBrains Mono', monospace")
                    .text(layer.protocols)

                // Connection lines
                const lineX1 = margin.left + colW
                const lineX2 = x
                g.append('line')
                    .attr('x1', lineX1 + 4)
                    .attr('y1', tcpY + 1)
                    .attr('x2', lineX2 - 4)
                    .attr('y2', tcpY + 1)
                    .attr('stroke', c.textMuted)
                    .attr('stroke-width', 1)
                    .attr('stroke-dasharray', '4,3')
                    .attr('opacity', 0.6)

                g.append('line')
                    .attr('x1', lineX1 + 4)
                    .attr('y1', tcpY + h)
                    .attr('x2', lineX2 - 4)
                    .attr('y2', tcpY + h)
                    .attr('stroke', c.textMuted)
                    .attr('stroke-width', 1)
                    .attr('stroke-dasharray', '4,3')
                    .attr('opacity', 0.6)

                tcpY += h + layerGap
            })
        },
        [isDark],
    )

    return <D3Container renderFn={render} deps={[isDark]} height={380} />
}
