import { useCallback } from 'react'
import { createD3Theme,themeColors,useIsDark , D3Container } from '@study-ui/components'
import * as d3 from 'd3'

export function SubnetDiagram() {
    const isDark = useIsDark()

    const render = useCallback(
        (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, _height: number) => {
            const c = themeColors(isDark)
            const theme = createD3Theme(isDark)
            const g = svg.append('g')

            const pad = { top: 30, left: 20, right: 20, bottom: 30 }
            const innerW = width - pad.left - pad.right
            const bitW = Math.max(Math.floor(innerW / 32) - 1, 10)
            const bitH = 28
            const totalBitW = bitW * 32
            const offsetX = pad.left + (innerW - totalBitW) / 2

            // Title
            g.append('text')
                .attr('x', width / 2)
                .attr('y', 20)
                .attr('text-anchor', 'middle')
                .attr('font-size', 13)
                .attr('font-weight', 'bold')
                .attr('fill', c.text)
                .attr('font-family', theme.fonts.sans)
                .text('192.168.1.100 / 24  IPv4 주소 구조')

            // Binary representation of 192.168.1.100
            const octets = [192, 168, 1, 100]
            const bits = octets.map((o) => o.toString(2).padStart(8, '0')).join('')
            const prefixLen = 24

            const bitStartY = 44

            // Draw each bit
            for (let i = 0; i < 32; i++) {
                const isNetwork = i < prefixLen
                const x = offsetX + i * bitW
                const y = bitStartY

                // Bit cell
                g.append('rect')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('width', bitW - 1)
                    .attr('height', bitH)
                    .attr('rx', 2)
                    .attr('fill', isNetwork ? c.blueFill : c.greenFill)
                    .attr('stroke', isNetwork ? c.blueStroke : c.greenStroke)
                    .attr('stroke-width', 1)

                g.append('text')
                    .attr('x', x + (bitW - 1) / 2)
                    .attr('y', y + bitH / 2 + 1)
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'middle')
                    .attr('font-size', Math.min(11, bitW - 2))
                    .attr('font-family', theme.fonts.mono)
                    .attr('fill', isNetwork ? c.blueText : c.greenText)
                    .text(bits[i])
            }

            // Octet separators
            for (let i = 1; i < 4; i++) {
                const x = offsetX + i * 8 * bitW - 0.5
                g.append('line')
                    .attr('x1', x)
                    .attr('y1', bitStartY - 3)
                    .attr('x2', x)
                    .attr('y2', bitStartY + bitH + 3)
                    .attr('stroke', c.textMuted)
                    .attr('stroke-width', 1.5)
                    .attr('stroke-dasharray', '3,2')
            }

            // Prefix boundary marker
            const prefixX = offsetX + prefixLen * bitW - 0.5
            g.append('line')
                .attr('x1', prefixX)
                .attr('y1', bitStartY - 8)
                .attr('x2', prefixX)
                .attr('y2', bitStartY + bitH + 8)
                .attr('stroke', c.redStroke)
                .attr('stroke-width', 2)

            g.append('text')
                .attr('x', prefixX)
                .attr('y', bitStartY - 12)
                .attr('text-anchor', 'middle')
                .attr('font-size', 10)
                .attr('font-family', theme.fonts.mono)
                .attr('fill', c.redText)
                .text('/24')

            // Labels below bits
            const labelY = bitStartY + bitH + 22

            // Network part label
            const netMidX = offsetX + (prefixLen * bitW) / 2
            g.append('text')
                .attr('x', netMidX)
                .attr('y', labelY)
                .attr('text-anchor', 'middle')
                .attr('font-size', 11)
                .attr('font-weight', 'bold')
                .attr('fill', c.blueText)
                .attr('font-family', theme.fonts.sans)
                .text('Network Part (24 bits)')

            // Host part label
            const hostMidX = offsetX + prefixLen * bitW + ((32 - prefixLen) * bitW) / 2
            g.append('text')
                .attr('x', hostMidX)
                .attr('y', labelY)
                .attr('text-anchor', 'middle')
                .attr('font-size', 11)
                .attr('font-weight', 'bold')
                .attr('fill', c.greenText)
                .attr('font-family', theme.fonts.sans)
                .text('Host Part (8 bits)')

            // Decimal representation below
            const decY = labelY + 28
            const decLabels = ['192', '168', '1', '100']
            for (let i = 0; i < 4; i++) {
                const cx = offsetX + i * 8 * bitW + (8 * bitW) / 2
                const isNet = i < 3

                g.append('rect')
                    .attr('x', cx - 28)
                    .attr('y', decY - 12)
                    .attr('width', 56)
                    .attr('height', 24)
                    .attr('rx', 6)
                    .attr('fill', isNet ? c.blueFill : c.greenFill)
                    .attr('stroke', isNet ? c.blueStroke : c.greenStroke)

                g.append('text')
                    .attr('x', cx)
                    .attr('y', decY + 2)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', 13)
                    .attr('font-weight', 'bold')
                    .attr('font-family', theme.fonts.mono)
                    .attr('fill', isNet ? c.blueText : c.greenText)
                    .text(decLabels[i])

                // Dot separator
                if (i < 3) {
                    g.append('text')
                        .attr('x', cx + 32)
                        .attr('y', decY + 2)
                        .attr('text-anchor', 'middle')
                        .attr('font-size', 16)
                        .attr('font-weight', 'bold')
                        .attr('fill', c.textMuted)
                        .attr('font-family', theme.fonts.mono)
                        .text('.')
                }
            }

            // Bottom legend
            const legendY = decY + 40
            const legendItems = [
                { label: '네트워크 주소: 192.168.1.0', color: c.blueStroke },
                { label: '브로드캐스트: 192.168.1.255', color: c.amberStroke },
                { label: '호스트 범위: .1 ~ .254 (254개)', color: c.greenStroke },
            ]
            const legendSpacing = Math.min(220, innerW / 3)
            const legendStartX = width / 2 - (legendItems.length * legendSpacing) / 2

            legendItems.forEach((item, i) => {
                const lx = legendStartX + i * legendSpacing + legendSpacing / 2
                g.append('rect')
                    .attr('x', lx - 8)
                    .attr('y', legendY - 5)
                    .attr('width', 10)
                    .attr('height', 10)
                    .attr('rx', 2)
                    .attr('fill', item.color)
                    .attr('opacity', 0.8)
                g.append('text')
                    .attr('x', lx + 8)
                    .attr('y', legendY + 4)
                    .attr('font-size', Math.min(10, legendSpacing / 22))
                    .attr('fill', c.textMuted)
                    .attr('font-family', theme.fonts.sans)
                    .text(item.label)
            })
        },
        [isDark],
    )

    return <D3Container renderFn={render} deps={[isDark]} height={220} />
}
