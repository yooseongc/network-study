import { AnimatedDiagram, createD3Theme, useIsDark } from '@study-ui/components'

const dnsSteps = [
    {
        label: '1. 클라이언트 → Local Resolver',
        description:
            '사용자가 브라우저에 www.example.com을 입력하면, OS의 stub resolver가 설정된 Local DNS Resolver(보통 ISP 또는 8.8.8.8)에 재귀 질의(Recursive Query)를 보냅니다.',
    },
    {
        label: '2. Local Resolver → Root NS',
        description:
            'Local Resolver는 캐시에 없으면 Root Name Server(.)에 반복 질의(Iterative Query)를 보냅니다. Root NS는 ".com" TLD를 담당하는 NS 주소를 응답합니다.',
    },
    {
        label: '3. Local Resolver → TLD NS (.com)',
        description:
            'Local Resolver는 .com TLD NS에 다시 반복 질의를 보냅니다. TLD NS는 "example.com"을 담당하는 Authoritative NS 주소를 응답합니다.',
    },
    {
        label: '4. Local Resolver → Authoritative NS',
        description:
            'Local Resolver는 example.com의 Authoritative NS에 질의합니다. 이 서버가 www.example.com의 실제 IP 주소(A 레코드)를 응답합니다.',
    },
    {
        label: '5. Authoritative NS → Local Resolver 응답',
        description:
            'Authoritative NS가 www.example.com → 93.184.216.34 (A 레코드)를 응답합니다. Local Resolver는 이 결과를 TTL 동안 캐시합니다.',
    },
    {
        label: '6. Local Resolver → 클라이언트 응답',
        description:
            'Local Resolver가 최종 IP 주소를 클라이언트에게 응답합니다. 브라우저는 이 IP로 TCP 연결을 시작하여 웹페이지를 요청합니다.',
    },
]

/* positions — wider spacing to avoid label overlap */
const CX = 70    // Client
const LX = 240   // Local Resolver
const RX = 420   // Root NS
const TX = 600   // TLD NS
const AX = 780   // Auth NS
const Y_TOP = 44
const Y_BOT = 140
const BOX_W = 110
const BOX_H = 44

function ServerBox({
    x,
    y,
    label,
    sub,
    highlight,
    colorClass,
    fontSans,
    fontMono,
}: {
    x: number
    y: number
    label: string
    sub: string
    highlight?: boolean
    colorClass: string
    fontSans: string
    fontMono: string
}) {
    const baseClass = highlight
        ? colorClass.replace('fill-gray-100', 'fill-blue-100').replace('fill-gray-800', 'fill-blue-900/40')
            .replace('stroke-gray-300', 'stroke-blue-500').replace('stroke-gray-600', 'stroke-blue-400')
        : colorClass
    // Use direct classes instead of dynamic replacement
    return (
        <g>
            <rect
                x={x - BOX_W / 2}
                y={y - BOX_H / 2}
                width={BOX_W}
                height={BOX_H}
                rx={8}
                className={highlight
                    ? 'fill-blue-100 dark:fill-blue-900/40 stroke-blue-500 dark:stroke-blue-400'
                    : baseClass}
                strokeWidth={highlight ? 2 : 1.5}
            />
            <text
                x={x}
                y={y - 4}
                textAnchor="middle"
                className={highlight
                    ? 'fill-blue-700 dark:fill-blue-200 text-xs font-semibold'
                    : 'fill-gray-800 dark:fill-gray-200 text-xs font-semibold'}
                style={{ fontFamily: fontSans, fontSize: 11 }}
            >
                {label}
            </text>
            <text
                x={x}
                y={y + 12}
                textAnchor="middle"
                className="fill-gray-500 dark:fill-gray-400"
                style={{ fontFamily: fontMono, fontSize: 8 }}
            >
                {sub}
            </text>
        </g>
    )
}

function Arrow({
    x1,
    y1,
    x2,
    y2,
    color,
    label,
    dashed,
    fontSans,
}: {
    x1: number
    y1: number
    x2: number
    y2: number
    color: string
    label?: string
    dashed?: boolean
    fontSans: string
}) {
    const dx = x2 - x1
    const dy = y2 - y1
    const len = Math.sqrt(dx * dx + dy * dy)
    const ux = dx / len
    const uy = dy / len
    const ax1 = x1 + ux * (BOX_W / 2 + 4)
    const ay1 = y1 + uy * (BOX_H / 2 + 2)
    const ax2 = x2 - ux * (BOX_W / 2 + 4)
    const ay2 = y2 - uy * (BOX_H / 2 + 2)
    const mx = (ax1 + ax2) / 2
    const my = (ay1 + ay2) / 2

    // arrowhead
    const aLen = 8
    const aAngle = Math.PI / 6
    const angle = Math.atan2(ay2 - ay1, ax2 - ax1)
    const p1x = ax2 - aLen * Math.cos(angle - aAngle)
    const p1y = ay2 - aLen * Math.sin(angle - aAngle)
    const p2x = ax2 - aLen * Math.cos(angle + aAngle)
    const p2y = ay2 - aLen * Math.sin(angle + aAngle)

    return (
        <g>
            <line
                x1={ax1}
                y1={ay1}
                x2={ax2}
                y2={ay2}
                stroke={color}
                strokeWidth={2}
                strokeDasharray={dashed ? '6 3' : undefined}
            >
                {dashed && (
                    <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1s" repeatCount="indefinite" />
                )}
            </line>
            <polygon points={`${ax2},${ay2} ${p1x},${p1y} ${p2x},${p2y}`} fill={color} />
            {label && (
                <text
                    x={mx}
                    y={my - 6}
                    textAnchor="middle"
                    fill={color}
                    style={{ fontFamily: fontSans, fontSize: 8, fontWeight: 600 }}
                >
                    {label}
                </text>
            )}
        </g>
    )
}

