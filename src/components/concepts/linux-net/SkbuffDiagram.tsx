import { useCallback } from 'react'
import { themeColors,useIsDark , D3Container } from '@study-ui/components'
import * as d3 from 'd3'

export function SkbuffDiagram() {
    const isDark = useIsDark()

    const render = useCallback(
        (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, _height: number) => {
            const c = themeColors(isDark)
            const g = svg.append('g')

            const pad = { left: 30, right: 30 }
            const innerW = width - pad.left - pad.right
            const bufW = Math.min(innerW * 0.55, 300)
            const bufX = pad.left + (innerW - bufW) / 2 + 60
            const ptrX = bufX - 80

            // Title
            g.append('text')
                .attr('x', width / 2)
                .attr('y', 20)
                .attr('text-anchor', 'middle')
                .attr('font-size', 13)
                .attr('font-weight', 'bold')
                .attr('fill', c.text)
                .attr('font-family', "'Pretendard Variable', Pretendard, sans-serif")
                .text('sk_buff (skb) Linear Data Layout')

            // Memory regions
            const regions = [
                { label: 'headroom', h: 40, fill: c.bgCard, stroke: c.border, textColor: c.textDim },
                { label: 'MAC Header', h: 30, fill: c.amberFill, stroke: c.amberStroke, textColor: c.amberText },
                { label: 'IP Header', h: 30, fill: c.greenFill, stroke: c.greenStroke, textColor: c.greenText },
                { label: 'TCP/UDP Header', h: 30, fill: c.blueFill, stroke: c.blueStroke, textColor: c.blueText },
                { label: 'Payload (Data)', h: 60, fill: c.purpleFill, stroke: c.purpleStroke, textColor: c.purpleText },
                { label: 'tailroom', h: 35, fill: c.bgCard, stroke: c.border, textColor: c.textDim },
            ]

            let startY = 38
            const pointerPositions: { label: string; y: number; color: string }[] = []

            // head pointer
            pointerPositions.push({ label: 'head', y: startY, color: c.redText })

            let accY = startY
            regions.forEach((r, i) => {
                g.append('rect')
                    .attr('x', bufX)
                    .attr('y', accY)
                    .attr('width', bufW)
                    .attr('height', r.h)
                    .attr('fill', r.fill)
                    .attr('stroke', r.stroke)
                    .attr('stroke-width', 1.5)
                    .attr('rx', i === 0 ? 4 : i === regions.length - 1 ? 4 : 0)

                g.append('text')
                    .attr('x', bufX + bufW / 2)
                    .attr('y', accY + r.h / 2 + 1)
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'middle')
                    .attr('font-size', 11)
                    .attr('font-weight', 600)
                    .attr('fill', r.textColor)
                    .attr('font-family', "'Pretendard Variable', Pretendard, sans-serif")
                    .text(r.label)

                // data pointer (after headroom)
                if (i === 0) {
                    pointerPositions.push({ label: 'data', y: accY + r.h, color: c.blueText })
                }
                // tail pointer (after payload)
                if (i === regions.length - 2) {
                    pointerPositions.push({ label: 'tail', y: accY + r.h, color: c.greenText })
                }

                accY += r.h
            })

            // end pointer
            pointerPositions.push({ label: 'end', y: accY, color: c.redText })

            // Draw pointers
            pointerPositions.forEach((ptr) => {
                // Arrow line
                g.append('line')
                    .attr('x1', ptrX + 32)
                    .attr('y1', ptr.y)
                    .attr('x2', bufX - 4)
                    .attr('y2', ptr.y)
                    .attr('stroke', ptr.color)
                    .attr('stroke-width', 1.5)
                    .attr('stroke-dasharray', '4,2')

                // Arrowhead
                g.append('path')
                    .attr('d', `M${bufX - 4},${ptr.y} L${bufX - 10},${ptr.y - 4} L${bufX - 10},${ptr.y + 4} Z`)
                    .attr('fill', ptr.color)

                // Label
                g.append('text')
                    .attr('x', ptrX + 28)
                    .attr('y', ptr.y + 1)
                    .attr('text-anchor', 'end')
                    .attr('dominant-baseline', 'middle')
                    .attr('font-size', 11)
                    .attr('font-weight', 'bold')
                    .attr('fill', ptr.color)
                    .attr('font-family', "'JetBrains Mono', monospace")
                    .text(ptr.label)
            })

            // Right-side annotations
            const annotX = bufX + bufW + 12
            const dataStartY = pointerPositions[1].y
            const dataEndY = pointerPositions[2].y

            // Brace for "data region"
            g.append('line')
                .attr('x1', annotX)
                .attr('y1', dataStartY + 4)
                .attr('x2', annotX)
                .attr('y2', dataEndY - 4)
                .attr('stroke', c.cyanStroke)
                .attr('stroke-width', 2)

            g.append('line')
                .attr('x1', annotX)
                .attr('y1', dataStartY + 4)
                .attr('x2', annotX + 6)
                .attr('y2', dataStartY + 4)
                .attr('stroke', c.cyanStroke)
                .attr('stroke-width', 2)

            g.append('line')
                .attr('x1', annotX)
                .attr('y1', dataEndY - 4)
                .attr('x2', annotX + 6)
                .attr('y2', dataEndY - 4)
                .attr('stroke', c.cyanStroke)
                .attr('stroke-width', 2)

            g.append('text')
                .attr('x', annotX + 10)
                .attr('y', (dataStartY + dataEndY) / 2 - 6)
                .attr('font-size', 10)
                .attr('font-weight', 'bold')
                .attr('fill', c.cyanText)
                .attr('font-family', "'Pretendard Variable', Pretendard, sans-serif")
                .text('skb->len')

            g.append('text')
                .attr('x', annotX + 10)
                .attr('y', (dataStartY + dataEndY) / 2 + 8)
                .attr('font-size', 9)
                .attr('fill', c.textMuted)
                .attr('font-family', "'Pretendard Variable', Pretendard, sans-serif")
                .text('(data ~ tail)')

            // skb_push explanation
            const noteY = accY + 18
            g.append('text')
                .attr('x', width / 2)
                .attr('y', noteY)
                .attr('text-anchor', 'middle')
                .attr('font-size', 10)
                .attr('fill', c.textMuted)
                .attr('font-family', "'Pretendard Variable', Pretendard, sans-serif")
                .text('skb_push(): data 포인터를 위로 이동하여 헤더 추가 공간 확보')

            g.append('text')
                .attr('x', width / 2)
                .attr('y', noteY + 14)
                .attr('text-anchor', 'middle')
                .attr('font-size', 10)
                .attr('fill', c.textMuted)
                .attr('font-family', "'Pretendard Variable', Pretendard, sans-serif")
                .text('skb_put(): tail 포인터를 아래로 이동하여 데이터 추가')
        },
        [isDark],
    )

    return <D3Container renderFn={render} deps={[isDark]} height={300} />
}
