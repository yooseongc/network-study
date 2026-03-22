import { Section } from '../../components/ui/Section'
import { Prose } from '../../components/ui/Prose'
import { InfoTable } from '../../components/ui/InfoTable'
import { InfoBox } from '../../components/ui/InfoBox'
import { StatCard } from '../../components/ui/StatCard'
import { Alert } from '../../components/ui/Alert'
import { LearningCard } from '../../components/ui/LearningCard'
import { TopicNavigation } from '../../components/ui/TopicNavigation'
import { CodeBlock } from '../../components/viz/CodeBlock'
import { RssRpsDiagram } from '../../components/concepts/performance/RssRpsDiagram'
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
    { cells: ['TSO (TCP Segmentation Offload)', 'TX', 'TCP 세그먼트 분할을 NIC가 수행 — CPU가 큰 청크를 보내면 NIC이 MSS 단위로 분할'] },
    { cells: ['GSO (Generic Segmentation Offload)', 'TX', 'TSO의 소프트웨어 대체 — NIC이 TSO를 지원하지 않을 때 커널에서 수행'] },
    { cells: ['GRO (Generic Receive Offload)', 'RX', '수신 패킷을 병합하여 하나의 큰 패킷으로 프로토콜 스택에 전달'] },
    { cells: ['LRO (Large Receive Offload)', 'RX', 'GRO의 하드웨어 버전 — NIC에서 수신 패킷 병합 (라우팅 시 문제 가능)'] },
    { cells: ['Checksum Offload', 'TX/RX', '체크섬 계산/검증을 NIC 하드웨어가 수행'] },
]

