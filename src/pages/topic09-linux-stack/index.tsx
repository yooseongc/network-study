import { LinuxNetworkStackDiagram } from '../../components/concepts/linux-net/LinuxNetworkStackDiagram'
import { SkbuffDiagram } from '../../components/concepts/linux-net/SkbuffDiagram'
import { Alert, CardGrid, CodeBlock, InfoBox, InfoTable, LearningCard, Prose, Section, T, TopicNavigation } from '@study-ui/components'
import {
    ethtoolCode,
    skbAscii,
    sysctlCode,
    sysctlAdvancedCode,
} from './codeSnippets'

/* ── Inline data ──────────────────────────────────────────────────── */

const napiStepsRows = [
    { cells: ['1', '패킷 도착', 'NIC가 DMA로 Ring Buffer에 패킷 기록'] },
    { cells: ['2', 'IRQ 발생', 'NIC가 CPU에 하드웨어 인터럽트 전달'] },
    { cells: ['3', 'NAPI 스케줄링', 'IRQ 핸들러가 NAPI poll 등록 후 IRQ 비활성화'] },
    { cells: ['4', 'softirq (poll)', 'NET_RX_SOFTIRQ에서 poll 함수로 패킷을 배치 처리'] },
    { cells: ['5', '처리 완료', 'budget 소진 또는 Ring Buffer 비면 IRQ 재활성화'] },
]

const skbFieldRows = [
    { cells: ['head / data / tail / end', '선형 데이터 버퍼의 경계 포인터'] },
    { cells: ['len', '전체 패킷 길이 (linear + paged)'] },
    { cells: ['protocol', '수신 패킷의 L3 프로토콜 (ETH_P_IP 등)'] },
    { cells: ['dev', '패킷이 속한 네트워크 디바이스 (struct net_device)'] },
    { cells: ['transport_header', 'L4 (TCP/UDP) 헤더 오프셋'] },
    { cells: ['network_header', 'L3 (IP) 헤더 오프셋'] },
    { cells: ['mac_header', 'L2 (Ethernet) 헤더 오프셋'] },
    { cells: ['sk', '연결된 소켓 (struct sock)'] },
    { cells: ['tstamp', '패킷 타임스탬프'] },
    { cells: ['mark', 'netfilter/iptables에서 사용하는 마킹 값'] },
]

const sysctlRows = [
    { cells: ['net.ipv4.ip_forward', 'IP 포워딩 활성화 (0/1)', '라우터/게이트웨이 역할 시 1 필요'] },
    { cells: ['net.ipv4.conf.all.rp_filter', 'Reverse Path Filtering (0/1/2)', '비대칭 라우팅 시 2 (loose)'] },
    { cells: ['net.ipv4.tcp_syncookies', 'SYN flood 방어 (0/1)', 'SYN 큐 초과 시 쿠키 응답'] },
    { cells: ['net.core.somaxconn', 'listen() backlog 최대값', '고부하 서버는 4096+ 권장'] },
    { cells: ['net.core.rmem_max', '소켓 수신 버퍼 최대 (bytes)', '대역폭 큰 환경에서 증가'] },
    { cells: ['net.core.wmem_max', '소켓 송신 버퍼 최대 (bytes)', '대역폭 큰 환경에서 증가'] },
    { cells: ['net.ipv4.tcp_rmem', 'TCP 수신 버퍼 (min def max)', '자동 튜닝 범위 결정'] },
    { cells: ['net.ipv4.tcp_wmem', 'TCP 송신 버퍼 (min def max)', '자동 튜닝 범위 결정'] },
]

/* ── Component ────────────────────────────────────────────────────── */

