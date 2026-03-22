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
import { TroubleshootFlowDiagram } from '../../components/concepts/troubleshoot/TroubleshootFlowDiagram'
import {
    pingCode,
    tracerouteCode,
    mtrCode,
    tcpdumpBasicCode,
    tcpdumpFlagCode,
    dnsDebugCode,
    tcpDebugCode,
    mtuDebugCode,
    ssSocketCode,
    dmesgNetCode,
} from './codeSnippets'

/* ── Inline data ──────────────────────────────────────────────────── */

const troubleshootSteps = [
    { cells: ['1', 'L1/L2 확인', '케이블, NIC 상태, 링크 UP 여부', 'ip link show, ethtool'] },
    { cells: ['2', '로컬 네트워크', '게이트웨이 ping, ARP 테이블', 'ping, ip neigh'] },
    { cells: ['3', '원격 도달성', '목적지 ping, 경로 추적', 'ping, traceroute, mtr'] },
    { cells: ['4', 'DNS', '이름 해석 정상 여부', 'dig, nslookup'] },
    { cells: ['5', 'TCP 연결', 'handshake 성공 여부', 'telnet, curl, ss'] },
    { cells: ['6', '응용 계층', 'HTTP 상태, TLS, 애플리케이션 로그', 'curl -v, openssl s_client'] },
]

const icmpTypeRows = [
    { cells: ['0', 'Echo Reply', 'ping 응답'] },
    { cells: ['3', 'Destination Unreachable', '목적지 도달 불가 (code로 세분화)'] },
    { cells: ['5', 'Redirect', '더 나은 경로 안내'] },
    { cells: ['8', 'Echo Request', 'ping 요청'] },
    { cells: ['11', 'Time Exceeded', 'TTL 초과 (traceroute 원리)'] },
]

const icmpUnreachCodes = [
    { cells: ['Code 0', 'Network Unreachable', '라우팅 테이블에 경로 없음'] },
    { cells: ['Code 1', 'Host Unreachable', '호스트에 도달할 수 없음 (ARP 실패 등)'] },
    { cells: ['Code 3', 'Port Unreachable', 'UDP 포트에 리스닝 프로세스 없음'] },
    { cells: ['Code 4', 'Fragmentation Needed', 'DF 비트인데 MTU 초과 (PMTU)'] },
    { cells: ['Code 13', 'Comm. Admin Prohibited', '방화벽/ACL에 의해 차단'] },
]

const tcpFlagRows = [
    { cells: ['SYN', 'S', '연결 시작 요청', '3-way handshake 첫 단계'] },
    { cells: ['ACK', '.', '확인 응답', '거의 모든 패킷에 포함'] },
    { cells: ['SYN+ACK', 'S.', '연결 수락', '서버가 SYN에 응답'] },
    { cells: ['FIN', 'F', '정상 연결 종료', '4-way handshake'] },
    { cells: ['RST', 'R', '연결 강제 종료', '포트 닫힘, 방화벽 차단 등'] },
    { cells: ['PSH', 'P', '즉시 전달 요청', '버퍼 대기 없이 애플리케이션에 전달'] },
    { cells: ['URG', 'U', '긴급 데이터', '드물게 사용'] },
]

const rstCauseRows = [
    { cells: ['포트 닫힘', '대상 포트에 리스닝 프로세스가 없음', '서비스 미가동'] },
    { cells: ['방화벽 REJECT', '방화벽이 RST로 거부 응답', 'iptables -j REJECT --reject-with tcp-reset'] },
    { cells: ['conntrack 만료', 'NAT 장비의 세션 테이블에서 삭제됨', '긴 유휴 연결'] },
    { cells: ['TCP 스택 이상', '잘못된 seq/ack, 비정상 상태', '커널 버그, 중간 장비 문제'] },
]

const dnsFailureRows = [
    { cells: ['SERVFAIL', 'DNS 서버 내부 오류', '재귀 질의 실패, upstream 장애'] },
    { cells: ['NXDOMAIN', '도메인 존재하지 않음', '오타, 도메인 만료, DNS 설정 오류'] },
    { cells: ['REFUSED', 'DNS 서버가 질의 거부', '허용되지 않은 클라이언트'] },
    { cells: ['timeout', '응답 없음', 'DNS 서버 장애, 방화벽 UDP 53 차단'] },
]

