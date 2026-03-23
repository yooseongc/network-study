import { TrafficFlowDiagram } from '../../components/concepts/service/TrafficFlowDiagram'
import { EastWestNorthSouth } from '../../components/concepts/service/EastWestNorthSouth'
import { Alert, CardGrid, CodeBlock, InfoBox, InfoTable, LearningCard, Prose, Section, StatCard, T, TopicNavigation } from '@study-ui/components'
import {
    iptablesNatCode,
    nginxReverseProxyCode,
    haproxyConfigCode,
    keepalivedVrrpCode,
} from './codeSnippets'

/* ── inline data ──────────────────────────────────────────────── */

const endToEndSteps = [
    { cells: ['1', 'DNS 질의', 'Client', '도메인 → IP 주소 변환 (A/AAAA 레코드)'] },
    { cells: ['2', 'ARP 요청', 'Client → Switch', 'Gateway MAC 주소 확인'] },
    { cells: ['3', 'L2 포워딩', 'Access Switch', 'MAC 주소 테이블 기반 프레임 전달'] },
    { cells: ['4', 'L3 라우팅', 'Router', '목적지 IP 기반 Next Hop 결정'] },
    { cells: ['5', '방화벽 검사', 'Firewall', 'Stateful Inspection / ACL 정책 적용'] },
    { cells: ['6', '로드 밸런싱', 'Load Balancer', 'VIP → Real IP 변환 (DNAT)'] },
    { cells: ['7', '요청 처리', 'Web/WAS Server', 'HTTP 요청 처리 및 응답 생성'] },
    { cells: ['8', '역방향 경로', 'Server → Client', '응답 패킷은 역순으로 동일 경로 통과'] },
]

const threeColRows = [
    { cells: ['Web Server', '정적 콘텐츠 서빙, SSL 종료, 리버스 프록시', 'Nginx, Apache, IIS'] },
    { cells: ['WAS (App Server)', '비즈니스 로직 처리, 세션 관리, API 제공', 'Tomcat, Node.js, Django'] },
    { cells: ['Database', '데이터 영속성, 트랜잭션 처리, 쿼리 최적화', 'MySQL, PostgreSQL, Oracle'] },
]

const dmzRows = [
    { cells: ['DMZ', '외부 공개 서비스 (Web, Mail, DNS)', '외부+내부 방화벽 사이', '제한적 (인바운드 허용)'] },
    { cells: ['내부망', '업무 시스템 (WAS, DB, 파일서버)', '내부 방화벽 뒤', '엄격 (아웃바운드만)'] },
    { cells: ['관리망', '운영 도구 (모니터링, 배포, 로그)', '별도 VLAN / 서브넷', '최소 접근 (관리자만)'] },
]

const natTypeRows = [
    { cells: ['SNAT', '출발지 주소 변환', 'POSTROUTING', '내부 사용자 → 인터넷 접속'] },
    { cells: ['DNAT', '목적지 주소 변환', 'PREROUTING', '외부 → 내부 서버 접근 (포트포워딩)'] },
    { cells: ['Masquerade', 'SNAT + 동적 IP', 'POSTROUTING', 'DHCP 환경 (가정용 공유기)'] },
    { cells: ['PAT (NAPT)', 'IP + Port 변환', 'POSTROUTING', '하나의 공인 IP로 다수 내부 호스트'] },
]

const securityDeviceRows = [
    { cells: ['방화벽 (Firewall)', 'L3-L4 접근 제어', 'Inline', '네트워크 경계 (Border)'] },
    { cells: ['IPS/IDS', '침입 탐지/차단', 'Inline (IPS) / Mirror (IDS)', '방화벽 뒤, 코어 스위치 앞'] },
    { cells: ['WAF', '웹 애플리케이션 공격 차단', 'Inline / Reverse Proxy', '로드밸런서 앞 또는 뒤'] },
    { cells: ['SWG (Secure Web GW)', '웹 접속 통제/검사', 'Proxy 모드', '사용자 인터넷 접속 경로'] },
    { cells: ['Proxy Server', '대리 접속, 캐싱, 로깅', 'Out-of-Path (명시적/투명)', '사용자 ~ 인터넷 사이'] },
    { cells: ['DLP', '데이터 유출 방지', 'Inline / Agent', '아웃바운드 경로'] },
]

