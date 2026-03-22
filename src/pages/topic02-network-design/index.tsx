import { CardGrid } from '../../components/ui/CardGrid'
import { Section } from '../../components/ui/Section'
import { Prose } from '../../components/ui/Prose'
import { InfoBox } from '../../components/ui/InfoBox'
import { InfoTable } from '../../components/ui/InfoTable'
import { StatCard } from '../../components/ui/StatCard'
import { Alert } from '../../components/ui/Alert'
import { LearningCard } from '../../components/ui/LearningCard'
import { TopicNavigation } from '../../components/ui/TopicNavigation'
import { CodeBlock } from '../../components/viz/CodeBlock'
import { HomeVsEnterprise } from '../../components/concepts/topology/HomeVsEnterprise'
import { NetworkTiersDiagram } from '../../components/concepts/topology/NetworkTiersDiagram'
import {
    homeNetworkConfigCode,
    enterpriseSubnetCode,
    privateIpRangesCode,
    firewallRuleExample,
    keepalivedVrrpCode,
    lacpBondingCode,
    ospfBasicCode,
    switchVerifyCommandsCode,
    dualIspVrrpDiagramCode,
    serverFarmHaDiagramCode,
} from './codeSnippets'

/* ── 인라인 데이터 ─────────────────────────────────────────────────── */

const homeVsEnterpriseRows = [
    { cells: ['규모', '1대 공유기로 충분', '수백~수천 대 장비'] },
    { cells: ['IP 대역', '192.168.0.x/24', '10.x.x.x/8 (세분화)'] },
    { cells: ['장비 종류', '공유기(라우터+스위치+AP 통합)', '라우터, L3/L2 스위치, 방화벽 등 분리'] },
    { cells: ['보안', 'NAT + 간단한 방화벽', 'DMZ, IPS, WAF, 프록시 등 다층 보안'] },
    { cells: ['이중화', '없음 (단일 장애점)', '이중화/HA 구성 필수'] },
    { cells: ['관리', '웹 GUI 설정', '전문 NMS, CLI, 자동화 도구'] },
]

const deviceCompareRows = [
    { cells: ['라우터', 'L3', '서로 다른 네트워크 간 패킷 전달', '라우팅 테이블, NAT, ACL', 'ISP 연결, WAN 구간'] },
    { cells: ['L3 스위치', 'L3', 'VLAN 간 라우팅 + 고속 스위칭', 'VLAN, 라우팅, DHCP relay', '코어/배포 계층'] },
    { cells: ['L2 스위치', 'L2', '같은 네트워크 내 프레임 전달', 'MAC 테이블, VLAN, STP', '액세스 계층'] },
    { cells: ['L4/L7 로드밸런서', 'L4~L7', '트래픽 분산 및 서비스 가용성 확보', 'VIP, health check, session', 'DMZ/서버망 앞단'] },
    { cells: ['백본 라우터', 'L3', 'ISP 간 대용량 트래픽 라우팅', 'BGP, OSPF, 라인 카드', '코어/WAN 경계'] },
    { cells: ['방화벽', 'L3~L7', '트래픽 필터링 및 보안 정책 적용', 'stateful inspection, DPI, VPN', '네트워크 경계'] },
]

const tierRows = [
    { cells: ['코어(Core)', '전체 트래픽 집중 처리, 고속 백본', 'L3 스위치 (40G/100G)', '최소 2대 이중화'] },
    { cells: ['배포(Distribution)', '정책 적용, VLAN 간 라우팅, ACL', 'L3 스위치 (10G/40G)', '건물/층별 배치'] },
    { cells: ['액세스(Access)', '사용자/서버 직접 연결', 'L2 스위치 (1G/10G)', 'PoE, 포트 보안'] },
]

const securityDeviceRows = [
    { cells: ['방화벽(Firewall)', '인터넷 ↔ 내부 경계', 'L3/L4 트래픽 필터링', '모든 네트워크 필수'] },
    { cells: ['IPS/IDS', '방화벽 뒤, 코어 스위치 앞', '침입 탐지 및 차단', '인라인(IPS) / 미러(IDS)'] },
    { cells: ['WAF', 'DMZ 웹 서버 앞단', 'HTTP/HTTPS 공격 차단', 'SQL Injection, XSS 방어'] },
    { cells: ['프록시 서버', '사용자망 → 인터넷 경로', 'URL 필터링, 캐시, 로깅', '포워드/리버스 프록시'] },
    { cells: ['로드밸런서(LB)', 'DMZ 또는 서버망 앞단', '트래픽 분산, 헬스체크', 'L4(TCP) / L7(HTTP) 분산'] },
]

const redundancyRows = [
    { cells: ['Active-Standby', '하나가 활성, 하나가 대기', '구성 단순, 50% 자원 유휴', 'VRRP, HSRP'] },
    { cells: ['Active-Active', '양쪽 모두 활성, 트래픽 분산', '자원 효율 높음, 구성 복잡', 'ECMP, MC-LAG'] },
]