export default function Topic09LinuxStack() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-14">
            {/* ── Header ─────────────────────────────────────────── */}
            <header className="space-y-3">
                <p className="text-xs font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                    Topic 09
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    리눅스 네트워크 스택
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Linux Network Stack Internals
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    리눅스 커널의 네트워크 스택 내부 구조와 패킷 처리 과정을 단계별로 학습합니다.
                    NIC 드라이버에서 소켓 API까지의 데이터 흐름을 이해하고,
                    NAPI 기반 수신 처리, sk_buff 구조, sysctl 파라미터 튜닝을 익힙니다.
                </p>
            </header>

            {/* ── Learning Card ───────────────────────────────────── */}
            <LearningCard
                topicId="09-linux-stack"
                items={[
                    '리눅스 네트워크 스택의 전체 계층 구조를 설명할 수 있다',
                    'NIC 드라이버와 DMA Ring Buffer의 동작을 이해한다',
                    'NAPI의 인터럽트-폴링 하이브리드 모델을 설명할 수 있다',
                    'sk_buff 데이터 구조의 포인터 관리와 제로카피를 이해한다',
                    'sysctl 네트워크 파라미터를 이해하고 조정할 수 있다',
                ]}
            />

            {/* ── 9.1 리눅스 네트워크 스택 개요 ────────────────── */}
            <Section id="s091" title="9.1  리눅스 네트워크 스택 개요">
                <Prose>
                    리눅스 커널의 네트워크 스택은 사용자 애플리케이션이 소켓 API로 데이터를 보내거나 받을 때,
                    그 데이터가 실제 물리적 NIC(Network Interface Card)까지 도달하는 전체 경로를 구현한
                    소프트웨어 계층입니다. 각 계층은 명확한 역할을 가지며, 위에서 아래로(송신)
                    또는 아래에서 위로(수신) 순서대로 처리됩니다.
                </Prose>

                <LinuxNetworkStackDiagram />

                <InfoBox color="blue" title="User Space vs Kernel Space">
                    애플리케이션은 유저 공간에서 socket(), connect(), send(), recv() 같은
                    시스템 콜을 호출합니다. 커널은 이 호출을 받아 소켓 레이어부터
                    TCP/IP 스택, 디바이스 드라이버까지 처리한 뒤, NIC 하드웨어에 패킷을
                    전달합니다. 수신 시에는 반대 방향으로 올라옵니다.
                </InfoBox>

                <Prose>
                    송신(TX) 경로: 애플리케이션이 send()를 호출하면 커널은 소켓 버퍼에 데이터를 복사하고,
                    TCP/UDP 계층에서 세그먼트/데이터그램을 생성합니다. IP 계층에서 라우팅 결정과
                    IP 헤더 추가가 이루어지고, <T id="netfilter">Netfilter</T> 훅(OUTPUT, POSTROUTING)을 거친 뒤
                    이웃 서브시스템(ARP)을 통해 L2 주소를 해석합니다. 최종적으로 qdisc(큐잉 디시플린)을
                    거쳐 NIC 드라이버의 TX 링 버퍼에 패킷이 들어갑니다.
                </Prose>

                <Prose>
                    수신(RX) 경로: NIC가 패킷을 수신하면 DMA로 메모리에 기록하고 인터럽트를 발생시킵니다.
                    NAPI 기반 poll 함수가 패킷을 배치로 처리하며, netif_receive_skb()를 통해
                    커널 네트워크 스택에 전달됩니다. Netfilter 훅(PREROUTING, INPUT)을 거쳐
                    IP 역캡슐화, TCP/UDP 역캡슐화를 수행하고, 최종적으로 소켓 수신 큐에 도착합니다.
                </Prose>

                <Alert variant="info" title="핵심 개념:">
                    리눅스 네트워크 스택의 모든 패킷은 <T id="sk-buff">sk_buff</T>(skb) 구조체로 표현됩니다.
                    skb는 패킷 데이터뿐 아니라 메타데이터(도착 인터페이스, 프로토콜, 타임스탬프 등)를
                    함께 관리하는 커널의 핵심 데이터 구조입니다.
                </Alert>
            </Section>

            {/* ── 9.2 NIC 드라이버와 인터럽트 ────────────────── */}
            <Section id="s092" title="9.2  NIC 드라이버와 인터럽트">
                <Prose>
                    NIC(Network Interface Card)는 네트워크 케이블이나 무선 신호로부터
                    전기/광 신호를 수신하여 디지털 데이터(프레임)로 변환하는 하드웨어입니다.
                    리눅스 커널에서 NIC를 제어하는 것이 NIC 드라이버이며,
                    이 드라이버는 커널 모듈 형태로 동작합니다.
                </Prose>

                <InfoBox color="green" title="Ring Buffer (DMA 링 버퍼)">
                    NIC와 CPU 사이의 데이터 전달에는 DMA(Direct Memory Access) 방식이 사용됩니다.
                    NIC는 미리 할당된 Ring Buffer(순환 버퍼)에 패킷 데이터를 직접 기록합니다.
                    CPU가 개입하지 않으므로 효율적이며, 링 버퍼의 크기(디스크립터 수)는
                    ethtool -g 명령으로 확인하고 변경할 수 있습니다.
                </InfoBox>

                <Prose>
                    NIC가 패킷을 수신하면 하드웨어 인터럽트(IRQ)를 발생시켜 CPU에 알립니다.
                    그러나 고속 네트워크 환경(1 Gbps 이상)에서 패킷마다 인터럽트를 발생시키면
                    인터럽트 처리 오버헤드가 심각해집니다. 초당 수십만 개 이상의 패킷이
                    도착하면 CPU는 인터럽트 처리만으로 대부분의 시간을 소비하게 됩니다.
                    이를 &quot;인터럽트 폭풍(interrupt storm)&quot;이라 부르며,
                    NAPI는 이 문제를 해결하기 위해 도입되었습니다.
                </Prose>

                <CodeBlock code={ethtoolCode} language="bash" filename="ethtool" />

                <InfoBox color="amber" title="Interrupt Coalescing">
                    NIC 자체적으로도 인터럽트 빈도를 줄이는 기능이 있습니다.
                    일정 수의 패킷이 모이거나, 일정 시간이 지난 뒤에만 인터럽트를 발생시키는
                    것을 인터럽트 코얼리싱(Interrupt Coalescing)이라 합니다.
                    ethtool -c / -C 명령으로 설정할 수 있습니다.
                </InfoBox>
            </Section>

            {/* ── 9.3 NAPI와 패킷 수신 경로 ─────────────────── */}
            <Section id="s093" title="9.3  NAPI와 패킷 수신 경로">
                <Prose>
                    <T id="napi">NAPI</T>(New API)는 리눅스 커널의 패킷 수신 처리 프레임워크입니다.
                    인터럽트 기반 처리와 폴링(polling) 기반 처리를 결합한 하이브리드 모델로,
                    패킷이 적을 때는 인터럽트로 즉시 반응하고, 패킷이 많을 때는
                    인터럽트를 비활성화한 뒤 폴링 방식으로 배치 처리합니다.
                </Prose>

                <InfoTable
                    headers={['단계', '이벤트', '설명']}
                    rows={napiStepsRows}
                />

                <InfoBox color="cyan" title="NAPI의 핵심: 인터럽트-폴링 전환">
                    일반 모드에서는 패킷이 도착할 때마다 IRQ가 발생합니다.
                    그러나 패킷이 폭주하면 IRQ 핸들러는 NAPI poll을 스케줄링하고
                    IRQ를 끕니다(napi_schedule). 이후 softirq 컨텍스트에서 poll 함수가
                    Ring Buffer의 패킷을 최대 budget(기본 64개)만큼 한 번에 처리합니다.
                    처리할 패킷이 더 없으면 다시 IRQ를 켭니다(napi_complete_done).
                    이 전환 덕분에 CPU 효율이 크게 향상됩니다.
                </InfoBox>

                <Prose>
                    NAPI poll 함수에서 처리된 각 패킷은 napi_gro_receive() 또는 netif_receive_skb()를
                    통해 커널 네트워크 스택으로 전달됩니다.
                    GRO(Generic Receive Offload)는 여러 작은 패킷을 하나의 큰 패킷으로 합쳐서
                    상위 계층의 처리 횟수를 줄이는 최적화 기법입니다.
                </Prose>

                <Alert variant="info" title="softirq (NET_RX_SOFTIRQ):">
                    NAPI poll은 softirq 컨텍스트에서 실행됩니다. 이는 하드웨어 인터럽트보다
                    우선순위가 낮지만, 일반 프로세스보다는 높은 실행 컨텍스트입니다.
                    ksoftirqd 커널 스레드가 softirq 처리를 담당하며,
                    CPU 사용량이 높을 때 top 명령에서 si(soft interrupt) 항목으로 확인됩니다.
                </Alert>
            </Section>

            {/* ── 9.4 sk_buff 구조 ──────────────────────────── */}
            <Section id="s094" title="9.4  sk_buff 구조">
                <Prose>
                    sk_buff(줄여서 skb)는 리눅스 커널이 모든 네트워크 패킷을 표현하는
                    핵심 데이터 구조입니다. 송신이든 수신이든, TCP이든 UDP이든,
                    모든 패킷은 하나의 skb로 표현됩니다. skb는 패킷의 실제 데이터뿐 아니라
                    프로토콜 정보, 도착 인터페이스, 타임스탬프 등 풍부한 메타데이터를 포함합니다.
                </Prose>

                <SkbuffDiagram />

                <Prose>
                    skb의 선형 데이터 영역은 head, data, tail, end 네 개의 포인터로 관리됩니다.
                    head와 end는 할당된 버퍼의 시작과 끝을 나타내며, data와 tail은 현재 유효한
                    데이터의 시작과 끝을 가리킵니다. headroom(head~data)은 프로토콜 헤더 추가를 위한
                    여유 공간이고, tailroom(tail~end)은 데이터 추가를 위한 공간입니다.
                </Prose>

                <CodeBlock code={skbAscii} language="text" filename="sk_buff 구조 개요" />

                <InfoTable
                    headers={['필드', '설명']}
                    rows={skbFieldRows}
                />

                <InfoBox color="purple" title="skb_push / skb_pull / skb_put">
                    각 프로토콜 계층은 skb 조작 함수를 사용하여 헤더를 추가하거나 제거합니다.
                    송신 시 TCP 계층은 skb_push()로 data 포인터를 위로 이동시켜 TCP 헤더 공간을 확보하고,
                    IP 계층은 다시 skb_push()로 IP 헤더를 추가합니다.
                    수신 시에는 skb_pull()로 data 포인터를 아래로 이동시켜 이미 처리된 헤더를 건너뜁니다.
                    skb_put()은 tail 포인터를 아래로 이동시켜 데이터를 뒤에 추가합니다.
                </InfoBox>

                <Alert variant="info" title="Zero-Copy와 성능:">
                    skb의 설계 목표 중 하나는 불필요한 메모리 복사를 최소화하는 것입니다.
                    포인터 조작만으로 각 계층의 헤더 영역을 관리할 수 있어,
                    데이터 복사 없이 패킷을 각 계층에 전달할 수 있습니다.
                    대용량 데이터는 paged data(skb_shared_info의 frags)로 관리하여
                    scatter-gather I/O를 지원합니다.
                </Alert>
            </Section>

            {/* ── 9.5 sysctl 네트워크 파라미터 ─────────────── */}
            <Section id="s095" title="9.5  sysctl 네트워크 파라미터">
                <Prose>
                    <T id="sysctl">sysctl</T>은 커널 파라미터를 런타임에 조회하고 변경하는 도구입니다.
                    네트워크와 관련된 파라미터는 net.ipv4.*, net.ipv6.*, net.core.* 아래에
                    위치하며, 서버의 네트워크 성능과 보안에 직접적인 영향을 미칩니다.
                </Prose>

                <InfoTable
                    headers={['파라미터', '설명', '비고']}
                    rows={sysctlRows}
                />

                <CodeBlock code={sysctlCode} language="bash" filename="sysctl 기본 설정" />

                <InfoBox color="red" title="rp_filter (Reverse Path Filtering)">
                    rp_filter는 수신 패킷의 출발지 IP를 역방향으로 라우팅 조회하여,
                    해당 패킷이 들어온 인터페이스가 올바른지 검증하는 보안 기능입니다.
                    strict mode(1)는 해당 인터페이스로 응답 패킷이 나가는 경우에만 수신을 허용합니다.
                    loose mode(2)는 어느 인터페이스로든 라우팅 가능하면 허용합니다.
                    비대칭 라우팅(asymmetric routing) 환경에서 strict mode를 사용하면
                    정상 패킷이 차단될 수 있으므로 loose mode(2)를 사용해야 합니다.
                </InfoBox>

                <InfoBox color="blue" title="ip_forward와 라우터 역할">
                    net.ipv4.ip_forward = 1로 설정하면 해당 리눅스 호스트는
                    자기 자신이 목적지가 아닌 패킷도 라우팅 테이블에 따라 전달(forward)합니다.
                    컨테이너 호스트, VM 호스트, VPN 게이트웨이, NAT 라우터 등에서 필수입니다.
                    Docker를 설치하면 자동으로 활성화되는 경우가 많습니다.
                </InfoBox>

                <CodeBlock code={sysctlAdvancedCode} language="bash" filename="sysctl 고급 튜닝" />

                <Alert variant="info" title="영구 설정:">
                    sysctl -w 명령은 재부팅하면 초기화됩니다.
                    영구적으로 적용하려면 /etc/sysctl.conf 또는 /etc/sysctl.d/ 디렉토리에
                    설정 파일을 작성하고, sysctl -p로 적용하세요.
                </Alert>
            </Section>

            {/* ── 9.6 요약 ────────────────────────────────── */}
            <Section id="s096" title="9.6  요약">
                <Prose>
                    이 토픽에서는 리눅스 커널 네트워크 스택의 내부 구조를 학습했습니다.
                    NIC 하드웨어에서 소켓 API까지의 패킷 흐름, NAPI 기반의 효율적인 수신 처리,
                    그리고 모든 패킷을 표현하는 sk_buff 구조체의 내부를 살펴보았습니다.
                </Prose>

                <CardGrid cols={2}>
                    <InfoBox color="blue" title="네트워크 스택 구조">
                        User Space → System Call → Socket → Transport → IP → Netfilter → Driver → NIC 계층으로 구성됩니다.
                    </InfoBox>
                    <InfoBox color="green" title="NIC 드라이버">
                        DMA Ring Buffer를 통해 패킷을 CPU 개입 없이 메모리로 전달합니다.
                        ethtool로 offload, 통계, 링 버퍼 크기를 관리합니다.
                    </InfoBox>
                    <InfoBox color="amber" title="NAPI">
                        인터럽트(소량 트래픽) + 폴링(대량 트래픽) 하이브리드 모델로
                        인터럽트 오버헤드를 줄이고 고속 패킷 처리를 효율화합니다.
                    </InfoBox>
                    <InfoBox color="purple" title="sk_buff (skb)">
                        head/data/tail/end 4개 포인터로 헤더 추가/제거 시 메모리 복사 없이
                        포인터만 이동하여 제로카피 패킷 처리를 구현합니다.
                    </InfoBox>
                    <InfoBox color="cyan" title="sysctl 파라미터">
                        rp_filter(역방향 경로 검증), ip_forward(라우팅 활성화),
                        tcp_* 파라미터로 네트워크 동작과 성능을 세밀하게 제어합니다.
                    </InfoBox>
                </CardGrid>

                <Alert variant="info" title="다음 토픽:">
                    Topic 10에서는 iproute2 도구를 활용한 리눅스 네트워크 관리를 상세히 다룹니다.
                    ip addr, ip link, ip route, ip rule의 고급 사용법과
                    tc/qdisc를 이용한 트래픽 제어를 학습합니다.
                </Alert>
            </Section>

            <TopicNavigation topicId="09-linux-stack" />
        </div>
    )
}