const haCompareRows = [
    { cells: ['Active-Standby', '1대 가동 + 1대 대기', '단순, 리소스 낭비', 'VRRP, DB Primary-Standby'] },
    { cells: ['Active-Active', '모든 노드 가동', '성능 극대화, 복잡', 'LB 클러스터, DB 멀티마스터'] },
    { cells: ['N+1 Redundancy', 'N대 가동 + 1대 예비', '비용 효율적', '서버 팜, 스위치 스택'] },
    { cells: ['N+M Redundancy', 'N대 가동 + M대 예비', '대규모 환경', '클라우드 인프라'] },
]

export default function Topic08ServiceFlow() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-14">
            <header className="space-y-3">
                <p className="text-xs font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                    Topic 08
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    실제 서비스 망 설계와 트래픽 흐름
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    Service Network Design & Traffic Flow
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    사용자의 요청이 실제로 어떤 장비를 거쳐 서버에 도달하는지, 망 설계의 핵심 원칙과
                    NAT, 로드 밸런서, 보안장비의 역할을 단계별로 학습합니다.
                </p>
            </header>

            <LearningCard
                topicId="08-service-flow"
                items={[
                    '사용자 요청의 End-to-End 경로를 장비 단위로 추적할 수 있다',
                    'DMZ, 내부망, 관리망의 분리 이유를 설명할 수 있다',
                    'NAT(SNAT/DNAT) 적용 위치와 동작 원리를 이해한다',
                    'East-West / North-South 트래픽 패턴을 구분할 수 있다',
                    '고가용성(HA) 구성의 기본 패턴을 파악한다',
                ]}
            />

            {/* ── 8.1 ─────────────────────────────────────────────── */}
            <Section id="s081" title="8.1  사용자 요청의 전체 경로">
                <Prose>
                    웹 브라우저에서 URL을 입력하면, 패킷은 여러 네트워크 장비를 순차적으로 통과합니다.
                    각 장비는 고유한 역할을 수행하며, 패킷의 헤더 정보가 단계마다 변환됩니다.
                </Prose>

                <TrafficFlowDiagram />

                <InfoTable
                    headers={['단계', '동작', '처리 장비', '설명']}
                    rows={endToEndSteps}
                />

                <Alert variant="tip" title="핵심 포인트">
                    요청 패킷과 응답 패킷은 동일한 경로를 역순으로 통과합니다. 방화벽의 Stateful Inspection은
                    요청 시 생성된 세션 테이블을 기반으로 응답 패킷을 자동 허용합니다.
                </Alert>

                <InfoBox color="blue" title="패킷 헤더 변환 과정">
                    Client에서 출발한 패킷의 Source MAC은 매 홉(hop)마다 변경되지만,
                    Source IP는 NAT 장비를 만나기 전까지 유지됩니다.
                    Load Balancer에서 DNAT가 적용되면 Destination IP가 VIP에서 실제 서버 IP로 변경됩니다.
                </InfoBox>
            </Section>

            {/* ── 8.2 ─────────────────────────────────────────────── */}
            <Section id="s082" title="8.2  사내 인터넷 접속망 구조">
                <Prose>
                    기업 네트워크에서 사내 사용자가 인터넷에 접속하는 경로는 보안과 관리 효율을 위해
                    여러 단계의 장비를 거칩니다. 일반적인 구조는 다음과 같습니다.
                </Prose>

                <InfoBox color="cyan" title="사내 인터넷 접속 경로">
                    사용자 PC → Access Switch → Distribution Switch → Core Switch →
                    Proxy/SWG → Firewall → Router → ISP → Internet
                </InfoBox>

                <CardGrid cols={2}>
                    <StatCard title="Proxy Server" value="캐싱 + 필터링" color="blue" desc="웹 트래픽 캐싱, URL 필터링, 악성 사이트 차단" />
                    <StatCard title="SWG" value="SSL 검사" color="amber" desc="Secure Web Gateway: HTTPS 복호화 후 콘텐츠 검사" />
                    <StatCard title="NAT Gateway" value="IP 변환" color="green" desc="내부 사설 IP → 공인 IP 변환 (SNAT/Masquerade)" />
                    <StatCard title="DNS Resolver" value="내부 DNS" color="purple" desc="내부 도메인 해석 + 외부 DNS 포워딩, 보안 필터링" />
                </CardGrid>

                <Alert variant="info" title="투명 프록시 vs 명시적 프록시">
                    명시적 프록시는 클라이언트가 프록시 설정을 직접 지정합니다 (PAC 파일 또는 수동 설정).
                    투명 프록시(Transparent Proxy)는 클라이언트 설정 없이 네트워크 장비가
                    트래픽을 자동으로 프록시로 리다이렉트합니다 (WCCP, Policy Routing 등).
                </Alert>

                <Prose>
                    대부분의 기업은 보안 정책에 따라 인터넷 직접 접속을 차단하고,
                    프록시 또는 SWG를 경유하도록 강제합니다. 이를 통해 사용자 접속 로그를 남기고,
                    악성 사이트와 데이터 유출을 방지합니다.
                </Prose>
            </Section>

            {/* ── 8.3 ─────────────────────────────────────────────── */}
            <Section id="s083" title="8.3  서버 인프라 분리 (Web / WAS / DB 3-Tier)">
                <Prose>
                    서비스 인프라는 역할별로 분리하여 보안, 확장성, 유지보수성을 높입니다.
                    가장 일반적인 구조는 3-Tier 아키텍처입니다.
                </Prose>

                <InfoTable headers={['계층', '역할', '대표 솔루션']} rows={threeColRows} />

                <InfoBox color="green" title="3-Tier 분리의 장점">
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        <li><strong>보안 격리:</strong> 각 계층을 별도 서브넷/VLAN에 배치하고 방화벽 정책으로 접근 제어</li>
                        <li><strong>독립 확장:</strong> Web만 Scale-Out, DB만 Scale-Up 등 계층별 독립 스케일링</li>
                        <li><strong>장애 격리:</strong> WAS 장애가 DB에 직접 영향을 주지 않도록 분리</li>
                        <li><strong>배포 독립성:</strong> Web/WAS/DB를 별도로 업데이트 가능</li>
                    </ul>
                </InfoBox>

                <Alert variant="warning" title="흔한 실수">
                    Web Server에서 DB로 직접 연결하는 구조는 보안 취약점을 만듭니다.
                    외부에 노출된 Web Server가 침해되면 DB까지 바로 접근할 수 있기 때문입니다.
                    반드시 WAS를 중간 계층으로 두어 접근을 제한해야 합니다.
                </Alert>

                <Prose>
                    방화벽 정책은 계층 간 허용되는 트래픽만 명시적으로 열어줍니다.
                    예를 들어, Web → WAS는 8080/tcp만 허용하고, WAS → DB는 3306/tcp(MySQL)만 허용합니다.
                    역방향(DB → Web)은 모두 차단합니다.
                </Prose>
            </Section>

            {/* ── 8.4 ─────────────────────────────────────────────── */}
            <Section id="s084" title="8.4  DMZ와 공개 서비스망">
                <Prose>
                    <T id="dmz">DMZ</T>(Demilitarized Zone)는 외부 인터넷과 내부 네트워크 사이에 위치한
                    완충 영역입니다. 외부에 공개해야 하는 서비스를 DMZ에 배치하여
                    내부 네트워크를 보호합니다.
                </Prose>

                <InfoTable headers={['영역', '배치 서비스', '위치', '접근 정책']} rows={dmzRows} />

                <InfoBox color="red" title="DMZ에 웹 서버를 두는 이유">
                    외부 사용자가 접근해야 하는 웹 서버는 반드시 DMZ에 배치합니다.
                    DMZ의 서버가 침해되더라도, 내부 방화벽이 내부망으로의 침투를 차단합니다.
                    이를 "Dual-Homed Firewall" 또는 "Screened Subnet" 구조라 합니다.
                </InfoBox>

                <CardGrid cols={3}>
                    <StatCard title="외부 방화벽" value="1st Gate" color="red" desc="인터넷 → DMZ 트래픽 필터링 (HTTP/HTTPS만 허용)" />
                    <StatCard title="DMZ" value="완충 영역" color="amber" desc="Web, Mail, DNS 등 공개 서비스 배치" />
                    <StatCard title="내부 방화벽" value="2nd Gate" color="green" desc="DMZ → 내부망 트래픽 엄격 제어 (최소 권한)" />
                </CardGrid>

                <Alert variant="tip" title="Zero Trust 시대의 DMZ">
                    클라우드와 원격 근무가 보편화되면서 전통적인 DMZ 경계가 흐려지고 있습니다.
                    Zero Trust 모델에서는 네트워크 위치가 아닌 "ID + 디바이스 상태 + 접근 정책"을
                    기반으로 접근을 제어합니다. 하지만 물리적 망 분리는 여전히 핵심 방어 계층입니다.
                </Alert>
            </Section>

            {/* ── 8.5 ─────────────────────────────────────────────── */}
            <Section id="s085" title="8.5  East-West vs North-South 트래픽">
                <Prose>
                    데이터센터 내 트래픽은 방향에 따라 두 가지로 분류됩니다.
                    이 분류는 네트워크 설계, 보안 정책, 성능 최적화에 직접적인 영향을 미칩니다.
                </Prose>

                <EastWestNorthSouth />

                <CardGrid cols={2}>
                    <InfoBox color="blue" title="North-South (남북) 트래픽">
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>클라이언트(외부) ↔ 서버(내부) 간 트래픽</li>
                            <li>데이터센터 경계를 넘는 트래픽</li>
                            <li>방화벽, IPS, LB를 통과</li>
                            <li>전통적 보안 장비의 주요 감시 대상</li>
                        </ul>
                    </InfoBox>
                    <InfoBox color="amber" title="East-West (동서) 트래픽">
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>서버 ↔ 서버 간 내부 트래픽</li>
                            <li>데이터센터 내부에서만 이동</li>
                            <li>마이크로서비스 간 API 호출, DB 쿼리</li>
                            <li>전체 트래픽의 70-80%를 차지 (현대 DC)</li>
                        </ul>
                    </InfoBox>
                </CardGrid>

                <Alert variant="warning" title="East-West 트래픽의 보안 맹점">
                    전통적 방화벽은 North-South 경계에 배치되므로, East-West 트래픽은 보안 검사 없이
                    이동할 수 있습니다. 내부 서버가 침해되면 횡방향 이동(Lateral Movement)으로
                    다른 서버로 확산됩니다. 마이크로세그멘테이션(Microsegmentation)이 이 문제의 해법입니다.
                </Alert>
            </Section>

            {/* ── 8.6 ─────────────────────────────────────────────── */}
            <Section id="s086" title="8.6  NAT 적용 위치와 동작">
                <Prose>
                    <T id="nat">NAT</T>(Network Address Translation)는 IP 주소를 변환하는 기술로,
                    사설 IP와 공인 IP 간의 변환에 핵심 역할을 합니다.
                    실제 서비스 망에서 NAT는 여러 위치에서 다양한 목적으로 사용됩니다.
                </Prose>

                <InfoTable headers={['유형', '설명', 'iptables Chain', '사용 사례']} rows={natTypeRows} />

                <CodeBlock code={iptablesNatCode} language="bash" filename="iptables NAT 규칙" />

                <InfoBox color="purple" title="NAT가 적용되는 위치">
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        <li><strong>인터넷 경계 (Border):</strong> SNAT/Masquerade로 내부 IP를 공인 IP로 변환</li>
                        <li><strong><T id="load-balancer">로드 밸런서</T>:</strong> DNAT로 VIP를 실제 서버 IP로 변환</li>
                        <li><strong>VPN Gateway:</strong> 터널 종단점에서 NAT 적용</li>
                        <li><strong>컨테이너 환경:</strong> Docker bridge 네트워크의 Masquerade</li>
                    </ul>
                </InfoBox>

                <Alert variant="info" title="conntrack과 NAT">
                    Linux 커널의 conntrack(Connection Tracking)은 NAT 세션을 추적합니다.
                    요청 패킷에 DNAT가 적용되면, 응답 패킷에는 자동으로 역변환(Reverse NAT)이 적용됩니다.
                    conntrack 테이블이 가득 차면 새 연결이 실패하므로, 대규모 환경에서는
                    nf_conntrack_max 값을 반드시 튜닝해야 합니다.
                </Alert>
            </Section>

            {/* ── 8.7 ─────────────────────────────────────────────── */}
            <Section id="s087" title="8.7  프록시 기반 트래픽 흐름">
                <Prose>
                    프록시 서버는 클라이언트와 서버 사이에서 요청을 중계하는 중간자 역할을 합니다.
                    Forward Proxy는 클라이언트를 대리하고, Reverse Proxy는 서버를 대리합니다.
                </Prose>

                <CardGrid cols={2}>
                    <InfoBox color="blue" title="Forward Proxy">
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>클라이언트 → <strong>Proxy</strong> → 서버</li>
                            <li>사용자 인터넷 접속 제어 (URL 필터링)</li>
                            <li>캐싱으로 대역폭 절약</li>
                            <li>사용자 익명화 (서버에 Proxy IP만 노출)</li>
                        </ul>
                    </InfoBox>
                    <InfoBox color="green" title="Reverse Proxy">
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>클라이언트 → <strong>Reverse Proxy</strong> → 백엔드</li>
                            <li>SSL Termination (인증서 중앙 관리)</li>
                            <li>로드 밸런싱 (Round Robin, Least Conn)</li>
                            <li>백엔드 서버 은닉 (클라이언트에 실제 IP 비노출)</li>
                        </ul>
                    </InfoBox>
                </CardGrid>

                <CodeBlock code={nginxReverseProxyCode} language="nginx" filename="nginx reverse proxy" />

                <Alert variant="tip" title="X-Forwarded-For 헤더">
                    프록시를 거치면 서버는 원래 클라이언트 IP를 알 수 없습니다.
                    X-Forwarded-For(XFF) 헤더를 통해 원본 IP를 전달합니다.
                    보안 장비는 이 헤더를 신뢰할지, 패킷의 실제 Source IP를 기준으로 할지
                    정책을 정해야 합니다. XFF는 위조 가능하므로 주의가 필요합니다.
                </Alert>
            </Section>

            {/* ── 8.8 ─────────────────────────────────────────────── */}
            <Section id="s088" title="8.8  보안장비 삽입 구조 (Inline vs Out-of-Path)">
                <Prose>
                    네트워크 보안장비는 트래픽 경로에 삽입하는 방식에 따라
                    Inline(인라인)과 Out-of-Path(우회) 방식으로 구분됩니다.
                    각 방식은 장단점이 명확하므로 장비의 역할에 맞게 선택해야 합니다.
                </Prose>

                <CardGrid cols={2}>
                    <InfoBox color="red" title="Inline (인라인) 모드">
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>트래픽 경로에 직접 삽입 (직렬 연결)</li>
                            <li>실시간 차단 가능 (IPS, Firewall)</li>
                            <li>장비 장애 시 트래픽 중단 위험</li>
                            <li>Bypass 모듈로 Fail-Open/Fail-Close 설정</li>
                        </ul>
                    </InfoBox>
                    <InfoBox color="cyan" title="Out-of-Path (우회) 모드">
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>트래픽 복사본을 받아 분석 (미러링/TAP)</li>
                            <li>차단 불가, 탐지/로깅만 가능 (IDS)</li>
                            <li>장비 장애가 서비스에 영향 없음</li>
                            <li>포렌식, 감사, 모니터링 용도</li>
                        </ul>
                    </InfoBox>
                </CardGrid>

                <InfoTable headers={['장비', '주요 기능', '삽입 방식', '배치 위치']} rows={securityDeviceRows} />

                <Alert variant="info" title="서비스 체이닝 (Service Chaining)">
                    여러 보안장비를 순차적으로 통과시키는 구조를 Service Chaining이라 합니다.
                    예: Firewall → IPS → WAF → Load Balancer → Server.
                    SDN/NFV 환경에서는 소프트웨어로 체이닝 순서를 동적으로 변경할 수 있습니다.
                </Alert>
            </Section>

            {/* ── 8.9 ─────────────────────────────────────────────── */}
            <Section id="s089" title="8.9  고가용성 설계 기초">
                <Prose>
                    서비스의 연속성을 보장하기 위해, 네트워크의 모든 단일 장애점(SPOF)을
                    이중화하는 것이 고가용성(HA) 설계의 핵심입니다.
                </Prose>

                <InfoTable headers={['구성 방식', '동작', '특징', '사용 사례']} rows={haCompareRows} />

                <CardGrid cols={2}>
                    <InfoBox color="blue" title="Active-Standby 구조">
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Master가 VIP를 보유하고 서비스 처리</li>
                            <li>VRRP/HSRP로 장애 감지 (Heartbeat)</li>
                            <li>Master 장애 시 Standby가 VIP 인계 (Failover)</li>
                            <li>전환 시간: 보통 1~3초</li>
                        </ul>
                    </InfoBox>
                    <InfoBox color="green" title="Active-Active 구조">
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>모든 노드가 동시에 트래픽 처리</li>
                            <li>로드 밸런서가 트래픽을 분산</li>
                            <li>세션 동기화 필요 (세션 클러스터링)</li>
                            <li>처리량이 노드 수에 비례하여 증가</li>
                        </ul>
                    </InfoBox>
                </CardGrid>

                <CodeBlock code={haproxyConfigCode} language="text" filename="HAProxy 로드 밸런서 설정" />
                <CodeBlock code={keepalivedVrrpCode} language="bash" filename="Keepalived VRRP 설정" />

                <Alert variant="warning" title="Failover의 함정: Split Brain">
                    Active-Standby 구성에서 두 노드가 서로를 장애로 판단하면
                    양쪽 모두 Master가 되는 Split Brain 상태가 발생합니다.
                    이를 방지하기 위해 Quorum(정족수) 기반 판단,
                    Fencing(격리) 메커니즘, 전용 Heartbeat 네트워크를 구성합니다.
                </Alert>
            </Section>

            {/* ── 8.10 ────────────────────────────────────────────── */}
            <Section id="s0810" title="8.10  요약">
                <Prose>
                    실제 서비스 네트워크는 단순한 "클라이언트 → 서버" 통신이 아니라,
                    수많은 장비와 정책이 개입하는 복잡한 시스템입니다.
                    각 장비의 역할과 배치 위치를 이해하는 것이 네트워크 설계의 기본입니다.
                </Prose>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <StatCard title="End-to-End" value="8단계" color="blue" desc="Client → Server 전체 경로" />
                    <StatCard title="DMZ" value="완충 영역" color="red" desc="외부-내부 분리의 핵심" />
                    <StatCard title="3-Tier" value="Web/WAS/DB" color="green" desc="계층 분리 아키텍처" />
                    <StatCard title="E-W 트래픽" value="70-80%" color="amber" desc="현대 DC 내부 트래픽 비율" />
                    <StatCard title="NAT" value="SNAT/DNAT" color="purple" desc="주소 변환의 두 방향" />
                    <StatCard title="HA" value="99.99%" color="cyan" desc="연간 다운타임 52분 이내" />
                </div>

                <Alert variant="tip" title="다음 단계">
                    이 토픽에서 배운 물리적/논리적 망 구조를 기반으로,
                    다음 토픽에서는 리눅스 커널의 네트워크 스택이 실제로 어떻게
                    패킷을 처리하는지 소프트웨어 관점에서 심층적으로 학습합니다.
                </Alert>
            </Section>

            <TopicNavigation topicId="08-service-flow" />
        </div>
    )
}
