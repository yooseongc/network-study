import { AnimatedDiagram, createD3Theme, useIsDark } from '@study-ui/components'

const steps = [
    {
        label: '초기 상태',
        description:
            '클라이언트와 서버 모두 CLOSED 상태입니다. 서버는 listen()을 호출하여 LISTEN 상태로 전환합니다.',
    },
    {
        label: 'SYN 전송',
        description:
            '클라이언트가 SYN 패킷(seq=x)을 보내고 SYN_SENT 상태가 됩니다. 초기 시퀀스 번호(ISN)는 보안을 위해 랜덤으로 생성됩니다.',
    },
    {
        label: 'SYN+ACK 응답',
        description:
            '서버가 SYN+ACK 패킷(seq=y, ack=x+1)을 보내고 SYN_RCVD 상태가 됩니다. 서버도 자신의 ISN을 포함합니다.',
    },
    {
        label: 'ACK 전송 → 연결 수립',
        description:
            '클라이언트가 ACK(ack=y+1)를 보내면 양측 모두 ESTABLISHED 상태가 됩니다. 이제 데이터 전송이 가능합니다.',
    },
]

const clientX = 120
const serverX = 420
const timelineTop = 24
const stepGap = 44

function Arrow({
    fromX,
    toX,
    y,
    label,
    sublabel,
    active,
    color,
    fontMono,
}: {
    fromX: number
    toX: number
    y: number
    label: string
    sublabel: string
    active: boolean
    color: string
    fontMono: string
}) {
    const midX = (fromX + toX) / 2
    const dir = toX > fromX ? 1 : -1
    const headLen = 10

    return (
        <g
            className={`transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-20'}`}
        >
            <line
                x1={fromX}
                y1={y}
                x2={toX - dir * headLen}
                y2={y}
                stroke={color}
                strokeWidth={2}
            />
            <polygon
                points={`${toX},${y} ${toX - dir * headLen},${y - 5} ${toX - dir * headLen},${y + 5}`}
                fill={color}
            />
            <text
                x={midX}
                y={y - 10}
                textAnchor="middle"
                className="text-xs font-bold fill-gray-800 dark:fill-gray-100"
                style={{ fontFamily: fontMono }}
            >
                {label}
            </text>
            <text
                x={midX}
                y={y + 16}
                textAnchor="middle"
                className="text-[10px] fill-gray-500 dark:fill-gray-400"
                style={{ fontFamily: fontMono }}
            >
                {sublabel}
            </text>
        </g>
    )
}

function StateLabel({
    x,
    y,
    text,
    active,
    fontMono,
}: {
    x: number
    y: number
    text: string
    active: boolean
    fontMono: string
}) {
    return (
        <text
            x={x}
            y={y}
            textAnchor="middle"
            className={`text-[10px] transition-opacity duration-300 ${
                active
                    ? 'fill-emerald-600 dark:fill-emerald-400 font-bold'
                    : 'fill-gray-400 dark:fill-gray-600'
            }`}
            style={{ fontFamily: fontMono }}
        >
            {text}
        </text>
    )
}

export function TcpHandshakeDiagram() {
    const isDark = useIsDark()
    const theme = createD3Theme(isDark)

    const renderStep = (step: number) => {
        const arrowY1 = timelineTop + 64
        const arrowY2 = arrowY1 + stepGap
        const arrowY3 = arrowY2 + stepGap

        return (
            <svg viewBox="0 0 540 240" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
                {/* Column headers */}
                <text
                    x={clientX}
                    y={18}
                    textAnchor="middle"
                    className="text-sm font-bold fill-blue-600 dark:fill-blue-400"
                    style={{ fontFamily: theme.fonts.sans }}
                >
                    Client
                </text>
                <text
                    x={serverX}
                    y={18}
                    textAnchor="middle"
                    className="text-sm font-bold fill-purple-600 dark:fill-purple-400"
                    style={{ fontFamily: theme.fonts.sans }}
                >
                    Server
                </text>

                {/* Timeline lines */}
                <line
                    x1={clientX}
                    y1={timelineTop + 10}
                    x2={clientX}
                    y2={230}
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeDasharray="4,3"
                    className="text-gray-300 dark:text-gray-700"
                />
                <line
                    x1={serverX}
                    y1={timelineTop + 10}
                    x2={serverX}
                    y2={230}
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeDasharray="4,3"
                    className="text-gray-300 dark:text-gray-700"
                />

                {/* Client states */}
                <StateLabel x={clientX - 60} y={arrowY1 - 8} text="CLOSED" active={step === 0} fontMono={theme.fonts.mono} />
                <StateLabel x={clientX - 60} y={arrowY1 + 8} text="SYN_SENT" active={step >= 1} fontMono={theme.fonts.mono} />
                <StateLabel x={clientX - 60} y={arrowY3 + 8} text="ESTABLISHED" active={step >= 3} fontMono={theme.fonts.mono} />

                {/* Server states */}
                <StateLabel x={serverX + 60} y={arrowY1 - 8} text="LISTEN" active={step >= 0} fontMono={theme.fonts.mono} />
                <StateLabel x={serverX + 60} y={arrowY2 + 8} text="SYN_RCVD" active={step >= 2} fontMono={theme.fonts.mono} />
                <StateLabel x={serverX + 60} y={arrowY3 + 8} text="ESTABLISHED" active={step >= 3} fontMono={theme.fonts.mono} />

                {/* Arrow 1: SYN */}
                <Arrow
                    fromX={clientX}
                    toX={serverX}
                    y={arrowY1}
                    label="SYN"
                    sublabel="seq=x"
                    active={step >= 1}
                    color={step >= 1 ? '#3b82f6' : '#94a3b8'}
                    fontMono={theme.fonts.mono}
                />

                {/* Arrow 2: SYN+ACK */}
                <Arrow
                    fromX={serverX}
                    toX={clientX}
                    y={arrowY2}
                    label="SYN+ACK"
                    sublabel="seq=y, ack=x+1"
                    active={step >= 2}
                    color={step >= 2 ? '#8b5cf6' : '#94a3b8'}
                    fontMono={theme.fonts.mono}
                />

                {/* Arrow 3: ACK */}
                <Arrow
                    fromX={clientX}
                    toX={serverX}
                    y={arrowY3}
                    label="ACK"
                    sublabel="ack=y+1"
                    active={step >= 3}
                    color={step >= 3 ? '#10b981' : '#94a3b8'}
                    fontMono={theme.fonts.mono}
                />
            </svg>
        )
    }

    return <AnimatedDiagram steps={steps} renderStep={renderStep} autoPlayInterval={2000} />
}
