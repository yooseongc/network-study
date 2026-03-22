import { CardGrid } from '../../components/ui/CardGrid'
import { InlineCode } from '../../components/ui/InlineCode'
import { Section } from '../../components/ui/Section'
import { Prose } from '../../components/ui/Prose'
import { InfoTable } from '../../components/ui/InfoTable'
import { InfoBox } from '../../components/ui/InfoBox'
import { StatCard } from '../../components/ui/StatCard'
import { Alert } from '../../components/ui/Alert'
import { LearningCard } from '../../components/ui/LearningCard'
import { TopicNavigation } from '../../components/ui/TopicNavigation'
import { CodeBlock } from '../../components/viz/CodeBlock'
import { NetfilterHooksDiagram } from '../../components/concepts/firewall/NetfilterHooksDiagram'
import {
    iptablesListCode,
    iptablesBasicCode,
    nftablesCode,
    conntrackCode,
    snatDnatCode,
    portForwardCode,
    fwmarkCode,
    tproxyCode,
    natTableAscii,
} from './codeSnippets'

/* ── Inline data ──────────────────────────────────────────────────── */

const hookRows = [
    { cells: ['PREROUTING', '패킷 도착 직후 (라우팅 전)', 'DNAT, conntrack, raw'] },
    { cells: ['INPUT', '로컬 프로세스로 전달 직전', '방화벽 필터링 (수신)'] },
    { cells: ['FORWARD', '다른 인터페이스로 포워딩 시', '방화벽 필터링 (전달)'] },
    { cells: ['OUTPUT', '로컬 프로세스에서 송신 시', '방화벽 필터링 (송신), DNAT'] },
    { cells: ['POSTROUTING', '패킷이 나가기 직전', 'SNAT, MASQUERADE'] },
]

const tableRows = [
    { cells: ['raw', '-300', 'conntrack 제외 설정 (NOTRACK)'] },
    { cells: ['mangle', '-150', '패킷 헤더 변조, MARK, TOS, TTL 변경'] },
    { cells: ['nat', '-100', '주소/포트 변환 (SNAT, DNAT, MASQUERADE)'] },
    { cells: ['filter', '0', '패킷 허용/차단 (ACCEPT, DROP, REJECT)'] },
]

const conntrackStateRows = [
    { cells: ['NEW', '새로운 연결의 첫 번째 패킷', 'SYN 패킷 (TCP), 첫 UDP 패킷'] },
    { cells: ['ESTABLISHED', '양방향 패킷이 확인된 연결', 'SYN+ACK 이후, UDP 응답 수신 후'] },
    { cells: ['RELATED', '기존 연결과 관련된 새 연결', 'FTP data, ICMP error'] },
    { cells: ['INVALID', '어떤 연결에도 속하지 않는 패킷', '잘못된 플래그 조합, 만료된 연결'] },
]

const iptablesVsNftRows = [
    { cells: ['커널 인터페이스', 'xtables (각 테이블별 별도)', 'nf_tables (통합 인터페이스)'] },
    { cells: ['문법', '명령줄 플래그 (-A, -j)', '자체 문법 (nft add rule)'] },
    { cells: ['프로토콜 지원', 'iptables / ip6tables / arptables', 'inet 패밀리로 IPv4/IPv6 통합'] },
    { cells: ['규칙 적용', '규칙마다 커널 호출', '규칙 세트를 원자적(atomic) 적용'] },
    { cells: ['성능', '선형 매칭 (O(n))', 'set/map으로 O(1) 매칭 가능'] },
    { cells: ['확장성', '별도 모듈(match/target)', '내장 표현식으로 유연한 조합'] },
    { cells: ['호환성', '레거시, 점진적 대체 중', 'RHEL 8+, Debian 10+ 기본'] },
]

const natCompareRows = [
    { cells: ['SNAT', 'POSTROUTING', '출발지 IP 변환 (고정 IP)', '사설망 → 인터넷'] },
    { cells: ['DNAT', 'PREROUTING', '목적지 IP/포트 변환', '외부 → 내부 서버'] },
    { cells: ['MASQUERADE', 'POSTROUTING', '출발지 IP 변환 (동적 IP)', 'PPPoE, DHCP 환경'] },
    { cells: ['REDIRECT', 'PREROUTING', '목적지를 로컬로 변경', 'transparent proxy'] },
]