const handshakeFailRows = [
    { cells: ['SYN → timeout', 'SYN 패킷 유실', '방화벽 DROP, 라우팅 문제, 서버 다운'] },
    { cells: ['SYN → RST', '즉시 거부', '포트 닫힘, 방화벽 REJECT'] },
    { cells: ['SYN → SYN-ACK → timeout', 'ACK 유실', '비대칭 라우팅, 중간 장비 문제'] },
    { cells: ['ESTABLISHED → RST', '연결 중 리셋', 'conntrack 만료, 방화벽 정책 변경'] },
    { cells: ['재전송 반복', 'ACK 미수신', '패킷 유실, 네트워크 혼잡, MTU 문제'] },
]

const mtuScenarioRows = [
    { cells: ['VPN/터널', 'GRE: 1476, IPSec: ~1400', '터널 헤더가 추가되어 유효 MTU 감소'] },
    { cells: ['PPPoE', '1492', 'PPPoE 헤더 8바이트'] },
    { cells: ['VXLAN', '1450', 'VXLAN 헤더 50바이트'] },
    { cells: ['Docker overlay', '1450', 'VXLAN 기반 오버레이'] },
    { cells: ['Jumbo Frame', '9000', '데이터센터 내부 고성능 전송'] },
]

const diagToolRows = [
    { cells: ['소켓 상태', 'ss -tnp', '연결 상태, 프로세스 매핑'] },
    { cells: ['라우팅 경로', 'ip route get <IP>', '실제 사용 경로, PMTU'] },
    { cells: ['ARP/Neighbor', 'ip neigh show', 'L2 도달성, MAC 주소 확인'] },
    { cells: ['인터페이스 통계', 'ip -s link show', '드롭, 에러 카운터'] },
    { cells: ['커널 로그', 'dmesg | grep -i net', 'conntrack full, OOM 등'] },
    { cells: ['conntrack', 'conntrack -L', 'NAT 세션 테이블'] },
    { cells: ['패킷 캡처', 'tcpdump -i eth0', '실제 패킷 흐름 확인'] },
    { cells: ['방화벽 카운터', 'iptables -L -v -n', '규칙별 매치 카운트'] },
]

/* ── Component ────────────────────────────────────────────────────── */

