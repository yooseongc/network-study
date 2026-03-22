import { AnimatedDiagram } from '../../viz/AnimatedDiagram'

const arpSteps = [
    {
        label: 'ARP Request (Broadcast)',
        description:
            'Host A(10.0.0.1)가 10.0.0.2의 MAC 주소를 알지 못합니다. ARP Request를 브로드캐스트(FF:FF:FF:FF:FF:FF)로 전송합니다.',
    },
    {
        label: '모든 호스트 수신',
        description:
            '같은 브로드캐스트 도메인의 모든 호스트가 ARP Request를 수신합니다. 자신의 IP가 아니면 패킷을 무시합니다.',
    },
    {
        label: 'ARP Reply (Unicast)',
        description:
            'Host B(10.0.0.2)가 자신의 IP와 일치하는 것을 확인하고, 자신의 MAC 주소(AA:BB:CC:DD:EE:FF)를 담은 ARP Reply를 유니캐스트로 Host A에게 전송합니다.',
    },
    {
        label: 'ARP 캐시 업데이트',
        description:
            'Host A는 ARP Reply를 수신하여 10.0.0.2 → AA:BB:CC:DD:EE:FF 매핑을 ARP 캐시에 저장합니다. 이후 통신은 직접 유니캐스트로 진행됩니다.',
    },
]

/* ── 호스트 위치 상수 ── */
const HOST_A = { x: 80, label: 'Host A', ip: '10.0.0.1', mac: '11:22:33:44:55:66' }
const HOST_B = { x: 420, label: 'Host B', ip: '10.0.0.2', mac: 'AA:BB:CC:DD:EE:FF' }
const HOST_C = { x: 250, label: 'Host C', ip: '10.0.0.3', mac: 'CC:DD:EE:FF:00:11' }
const HOST_Y = 120
const SWITCH_X = 250
const SWITCH_Y = 50

function HostBox({
    x,
    label,
    ip,
    highlight,
    dim,
}: {
    x: number
    label: string
    ip: string
    highlight?: boolean
    dim?: boolean
}) {
    return (
        <g opacity={dim ? 0.35 : 1}>
            <rect
                x={x - 40}
                y={HOST_Y - 18}
                width={80}
                height={48}
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
                y={HOST_Y + 2}
                textAnchor="middle"
                className="fill-gray-800 dark:fill-gray-200 text-xs font-semibold"
                style={{ fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontSize: 12 }}
            >
                {label}
            </text>
            <text
                x={x}
                y={HOST_Y + 18}
                textAnchor="middle"
                className="fill-gray-500 dark:fill-gray-400"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9 }}
            >
                {ip}
            </text>
        </g>
    )
}

function SwitchBox() {
    return (
        <g>
            <rect
                x={SWITCH_X - 35}
                y={SWITCH_Y - 14}
                width={70}
                height={28}
                rx={6}
                className="fill-purple-100 dark:fill-purple-900/30 stroke-purple-400 dark:stroke-purple-500"
                strokeWidth={1.5}
            />
            <text
                x={SWITCH_X}
                y={SWITCH_Y + 4}
                textAnchor="middle"
                className="fill-purple-700 dark:fill-purple-300 text-xs font-semibold"
                style={{ fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontSize: 11 }}
            >
                Switch
            </text>
        </g>
    )
}

function ConnectionLine({ x1, x2 }: { x1: number; x2: number }) {
    return (
        <line
            x1={x1}
            y1={SWITCH_Y + 14}
            x2={x2}
            y2={HOST_Y - 18}
            className="stroke-gray-300 dark:stroke-gray-600"
            strokeWidth={1}
        />
    )
}

/* ── 애니메이션 화살표 (방송/유니캐스트) ── */
function BroadcastArrows() {
    return (
        <g>
            {[HOST_A.x + 40, HOST_B.x - 40, HOST_C.x].map((tx, i) => (
                <line
                    key={i}
                    x1={HOST_A.x + 40}
                    y1={HOST_Y}
                    x2={tx}
                    y2={HOST_Y}
                    className="stroke-amber-500 dark:stroke-amber-400"
                    strokeWidth={2}
                    strokeDasharray="6 3"
                >
                    <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1s" repeatCount="indefinite" />
                </line>
            ))}
            <text
                x={SWITCH_X}
                y={HOST_Y + 50}
                textAnchor="middle"
                className="fill-amber-600 dark:fill-amber-400"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}
            >
                &quot;Who has 10.0.0.2? Tell 10.0.0.1&quot;
            </text>
        </g>
    )
}

function UnicastArrow() {
    return (
        <g>
            <line
                x1={HOST_B.x - 40}
                y1={HOST_Y}
                x2={HOST_A.x + 40}
                y2={HOST_Y}
                className="stroke-green-500 dark:stroke-green-400"
                strokeWidth={2}
                markerEnd="url(#arrowGreen)"
            >
                <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1s" repeatCount="indefinite" />
            </line>
            <text
                x={SWITCH_X}
                y={HOST_Y + 50}
                textAnchor="middle"
                className="fill-green-600 dark:fill-green-400"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}
            >
                &quot;10.0.0.2 is at AA:BB:CC:DD:EE:FF&quot;
            </text>
        </g>
    )
}

function CacheUpdate() {
    return (
        <g>
            <rect
                x={HOST_A.x - 60}
                y={HOST_Y + 42}
                width={140}
                height={40}
                rx={6}
                className="fill-green-50 dark:fill-green-900/30 stroke-green-400 dark:stroke-green-500"
                strokeWidth={1}
            />
            <text
                x={HOST_A.x + 10}
                y={HOST_Y + 58}
                textAnchor="middle"
                className="fill-green-700 dark:fill-green-300"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600 }}
            >
                ARP Cache Updated
            </text>
            <text
                x={HOST_A.x + 10}
                y={HOST_Y + 72}
                textAnchor="middle"
                className="fill-green-600 dark:fill-green-400"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8 }}
            >
                10.0.0.2 → AA:BB:CC:DD:EE:FF
            </text>
        </g>
    )
}

export function ArpFlowDiagram() {
    const renderStep = (step: number) => (
        <svg viewBox="0 0 520 200" className="w-full h-auto" style={{ maxHeight: 240 }}>
            <defs>
                <marker id="arrowGreen" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <path d="M0,0 L8,3 L0,6 Z" className="fill-green-500 dark:fill-green-400" />
                </marker>
            </defs>

            {/* connections */}
            <ConnectionLine x1={HOST_A.x} x2={SWITCH_X - 30} />
            <ConnectionLine x1={HOST_C.x} x2={SWITCH_X} />
            <ConnectionLine x1={HOST_B.x} x2={SWITCH_X + 30} />

            <SwitchBox />

            <HostBox x={HOST_A.x} label={HOST_A.label} ip={HOST_A.ip} highlight={step === 0 || step === 3} />
            <HostBox
                x={HOST_B.x}
                label={HOST_B.label}
                ip={HOST_B.ip}
                highlight={step === 2}
            />
            <HostBox x={HOST_C.x} label={HOST_C.label} ip={HOST_C.ip} dim={step >= 2} />

            {step === 0 && <BroadcastArrows />}
            {step === 1 && <BroadcastArrows />}
            {step === 2 && <UnicastArrow />}
            {step === 3 && <CacheUpdate />}
        </svg>
    )

    return <AnimatedDiagram steps={arpSteps} renderStep={renderStep} autoPlayInterval={3000} />
}