const inlineVsOopRows = [
    { cells: ['위치', '트래픽 경로 상에 직접 삽입', '트래픽 경로 밖 (미러링/탭)'] },
    { cells: ['동작', 'FORWARD 체인 통과', '수신만 하고 분석'] },
    { cells: ['차단 가능', '가능 (DROP/REJECT)', '불가 (탐지만, 또는 RST 전송)'] },
    { cells: ['장애 시 영향', '트래픽 단절 (bypass 필요)', '서비스 영향 없음'] },
    { cells: ['지연(latency)', '추가 지연 발생', '지연 없음'] },
    { cells: ['대표 장비', '방화벽, IPS, WAF', 'IDS, 네트워크 모니터'] },
    { cells: ['구현 방식', 'bridge/router 모드', 'SPAN port, TAP 장비'] },
]

/* ── Component ────────────────────────────────────────────────────── */

export default function Topic09() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-14">
            {/* ── Header ─────────────────────────────────────────── */}
            <header className="space-y-3">
                <p className="text-xs font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                    Topic 09
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    패킷 처리와 방화벽 / NAT / 프록시
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    Packet Processing, Firewall, NAT & Proxy
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    리눅스 커널의 Netfilter 프레임워크를 기반으로 패킷 필터링, 주소 변환(NAT),
                    투명 프록시(TPROXY)가 어떻게 동작하는지 커널 수준에서 이해합니다.
                    iptables/nftables를 통한 방화벽 구성과 conntrack 기반 상태 추적의 원리를 학습합니다.
                </p>
            </header>

            <LearningCard
                topicId="09-packet-processing"
                items={[
                    'Netfilter 5개 훅 포인트의 위치와 역할을 이해한다',
                    'conntrack과 stateful 방화벽의 동작을 설명할 수 있다',
                    'SNAT/DNAT/MASQUERADE의 차이와 적용 위치를 파악한다',
                    'TPROXY와 transparent proxy의 원리를 이해한다',
                    'inline 장비와 out-of-path 장비의 차이를 구분할 수 있다',
                ]}
            />

            {/* ── 9.1 Netfilter 구조 ──────────────────────────────── */}
            <Section id="s091" title="9.1  Netfilter 구조">
                <Prose>
                    Netfilter는 리눅스 커널의 네트워크 스택 안에 삽입된 패킷 처리 프레임워크입니다.
                    커널이 패킷을 처리하는 경로 위에 5개의 <InlineCode>hook point</InlineCode>를
                    정의하고, 각 훅에 등록된 콜백 함수(모듈)가 순서대로 패킷을 검사하거나 변조합니다.
                    iptables, nftables, conntrack 등은 모두 이 Netfilter 훅 위에서 동작하는 모듈입니다.
                </Prose>

                <NetfilterHooksDiagram />

                <InfoTable
                    headers={['Hook', '위치', '주요 용도']}
                    rows={hookRows}
                />

                <InfoBox color="blue" title="테이블(Table)과 체인(Chain)">
                    Netfilter에서 iptables는 용도별로 4개의 테이블(raw, mangle, nat, filter)을 제공하며,
                    각 테이블은 특정 훅 포인트의 체인에 규칙을 등록합니다.
                    하나의 훅에 여러 테이블의 규칙이 등록될 수 있으며, 우선순위(priority)에 따라 실행 순서가 결정됩니다.
                </InfoBox>

                <InfoTable
                    headers={['테이블', '우선순위', '설명']}
                    rows={tableRows}
                />

                <CodeBlock code={natTableAscii} language="text" filename="iptables 테이블 구조" />

                <Alert variant="tip" title="핵심:">
                    패킷이 커널을 통과하는 경로를 이해하는 것이 Netfilter를 이해하는 핵심입니다.
                    로컬 프로세스로 향하는 패킷은 PREROUTING → INPUT 경로를,
                    포워딩되는 패킷은 PREROUTING → FORWARD → POSTROUTING 경로를,
                    로컬에서 생성된 패킷은 OUTPUT → POSTROUTING 경로를 따릅니다.
                </Alert>
            </Section>

            {/* ── 9.2 iptables와 nftables ─────────────────────────── */}
            <Section id="s092" title="9.2  iptables와 nftables">
                <Prose>
                    iptables는 Netfilter의 전통적인 사용자 공간 도구로, 테이블/체인/규칙 구조를 통해
                    패킷 필터링과 NAT를 설정합니다. nftables는 iptables의 후속으로,
                    통합된 문법과 더 나은 성능을 제공하며 점진적으로 iptables를 대체하고 있습니다.
                </Prose>

                <InfoBox color="purple" title="iptables 규칙 구조">
                    iptables 규칙은 <InlineCode>iptables -t [테이블] -A [체인] [조건] -j [타겟]</InlineCode> 형식입니다.
                    조건에는 프로토콜(-p), 출발지(-s), 목적지(-d), 포트(--dport/--sport), 상태(-m state) 등을 지정하고,
                    타겟(ACCEPT, DROP, REJECT, LOG 등)으로 처리를 결정합니다.
                </InfoBox>

                <CodeBlock code={iptablesBasicCode} language="bash" filename="iptables 기본 방화벽 설정" />

                <CodeBlock code={iptablesListCode} language="bash" filename="iptables 규칙 확인" />

                <InfoBox color="indigo" title="nftables 특징">
                    nftables는 inet 패밀리로 IPv4/IPv6를 통합 관리하고,
                    set/map 자료구조로 O(1) 매칭이 가능합니다.
                    규칙 세트를 원자적(atomic)으로 적용하므로 일부 규칙만 적용되는 문제가 없습니다.
                </InfoBox>

                <CodeBlock code={nftablesCode} language="bash" filename="nftables 설정 예시" />

                <InfoTable
                    headers={['항목', 'iptables', 'nftables']}
                    rows={iptablesVsNftRows}
                />

                <Alert variant="info" title="호환성:">
                    최신 리눅스 배포판은 iptables 명령이 내부적으로 nft 백엔드를 사용하는
                    iptables-nft로 대체되는 추세입니다. 기존 iptables 규칙 문법은 계속 사용 가능하지만,
                    nftables 문법 학습을 권장합니다.
                </Alert>
            </Section>

            {/* ── 9.3 conntrack과 stateful 방화벽 ─────────────────── */}
            <Section id="s093" title="9.3  conntrack과 stateful 방화벽">
                <Prose>
                    conntrack(Connection Tracking)은 Netfilter의 핵심 모듈로, 커널이 처리하는
                    모든 네트워크 연결의 상태를 추적합니다. 각 패킷이 어떤 연결에 속하는지 판별하여
                    NEW, ESTABLISHED, RELATED, INVALID 중 하나의 상태를 부여합니다.
                    이를 기반으로 stateful 방화벽을 구현할 수 있습니다.
                </Prose>

                <InfoTable
                    headers={['상태', '설명', '예시']}
                    rows={conntrackStateRows}
                />

                <CardGrid cols={2}>
                    <StatCard
                        title="기본 conntrack 테이블 크기"
                        value="65,536"
                        color="cyan"
                        desc="nf_conntrack_max 기본값. 대규모 서버는 131072+ 권장"
                    />
                    <StatCard
                        title="TCP ESTABLISHED 타임아웃"
                        value="432,000초"
                        color="amber"
                        desc="5일 (nf_conntrack_tcp_timeout_established)"
                    />
                </CardGrid>

                <InfoBox color="green" title="Stateful 방화벽의 장점">
                    stateful 방화벽은 conntrack을 활용하여 &quot;이미 허용된 연결의 응답 패킷&quot;을
                    자동으로 허용합니다. 이를 통해 규칙 수를 대폭 줄일 수 있습니다.
                    예를 들어, 아웃바운드 HTTP 요청을 허용하면 그 응답 패킷은 ESTABLISHED 상태로
                    자동 허용되어 별도의 인바운드 규칙이 불필요합니다.
                </InfoBox>

                <CodeBlock code={conntrackCode} language="bash" filename="conntrack 명령어" />

                <Alert variant="warning" title="주의:">
                    conntrack 테이블이 가득 차면(nf_conntrack_max 초과) 새로운 연결이 DROP되고
                    dmesg에 &quot;nf_conntrack: table full, dropping packet&quot; 메시지가 출력됩니다.
                    고부하 서버에서는 반드시 nf_conntrack_max 값을 튜닝해야 합니다.
                </Alert>
            </Section>

            {/* ── 9.4 SNAT / DNAT / MASQUERADE ────────────────────── */}
            <Section id="s094" title="9.4  SNAT / DNAT / MASQUERADE">
                <Prose>
                    NAT(Network Address Translation)는 패킷의 출발지 또는 목적지 주소를 변환하는 기술입니다.
                    리눅스에서는 Netfilter의 nat 테이블을 통해 구현되며, conntrack과 함께 동작하여
                    변환된 주소의 역변환(reverse translation)을 자동으로 처리합니다.
                </Prose>

                <InfoTable
                    headers={['유형', '체인', '동작', '사용 사례']}
                    rows={natCompareRows}
                />

                <CardGrid cols={2}>
                    <InfoBox color="amber" title="SNAT (Source NAT)">
                        POSTROUTING 체인에서 출발지 IP를 변환합니다.
                        사설 네트워크의 호스트가 인터넷에 접근할 때 공인 IP로 변환하는 것이 대표적입니다.
                        고정 공인 IP 환경에서 사용합니다.
                    </InfoBox>
                    <InfoBox color="teal" title="MASQUERADE">
                        SNAT와 동일한 역할이지만, 나가는 인터페이스의 현재 IP를 자동으로 사용합니다.
                        DHCP나 PPPoE처럼 IP가 동적으로 변하는 환경에서 사용합니다.
                        SNAT보다 약간의 오버헤드가 있습니다.
                    </InfoBox>
                </CardGrid>

                <InfoBox color="rose" title="DNAT (Destination NAT)">
                    PREROUTING 체인에서 목적지 IP/포트를 변환합니다.
                    외부에서 공인 IP로 접근한 트래픽을 내부의 실제 서버로 전달할 때 사용합니다.
                    DNAT 적용 후에는 반드시 FORWARD 체인에서 해당 트래픽을 ACCEPT 해야 합니다.
                </InfoBox>

                <CodeBlock code={snatDnatCode} language="bash" filename="SNAT / DNAT / MASQUERADE 설정" />

                <Alert variant="tip" title="conntrack과 NAT:">
                    NAT 규칙은 연결의 첫 번째 패킷(NEW 상태)에만 적용됩니다.
                    이후 패킷은 conntrack이 자동으로 같은 변환을 적용합니다.
                    따라서 NAT 규칙 변경 시 기존 연결에는 영향이 없고,
                    새로운 연결부터 변경된 규칙이 적용됩니다.
                </Alert>
            </Section>

            {/* ── 9.5 포트 포워딩 ─────────────────────────────────── */}
            <Section id="s095" title="9.5  포트 포워딩">
                <Prose>
                    포트 포워딩(Port Forwarding)은 DNAT의 대표적인 활용 사례입니다.
                    외부에서 특정 포트로 들어오는 트래픽을 내부 네트워크의 다른 호스트/포트로
                    전달합니다. 하나의 공인 IP로 여러 내부 서비스를 노출할 수 있습니다.
                </Prose>

                <InfoBox color="sky" title="포트 포워딩 동작 흐름">
                    1. 외부 클라이언트가 공인IP:2222로 접속 시도<br />
                    2. PREROUTING에서 DNAT: 목적지를 10.0.0.5:22로 변환<br />
                    3. 라우팅 결정: 내부 인터페이스로 포워딩<br />
                    4. FORWARD 체인: 해당 트래픽 ACCEPT<br />
                    5. POSTROUTING에서 필요 시 SNAT/MASQUERADE<br />
                    6. 응답 패킷은 conntrack이 역변환 자동 처리
                </InfoBox>

                <CodeBlock code={portForwardCode} language="bash" filename="포트 포워딩 설정" />

                <Alert variant="warning" title="ip_forward 필수:">
                    포트 포워딩이 동작하려면 반드시 IP 포워딩이 활성화되어 있어야 합니다.
                    <InlineCode>sysctl -w net.ipv4.ip_forward=1</InlineCode>
                </Alert>
            </Section>

            {/* ── 9.6 mark / fwmark과 policy routing ──────────────── */}
            <Section id="s096" title="9.6  mark / fwmark과 policy routing">
                <Prose>
                    mark(fwmark)는 커널 내부에서 패킷이나 연결에 부여하는 정수 태그입니다.
                    패킷 자체에는 기록되지 않고 <InlineCode>sk_buff.mark</InlineCode> 필드에
                    저장됩니다. iptables/nftables의 mangle 테이블에서 설정하고,
                    <InlineCode>ip rule</InlineCode>과
                    연동하여 policy-based routing을 구현합니다.
                </Prose>

                <CardGrid cols={3}>
                    <StatCard
                        title="mark 크기"
                        value="32-bit"
                        color="purple"
                        desc="0x00000000 ~ 0xFFFFFFFF"
                    />
                    <StatCard
                        title="적용 테이블"
                        value="mangle"
                        color="orange"
                        desc="MARK 타겟으로 설정"
                    />
                    <StatCard
                        title="라우팅 연동"
                        value="ip rule"
                        color="teal"
                        desc="fwmark 조건으로 테이블 선택"
                    />
                </CardGrid>

                <InfoBox color="violet" title="Policy-based Routing 활용 사례">
                    <strong>멀티 ISP 환경:</strong> HTTPS 트래픽은 ISP-A로, 일반 트래픽은 ISP-B로 분리<br />
                    <strong>VPN 분리:</strong> 특정 출발지 서브넷은 VPN 터널로, 나머지는 일반 경로로<br />
                    <strong>QoS:</strong> 우선순위 높은 트래픽을 별도 경로로 전송<br />
                    <strong>부하 분산:</strong> 트래픽 특성에 따라 여러 업링크에 분배
                </InfoBox>

                <CodeBlock code={fwmarkCode} language="bash" filename="mark / fwmark 설정" />

                <Alert variant="info" title="mark vs connmark:">
                    mark는 개별 패킷에 부여되지만, connmark는 연결 전체에 부여됩니다.
                    CONNMARK 타겟으로 패킷 mark를 연결 mark로 복사하거나(--save-mark),
                    연결 mark를 패킷에 복원할 수 있습니다(--restore-mark).
                </Alert>
            </Section>

            {/* ── 9.7 TPROXY와 transparent proxy ──────────────────── */}
            <Section id="s097" title="9.7  TPROXY와 transparent proxy">
                <Prose>
                    Transparent Proxy는 클라이언트가 프록시의 존재를 인식하지 못하는 상태에서
                    트래픽을 프록시 서버로 리다이렉트하는 방식입니다. 클라이언트는 원래 목적지로
                    통신한다고 생각하지만, 실제로는 중간의 프록시가 트래픽을 가로채 처리합니다.
                </Prose>

                <CardGrid cols={2}>
                    <InfoBox color="emerald" title="REDIRECT 방식">
                        nat 테이블의 PREROUTING에서 목적지를 로컬 프록시 포트로 변경합니다.
                        구현이 간단하지만, 원본 목적지 IP가 변경되어 프록시가 SO_ORIGINAL_DST
                        소켓 옵션으로 원래 목적지를 확인해야 합니다. TCP에서만 동작합니다.
                    </InfoBox>
                    <InfoBox color="cyan" title="TPROXY 방식">
                        mangle 테이블의 PREROUTING에서 패킷을 그대로 로컬 소켓으로 전달합니다.
                        원본 목적지 IP/포트가 보존되며, IP_TRANSPARENT 소켓 옵션을 사용합니다.
                        TCP와 UDP 모두 지원하며, REDIRECT보다 유연합니다.
                    </InfoBox>
                </CardGrid>

                <CodeBlock code={tproxyCode} language="bash" filename="TPROXY / REDIRECT 설정" />

                <InfoBox color="orange" title="TPROXY 동작 원리">
                    1. mangle PREROUTING에서 TPROXY 타겟으로 패킷에 mark 부여 + 로컬 포트 지정<br />
                    2. ip rule fwmark 규칙이 패킷을 로컬 라우팅 테이블로 유도<br />
                    3. 로컬 라우팅 테이블에 &quot;local 0.0.0.0/0 dev lo&quot;가 있어 모든 패킷이 로컬로 전달<br />
                    4. 프록시 프로세스가 IP_TRANSPARENT 소켓으로 해당 포트를 listen<br />
                    5. 프록시는 원본 목적지 IP/포트를 그대로 볼 수 있음
                </InfoBox>

                <Alert variant="tip" title="실무 활용:">
                    Squid, Envoy, HAProxy 등의 프록시가 TPROXY를 지원합니다.
                    기업 환경에서 웹 필터링, SSL 검사, 캐싱 프록시 등에 활용됩니다.
                    Kubernetes의 kube-proxy도 TPROXY 모드를 실험적으로 지원합니다.
                </Alert>
            </Section>

            {/* ── 9.8 inline vs out-of-path 장비 ──────────────────── */}
            <Section id="s098" title="9.8  inline vs out-of-path 장비">
                <Prose>
                    네트워크 보안/모니터링 장비는 트래픽 경로 상의 위치에 따라
                    inline(인라인)과 out-of-path(아웃오브패스)로 나뉩니다.
                    이 배치 방식에 따라 장비의 역할, 성능 영향, 장애 시 동작이 크게 달라집니다.
                </Prose>

                <InfoTable
                    headers={['항목', 'Inline (인라인)', 'Out-of-path (아웃오브패스)']}
                    rows={inlineVsOopRows}
                />

                <CardGrid cols={2}>
                    <InfoBox color="red" title="Inline 장비">
                        트래픽이 반드시 장비를 통과해야 하므로 실시간 차단이 가능합니다.
                        방화벽, IPS(침입 방지 시스템), WAF(웹 애플리케이션 방화벽) 등이 대표적입니다.
                        장비 장애 시 트래픽이 중단되므로 bypass 스위치나 HA(이중화) 구성이 필수입니다.
                        Netfilter의 FORWARD 체인이나 bridge 모드로 구현됩니다.
                    </InfoBox>
                    <InfoBox color="green" title="Out-of-path 장비">
                        트래픽의 사본(미러링)을 받아 분석하므로 서비스에 영향을 주지 않습니다.
                        IDS(침입 탐지 시스템), 네트워크 모니터링, 패킷 캡처 장비 등이 해당됩니다.
                        SPAN 포트나 네트워크 TAP 장비를 통해 트래픽을 복제하여 전달받습니다.
                        실시간 차단은 불가능하지만, TCP RST 전송으로 연결을 끊는 방식도 있습니다.
                    </InfoBox>
                </CardGrid>

                <Alert variant="info" title="하이브리드 구성:">
                    실무에서는 inline 장비와 out-of-path 장비를 조합하여 사용합니다.
                    방화벽(inline)으로 기본 정책을 적용하고, IDS(out-of-path)로 상세 분석을 수행하는
                    구성이 일반적입니다. 최근에는 eBPF/XDP를 활용한 소프트웨어 기반 inline 처리도
                    증가하고 있습니다.
                </Alert>
            </Section>

            {/* ── 9.9 요약 ───────────────────────────────────────── */}
            <Section id="s099" title="9.9  요약">
                <CardGrid cols={2}>
                    <InfoBox color="blue" title="Netfilter 5개 훅">
                        PREROUTING → INPUT/FORWARD → OUTPUT → POSTROUTING.
                        각 훅에 raw, mangle, nat, filter 테이블의 규칙이 우선순위대로 적용됩니다.
                    </InfoBox>
                    <InfoBox color="purple" title="iptables vs nftables">
                        iptables는 레거시, nftables는 통합 문법과 원자적 적용을 제공합니다.
                        nftables는 set/map으로 O(1) 매칭이 가능하여 대규모 규칙에서 성능이 우수합니다.
                    </InfoBox>
                    <InfoBox color="cyan" title="conntrack / stateful 방화벽">
                        NEW → ESTABLISHED → RELATED 상태 추적으로 응답 패킷을 자동 허용합니다.
                        테이블 크기(nf_conntrack_max) 관리가 고부하 환경에서 중요합니다.
                    </InfoBox>
                    <InfoBox color="amber" title="NAT 종류">
                        SNAT(출발지 변환, POSTROUTING), DNAT(목적지 변환, PREROUTING),
                        MASQUERADE(동적 SNAT). conntrack이 역변환을 자동 처리합니다.
                    </InfoBox>
                    <InfoBox color="violet" title="mark와 policy routing">
                        mangle 테이블에서 패킷에 mark를 부여하고, ip rule fwmark로 별도
                        라우팅 테이블을 선택하여 정책 기반 라우팅을 구현합니다.
                    </InfoBox>
                    <InfoBox color="emerald" title="TPROXY / transparent proxy">
                        TPROXY는 원본 목적지를 보존하며 프록시로 전달합니다.
                        REDIRECT는 목적지를 변경하므로 SO_ORIGINAL_DST가 필요합니다.
                    </InfoBox>
                </CardGrid>

                <Alert variant="tip" title="다음 단계:">
                    Topic 10에서는 RSS/RPS, qdisc, XDP, DPDK 등 고성능 패킷 처리와
                    트래픽 제어(Traffic Control)를 학습합니다.
                </Alert>
            </Section>

            <TopicNavigation topicId="09-packet-processing" />
        </div>
    )
}
