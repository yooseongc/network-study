import { RssRpsDiagram } from '../../components/concepts/performance/RssRpsDiagram'
import { Alert, CardGrid, CodeBlock, InfoBox, InfoTable, InlineCode, Prose, Section, StatCard, T , TopicPage } from '@study-ui/components'
import {
    ethtoolOffloadCode,
    ethtoolStatsCode,
    tcQdiscCode,
    tcNetemCode,
    procInterruptsCode,
    rssRpsCode,
    iperfCode,
    busyPollingCode,
    xdpCode,
    tcQosCode,
} from './codeSnippets'

/* ── Inline data ──────────────────────────────────────────────────── */

const metricsRows = [
    { cells: ['대역폭 (Bandwidth)', '단위 시간당 전송 가능한 최대 데이터량', 'bps, Mbps, Gbps'] },
    { cells: ['지연시간 (Latency)', '패킷이 출발지에서 목적지까지 걸리는 시간', 'ms, us'] },
    { cells: ['지터 (Jitter)', '지연시간의 변동폭 (패킷 간 도착 시간 차이)', 'ms'] },
    { cells: ['손실률 (Loss Rate)', '전송 중 유실되는 패킷의 비율', '%'] },
    { cells: ['RTT (Round Trip Time)', '패킷 왕복에 걸리는 시간', 'ms'] },
    { cells: ['처리량 (Throughput)', '실제로 전송되는 유효 데이터량', 'bps'] },
]

const offloadRows = [
    { cells: ['TSO (TCP Segmentation Offload)', 'TX', 'TCP 세그먼트 분할을 NIC가 수행'] },
    { cells: ['GSO (Generic Segmentation Offload)', 'TX', 'TSO의 소프트웨어 대체'] },
    { cells: ['GRO (Generic Receive Offload)', 'RX', '수신 패킷을 병합하여 하나의 큰 패킷으로 전달'] },
    { cells: ['LRO (Large Receive Offload)', 'RX', 'GRO의 하드웨어 버전 (라우팅 시 문제 가능)'] },
    { cells: ['Checksum Offload', 'TX/RX', '체크섬 계산/검증을 NIC 하드웨어가 수행'] },
]

const rssCompareRows = [
    { cells: ['RSS', '하드웨어', 'NIC', 'NIC 멀티큐 기반 해시 분산', '가장 효율적'] },
    { cells: ['RPS', '소프트웨어', 'CPU (softirq)', '커널이 해시 계산 후 CPU 분산', 'NIC 멀티큐 없이도 가능'] },
    { cells: ['RFS', '소프트웨어', 'CPU (softirq)', '패킷을 해당 플로우 처리 CPU로 전달', 'RPS + 캐시 친화성'] },
    { cells: ['XPS', '소프트웨어', 'CPU (TX)', '송신 큐를 특정 CPU에 매핑', 'TX 경로 최적화'] },
]

const qdiscRows = [
    { cells: ['pfifo_fast', '3-band 우선순위 FIFO', '과거 기본 qdisc'] },
    { cells: ['fq_codel', 'Fair Queuing + Controlled Delay', '현재 기본 qdisc (bufferbloat 방지)'] },
    { cells: ['htb', 'Hierarchical Token Bucket', '계층적 대역폭 할당'] },
    { cells: ['tbf', 'Token Bucket Filter', '단순 속도 제한'] },
    { cells: ['netem', 'Network Emulator', '지연/손실/지터 시뮬레이션'] },
    { cells: ['ingress', 'Ingress qdisc', '수신 트래픽 필터링 (tc filter)'] },
    { cells: ['clsact', 'Ingress + Egress', 'BPF 프로그램 부착 지점'] },
]

const highPerfCompareRows = [
    { cells: ['일반 스택', '커널', '모든 기능', '가장 낮음', '범용 서버'] },
    { cells: ['XDP', '커널 (드라이버)', 'L2~L3 수준', '높음', '방화벽, DDoS 방어, LB'] },
    { cells: ['AF_PACKET', '커널 (mmap)', 'L2 캡처', '중간', '패킷 캡처 (tcpdump)'] },
    { cells: ['DPDK', '유저 공간', '완전 커스텀', '가장 높음', '통신장비, NFV'] },
]