export function DnsResolutionDiagram() {
    const isDark = useIsDark()
    const theme = createD3Theme(isDark)
    const renderStep = (step: number) => (
        <svg viewBox="0 0 860 195" className="w-full h-auto" style={{ maxHeight: 280 }}>
            {/* Server boxes */}
            <ServerBox
                x={CX} y={Y_BOT} label="Client" sub="stub resolver"
                highlight={step === 0 || step === 5}
                colorClass="fill-green-100 dark:fill-green-900/30 stroke-green-400 dark:stroke-green-500"
                fontSans={theme.fonts.sans} fontMono={theme.fonts.mono}
            />
            <ServerBox
                x={LX} y={Y_BOT} label="Local Resolver" sub="8.8.8.8"
                highlight={step >= 0 && step <= 5}
                colorClass="fill-purple-100 dark:fill-purple-900/30 stroke-purple-400 dark:stroke-purple-500"
                fontSans={theme.fonts.sans} fontMono={theme.fonts.mono}
            />
            <ServerBox
                x={RX} y={Y_TOP} label="Root NS" sub=". (root)"
                highlight={step === 1}
                colorClass="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600"
                fontSans={theme.fonts.sans} fontMono={theme.fonts.mono}
            />
            <ServerBox
                x={TX} y={Y_TOP} label="TLD NS" sub=".com"
                highlight={step === 2}
                colorClass="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600"
                fontSans={theme.fonts.sans} fontMono={theme.fonts.mono}
            />
            <ServerBox
                x={AX} y={Y_TOP} label="Auth NS" sub="example.com"
                highlight={step === 3 || step === 4}
                colorClass="fill-amber-100 dark:fill-amber-900/30 stroke-amber-400 dark:stroke-amber-500"
                fontSans={theme.fonts.sans} fontMono={theme.fonts.mono}
            />

            {/* Arrows per step */}
            {step === 0 && (
                <Arrow x1={CX} y1={Y_BOT} x2={LX} y2={Y_BOT}
                    color="#3b82f6" label="Recursive Query" dashed fontSans={theme.fonts.sans} />
            )}
            {step === 1 && (
                <Arrow x1={LX} y1={Y_BOT} x2={RX} y2={Y_TOP}
                    color="#f59e0b" label="Iterative Query" dashed fontSans={theme.fonts.sans} />
            )}
            {step === 2 && (
                <>
                    <Arrow x1={RX} y1={Y_TOP} x2={LX} y2={Y_BOT}
                        color="#9ca3af" label="TLD NS referral" fontSans={theme.fonts.sans} />
                    <Arrow x1={LX} y1={Y_BOT} x2={TX} y2={Y_TOP}
                        color="#f59e0b" label="Iterative Query" dashed fontSans={theme.fonts.sans} />
                </>
            )}
            {step === 3 && (
                <>
                    <Arrow x1={TX} y1={Y_TOP} x2={LX} y2={Y_BOT}
                        color="#9ca3af" label="Auth NS referral" fontSans={theme.fonts.sans} />
                    <Arrow x1={LX} y1={Y_BOT} x2={AX} y2={Y_TOP}
                        color="#f59e0b" label="Iterative Query" dashed fontSans={theme.fonts.sans} />
                </>
            )}
            {step === 4 && (
                <Arrow x1={AX} y1={Y_TOP} x2={LX} y2={Y_BOT}
                    color="#22c55e" label="A: 93.184.216.34" fontSans={theme.fonts.sans} />
            )}
            {step === 5 && (
                <Arrow x1={LX} y1={Y_BOT} x2={CX} y2={Y_BOT}
                    color="#22c55e" label="93.184.216.34" fontSans={theme.fonts.sans} />
            )}

            {/* Query label */}
            <text
                x={430}
                y={188}
                textAnchor="middle"
                className="fill-gray-500 dark:fill-gray-400"
                style={{ fontFamily: theme.fonts.mono, fontSize: 9 }}
            >
                Query: www.example.com → ?
            </text>
        </svg>
    )

    return <AnimatedDiagram steps={dnsSteps} renderStep={renderStep} autoPlayInterval={3000} />
}
