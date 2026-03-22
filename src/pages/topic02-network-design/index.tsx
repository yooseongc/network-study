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
    redundancyConfigCode,
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
                    실무에서 네트워크가 어떻게 설계되는지 전체 그림을 잡는 것이 이 토픽의 목표입니다.
                </p>
            </header>

            <LearningCard
                topicId="02-network-design"
                items={[
                    '가정용/기업 네트워크 구조 차이를 설명할 수 있다',
                    'DMZ와 망 분리 개념을 이해한다',
                    '보안장비 배치 위치와 역할을 파악한다',
                    '이중화 구성의 기본 개념을 이해한다',
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                </div>

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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoBox color="green" title="공인 IP (Public IP)">
                        인터넷에서 유일한 주소. ISP가 할당하며, 외부에서 직접 접근 가능합니다.
                        서버, 방화벽의 외부 인터페이스에 사용됩니다.
                    </InfoBox>
                    <InfoBox color="purple" title="사설 IP (Private IP)">
                        내부 네트워크에서만 유효한 주소. 인터넷으로 나갈 때 NAT를 통해 공인 IP로 변환됩니다.
                        같은 사설 IP 대역이 서로 다른 네트워크에서 중복 사용 가능합니다.
                    </InfoBox>
                </div>

                <CodeBlock code={homeNetworkConfigCode} language="bash" filename="가정용 공유기 NAT 구성" />

                <Alert variant="info" title="실무 팁:">
                    기업에서는 10.0.0.0/8 대역을 사용하는 것이 일반적입니다. 16M개의 주소를 부서/용도별로
                    서브넷팅하여 관리합니다. 192.168.x.x는 주로 소규모 환경에서 사용합니다.
                </Alert>
            </Section>

            {/* ── 2.4 네트워크 장비의 역할 ────────────────────────── */}
            <Section id="s024" title="2.4  네트워크 장비의 역할">
                <Prose>
                    네트워크를 구성하는 핵심 장비는 라우터, L3 스위치, L2 스위치입니다.
                    각 장비는 OSI 모델의 서로 다른 계층에서 동작하며, 역할과 배치 위치가 다릅니다.
                </Prose>

                <InfoTable
                    headers={['장비', '동작 계층', '주요 역할', '핵심 기능', '배치 위치']}
                    rows={deviceCompareRows}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <InfoBox color="red" title="라우터 (Router)">
                        서로 다른 네트워크(서브넷) 사이에서 패킷을 전달합니다. IP 주소 기반으로
                        최적 경로를 결정하며, WAN 구간(ISP 연결)에서 핵심 역할을 합니다.
                    </InfoBox>
                    <InfoBox color="blue" title="L3 스위치">
                        스위칭 + 라우팅을 하드웨어(ASIC)로 처리하여 라우터보다 빠릅니다.
                        기업 내부에서 VLAN 간 라우팅을 담당하며, 코어/배포 계층에 배치됩니다.
                    </InfoBox>
                    <InfoBox color="green" title="L2 스위치">
                        MAC 주소 테이블을 기반으로 같은 네트워크 내에서 프레임을 전달합니다.
                        사용자 PC, 서버 등 종단 장비를 직접 연결하는 액세스 계층 장비입니다.
                    </InfoBox>
                </div>

                <Alert variant="tip" title="L3 스위치 vs 라우터:">
                    요즘 기업 내부에서는 L3 스위치가 라우터를 대체하는 경우가 많습니다. 다만 ISP와의 연결이나
                    WAN 프로토콜(BGP, MPLS)이 필요한 구간에서는 여전히 전용 라우터를 사용합니다.
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                </div>

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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                </div>

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

            {/* ── 2.9 이중화 기초 ─────────────────────────────────── */}
            <Section id="s029" title="2.9  이중화 기초 (Active-Standby, Active-Active)">
                <Prose>
                    네트워크 장비의 장애는 전체 서비스 중단으로 이어질 수 있습니다. 이를 방지하기 위해
                    핵심 장비는 이중화(Redundancy)하여 단일 장애점(SPOF, Single Point of Failure)을 제거합니다.
                </Prose>

                <InfoTable
                    headers={['구성', '동작 방식', '장단점', '프로토콜 예시']}
                    rows={redundancyRows}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoBox color="blue" title="Active-Standby">
                        평상시 Master 장비가 모든 트래픽을 처리합니다. Master 장애 시 Standby 장비가
                        자동으로 역할을 이어받습니다(Failover). 절체 시간이 발생하지만 구성이 단순합니다.
                        대표 프로토콜: VRRP, HSRP.
                    </InfoBox>
                    <InfoBox color="green" title="Active-Active">
                        두 장비가 동시에 트래픽을 처리합니다. 한 쪽 장애 시 나머지가 전체를 처리합니다.
                        대역폭 활용이 효율적이지만 설정과 트러블슈팅이 복잡합니다.
                        대표 프로토콜: ECMP, MC-LAG.
                    </InfoBox>
                </div>

                <CodeBlock code={redundancyConfigCode} language="bash" filename="VRRP 설정 예시" />

                <Alert variant="tip" title="이중화 대상:">
                    <span>
                        코어 스위치, 방화벽, 로드밸런서, 인터넷 회선 등 트래픽이 반드시 통과하는 장비는
                        모두 이중화 대상입니다. 액세스 스위치는 비용 대비 효과를 고려하여 선택적으로 이중화합니다.
                    </span>
                </Alert>
            </Section>

            {/* ── 2.10 요약 ───────────────────────────────────────── */}
            <Section id="s0210" title="2.10  요약">
                <Prose>
                    이 토픽에서는 실제 네트워크가 어떻게 설계되는지 전체 그림을 살펴보았습니다.
                    가정용 네트워크와 기업 네트워크의 차이, 3-Tier 아키텍처, 망 분리, DMZ, 보안장비 배치,
                    이중화까지 네트워크 설계의 핵심 원칙을 다루었습니다.
                </Prose>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatCard title="장비 역할" value="3종" color="blue" desc="라우터, L3 SW, L2 SW" />
                    <StatCard title="계층 구조" value="3-Tier" color="amber" desc="Core / Dist / Access" />
                    <StatCard title="망 분리" value="3+1" color="green" desc="서버/사용자/관리 + DMZ" />
                    <StatCard title="이중화" value="HA" color="red" desc="A-S / A-A 구성" />
                </div>

                <InfoBox color="gray" title="다음 토픽 미리보기">
                    Topic 03에서는 물리 계층과 링크 계층을 다룹니다. Ethernet 프레임 구조, MAC 주소,
                    스위치의 MAC 테이블 동작, ARP 프로토콜, VLAN과 802.1Q 태깅의 원리를 학습합니다.
                </InfoBox>
            </Section>

            <TopicNavigation topicId="02-network-design" />
        </div>
    )
}