const qosClassRows = [
    { cells: ['EF (Expedited Forwarding)', '46', '0xB8', '실시간 트래픽 (VoIP, 화상회의)', '최우선, 저지연 보장'] },
    { cells: ['AF41 (Assured Forwarding)', '34', '0x88', '스트리밍, 대화형 비디오', '높은 우선순위'] },
    { cells: ['AF21', '18', '0x48', '업무 핵심 애플리케이션', '중간 우선순위'] },
    { cells: ['CS1 (Scavenger)', '8', '0x20', '백업, 대용량 전송', '낮은 우선순위'] },
    { cells: ['BE (Best Effort)', '0', '0x00', '일반 웹 브라우징', '기본값, 보장 없음'] },
]

const queuingRows = [
    { cells: ['PQ (Priority Queuing)', '엄격한 우선순위 큐, 높은 큐가 빌 때까지 낮은 큐 대기', '단순하지만 starvation 위험'] },
    { cells: ['WFQ (Weighted Fair Queuing)', '플로우별 가중치 기반 공정 분배', '플로우 수가 많으면 오버헤드'] },
    { cells: ['CBWFQ (Class-Based WFQ)', 'WFQ에 클래스 기반 대역폭 보장 추가', '클래스별 최소 대역폭 설정'] },
    { cells: ['LLQ (Low Latency Queuing)', 'CBWFQ + PQ 결합: 실시간 트래픽 전용 우선순위 큐', 'VoIP 환경 권장'] },
]

/* ── Component ────────────────────────────────────────────────────── */