const l2SwitchFeatureRows = [
    { cells: ['MAC 테이블 학습', '수신 프레임의 출발지 MAC을 포트에 매핑', '자동 학습, aging time 300초'] },
    { cells: ['VLAN 분리', '포트 기반 또는 태그 기반으로 브로드캐스트 도메인 분리', '802.1Q 태깅'] },
    { cells: ['STP / RSTP', '루프 방지를 위한 스패닝 트리 프로토콜', 'STP: 30~50초, RSTP: 1~2초 수렴'] },
    { cells: ['포트 미러링', '특정 포트의 트래픽을 모니터링 포트로 복사', '패킷 캡처, IDS 연동'] },
    { cells: ['Storm Control', '브로드캐스트/멀티캐스트 폭풍 방지 (임계값 설정)', '% 또는 pps 기준'] },
    { cells: ['PoE (Power over Ethernet)', '이더넷 케이블로 전원 공급', 'IP폰, AP, IP카메라'] },
]

const l3SwitchVsRouterRows = [
    { cells: ['패킷 처리', 'ASIC 하드웨어 기반 (와이어스피드)', 'CPU 소프트웨어 기반'] },
    { cells: ['주 용도', '내부 VLAN 간 라우팅', 'WAN/ISP 연결, 외부 라우팅'] },
    { cells: ['WAN 인터페이스', '일반적으로 없음', 'Serial, T1/E1, SFP WAN'] },
    { cells: ['BGP 지원', '제한적 (일부 고급 모델)', '완전 지원 (full table)'] },
    { cells: ['NAT 지원', '제한적', '완전 지원'] },
    { cells: ['ACL 처리', 'TCAM 기반 고속 처리', 'CPU 기반'] },
    { cells: ['가격대', '중간 (포트 수 기준)', '높음 (WAN 기능 기준)'] },
]

const lbCompareRows = [
    { cells: ['L4 로드밸런서', 'TCP/UDP 헤더 기반 분산', 'IP + Port로 판단, 빠름', 'DSR 가능'] },
    { cells: ['L7 로드밸런서', 'HTTP 헤더/URL/쿠키 기반', '콘텐츠 기반 라우팅 가능', '암호화 종단 가능'] },
]

const firewallCompareRows = [
    { cells: ['UTM', '방화벽+IPS+VPN+안티바이러스 통합', '중소규모, 단일 장비로 관리', 'Fortinet FortiGate'] },
    { cells: ['NGFW', '앱 인식, 사용자 인식, 위협 인텔리전스', '대규모, 정밀한 보안 정책', 'Palo Alto PA, Check Point'] },
    { cells: ['Zone-based FW', '인터페이스를 보안 존으로 그룹핑', '존 간 정책으로 트래픽 제어', 'Cisco ZBF, Juniper SRX'] },
]

const bondModeRows = [
    { cells: ['mode 0 (balance-rr)', '라운드로빈', '스위치 설정 불필요', '패킷 순서 뒤바뀔 수 있음'] },
    { cells: ['mode 1 (active-backup)', '하나만 활성', '스위치 설정 불필요', '대역폭 50% 사용'] },
    { cells: ['mode 2 (balance-xor)', 'XOR 해시 분산', '스위치 static EtherChannel', '안정적 분산'] },
    { cells: ['mode 4 (802.3ad/LACP)', 'LACP 협상 기반', '스위치 LACP 필요 (권장)', '대역폭 집선, 표준'] },
]

const redundancyDetailRows = [
    { cells: ['이중 전원 (Dual PSU)', 'A/B 전원 분리 공급', '전원 장애 시 무중단', '모든 핵심 장비'] },
    { cells: ['이중 NIC (Bonding)', 'LACP/Active-Backup', '링크 장애 시 자동 전환', '서버, 스위치 업링크'] },
    { cells: ['이중 스위치 (MC-LAG/vPC)', '양쪽 스위치에서 LACP 수용', '스위치 장애 시 무중단', 'ToR, Dist 스위치'] },
    { cells: ['게이트웨이 이중화 (VRRP/HSRP)', 'Virtual IP를 공유', 'GW 장애 시 자동 전환', '라우터, L3 스위치'] },
    { cells: ['경로 이중화 (ECMP)', '동일 cost 다중 경로', '대역폭 집선 + failover', '코어 라우터 간'] },
    { cells: ['회선 이중화 (Dual ISP)', '서로 다른 ISP 2회선', 'ISP 장애 시 자동 전환', '인터넷 경계'] },
]

/* ── 컴포넌트 ──────────────────────────────────────────────────────── */

