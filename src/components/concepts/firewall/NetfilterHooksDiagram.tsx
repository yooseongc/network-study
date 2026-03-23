import { useCallback } from 'react'
import { createColorMap,createD3Theme,themeColors,useIsDark , D3Container } from '@study-ui/components'
import * as d3 from 'd3'

interface HookDef {
    id: string
    label: string
    sublabel: string
    colorKey: 'amber' | 'blue' | 'green' | 'red' | 'purple' | 'cyan' | 'indigo'
    x: number
    y: number
}

export function NetfilterHooksDiagram() {
    const isDark = useIsDark()

    const render = useCallback(
        (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, _height: number) => {
            const c = themeColors(isDark)
            const theme = createD3Theme(isDark)
            const g = svg.append('g')

            const colorMap = createColorMap(c, ['amber', 'blue', 'green', 'red', 'purple', 'cyan', 'indigo'])

            // Layout constants
            const cx = width / 2
            const boxW = Math.min(150, (width - 80) / 4)
            const boxH = 50
            const smallBoxW = Math.min(120, (width - 80) / 4)
            const smallBoxH = 40

            // Hook positions (relative to center)
            const hooks: HookDef[] = [
                { id: 'prerouting', label: 'PREROUTING', sublabel: 'raw → mangle → nat', colorKey: 'amber', x: cx - 200, y: 80 },
                { id: 'routing1', label: 'Routing Decision', sublabel: '목적지 판단', colorKey: 'cyan', x: cx, y: 80 },
                { id: 'input', label: 'INPUT', sublabel: 'mangle → filter', colorKey: 'blue', x: cx - 160, y: 180 },
                { id: 'forward', label: 'FORWARD', sublabel: 'mangle → filter', colorKey: 'green', x: cx + 160, y: 180 },
                { id: 'localproc', label: 'Local Process', sublabel: '사용자 프로세스', colorKey: 'purple', x: cx - 160, y: 290 },
                { id: 'output', label: 'OUTPUT', sublabel: 'raw → mangle → nat → filter', colorKey: 'red', x: cx - 160, y: 390 },
                { id: 'routing2', label: 'Routing Decision', sublabel: '출구 인터페이스', colorKey: 'cyan', x: cx, y: 390 },
                { id: 'postrouting', label: 'POSTROUTING', sublabel: 'mangle → nat', colorKey: 'amber', x: cx + 160, y: 390 },
            ]

            // Title
            g.append('text')
                .attr('x', cx)
                .attr('y', 22)
                .attr('text-anchor', 'middle')
                .attr('font-size', 14)
                .attr('font-weight', 'bold')
                .attr('fill', c.text)
                .attr('font-family', theme.fonts.sans)
                .text('Netfilter Hook Points')

            // Subtitle
            g.append('text')
                .attr('x', cx)
                .attr('y', 42)
                .attr('text-anchor', 'middle')
                .attr('font-size', 11)
                .attr('fill', c.textMuted)
                .attr('font-family', theme.fonts.sans)
                .text('패킷이 커널을 통과하는 5개 훅 포인트')

            // Arrow: Packet IN → PREROUTING
            const packetInX = Math.max(40, cx - 200 - boxW / 2 - 70)
            drawArrow(g, packetInX + 8, 80, cx - 200 - boxW / 2, 80, c.greenStroke)

            // "Packet IN" label — above the arrow to avoid overlap
            g.append('text')
                .attr('x', packetInX)
                .attr('y', 65)
                .attr('text-anchor', 'middle')
                .attr('font-size', 11)
                .attr('font-weight', 'bold')
                .attr('fill', c.greenText)
                .attr('font-family', theme.fonts.mono)
                .text('→ Packet IN')

            // Draw hook boxes
            hooks.forEach((hook) => {
                const isSmall = hook.id === 'routing1' || hook.id === 'routing2'
                const w = isSmall ? smallBoxW : boxW
                const h = isSmall ? smallBoxH : boxH
                const cm = colorMap[hook.colorKey]

                g.append('rect')
                    .attr('x', hook.x - w / 2)
                    .attr('y', hook.y - h / 2)
                    .attr('width', w)
                    .attr('height', h)
                    .attr('rx', 8)
                    .attr('fill', cm.fill)
                    .attr('stroke', cm.stroke)
                    .attr('stroke-width', 1.5)

                g.append('text')
                    .attr('x', hook.x)
                    .attr('y', hook.y - 4)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', isSmall ? 10 : 11)
                    .attr('font-weight', 'bold')
                    .attr('fill', cm.text)
                    .attr('font-family', theme.fonts.sans)
                    .text(hook.label)

                g.append('text')
                    .attr('x', hook.x)
                    .attr('y', hook.y + 12)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', hook.sublabel.length > 20 ? 8 : 9)
                    .attr('fill', c.textMuted)
                    .attr('font-family', theme.fonts.sans)
                    .text(hook.sublabel)
            })

            // Arrows connecting hooks
            // PREROUTING → Routing Decision
            drawArrow(g, cx - 200 + boxW / 2, 80, cx - smallBoxW / 2, 80, c.amberStroke)

            // Routing Decision → INPUT (local dest)
            drawArrowPath(g, [
                { x: cx - smallBoxW / 2 + 10, y: 80 + smallBoxH / 2 },
                { x: cx - 160, y: 130 },
                { x: cx - 160, y: 180 - boxH / 2 },
            ], c.blueStroke)
            // Label "local"
            g.append('text')
                .attr('x', cx - 200)
                .attr('y', 125)
                .attr('text-anchor', 'middle')
                .attr('font-size', 9)
                .attr('fill', c.textMuted)
                .attr('font-family', theme.fonts.mono)
                .text('local dest')

            // Routing Decision → FORWARD (remote dest)
            drawArrowPath(g, [
                { x: cx + smallBoxW / 2 - 10, y: 80 + smallBoxH / 2 },
                { x: cx + 160, y: 130 },
                { x: cx + 160, y: 180 - boxH / 2 },
            ], c.greenStroke)
            // Label "forward"
            g.append('text')
                .attr('x', cx + 200)
                .attr('y', 125)
                .attr('text-anchor', 'middle')
                .attr('font-size', 9)
                .attr('fill', c.textMuted)
                .attr('font-family', theme.fonts.mono)
                .text('remote dest')

            // INPUT → Local Process
            drawArrow(g, cx - 160, 180 + boxH / 2, cx - 160, 290 - boxH / 2, c.blueStroke)

            // Local Process → OUTPUT
            drawArrow(g, cx - 160, 290 + boxH / 2, cx - 160, 390 - boxH / 2, c.redStroke)

            // OUTPUT → Routing Decision 2
            drawArrow(g, cx - 160 + boxW / 2, 390, cx - smallBoxW / 2, 390, c.redStroke)

            // Routing Decision 2 → POSTROUTING
            drawArrow(g, cx + smallBoxW / 2, 390, cx + 160 - boxW / 2, 390, c.amberStroke)

            // FORWARD → POSTROUTING
            drawArrowPath(g, [
                { x: cx + 160, y: 180 + boxH / 2 },
                { x: cx + 160, y: 330 },
                { x: cx + 160, y: 390 - boxH / 2 },
            ], c.greenStroke)

            // Arrow: POSTROUTING → Packet OUT
            const packetOutX = Math.min(width - 40, cx + 160 + boxW / 2 + 70)
            drawArrow(g, cx + 160 + boxW / 2, 390, packetOutX - 8, 390, c.redStroke)

            // "Packet OUT" label — below the arrow to avoid overlap
            g.append('text')
                .attr('x', packetOutX)
                .attr('y', 415)
                .attr('text-anchor', 'middle')
                .attr('font-size', 11)
                .attr('font-weight', 'bold')
                .attr('fill', c.redText)
                .attr('font-family', theme.fonts.mono)
                .text('Packet OUT →')
        },
        [isDark],
    )

    return <D3Container renderFn={render} deps={[isDark]} height={460} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2" />
}

