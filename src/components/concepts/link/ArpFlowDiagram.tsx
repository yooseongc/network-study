import { AnimatedDiagram } from '../../viz/AnimatedDiagram'

const arpSteps = [
    {
        label: 'ARP Request (Broadcast)',
        description:
            'Host A(10.0.0.1)가 10.0.0.2의 MAC 주소를 알지 못합니다. ARP Request를 브로드캐스트(FF:FF:FF:FF:FF:FF)로 전송합니다.',
    },
    {
        label: '스위치가 모든 포트로 플러딩',
        description:
            '스위치는 브로드캐스트 프레임을 수신 포트를 제외한 모든 포트로 플러딩합니다. Host B와 Host C 모두 ARP Request를 수신합니다.',
    },
    {
        label: 'ARP Reply (Unicast)',
        description:
            'Host B(10.0.0.2)만 자신의 IP와 일치하는 것을 확인하고, 자신의 MAC 주소를 담은 ARP Reply를 유니캐스트로 Host A에게 전송합니다. Host C는 무시합니다.',
    },
    {
        label: 'ARP 캐시 업데이트',
        description:
            'Host A는 ARP Reply를 수신하여 10.0.0.2 → AA:BB:CC:DD:EE:FF 매핑을 ARP 캐시에 저장합니다. 이후 통신은 직접 유니캐스트로 진행됩니다.',
    },
]

const FONT = "'Pretendard Variable', Pretendard, sans-serif"
const MONO = "'JetBrains Mono', monospace"

const HOST_A = { x: 80, label: 'Host A', ip: '10.0.0.1' }
const HOST_B = { x: 420, label: 'Host B', ip: '10.0.0.2' }
const HOST_C = { x: 250, label: 'Host C', ip: '10.0.0.3' }
const HOST_Y = 155
const SWITCH_X = 250
const SWITCH_Y = 65

function HostBox({
    x,
    label,
    ip,
    highlight,
    dim,
    crossMark,
}: {
    x: number
    label: string
    ip: string
    highlight?: boolean
    dim?: boolean
    crossMark?: boolean
}) {
    return (
        <g opacity={dim ? 0.3 : 1}>
            <rect
                x={x - 42}
                y={HOST_Y - 20}
                width={84}
                height={50}
                rx={8}
                className={
                    highlight
                        ? 'fill-blue-100 dark:fill-blue-900/40 stroke-blue-500 dark:stroke-blue-400'
                        : 'fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600'
                }
                strokeWidth={1.5}
            />
            <text
                x={x}
                y={HOST_Y}
                textAnchor="middle"
                className="fill-gray-800 dark:fill-gray-200"
                style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600 }}
            >
                {label}
            </text>
            <text
                x={x}
                y={HOST_Y + 17}
                textAnchor="middle"
                className="fill-gray-500 dark:fill-gray-400"
                style={{ fontFamily: MONO, fontSize: 9 }}
            >
                {ip}
            </text>
            {crossMark && (
                <text
                    x={x + 30}
                    y={HOST_Y - 8}
                    textAnchor="middle"
                    className="fill-red-500 dark:fill-red-400"
                    style={{ fontSize: 16, fontWeight: 700 }}
                >
                    ✕
                </text>
            )}
        </g>
    )
}

function SwitchBox() {
    return (
        <g>
            <rect
                x={SWITCH_X - 40}
                y={SWITCH_Y - 16}
                width={80}
                height={32}
                rx={6}
                className="fill-purple-100 dark:fill-purple-900/30 stroke-purple-400 dark:stroke-purple-500"
                strokeWidth={1.5}
            />
            <text
                x={SWITCH_X}
                y={SWITCH_Y + 5}
                textAnchor="middle"
                className="fill-purple-700 dark:fill-purple-300"
                style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600 }}
            >
                L2 Switch
            </text>
        </g>
    )
}

function ConnectionLines() {
    // Switch 하단 중심에서 각 Host 상단으로 경사 연결
    const swBottom = SWITCH_Y + 16
    const hostTop = HOST_Y - 20
    return (
        <g>
            <line x1={SWITCH_X - 25} y1={swBottom} x2={HOST_A.x} y2={hostTop}
                className="stroke-gray-300 dark:stroke-gray-600" strokeWidth={1} />
            <line x1={SWITCH_X} y1={swBottom} x2={HOST_C.x} y2={hostTop}
                className="stroke-gray-300 dark:stroke-gray-600" strokeWidth={1} />
            <line x1={SWITCH_X + 25} y1={swBottom} x2={HOST_B.x} y2={hostTop}
                className="stroke-gray-300 dark:stroke-gray-600" strokeWidth={1} />
        </g>
    )
}

function MessageLabel({ text, color }: { text: string; color: string }) {
    const cls = color === 'amber'
        ? 'fill-amber-600 dark:fill-amber-400'
        : 'fill-green-600 dark:fill-green-400'
    return (
        <text
            x={SWITCH_X}
            y={SWITCH_Y - 26}
            textAnchor="middle"
            className={cls}
            style={{ fontFamily: MONO, fontSize: 9 }}
        >
            {text}
        </text>
    )
}

/* Switch port x positions for each host */
const SW_PORT_A = SWITCH_X - 25
const SW_PORT_C = SWITCH_X
const SW_PORT_B = SWITCH_X + 25
const SW_BOTTOM = SWITCH_Y + 16
const HOST_TOP = HOST_Y - 20