export default function Topic02() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-14">
            {/* ── Header ──────────────────────────────────────────── */}
            <header className="space-y-3">
                <p className="text-xs font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                    Topic 02
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    실제 네트워크 망 구성의 기초
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    Real-World Network Design
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    가정용과 기업 네트워크 구조의 차이를 비교하고, DMZ와 보안장비 배치의 원리를 학습합니다.
                    각 네트워크 장비의 상세 기능과 실제 이중화 구성까지, 실무에서 네트워크가 어떻게 설계되는지
                    전체 그림을 잡는 것이 이 토픽의 목표입니다.
                </p>
            </header>

            <LearningCard
                topicId="02-network-design"
                items={[
                    '가정용/기업 네트워크 구조 차이를 설명할 수 있다',
                    'DMZ와 망 분리 개념을 이해한다',
                    '보안장비 배치 위치와 역할을 파악한다',
                    'L2/L3 스위치, 로드밸런서, 방화벽의 상세 기능을 구분할 수 있다',
                    'VRRP, LACP, ECMP 등 이중화 프로토콜의 동작 원리를 이해한다',
                    '실무 이중화 구성 사례를 읽고 설명할 수 있다',
                ]}
            />

            {/* ── 2.1 가정용 vs 기업 네트워크 ─────────────────────── */}
            <Section id="s021" title="2.1  가정용 네트워크 vs 기업 네트워크">
                <Prose>
                    가정에서는 ISP가 제공하는 공유기 한 대로 인터넷을 사용합니다. 공유기는 라우터, 스위치, Wi-Fi AP 기능을
                    모두 포함한 올인원 장비입니다. 반면 기업 네트워크는 수백~수천 명의 사용자와 서버를 안정적으로 연결하기 위해
                    역할별로 분리된 전용 장비들을 사용합니다.
                </Prose>

                <HomeVsEnterprise />

                <InfoTable
                    headers={['항목', '가정용 네트워크', '기업 네트워크']}
                    rows={homeVsEnterpriseRows}
                />

                <Alert variant="tip" title="핵심:">
                    가정용 네트워크의 공유기 1대가 수행하는 기능을 기업에서는 라우터, 스위치, 방화벽, AP 등
                    개별 장비로 분리하여 성능과 안정성을 확보합니다.
                </Alert>
            </Section>

            {/* ── 2.2 인터넷 회선과 ISP ───────────────────────────── */}
            <Section id="s022" title="2.2  인터넷 회선과 ISP">
                <Prose>
                    ISP(Internet Service Provider)는 인터넷 접속 서비스를 제공하는 사업자입니다.
                    한국의 대표적인 ISP로는 KT, SK브로드밴드, LG유플러스가 있습니다. ISP는 계층적으로 구성되어
                    Tier 1(국제 백본), Tier 2(국가/지역 ISP), Tier 3(가입자 접속)으로 나뉩니다.
                </Prose>

                <CardGrid cols={3}>
                    <StatCard
                        title="Tier 1 ISP"
                        value="국제 백본"
                        color="red"
                        desc="전 세계 ISP 간 트래픽 교환. 상위 ISP에 비용을 내지 않음 (peering)"
                    />
                    <StatCard
                        title="Tier 2 ISP"
                        value="국가/지역"
                        color="amber"
                        desc="Tier 1에서 대역폭을 구매하고, 하위 ISP나 기업에 서비스 제공"
                    />
                    <StatCard
                        title="Tier 3 ISP"
                        value="가입자 접속"
                        color="green"
                        desc="가정/소규모 기업에 직접 인터넷 회선을 제공하는 최종 사업자"
                    />
                </CardGrid>

                <InfoBox color="blue" title="기업의 인터넷 회선">
                    기업은 일반 가정과 달리 전용회선(Dedicated Line)이나 MPLS VPN을 사용합니다.
                    전용회선은 대역폭이 보장되며, 업/다운로드 속도가 대칭(Symmetric)입니다.
                    가정용 회선은 보통 다운로드가 빠르고 업로드가 느린 비대칭(Asymmetric) 구조입니다.
                </InfoBox>
            </Section>

            {/* ── 2.3 공인 IP와 사설 IP ───────────────────────────── */}
            <Section id="s023" title="2.3  공인 IP와 사설 IP">
                <Prose>
                    IPv4 주소는 약 43억 개로 제한되어 있습니다. 이 부족 문제를 해결하기 위해 사설 IP 대역이 정의되었고,
                    NAT(Network Address Translation)를 통해 하나의 공인 IP를 여러 장비가 공유합니다.
                </Prose>

                <CodeBlock code={privateIpRangesCode} language="bash" filename="RFC 1918 사설 IP 대역" />

                <CardGrid cols={2}>
                    <InfoBox color="green" title="공인 IP (Public IP)">
                        인터넷에서 유일한 주소. ISP가 할당하며, 외부에서 직접 접근 가능합니다.
                        서버, 방화벽의 외부 인터페이스에 사용됩니다.
                    </InfoBox>
                    <InfoBox color="purple" title="사설 IP (Private IP)">
                        내부 네트워크에서만 유효한 주소. 인터넷으로 나갈 때 NAT를 통해 공인 IP로 변환됩니다.
                        같은 사설 IP 대역이 서로 다른 네트워크에서 중복 사용 가능합니다.
                    </InfoBox>
                </CardGrid>

                <CodeBlock code={homeNetworkConfigCode} language="bash" filename="가정용 공유기 NAT 구성" />

                <Alert variant="info" title="실무 팁:">
                    기업에서는 10.0.0.0/8 대역을 사용하는 것이 일반적입니다. 16M개의 주소를 부서/용도별로
                    서브넷팅하여 관리합니다. 192.168.x.x는 주로 소규모 환경에서 사용합니다.
                </Alert>
            </Section>

            {/* ── 2.4 네트워크 장비 상세 ────────────────────────────── */}
            <Section id="s024" title="2.4  네트워크 장비 상세">
                <Prose>
                    네트워크를 구성하는 핵심 장비는 L2 스위치, L3 스위치, 라우터, 로드밸런서, 방화벽 등입니다.
                    각 장비는 OSI 모델의 서로 다른 계층에서 동작하며, 역할과 배치 위치가 다릅니다.
                    이 섹션에서는 각 장비의 상세 기능, 실제 제조사 제품, 그리고 선택 기준을 심도 있게 다룹니다.
                </Prose>

                <InfoTable
                    headers={['장비', '동작 계층', '주요 역할', '핵심 기능', '배치 위치']}
                    rows={deviceCompareRows}
                />

                {/* ── L2 스위치 ── */}
                <InfoBox color="green" title="L2 스위치 상세">
                    L2 스위치는 MAC 주소 기반으로 동일 네트워크(브로드캐스트 도메인) 내에서 프레임을 전달합니다.
                    사용자 PC, 서버, IP폰, AP 등 종단 장비를 직접 연결하는 액세스 계층의 핵심 장비입니다.
                    관리형(Managed) 스위치는 VLAN, STP, 포트 보안 등 고급 기능을 지원하며 CLI/웹으로 설정 가능합니다.
                    비관리형(Unmanaged) 스위치는 전원만 연결하면 동작하지만 설정 변경이 불가능합니다.
                </InfoBox>

                <InfoTable
                    headers={['기능', '설명', '비고']}
                    rows={l2SwitchFeatureRows}
                />

                <Alert variant="info" title="실제 L2 스위치 제품:">
                    <span>
                        Cisco Catalyst 9200 시리즈 (엔터프라이즈), Arista 7010T (데이터센터),
                        Juniper EX2300 (캠퍼스), HP Aruba 2930F (SMB).
                        관리형 스위치는 SNMP, syslog, NetFlow 등 모니터링 기능도 지원합니다.
                    </span>
                </Alert>

                {/* ── L3 스위치 ── */}
                <InfoBox color="blue" title="L3 스위치 상세">
                    L3 스위치는 ASIC(Application-Specific Integrated Circuit) 칩을 사용하여 하드웨어 수준에서
                    라우팅을 처리합니다. 소프트웨어 기반 라우터보다 훨씬 빠른 와이어스피드(wire-speed) 라우팅이 가능합니다.
                    기업 내부에서 VLAN 간 라우팅(Inter-VLAN Routing)을 담당하며, 코어/배포 계층에 배치됩니다.
                    DHCP relay를 통해 중앙 DHCP 서버와 각 VLAN을 연결하고, ACL을 TCAM에서 고속 처리합니다.
                </InfoBox>

                <InfoTable
                    headers={['항목', 'L3 스위치', '라우터']}
                    rows={l3SwitchVsRouterRows}
                />

                <Alert variant="tip" title="L3 스위치 vs 라우터 선택 기준:">
                    내부 VLAN 간 고속 라우팅이 필요하면 L3 스위치, ISP 연결이나 WAN 프로토콜(BGP full table,
                    MPLS, GRE 터널)이 필요하면 전용 라우터를 선택합니다. 최근 고급 L3 스위치는 BGP도
                    지원하지만, full routing table(90만+ 경로) 처리에는 전용 라우터가 유리합니다.
                </Alert>

                {/* ── L4/L7 로드밸런서 ── */}
                <InfoBox color="amber" title="L4 / L7 로드밸런서 상세">
                    로드밸런서는 클라이언트 요청을 여러 백엔드 서버에 분산하여 가용성과 확장성을 확보합니다.
                    L4 로드밸런서는 TCP/UDP 헤더(IP + Port)만 보고 분산하므로 처리 속도가 빠릅니다.
                    L7 로드밸런서는 HTTP 헤더, URL 경로, 쿠키 등 애플리케이션 데이터를 분석하여
                    콘텐츠 기반 라우팅(content-based routing)이 가능합니다.
                </InfoBox>

                <InfoTable
                    headers={['유형', '분산 기준', '특징', '비고']}
                    rows={lbCompareRows}
                />

                <CardGrid cols={2}>
                    <InfoBox color="orange" title="DSR (Direct Server Return)">
                        L4 로드밸런서에서 사용하는 기법으로, 응답 트래픽이 LB를 거치지 않고 서버에서
                        클라이언트로 직접 전달됩니다. LB의 부하를 크게 줄여주며, 대용량 다운로드/스트리밍
                        서비스에 적합합니다. 서버의 루프백 인터페이스에 VIP를 설정해야 합니다.
                    </InfoBox>
                    <InfoBox color="teal" title="세션 유지 (Sticky Session)">
                        같은 클라이언트의 요청을 항상 같은 서버로 전달하는 기능입니다. 소스 IP 기반,
                        쿠키 기반, SSL Session ID 기반 등의 방식이 있습니다. 세션 서버(Redis 등)를
                        별도로 운영하면 sticky session 없이도 상태를 공유할 수 있습니다.
                    </InfoBox>
                </CardGrid>

                <Alert variant="info" title="실제 로드밸런서 제품:">
                    <span>
                        하드웨어: F5 BIG-IP (LTM/GTM), Citrix ADC (구 NetScaler), A10 Thunder.
                        소프트웨어: HAProxy (L4/L7 오픈소스), nginx (L7 리버스 프록시), Envoy (서비스 메시),
                        LVS/IPVS (Linux 커널 L4). 클라우드: AWS ALB/NLB, GCP LB, Azure LB.
                    </span>
                </Alert>

                {/* ── 백본 라우터 ── */}
                <InfoBox color="red" title="백본 라우터 (Core Router)">
                    백본 라우터는 ISP 코어나 대규모 기업의 WAN 경계에서 대용량 패킷을 처리합니다.
                    BGP(Border Gateway Protocol)로 ISP 간 경로를 교환하고, OSPF/IS-IS로 내부 경로를
                    관리합니다. 라인 카드(Line Card) 구조로 인터페이스를 모듈식으로 확장할 수 있으며,
                    단일 섀시에서 수 Tbps의 처리 능력을 제공합니다.
                    ISP 피어링(Peering)은 두 ISP가 상호 트래픽을 교환하는 방식으로,
                    IX(Internet Exchange) 또는 PNI(Private Network Interconnect)를 통해 이루어집니다.
                </InfoBox>

                <CodeBlock code={ospfBasicCode} language="bash" filename="OSPF 기본 설정 (Cisco IOS)" />

                {/* ── 방화벽 ── */}
                <InfoBox color="rose" title="방화벽 (Firewall) 상세">
                    방화벽은 네트워크 경계에서 트래픽을 검사하고 보안 정책에 따라 허용/차단합니다.
                    Stateful Inspection은 연결 상태(TCP 세션)를 추적하여 응답 트래픽을 자동 허용합니다.
                    DPI(Deep Packet Inspection)는 패킷 페이로드까지 검사하여 애플리케이션을 식별합니다.
                    VPN 터미네이션 기능으로 IPsec/SSL VPN 터널의 종단점 역할도 수행합니다.
                </InfoBox>

                <InfoTable
                    headers={['유형', '특징', '적합 환경', '대표 제품']}
                    rows={firewallCompareRows}
                />

                <Alert variant="warning" title="UTM vs NGFW 선택:">
                    <span>
                        UTM은 중소규모에서 단일 장비로 여러 보안 기능을 통합 운영할 때 적합합니다.
                        NGFW는 대규모 환경에서 애플리케이션 가시성, 사용자 기반 정책, 위협 인텔리전스가
                        필요할 때 선택합니다. Zone-based 정책은 인터페이스를 trust/untrust/dmz 등
                        보안 존으로 그룹핑하여 존 간 정책을 적용하는 현대적 방식입니다.
                    </span>
                </Alert>
            </Section>

            {/* ── 2.5 스위치 계층 구조 ────────────────────────────── */}
            <Section id="s025" title="2.5  스위치 계층 구조 (3-Tier Architecture)">
                <Prose>
                    기업 네트워크는 코어(Core), 배포(Distribution), 액세스(Access) 3계층으로 구성됩니다.
                    이 구조는 Cisco가 제안한 전통적인 설계 모델로, 대부분의 중대형 네트워크에서 사용됩니다.
                </Prose>

                <NetworkTiersDiagram />

                <InfoTable
                    headers={['계층', '역할', '장비 예시', '비고']}
                    rows={tierRows}
                />

                <InfoBox color="amber" title="2-Tier (Collapsed Core)">
                    중소규모 네트워크에서는 코어와 배포 계층을 하나로 합친 2-Tier 구조를 사용하기도 합니다.
                    장비 수를 줄이면서도 논리적 분리를 유지할 수 있어 비용 효율적입니다.
                </InfoBox>
            </Section>

            {/* ── 2.6 망 분리의 원칙 ──────────────────────────────── */}
            <Section id="s026" title="2.6  망 분리의 원칙">
                <Prose>
                    기업 네트워크는 용도에 따라 서버망, 사용자망, 관리망으로 분리합니다.
                    망 분리는 보안 사고의 확산을 방지하고, 트래픽 관리를 용이하게 합니다.
                </Prose>

                <CodeBlock code={enterpriseSubnetCode} language="bash" filename="기업 서브넷 설계 예시" />

                <CardGrid cols={3}>
                    <InfoBox color="blue" title="서버망 (Server Network)">
                        웹 서버, DB 서버, 애플리케이션 서버 등이 위치합니다.
                        접근 제어가 엄격하며, 서버 간 통신(East-West 트래픽)이 많습니다.
                        대역: 10.10.x.x/16
                    </InfoBox>
                    <InfoBox color="green" title="사용자망 (User Network)">
                        직원들의 PC, 노트북, IP폰이 연결됩니다. 부서별로 VLAN을 나누어 관리합니다.
                        인터넷 접속이 주 목적이며, North-South 트래픽이 많습니다.
                        대역: 10.20.x.x/16
                    </InfoBox>
                    <InfoBox color="purple" title="관리망 (Management Network)">
                        네트워크 장비(스위치, 라우터), 서버의 관리 포트(IPMI, iLO)에 접근하는 전용 망입니다.
                        일반 사용자 접근이 차단되며, 관리자만 접근 가능합니다.
                        대역: 10.30.x.x/16
                    </InfoBox>
                </CardGrid>

                <Alert variant="warning" title="주의:">
                    망 분리는 물리적 분리와 논리적 분리(VLAN)로 구현할 수 있습니다.
                    금융기관 등 보안이 중요한 환경에서는 물리적으로 별도의 케이블과 스위치를 사용하여
                    완전한 분리를 요구하기도 합니다.
                </Alert>
            </Section>

            {/* ── 2.7 DMZ ─────────────────────────────────────────── */}
            <Section id="s027" title="2.7  DMZ의 개념과 목적">
                <Prose>
                    DMZ(Demilitarized Zone, 비무장 지대)는 외부 인터넷과 내부 네트워크 사이에 위치한
                    완충 구역입니다. 외부에 서비스를 제공해야 하지만 내부 네트워크에 직접 접근을 허용하면
                    안 되는 서버들을 이 영역에 배치합니다.
                </Prose>

                <CardGrid cols={3}>
                    <StatCard
                        title="외부 구간"
                        value="Internet"
                        color="red"
                        desc="통제 불가능한 영역. 공격자가 존재할 수 있는 구간"
                    />
                    <StatCard
                        title="DMZ"
                        value="완충 구역"
                        color="amber"
                        desc="외부 서비스 제공 서버 배치 (Web, Mail, DNS)"
                    />
                    <StatCard
                        title="내부 구간"
                        value="Trusted Zone"
                        color="green"
                        desc="DB, 사용자 PC 등 보호 대상이 있는 안전 구역"
                    />
                </CardGrid>

                <InfoBox color="cyan" title="DMZ에 배치하는 서버">
                    <ul className="list-disc list-inside space-y-1 mt-1">
                        <li>웹 서버 (Apache, Nginx) — 외부 사용자에게 서비스 제공</li>
                        <li>메일 서버 (SMTP Relay) — 외부 메일 수신/발신</li>
                        <li>DNS 서버 (External) — 도메인 질의 응답</li>
                        <li>리버스 프록시 — 내부 서버 보호 및 SSL 오프로드</li>
                        <li>VPN 게이트웨이 — 원격 접속 종단점</li>
                    </ul>
                </InfoBox>

                <Alert variant="danger" title="핵심 원칙:">
                    DMZ의 서버가 침해되더라도 내부 네트워크로의 접근은 방화벽에 의해 차단되어야 합니다.
                    DMZ → 내부 방향의 트래픽은 원칙적으로 모두 차단하고, 필요한 최소한의 포트만 허용합니다.
                </Alert>
            </Section>

            {/* ── 2.8 보안장비 배치 ───────────────────────────────── */}
            <Section id="s028" title="2.8  보안장비 배치">
                <Prose>
                    방화벽, IPS, WAF, 프록시, 로드밸런서 등의 보안/네트워크 장비는
                    네트워크의 특정 위치에 전략적으로 배치됩니다. 잘못된 위치에 배치하면
                    보안 효과가 떨어지거나 성능 병목이 발생합니다.
                </Prose>

                <InfoTable
                    headers={['장비', '배치 위치', '주요 역할', '비고']}
                    rows={securityDeviceRows}
                />

                <CodeBlock code={firewallRuleExample} language="bash" filename="방화벽 정책 예시 (iptables)" />

                <InfoBox color="rose" title="보안장비 배치 순서 (외부 → 내부)">
                    <div className="space-y-1 mt-1">
                        <p>1. Border Router — ISP 연결, 기본 ACL</p>
                        <p>2. 외부 방화벽 — 인터넷 ↔ DMZ 경계</p>
                        <p>3. IPS — 침입 탐지/차단 (인라인)</p>
                        <p>4. DMZ 스위치 — 공개 서버 연결</p>
                        <p>5. 내부 방화벽 — DMZ ↔ 내부 경계</p>
                        <p>6. 코어 스위치 — 내부 트래픽 집중</p>
                        <p>7. 프록시/LB — 서비스별 트래픽 분산</p>
                    </div>
                </InfoBox>

                <Alert variant="info" title="Dual-Homed 방화벽:">
                    소규모 환경에서는 하나의 방화벽에 3개 인터페이스(외부, DMZ, 내부)를 연결하여
                    모든 트래픽을 제어합니다. 대규모 환경에서는 외부 방화벽과 내부 방화벽을
                    별도로 구성하여 보안을 강화합니다.
                </Alert>
            </Section>

            {/* ── 2.9 이중화 구성 상세 ──────────────────────────────── */}
            <Section id="s029" title="2.9  이중화 구성 상세">
                <Prose>
                    네트워크 장비의 장애는 전체 서비스 중단으로 이어질 수 있습니다. 이를 방지하기 위해
                    핵심 장비는 이중화(Redundancy)하여 단일 장애점(SPOF, Single Point of Failure)을 제거합니다.
                    이 섹션에서는 물리적 이중화부터 게이트웨이, 링크, 경로 이중화까지 각 계층별 이중화 기법을
                    상세히 다루고, 실제 구성 사례를 살펴봅니다.
                </Prose>

                <InfoTable
                    headers={['구성', '동작 방식', '장단점', '프로토콜 예시']}
                    rows={redundancyRows}
                />

                <InfoTable
                    headers={['이중화 대상', '방식', '장애 시 동작', '적용 위치']}
                    rows={redundancyDetailRows}
                />

                {/* ── 게이트웨이 이중화: VRRP / HSRP ── */}
                <InfoBox color="blue" title="게이트웨이 이중화: VRRP / HSRP">
                    VRRP(Virtual Router Redundancy Protocol, RFC 5798)와 HSRP(Cisco 전용)는
                    여러 라우터/L3 스위치가 하나의 가상 IP(VIP)를 공유하여 게이트웨이 이중화를 제공합니다.
                    Master(Active)가 주기적으로 Advertisement를 전송하고, 이를 수신하지 못하면
                    Backup(Standby)이 Master로 승격합니다. Preempt 기능을 켜면 원래 Master가
                    복구되었을 때 자동으로 역할을 되찾습니다. Priority 값(0~255)으로 우선순위를 결정합니다.
                </InfoBox>

                <CodeBlock code={keepalivedVrrpCode} language="bash" filename="Keepalived VRRP 설정" />

                <CardGrid cols={2}>
                    <InfoBox color="green" title="Active-Standby (VRRP)">
                        평상시 Master 장비가 모든 트래픽을 처리합니다. Master 장애 시 Standby 장비가
                        자동으로 역할을 이어받습니다(Failover). 절체 시간(약 3~10초)이 발생하지만
                        구성이 단순합니다. track_interface/track_script로 세밀한 장애 감지가 가능합니다.
                    </InfoBox>
                    <InfoBox color="teal" title="Active-Active (VRRP 그룹 분리)">
                        VLAN별로 서로 다른 장비를 Master로 지정하여 양쪽 모두 트래픽을 처리합니다.
                        예: VLAN 10은 SW-A가 Master, VLAN 20은 SW-B가 Master.
                        자원 활용 효율이 높고, 한쪽 장애 시 나머지가 전체를 처리합니다.
                    </InfoBox>
                </CardGrid>

                {/* ── 링크 이중화: LACP ── */}
                <InfoBox color="amber" title="링크 이중화: LACP / NIC Bonding">
                    LACP(Link Aggregation Control Protocol, IEEE 802.3ad)는 여러 물리 링크를
                    하나의 논리 링크로 묶어 대역폭을 집선하고 링크 장애 시 자동 전환합니다.
                    서버에서는 NIC Bonding(Linux) 또는 NIC Teaming(Windows)으로 구성하며,
                    스위치 측에서도 LACP를 활성화해야 합니다. min-links 설정으로
                    최소 활성 링크 수를 보장할 수 있습니다.
                </InfoBox>

                <InfoTable
                    headers={['모드', '동작 방식', '스위치 설정', '특징']}
                    rows={bondModeRows}
                />

                <CodeBlock code={lacpBondingCode} language="yaml" filename="Linux NIC Bonding (LACP) 설정" />

                {/* ── 스위치 이중화: MC-LAG / vPC ── */}
                <InfoBox color="purple" title="스위치 이중화: MC-LAG / vPC">
                    MC-LAG(Multi-Chassis LAG)은 서로 다른 두 스위치가 마치 하나의 스위치인 것처럼
                    LACP를 수용하는 기술입니다. Cisco에서는 vPC(Virtual Port Channel),
                    Arista에서는 MLAG, Juniper에서는 MC-LAG으로 부릅니다.
                    서버나 하위 스위치는 두 상위 스위치에 각각 1포트씩 연결하여 LACP bond를 구성하면,
                    스위치 1대가 장애가 나더라도 나머지 1대로 트래픽이 유지됩니다.
                </InfoBox>

                {/* ── 경로 이중화: ECMP / BFD ── */}
                <CardGrid cols={2}>
                    <InfoBox color="red" title="경로 이중화: ECMP">
                        ECMP(Equal-Cost Multi-Path)는 동일한 cost를 가진 여러 경로로
                        트래픽을 분산하는 기법입니다. OSPF, BGP 등 라우팅 프로토콜에서
                        같은 목적지에 대해 동일 metric의 경로가 여러 개 있으면 자동으로 활성화됩니다.
                        대역폭 집선과 경로 장애 시 자동 failover를 동시에 달성합니다.
                    </InfoBox>
                    <InfoBox color="indigo" title="BFD (Bidirectional Forwarding Detection)">
                        BFD는 두 장비 간 링크 상태를 밀리초 단위로 감시하는 프로토콜입니다.
                        OSPF/BGP의 기본 hello/dead 타이머(초 단위)보다 훨씬 빠르게 장애를
                        감지하여 라우팅 프로토콜에 알립니다. 일반적으로 BFD 감지 시간은
                        50ms x 3 = 150ms 이내로, sub-second failover를 달성합니다.
                    </InfoBox>
                </CardGrid>

                {/* ── 실제 이중화 구성 사례 1 ── */}
                <InfoBox color="cyan" title="실제 구성 예시 1: 사무실 인터넷 접속망">
                    Dual ISP + VRRP + LACP를 조합한 전형적인 사무실 인터넷 접속 이중화 구성입니다.
                    두 개의 ISP 회선을 각각 별도의 라우터에 연결하고, VRRP로 게이트웨이를 이중화합니다.
                    코어 스위치와 라우터 간은 LACP로 링크를 묶어 대역폭과 가용성을 확보합니다.
                </InfoBox>

                <CodeBlock code={dualIspVrrpDiagramCode} language="bash" filename="사무실 이중화 구성도 (ASCII)" />

                {/* ── 실제 이중화 구성 사례 2 ── */}
                <InfoBox color="emerald" title="실제 구성 예시 2: 서버팜 (Dual ToR + MC-LAG + LB HA)">
                    데이터센터 서버팜의 전형적인 이중화 구성입니다. 서버는 dual NIC으로 LACP bond를 구성하고,
                    각 포트는 서로 다른 ToR(Top-of-Rack) 스위치에 연결됩니다. ToR 스위치 쌍은 MC-LAG/vPC로
                    서버의 LACP를 양쪽에서 수용합니다. 로드밸런서는 Active-Standby HA pair로 VIP를 공유합니다.
                </InfoBox>

                <CodeBlock code={serverFarmHaDiagramCode} language="bash" filename="서버팜 이중화 구성도 (ASCII)" />

                <CodeBlock code={switchVerifyCommandsCode} language="bash" filename="스위치/라우터 상태 확인 명령어" />

                <Alert variant="tip" title="이중화 설계 원칙:">
                    <span>
                        모든 핵심 경로에 SPOF가 없는지 확인합니다. 전원, NIC, 스위치, 라우터, 회선까지
                        각 계층별로 이중화를 검토하고, 정기적으로 failover 테스트를 수행합니다.
                        BFD를 활용하면 장애 감지 시간을 초 단위에서 밀리초 단위로 단축할 수 있습니다.
                    </span>
                </Alert>
            </Section>

            {/* ── 2.10 요약 ───────────────────────────────────────── */}
            <Section id="s0210" title="2.10  요약">
                <Prose>
                    이 토픽에서는 실제 네트워크가 어떻게 설계되는지 전체 그림을 살펴보았습니다.
                    가정용 네트워크와 기업 네트워크의 차이, 3-Tier 아키텍처, 망 분리, DMZ, 보안장비 배치,
                    각 네트워크 장비의 상세 기능, 그리고 VRRP/LACP/ECMP 등 이중화 프로토콜의 동작 원리까지
                    네트워크 설계의 핵심 원칙을 다루었습니다.
                </Prose>

                <CardGrid cols={4}>
                    <StatCard title="장비 역할" value="6종" color="blue" desc="L2/L3 SW, 라우터, LB, FW, 백본" />
                    <StatCard title="계층 구조" value="3-Tier" color="amber" desc="Core / Dist / Access" />
                    <StatCard title="망 분리" value="3+1" color="green" desc="서버/사용자/관리 + DMZ" />
                    <StatCard title="이중화" value="6계층" color="red" desc="전원/NIC/SW/GW/경로/회선" />
                </CardGrid>

                <InfoBox color="gray" title="다음 토픽 미리보기">
                    Topic 03에서는 물리 계층과 링크 계층을 다룹니다. Ethernet 프레임 구조, MAC 주소,
                    스위치의 MAC 테이블 동작, ARP 프로토콜, VLAN과 802.1Q 태깅의 원리를 학습합니다.
                </InfoBox>
            </Section>

            <TopicNavigation topicId="02-network-design" />
        </div>
    )
}
