import { useCallback } from 'react'
import { D3Container } from '../../viz/D3Container'
import { themeColors } from '../../../lib/colors'
import * as d3 from 'd3'

function useIsDark() {
    return document.documentElement.classList.contains('dark')
}

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
            const g = svg.append('g')

            const colorMap: Record<string, { fill: string; stroke: string; text: string }> = {
                amber: { fill: c.amberFill, stroke: c.amberStroke, text: c.amberText },
                blue: { fill: c.blueFill, stroke: c.blueStroke, text: c.blueText },
                green: { fill: c.greenFill, stroke: c.greenStroke, text: c.greenText },
                red: { fill: c.redFill, stroke: c.redStroke, text: c.redText },
                purple: { fill: c.purpleFill, stroke: c.purpleStroke, text: c.purpleText },
                cyan: { fill: c.cyanFill, stroke: c.cyanStroke, text: c.cyanText },
                indigo: { fill: c.indigoFill, stroke: c.indigoStroke, text: c.indigoText },
            }

            // Layout constants
            const cx = width / 2
            const boxW = 130
            const boxH = 50
            const smallBoxW = 110
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
                .attr('font-family', "'Pretendard Variable', Pretendard, sans-serif")
                .text('Netfilter Hook Points')

            // Subtitle
            g.append('text')
                .attr('x', cx)
                .attr('y', 42)
                .attr('text-anchor', 'middle')
                .attr('font-size', 11)
                .attr('fill', c.textMuted)
                .attr('font-family', "'Pretendard Variable', Pretendard, sans-serif")
                .text('패킷이 커널을 통과하는 5개 훅 포인트')

            // "Packet IN" label
            g.append('text')
                .attr('x', cx - 320)
                .attr('y', 85)
                .attr('text-anchor', 'middle')
                .attr('font-size', 11)
                .attr('font-weight', 'bold')
                .attr('fill', c.greenText)
                .attr('font-family', "'JetBrains Mono', monospace")
                .text('Packet IN')

            // Arrow: Packet IN → PREROUTING
            drawArrow(g, cx - 290, 80, cx - 200 - boxW / 2, 80, c.greenStroke)

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
                    .attr('font-family', "'JetBrains Mono', monospace")
                    .text(hook.label)

                g.append('text')
                    .attr('x', hook.x)
                    .attr('y', hook.y + 12)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', 9)
                    .attr('fill', c.textMuted)
                    .attr('font-family', "'Pretendard Variable', Pretendard, sans-serif")
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
                .attr('font-family', "'JetBrains Mono', monospace")
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
                .attr('font-family', "'JetBrains Mono', monospace")
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

            // "Packet OUT" label
            g.append('text')
                .attr('x', cx + 320)
                .attr('y', 395)
                .attr('text-anchor', 'middle')
                .attr('font-size', 11)
                .attr('font-weight', 'bold')
                .attr('fill', c.redText)
                .attr('font-family', "'JetBrains Mono', monospace")
                .text('Packet OUT')

            // Arrow: POSTROUTING → Packet OUT
            drawArrow(g, cx + 160 + boxW / 2, 390, cx + 290, 390, c.redStroke)
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