export default function Topic12Performance() {
    return (
        <TopicPage topicId="12-performance" learningItems={[
                    'NIC offload 기능의 종류와 효과를 이해한다',
                    'RSS/RPS로 멀티코어 분산 처리를 설명할 수 있다',
                    'qdisc와 tc의 트래픽 제어 원리를 파악한다',
                    'QoS의 DiffServ/IntServ 모델과 DSCP 마킹을 이해한다',
                    'XDP와 DPDK의 개요와 차이를 파악한다',
                ]}>

            {/* ── 12.1 ────────────────────────────────────────────── */}
            <Section id="s121" title="12.1  네트워크 성능 지표">
                <Prose>
                    네트워크 성능을 이야기할 때 가장 자주 언급되는 지표는 대역폭, 지연시간, 지터, 손실률입니다.
                    이 네 가지를 정확히 이해해야 병목 분석과 성능 튜닝의 출발점을 잡을 수 있습니다.
                </Prose>
                <InfoTable headers={['지표', '설명', '단위']} rows={metricsRows} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <StatCard title="10G NIC 대역폭" value="10 Gbps" color="blue" desc="이론적 최대 전송률" />
                    <StatCard title="LAN RTT" value="< 1 ms" color="green" desc="같은 데이터센터 내부" />
                    <StatCard title="대륙간 RTT" value="100~300 ms" color="amber" desc="태평양 횡단 등" />
                    <StatCard title="허용 손실률" value="< 0.01%" color="red" desc="일반 서비스 기준" />
                </div>
                <InfoBox color="blue" title="대역폭 vs 처리량">
                    대역폭(bandwidth)은 링크의 물리적 최대 전송 능력이고, 처리량(throughput)은 실제 전송되는
                    데이터량입니다. 프로토콜 오버헤드, 혼잡, 손실 등으로 처리량은 항상 대역폭보다 낮습니다.
                </InfoBox>
                <Alert variant="tip" title="지터가 중요한 이유">
                    VoIP, 화상회의, 실시간 게임 등에서는 지연시간 자체보다
                    지터(jitter)가 더 큰 문제입니다. 일정하지 않은 도착 시간은 버퍼링과 품질 저하를 유발합니다.
                </Alert>
                <CodeBlock code={iperfCode} language="bash" filename="iperf3 성능 측정" />
            </Section>

            {/* ── 12.2 ────────────────────────────────────────────── */}
            <Section id="s122" title="12.2  RTT와 throughput, BDP">
                <Prose>
                    TCP의 실제 처리량은 대역폭만으로 결정되지 않습니다. RTT(Round Trip Time)가 길수록
                    ACK를 기다리는 시간이 늘어나 파이프라인이 비효율적이 됩니다.
                    이 관계를 정량적으로 표현한 것이 BDP(Bandwidth Delay Product)입니다.
                </Prose>
                <InfoBox color="purple" title="BDP (Bandwidth Delay Product)">
                    <div className="space-y-2">
                        <p className="font-mono text-sm">BDP = Bandwidth x RTT</p>
                        <p>BDP는 네트워크 파이프에 동시에 존재할 수 있는 데이터의 양을 나타냅니다.
                        TCP 윈도우 크기가 BDP보다 작으면 링크를 완전히 활용할 수 없습니다.</p>
                    </div>
                </InfoBox>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <StatCard title="예시: 1Gbps, RTT 1ms" value="BDP = 125 KB" color="green" desc="1,000,000,000 x 0.001 / 8" />
                    <StatCard title="예시: 1Gbps, RTT 100ms" value="BDP = 12.5 MB" color="amber" desc="1,000,000,000 x 0.1 / 8" />
                </div>
                <Alert variant="warning" title="Long Fat Network (LFN)">
                    대역폭이 크고 RTT가 긴 네트워크에서는 BDP가 수십~수백 MB에 달합니다.
                    기본 TCP 윈도우(64KB)로는 대역폭의 극히 일부만 활용합니다.
                    TCP Window Scaling(RFC 7323)과 적절한 소켓 버퍼 크기 설정이 필수입니다.
                </Alert>
            </Section>

            {/* ── 12.3 ────────────────────────────────────────────── */}
            <Section id="s123" title="12.3  병목 지점 분석">
                <Prose>
                    성능 문제를 해결하려면 병목이 어디에 있는지를 먼저 파악해야 합니다.
                </Prose>
                <InfoTable
                    headers={['계층', '병목 원인', '진단 방법']}
                    rows={[
                        { cells: ['NIC/물리', '링크 속도 불일치, CRC 에러', 'ethtool, dmesg'] },
                        { cells: ['드라이버/링 버퍼', '링 버퍼 오버플로', 'ethtool -S, /proc/net/softnet_stat'] },
                        { cells: ['CPU', '단일 CPU에 인터럽트 집중', '/proc/interrupts, mpstat'] },
                        { cells: ['소켓 버퍼', '수신/송신 버퍼 부족', 'ss -tm, sysctl net.core.rmem_max'] },
                        { cells: ['TCP', '혼잡 제어로 cwnd 감소', 'ss -ti, /proc/net/snmp'] },
                        { cells: ['애플리케이션', '느린 read/write', 'strace, perf'] },
                    ]}
                />
                <CodeBlock code={ethtoolStatsCode} language="bash" filename="ethtool -S / -g 확인" />
                <Alert variant="info" title="softnet_stat 읽는 법">
                    <InlineCode>/proc/net/softnet_stat</InlineCode>의
                    각 행은 CPU별 통계입니다. 두 번째 열(dropped)이 증가하면 softirq budget 초과로
                    패킷이 유실되고 있다는 의미입니다.
                </Alert>
            </Section>

            {/* ── 12.4 ────────────────────────────────────────────── */}
            <Section id="s124" title="12.4  NIC offload 기능">
                <Prose>
                    NIC offload는 CPU가 수행하던 네트워크 처리 작업을 NIC 하드웨어로 위임하여
                    CPU 부담을 줄이고 처리량을 높이는 기법입니다.
                </Prose>
                <InfoTable headers={['기능', '방향', '설명']} rows={offloadRows} />
                <InfoBox color="green" title="TSO 동작 원리">
                    TSO가 없으면 커널이 MSS(1460B) 단위로 44개 세그먼트를 생성해야 합니다.
                    TSO가 있으면 커널은 64KB 전체를 NIC에 전달하고 NIC이 분할합니다.
                </InfoBox>
                <Alert variant="warning" title="LRO 주의사항">
                    LRO는 라우팅/포워딩 환경에서 문제를 일으킬 수 있습니다. GRO를 대신 사용하세요.
                </Alert>
                <CodeBlock code={ethtoolOffloadCode} language="bash" filename="ethtool -k / -K" />
            </Section>

            {/* ── 12.5 ────────────────────────────────────────────── */}
            <Section id="s125" title="12.5  멀티코어 패킷 분산 (RSS/RPS/RFS/XPS)">
                <Prose>
                    고속 네트워크에서 단일 CPU로 모든 패킷을 처리하면 CPU가 병목이 됩니다.
                    RSS, RPS, RFS, XPS는 패킷 처리를 여러 CPU 코어에 분산하는 메커니즘입니다.
                </Prose>
                <InfoTable headers={['기술', '구현', '동작 위치', '핵심 원리', '비고']} rows={rssCompareRows} />
                <RssRpsDiagram />
                <InfoBox color="blue" title="RSS (Receive Side Scaling)">
                    NIC 하드웨어가 5-tuple을 해시하여 여러 RX 큐에 분산합니다.
                    같은 플로우의 패킷은 항상 같은 큐/CPU로 전달되어 순서가 보장됩니다.
                </InfoBox>
                <CodeBlock code={rssRpsCode} language="bash" filename="RSS/RPS/RFS/XPS 설정" />
            </Section>

            {/* ── 12.6 ────────────────────────────────────────────── */}
            <Section id="s126" title="12.6  IRQ affinity와 CPU locality">
                <Prose>
                    IRQ affinity는 특정 하드웨어 인터럽트를 처리할 CPU를 지정하는 기능입니다.
                    NUMA 시스템에서는 NIC이 연결된 PCIe 슬롯과 같은 NUMA 노드의 CPU에
                    IRQ를 바인딩해야 합니다.
                </Prose>
                <CodeBlock code={procInterruptsCode} language="bash" filename="/proc/interrupts, smp_affinity" />
                <Alert variant="tip" title="irqbalance vs 수동 설정">
                    일반 서버에서는 <InlineCode>irqbalance</InlineCode> 데몬이 자동으로 IRQ를 분산합니다.
                    고성능 환경(10G+)에서는 수동으로 IRQ를 1:1 매핑하는 것이 효과적입니다.
                </Alert>
            </Section>

            {/* ── 12.7 ────────────────────────────────────────────── */}
            <Section id="s127" title="12.7  qdisc와 tc">
                <Prose>
                    리눅스의 트래픽 제어(Traffic Control)는 <T id="tc-qdisc">qdisc</T>(queuing discipline)를 기반으로 합니다.
                    <InlineCode>tc</InlineCode> 명령으로 qdisc, class, filter를 설정하여
                    대역폭 제한, 우선순위 지정, 트래픽 쉐이핑이 가능합니다.
                </Prose>
                <InfoTable headers={['qdisc', '설명', '비고']} rows={qdiscRows} />
                <InfoBox color="sky" title="tc의 3대 구성 요소">
                    <div className="space-y-1">
                        <p><strong>qdisc</strong> -- 패킷 큐잉과 스케줄링 정책</p>
                        <p><strong>class</strong> -- classful qdisc 내의 대역폭 할당 단위</p>
                        <p><strong>filter</strong> -- 패킷을 어떤 class로 분류할지 결정하는 규칙</p>
                    </div>
                </InfoBox>
                <CodeBlock code={tcQdiscCode} language="bash" filename="tc qdisc / class / filter" />
                <CodeBlock code={tcNetemCode} language="bash" filename="netem / tbf 예제" />
                <Alert variant="info" title="tc와 eBPF">
                    tc의 <InlineCode>clsact</InlineCode> qdisc에
                    BPF 프로그램을 부착하면 ingress/egress 경로에서 프로그래머블한 패킷 처리가 가능합니다.
                </Alert>
            </Section>

            {/* ── 12.8 QoS (NEW) ──────────────────────────────────── */}
            <Section id="s128" title="12.8  QoS (Quality of Service)">
                <Prose>
                    <T id="qos">QoS</T>(Quality of Service)는 네트워크 트래픽에 우선순위를 부여하여
                    중요한 애플리케이션의 성능을 보장하는 기술입니다.
                    DiffServ 모델에서는 패킷의 DSCP(Differentiated Services Code Point) 필드로
                    트래픽 클래스를 구분하고, 각 홉에서 해당 클래스에 맞는 큐잉/스케줄링 처리를 적용합니다.
                </Prose>

                <CardGrid cols={2}>
                    <InfoBox color="blue" title="DiffServ (Differentiated Services)">
                        패킷의 IP 헤더 DSCP 필드(6비트)에 클래스를 표시하고,
                        각 라우터/스위치가 Per-Hop Behavior(PHB)에 따라 처리합니다.
                        확장성이 높아 인터넷 및 기업 환경에서 표준으로 사용됩니다.
                    </InfoBox>
                    <InfoBox color="purple" title="IntServ (Integrated Services)">
                        RSVP(Resource Reservation Protocol)로 경로 상의 모든 라우터에
                        자원을 예약합니다. 강력한 보장이 가능하지만, 확장성 문제로
                        대규모 환경에서는 사용이 제한됩니다.
                    </InfoBox>
                </CardGrid>

                <InfoTable
                    headers={['클래스', 'DSCP 값', 'TOS (hex)', '용도', '특징']}
                    rows={qosClassRows}
                />

                <InfoBox color="amber" title="큐잉 전략 비교">
                    네트워크 장비에서 QoS를 구현하는 핵심은 큐잉(Queuing) 전략입니다.
                    트래픽 클래스별로 적절한 큐를 할당하고 스케줄링하여 우선순위를 보장합니다.
                </InfoBox>

                <InfoTable
                    headers={['전략', '동작 방식', '특징']}
                    rows={queuingRows}
                />

                <CardGrid cols={2}>
                    <InfoBox color="green" title="셰이핑 (Shaping)">
                        초과 트래픽을 버퍼에 저장하고 허용 속도에 맞춰 지연 전송합니다.
                        버스트 트래픽을 평탄화(smoothing)하여 안정적인 전송을 보장합니다.
                        Linux에서는 HTB, TBF qdisc로 구현합니다.
                    </InfoBox>
                    <InfoBox color="red" title="폴리싱 (Policing)">
                        초과 트래픽을 즉시 DROP하거나 DSCP를 재마킹합니다.
                        인바운드 트래픽 제한에 주로 사용되며, 버퍼 없이 동작하므로
                        지연이 발생하지 않습니다. tc police로 구현합니다.
                    </InfoBox>
                </CardGrid>

                <CodeBlock code={tcQosCode} language="bash" filename="tc QoS 실전 예제 (HTB + prio)" />

                <InfoBox color="indigo" title="기업 QoS 정책 사례: VoIP 우선">
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        <li><strong>EF (DSCP 46)</strong>: VoIP/화상회의 — 10% 대역폭 보장, LLQ로 최저 지연</li>
                        <li><strong>AF41 (DSCP 34)</strong>: 실시간 비디오 스트리밍 — 20% 대역폭 보장</li>
                        <li><strong>AF21 (DSCP 18)</strong>: 업무 핵심 앱 (ERP, CRM) — 40% 대역폭 보장</li>
                        <li><strong>CS1 (DSCP 8)</strong>: 백업/대용량 전송 — 10% 대역폭, 나머지 여유분 사용</li>
                        <li><strong>BE (DSCP 0)</strong>: 일반 웹 — 20% 대역폭, 최저 우선순위</li>
                    </ul>
                </InfoBox>

                <Alert variant="tip" title="End-to-End QoS">
                    QoS는 경로 상의 모든 장비에서 일관되게 적용되어야 효과가 있습니다.
                    네트워크 경계에서 DSCP 마킹을 수행하고, 중간 장비는 마킹을 유지하며,
                    ISP 구간에서는 SLA(Service Level Agreement)로 QoS를 보장받아야 합니다.
                </Alert>
            </Section>

            {/* ── 12.9 ────────────────────────────────────────────── */}
            <Section id="s129" title="12.9  고성능 패킷 처리 (XDP, AF_PACKET, DPDK)">
                <Prose>
                    일반 커널 네트워크 스택은 범용성을 위해 많은 계층을 거칩니다.
                    초고속 패킷 처리가 필요한 경우, 커널 스택의 일부 또는 전체를 우회하는 기법들이 있습니다.
                </Prose>
                <InfoTable headers={['기법', '동작 위치', '패킷 처리 범위', '성능', '주요 용도']} rows={highPerfCompareRows} />
                <InfoBox color="green" title="XDP (eXpress Data Path)">
                    <T id="xdp">XDP</T>는 NIC 드라이버 레벨에서 eBPF 프로그램을 실행하여 패킷을 처리합니다.
                    sk_buff 할당 전에 동작하므로 메모리 할당 오버헤드가 없습니다.
                </InfoBox>
                <CodeBlock code={xdpCode} language="c" filename="XDP 프로그램 예제" />
                <InfoBox color="red" title="DPDK (Data Plane Development Kit)">
                    <T id="dpdk">DPDK</T>는 커널을 완전히 우회하는 유저 공간 패킷 처리 프레임워크입니다.
                    단일 코어에서 수십 Mpps 처리가 가능합니다.
                </InfoBox>
                <CodeBlock code={busyPollingCode} language="bash" filename="busy polling 설정" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <StatCard title="일반 커널 스택" value="~1 Mpps" color="gray" desc="커널 네트워크 스택 전체 경로" />
                    <StatCard title="XDP" value="~24 Mpps" color="green" desc="드라이버 레벨 eBPF (단일 코어)" />
                    <StatCard title="DPDK" value="~40+ Mpps" color="red" desc="유저 공간 폴링 (단일 코어)" />
                </div>
            </Section>

            {/* ── 12.10 ───────────────────────────────────────────── */}
            <Section id="s1210" title="12.10  요약">
                <Prose>
                    네트워크 성능 최적화는 병목 지점을 정확히 파악하는 것에서 시작합니다.
                </Prose>
                <InfoBox color="gray" title="핵심 정리">
                    <ul className="list-disc list-inside space-y-1">
                        <li><strong>성능 지표</strong> -- 대역폭, 지연시간, 지터, 손실률이 네트워크 품질을 결정</li>
                        <li><strong>BDP</strong> -- TCP 윈도우는 BDP 이상이어야 링크를 완전 활용</li>
                        <li><strong>NIC offload</strong> -- TSO/GRO/Checksum Offload로 CPU 부담 경감</li>
                        <li><strong>RSS/RPS</strong> -- 패킷 해시 기반 멀티코어 분산</li>
                        <li><strong>qdisc/tc</strong> -- 트래픽 쉐이핑, 대역폭 제한, 우선순위 제어</li>
                        <li><strong>QoS</strong> -- DiffServ/DSCP 마킹으로 트래픽 클래스별 우선순위 보장</li>
                        <li><strong>XDP</strong> -- 드라이버 레벨 eBPF로 초고속 패킷 처리</li>
                        <li><strong>DPDK</strong> -- 커널 바이패스 유저 공간 패킷 처리 (최고 성능)</li>
                    </ul>
                </InfoBox>
            </Section>
        </TopicPage>
    )
}