/* Step 0: Host A → Switch (broadcast request) */
function Step0Arrows() {
    return (
        <g>
            <line x1={HOST_A.x} y1={HOST_TOP} x2={SW_PORT_A} y2={SW_BOTTOM}
                className="stroke-amber-500 dark:stroke-amber-400" strokeWidth={2.5}
                strokeDasharray="6 3" markerEnd="url(#arrowAmber)">
                <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1s" repeatCount="indefinite" />
            </line>
            <MessageLabel text={'"Who has 10.0.0.2? Tell 10.0.0.1"'} color="amber" />
        </g>
    )
}

/* Step 1: Switch floods to all ports (B and C) */
function Step1Arrows() {
    return (
        <g>
            {/* incoming from A (static, dimmed) */}
            <line x1={HOST_A.x} y1={HOST_TOP} x2={SW_PORT_A} y2={SW_BOTTOM}
                className="stroke-amber-500/40 dark:stroke-amber-400/40" strokeWidth={2} />
            {/* flood to B */}
            <line x1={SW_PORT_B} y1={SW_BOTTOM} x2={HOST_B.x} y2={HOST_TOP}
                className="stroke-amber-500 dark:stroke-amber-400" strokeWidth={2.5}
                strokeDasharray="6 3" markerEnd="url(#arrowAmber)">
                <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1s" repeatCount="indefinite" />
            </line>
            {/* flood to C */}
            <line x1={SW_PORT_C} y1={SW_BOTTOM} x2={HOST_C.x} y2={HOST_TOP}
                className="stroke-amber-500 dark:stroke-amber-400" strokeWidth={2.5}
                strokeDasharray="6 3" markerEnd="url(#arrowAmber)">
                <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1s" repeatCount="indefinite" />
            </line>
            <MessageLabel text="Broadcast → 모든 포트로 플러딩" color="amber" />
        </g>
    )
}

/* Step 2: Host B replies unicast to Host A via Switch */
function Step2Arrows() {
    return (
        <g>
            {/* B → Switch */}
            <line x1={HOST_B.x} y1={HOST_TOP} x2={SW_PORT_B} y2={SW_BOTTOM}
                className="stroke-green-500 dark:stroke-green-400" strokeWidth={2.5}
                strokeDasharray="6 3" markerEnd="url(#arrowGreen)">
                <animate attributeName="stroke-dashoffset" from="18" to="0" dur="0.8s" repeatCount="indefinite" />
            </line>
            {/* Switch → A */}
            <line x1={SW_PORT_A} y1={SW_BOTTOM} x2={HOST_A.x} y2={HOST_TOP}
                className="stroke-green-500 dark:stroke-green-400" strokeWidth={2.5}
                strokeDasharray="6 3" markerEnd="url(#arrowGreen)">
                <animate attributeName="stroke-dashoffset" from="18" to="0" dur="0.8s" repeatCount="indefinite" />
            </line>
            <MessageLabel text={'"10.0.0.2 is at AA:BB:CC:DD:EE:FF"'} color="green" />
        </g>
    )
}

/* Step 3: ARP cache updated on Host A */
function Step3Cache() {
    return (
        <g>
            <rect
                x={HOST_A.x - 65}
                y={HOST_Y + 38}
                width={150}
                height={42}
                rx={6}
                className="fill-green-50 dark:fill-green-900/30 stroke-green-400 dark:stroke-green-500"
                strokeWidth={1}
            />
            <text
                x={HOST_A.x + 10}
                y={HOST_Y + 55}
                textAnchor="middle"
                className="fill-green-700 dark:fill-green-300"
                style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700 }}
            >
                ARP Cache Updated
            </text>
            <text
                x={HOST_A.x + 10}
                y={HOST_Y + 70}
                textAnchor="middle"
                className="fill-green-600 dark:fill-green-400"
                style={{ fontFamily: MONO, fontSize: 8 }}
            >
                10.0.0.2 → AA:BB:CC:DD:EE:FF
            </text>
        </g>
    )
}

export function ArpFlowDiagram() {
    const renderStep = (step: number) => (
        <svg viewBox="0 0 520 250" className="w-full h-auto" style={{ maxHeight: 280 }}>
            <defs>
                <marker id="arrowAmber" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <path d="M0,0 L8,3 L0,6 Z" className="fill-amber-500 dark:fill-amber-400" />
                </marker>
                <marker id="arrowGreen" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <path d="M0,0 L8,3 L0,6 Z" className="fill-green-500 dark:fill-green-400" />
                </marker>
            </defs>

            <ConnectionLines />
            <SwitchBox />

            <HostBox x={HOST_A.x} label={HOST_A.label} ip={HOST_A.ip} highlight={step === 0 || step === 3} />
            <HostBox x={HOST_B.x} label={HOST_B.label} ip={HOST_B.ip} highlight={step === 1 || step === 2} />
            <HostBox x={HOST_C.x} label={HOST_C.label} ip={HOST_C.ip}
                dim={step >= 2} crossMark={step === 2} />

            {step === 0 && <Step0Arrows />}
            {step === 1 && <Step1Arrows />}
            {step === 2 && <Step2Arrows />}
            {step === 3 && <Step3Cache />}
        </svg>
    )

    return <AnimatedDiagram steps={arpSteps} renderStep={renderStep} autoPlayInterval={3000} />
}
