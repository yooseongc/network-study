import { useCallback } from 'react'
import { D3Container } from '../../viz/D3Container'
import { themeColors, createColorMap } from '../../../lib/colors'
import { useIsDark } from '../../../hooks/useIsDark'
import * as d3 from 'd3'

interface LayerDef {
    label: string
    sublabel: string
    fillKey: 'blue' | 'green' | 'amber' | 'purple' | 'cyan' | 'red' | 'indigo'
}

const layers: LayerDef[] = [
    { label: 'User Space', sublabel: 'Application (socket API: read/write/sendmsg)', fillKey: 'purple' },
    { label: 'System Call', sublabel: 'sys_sendto / sys_recvfrom / sys_read / sys_write', fillKey: 'indigo' },
    { label: 'Socket Layer', sublabel: 'struct socket, sock_sendmsg, sock_recvmsg', fillKey: 'blue' },
    { label: 'Transport (TCP/UDP)', sublabel: 'tcp_sendmsg / udp_sendmsg, tcp_v4_rcv', fillKey: 'cyan' },
    { label: 'Network (IP)', sublabel: 'ip_output / ip_rcv, ip_route_input', fillKey: 'green' },
    { label: 'Netfilter Hooks', sublabel: 'PREROUTING / INPUT / FORWARD / OUTPUT / POSTROUTING', fillKey: 'amber' },
    { label: 'Neighbor / ARP', sublabel: 'neigh_resolve_output, arp_rcv', fillKey: 'amber' },
    { label: 'Device Driver (qdisc)', sublabel: 'dev_queue_xmit / netif_receive_skb, NAPI', fillKey: 'red' },
    { label: 'NIC (Hardware)', sublabel: 'DMA ring buffer, IRQ, TX/RX descriptor', fillKey: 'red' },
]

export function LinuxNetworkStackDiagram() {
    const isDark = useIsDark()

    const render = useCallback(
        (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, _height: number) => {
            const c = themeColors(isDark)
            const g = svg.append('g')

            const pad = { top: 30, left: 20, right: 20, bottom: 20 }
            const innerW = width - pad.left - pad.right
            const boxW = Math.min(innerW, 560)
            const boxH = 40
            const gap = 6
            const totalH = layers.length * (boxH + gap) - gap
            const offsetX = pad.left + (innerW - boxW) / 2
            const offsetY = pad.top

            // Title
            g.append('text')
                .attr('x', width / 2)
                .attr('y', 18)
                .attr('text-anchor', 'middle')
                .attr('font-size', 13)
                .attr('font-weight', 'bold')
                .attr('fill', c.text)
                .attr('font-family', "'Pretendard Variable', Pretendard, sans-serif")
                .text('Linux Network Stack (Packet Flow)')

            const colorMap = createColorMap(c, ['blue', 'green', 'amber', 'purple', 'cyan', 'red', 'indigo'])

            layers.forEach((layer, i) => {
                const y = offsetY + i * (boxH + gap)
                const cm = colorMap[layer.fillKey]

                g.append('rect')
                    .attr('x', offsetX)
                    .attr('y', y)
                    .attr('width', boxW)
                    .attr('height', boxH)
                    .attr('rx', 6)
                    .attr('fill', cm.fill)
                    .attr('stroke', cm.stroke)
                    .attr('stroke-width', 1.5)

                g.append('text')
                    .attr('x', offsetX + 14)
                    .attr('y', y + 16)
                    .attr('font-size', 12)
                    .attr('font-weight', 'bold')
                    .attr('fill', cm.text)
                    .attr('font-family', "'Pretendard Variable', Pretendard, sans-serif")
                    .text(layer.label)

                const subFontSize = layer.sublabel.length > 45 ? 8 : 9.5
                g.append('text')
                    .attr('x', offsetX + 14)
                    .attr('y', y + 31)
                    .attr('font-size', subFontSize)
                    .attr('fill', c.textMuted)
                    .attr('font-family', "'JetBrains Mono', monospace")
                    .text(layer.sublabel)

                // Arrow between layers
                if (i < layers.length - 1) {
                    const arrowY = y + boxH + gap / 2
                    const arrowX = offsetX + boxW / 2
                    g.append('line')
                        .attr('x1', arrowX - 8)
                        .attr('y1', arrowY - 1)
                        .attr('x2', arrowX + 8)
                        .attr('y2', arrowY - 1)
                        .attr('stroke', 'none')
                    // Small downward triangle
                    g.append('path')
                        .attr('d', `M${arrowX - 5},${arrowY - 2} L${arrowX + 5},${arrowY - 2} L${arrowX},${arrowY + 2} Z`)
                        .attr('fill', c.textDim)
                }
            })

            // Side labels
            const txLabel = offsetY + totalH / 2 - 20
            const rxLabel = offsetY + totalH / 2 + 10

            g.append('text')
                .attr('x', offsetX - 10)
                .attr('y', txLabel)
                .attr('text-anchor', 'end')
                .attr('font-size', 10)
                .attr('fill', c.blueText)
                .attr('font-family', "'JetBrains Mono', monospace")
                .text('TX (send)')

            g.append('text')
                .attr('x', offsetX + boxW + 10)
                .attr('y', rxLabel)
                .attr('font-size', 10)
                .attr('fill', c.greenText)
                .attr('font-family', "'JetBrains Mono', monospace")
                .text('RX (recv)')

            // Down arrow for TX
            g.append('path')
                .attr('d', `M${offsetX - 15},${txLabel + 6} L${offsetX - 15},${txLabel + 30}`)
                .attr('stroke', c.blueStroke)
                .attr('stroke-width', 1.5)
                .attr('marker-end', 'none')
            g.append('path')
                .attr('d', `M${offsetX - 19},${txLabel + 26} L${offsetX - 15},${txLabel + 32} L${offsetX - 11},${txLabel + 26}`)
                .attr('fill', c.blueStroke)

            // Up arrow for RX
            g.append('path')
                .attr('d', `M${offsetX + boxW + 15},${rxLabel + 6} L${offsetX + boxW + 15},${rxLabel - 18}`)
                .attr('stroke', c.greenStroke)
                .attr('stroke-width', 1.5)
            g.append('path')
                .attr('d', `M${offsetX + boxW + 11},${rxLabel - 14} L${offsetX + boxW + 15},${rxLabel - 20} L${offsetX + boxW + 19},${rxLabel - 14}`)
                .attr('fill', c.greenStroke)
        },
        [isDark],
    )

    return <D3Container renderFn={render} deps={[isDark]} height={460} />
}
