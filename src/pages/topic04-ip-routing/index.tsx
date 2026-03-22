import { CardGrid } from '../../components/ui/CardGrid'
import { InlineCode } from '../../components/ui/InlineCode'
import { Section } from '../../components/ui/Section'
import { Prose } from '../../components/ui/Prose'
import { InfoBox } from '../../components/ui/InfoBox'
import { InfoTable } from '../../components/ui/InfoTable'
import { StatCard } from '../../components/ui/StatCard'
import { Alert } from '../../components/ui/Alert'
import { LearningCard } from '../../components/ui/LearningCard'
import { TopicNavigation } from '../../components/ui/TopicNavigation'
import { RfcRef } from '../../components/ui/RfcRef'
import { CodeBlock } from '../../components/viz/CodeBlock'
import { T } from '../../components/ui/GlossaryTooltip'
import { SubnetDiagram } from '../../components/concepts/routing/SubnetDiagram'
import { RoutingTableViz } from '../../components/concepts/routing/RoutingTableViz'
import {
    ipAddrShowCode,
    ipRouteShowCode,
    tracerouteCode,
    subnetCalcCode,
    ipv6ExampleCode,
} from './codeSnippets'

/* ── inline data ──────────────────────────────────────────────── */

const ipClassRows = [
    { cells: ['A', '0.0.0.0 ~ 127.255.255.255', '0xxxxxxx', '/8', '8 / 24', '대규모 네트워크 (기업, ISP)'] },
    { cells: ['B', '128.0.0.0 ~ 191.255.255.255', '10xxxxxx', '/16', '16 / 16', '중규모 네트워크 (대학 등)'] },
    { cells: ['C', '192.0.0.0 ~ 223.255.255.255', '110xxxxx', '/24', '24 / 8', '소규모 네트워크 (가정, 사무실)'] },
    { cells: ['D', '224.0.0.0 ~ 239.255.255.255', '1110xxxx', '—', '—', '멀티캐스트 (1:N 통신)'] },
    { cells: ['E', '240.0.0.0 ~ 255.255.255.255', '1111xxxx', '—', '—', '예약 (실험/연구용)'] },
]

const privateIpRows = [
    { cells: ['10.0.0.0/8', '10.0.0.0 ~ 10.255.255.255', '16,777,214', 'A', '대규모 기업 내부망'] },
    { cells: ['172.16.0.0/12', '172.16.0.0 ~ 172.31.255.255', '1,048,574', 'B', 'Docker 기본 대역'] },
    { cells: ['192.168.0.0/16', '192.168.0.0 ~ 192.168.255.255', '65,534', 'C', '가정용 공유기'] },
]

const cidrRows = [
    { cells: ['/8', '255.0.0.0', '16,777,214', '8', '24', 'A 클래스 동일'] },
    { cells: ['/16', '255.255.0.0', '65,534', '16', '16', 'B 클래스 동일'] },
    { cells: ['/24', '255.255.255.0', '254', '24', '8', '가장 흔한 서브넷'] },
    { cells: ['/25', '255.255.255.128', '126', '25', '7', '/24를 반으로'] },
    { cells: ['/26', '255.255.255.192', '62', '26', '6', '/24를 4등분'] },
    { cells: ['/27', '255.255.255.224', '30', '27', '5', '소규모 세그먼트'] },
    { cells: ['/28', '255.255.255.240', '14', '28', '4', '서버 DMZ 등'] },
    { cells: ['/30', '255.255.255.252', '2', '30', '2', 'Point-to-Point 링크'] },
    { cells: ['/32', '255.255.255.255', '1', '32', '0', '단일 호스트'] },
]

const routingProtocolRows = [
    { cells: ['정적 라우팅', '관리자 수동 설정', '간단', '소규모 네트워크, 기본 경로'] },
    { cells: ['RIP', 'Distance Vector', 'Hop count (최대 15)', '소규모, 학습용'] },
    { cells: ['OSPF', 'Link State', 'Cost (대역폭 기반)', '기업 내부 (IGP)'] },
    { cells: ['BGP', 'Path Vector', 'AS 경로, 정책', '인터넷 (ISP 간 EGP)'] },
    { cells: ['EIGRP', 'Advanced Distance Vector', '대역폭+지연', 'Cisco 장비 환경'] },
]

