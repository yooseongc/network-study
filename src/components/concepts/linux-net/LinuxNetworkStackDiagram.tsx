import { useCallback } from 'react'
import { createColorMap,createD3Theme,themeColors,useIsDark , D3Container } from '@study-ui/components'
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
            const theme = createD3Theme(isDark)
            const g = svg.append('g')

            const pad = { top: 30, left: 20, right: 20, bottom: 20 }
            const innerW = width - pad.left - pad.right
            const boxW = Math.min(innerW, 560)
            const boxH = 40
            const gap = 16
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
                .attr('font-family', theme.fonts.sans)
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
                    .attr('font-family', theme.fonts.sans)
                    .text(layer.label)

                const subFontSize = layer.sublabel.length > 45 ? 8 : 9.5
                g.append('text')
                    .attr('x', offsetX + 14)
                    .attr('y', y + 31)
                    .attr('font-size', subFontSize)
                    .attr('fill', c.textMuted)
                    .attr('font-family', theme.fonts.mono)
                    .text(layer.sublabel)

                // Arrow between layers
                if (i < layers.length - 1) {
                    const arrowY = y + boxH + gap / 2
                    const arrowX = offsetX + boxW / 2
                    // Vertical line connecting boxes
                    g.append('line')
                        .attr('x1', arrowX)
                        .attr('y1', y + boxH + 2)
                        .attr('x2', arrowX)
                        .attr('y2', y + boxH + gap - 2)
                        .attr('stroke', c.textMuted)
                        .attr('stroke-width', 1.5)
                    // Downward triangle
                    g.append('path')
                        .attr('d', `M${arrowX - 6},${arrowY - 3} L${arrowX + 6},${arrowY - 3} L${arrowX},${arrowY + 4} Z`)
                        .attr('fill', c.textMuted)
                }
            })

            // Side arrows: TX (left, top→bottom) and RX (right, bottom→top)
            const arrowLen = totalH * 0.5
            const sideMargin = 22

            // TX — left side, downward
            const txX = offsetX - sideMargin
            const txTop = offsetY + totalH * 0.15
            const txBot = txTop + arrowLen
            g.append('line')
                .attr('x1', txX).attr('y1', txTop)
                .attr('x2', txX).attr('y2', txBot)
                .attr('stroke', c.blueStroke).attr('stroke-width', 2)
            g.append('path')
                .attr('d', `M${txX - 5},${txBot - 6} L${txX},${txBot + 2} L${txX + 5},${txBot - 6}`)
                .attr('fill', c.blueStroke)
            g.append('text')
                .attr('x', txX).attr('y', txTop - 8)
                .attr('text-anchor', 'middle')
                .attr('font-size', 10).attr('font-weight', 700)
                .attr('fill', c.blueText)
                .attr('font-family', theme.fonts.mono)
                .text('TX ↓')

            // RX — right side, upward
            const rxX = offsetX + boxW + sideMargin
            const rxBot = offsetY + totalH * 0.85
            const rxTop = rxBot - arrowLen
            g.append('line')
                .attr('x1', rxX).attr('y1', rxBot)
                .attr('x2', rxX).attr('y2', rxTop)
                .attr('stroke', c.greenStroke).attr('stroke-width', 2)
            g.append('path')
                .attr('d', `M${rxX - 5},${rxTop + 6} L${rxX},${rxTop - 2} L${rxX + 5},${rxTop + 6}`)
                .attr('fill', c.greenStroke)
            g.append('text')
                .attr('x', rxX).attr('y', rxBot + 16)
                .attr('text-anchor', 'middle')
                .attr('font-size', 10).attr('font-weight', 700)
                .attr('fill', c.greenText)
                .attr('font-family', theme.fonts.mono)
                .text('RX ↑')
        },
        [isDark],
    )

    return <D3Container renderFn={render} deps={[isDark]} height={540} />
}
