import { themeColors,useIsDark , AnimatedDiagram, createD3Theme } from '@study-ui/components'

const steps = [
    {
        label: '응용 데이터 생성',
        description:
            '사용자가 웹 브라우저에서 요청을 보내면, 응용 계층에서 HTTP 메시지(데이터)가 생성됩니다. 이것이 전송의 출발점입니다.',
    },
    {
        label: '전송 계층 — TCP 헤더 추가',
        description:
            '전송 계층(TCP)은 데이터 앞에 TCP 헤더를 붙입니다. 출발지/목적지 포트, 시퀀스 번호, 체크섬 등이 포함됩니다. 이 단위를 세그먼트(Segment)라고 부릅니다.',
    },
    {
        label: '네트워크 계층 — IP 헤더 추가',
        description:
            '네트워크 계층(IP)은 세그먼트 앞에 IP 헤더를 추가합니다. 출발지/목적지 IP 주소, TTL 등이 포함됩니다. 이 단위를 패킷(Packet)이라고 부릅니다.',
    },
    {
        label: '데이터링크 계층 — Ethernet 헤더/FCS 추가',
        description:
            '데이터링크 계층은 패킷 앞에 Ethernet 헤더(MAC 주소)를, 뒤에 FCS(오류 검출용)를 추가합니다. 이 단위를 프레임(Frame)이라고 부릅니다. 이제 물리 매체를 통해 전송됩니다.',
    },
    {
        label: '역캡슐화 — 수신 측',
        description:
            '수신 측에서는 반대 순서로 각 계층의 헤더를 하나씩 제거합니다. 프레임 → 패킷 → 세그먼트 → 데이터 순서로 원래 응용 데이터를 복원합니다.',
    },
]

interface LayerBlock {
    label: string
    color: string
    width: number
}

function EncapVisual({ currentStep }: { currentStep: number; isDark: boolean }) {
    const isDk = useIsDark()
    const c = themeColors(isDk)
    const theme = createD3Theme(isDk)

    const allLayers: LayerBlock[] = [
        { label: 'Eth Header', color: c.amberFill, width: 80 },
        { label: 'IP Header', color: c.greenFill, width: 70 },
        { label: 'TCP Header', color: c.blueFill, width: 70 },
        { label: 'Data', color: c.purpleFill, width: 120 },
        { label: 'FCS', color: c.amberFill, width: 40 },
    ]

    const allStrokes: string[] = [c.amberStroke, c.greenStroke, c.blueStroke, c.purpleStroke, c.amberStroke]
    const allTextColors: string[] = [c.amberText, c.greenText, c.blueText, c.purpleText, c.amberText]

    // Which layers are visible at each step
    const visibleMap: number[][] = [
        [3],        // step 0: just data
        [2, 3],     // step 1: TCP + data
        [1, 2, 3],  // step 2: IP + TCP + data
        [0, 1, 2, 3, 4], // step 3: full frame
        [3],        // step 4: decapsulated back to data
    ]

    const visible = visibleMap[currentStep] || [3]
    const layers = visible.map((i) => ({
        ...allLayers[i],
        stroke: allStrokes[i],
        textColor: allTextColors[i],
    }))

    const totalWidth = layers.reduce((sum, l) => sum + l.width, 0)
    const startX = Math.max(0, (500 - totalWidth) / 2)

    const isDecapsulating = currentStep === 4
    const directionLabel = currentStep <= 3 && currentStep >= 1
        ? 'Encapsulation (캡슐화)'
        : currentStep === 4
            ? 'Decapsulation (역캡슐화)'
            : ''

    return (
        <div className="flex flex-col items-center gap-4">
            {directionLabel && (
                <div
                    className="text-xs font-mono px-3 py-1 rounded-full"
                    style={{
                        color: isDecapsulating ? c.redText : c.blueText,
                        backgroundColor: isDecapsulating ? c.redFill : c.blueFill,
                        border: `1px solid ${isDecapsulating ? c.redStroke : c.blueStroke}`,
                    }}
                >
                    {isDecapsulating ? '← ' : '→ '}{directionLabel}
                </div>
            )}
            <svg width="100%" viewBox={`0 0 520 80`} style={{ maxWidth: 520 }}>
                {layers.map((layer, i) => {
                    let x = startX
                    for (let j = 0; j < i; j++) x += layers[j].width
                    return (
                        <g key={i}>
                            <rect
                                x={x}
                                y={10}
                                width={layer.width}
                                height={54}
                                rx={i === 0 ? 6 : 0}
                                ry={i === 0 ? 6 : 0}
                                fill={layer.color}
                                stroke={layer.stroke}
                                strokeWidth={1.5}
                                style={{
                                    transition: 'all 0.4s ease',
                                }}
                            />
                            <text
                                x={x + layer.width / 2}
                                y={41}
                                textAnchor="middle"
                                fill={layer.textColor}
                                fontSize={layer.width < 60 ? 9 : 11}
                                fontWeight={600}
                                fontFamily={theme.fonts.sans}
                            >
                                {layer.label}
                            </text>
                        </g>
                    )
                })}
            </svg>
            <div className="flex gap-2 flex-wrap justify-center">
                {currentStep <= 3 && (
                    <span
                        className="text-xs font-mono px-2 py-0.5 rounded"
                        style={{ color: c.textMuted }}
                    >
                        PDU: {currentStep === 0 ? 'Data' : currentStep === 1 ? 'Segment' : currentStep === 2 ? 'Packet' : 'Frame'}
                    </span>
                )}
            </div>
        </div>
    )
}

export function EncapsulationDiagram() {
    const isDark = useIsDark()

    return (
        <AnimatedDiagram
            steps={steps}
            renderStep={(step) => <EncapVisual currentStep={step} isDark={isDark} />}
            autoPlayInterval={2500}
        />
    )
}