const ipv6vs4Rows = [
    { cells: ['주소 길이', '32비트 (약 43억 개)', '128비트 (약 3.4 x 10^38 개)'] },
    { cells: ['표기법', 'Dotted Decimal (192.168.1.1)', 'Colon Hex (2001:db8::1)'] },
    { cells: ['헤더 크기', '20~60 바이트 (옵션 가변)', '40 바이트 (고정)'] },
    { cells: ['브로드캐스트', '지원 (255.255.255.255)', '없음 (멀티캐스트로 대체)'] },
    { cells: ['NAT', '필수적으로 사용', '불필요 (충분한 주소)'] },
    { cells: ['자동 구성', 'DHCP 필요', 'SLAAC / DHCPv6'] },
    { cells: ['보안', 'IPsec 선택', 'IPsec 기본 지원'] },
    { cells: ['체크섬', 'IP 헤더에 포함', '상위 계층에 위임'] },
]

/* ── component ────────────────────────────────────────────────── */

export default function Topic04() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-14">
            {/* Header */}
            <header className="space-y-3">
                <p className="text-xs font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                    Topic 04
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    IP 주소와 라우팅의 기초
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    IP Addressing & Routing
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    IP 주소 체계와 서브넷팅을 이해하고, 라우팅 테이블이 패킷의 경로를 결정하는
                    과정을 학습합니다. IPv4의 구조부터 Longest Prefix Match, 그리고 IPv6까지
                    네트워크 계층의 핵심 개념을 다룹니다.
                </p>
            </header>

            <LearningCard
                topicId="04-ip-routing"
                items={[
                    'IPv4/IPv6 주소 체계를 이해한다',
                    '서브넷팅과 CIDR 표기법을 활용할 수 있다',
                    '라우팅 테이블과 longest prefix match를 설명할 수 있다',
                ]}
            />

            {/* ── 4.1 IPv4 주소 구조 ─────────────────────────────── */}
            <Section id="s041" title="4.1  IPv4 주소 구조">
                <Prose>
                    IPv4 주소는 32비트 숫자로, 네트워크 상의 장치를 고유하게 식별합니다.
                    사람이 읽기 쉽도록 8비트(1바이트)씩 4개의 옥텟으로 나누고, 각 옥텟을
                    10진수로 변환하여 점(dot)으로 구분합니다. 이를{' '}
                    <InlineCode>
                        Dotted Decimal Notation
                    </InlineCode>
                    이라 합니다.
                </Prose>

                <SubnetDiagram />

                <CardGrid cols={4}>
                    <StatCard title="주소 길이" value="32 bits" color="blue" desc="4바이트 = 4 옥텟" />
                    <StatCard title="최대 주소 수" value="2^32" color="purple" desc="약 43억 개" />
                    <StatCard title="옥텟 범위" value="0 ~ 255" color="green" desc="각 옥텟 8비트" />
                    <StatCard title="표기법" value="a.b.c.d" color="amber" desc="Dotted Decimal" />
                </CardGrid>

                <InfoBox color="blue" title="IPv4 주소 클래스 (전통적 분류)">
                    인터넷 초기에는 IP 주소를 A~E 다섯 클래스로 분류했습니다.
                    현재는 CIDR로 대체되었지만, 사설 IP 대역과 기본 서브넷을 이해하는 데 여전히 유용합니다.
                </InfoBox>

                <InfoTable
                    headers={['클래스', '범위', '첫 비트', '기본 프리픽스', 'Net/Host bits', '용도']}
                    rows={ipClassRows}
                />

                <InfoBox color="amber" title="사설 IP 주소 (Private Address)">
                    인터넷에서 라우팅되지 않는 내부 전용 주소입니다.
                    NAT를 통해 공인 IP로 변환되어 외부와 통신합니다.
                </InfoBox>

                <InfoTable
                    headers={['대역', '범위', '호스트 수', '클래스', '주 사용처']}
                    rows={privateIpRows}
                />

                <div className="flex flex-wrap gap-2">
                    <RfcRef rfc={791} label="RFC 791 — IPv4" />
                    <RfcRef rfc={1918} label="RFC 1918 — Private Addresses" />
                </div>

                <CodeBlock code={ipAddrShowCode} language="bash" filename="ip addr / ipconfig" />
            </Section>

            {/* ── 4.2 서브넷 마스크와 CIDR ──────────────────────── */}
            <Section id="s042" title="4.2  서브넷 마스크와 CIDR">
                <Prose>
                    <T id="subnet">서브넷</T> 마스크(Subnet Mask)는 IP 주소에서 네트워크 부분과 호스트 부분의
                    경계를 정의합니다. IP 주소와 서브넷 마스크를 AND 연산하면 네트워크 주소를
                    구할 수 있습니다. <T id="cidr">CIDR</T>(Classless Inter-Domain Routing)은 클래스에 구애받지
                    않고 프리픽스 길이로 네트워크를 유연하게 분할합니다.
                </Prose>

                <InfoBox color="green" title="서브넷 마스크 동작 원리">
                    <p>서브넷 마스크의 1인 비트 위치 = 네트워크 부분</p>
                    <p>서브넷 마스크의 0인 비트 위치 = 호스트 부분</p>
                    <p className="mt-1 font-mono">IP AND Mask = Network Address</p>
                    <p className="font-mono">예) 192.168.1.100 AND 255.255.255.0 = 192.168.1.0</p>
                </InfoBox>

                <InfoTable
                    headers={['CIDR', '서브넷 마스크', '호스트 수', 'Net bits', 'Host bits', '참고']}
                    rows={cidrRows}
                />

                <Alert variant="tip" title="서브넷팅 공식:">
                    사용 가능한 호스트 수 = 2^(호스트 비트 수) - 2. 네트워크 주소(모든 호스트 비트 = 0)와
                    브로드캐스트 주소(모든 호스트 비트 = 1)는 호스트에 할당할 수 없습니다.
                </Alert>

                <CodeBlock code={subnetCalcCode} language="text" filename="서브넷 계산 예제" />

                <RfcRef rfc={4632} label="RFC 4632 — CIDR" />
            </Section>

            {/* ── 4.3 네트워크 주소와 브로드캐스트 주소 ────────── */}
            <Section id="s043" title="4.3  네트워크 주소와 브로드캐스트 주소">
                <Prose>
                    네트워크 주소는 호스트 비트가 모두 0인 주소로, 해당 서브넷 자체를 식별합니다.
                    브로드캐스트 주소는 호스트 비트가 모두 1인 주소로, 같은 서브넷의 모든 호스트에
                    동시 전송할 때 사용됩니다.
                </Prose>

                <CardGrid cols={3}>
                    <InfoBox color="blue" title="네트워크 주소">
                        <p className="font-mono">192.168.1.0/24</p>
                        <p>호스트 비트 전부 0</p>
                        <p>서브넷의 식별자 역할</p>
                        <p>라우팅 테이블 엔트리에 사용</p>
                    </InfoBox>
                    <InfoBox color="amber" title="브로드캐스트 주소">
                        <p className="font-mono">192.168.1.255</p>
                        <p>호스트 비트 전부 1</p>
                        <p>같은 서브넷 내 모든 호스트에 전달</p>
                        <p>ARP, DHCP 등에서 사용</p>
                    </InfoBox>
                    <InfoBox color="green" title="호스트 주소">
                        <p className="font-mono">192.168.1.1 ~ .254</p>
                        <p>네트워크, 브로드캐스트 제외</p>
                        <p>실제 장치에 할당 가능한 주소</p>
                        <p>/24 기준 총 254개</p>
                    </InfoBox>
                </CardGrid>

                <Alert variant="info" title="호스트 주소 개념:">
                    호스트 주소란 서브넷 내에서 개별 장치(호스트)에 할당할 수 있는 주소입니다.
                    네트워크 주소와 브로드캐스트 주소를 제외한 나머지가 호스트 주소 범위가 됩니다.
                    예를 들어 192.168.1.0/24에서 호스트 주소는 192.168.1.1부터 192.168.1.254까지입니다.
                </Alert>

                <InfoTable
                    headers={['서브넷', '네트워크 주소', '첫 호스트', '마지막 호스트', '브로드캐스트', '호스트 수']}
                    rows={[
                        { cells: ['192.168.1.0/24', '192.168.1.0', '192.168.1.1', '192.168.1.254', '192.168.1.255', '254'] },
                        { cells: ['10.0.0.0/8', '10.0.0.0', '10.0.0.1', '10.255.255.254', '10.255.255.255', '16,777,214'] },
                        { cells: ['172.16.0.0/26', '172.16.0.0', '172.16.0.1', '172.16.0.62', '172.16.0.63', '62'] },
                        { cells: ['192.168.5.128/25', '192.168.5.128', '192.168.5.129', '192.168.5.254', '192.168.5.255', '126'] },
                    ]}
                />
            </Section>

            {/* ── 4.4 기본 게이트웨이 ──────────────────────────── */}
            <Section id="s044" title="4.4  기본 게이트웨이">
                <Prose>
                    기본 게이트웨이(Default Gateway)는 호스트가 자신의 서브넷 바깥에 있는
                    목적지로 패킷을 보낼 때 사용하는 &quot;출구&quot; 라우터의 IP 주소입니다.
                    호스트는 목적지 IP가 자신의 서브넷에 없으면 패킷을 기본 게이트웨이로 전달합니다.
                </Prose>

                <InfoBox color="indigo" title="기본 게이트웨이 동작 원리">
                    <p>1. 호스트가 패킷을 보내려 함</p>
                    <p>2. 목적지 IP와 자신의 서브넷 마스크를 AND 연산</p>
                    <p>3. 결과가 자신의 네트워크 주소와 같으면 → 같은 서브넷 (직접 전달)</p>
                    <p>4. 다르면 → 다른 네트워크 → 기본 게이트웨이로 패킷 전달</p>
                    <p className="mt-1 font-semibold">게이트웨이는 반드시 호스트와 같은 서브넷에 있어야 합니다.</p>
                </InfoBox>

                <CardGrid cols={2}>
                    <StatCard
                        title="가정 환경"
                        value="192.168.1.1"
                        color="cyan"
                        desc="공유기(라우터)의 LAN 측 IP가 기본 게이트웨이"
                    />
                    <StatCard
                        title="기업 환경"
                        value="10.0.1.1"
                        color="teal"
                        desc="코어/디스트리뷰션 라우터의 VLAN 인터페이스"
                    />
                </CardGrid>

                <Alert variant="warning" title="잘못된 게이트웨이 설정:">
                    기본 게이트웨이가 설정되지 않으면 같은 서브넷 내부 통신만 가능합니다.
                    인터넷이나 다른 서브넷으로의 연결이 불가능하므로, 네트워크 장애 시
                    가장 먼저 확인해야 할 항목 중 하나입니다.
                </Alert>
            </Section>

            {/* ── 4.5 라우터의 역할 ────────────────────────────── */}
            <Section id="s045" title="4.5  라우터의 역할">
                <Prose>
                    라우터(Router)는 서로 다른 네트워크를 연결하고, 패킷의 목적지 IP를 보고
                    최적의 경로로 전달(forwarding)하는 Layer 3 장비입니다. 스위치가 MAC 주소
                    기반으로 같은 네트워크 내에서 프레임을 전달한다면, 라우터는 IP 주소 기반으로
                    네트워크 간 패킷을 전달합니다.
                </Prose>

                <CardGrid cols={2}>
                    <InfoBox color="blue" title="라우터의 주요 기능">
                        <p>1. 패킷 포워딩 — 라우팅 테이블 기반 경로 결정</p>
                        <p>2. 네트워크 분리 — 브로드캐스트 도메인 분할</p>
                        <p>3. 경로 학습 — 라우팅 프로토콜로 최적 경로 계산</p>
                        <p>4. NAT/PAT — 사설 IP ↔ 공인 IP 변환</p>
                        <p>5. ACL — 접근 제어를 통한 보안</p>
                    </InfoBox>
                    <InfoBox color="purple" title="스위치 vs 라우터">
                        <p>스위치: L2, MAC 주소, 같은 네트워크 내 프레임 전달</p>
                        <p>라우터: L3, IP 주소, 서로 다른 네트워크 간 패킷 전달</p>
                        <p className="mt-1">라우터는 각 인터페이스마다 서로 다른 서브넷의 IP를 가집니다.</p>
                        <p>패킷이 라우터를 지날 때마다 L2 헤더(MAC)는 교체되지만 L3 헤더(IP)는 유지됩니다.</p>
                    </InfoBox>
                </CardGrid>

                <Alert variant="tip" title="L3 스위치:">
                    현대 네트워크에서는 라우팅 기능을 내장한 L3 스위치가 널리 사용됩니다.
                    하드웨어(ASIC)로 라우팅을 처리하여 소프트웨어 라우터보다 빠른 포워딩이 가능합니다.
                </Alert>
            </Section>

            {/* ── 4.6 라우팅 테이블 ────────────────────────────── */}
            <Section id="s046" title="4.6  라우팅 테이블">
                <Prose>
                    <T id="routing-table">라우팅 테이블</T>은 라우터(또는 호스트)가 패킷을 어디로 보낼지 결정하는 &quot;지도&quot;입니다.
                    각 엔트리는 목적지 네트워크, 넥스트 홉(게이트웨이), 출력 인터페이스, 메트릭 등의
                    정보를 포함합니다.
                </Prose>

                <InfoTable
                    headers={['항목', '설명', '예시']}
                    rows={[
                        { cells: ['Destination', '목적지 네트워크 (CIDR)', '10.1.2.0/24'] },
                        { cells: ['Gateway', '다음 홉 라우터의 IP', '10.0.0.1'] },
                        { cells: ['Interface', '패킷을 내보낼 인터페이스', 'eth0, eth1'] },
                        { cells: ['Metric', '경로 우선순위 (낮을수록 우선)', '100'] },
                        { cells: ['Protocol', '경로 학습 방법', 'static, dhcp, ospf'] },
                        { cells: ['Default Route', '매칭 경로 없을 때의 기본 경로', '0.0.0.0/0'] },
                    ]}
                />

                <CodeBlock code={ipRouteShowCode} language="bash" filename="ip route / route print" />

                <Alert variant="info" title="경로 학습 방법:">
                    직접 연결(Connected) — 라우터 인터페이스에 설정된 서브넷은 자동 등록됩니다.
                    정적(Static) — 관리자가 수동으로 추가합니다.
                    동적(Dynamic) — OSPF, BGP 등 라우팅 프로토콜이 자동으로 학습합니다.
                </Alert>
            </Section>

            {/* ── 4.7 Longest Prefix Match ────────────────────── */}
            <Section id="s047" title="4.7  Longest Prefix Match">
                <Prose>
                    라우팅 테이블에 여러 엔트리가 목적지 IP와 매치될 수 있습니다. 이때 라우터는
                    가장 긴 프리픽스(가장 구체적인 경로)를 선택합니다. 이것이
                    <InlineCode>
                        Longest Prefix Match
                    </InlineCode>
                    알고리즘입니다. 예를 들어, 10.1.2.5로 가는 패킷은 /8, /16, /24 모두 매치되지만,
                    가장 구체적인 /24가 선택됩니다.
                </Prose>

                <RoutingTableViz />

                <InfoBox color="green" title="Longest Prefix Match 핵심 원리">
                    <p>1. 목적지 IP를 라우팅 테이블의 모든 엔트리와 비교</p>
                    <p>2. 매치되는 엔트리가 여러 개이면 프리픽스가 가장 긴 것을 선택</p>
                    <p>3. /32 (호스트 라우트)가 가장 구체적, /0 (기본 라우트)이 가장 일반적</p>
                    <p>4. 어떤 엔트리도 매치되지 않으면 → 기본 라우트(0.0.0.0/0)로 전달</p>
                    <p>5. 기본 라우트도 없으면 → ICMP Destination Unreachable 반환</p>
                </InfoBox>

                <Alert variant="tip" title="실무 포인트:">
                    Longest Prefix Match는 라우팅의 가장 중요한 원칙입니다.
                    방화벽 정책, 클라우드 VPC 라우팅, 컨테이너 네트워크 모두 이 원리를 따릅니다.
                    &quot;더 구체적인 경로가 항상 이긴다&quot;를 기억하세요.
                </Alert>
            </Section>

            {/* ── 4.8 정적 라우팅과 동적 라우팅 ──────────────── */}
            <Section id="s048" title="4.8  정적 라우팅과 동적 라우팅">
                <Prose>
                    정적 라우팅은 관리자가 경로를 직접 설정하는 방식이며, 동적 라우팅은 라우팅
                    프로토콜을 통해 라우터들이 자동으로 경로 정보를 교환하는 방식입니다.
                    소규모 네트워크에서는 정적 라우팅이 적합하고, 대규모/복잡한 환경에서는
                    동적 라우팅이 필수적입니다.
                </Prose>

                <CardGrid cols={2}>
                    <InfoBox color="blue" title="정적 라우팅 (Static Routing)">
                        <p>관리자가 수동으로 경로 추가/삭제</p>
                        <p>라우팅 프로토콜 오버헤드 없음</p>
                        <p>네트워크 변화에 자동 대응 불가</p>
                        <p>소규모 네트워크, 기본 경로에 적합</p>
                        <p className="font-mono mt-1">ip route add 10.0.0.0/8 via 10.0.0.1</p>
                    </InfoBox>
                    <InfoBox color="purple" title="동적 라우팅 (Dynamic Routing)">
                        <p>라우팅 프로토콜이 자동으로 경로 학습</p>
                        <p>링크 장애 시 대체 경로 자동 전환</p>
                        <p>CPU/메모리/대역폭 오버헤드 존재</p>
                        <p>대규모 네트워크에 필수</p>
                        <p className="font-mono mt-1">OSPF, BGP, RIP, EIGRP</p>
                    </InfoBox>
                </CardGrid>

                <InfoTable
                    headers={['프로토콜', '분류', '메트릭', '주 사용처']}
                    rows={routingProtocolRows}
                />

                <Alert variant="info" title="IGP vs EGP:">
                    IGP(Interior Gateway Protocol)는 하나의 AS(자율 시스템) 내부에서 사용하고 (<T id="ospf">OSPF</T>, RIP),
                    EGP(Exterior Gateway Protocol)는 AS 간에 사용합니다 (<T id="bgp">BGP</T>).
                    인터넷은 수만 개의 AS가 BGP로 연결된 거대한 네트워크입니다.
                </Alert>

                <div className="flex flex-wrap gap-2">
                    <RfcRef rfc={2328} label="RFC 2328 — OSPF v2" />
                    <RfcRef rfc={4271} label="RFC 4271 — BGP-4" />
                </div>
            </Section>

            {/* ── 4.9 TTL과 hop ─────────────────────────────── */}
            <Section id="s049" title="4.9  TTL과 hop">
                <Prose>
                    TTL(Time To Live)은 IP 헤더에 포함된 필드로, 패킷이 네트워크에서 무한히
                    순환하는 것을 방지합니다. 패킷이 라우터를 하나 지날 때마다(=1 hop) TTL이
                    1씩 감소하며, TTL이 0이 되면 라우터는 패킷을 폐기하고 출발지에
                    ICMP Time Exceeded 메시지를 보냅니다.
                </Prose>

                <CardGrid cols={4}>
                    <StatCard title="Linux 기본 TTL" value="64" color="green" desc="리눅스 시스템 기본값" />
                    <StatCard title="Windows 기본" value="128" color="blue" desc="윈도우 시스템 기본값" />
                    <StatCard title="Cisco 기본" value="255" color="purple" desc="라우터/스위치 장비" />
                    <StatCard title="최대 TTL" value="255" color="amber" desc="8비트 필드 (0~255)" />
                </CardGrid>

                <InfoBox color="cyan" title="TTL의 활용: traceroute">
                    <p>traceroute는 TTL을 1부터 순서대로 증가시키며 패킷을 보냅니다.</p>
                    <p>TTL=1 → 첫 번째 라우터가 Time Exceeded 응답 → 첫 번째 hop 발견</p>
                    <p>TTL=2 → 두 번째 라우터가 Time Exceeded 응답 → 두 번째 hop 발견</p>
                    <p>이를 반복하여 목적지까지의 전체 경로를 추적합니다.</p>
                </InfoBox>

                <CodeBlock code={tracerouteCode} language="bash" filename="traceroute" />

                <Alert variant="tip" title="hop 개념:">
                    hop은 패킷이 하나의 라우터를 거치는 것을 의미합니다.
                    인터넷에서 일반적인 목적지까지 보통 10~20 hop 정도이며,
                    hop 수가 적을수록 지연(latency)이 낮습니다.
                </Alert>
            </Section>

            {/* ── 4.10 IPv6 기초 ───────────────────────────────── */}
            <Section id="s0410" title="4.10  IPv6 기초">
                <Prose>
                    IPv4의 주소 고갈 문제를 해결하기 위해 설계된 IPv6는 128비트 주소 체계를
                    사용합니다. 약 3.4 x 10^38개의 주소를 제공하여 사실상 무한한 장치에
                    고유 주소를 부여할 수 있습니다. 단순화된 헤더, 자동 구성, 기본 IPsec 지원 등
                    다양한 개선 사항을 포함합니다.
                </Prose>

                <InfoBox color="violet" title="IPv6 주소 표기법">
                    <p>128비트를 16비트씩 8개 그룹으로 나누고, 각 그룹을 16진수로 표기합니다.</p>
                    <p className="font-mono mt-1">2001:0db8:0000:0000:0000:0000:0000:0001</p>
                    <p className="mt-1">축약 규칙: 앞의 0 생략 + 연속된 0 그룹은 :: 으로 한 번만 축약</p>
                    <p className="font-mono">→ 2001:db8::1</p>
                </InfoBox>

                <InfoTable
                    headers={['항목', 'IPv4', 'IPv6']}
                    rows={ipv6vs4Rows}
                />

                <CardGrid cols={3}>
                    <InfoBox color="blue" title="글로벌 유니캐스트">
                        <p className="font-mono">2000::/3</p>
                        <p>인터넷에서 라우팅 가능한 공인 주소</p>
                        <p>IPv4의 공인 IP에 해당</p>
                    </InfoBox>
                    <InfoBox color="green" title="링크 로컬">
                        <p className="font-mono">fe80::/10</p>
                        <p>같은 링크(서브넷) 내에서만 유효</p>
                        <p>자동으로 생성됨 (NDP)</p>
                    </InfoBox>
                    <InfoBox color="purple" title="루프백">
                        <p className="font-mono">::1/128</p>
                        <p>자기 자신을 가리키는 주소</p>
                        <p>IPv4의 127.0.0.1에 해당</p>
                    </InfoBox>
                </CardGrid>

                <CodeBlock code={ipv6ExampleCode} language="bash" filename="IPv6 명령어" />

                <div className="flex flex-wrap gap-2">
                    <RfcRef rfc={8200} label="RFC 8200 — IPv6" />
                    <RfcRef rfc={4291} label="RFC 4291 — IPv6 주소 체계" />
                </div>
            </Section>

            {/* ── 4.11 요약 ────────────────────────────────────── */}
            <Section id="s0411" title="4.11  요약">
                <CardGrid cols={2}>
                    <InfoBox color="blue" title="IPv4 주소 체계">
                        32비트, Dotted Decimal 표기. 네트워크 부분과 호스트 부분으로 나뉘며,
                        서브넷 마스크(CIDR)가 그 경계를 결정합니다.
                    </InfoBox>
                    <InfoBox color="green" title="서브넷팅">
                        CIDR로 유연하게 네트워크 분할. 네트워크 주소(호스트 비트 전부 0),
                        브로드캐스트 주소(호스트 비트 전부 1)를 제외한 나머지가 호스트 주소입니다.
                    </InfoBox>
                    <InfoBox color="amber" title="라우팅">
                        라우터는 라우팅 테이블을 기반으로 패킷을 포워딩합니다.
                        Longest Prefix Match로 가장 구체적인 경로를 선택합니다.
                    </InfoBox>
                    <InfoBox color="purple" title="TTL과 IPv6">
                        TTL은 패킷 루프를 방지하고 traceroute의 기반 원리입니다.
                        IPv6는 128비트 주소로 주소 고갈을 해결합니다.
                    </InfoBox>
                </CardGrid>

                <Alert variant="tip" title="다음 단계:">
                    Topic 05에서는 전송 계층(TCP/UDP)을 학습합니다.
                    IP 계층이 호스트 간 패킷 전달을 담당한다면, 전송 계층은
                    포트 번호를 통해 프로세스 간 통신을 보장합니다.
                </Alert>
            </Section>

            <TopicNavigation topicId="04-ip-routing" />
        </div>
    )
}