/* ── Helper: draw arrow with marker ──────────────────────── */
function drawArrow(
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    x1: number, y1: number, x2: number, y2: number,
    color: string,
) {
    const id = `arr-${Math.random().toString(36).slice(2, 8)}`
    g.append('defs').append('marker')
        .attr('id', id)
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 9)
        .attr('refY', 5)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto-start-reverse')
        .append('path')
        .attr('d', 'M 0 0 L 10 5 L 0 10 z')
        .attr('fill', color)

    g.append('line')
        .attr('x1', x1).attr('y1', y1)
        .attr('x2', x2).attr('y2', y2)
        .attr('stroke', color)
        .attr('stroke-width', 1.5)
        .attr('marker-end', `url(#${id})`)
}

function drawArrowPath(
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    points: { x: number; y: number }[],
    color: string,
) {
    if (points.length < 2) return
    const id = `arr-${Math.random().toString(36).slice(2, 8)}`
    g.append('defs').append('marker')
        .attr('id', id)
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 9)
        .attr('refY', 5)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto-start-reverse')
        .append('path')
        .attr('d', 'M 0 0 L 10 5 L 0 10 z')
        .attr('fill', color)

    const line = d3.line<{ x: number; y: number }>()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveLinear)

    g.append('path')
        .attr('d', line(points)!)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 1.5)
        .attr('marker-end', `url(#${id})`)
}
