import { Section } from '../../components/ui/Section'
import { Prose } from '../../components/ui/Prose'
import { InfoTable } from '../../components/ui/InfoTable'
import { InfoBox } from '../../components/ui/InfoBox'
import { Alert } from '../../components/ui/Alert'
import { LearningCard } from '../../components/ui/LearningCard'
import { TopicNavigation } from '../../components/ui/TopicNavigation'
import { CodeBlock } from '../../components/viz/CodeBlock'
import { LinuxNetworkStackDiagram } from '../../components/concepts/linux-net/LinuxNetworkStackDiagram'
import { SkbuffDiagram } from '../../components/concepts/linux-net/SkbuffDiagram'
import {
    ipAddrCode,
    ipAddrDetailCode,
    ipLinkCode,
    ipLinkDetailCode,
    ipRouteCode,
    ipRouteDetailCode,
    ipRuleCode,
    ipRuleDetailCode,
    ipNeighCode,
    ssCode,
    ethtoolCode,
    sysctlCode,
    ipNetnsCode,
    tcpdumpCode,
    skbAscii,
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

const ssOptionRows = [
    { cells: ['-t', 'TCP 소켓만 표시'] },
    { cells: ['-u', 'UDP 소켓만 표시'] },
    { cells: ['-l', 'LISTEN 상태 소켓만 표시'] },
    { cells: ['-n', '주소/포트를 숫자로 표시 (이름 해석 안 함)'] },
    { cells: ['-p', '프로세스 정보 표시 (root 권한 필요)'] },
    { cells: ['-s', '소켓 통계 요약'] },
    { cells: ['-e', '확장 정보 (uid, inode 등)'] },
    { cells: ['-i', 'TCP 내부 정보 (cwnd, rtt 등)'] },
]

const addrScopeRows = [
    { cells: ['global', '전역 유효 — 어디서든 라우팅 가능한 주소', '일반적인 인터페이스 IP'] },
    { cells: ['link', '링크 로컬 — 같은 L2 세그먼트 내에서만 유효', 'fe80::/10, 169.254.0.0/16'] },
    { cells: ['host', '호스트 로컬 — 자기 자신만 접근 가능', '127.0.0.1, ::1'] },
]

const virtualIfRows = [
    { cells: ['veth', '쌍으로 생성되는 가상 이더넷 케이블', '네임스페이스 간 연결'] },
    { cells: ['bridge', '소프트웨어 L2 스위치', '컨테이너/VM 네트워크 허브'] },
    { cells: ['vlan', '802.1Q VLAN 서브인터페이스', '하나의 NIC에서 VLAN 분리'] },
    { cells: ['bond', '여러 NIC를 묶어 하나로 사용', '대역폭 합산, 장애 대비'] },
    { cells: ['macvlan', '하나의 NIC에 여러 MAC 주소 부여', '컨테이너 직접 연결'] },
    { cells: ['ipvlan', '하나의 NIC에 여러 IP (MAC 공유)', 'MAC 제한 환경'] },
    { cells: ['vxlan', 'UDP 기반 L2 오버레이 터널', '클라우드/데이터센터 네트워크'] },
    { cells: ['dummy', '항상 UP 상태인 가상 인터페이스', '테스트, 앵커 IP 할당'] },
]

const routeTableRows = [
    { cells: ['local (255)', '로컬 주소/브로드캐스트', '커널이 자동 관리, 최우선 조회'] },
    { cells: ['main (254)', '일반적인 라우팅 엔트리', 'ip route 기본 테이블'] },
    { cells: ['default (253)', '기본 테이블', '보통 비어 있음'] },
    { cells: ['사용자 정의 (1~252)', 'policy routing용 커스텀 테이블', 'ip rule과 조합'] },
]

const specialRouteRows = [
    { cells: ['blackhole', '패킷을 조용히 폐기', 'ICMP 응답 없음'] },
    { cells: ['unreachable', '패킷 폐기 + ICMP Dest Unreachable 응답', '목적지 없음 알림'] },
    { cells: ['prohibit', '패킷 폐기 + ICMP Admin Prohibited 응답', '정책적 차단 알림'] },
]

const neighStateRows = [
    { cells: ['REACHABLE', '최근 통신으로 유효성 확인됨'] },
    { cells: ['STALE', '일정 시간 미사용, 다음 전송 시 재확인'] },
    { cells: ['DELAY', 'STALE에서 재확인 대기 중'] },
    { cells: ['PROBE', '유효성 확인 ARP/NDP 전송 중'] },
    { cells: ['FAILED', 'ARP/NDP 응답 없음 (도달 불가)'] },
    { cells: ['INCOMPLETE', 'ARP Request 전송 후 응답 대기'] },
    { cells: ['PERMANENT', '수동 설정 (static entry)'] },
]

/* ── Component ────────────────────────────────────────────────────── */

export default function Topic08() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-14">
            {/* ── Header ─────────────────────────────────────────── */}
            <header className="space-y-3">
                <p className="text-xs font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                    Topic 08
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    리눅스에서의 네트워크 동작
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    Linux Network Stack
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    리눅스 커널의 네트워크 스택 내부 구조와 패킷 처리 과정을 단계별로 학습합니다.
                    NIC 드라이버에서 소켓 API까지의 데이터 흐름을 이해하고,
                    iproute2와 sysctl 등 핵심 도구를 활용하는 방법을 익힙니다.
                </p>
            </header>

            {/* ── Learning Card ───────────────────────────────────── */}
            <LearningCard
                topicId="08-linux-network"
                items={[
                    'NIC 드라이버와 NAPI 구조를 이해한다',
                    'sk_buff 데이터 구조의 역할을 설명할 수 있다',
                    'ip addr로 주소 scope, primary/secondary, IPv6를 관리할 수 있다',
                    'ip link로 가상 인터페이스(veth, bridge, vlan, bond 등)를 생성할 수 있다',
                    'ip route로 ECMP, blackhole, src 힌트 등 고급 라우팅을 설정할 수 있다',
                    'ip rule로 RPDB 기반 정책 라우팅을 구성할 수 있다',
                    'ip neigh로 ARP/NDP 캐시를 관리하고 상태를 이해한다',
                    'ss로 소켓 상태를 관찰하고 분석할 수 있다',
                    'sysctl 네트워크 파라미터를 이해하고 조정할 수 있다',
                    '네트워크 네임스페이스와 veth의 원리를 파악한다',
                ]}
            />

            {/* ── 8.1 리눅스 네트워크 스택 개요 ────────────────── */}
            <Section id="s081" title="8.1  리눅스 네트워크 스택 개요">
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
                    IP 헤더 추가가 이루어지고, Netfilter 훅(OUTPUT, POSTROUTING)을 거친 뒤
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
                    리눅스 네트워크 스택의 모든 패킷은 sk_buff(skb) 구조체로 표현됩니다.
                    skb는 패킷 데이터뿐 아니라 메타데이터(도착 인터페이스, 프로토콜, 타임스탬프 등)를
                    함께 관리하는 커널의 핵심 데이터 구조입니다.
                </Alert>
            </Section>

            {/* ── 8.2 NIC 드라이버와 인터럽트 ────────────────── */}
            <Section id="s082" title="8.2  NIC 드라이버와 인터럽트">
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

            {/* ── 8.3 NAPI와 패킷 수신 경로 ─────────────────── */}
            <Section id="s083" title="8.3  NAPI와 패킷 수신 경로">
                <Prose>
                    NAPI(New API)는 리눅스 커널의 패킷 수신 처리 프레임워크입니다.
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

            {/* ── 8.4 sk_buff 구조 ──────────────────────────── */}
            <Section id="s084" title="8.4  sk_buff 구조">
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

            {/* ── 8.5 ip addr — 주소 관리 상세 ─────────────────── */}
            <Section id="s085" title="8.5  ip addr — 주소 관리 상세">
                <Prose>
                    ip addr는 네트워크 인터페이스에 할당된 IP 주소를 관리하는 명령입니다.
                    ifconfig를 완전히 대체하며, IPv4와 IPv6를 통합적으로 관리합니다.
                    하나의 인터페이스에 여러 주소를 할당하거나, scope와 label을 지정하여
                    주소의 용도와 가시성을 세밀하게 제어할 수 있습니다.
                </Prose>

                <CodeBlock code={ipAddrCode} language="bash" filename="ip addr — 기본 사용법" />

                <InfoBox color="blue" title="Primary vs Secondary 주소">
                    하나의 인터페이스에 같은 서브넷의 첫 번째 주소가 primary,
                    이후 추가되는 같은 서브넷의 주소들이 secondary입니다.
                    primary 주소를 삭제하면 해당 서브넷의 모든 secondary 주소도 함께 삭제됩니다.
                    서로 다른 서브넷의 주소는 각각 독립적인 primary로 취급됩니다.
                    서비스 VIP나 failover IP를 추가할 때 이 동작을 이해해야 합니다.
                </InfoBox>

                <InfoTable
                    headers={['scope', '의미', '예시']}
                    rows={addrScopeRows}
                />

                <Prose>
                    label은 ifconfig 호환을 위한 별칭입니다. eth0:1, eth0:vip 같은 형태로
                    지정하면, 레거시 도구에서도 해당 주소를 별도 인터페이스처럼 표시합니다.
                    현대적인 환경에서는 label 없이 여러 주소를 추가하는 것이 일반적이지만,
                    일부 모니터링 도구나 스크립트가 label에 의존하는 경우가 있습니다.
                </Prose>

                <InfoBox color="green" title="IPv6 주소 유형">
                    IPv6에서는 인터페이스가 UP되면 자동으로 link-local 주소(fe80::/10)가 생성됩니다.
                    SLAAC(Stateless Address Autoconfiguration)이 활성화되면 라우터 광고를 받아
                    global 주소가 자동 할당됩니다. privacy extension이 켜져 있으면
                    임의의 temporary 주소도 생성되어, 외부 통신 시 출발지 주소로 사용됩니다.
                    valid_lft(유효 기간)와 preferred_lft(선호 기간)가 만료되면 주소가 deprecated
                    또는 삭제됩니다.
                </InfoBox>

                <CodeBlock code={ipAddrDetailCode} language="bash" filename="ip addr — 상세 활용" />

                <Alert variant="info" title="실무 팁: ip addr flush">
                    ip addr flush dev eth0는 해당 인터페이스의 모든 주소를 한 번에 삭제합니다.
                    네트워크 재설정이나 DHCP 재취득 전에 깨끗한 상태를 만들 때 유용하지만,
                    원격 접속 중인 서버에서 실행하면 접속이 끊어지므로 주의해야 합니다.
                </Alert>
            </Section>

            {/* ── 8.6 ip link — 인터페이스 관리 상세 ──────────── */}
            <Section id="s086" title="8.6  ip link — 인터페이스 관리 상세">
                <Prose>
                    ip link는 네트워크 인터페이스의 L2 속성을 관리합니다.
                    인터페이스의 UP/DOWN 제어, MTU 변경, MAC 주소 설정은 물론,
                    리눅스가 지원하는 다양한 가상 인터페이스를 생성하고 삭제할 수 있습니다.
                    컨테이너, 가상화, 오버레이 네트워크의 기반이 되는 핵심 명령입니다.
                </Prose>

                <CodeBlock code={ipLinkCode} language="bash" filename="ip link — 기본 사용법" />

                <InfoBox color="amber" title="MTU 변경과 Jumbo Frame">
                    기본 MTU는 1500 바이트이지만, 데이터센터 내부 통신에서는 9000 바이트의
                    Jumbo Frame을 사용하여 CPU 오버헤드를 줄이고 처리량을 높입니다.
                    MTU 변경은 경로상의 모든 장비(스위치, 라우터, NIC)에서 일관되게 설정해야 합니다.
                    VXLAN이나 GRE 같은 터널링을 사용하면 오버헤드만큼 내부 MTU가 줄어들므로
                    (VXLAN: 50바이트) 이를 감안한 설정이 필요합니다.
                </InfoBox>

                <InfoTable
                    headers={['유형', '설명', '주요 용도']}
                    rows={virtualIfRows}
                />

                <CodeBlock code={ipLinkDetailCode} language="bash" filename="ip link — 가상 인터페이스와 상세 설정" />

                <InfoBox color="purple" title="프로미스큐어스 모드 (Promiscuous Mode)">
                    일반적으로 NIC는 자신의 MAC 주소나 브로드캐스트 주소가 아닌 프레임을 폐기합니다.
                    프로미스큐어스 모드를 켜면 모든 프레임을 수신하여 커널로 전달합니다.
                    패킷 캡처(tcpdump, Wireshark), 브리지, IDS/IPS에서 필요합니다.
                    브리지에 포트를 추가하면 해당 인터페이스는 자동으로 프로미스큐어스 모드가 됩니다.
                </InfoBox>

                <Prose>
                    txqueuelen은 네트워크 드라이버가 사용하는 전송 큐의 최대 길이입니다.
                    기본값은 보통 1000이며, 고속 네트워크에서 burst 트래픽이 많을 때
                    값을 늘리면 패킷 드롭을 줄일 수 있습니다.
                    반대로 가상 인터페이스(veth, tun 등)는 기본값이 500~1000으로 설정되며,
                    레이턴시가 중요한 환경에서는 줄이는 것이 유리할 수 있습니다.
                </Prose>

                <Alert variant="info" title="실무 예시: bridge 기반 컨테이너 네트워크">
                    Docker의 기본 네트워크 드라이버(bridge)는 docker0 브리지를 만들고,
                    각 컨테이너마다 veth 쌍을 생성하여 한쪽을 컨테이너 네임스페이스에,
                    다른 쪽을 docker0 브리지에 연결합니다. 이 구조를 ip link 명령으로
                    수동 구성하면 컨테이너 네트워킹의 원리를 깊이 이해할 수 있습니다.
                </Alert>
            </Section>

            {/* ── 8.7 ip route — 라우팅 테이블 상세 ───────────── */}
            <Section id="s087" title="8.7  ip route — 라우팅 테이블 상세">
                <Prose>
                    ip route는 커널 라우팅 테이블을 관리합니다. 리눅스는 여러 개의 라우팅 테이블을
                    지원하며, 각 테이블에 독립적인 라우트를 설정할 수 있습니다.
                    ip rule(정책 라우팅)과 조합하면 출발지, fwmark, 인터페이스 등 다양한 조건에 따라
                    서로 다른 라우팅 테이블을 참조하는 고급 라우팅이 가능합니다.
                </Prose>

                <CodeBlock code={ipRouteCode} language="bash" filename="ip route — 기본 사용법" />

                <InfoTable
                    headers={['테이블 (ID)', '용도', '비고']}
                    rows={routeTableRows}
                />

                <InfoBox color="blue" title="metric과 우선순위">
                    동일 목적지에 여러 경로가 있을 때 metric 값이 낮은 경로가 우선됩니다.
                    DHCP 클라이언트는 보통 인터페이스마다 다른 metric을 설정하여
                    유선(metric 100)이 무선(metric 600)보다 우선되도록 합니다.
                    metric이 동일하면 더 구체적인(긴 prefix) 경로가 우선됩니다(longest prefix match).
                </InfoBox>

                <Prose>
                    nexthop은 패킷을 전달할 다음 홉 게이트웨이를 지정합니다.
                    via는 게이트웨이 IP를, dev는 출력 인터페이스를 명시합니다.
                    directly connected 네트워크(같은 서브넷)의 경우 via 없이 dev만 지정하며,
                    커널이 자동으로 이런 경로를 proto kernel scope link로 추가합니다.
                </Prose>

                <InfoBox color="green" title="src 힌트 (Source Address Selection)">
                    라우트에 src를 지정하면, 해당 경로로 나가는 패킷의 출발지 IP를 지정할 수 있습니다.
                    인터페이스에 여러 IP가 할당된 경우, 어떤 주소를 출발지로 사용할지 결정하는 데 중요합니다.
                    src는 &quot;힌트&quot;이며, 소켓이 이미 bind()한 주소가 있으면 그 주소가 우선합니다.
                    ip route get 명령의 출력에서 src 필드로 실제 선택된 출발지 주소를 확인할 수 있습니다.
                </InfoBox>

                <InfoTable
                    headers={['유형', '동작', 'ICMP 응답']}
                    rows={specialRouteRows}
                />

                <InfoBox color="amber" title="ECMP (Equal-Cost Multi-Path)">
                    ECMP는 동일 비용의 경로가 여러 개일 때 트래픽을 분산하는 기능입니다.
                    nexthop을 여러 개 지정하고 weight로 비율을 조정할 수 있습니다.
                    리눅스 커널은 기본적으로 흐름(flow) 단위(출발지/목적지 IP+포트 해시)로 분산하여,
                    같은 TCP 연결의 패킷이 항상 같은 경로를 따르도록 합니다.
                    이 해시 알고리즘은 sysctl net.ipv4.fib_multipath_hash_policy로 제어합니다.
                </InfoBox>

                <CodeBlock code={ipRouteDetailCode} language="bash" filename="ip route — 상세 활용" />

                <Alert variant="info" title="디버깅 필수 도구: ip route get">
                    ip route get [목적지]는 커널이 실제로 선택하는 경로를 보여줍니다.
                    ip rule, 여러 라우팅 테이블, src 선택까지 모두 반영된 최종 결과를 출력하므로,
                    라우팅 문제 디버깅 시 가장 먼저 사용해야 하는 명령입니다.
                    from [출발지] 옵션을 추가하면 policy routing 규칙까지 검증할 수 있습니다.
                </Alert>
            </Section>

            {/* ── 8.8 ip rule — 정책 라우팅 상세 ─────────────── */}
            <Section id="s088" title="8.8  ip rule — 정책 라우팅 상세">
                <Prose>
                    일반적인 라우팅은 목적지 IP(destination)만으로 경로를 결정합니다.
                    그러나 실제 운영 환경에서는 같은 목적지라도 출발지 IP, 패킷의 마크(fwmark),
                    수신 인터페이스 등에 따라 다른 경로를 사용해야 하는 경우가 빈번합니다.
                    ip rule은 이러한 정책 기반 라우팅(Policy Routing)을 구현하는 도구입니다.
                </Prose>

                <CodeBlock code={ipRuleCode} language="bash" filename="ip rule — 기본 사용법" />

                <InfoBox color="purple" title="RPDB (Routing Policy Database) 구조">
                    커널은 패킷의 라우팅을 결정할 때 RPDB의 rule을 priority(숫자가 작을수록 높은 우선순위)
                    순서대로 순회합니다. 각 rule은 조건(from, to, fwmark, iif, oif)과
                    동작(lookup 테이블, unreachable, blackhole 등)으로 구성됩니다.
                    조건에 매칭되면 해당 rule이 가리키는 라우팅 테이블에서 경로를 조회하고,
                    경로가 있으면 그것을 사용합니다. 경로가 없으면 다음 rule로 넘어갑니다.
                </InfoBox>

                <Prose>
                    기본 RPDB에는 세 개의 rule이 있습니다:
                    priority 0의 &quot;from all lookup local&quot;은 자기 자신의 주소인지 확인하고,
                    priority 32766의 &quot;from all lookup main&quot;은 일반 라우팅 테이블을 조회하며,
                    priority 32767의 &quot;from all lookup default&quot;는 기본 테이블(보통 비어 있음)을 조회합니다.
                    사용자 정의 rule은 보통 1~32765 사이의 priority를 지정합니다.
                </Prose>

                <InfoBox color="green" title="조건(selector) 종류">
                    from: 출발지 IP/서브넷으로 매칭합니다.
                    to: 목적지 IP/서브넷으로 매칭합니다.
                    fwmark: iptables/nftables의 MARK 타겟으로 설정한 패킷 마크로 매칭합니다.
                    iif: 패킷이 들어온 수신 인터페이스로 매칭합니다.
                    oif: locally generated 패킷의 송신 인터페이스로 매칭합니다.
                    이 조건들은 조합하여 사용할 수 있습니다.
                </InfoBox>

                <CodeBlock code={ipRuleDetailCode} language="bash" filename="ip rule — 상세 활용" />

                <InfoBox color="amber" title="실무: VPN Split Tunneling">
                    VPN split tunneling은 특정 대역의 트래픽만 VPN 터널을 통해 보내고,
                    나머지는 일반 인터넷 경로를 사용하는 구성입니다.
                    ip rule로 VPN 대역(to 10.0.0.0/8)에 대한 rule을 추가하고,
                    해당 rule이 참조하는 테이블에 VPN 터널 인터페이스(tun0) 경로를 설정합니다.
                    main 테이블의 기본 게이트웨이는 일반 ISP를 가리키므로,
                    VPN 대역 외의 트래픽은 자연스럽게 일반 인터넷으로 나갑니다.
                </InfoBox>

                <Alert variant="info" title="fwmark 활용과 iptables 연동:">
                    fwmark 기반 라우팅은 L4 정보(포트, 프로토콜)에 따라 라우팅을 분기할 때 핵심입니다.
                    iptables -t mangle로 패킷에 마크를 설정하고, ip rule에서 해당 마크를 조건으로
                    별도 라우팅 테이블을 참조합니다. TPROXY, 특정 서비스의 트래픽 분리,
                    사용자별 라우팅 등 다양한 시나리오에서 활용됩니다.
                </Alert>
            </Section>

            {/* ── 8.9 ip neigh — ARP/NDP 관리 ───────────────── */}
            <Section id="s089" title="8.9  ip neigh — ARP/NDP 관리">
                <Prose>
                    ip neigh(neighbor)는 ARP(IPv4) 및 NDP(IPv6 Neighbor Discovery Protocol)
                    캐시를 관리하는 명령입니다. 커널은 같은 L2 네트워크의 다른 호스트에
                    패킷을 보낼 때 IP 주소에 대응하는 MAC 주소를 알아야 하며,
                    이 매핑 정보가 neighbor 캐시(ARP 테이블)에 저장됩니다.
                </Prose>

                <InfoTable
                    headers={['상태', '의미']}
                    rows={neighStateRows}
                />

                <CodeBlock code={ipNeighCode} language="bash" filename="ip neigh — ARP/NDP 캐시 관리" />

                <InfoBox color="cyan" title="ARP 캐시 생명주기">
                    새로운 이웃이 발견되면 INCOMPLETE 상태에서 ARP Request를 보내고,
                    응답을 받으면 REACHABLE이 됩니다. 일정 시간(기본 30초) 동안 통신이 없으면
                    STALE로 전환되며, 이 상태에서 패킷을 보내려 하면 DELAY를 거쳐 PROBE 상태로
                    전환되어 ARP 재확인을 시도합니다. 응답이 없으면 FAILED가 됩니다.
                    이 타이밍은 sysctl의 net.ipv4.neigh.*.base_reachable_time_ms 등으로 조정합니다.
                </InfoBox>

                <Prose>
                    Static ARP entry(PERMANENT 상태)는 ARP 스푸핑 방어에 유용하지만,
                    네트워크 장비 교체 시 수동 업데이트가 필요합니다.
                    데이터센터 환경에서는 게이트웨이의 MAC 주소를 static으로 설정하여
                    ARP 스푸핑 공격으로부터 기본 경로를 보호하는 경우가 있습니다.
                </Prose>

                <InfoBox color="green" title="IPv6 NDP (Neighbor Discovery Protocol)">
                    IPv6는 ARP 대신 NDP를 사용합니다. NDP는 ICMPv6 기반으로 동작하며,
                    Neighbor Solicitation(NS)과 Neighbor Advertisement(NA) 메시지를 교환합니다.
                    ARP가 브로드캐스트를 사용하는 것과 달리, NDP는 멀티캐스트(Solicited-Node)를
                    사용하여 네트워크 부하를 줄입니다.
                    ip -6 neigh 명령으로 IPv6 neighbor 캐시를 확인할 수 있습니다.
                </InfoBox>

                <Alert variant="info" title="문제 진단:">
                    통신 장애 시 ip neigh show에서 FAILED 상태의 엔트리가 있다면
                    L2 연결(케이블, 스위치, VLAN), 대상 호스트의 상태(다운, 방화벽),
                    또는 IP 충돌 등을 의심해야 합니다.
                    ip neigh flush dev eth0로 캐시를 초기화하고 다시 시도해 볼 수 있습니다.
                </Alert>
            </Section>

            {/* ── 8.10 ss와 소켓 상태 관찰 ──────────────────── */}
            <Section id="s0810" title="8.10  ss와 소켓 상태 관찰">
                <Prose>
                    ss(socket statistics)는 netstat를 대체하는 현대적인 소켓 모니터링 도구입니다.
                    커널의 netlink 인터페이스를 직접 사용하여 /proc/net/tcp를 파싱하는 netstat보다
                    훨씬 빠르고, 더 상세한 정보를 제공합니다.
                    수천~수만 개의 소켓이 있는 서버에서 netstat는 수 초가 걸리지만,
                    ss는 거의 즉시 결과를 출력합니다.
                </Prose>

                <InfoTable
                    headers={['옵션', '설명']}
                    rows={ssOptionRows}
                />

                <CodeBlock code={ssCode} language="bash" filename="ss (socket statistics)" />

                <InfoBox color="cyan" title="소켓 상태 이해하기">
                    ss 출력의 State 열은 TCP 연결의 현재 상태를 보여줍니다.
                    LISTEN은 연결 대기 중, ESTAB은 연결 수립 완료,
                    CLOSE-WAIT는 상대방이 연결을 종료했지만 애플리케이션이 아직 close()를 호출하지 않은 상태,
                    TIME-WAIT는 연결 종료 후 지연 삭제 대기 상태입니다.
                    CLOSE-WAIT가 많으면 애플리케이션의 소켓 관리에 문제가 있을 수 있습니다.
                </InfoBox>

                <Prose>
                    Recv-Q와 Send-Q 열도 중요한 정보를 담고 있습니다.
                    LISTEN 상태에서 Recv-Q는 현재 accept() 대기 중인 완료된 연결 수(SYN queue),
                    Send-Q는 backlog 최대값입니다.
                    ESTAB 상태에서 Recv-Q는 애플리케이션이 아직 읽지 않은 수신 데이터 크기,
                    Send-Q는 아직 상대방에게 ACK 받지 못한 송신 데이터 크기입니다.
                    Recv-Q가 계속 증가하면 애플리케이션의 처리 속도가 수신 속도를 따라가지 못하는 것입니다.
                </Prose>

                <CodeBlock code={tcpdumpCode} language="bash" filename="tcpdump (패킷 캡처)" />
            </Section>

            {/* ── 8.11 sysctl 네트워크 파라미터 ─────────────── */}
            <Section id="s0811" title="8.11  sysctl 네트워크 파라미터">
                <Prose>
                    sysctl은 커널 파라미터를 런타임에 조회하고 변경하는 도구입니다.
                    네트워크와 관련된 파라미터는 net.ipv4.*, net.ipv6.*, net.core.* 아래에
                    위치하며, 서버의 네트워크 성능과 보안에 직접적인 영향을 미칩니다.
                </Prose>

                <InfoTable
                    headers={['파라미터', '설명', '비고']}
                    rows={sysctlRows}
                />

                <CodeBlock code={sysctlCode} language="bash" filename="sysctl 설정" />

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

                <Alert variant="info" title="영구 설정:">
                    sysctl -w 명령은 재부팅하면 초기화됩니다.
                    영구적으로 적용하려면 /etc/sysctl.conf 또는 /etc/sysctl.d/ 디렉토리에
                    설정 파일을 작성하고, sysctl -p로 적용하세요.
                </Alert>
            </Section>

            {/* ── 8.12 네트워크 네임스페이스와 veth ─────────── */}
            <Section id="s0812" title="8.12  네트워크 네임스페이스와 veth">
                <Prose>
                    네트워크 네임스페이스(Network Namespace)는 리눅스 커널이 제공하는
                    네트워크 격리 기능입니다. 각 네임스페이스는 독립적인 네트워크 스택을 가집니다:
                    자체 인터페이스 목록, IP 주소, 라우팅 테이블, iptables 규칙,
                    소켓 테이블이 모두 분리됩니다. Docker, Kubernetes 등 컨테이너 기술의
                    네트워크 격리 기반이 바로 네트워크 네임스페이스입니다.
                </Prose>

                <InfoBox color="purple" title="veth (Virtual Ethernet Pair)">
                    veth는 항상 쌍(pair)으로 생성되는 가상 네트워크 인터페이스입니다.
                    한쪽에 들어간 패킷은 반드시 다른 쪽으로 나옵니다.
                    마치 양 끝이 연결된 가상 이더넷 케이블과 같습니다.
                    주로 서로 다른 네트워크 네임스페이스를 연결하는 데 사용됩니다.
                </InfoBox>

                <CodeBlock code={ipNetnsCode} language="bash" filename="네트워크 네임스페이스 + veth" />

                <Prose>
                    위 예시에서 두 개의 네임스페이스(red, blue)를 만들고
                    veth 쌍으로 연결했습니다. 각 네임스페이스는 자체 IP 주소와 라우팅 테이블을 가지며,
                    veth를 통해 통신합니다. 이것이 Docker 컨테이너 네트워킹의 기본 원리입니다.
                    실제 Docker에서는 호스트에 docker0 브리지를 만들고,
                    각 컨테이너의 veth 한쪽을 이 브리지에 연결합니다.
                </Prose>

                <InfoBox color="cyan" title="컨테이너 네트워킹 구조">
                    Docker 컨테이너의 네트워크 구조:
                    1) 컨테이너마다 고유한 네트워크 네임스페이스 생성,
                    2) veth 쌍 생성 후 한쪽은 컨테이너 네임스페이스에, 다른 쪽은 호스트에 배치,
                    3) 호스트 쪽 veth를 docker0 브리지에 연결,
                    4) 컨테이너 내부에서 eth0(veth)에 IP 할당.
                    이 구조 덕분에 컨테이너끼리 L2 통신이 가능하고,
                    호스트의 NAT/iptables를 통해 외부와도 통신할 수 있습니다.
                </InfoBox>

                <Alert variant="info" title="참고:">
                    네트워크 네임스페이스 외에도 리눅스는 PID, Mount, UTS, IPC, User 등
                    다양한 네임스페이스를 제공합니다. 컨테이너는 이들 네임스페이스와 cgroup을
                    조합하여 프로세스 격리를 구현합니다.
                </Alert>
            </Section>

            {/* ── 8.13 요약 ────────────────────────────────── */}
            <Section id="s0813" title="8.13  요약">
                <Prose>
                    이 토픽에서는 리눅스 커널 네트워크 스택의 전체 구조를 학습했습니다.
                    NIC 하드웨어에서 소켓 API까지의 패킷 흐름, NAPI 기반의 효율적인 수신 처리,
                    그리고 모든 패킷을 표현하는 sk_buff 구조체의 내부를 살펴보았습니다.
                </Prose>

                <InfoBox color="gray" title="핵심 정리">
                    1) 리눅스 네트워크 스택은 User Space &rarr; System Call &rarr; Socket &rarr; Transport &rarr; IP &rarr; Netfilter &rarr; Driver &rarr; NIC의 계층 구조입니다.
                    2) NAPI는 인터럽트와 폴링의 하이브리드 모델로, 고속 패킷 처리를 효율화합니다.
                    3) sk_buff(skb)는 head/data/tail/end 포인터로 제로카피 패킷 처리를 구현합니다.
                    4) ip addr은 scope, primary/secondary, IPv6까지 세밀한 주소 관리를 제공합니다.
                    5) ip link로 veth, bridge, vlan, bond, vxlan 등 다양한 가상 인터페이스를 생성합니다.
                    6) ip route는 ECMP, blackhole, src 힌트 등 고급 라우팅 기능을 제공합니다.
                    7) ip rule은 RPDB 기반 정책 라우팅으로 멀티호밍, VPN split tunneling을 구현합니다.
                    8) ip neigh로 ARP/NDP 캐시 상태를 관리하고 L2 연결 문제를 진단합니다.
                    9) ss와 sysctl로 소켓 상태 모니터링과 커널 파라미터 튜닝을 수행합니다.
                    10) 네트워크 네임스페이스와 veth는 컨테이너 네트워킹의 기반 기술입니다.
                </InfoBox>

                <Alert variant="info" title="다음 토픽:">
                    Topic 09에서는 Netfilter의 5개 훅 포인트, iptables/nftables,
                    conntrack, SNAT/DNAT, TPROXY 등 패킷 처리와 방화벽의 상세 동작을 학습합니다.
                </Alert>
            </Section>

            <TopicNavigation topicId="08-linux-network" />
        </div>
    )
}
