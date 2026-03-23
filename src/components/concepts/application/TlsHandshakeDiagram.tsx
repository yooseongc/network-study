import { useCallback, useState } from 'react'
import { createColorMap,createD3Theme,themeColors,useIsDark , D3Container } from '@study-ui/components'
import * as d3 from 'd3'

interface TlsMessage {
    from: 'client' | 'server'
    label: string
    detail: string
    color: 'blue' | 'green' | 'purple' | 'amber'
}

const messages: TlsMessage[] = [
    {
        from: 'client',
        label: 'ClientHello',
        detail: 'TLS 버전, 지원 Cipher Suites, 랜덤값, SNI',
        color: 'blue',
    },
    {
        from: 'server',
        label: 'ServerHello + Certificate + Finished',
        detail: '선택된 Cipher, 서버 인증서, 키 교환, 서버 검증',
        color: 'green',
    },
    {
        from: 'client',
        label: 'Client Finished',
        detail: '키 교환 완료, 클라이언트 검증',
        color: 'purple',
    },
    {
        from: 'client',
        label: 'Application Data (Encrypted)',
        detail: '양방향 암호화 통신 시작 (HTTP/2, HTTP/3 등)',
        color: 'amber',
    },
]

export function TlsHandshakeDiagram() {
    const isDark = useIsDark()
    const [step, setStep] = useState(-1) // -1=idle, 0-3=messages, 4=done

    const render = useCallback(
        (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, _height: number) => {
            const c = themeColors(isDark)
            const theme = createD3Theme(isDark)
            const g = svg.append('g')
            const pad = { left: 24, right: 24, top: 10 }
            const innerW = width - pad.left - pad.right

            const clientX = pad.left + innerW * 0.2
            const serverX = pad.left + innerW * 0.8
            const headerY = 30
            const timelineTop = 60
            const msgGap = 60
            const timelineBot = timelineTop + (messages.length) * msgGap + 10

            // Title
            g.append('text')
                .attr('x', width / 2)
                .attr('y', 18)
                .attr('text-anchor', 'middle')
                .attr('font-size', 13)
                .attr('font-weight', 'bold')
                .attr('fill', c.text)
                .attr('font-family', theme.fonts.sans)
                .text('TLS 1.3 Handshake')

            // Client/Server headers
            const drawHeader = (x: number, label: string, fill: string, stroke: string) => {
                g.append('rect')
                    .attr('x', x - 50)
                    .attr('y', headerY - 14)
                    .attr('width', 100)
                    .attr('height', 28)
                    .attr('rx', 6)
                    .attr('fill', fill)
                    .attr('stroke', stroke)
                    .attr('stroke-width', 1.5)

                g.append('text')
                    .attr('x', x)
                    .attr('y', headerY + 4)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', 12)
                    .attr('font-weight', 'bold')
                    .attr('fill', c.text)
                    .attr('font-family', theme.fonts.sans)
                    .text(label)
            }

            drawHeader(clientX, 'Client', c.blueFill, c.blueStroke)
            drawHeader(serverX, 'Server', c.greenFill, c.greenStroke)

            // Timeline vertical lines
            g.append('line')
                .attr('x1', clientX).attr('y1', timelineTop)
                .attr('x2', clientX).attr('y2', timelineBot)
                .attr('stroke', c.border).attr('stroke-width', 1.5)
                .attr('stroke-dasharray', '4 3')

            g.append('line')
                .attr('x1', serverX).attr('y1', timelineTop)
                .attr('x2', serverX).attr('y2', timelineBot)
                .attr('stroke', c.border).attr('stroke-width', 1.5)
                .attr('stroke-dasharray', '4 3')

            // Messages
            const colorMap = createColorMap(c, ['blue', 'green', 'purple', 'amber'])

            messages.forEach((msg, i) => {
                const y = timelineTop + (i + 0.5) * msgGap
                const isActive = step >= i || step === 4
                const isCurrent = step === i
                const fromX = msg.from === 'client' ? clientX : serverX
                const toX = msg.from === 'client' ? serverX : clientX
                const mc = colorMap[msg.color]

                if (!isActive && step !== -1) return

                // Arrow line
                const arrowColor = isCurrent ? mc.stroke : (step === -1 ? c.textDim : mc.stroke)
                const opacity = (step === -1 || isActive) ? 1 : 0.3

                g.append('line')
                    .attr('x1', fromX)
                    .attr('y1', y)
                    .attr('x2', toX)
                    .attr('y2', y)
                    .attr('stroke', arrowColor)
                    .attr('stroke-width', isCurrent ? 2.5 : 1.5)
                    .attr('opacity', opacity)
                    .attr('marker-end', `url(#arrowTls${i})`)

                // arrowhead marker
                svg.select('defs').empty() && svg.append('defs')
                const defs = svg.select('defs').empty() ? svg.append('defs') : svg.select('defs')
                defs.append('marker')
                    .attr('id', `arrowTls${i}`)
                    .attr('markerWidth', 8)
                    .attr('markerHeight', 6)
                    .attr('refX', 8)
                    .attr('refY', 3)
                    .attr('orient', 'auto')
                    .append('path')
                    .attr('d', 'M0,0 L8,3 L0,6 Z')
                    .attr('fill', arrowColor)

                // Label
                const midX = (fromX + toX) / 2
                g.append('text')
                    .attr('x', midX)
                    .attr('y', y - 8)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', isCurrent ? 11 : 10)
                    .attr('font-weight', isCurrent ? 'bold' : 'normal')
                    .attr('fill', isCurrent ? mc.text : c.textMuted)
                    .attr('opacity', opacity)
                    .attr('font-family', theme.fonts.mono)
                    .text(msg.label)

                // Detail text (only for current step)
                if (isCurrent) {
                    g.append('text')
                        .attr('x', midX)
                        .attr('y', y + 18)
                        .attr('text-anchor', 'middle')
                        .attr('font-size', 9)
                        .attr('fill', mc.text)
                        .attr('font-family', theme.fonts.sans)
                        .text(msg.detail)
                }
            })

            // Bottom explanation
            const botY = timelineBot + 20
            let explanation = '"다음 단계" 버튼을 눌러 TLS 1.3 handshake 과정을 확인하세요.'
            if (step === 0) explanation = 'Client가 지원하는 암호 스위트, 랜덤값, SNI를 서버에 전송합니다.'
            else if (step === 1) explanation = 'Server가 인증서와 키 교환 데이터를 한 번에 전송합니다 (1-RTT).'
            else if (step === 2) explanation = 'Client가 키 교환을 완료하고 Finished 메시지를 전송합니다.'
            else if (step === 3) explanation = '양방향 암호화 통신이 시작됩니다. TLS 1.3은 1-RTT로 handshake를 완료합니다!'
            else if (step === 4) explanation = 'TLS 1.3 handshake 완료! 이전 버전(1.2) 대비 1 RTT 줄어든 빠른 연결 수립.'

            const explFontSize = explanation.length > 40 ? 9 : 11
            g.append('text')
                .attr('x', width / 2)
                .attr('y', botY)
                .attr('text-anchor', 'middle')
                .attr('font-size', explFontSize)
                .attr('fill', step === 4 ? c.greenText : c.textMuted)
                .attr('font-weight', step === 4 ? 'bold' : 'normal')
                .attr('font-family', theme.fonts.sans)
                .text(explanation)
        },
        [isDark, step],
    )

    const handleNext = () => {
        setStep((prev) => (prev < 4 ? prev + 1 : -1))
    }

    return (
        <div className="space-y-3">
            <D3Container renderFn={render} deps={[isDark, step]} height={360} />
            <div className="flex justify-center gap-3">
                <button
                    onClick={handleNext}
                    className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
                >
                    {step === -1 ? 'Handshake 시작' : step < 4 ? '다음 단계' : '처음으로'}
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