export default function Topic11() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-14">
            {/* ── Header ─────────────────────────────────────────── */}
            <header className="space-y-3">
                <p className="text-xs font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                    Topic 11
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    네트워크 장애 분석과 관측
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    Network Troubleshooting & Observability
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    네트워크 장애가 발생했을 때 원인을 체계적으로 분석하는 방법을 학습합니다.
                    ping, traceroute, tcpdump 등의 도구 사용법부터 TCP 플래그 해석,
                    DNS/TCP/MTU 장애 구분, 그리고 패킷-소켓-라우팅-커널 로그를 연결하는 통합 분석 절차를 다룹니다.
                </p>
            </header>

            <LearningCard
                topicId="11-troubleshooting"
                items={[
                    'tcpdump로 패킷 캡처 및 분석을 수행할 수 있다',
                    '장애 원인을 DNS/TCP/TLS 단계별로 구분할 수 있다',
                    '체계적 장애 분석 절차를 설명할 수 있다',
                ]}
            />

            {/* ── 11.1 장애 분석 기본 절차 ───────────────────────── */}
            <Section id="s111" title="11.1  장애 분석 기본 절차">
                <Prose>
                    네트워크 장애 분석에서 가장 중요한 것은 <strong>체계적 접근</strong>입니다.
                    "안 된다"라는 증상만으로 원인을 추측하면 시간을 낭비하게 됩니다.
                    OSI/TCP-IP 계층 모델을 기반으로 <strong>아래에서 위로(Bottom-Up)</strong> 또는
                    <strong> 위에서 아래로(Top-Down)</strong> 순서대로 확인하는 것이 핵심입니다.
                </Prose>

                <InfoBox color="blue" title="Bottom-Up 접근법 (권장)">
                    물리 계층부터 시작하여 한 단계씩 올라가며 확인합니다.
                    각 단계가 정상이면 다음 단계로 넘어가고, 비정상이면 해당 계층에서 원인을 분석합니다.
                    이 방법은 하위 계층 문제가 상위 계층 증상으로 나타나는 것을 놓치지 않습니다.
                </InfoBox>

                <InfoTable
                    headers={['단계', '확인 대상', '확인 내용', '주요 도구']}
                    rows={troubleshootSteps}
                />

                <TroubleshootFlowDiagram />

                <Alert variant="tip" title="핵심 원칙:">
                    한 번에 하나의 변수만 변경하고, 변경 전 상태를 기록해 두세요.
                    여러 설정을 동시에 바꾸면 어떤 변경이 효과가 있었는지 알 수 없습니다.
                </Alert>
            </Section>

            {/* ── 11.2 ping과 ICMP ───────────────────────────────── */}
            <Section id="s112" title="11.2  ping과 ICMP">
                <Prose>
                    <InlineCode>ping</InlineCode>은
                    가장 기본적인 네트워크 진단 도구입니다. ICMP Echo Request를 보내고 Echo Reply를 받아
                    대상까지의 도달성(reachability)과 왕복 시간(RTT)을 확인합니다.
                </Prose>

                <CardGrid cols={3}>
                    <StatCard title="RTT (Round Trip Time)" value="< 1ms" color="green" desc="같은 LAN 내" />
                    <StatCard title="RTT" value="1~50ms" color="amber" desc="같은 도시/국가 내" />
                    <StatCard title="RTT" value="100~300ms" color="red" desc="대륙 간 (한국↔미국)" />
                </CardGrid>

                <CodeBlock code={pingCode} language="bash" filename="ping 사용법" />

                <InfoBox color="cyan" title="ICMP 메시지 타입">
                    ping은 ICMP 프로토콜을 사용합니다. ICMP는 IP 계층의 오류 보고 및 진단 프로토콜로,
                    다양한 타입의 메시지를 통해 네트워크 상태 정보를 전달합니다.
                </InfoBox>

                <InfoTable
                    headers={['타입', '이름', '설명']}
                    rows={icmpTypeRows}
                />

                <Prose>
                    ping이 실패하면 반환되는 ICMP Destination Unreachable 메시지의 code를 확인합니다.
                    각 code는 실패 원인에 대한 구체적인 정보를 제공합니다.
                </Prose>

                <InfoTable
                    headers={['Code', '의미', '주요 원인']}
                    rows={icmpUnreachCodes}
                />

                <Alert variant="warning" title="주의:">
                    ping이 성공해도 TCP/UDP 서비스가 정상이라는 보장은 없습니다.
                    반대로 ping이 실패해도 서비스가 동작할 수 있습니다 (방화벽이 ICMP만 차단하는 경우).
                    ping은 IP 계층 도달성만 확인하는 도구입니다.
                </Alert>
            </Section>

            {/* ── 11.3 traceroute와 mtr ──────────────────────────── */}
            <Section id="s113" title="11.3  traceroute와 mtr">
                <Prose>
                    <InlineCode>traceroute</InlineCode>는
                    TTL을 1부터 증가시키며 패킷을 보내, 경로 상의 각 라우터(홉)를 식별합니다.
                    각 홉에서 반환하는 ICMP Time Exceeded 메시지를 이용하여 경로를 추적합니다.
                </Prose>

                <InfoBox color="purple" title="traceroute 동작 원리">
                    TTL=1 패킷 전송 → 첫 번째 라우터가 TTL 초과로 ICMP 응답 →
                    TTL=2 패킷 전송 → 두 번째 라우터 응답 → ... →
                    목적지 도달 시 ICMP Echo Reply 또는 Port Unreachable 응답.
                    각 홉에서 3개의 패킷을 보내 RTT를 측정합니다.
                </InfoBox>

                <CodeBlock code={tracerouteCode} language="bash" filename="traceroute 사용법" />

                <Prose>
                    <InlineCode>mtr</InlineCode>은
                    ping과 traceroute를 결합한 도구입니다. 지속적으로 패킷을 보내며 각 홉의
                    패킷 유실률(Loss%), 지터(StDev), 평균 RTT를 실시간으로 보여줍니다.
                    간헐적인 네트워크 문제를 진단할 때 특히 유용합니다.
                </Prose>

                <CodeBlock code={mtrCode} language="bash" filename="mtr 사용법과 해석" />

                <Alert variant="info" title="mtr 해석 팁:">
                    특정 홉에서만 Loss%가 높고 그 이후 홉에서는 정상이면,
                    해당 라우터가 ICMP rate-limiting을 하는 것일 수 있습니다 (실제 유실이 아님).
                    마지막 홉(목적지)의 Loss%가 중요합니다.
                </Alert>
            </Section>

            {/* ── 11.4 tcpdump 기초 ──────────────────────────────── */}
            <Section id="s114" title="11.4  tcpdump 기초">
                <Prose>
                    <InlineCode>tcpdump</InlineCode>는
                    리눅스에서 가장 많이 사용되는 패킷 캡처 도구입니다.
                    네트워크 인터페이스를 흐르는 패킷을 실시간으로 캡처하여
                    프로토콜, 주소, 포트, 플래그 등을 확인할 수 있습니다.
                </Prose>

                <InfoBox color="green" title="tcpdump vs Wireshark">
                    tcpdump는 CLI 기반으로 서버에서 직접 캡처할 때 사용합니다.
                    Wireshark는 GUI 기반으로 캡처된 pcap 파일을 분석할 때 사용합니다.
                    일반적으로 tcpdump로 캡처 → pcap 저장 → Wireshark로 분석하는 워크플로를 따릅니다.
                </InfoBox>

                <CodeBlock code={tcpdumpBasicCode} language="bash" filename="tcpdump 기본 필터" />

                <InfoTable
                    headers={['필터 표현식', '설명']}
                    rows={[
                        { cells: ['host 10.0.0.5', '출발지 또는 목적지가 10.0.0.5'] },
                        { cells: ['src host 10.0.0.5', '출발지가 10.0.0.5'] },
                        { cells: ['dst host 10.0.0.5', '목적지가 10.0.0.5'] },
                        { cells: ['port 443', '출발지 또는 목적지 포트가 443'] },
                        { cells: ['portrange 8000-9000', '포트 범위 지정'] },
                        { cells: ['net 192.168.1.0/24', '서브넷 단위 필터'] },
                        { cells: ['tcp / udp / icmp', '프로토콜 필터'] },
                        { cells: ['and / or / not', '논리 연산자 조합'] },
                    ]}
                />

                <Alert variant="tip" title="실무 팁:">
                    프로덕션 서버에서 tcpdump를 사용할 때는 반드시{' '}
                    <InlineCode>-c</InlineCode> 옵션으로
                    패킷 수를 제한하고, 구체적인 필터를 지정하세요. 무제한 캡처는 디스크와 CPU 자원을 소모합니다.
                </Alert>
            </Section>

            {/* ── 11.5 TCP 플래그 읽기 ───────────────────────────── */}
            <Section id="s115" title="11.5  TCP 플래그 읽기">
                <Prose>
                    tcpdump 출력에서 TCP 플래그를 읽는 것은 장애 분석의 핵심 기술입니다.
                    각 플래그는 연결의 상태 변화를 나타내며,
                    비정상적인 플래그 조합으로 장애 원인을 추론할 수 있습니다.
                </Prose>

                <InfoTable
                    headers={['플래그', 'tcpdump 표기', '의미', '사용 맥락']}
                    rows={tcpFlagRows}
                />

                <CodeBlock code={tcpdumpFlagCode} language="bash" filename="TCP 플래그 캡처와 해석" />

                <InfoBox color="red" title="RST(Reset) 패킷의 의미">
                    RST는 "이 연결을 즉시 종료한다"는 의미입니다.
                    정상적인 종료(FIN)와 달리 비정상 상황에서 발생하며,
                    장애 분석에서 RST의 발생 원인을 파악하는 것이 중요합니다.
                </InfoBox>

                <InfoTable
                    headers={['RST 원인', '설명', '대표적 상황']}
                    rows={rstCauseRows}
                />

                <Prose>
                    정상적인 TCP 통신의 패턴을 알면 비정상 패턴을 즉시 식별할 수 있습니다.
                </Prose>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InfoBox color="green" title="정상 패턴">
                        SYN → SYN+ACK → ACK → (데이터 교환 PSH+ACK) → FIN+ACK → ACK → FIN+ACK → ACK.
                        모든 패킷에 대해 적절한 응답이 돌아옵니다.
                    </InfoBox>
                    <InfoBox color="red" title="비정상 패턴">
                        SYN → (무응답, 재전송 반복) = 방화벽 DROP 또는 서버 다운.
                        SYN → RST = 포트 닫힘.
                        ESTAB 상태에서 갑자기 RST = 중간 장비 문제.
                    </InfoBox>
                </div>
            </Section>

            {/* ── 11.6 DNS 장애 분석 ─────────────────────────────── */}
            <Section id="s116" title="11.6  DNS 장애 분석">
                <Prose>
                    "사이트 접속이 안 된다"는 신고의 상당수가 DNS 문제입니다.
                    DNS 장애는 TCP 연결 시도 자체가 발생하지 않으므로,
                    DNS 확인을 TCP 확인보다 먼저 수행해야 합니다.
                </Prose>

                <InfoTable
                    headers={['응답 코드', '의미', '주요 원인']}
                    rows={dnsFailureRows}
                />

                <CodeBlock code={dnsDebugCode} language="bash" filename="DNS 장애 진단 명령어" />

                <InfoBox color="amber" title="DNS vs TCP 장애 구분법">
                    IP 주소로 직접 접속을 시도합니다. IP로는 접속되는데 도메인으로는 안 되면 DNS 문제입니다.
                    둘 다 안 되면 네트워크 또는 서버 문제입니다.
                </InfoBox>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InfoBox color="blue" title="DNS 장애 체크리스트">
                        1. /etc/resolv.conf의 nameserver 확인{'\n'}
                        2. 지정된 DNS 서버에 dig로 질의{'\n'}
                        3. 다른 DNS 서버(8.8.8.8)로 질의하여 비교{'\n'}
                        4. DNS 서버까지 UDP 53 포트 도달성 확인{'\n'}
                        5. 로컬 DNS 캐시 확인/초기화
                    </InfoBox>
                    <InfoBox color="purple" title="흔한 DNS 장애 원인">
                        - DNS 서버 프로세스 다운{'\n'}
                        - 방화벽이 UDP 53 차단{'\n'}
                        - DNS 서버 과부하 (응답 지연){'\n'}
                        - 잘못된 resolv.conf 설정{'\n'}
                        - 도메인 레코드 TTL 만료 후 propagation 지연
                    </InfoBox>
                </div>

                <Alert variant="danger" title="DNS 장애 시 주의:">
                    DNS 캐시 때문에 장애가 지연되어 나타날 수 있습니다.
                    TTL이 남아있는 동안은 캐시된 결과를 사용하므로 문제가 없다가,
                    TTL 만료 후 갑자기 장애가 발생하는 패턴이 흔합니다.
                </Alert>
            </Section>

            {/* ── 11.7 TCP 연결 장애 분석 ────────────────────────── */}
            <Section id="s117" title="11.7  TCP 연결 장애 분석">
                <Prose>
                    DNS가 정상인데 접속이 안 되면 TCP 연결 단계를 분석합니다.
                    TCP 3-way handshake의 어느 단계에서 실패하는지,
                    연결 후 데이터 교환 중 문제가 발생하는지를 tcpdump와 ss로 확인합니다.
                </Prose>

                <InfoTable
                    headers={['패턴', '증상', '가능한 원인']}
                    rows={handshakeFailRows}
                />

                <CodeBlock code={tcpDebugCode} language="bash" filename="TCP 연결 장애 진단" />

                <CardGrid cols={2}>
                    <StatCard title="TCP 기본 재전송 횟수" value="6회" color="amber"
                        desc="net.ipv4.tcp_syn_retries (SYN 재전송)" />
                    <StatCard title="재전송 간격" value="1s → 2s → 4s" color="red"
                        desc="지수적 백오프 (exponential backoff)" />
                </CardGrid>

                <InfoBox color="orange" title="timeout vs RST 구분">
                    timeout(SYN 보냈는데 아무 응답 없음)은 패킷이 어딘가에서 DROP되었음을 의미합니다.
                    방화벽 DROP 정책, 라우팅 문제, 서버 다운이 원인입니다.
                    RST 수신은 상대방(또는 중간 장비)이 명시적으로 거부한 것이므로 원인 추적이 더 쉽습니다.
                </InfoBox>

                <Alert variant="tip" title="실무 패턴:">
                    SYN-SENT 상태의 소켓이 많으면 목적지 도달 불가를 의미합니다.
                    CLOSE-WAIT가 많으면 애플리케이션이 소켓을 제대로 닫지 않는 코드 문제입니다.
                    TIME-WAIT가 과다하면 짧은 연결이 빈번한 아키텍처 문제입니다.
                </Alert>
            </Section>

            {/* ── 11.8 MTU / PMTU 문제 ──────────────────────────── */}
            <Section id="s118" title="11.8  MTU / PMTU 문제">
                <Prose>
                    MTU(Maximum Transmission Unit)는 한 번에 전송할 수 있는 최대 패킷 크기입니다.
                    경로상 MTU가 다른 구간이 있으면 패킷이 분할(fragmentation)되거나 폐기됩니다.
                    특히 DF(Don't Fragment) 비트가 설정된 패킷은 MTU를 초과하면 폐기되며,
                    ICMP "Fragmentation Needed" 메시지가 반환됩니다.
                </Prose>

                <InfoBox color="amber" title="PMTU Discovery">
                    Path MTU Discovery는 DF 비트를 설정하여 패킷을 보내고,
                    ICMP 응답을 통해 경로상 최소 MTU를 자동으로 발견하는 메커니즘입니다.
                    중간 장비가 ICMP를 차단하면 PMTU Discovery가 실패하여 "블랙홀" 현상이 발생합니다.
                    이 경우 작은 패킷은 되는데 큰 패킷(TLS handshake 등)만 실패합니다.
                </InfoBox>

                <CodeBlock code={mtuDebugCode} language="bash" filename="MTU / PMTU 진단" />

                <InfoTable
                    headers={['환경', 'MTU 값', '설명']}
                    rows={mtuScenarioRows}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InfoBox color="red" title="MTU 블랙홀 증상">
                        - ping은 되는데 HTTP/HTTPS 접속 실패{'\n'}
                        - SSH는 되는데 SCP/SFTP 전송 중 멈춤{'\n'}
                        - 작은 요청은 되는데 큰 응답 수신 실패{'\n'}
                        - TLS handshake에서 멈춤 (Certificate 메시지가 큼)
                    </InfoBox>
                    <InfoBox color="green" title="MTU 문제 해결법">
                        1. 인터페이스 MTU를 경로상 최소값으로 조정{'\n'}
                        2. MSS clamping 적용 (TCP MSS = MTU - 40){'\n'}
                        3. 중간 장비에서 ICMP 허용{'\n'}
                        4. TCP MSS 값을 명시적으로 설정
                    </InfoBox>
                </div>

                <Alert variant="warning" title="자주 놓치는 포인트:">
                    VPN이나 컨테이너 환경에서 MTU 문제가 특히 잘 발생합니다.
                    터널/오버레이 헤더가 추가되면서 유효 MTU가 줄어들지만,
                    엔드포인트의 MTU 설정은 그대로이기 때문입니다.
                </Alert>
            </Section>

            {/* ── 11.9 체계적 장애 분석 절차 ─────────────────────── */}
            <Section id="s119" title="11.9  체계적 장애 분석 절차">
                <Prose>
                    실제 장애 상황에서는 패킷 캡처, 소켓 상태, 라우팅 테이블, 커널 로그를
                    종합적으로 확인해야 합니다. 하나의 도구만으로는 전체 그림을 볼 수 없으며,
                    여러 관점의 데이터를 교차 확인하는 것이 핵심입니다.
                </Prose>

                <InfoTable
                    headers={['관점', '명령어', '확인 내용']}
                    rows={diagToolRows}
                />

                <CodeBlock code={ssSocketCode} language="bash" filename="통합 진단: 소켓 + 라우팅 + 패킷 + 커널 로그" />

                <CodeBlock code={dmesgNetCode} language="bash" filename="커널 로그로 네트워크 문제 확인" />

                <InfoBox color="indigo" title="장애 분석 보고서 작성 요령">
                    1. 장애 발생 시각과 영향 범위를 기록합니다{'\n'}
                    2. 확인한 각 계층의 상태를 정리합니다 (L1~L7){'\n'}
                    3. 정상인 구간과 비정상인 구간을 명확히 구분합니다{'\n'}
                    4. 원인과 근거 (로그, 패킷 덤프)를 첨부합니다{'\n'}
                    5. 조치 사항과 재발 방지 대책을 기록합니다
                </InfoBox>

                <CardGrid cols={3}>
                    <InfoBox color="blue" title="NAT 문제 패턴">
                        - conntrack table full 로그{'\n'}
                        - 간헐적 연결 실패{'\n'}
                        - 특정 출발지만 문제{'\n'}
                        - ss에서 정상이지만 실제 통신 불가
                    </InfoBox>
                    <InfoBox color="purple" title="방화벽 문제 패턴">
                        - SYN 보냈으나 응답 없음 (DROP){'\n'}
                        - SYN에 RST 응답 (REJECT){'\n'}
                        - iptables 카운터 증가 확인{'\n'}
                        - 특정 포트/IP만 차단
                    </InfoBox>
                    <InfoBox color="amber" title="라우팅 문제 패턴">
                        - 비대칭 라우팅 (SYN-ACK 다른 경로){'\n'}
                        - 블랙홀 라우트{'\n'}
                        - 잘못된 기본 게이트웨이{'\n'}
                        - Policy routing 충돌
                    </InfoBox>
                </CardGrid>

                <Alert variant="info" title="핵심:">
                    커널 로그(dmesg)와 애플리케이션 로그를 연결하는 것이 중요합니다.
                    예를 들어, 애플리케이션에서 "connection timeout" 에러가 발생할 때
                    dmesg에 "nf_conntrack: table full"이 있으면
                    conntrack 테이블 포화가 근본 원인입니다.
                </Alert>
            </Section>

            {/* ── 11.10 요약 ─────────────────────────────────────── */}
            <Section id="s1110" title="11.10  요약">
                <CardGrid cols={2}>
                    <InfoBox color="blue" title="진단 도구">
                        - <strong>ping</strong>: ICMP 기반 도달성 확인{'\n'}
                        - <strong>traceroute/mtr</strong>: 경로 추적, 구간별 유실/지연{'\n'}
                        - <strong>tcpdump</strong>: 패킷 캡처, TCP 플래그 분석{'\n'}
                        - <strong>ss</strong>: 소켓 상태, 프로세스 매핑{'\n'}
                        - <strong>dig</strong>: DNS 질의 테스트
                    </InfoBox>
                    <InfoBox color="green" title="장애 구분법">
                        - <strong>DNS 장애</strong>: IP로는 접속, 도메인으로는 불가{'\n'}
                        - <strong>TCP 장애</strong>: SYN timeout, RST, retransmission{'\n'}
                        - <strong>MTU 문제</strong>: 작은 패킷 OK, 큰 패킷 실패{'\n'}
                        - <strong>방화벽</strong>: DROP(timeout) vs REJECT(RST){'\n'}
                        - <strong>NAT</strong>: conntrack full, 간헐적 실패
                    </InfoBox>
                </CardGrid>

                <InfoBox color="gray" title="장애 분석의 핵심 원칙">
                    1. 체계적으로 접근한다 (Bottom-Up 계층별 확인){'\n'}
                    2. 한 번에 하나의 변수만 변경한다{'\n'}
                    3. 여러 관점의 데이터를 교차 확인한다 (패킷 + 소켓 + 라우팅 + 커널 로그){'\n'}
                    4. 정상/비정상 구간을 명확히 구분한다{'\n'}
                    5. 변경 전 상태를 기록하고, 조치 결과를 문서화한다
                </InfoBox>

                <Alert variant="tip" title="다음 토픽 미리보기:">
                    Topic 12에서는 현대 네트워크 아키텍처를 다룹니다.
                    L4/L7 로드밸런서, CDN, 클라우드 네트워크, 컨테이너 네트워크, 서비스 메시 등
                    실전 인프라 구성에서 사용되는 기술을 학습합니다.
                </Alert>
            </Section>

            <TopicNavigation topicId="11-troubleshooting" />
        </div>
    )
}
