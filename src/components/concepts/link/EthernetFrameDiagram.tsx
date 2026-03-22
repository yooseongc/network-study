import { D3Container } from '../../viz/D3Container'
import { themeColors, createColorMap } from '../../../lib/colors'
import { useIsDark } from '../../../hooks/useIsDark'
import * as d3 from 'd3'

const fields = [
    { name: 'Preamble', bytes: '7B', color: 'gray' as const },
    { name: 'SFD', bytes: '1B', color: 'gray' as const },
    { name: 'Dest MAC', bytes: '6B', color: 'blue' as const },
    { name: 'Src MAC', bytes: '6B', color: 'cyan' as const },
    { name: 'Type/Len', bytes: '2B', color: 'purple' as const },
    { name: 'Payload', bytes: '46-1500B', color: 'green' as const },
    { name: 'FCS', bytes: '4B', color: 'amber' as const },
]

const proportions = [7, 1, 6, 6, 2, 46, 4]
const total = proportions.reduce((a, b) => a + b, 0)

export function EthernetFrameDiagram() {
    const isDark = useIsDark()

    const renderFn = (
        svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
        width: number,
        height: number,
    ) => {
        const c = themeColors(isDark)
        const margin = { left: 20, right: 20, top: 30, bottom: 50 }
        const barH = 60
        const usableW = width - margin.left - margin.right
        const y = (height - barH) / 2

        const g = svg.append('g')

        // title
        g.append('text')
            .attr('x', width / 2)
            .attr('y', margin.top - 8)
            .attr('text-anchor', 'middle')
            .attr('font-size', 14)
            .attr('font-weight', 'bold')
            .attr('font-family', "'Pretendard Variable', Pretendard, sans-serif")
            .attr('fill', c.text)
            .text('Ethernet II Frame Structure')

        const colorMap: Record<string, { fill: string; stroke: string; text: string }> = {
            gray: { fill: c.bgCard, stroke: c.border, text: c.textMuted },
            ...createColorMap(c, ['blue', 'cyan', 'purple', 'green', 'amber']),
        }

        let xPos = margin.left
        fields.forEach((f, i) => {
            const w = (proportions[i] / total) * usableW
            const cm = colorMap[f.color]

            // field rect
            g.append('rect')
                .attr('x', xPos)
                .attr('y', y)
                .attr('width', w)
                .attr('height', barH)
                .attr('rx', i === 0 ? 6 : i === fields.length - 1 ? 6 : 0)
                .attr('fill', cm.fill)
                .attr('stroke', cm.stroke)
                .attr('stroke-width', 1.5)

            // field name
            if (w > 28) {
                g.append('text')
                    .attr('x', xPos + w / 2)
                    .attr('y', y + barH / 2 - 6)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', w > 50 ? 11 : 9)
                    .attr('font-weight', '600')
                    .attr('font-family', "'Pretendard Variable', Pretendard, sans-serif")
                    .attr('fill', cm.text)
                    .text(f.name)

                // byte size
                g.append('text')
                    .attr('x', xPos + w / 2)
                    .attr('y', y + barH / 2 + 12)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', 10)
                    .attr('font-family', "'JetBrains Mono', monospace")
                    .attr('fill', c.textMuted)
                    .text(f.bytes)
            }

            xPos += w
        })

        // bottom label: total frame size
        g.append('text')
            .attr('x', width / 2)
            .attr('y', y + barH + 28)
            .attr('text-anchor', 'middle')
            .attr('font-size', 11)
            .attr('font-family', "'JetBrains Mono', monospace")
            .attr('fill', c.textMuted)
            .text('Total: 64 ~ 1518 bytes (excluding Preamble & SFD)')

        // bracket lines
        const bracketY = y + barH + 6
        g.append('line')
            .attr('x1', margin.left)
            .attr('y1', bracketY)
            .attr('x2', margin.left + usableW)
            .attr('y2', bracketY)
            .attr('stroke', c.border)
            .attr('stroke-width', 1)

        g.append('line')
            .attr('x1', margin.left)
            .attr('y1', bracketY)
            .attr('x2', margin.left)
            .attr('y2', bracketY + 6)
            .attr('stroke', c.border)
            .attr('stroke-width', 1)

        g.append('line')
            .attr('x1', margin.left + usableW)
            .attr('y1', bracketY)
            .attr('x2', margin.left + usableW)
            .attr('y2', bracketY + 6)
            .attr('stroke', c.border)
            .attr('stroke-width', 1)
    }

    return <D3Container renderFn={renderFn} deps={[isDark]} height={180} />
}