const rssCompareRows = [
    { cells: ['RSS', '하드웨어', 'NIC', 'NIC 멀티큐 기반 해시 분산', '가장 효율적, NIC 지원 필요'] },
    { cells: ['RPS', '소프트웨어', 'CPU (softirq)', '커널이 해시 계산 후 CPU 분산', 'NIC 멀티큐 없이도 가능'] },
    { cells: ['RFS', '소프트웨어', 'CPU (softirq)', '패킷을 해당 플로우 처리 CPU로 전달', 'RPS + 캐시 친화성 향상'] },
    { cells: ['XPS', '소프트웨어', 'CPU (TX)', '송신 큐를 특정 CPU에 매핑', 'TX 경로 캐시 최적화'] },
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

/* ── Component ────────────────────────────────────────────────────── */

export default function Topic10() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-14">
            {/* ── Header ─────────────────────────────────────────── */}
            <header className="space-y-3">
                <p className="text-xs font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                    Topic 10
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    성능과 트래픽 제어
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    Performance & Traffic Control
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    네트워크 성능을 결정하는 핵심 지표를 이해하고, NIC offload, 멀티코어 패킷 분산,
                    qdisc/tc를 이용한 트래픽 제어, XDP/DPDK 등 고성능 패킷 처리 기법을 학습합니다.
                </p>
            </header>

            {/* ── Learning Card ───────────────────────────────────── */}
            <LearningCard
                topicId="10-performance"
                items={[
                    'NIC offload 기능의 종류와 효과를 이해한다',
                    'RSS/RPS로 멀티코어 분산 처리를 설명할 수 있다',
                    'qdisc와 tc의 트래픽 제어 원리를 파악한다',
                    'XDP와 DPDK의 개요와 차이를 파악한다',
                ]}
            />

            {/* ── 10.1 네트워크 성능 지표 ────────────────────────── */}
            <Section id="s101" title="10.1  네트워크 성능 지표">
                <Prose>
                    네트워크 성능을 이야기할 때 가장 자주 언급되는 지표는 대역폭, 지연시간, 지터, 손실률입니다.
                    이 네 가지를 정확히 이해해야 병목 분석과 성능 튜닝의 출발점을 잡을 수 있습니다.
                </Prose>

                <InfoTable
                    headers={['지표', '설명', '단위']}
                    rows={metricsRows}
                />

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
                    VoIP, 화상회의, 실시간 게임 등 실시간 애플리케이션에서는 지연시간 자체보다
                    지터(jitter)가 더 큰 문제입니다. 일정하지 않은 도착 시간은 버퍼링과 품질 저하를 유발합니다.
                </Alert>

                <CodeBlock code={iperfCode} language="bash" filename="iperf3 성능 측정" />
            </Section>

            {/* ── 10.2 RTT와 throughput, BDP ─────────────────────── */}
            <Section id="s102" title="10.2  RTT와 throughput, BDP">
                <Prose>
                    TCP의 실제 처리량은 대역폭만으로 결정되지 않습니다. RTT(Round Trip Time)가 길수록
                    ACK를 기다리는 시간이 늘어나 파이프라인이 비효율적이 됩니다.
                    이 관계를 정량적으로 표현한 것이 BDP(Bandwidth Delay Product)입니다.
                </Prose>

                <InfoBox color="purple" title="BDP (Bandwidth Delay Product)">
                    <div className="space-y-2">
                        <p className="font-mono text-sm">BDP = Bandwidth x RTT</p>
                        <p>
                            BDP는 네트워크 파이프에 동시에 존재할 수 있는 데이터의 양을 나타냅니다.
                            TCP 윈도우 크기가 BDP보다 작으면 링크를 완전히 활용할 수 없습니다.
                        </p>
                    </div>
                </InfoBox>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <StatCard title="예시: 1Gbps, RTT 1ms" value="BDP = 125 KB" color="green"
                        desc="1,000,000,000 x 0.001 / 8 = 125,000 bytes" />
                    <StatCard title="예시: 1Gbps, RTT 100ms" value="BDP = 12.5 MB" color="amber"
                        desc="1,000,000,000 x 0.1 / 8 = 12,500,000 bytes" />
                </div>

                <Alert variant="warning" title="Long Fat Network (LFN)">
                    대역폭이 크고 RTT가 긴 네트워크(예: 대륙간 10Gbps)에서는 BDP가 수십~수백 MB에 달합니다.
                    기본 TCP 윈도우(64KB)로는 대역폭의 극히 일부만 활용합니다.
                    TCP Window Scaling(RFC 7323)과 적절한 소켓 버퍼 크기 설정이 필수입니다.
                </Alert>

                <InfoBox color="cyan" title="throughput 계산">
                    <div className="space-y-1">
                        <p className="font-mono text-sm">Max Throughput = Window Size / RTT</p>
                        <p>
                            윈도우 크기가 64KB이고 RTT가 100ms라면 최대 처리량은
                            64,000 / 0.1 = 640,000 bytes/sec = 약 5 Mbps에 불과합니다.
                            1Gbps 링크에서 0.5%밖에 활용하지 못하는 셈입니다.
                        </p>
                    </div>
                </InfoBox>
            </Section>

            {/* ── 10.3 병목 지점 분석 ────────────────────────────── */}
            <Section id="s103" title="10.3  병목 지점 분석">
                <Prose>
                    성능 문제를 해결하려면 병목이 어디에 있는지를 먼저 파악해야 합니다.
                    네트워크 경로에서 병목은 여러 계층에 걸쳐 발생할 수 있습니다.
                </Prose>

                <InfoTable
                    headers={['계층', '병목 원인', '진단 방법']}
                    rows={[
                        { cells: ['NIC/물리', '링크 속도 불일치, CRC 에러, 케이블 불량', 'ethtool, dmesg'] },
                        { cells: ['드라이버/링 버퍼', '링 버퍼 오버플로 (rx_missed, rx_dropped)', 'ethtool -S, /proc/net/softnet_stat'] },
                        { cells: ['CPU', '단일 CPU에 인터럽트 집중, softirq 과부하', '/proc/interrupts, mpstat'] },
                        { cells: ['소켓 버퍼', '수신/송신 버퍼 부족으로 TCP 윈도우 축소', 'ss -tm, sysctl net.core.rmem_max'] },
                        { cells: ['TCP', '혼잡 제어로 인한 cwnd 감소, 재전송', 'ss -ti, /proc/net/snmp'] },
                        { cells: ['애플리케이션', '느린 read/write, 이벤트 루프 블로킹', 'strace, perf'] },
                    ]}
                />

                <CodeBlock code={ethtoolStatsCode} language="bash" filename="ethtool -S / -g 확인" />

                <Alert variant="info" title="softnet_stat 읽는 법">
                    <code className="bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono">/proc/net/softnet_stat</code>의
                    각 행은 CPU별 통계입니다. 두 번째 열(dropped)이 증가하면 softirq budget 초과로
                    패킷이 유실되고 있다는 의미이며, <code className="bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono">net.core.netdev_budget</code>을
                    늘려야 합니다.
                </Alert>
            </Section>

            {/* ── 10.4 NIC offload ───────────────────────────────── */}
            <Section id="s104" title="10.4  NIC offload 기능">
                <Prose>
                    NIC offload는 CPU가 수행하던 네트워크 처리 작업을 NIC 하드웨어로 위임하여
                    CPU 부담을 줄이고 처리량을 높이는 기법입니다. 현대 NIC는 다양한 offload 기능을
                    하드웨어로 제공합니다.
                </Prose>

                <InfoTable
                    headers={['기능', '방향', '설명']}
                    rows={offloadRows}
                />

                {/* TSO 동작 원리 인라인 설명 */}
                <InfoBox color="green" title="TSO 동작 원리">
                    <div className="space-y-1">
                        <p>TSO가 없으면: 애플리케이션이 64KB 데이터를 보낼 때 커널이 MSS(1460B) 단위로
                        44개 세그먼트를 생성하고 각각 IP/TCP 헤더를 붙여야 합니다.</p>
                        <p>TSO가 있으면: 커널은 64KB 전체를 하나의 큰 패킷으로 NIC에 전달하고,
                        NIC 하드웨어가 세그먼트 분할과 헤더 생성을 수행합니다.</p>
                    </div>
                </InfoBox>

                <InfoBox color="amber" title="GRO 동작 원리">
                    GRO는 TSO의 역방향입니다. 수신 측에서 같은 플로우의 연속 패킷을 하나의 큰 패킷으로
                    병합하여 프로토콜 스택에 전달합니다. 프로토콜 스택은 한 번만 처리하므로
                    CPU 사이클이 크게 절약됩니다.
                </InfoBox>

                <Alert variant="warning" title="LRO 주의사항">
                    LRO는 패킷 헤더 정보를 일부 손실하기 때문에 라우팅/포워딩 환경에서 문제를 일으킬 수 있습니다.
                    서버가 패킷을 포워딩하는 경우 LRO 대신 GRO를 사용해야 합니다.
                    대부분의 배포판에서 LRO는 기본적으로 비활성화되어 있습니다.
                </Alert>

                <CodeBlock code={ethtoolOffloadCode} language="bash" filename="ethtool -k / -K" />
            </Section>

            {/* ── 10.5 멀티코어 패킷 분산 ────────────────────────── */}
            <Section id="s105" title="10.5  멀티코어 패킷 분산 (RSS/RPS/RFS/XPS)">
                <Prose>
                    고속 네트워크에서 단일 CPU로 모든 패킷을 처리하면 CPU가 병목이 됩니다.
                    RSS, RPS, RFS, XPS는 패킷 처리를 여러 CPU 코어에 분산하여 처리 성능을 높이는
                    메커니즘입니다.
                </Prose>

                <InfoTable
                    headers={['기술', '구현', '동작 위치', '핵심 원리', '비고']}
                    rows={rssCompareRows}
                />

                {/* D3 RSS vs RPS Diagram */}
                <RssRpsDiagram />

                <InfoBox color="blue" title="RSS (Receive Side Scaling)">
                    <div className="space-y-1">
                        <p>NIC 하드웨어가 패킷의 5-tuple(src_ip, dst_ip, src_port, dst_port, protocol)을
                        해시하여 여러 RX 큐에 분산합니다. 각 RX 큐는 MSI-X 인터럽트를 통해 고유한 CPU에
                        매핑되므로, 패킷 처리가 자연스럽게 여러 코어로 분산됩니다.</p>
                        <p>같은 플로우의 패킷은 항상 같은 큐/CPU로 전달되어 순서가 보장됩니다.</p>
                    </div>
                </InfoBox>

                <InfoBox color="amber" title="RPS (Receive Packet Steering)">
                    NIC이 멀티큐를 지원하지 않거나 큐 수가 부족할 때 소프트웨어로 유사한 분산을 수행합니다.
                    커널이 패킷 헤더를 해시하여 타겟 CPU를 결정하고, IPI(Inter-Processor Interrupt)로
                    해당 CPU의 backlog 큐에 패킷을 전달합니다. RSS보다 오버헤드가 있지만 하드웨어 의존성이 없습니다.
                </InfoBox>

                <InfoBox color="green" title="RFS (Receive Flow Steering)">
                    RPS에 캐시 친화성(cache locality)을 더한 기법입니다. 패킷을 해시 결과가 아닌,
                    해당 소켓을 마지막으로 처리한 CPU로 전달합니다.
                    애플리케이션이 read()하는 CPU와 패킷을 처리하는 CPU가 같아져
                    L1/L2 캐시 히트율이 높아집니다.
                </InfoBox>

                <InfoBox color="purple" title="XPS (Transmit Packet Steering)">
                    송신 경로의 최적화입니다. 각 TX 큐를 특정 CPU에 매핑하여,
                    애플리케이션이 실행되는 CPU가 가까운 TX 큐를 사용하도록 합니다.
                    TX 큐 락 경합을 줄이고 캐시 효율을 높입니다.
                </InfoBox>

                <CodeBlock code={rssRpsCode} language="bash" filename="RSS/RPS/RFS/XPS 설정" />
            </Section>

            {/* ── 10.6 IRQ affinity ──────────────────────────────── */}
            <Section id="s106" title="10.6  IRQ affinity와 CPU locality">
                <Prose>
                    IRQ affinity는 특정 하드웨어 인터럽트를 처리할 CPU를 지정하는 기능입니다.
                    NIC의 각 RX 큐가 발생시키는 MSI-X 인터럽트를 서로 다른 CPU에 바인딩하면
                    RSS와 결합하여 최적의 패킷 분산이 가능합니다.
                </Prose>

                <InfoBox color="indigo" title="NUMA와 IRQ affinity">
                    <div className="space-y-1">
                        <p>NUMA(Non-Uniform Memory Access) 시스템에서는 NIC이 연결된 PCIe 슬롯과
                        같은 NUMA 노드의 CPU에 IRQ를 바인딩해야 합니다.</p>
                        <p>다른 NUMA 노드의 CPU가 패킷을 처리하면 원격 메모리 접근이 발생하여
                        지연시간이 크게 증가합니다.</p>
                    </div>
                </InfoBox>

                <CodeBlock code={procInterruptsCode} language="bash" filename="/proc/interrupts, smp_affinity" />

                <InfoTable
                    headers={['설정', '파일 경로', '설명']}
                    rows={[
                        { cells: ['IRQ affinity (bitmask)', '/proc/irq/<N>/smp_affinity', 'CPU 비트마스크 (16진수)'] },
                        { cells: ['IRQ affinity (list)', '/proc/irq/<N>/smp_affinity_list', 'CPU 번호 목록 (예: 0,2-4)'] },
                        { cells: ['NUMA 노드 확인', '/sys/class/net/<dev>/device/numa_node', 'NIC의 NUMA 노드'] },
                        { cells: ['자동 설정', 'irqbalance 데몬', '일반적 환경에서 자동 분산'] },
                    ]}
                />

                <Alert variant="tip" title="irqbalance vs 수동 설정">
                    일반 서버에서는 <code className="bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono">irqbalance</code> 데몬이
                    자동으로 IRQ를 분산합니다. 하지만 고성능 네트워크 환경(10G+)에서는
                    irqbalance를 끄고 수동으로 IRQ를 NIC NUMA 노드의 CPU에 1:1 매핑하는 것이 효과적입니다.
                </Alert>
            </Section>

            {/* ── 10.7 qdisc와 tc ────────────────────────────────── */}
            <Section id="s107" title="10.7  qdisc와 tc">
                <Prose>
                    리눅스의 트래픽 제어(Traffic Control)는 qdisc(queuing discipline)를 기반으로 합니다.
                    모든 네트워크 인터페이스에는 egress qdisc가 연결되어 있으며,
                    패킷이 NIC로 전달되기 전에 qdisc를 통과합니다.
                    <code className="bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono">tc</code> 명령으로
                    qdisc, class, filter를 설정하여 대역폭 제한, 우선순위 지정, 트래픽 쉐이핑이 가능합니다.
                </Prose>

                <InfoTable
                    headers={['qdisc', '설명', '비고']}
                    rows={qdiscRows}
                />

                <InfoBox color="sky" title="tc의 3대 구성 요소">
                    <div className="space-y-1">
                        <p><strong>qdisc</strong> — 패킷 큐잉과 스케줄링 정책 (classless 또는 classful)</p>
                        <p><strong>class</strong> — classful qdisc 내의 대역폭 할당 단위 (HTB, CBQ 등)</p>
                        <p><strong>filter</strong> — 패킷을 어떤 class로 분류할지 결정하는 규칙 (u32, flower, bpf 등)</p>
                    </div>
                </InfoBox>

                <CodeBlock code={tcQdiscCode} language="bash" filename="tc qdisc / class / filter" />

                <InfoBox color="orange" title="fq_codel — 현대 리눅스 기본 qdisc">
                    fq_codel은 Fair Queuing과 CoDel(Controlled Delay) 알고리즘을 결합한 qdisc입니다.
                    플로우별로 공정하게 대역폭을 분배하면서, 각 큐의 체류 시간이 target(기본 5ms)을 넘으면
                    패킷을 드롭하여 bufferbloat을 방지합니다. 별도 설정 없이도 좋은 성능을 제공합니다.
                </InfoBox>

                <CodeBlock code={tcNetemCode} language="bash" filename="netem / tbf 예제" />

                <Alert variant="info" title="tc와 eBPF">
                    tc의 <code className="bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono">clsact</code> qdisc에
                    BPF 프로그램을 부착하면 ingress/egress 경로에서 프로그래머블한 패킷 처리가 가능합니다.
                    Cilium 같은 컨테이너 네트워킹 솔루션이 이 방식을 사용합니다.
                </Alert>
            </Section>

            {/* ── 10.8 고성능 패킷 처리 ──────────────────────────── */}
            <Section id="s108" title="10.8  고성능 패킷 처리 (XDP, AF_PACKET, DPDK)">
                <Prose>
                    일반 커널 네트워크 스택은 범용성을 위해 많은 계층을 거칩니다.
                    초고속 패킷 처리가 필요한 경우, 커널 스택의 일부 또는 전체를 우회하는 기법들이 있습니다.
                </Prose>

                <InfoTable
                    headers={['기법', '동작 위치', '패킷 처리 범위', '성능', '주요 용도']}
                    rows={highPerfCompareRows}
                />

                {/* XDP */}
                <InfoBox color="green" title="XDP (eXpress Data Path)">
                    <div className="space-y-1">
                        <p>XDP는 NIC 드라이버 레벨에서 eBPF 프로그램을 실행하여 패킷을 처리합니다.
                        sk_buff 할당 전에 동작하므로 메모리 할당 오버헤드가 없습니다.</p>
                        <p>XDP 액션: <strong>XDP_PASS</strong>(커널 스택으로 전달), <strong>XDP_DROP</strong>(즉시 폐기),
                        <strong>XDP_TX</strong>(같은 NIC로 송신), <strong>XDP_REDIRECT</strong>(다른 NIC/CPU로 전달),
                        <strong>XDP_ABORTED</strong>(에러)</p>
                    </div>
                </InfoBox>

                <CodeBlock code={xdpCode} language="c" filename="XDP 프로그램 예제" />

                {/* AF_PACKET */}
                <InfoBox color="blue" title="AF_PACKET (패킷 소켓)">
                    <div className="space-y-1">
                        <p>AF_PACKET 소켓은 L2 수준에서 패킷을 캡처/송신할 수 있는 소켓 타입입니다.
                        tcpdump, Wireshark 등 패킷 캡처 도구의 기반입니다.</p>
                        <p>PACKET_MMAP을 사용하면 커널-유저 공간 간 제로카피가 가능하여
                        고속 패킷 캡처에 적합합니다. AF_PACKET v3(TPACKET_V3)는
                        가변 크기 프레임을 지원하여 메모리 효율이 높습니다.</p>
                    </div>
                </InfoBox>

                {/* DPDK */}
                <InfoBox color="red" title="DPDK (Data Plane Development Kit)">
                    <div className="space-y-1">
                        <p>DPDK는 커널을 완전히 우회하는 유저 공간 패킷 처리 프레임워크입니다.
                        NIC을 커널에서 분리(unbind)하고, UIO/VFIO 드라이버로 유저 공간에서 직접 제어합니다.</p>
                        <p>특징: CPU busy-polling(인터럽트 없음), hugepage 메모리, lockless 링 버퍼, 배치 처리.
                        단일 코어에서 수십 Mpps(Million packets per second) 처리가 가능합니다.</p>
                        <p>단점: 전용 CPU 코어 할당 필요, 커널 네트워크 기능(iptables, 라우팅 등) 사용 불가,
                        개발 복잡도가 높습니다.</p>
                    </div>
                </InfoBox>

                <Alert variant="tip" title="busy polling">
                    XDP와 DPDK 모두 busy polling(폴링 기반 패킷 수신)을 활용합니다.
                    인터럽트 대신 CPU가 지속적으로 NIC 큐를 확인하여 인터럽트 오버헤드를 제거합니다.
                    일반 소켓에서도 <code className="bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono">SO_BUSY_POLL</code>
                    옵션으로 제한적 busy polling이 가능합니다.
                </Alert>

                <CodeBlock code={busyPollingCode} language="bash" filename="busy polling 설정" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <StatCard title="일반 커널 스택" value="~1 Mpps" color="gray"
                        desc="커널 네트워크 스택 전체 경로" />
                    <StatCard title="XDP" value="~24 Mpps" color="green"
                        desc="드라이버 레벨 eBPF (단일 코어)" />
                    <StatCard title="DPDK" value="~40+ Mpps" color="red"
                        desc="유저 공간 폴링 (단일 코어, 64B)" />
                </div>
            </Section>

            {/* ── 10.9 요약 ──────────────────────────────────────── */}
            <Section id="s109" title="10.9  요약">
                <Prose>
                    네트워크 성능 최적화는 병목 지점을 정확히 파악하는 것에서 시작합니다.
                    대역폭, 지연시간, BDP를 이해하면 TCP 튜닝의 방향을 잡을 수 있고,
                    NIC offload로 CPU 부담을 줄이며, RSS/RPS로 멀티코어 분산 처리를 활성화합니다.
                    qdisc/tc로 트래픽을 제어하고, 극한의 성능이 필요하면 XDP나 DPDK를 고려합니다.
                </Prose>

                <InfoBox color="gray" title="핵심 정리">
                    <ul className="list-disc list-inside space-y-1">
                        <li><strong>성능 지표</strong> — 대역폭, 지연시간, 지터, 손실률이 네트워크 품질을 결정</li>
                        <li><strong>BDP</strong> — TCP 윈도우는 BDP 이상이어야 링크를 완전 활용</li>
                        <li><strong>NIC offload</strong> — TSO/GRO/Checksum Offload로 CPU 부담 경감</li>
                        <li><strong>RSS/RPS</strong> — 패킷 해시 기반 멀티코어 분산 (하드웨어/소프트웨어)</li>
                        <li><strong>IRQ affinity</strong> — NUMA 친화적 인터럽트 바인딩</li>
                        <li><strong>qdisc/tc</strong> — 트래픽 쉐이핑, 대역폭 제한, 우선순위 제어</li>
                        <li><strong>XDP</strong> — 드라이버 레벨 eBPF로 초고속 패킷 처리</li>
                        <li><strong>DPDK</strong> — 커널 바이패스 유저 공간 패킷 처리 (최고 성능)</li>
                    </ul>
                </InfoBox>
            </Section>

            {/* ── Navigation ─────────────────────────────────────── */}
            <TopicNavigation topicId="10-performance" />
        </div>
    )
}
