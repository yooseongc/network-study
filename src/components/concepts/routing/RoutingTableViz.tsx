import { useCallback, useState } from 'react'
import { themeColors,useIsDark , D3Container } from '@study-ui/components'
import * as d3 from 'd3'

interface RouteEntry {
    destination: string
    prefix: number
    gateway: string
    iface: string
    binary: string
}

const routes: RouteEntry[] = [
    { destination: '0.0.0.0', prefix: 0, gateway: '192.168.1.1', iface: 'eth0', binary: '00000000.00000000.00000000.00000000' },
    { destination: '10.0.0.0', prefix: 8, gateway: '10.0.0.1', iface: 'eth1', binary: '00001010.00000000.00000000.00000000' },
    { destination: '10.1.0.0', prefix: 16, gateway: '10.1.0.1', iface: 'eth1', binary: '00001010.00000001.00000000.00000000' },
    { destination: '10.1.2.0', prefix: 24, gateway: '10.1.2.1', iface: 'eth2', binary: '00001010.00000001.00000010.00000000' },
]

const targetIp = '10.1.2.5'
const targetBinary = '00001010.00000001.00000010.00000101'

export function RoutingTableViz() {
    const isDark = useIsDark()
    const [step, setStep] = useState(-1) // -1=idle, 0-3=checking routes, 4=done

    const matchedBits = (routeBinary: string, prefix: number): number => {
        const rBits = routeBinary.replace(/\./g, '')
        const tBits = targetBinary.replace(/\./g, '')
        for (let i = 0; i < prefix; i++) {
            if (rBits[i] !== tBits[i]) return i
        }
        return prefix
    }

    const render = useCallback(
        (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, _height: number) => {
            const c = themeColors(isDark)
            const g = svg.append('g')
            const pad = { top: 10, left: 16, right: 16 }
            const innerW = width - pad.left - pad.right

            // Title
            g.append('text')
                .attr('x', width / 2)
                .attr('y', 24)
                .attr('text-anchor', 'middle')
                .attr('font-size', 13)
                .attr('font-weight', 'bold')
                .attr('fill', c.text)
                .attr('font-family', "'Pretendard Variable', Pretendard, sans-serif")
                .text(`Longest Prefix Match: ${targetIp} 의 경로 탐색`)

            // Target IP display
            const targetY = 50
            g.append('rect')
                .attr('x', pad.left)
                .attr('y', targetY - 14)
                .attr('width', innerW)
                .attr('height', 28)
                .attr('rx', 6)
                .attr('fill', c.amberFill)
                .attr('stroke', c.amberStroke)

            g.append('text')
                .attr('x', width / 2)
                .attr('y', targetY + 4)
                .attr('text-anchor', 'middle')
                .attr('font-size', 12)
                .attr('font-weight', 'bold')
                .attr('font-family', "'JetBrains Mono', monospace")
                .attr('fill', c.amberText)
                .text(`Destination: ${targetIp}  (${targetBinary.replace(/\./g, '')})`)

            // Table header
            const tableY = 90
            const colWidths = [innerW * 0.30, innerW * 0.18, innerW * 0.20, innerW * 0.14, innerW * 0.18]
            const colStarts = [pad.left]
            for (let i = 1; i < colWidths.length; i++) {
                colStarts.push(colStarts[i - 1] + colWidths[i - 1])
            }
            const headers = ['Destination', 'Prefix', 'Gateway', 'Interface', 'Result']
            const rowH = 34

            // Header row
            g.append('rect')
                .attr('x', pad.left)
                .attr('y', tableY)
                .attr('width', innerW)
                .attr('height', rowH)
                .attr('rx', 6)
                .attr('fill', c.bgCard)
                .attr('stroke', c.border)

            headers.forEach((h, i) => {
                g.append('text')
                    .attr('x', colStarts[i] + 10)
                    .attr('y', tableY + rowH / 2 + 1)
                    .attr('dominant-baseline', 'middle')
                    .attr('font-size', 11)
                    .attr('font-weight', 'bold')
                    .attr('fill', c.text)
                    .attr('font-family', "'Pretendard Variable', Pretendard, sans-serif")
                    .text(h)
            })

            // Data rows
            routes.forEach((route, ri) => {
                const ry = tableY + rowH + ri * rowH
                const isChecking = step === ri
                const isChecked = step > ri
                const isDone = step === 4
                const isMatch = ri === 3 // /24 is best match
                const matched = matchedBits(route.binary, route.prefix)
                const fullMatch = matched === route.prefix

                let rowFill = 'transparent'
                let rowStroke = c.border

                if (isChecking) {
                    rowFill = c.amberFill
                    rowStroke = c.amberStroke
                } else if (isDone && isMatch) {
                    rowFill = c.greenFill
                    rowStroke = c.greenStroke
                } else if (isChecked && fullMatch) {
                    rowFill = c.blueFill
                    rowStroke = c.blueStroke
                }

                g.append('rect')
                    .attr('x', pad.left)
                    .attr('y', ry)
                    .attr('width', innerW)
                    .attr('height', rowH)
                    .attr('fill', rowFill)
                    .attr('stroke', rowStroke)
                    .attr('stroke-width', isChecking || (isDone && isMatch) ? 2 : 0.5)

                const cellData = [
                    `${route.destination}/${route.prefix}`,
                    `/${route.prefix}`,
                    route.gateway,
                    route.iface,
                    '',
                ]
                cellData.forEach((val, ci) => {
                    if (ci === 4) {
                        // Result column
                        let resultText = ''
                        let resultFill = c.textMuted

                        if (isChecking || isChecked || isDone) {
                            if (fullMatch) {
                                resultText = isDone && isMatch ? 'BEST' : 'Match'
                                resultFill = isDone && isMatch ? c.greenText : c.blueText
                            } else {
                                resultText = 'No match'
                                resultFill = c.redText
                            }
                        }
                        if (step < ri && !isDone) {
                            resultText = '...'
                            resultFill = c.textDim
                        }

                        g.append('text')
                            .attr('x', colStarts[ci] + 10)
                            .attr('y', ry + rowH / 2 + 1)
                            .attr('dominant-baseline', 'middle')
                            .attr('font-size', 11)
                            .attr('font-weight', 'bold')
                            .attr('font-family', "'JetBrains Mono', monospace")
                            .attr('fill', resultFill)
                            .text(resultText)
                    } else {
                        g.append('text')
                            .attr('x', colStarts[ci] + 10)
                            .attr('y', ry + rowH / 2 + 1)
                            .attr('dominant-baseline', 'middle')
                            .attr('font-size', 11)
                            .attr('font-family', "'JetBrains Mono', monospace")
                            .attr('fill', isChecking ? c.amberText : c.textMuted)
                            .text(val)
                    }
                })

                // Arrow indicator for current check
                if (isChecking) {
                    g.append('text')
                        .attr('x', pad.left - 4)
                        .attr('y', ry + rowH / 2 + 1)
                        .attr('dominant-baseline', 'middle')
                        .attr('text-anchor', 'end')
                        .attr('font-size', 14)
                        .attr('fill', c.amberText)
                        .text('\u25B6')
                }
            })

            // Explanation text at bottom
            const bottomY = tableY + rowH + routes.length * rowH + 24
            let explanation = '아래 "다음 단계" 버튼을 눌러 Longest Prefix Match 과정을 확인하세요.'

            if (step === 0) explanation = '0.0.0.0/0 (기본 경로) — 모든 IP가 매치됩니다. prefix 길이 = 0'
            else if (step === 1) explanation = '10.0.0.0/8 — 첫 8비트(00001010)가 일치합니다. prefix 길이 = 8'
            else if (step === 2) explanation = '10.1.0.0/16 — 첫 16비트가 일치합니다. prefix 길이 = 16'
            else if (step === 3) explanation = '10.1.2.0/24 — 첫 24비트가 모두 일치합니다! prefix 길이 = 24'
            else if (step === 4)
                explanation = 'Longest prefix match 결과: 10.1.2.0/24 (prefix 24) 가 가장 구체적인 경로입니다!'

            const explFontSize = explanation.length > 45 ? 9 : 11
            g.append('text')
                .attr('x', width / 2)
                .attr('y', bottomY)
                .attr('text-anchor', 'middle')
                .attr('font-size', explFontSize)
                .attr('fill', step === 4 ? c.greenText : c.textMuted)
                .attr('font-weight', step === 4 ? 'bold' : 'normal')
                .attr('font-family', "'Pretendard Variable', Pretendard, sans-serif")
                .text(explanation)
        },
        [isDark, step],
    )

    const handleNext = () => {
        setStep((prev) => (prev < 4 ? prev + 1 : -1))
    }

    return (
        <div className="space-y-3">
            <D3Container renderFn={render} deps={[isDark, step]} height={340} />
            <div className="flex justify-center gap-3">
                <button
                    onClick={handleNext}
                    className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
                >
                    {step === -1 ? '탐색 시작' : step < 4 ? '다음 단계' : '처음으로'}
                </button>
                {step > -1 && step < 4 && (
                    <span className="self-center text-xs text-gray-500 dark:text-gray-400 font-mono">
                        Step {step + 1} / 4
                    </span>
                )}
            </div>
        </div>
    )
}
