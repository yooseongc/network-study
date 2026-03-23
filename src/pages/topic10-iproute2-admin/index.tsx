import { IprouteFlowDiagram } from '../../components/concepts/linux-net/IprouteFlowDiagram'
import { Alert, CardGrid, CodeBlock, InfoBox, InfoTable, LearningCard, Prose, Section, T, TopicNavigation } from '@study-ui/components'
import {
    ipAddrCode,
    ipAddrDetailCode,
    ipLinkCode,
    ipLinkDetailCode,
    ipRouteCode,
    ipRouteDetailCode,
    ipRuleCode,
    ipRuleDetailCode,
    ipRouteInterpretCode,
    ipRuleInterpretCode,
    vpnSplitTunnelCode,
    multiIspFailoverCode,
    ipNeighCode,
    tcQdiscBasicCode,
    tcHtbCode,
    tcNetemCode,
    tcFqCodelCode,
    tcMirredCode,
    tcBandwidthCode,
    ssCode,
    ipNetnsCode,
} from './codeSnippets'

/* ── Inline data ──────────────────────────────────────────────────── */

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

const qdiscTypeRows = [
    { cells: ['pfifo_fast', '기본 classless qdisc (3-band)', '단순 FIFO 큐잉'] },
    { cells: ['fq_codel', 'Fair Queuing + CoDel AQM', '버퍼블로트 해결, 최신 기본값'] },
    { cells: ['htb', 'Hierarchical Token Bucket', '계층적 대역폭 제어'] },
    { cells: ['tbf', 'Token Bucket Filter', '단순 대역폭 제한'] },
    { cells: ['netem', 'Network Emulator', '지연/손실/중복 시뮬레이션'] },
    { cells: ['ingress', '수신 트래픽 정책', '필터/리다이렉트 전용 (큐잉 아님)'] },
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

/* ── Component ────────────────────────────────────────────────────── */

export default function Topic10Iproute2Admin() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-14">
            {/* ── Header ─────────────────────────────────────────── */}
            <header className="space-y-3">
                <p className="text-xs font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                    Topic 10
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    iproute2와 리눅스 네트워크 관리
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    iproute2 & Linux Network Administration
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    iproute2 도구의 심화 사용법을 학습합니다.
                    ip addr, ip link, ip route, ip rule의 고급 기능과 실전 시나리오를 다루고,
                    tc/qdisc를 활용한 트래픽 제어, ss를 이용한 소켓 상태 관찰,
                    네트워크 네임스페이스의 원리를 익힙니다.
                </p>
            </header>

            {/* ── Learning Card ───────────────────────────────────── */}
            <LearningCard
                topicId="10-iproute2-admin"
                items={[
                    'ip addr로 scope, primary/secondary, IPv6까지 세밀하게 관리할 수 있다',
                    'ip link로 veth, bridge, vlan, bond 등 가상 인터페이스를 생성할 수 있다',
                    'ip route 출력을 한 줄씩 해석하고 ECMP/blackhole 등 고급 라우팅을 설정할 수 있다',
                    'ip rule로 RPDB 기반 정책 라우팅을 구성하고 매칭 과정을 시뮬레이션할 수 있다',
                    'ip neigh로 ARP/NDP 캐시를 관리하고 상태를 이해한다',
                    'tc/qdisc로 HTB 대역폭 제어, netem 시뮬레이션, fq_codel 동작을 이해한다',
                    'ss로 소켓 상태를 관찰하고 분석할 수 있다',
                    '네트워크 네임스페이스와 veth의 원리를 파악한다',
                ]}
            />

            {/* ── 10.1 ip addr — 주소 관리 상세 ────────────────── */}
            <Section id="s101" title="10.1  ip addr — 주소 관리 상세">
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
                </InfoBox>

                <InfoTable
                    headers={['scope', '의미', '예시']}
                    rows={addrScopeRows}
                />

                <CodeBlock code={ipAddrDetailCode} language="bash" filename="ip addr — 상세 활용" />
            </Section>

            {/* ── 10.2 ip link — 인터페이스 관리 상세 ──────────── */}
            <Section id="s102" title="10.2  ip link — 인터페이스 관리 상세">
                <Prose>
                    ip link는 네트워크 인터페이스의 L2 속성을 관리합니다.
                    인터페이스의 UP/DOWN 제어, MTU 변경, MAC 주소 설정은 물론,
                    리눅스가 지원하는 다양한 가상 인터페이스를 생성하고 삭제할 수 있습니다.
                    컨테이너, 가상화, 오버레이 네트워크의 기반이 되는 핵심 명령입니다.
                </Prose>

                <CodeBlock code={ipLinkCode} language="bash" filename="ip link — 기본 사용법" />

                <InfoTable
                    headers={['유형', '설명', '주요 용도']}
                    rows={virtualIfRows}
                />

                <CodeBlock code={ipLinkDetailCode} language="bash" filename="ip link — 가상 인터페이스와 상세 설정" />
            </Section>

            {/* ── 10.3 ip route — 라우팅 테이블 상세 ───────────── */}
            <Section id="s103" title="10.3  ip route — 라우팅 테이블 상세">
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

                <InfoTable
                    headers={['유형', '동작', 'ICMP 응답']}
                    rows={specialRouteRows}
                />

                <CodeBlock code={ipRouteDetailCode} language="bash" filename="ip route — 상세 활용" />
            </Section>

            {/* ── 10.4 ip rule — 정책 라우팅 상세 ──────────────── */}
            <Section id="s104" title="10.4  ip rule — 정책 라우팅 상세">
                <Prose>
                    일반적인 라우팅은 목적지 IP(destination)만으로 경로를 결정합니다.
                    그러나 실제 운영 환경에서는 같은 목적지라도 출발지 IP, 패킷의 마크(fwmark),
                    수신 인터페이스 등에 따라 다른 경로를 사용해야 하는 경우가 빈번합니다.
                    <T id="ip-rule">ip rule</T>은 이러한 정책 기반 라우팅(Policy Routing)을 구현하는 도구입니다.
                </Prose>

                <CodeBlock code={ipRuleCode} language="bash" filename="ip rule — 기본 사용법" />

                <InfoBox color="purple" title="RPDB (Routing Policy Database) 구조">
                    커널은 패킷의 라우팅을 결정할 때 RPDB의 rule을 priority(숫자가 작을수록 높은 우선순위)
                    순서대로 순회합니다. 각 rule은 조건(from, to, fwmark, iif, oif)과
                    동작(lookup 테이블, unreachable, blackhole 등)으로 구성됩니다.
                    조건에 매칭되면 해당 rule이 가리키는 라우팅 테이블에서 경로를 조회하고,
                    경로가 있으면 그것을 사용합니다. 경로가 없으면 다음 rule로 넘어갑니다.
                </InfoBox>

                <CodeBlock code={ipRuleDetailCode} language="bash" filename="ip rule — 상세 활용" />
            </Section>

            {/* ── 10.5 ip neigh — ARP/NDP 관리 ───────────────── */}
            <Section id="s105" title="10.5  ip neigh — ARP/NDP 관리">
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
                </InfoBox>
            </Section>

            {/* ── 10.6 ip route/rule 정책 해석 실습 ────────────── */}
            <Section id="s106" title="10.6  ip route/rule 정책 해석 실습">
                <Prose>
                    이 섹션에서는 ip route show와 ip rule show의 출력을 한 줄씩 해석하는 방법을 학습합니다.
                    실제 출력에 나타나는 각 필드(proto, scope, metric, via, dev, src 등)의 의미를 파악하고,
                    RPDB가 패킷을 매칭하는 순서를 시뮬레이션합니다.
                    이어서 fwmark 기반 VPN split-tunnel과 multi-ISP failover 시나리오를 실전 구성합니다.
                </Prose>

                <CodeBlock code={ipRouteInterpretCode} language="bash" filename="ip route show 출력 해석" />

                <InfoBox color="blue" title="proto / scope / metric 이해하기">
                    proto는 경로를 설정한 주체(kernel, static, dhcp, bgp 등)를 나타냅니다.
                    scope는 경로의 유효 범위(global, link, host)를 나타냅니다.
                    metric은 동일 목적지에 여러 경로가 있을 때 우선순위를 결정합니다.
                    이 세 필드를 이해하면 라우팅 테이블 출력을 정확하게 읽을 수 있습니다.
                </InfoBox>

                <CodeBlock code={ipRuleInterpretCode} language="bash" filename="ip rule show 해석 + RPDB 매칭 시뮬레이션" />

                <IprouteFlowDiagram />

                <InfoBox color="amber" title="RPDB 매칭의 핵심 포인트">
                    1) rule은 priority 순서로 평가됩니다 (숫자가 작을수록 먼저).
                    2) 조건(from, to, fwmark, iif)이 매칭되면 해당 테이블을 조회합니다.
                    3) 테이블에서 경로를 찾으면 사용하고, 못 찾으면 다음 rule로 이동합니다.
                    4) 모든 rule을 순회해도 경로를 못 찾으면 &quot;Network unreachable&quot;입니다.
                </InfoBox>

                <CodeBlock code={vpnSplitTunnelCode} language="bash" filename="VPN Split-Tunnel 시나리오" />

                <CodeBlock code={multiIspFailoverCode} language="bash" filename="Multi-ISP Failover 실전 구성" />

                <Alert variant="info" title="디버깅 필수 도구: ip route get">
                    ip route get [목적지]는 커널이 실제로 선택하는 경로를 보여줍니다.
                    ip rule, 여러 라우팅 테이블, src 선택까지 모두 반영된 최종 결과를 출력하므로,
                    라우팅 문제 디버깅 시 가장 먼저 사용해야 하는 명령입니다.
                    from [출발지] 옵션을 추가하면 policy routing 규칙까지 검증할 수 있습니다.
                </Alert>
            </Section>

            {/* ── 10.7 tc/qdisc 상세 사용법 ───────────────────── */}
            <Section id="s107" title="10.7  tc/qdisc 상세 사용법">
                <Prose>
                    <T id="tc-qdisc">tc</T>(traffic control)는 리눅스 커널의 패킷 스케줄링과 트래픽 제어를 관리하는 도구입니다.
                    qdisc(Queueing Discipline)를 설정하여 대역폭 제한, 지연 시뮬레이션,
                    공정 큐잉, 포트 미러링 등 다양한 트래픽 제어를 구현할 수 있습니다.
                </Prose>

                <InfoTable
                    headers={['qdisc', '유형', '주요 용도']}
                    rows={qdiscTypeRows}
                />

                <CodeBlock code={tcQdiscBasicCode} language="bash" filename="qdisc 기본 확인 및 통계 읽기" />

                <InfoBox color="green" title="HTB (Hierarchical Token Bucket)">
                    HTB는 리눅스에서 가장 널리 사용되는 classful qdisc입니다.
                    계층적 클래스 구조로 대역폭을 분배하며, 각 클래스에 보장 대역폭(rate)과
                    최대 대역폭(ceil)을 설정할 수 있습니다. 부모 클래스의 여유 대역폭을
                    자식 클래스가 빌려 쓸 수 있어(borrowing) 유연한 대역폭 관리가 가능합니다.
                </InfoBox>

                <CodeBlock code={tcHtbCode} language="bash" filename="HTB 계층 구조 설정" />

                <InfoBox color="purple" title="netem (Network Emulator)">
                    netem은 네트워크 조건을 시뮬레이션하는 qdisc입니다.
                    WAN 환경이나 열악한 네트워크 조건을 로컬에서 재현할 때 유용합니다.
                    지연(delay), 패킷 손실(loss), 중복(duplicate), 순서 변경(reorder),
                    비트 손상(corrupt) 등을 설정할 수 있습니다.
                    성능 테스트, 장애 시뮬레이션, 프로토콜 검증에 활용됩니다.
                </InfoBox>

                <CodeBlock code={tcNetemCode} language="bash" filename="netem — 네트워크 조건 시뮬레이션" />

                <CodeBlock code={tcFqCodelCode} language="bash" filename="fq_codel — Fair Queuing + CoDel" />

                <InfoBox color="cyan" title="fq_codel과 버퍼블로트">
                    버퍼블로트(bufferbloat)는 네트워크 경로상의 과도한 버퍼링으로 인해
                    지연이 급격히 증가하는 현상입니다. fq_codel은 흐름별 공정 큐잉과
                    CoDel AQM(Active Queue Management)을 결합하여 이 문제를 해결합니다.
                    큐 체류 시간(sojourn time)이 target(5ms)을 초과하면 패킷을 능동적으로
                    드롭하여 TCP 혼잡 제어가 빠르게 반응하도록 합니다.
                </InfoBox>

                <CodeBlock code={tcBandwidthCode} language="bash" filename="대역폭 제한 실전 예시" />

                <CodeBlock code={tcMirredCode} language="bash" filename="tc mirred — 포트 미러링" />

                <Alert variant="info" title="tc 명령 구조:">
                    tc 명령은 크게 세 계층으로 구성됩니다:
                    qdisc(큐잉 알고리즘), class(트래픽 분류 계층), filter(패킷 분류 규칙).
                    classless qdisc(fq_codel, tbf, netem)는 단독 사용이 가능하고,
                    classful qdisc(htb, prio)는 class와 filter를 조합하여 사용합니다.
                </Alert>
            </Section>

            {/* ── 10.8 ss와 소켓 상태 관찰 ──────────────────── */}
            <Section id="s108" title="10.8  ss와 소켓 상태 관찰">
                <Prose>
                    ss(socket statistics)는 netstat를 대체하는 현대적인 소켓 모니터링 도구입니다.
                    커널의 netlink 인터페이스를 직접 사용하여 /proc/net/tcp를 파싱하는 netstat보다
                    훨씬 빠르고, 더 상세한 정보를 제공합니다.
                </Prose>

                <InfoTable
                    headers={['옵션', '설명']}
                    rows={ssOptionRows}
                />

                <CodeBlock code={ssCode} language="bash" filename="ss (socket statistics)" />

                <InfoBox color="cyan" title="소켓 상태와 Recv-Q/Send-Q">
                    LISTEN 상태에서 Recv-Q는 accept() 대기 중인 완료된 연결 수,
                    Send-Q는 backlog 최대값입니다.
                    ESTAB 상태에서 Recv-Q는 아직 읽지 않은 수신 데이터 크기,
                    Send-Q는 아직 ACK 받지 못한 송신 데이터 크기입니다.
                    CLOSE-WAIT가 많으면 애플리케이션의 소켓 관리에 문제가 있을 수 있습니다.
                </InfoBox>
            </Section>

            {/* ── 10.9 네트워크 네임스페이스와 veth ─────────── */}
            <Section id="s109" title="10.9  네트워크 네임스페이스와 veth">
                <Prose>
                    <T id="netns">네트워크 네임스페이스</T>와 veth는 컨테이너 네트워킹의 기반 기술입니다.
                    이 두 가지를 조합하면 하나의 호스트에서 완전히 격리된 가상 네트워크를 구성할 수 있습니다.
                </Prose>

                <CardGrid cols={2}>
                    <InfoBox color="indigo" title="Network Namespace (netns)">
                        리눅스 커널이 제공하는 네트워크 격리 기능입니다.
                        각 네임스페이스는 독립적인 네트워크 스택을 가집니다:
                        <ul className="list-disc ml-4 mt-1 space-y-0.5">
                            <li>자체 인터페이스 목록 (lo, eth0 등)</li>
                            <li>독립된 IP 주소와 라우팅 테이블</li>
                            <li>별도의 iptables/nftables 규칙</li>
                            <li>분리된 소켓 테이블</li>
                        </ul>
                    </InfoBox>
                    <InfoBox color="purple" title="veth (Virtual Ethernet Pair)">
                        항상 쌍(pair)으로 생성되는 가상 네트워크 인터페이스입니다.
                        한쪽에 들어간 패킷은 반드시 다른 쪽으로 나옵니다.
                        <ul className="list-disc ml-4 mt-1 space-y-0.5">
                            <li>가상 이더넷 케이블과 동일한 동작</li>
                            <li>서로 다른 네임스페이스를 연결</li>
                            <li>한쪽을 bridge에 연결하여 외부 통신</li>
                            <li>Docker/K8s의 Pod 네트워크 기반</li>
                        </ul>
                    </InfoBox>
                </CardGrid>

                <CodeBlock code={ipNetnsCode} language="bash" filename="네트워크 네임스페이스 + veth" />

                <InfoBox color="cyan" title="컨테이너 네트워킹 구조 (Docker 예시)">
                    <ol className="list-decimal ml-4 space-y-0.5 mt-1">
                        <li>컨테이너마다 고유한 네트워크 네임스페이스 생성</li>
                        <li>veth 쌍 생성 후 한쪽은 컨테이너 네임스페이스에, 다른 쪽은 호스트에 배치</li>
                        <li>호스트 쪽 veth를 docker0 브리지에 연결</li>
                        <li>컨테이너 내부에서 eth0(veth)에 IP 할당</li>
                    </ol>
                </InfoBox>
            </Section>

            {/* ── 10.10 요약 ────────────────────────────────── */}
            <Section id="s1010" title="10.10  요약">
                <Prose>
                    이 토픽에서는 iproute2 도구를 활용한 리눅스 네트워크 관리의 전 범위를 학습했습니다.
                    주소 관리, 인터페이스 관리, 라우팅, 정책 라우팅, ARP/NDP, 트래픽 제어,
                    소켓 모니터링, 네임스페이스까지 다루었습니다.
                </Prose>

                <CardGrid cols={3}>
                    <InfoBox color="blue" title="ip addr">
                        scope, primary/secondary, IPv6까지 세밀한 주소 관리
                    </InfoBox>
                    <InfoBox color="purple" title="ip link">
                        veth, bridge, vlan, bond, <T id="vxlan">vxlan</T> 등 가상 인터페이스 생성
                    </InfoBox>
                    <InfoBox color="green" title="ip route">
                        proto, scope, metric, src 필드를 정확히 해석
                    </InfoBox>
                    <InfoBox color="amber" title="ip rule">
                        RPDB 기반 정책 라우팅, 멀티호밍, VPN split tunneling
                    </InfoBox>
                    <InfoBox color="cyan" title="ip neigh">
                        ARP/NDP 캐시 상태 관리, L2 연결 문제 진단
                    </InfoBox>
                    <InfoBox color="red" title="tc / qdisc">
                        HTB 대역폭 제어, netem 시뮬레이션, fq_codel, mirred 미러링
                    </InfoBox>
                    <InfoBox color="teal" title="ss">
                        소켓 상태 빠른 모니터링 및 필터링
                    </InfoBox>
                    <InfoBox color="indigo" title="netns + veth">
                        네트워크 격리와 가상 연결, 컨테이너 네트워킹 기반 기술
                    </InfoBox>
                </CardGrid>

                <Alert variant="info" title="다음 토픽:">
                    이어지는 토픽들에서는 Netfilter/iptables를 활용한 패킷 처리와 방화벽,
                    고성능 네트워크 처리(XDP, DPDK), 그리고 실전 네트워크 장애 분석을 학습합니다.
                </Alert>
            </Section>

            <TopicNavigation topicId="10-iproute2-admin" />
        </div>
    )
}
