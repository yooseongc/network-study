import { EthernetFrameDiagram } from '../../components/concepts/link/EthernetFrameDiagram'
import { ArpFlowDiagram } from '../../components/concepts/link/ArpFlowDiagram'
import { Alert, CardGrid, CodeBlock, InfoBox, InfoTable, InlineCode, LearningCard, Prose, Section, StatCard, T, TopicNavigation } from '@study-ui/components'
import {
    ipLinkShowCode,
    arpTableCode,
    bridgeFdbCode,
    ethtoolCode,
    vlanConfigCode,
    bondingCode,
    macAddressCode,
    gratuitousArpCode,
} from './codeSnippets'

/* ── inline data ── */

const ethernetFrameRows = [
    { cells: ['Preamble', '7 bytes', '클럭 동기화를 위한 10101010... 패턴'] },
    { cells: ['SFD (Start Frame Delimiter)', '1 byte', '10101011 — 프레임 시작 신호'] },
    { cells: ['Destination MAC', '6 bytes', '수신 호스트의 MAC 주소'] },
    { cells: ['Source MAC', '6 bytes', '송신 호스트의 MAC 주소'] },
    { cells: ['EtherType / Length', '2 bytes', '0x0800=IPv4, 0x0806=ARP, 0x86DD=IPv6'] },
    { cells: ['Payload', '46~1500 bytes', '상위 계층 데이터 (MTU 범위)'] },
    { cells: ['FCS (Frame Check Sequence)', '4 bytes', 'CRC-32 오류 검출 코드'] },
]

const nicFunctionRows = [
    { cells: ['프레임 송수신', '전기/광 신호 ↔ 디지털 데이터 변환'] },
    { cells: ['MAC 주소 저장', '제조 시 고유 MAC 주소를 ROM에 기록'] },
    { cells: ['프레임 필터링', '자신의 MAC 또는 브로드캐스트만 수신'] },
    { cells: ['CRC 검증', 'FCS를 이용해 프레임 오류를 검출'] },
    { cells: ['인터럽트 발생', '패킷 수신 시 CPU에 인터럽트 전달'] },
    { cells: ['Offloading', 'TSO, GSO, 체크섬 계산 등을 하드웨어에서 처리'] },
]

const switchActionRows = [
    { cells: ['Learning', '수신 프레임의 Source MAC → 포트 매핑을 MAC 테이블에 기록'] },
    { cells: ['Flooding', 'Destination MAC이 테이블에 없으면 수신 포트 제외 모든 포트로 전송'] },
    { cells: ['Forwarding', 'Destination MAC이 테이블에 있으면 해당 포트로만 전달'] },
    { cells: ['Filtering', '출발지와 목적지가 같은 포트면 프레임 폐기'] },
    { cells: ['Aging', '일정 시간(보통 300초) 미사용 엔트리 자동 삭제'] },
]

const castTypeRows = [
    { cells: ['유니캐스트 (Unicast)', '1:1', '특정 MAC 주소로 전송', '일반 통신'] },
    { cells: ['브로드캐스트 (Broadcast)', '1:All', 'FF:FF:FF:FF:FF:FF', 'ARP Request, DHCP'] },
    { cells: ['멀티캐스트 (Multicast)', '1:Group', '01:00:5E:xx:xx:xx (IPv4)', 'OSPF, 스트리밍'] },
]

const vlanTagRows = [
    { cells: ['TPID', '2 bytes', '0x8100 (802.1Q 태그 식별)'] },
    { cells: ['PCP (Priority)', '3 bits', 'QoS 우선순위 (0~7)'] },
    { cells: ['DEI', '1 bit', 'Drop Eligible Indicator'] },
    { cells: ['VID (VLAN ID)', '12 bits', 'VLAN 번호 (0~4095, 유효: 1~4094)'] },
]

const portTypeRows = [
    { cells: ['Access Port', '하나의 VLAN에만 소속', '태그 없이 전송', 'PC, 서버 연결'] },
    { cells: ['Trunk Port', '여러 VLAN 트래픽 전달', '802.1Q 태그 포함', '스위치 간 연결'] },
]

const bondingModeRows = [
    { cells: ['mode 0', 'balance-rr', '라운드 로빈 — 패킷을 순서대로 분산'] },
    { cells: ['mode 1', 'active-backup', '하나만 활성, 나머지 대기 (장애 시 자동 전환)'] },
    { cells: ['mode 2', 'balance-xor', 'XOR 해시 기반 분산'] },
    { cells: ['mode 4', '802.3ad (LACP)', '스위치와 협상하여 동적 링크 집합 구성'] },
    { cells: ['mode 5', 'balance-tlb', '송신 부하 분산 (Adaptive TX)'] },
    { cells: ['mode 6', 'balance-alb', '송수신 모두 부하 분산 (Adaptive)'] },
]

const linkStateRows = [
    { cells: ['Speed', '10/100/1000/10000 Mbps', '링크의 전송 속도'] },
    { cells: ['Duplex', 'Half / Full', '반이중(교대) vs 전이중(동시)'] },
    { cells: ['Auto-negotiation', 'on / off', '속도와 듀플렉스 자동 협상'] },
    { cells: ['Link detected', 'yes / no', '물리적 링크 연결 상태'] },
    { cells: ['Carrier', 'UP / DOWN', '캐리어 신호 감지 여부'] },
]

export default function Topic03() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-14">
            {/* ── Header ── */}
            <header className="space-y-3">
                <p className="text-xs font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                    Topic 03
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    물리 계층과 링크 계층
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    Physical & Link Layer
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    네트워크 통신의 가장 낮은 두 계층을 살펴봅니다. Ethernet 프레임이 어떻게 구성되는지,
                    스위치가 MAC 주소를 학습하여 효율적으로 패킷을 전달하는 과정을 이해하고,
                    VLAN과 NIC bonding 등 실무 기술을 학습합니다.
                </p>
            </header>

            <LearningCard
                topicId="03-link-layer"
                items={[
                    'Ethernet 프레임 구조를 이해한다',
                    'NIC의 역할과 MAC 주소의 의미를 설명할 수 있다',
                    '스위치의 MAC 테이블 동작(Learning, Flooding, Forwarding)을 설명할 수 있다',
                    'ARP 동작 과정과 Gratuitous ARP의 용도를 이해한다',
                    'VLAN과 802.1Q 태깅의 원리를 파악한다',
                    'NIC bonding/LACP의 기본 개념을 이해한다',
                ]}
            />

            {/* ── 3.1 Ethernet 기본 구조 ── */}
            <Section id="s031" title="3.1  Ethernet의 기본 구조">
                <Prose>
                    Ethernet은 IEEE 802.3 표준으로 정의된 LAN 기술로, 현대 유선 네트워크의 사실상 표준입니다.
                    데이터는 <InlineCode>프레임(Frame)</InlineCode>이라는
                    단위로 캡슐화되어 전송됩니다.
                </Prose>

                <EthernetFrameDiagram />

                <InfoTable
                    headers={['필드', '크기', '설명']}
                    rows={ethernetFrameRows}
                />

                <CardGrid cols={3}>
                    <StatCard title="최소 프레임 크기" value="64 bytes" color="blue" desc="Preamble/SFD 제외" />
                    <StatCard title="최대 프레임 크기" value="1518 bytes" color="green" desc="헤더 14B + 페이로드 1500B + FCS 4B" />
                    <StatCard title="Jumbo Frame" value="9000+ bytes" color="purple" desc="데이터센터 환경에서 사용" />
                </CardGrid>

                <Alert variant="info" title="EtherType vs Length">
                    필드 값이 1536(0x0600) 이상이면 EtherType(프로토콜 식별), 이하이면 Length(페이로드 크기)로 해석합니다.
                    현대 네트워크에서는 대부분 EtherType으로 사용됩니다.
                </Alert>
            </Section>

            {/* ── 3.2 NIC의 역할 ── */}
            <Section id="s032" title="3.2  NIC(Network Interface Card)의 역할">
                <Prose>
                    NIC는 컴퓨터를 네트워크에 연결하는 하드웨어 장치입니다. 물리 계층에서 전기/광 신호를
                    디지털 데이터로 변환하고, 링크 계층에서 프레임의 송수신과 <T id="mac-address">MAC 주소</T> 기반 필터링을 수행합니다.
                </Prose>

                <InfoTable
                    headers={['기능', '설명']}
                    rows={nicFunctionRows}
                />

                <InfoBox color="cyan" title="NIC와 커널의 협력">
                    NIC가 패킷을 수신하면 DMA(Direct Memory Access)를 통해 커널 메모리의 링 버퍼에 직접 기록하고,
                    인터럽트(또는 NAPI 폴링)를 통해 커널에 알립니다. 이 과정은 Topic 08에서 자세히 다룹니다.
                </InfoBox>

                <CodeBlock code={ipLinkShowCode} language="bash" filename="ip link show" />
                <CodeBlock code={ethtoolCode} language="bash" filename="ethtool eth0" />
            </Section>

            {/* ── 3.3 MAC 주소 ── */}
            <Section id="s033" title="3.3  MAC 주소의 의미">
                <Prose>
                    MAC(Media Access Control) 주소는 NIC에 할당된 48비트(6바이트) 고유 식별자입니다.
                    16진수 표기로 <InlineCode>08:00:27:A1:B2:C3</InlineCode> 형태로 나타냅니다.
                </Prose>

                <InfoBox color="blue" title="MAC 주소 구조 (48 bits)">
                    <div className="space-y-2">
                        <div>
                            <strong>상위 24비트 — OUI (Organizationally Unique Identifier)</strong>
                            <br />IEEE에서 제조사에 할당. 예: 00:50:56 = VMware, 08:00:27 = VirtualBox
                        </div>
                        <div>
                            <strong>하위 24비트 — Device ID</strong>
                            <br />제조사가 각 NIC에 순차 할당하는 일련번호
                        </div>
                    </div>
                </InfoBox>

                <InfoTable
                    headers={['OUI (상위 3바이트)', '제조사', 'MAC 주소 예시']}
                    rows={[
                        { cells: ['00:50:56', 'VMware', '00:50:56:C0:00:08'] },
                        { cells: ['08:00:27', 'Oracle VirtualBox', '08:00:27:A1:B2:C3'] },
                        { cells: ['02:42:xx', 'Docker (locally administered)', '02:42:AC:11:00:02'] },
                        { cells: ['00:1A:2B', 'Cisco', '00:1A:2B:3C:4D:5E'] },
                        { cells: ['FF:FF:FF', '(Broadcast)', 'FF:FF:FF:FF:FF:FF'] },
                    ]}
                />

                <Alert variant="tip" title="로컬 관리 MAC 주소">
                    첫 번째 옥텟의 두 번째 비트(U/L 비트)가 1이면 로컬 관리 주소입니다.
                    Docker, VM 하이퍼바이저 등은 이 비트를 설정하여 MAC 충돌을 방지합니다.
                    예: <InlineCode>02:xx:xx:xx:xx:xx</InlineCode>
                </Alert>

                <CodeBlock code={macAddressCode} language="bash" filename="MAC 주소 확인 및 변경" />
            </Section>

            {/* ── 3.4 스위치의 동작 원리 ── */}
            <Section id="s034" title="3.4  스위치의 동작 원리">
                <Prose>
                    L2 스위치는 MAC 주소를 기반으로 프레임을 전달하는 네트워크 장비입니다.
                    허브(Hub)와 달리 MAC 주소 테이블을 유지하여 필요한 포트에만 프레임을 전달하므로
                    불필요한 트래픽을 줄이고 충돌 도메인을 분리합니다.
                </Prose>

                <InfoTable
                    headers={['동작', '설명']}
                    rows={switchActionRows}
                />

                <CardGrid cols={2}>
                    <InfoBox color="green" title="Learning (학습)">
                        프레임이 포트 1에서 들어오면, 스위치는 Source MAC 주소와 포트 1의 매핑을
                        MAC 테이블에 기록합니다. 같은 MAC이 다른 포트에서 들어오면 테이블을 갱신합니다.
                    </InfoBox>
                    <InfoBox color="amber" title="Flooding (플러딩)">
                        Destination MAC이 테이블에 없거나 브로드캐스트(FF:FF:FF:FF:FF:FF)인 경우,
                        수신 포트를 제외한 모든 포트로 프레임을 복제 전송합니다.
                    </InfoBox>
                </CardGrid>

                <Alert variant="warning" title="MAC Flooding 공격">
                    공격자가 대량의 가짜 MAC 주소를 전송하면 MAC 테이블이 가득 차서 스위치가
                    모든 프레임을 flooding하게 됩니다. Port Security 기능으로 포트당 MAC 수를 제한하여 방어합니다.
                </Alert>
            </Section>

            {/* ── 3.5 MAC 주소 테이블과 FDB ── */}
            <Section id="s035" title="3.5  MAC 주소 테이블과 FDB">
                <Prose>
                    스위치가 학습한 MAC 주소와 포트의 매핑 정보를 저장하는 테이블을
                    FDB(Forwarding Database) 또는 CAM Table이라고 합니다.
                    스위치는 프레임을 수신할 때마다 출발지 MAC을 FDB에 학습하고,
                    목적지 MAC을 FDB에서 조회하여 해당 포트로만 전달합니다.
                </Prose>

                <InfoTable
                    headers={['항목', '설명']}
                    rows={[
                        { cells: ['MAC 주소', '학습된 출발지 MAC 주소'] },
                        { cells: ['포트 (인터페이스)', '해당 MAC이 연결된 물리/가상 포트'] },
                        { cells: ['VLAN', '소속 VLAN 번호 (VLAN 지원 시)'] },
                        { cells: ['타입', 'dynamic(학습) / static(수동 설정) / permanent'] },
                        { cells: ['Aging Timer', '마지막 프레임 수신 후 경과 시간 (기본 300초)'] },
                    ]}
                />

                <CardGrid cols={2}>
                    <InfoBox color="blue" title="하드웨어 FDB (물리 스위치)">
                        ASIC/TCAM에 구현된 고속 MAC 테이블입니다.
                        와이어스피드로 조회하며, 엔트리 수는 칩에 따라 8K~128K개입니다.
                        Cisco에서는 <InlineCode>show mac address-table</InlineCode> 명령으로 확인합니다.
                    </InfoBox>
                    <InfoBox color="purple" title="소프트웨어 FDB (Linux Bridge)">
                        커널의 bridge 모듈이 관리하는 해시 테이블입니다.
                        <InlineCode>bridge fdb show</InlineCode> 명령으로 확인하며,
                        Docker/KVM 가상 네트워크에서 사용됩니다.
                    </InfoBox>
                </CardGrid>

                <InfoBox color="amber" title="FDB Aging과 Static Entry">
                    <ul className="list-disc ml-4 space-y-1 mt-1">
                        <li><strong>Aging (기본 300초)</strong>: 해당 MAC에서 프레임이 수신되지 않으면 엔트리를 자동 삭제합니다. 네트워크 변경(케이블 이동 등)을 자동 반영하기 위한 메커니즘입니다.</li>
                        <li><strong>Static Entry</strong>: 수동 등록된 엔트리로 aging되지 않습니다. 보안 목적(포트에 특정 MAC만 허용)이나 서비스 안정성을 위해 사용합니다.</li>
                        <li><strong>Permanent</strong>: 브릿지 자체의 MAC 주소처럼 삭제할 수 없는 영구 엔트리입니다.</li>
                    </ul>
                </InfoBox>

                <Alert variant="info" title="VXLAN에서의 FDB">
                    VXLAN 환경에서는 FDB가 원격 VTEP(VXLAN Tunnel Endpoint)의 IP를 함께 저장합니다.
                    목적지 MAC이 원격 호스트에 있으면 FDB에서 해당 VTEP IP를 조회하여
                    UDP 캡슐화 후 L3 네트워크를 통해 전달합니다.
                    <InlineCode>bridge fdb show dev vxlan0</InlineCode>으로 확인할 수 있습니다.
                </Alert>

                <CodeBlock code={bridgeFdbCode} language="bash" filename="bridge fdb show" />

                <StatCard
                    title="일반 스위치 MAC 테이블 크기"
                    value="8K ~ 128K entries"
                    color="teal"
                    desc="데이터센터 스위치는 더 큰 테이블을 지원합니다"
                />
            </Section>

            {/* ── 3.6 ARP 동작 과정 ── */}
            <Section id="s036" title="3.6  ARP 동작 과정">
                <Prose>
                    <T id="arp">ARP</T>(Address Resolution Protocol)는 IP 주소로부터 MAC 주소를 알아내는 프로토콜입니다.
                    L3(IP)에서 통신하려면 실제로 프레임을 보내야 하므로 목적지의 MAC 주소가 필요합니다.
                    ARP는 브로드캐스트를 사용하여 같은 네트워크 내의 호스트에게 MAC 주소를 질의합니다.
                </Prose>

                <ArpFlowDiagram />

                <CodeBlock code={arpTableCode} language="bash" filename="ARP 테이블 확인" />

                <InfoBox color="orange" title="Gratuitous ARP">
                    Gratuitous ARP는 자신의 IP에 대해 ARP Request를 보내는 특수한 ARP입니다.
                    주로 다음 상황에서 사용됩니다:
                    <ul className="list-disc ml-4 mt-2 space-y-1">
                        <li>IP 주소 충돌 감지 — 같은 IP를 가진 호스트가 있는지 확인</li>
                        <li>페일오버 — VRRP/HSRP 전환 시 다른 호스트의 ARP 캐시를 갱신</li>
                        <li>NIC 변경 — MAC 주소가 바뀌었음을 알림</li>
                    </ul>
                </InfoBox>

                <CodeBlock code={gratuitousArpCode} language="bash" filename="Gratuitous ARP 전송" />

                <Alert variant="danger" title="ARP Spoofing 주의">
                    ARP 프로토콜은 인증 메커니즘이 없어 공격자가 거짓 ARP Reply를 보내
                    트래픽을 가로챌 수 있습니다 (중간자 공격). Dynamic ARP Inspection(DAI)이나
                    Static ARP 엔트리로 방어합니다.
                </Alert>
            </Section>

            {/* ── 3.7 유니/브로드/멀티캐스트 ── */}
            <Section id="s037" title="3.7  유니캐스트, 브로드캐스트, 멀티캐스트">
                <Prose>
                    네트워크에서 데이터 전송 방식은 수신 대상의 수에 따라 세 가지로 분류됩니다.
                    각 방식은 목적지 MAC 주소 형태와 스위치의 처리 방식이 다릅니다.
                </Prose>

                <InfoTable
                    headers={['유형', '관계', '목적지 MAC', '대표 사례']}
                    rows={castTypeRows}
                />

                <CardGrid cols={3}>
                    <InfoBox color="blue" title="유니캐스트">
                        가장 일반적인 통신. 스위치는 MAC 테이블을 참조하여
                        목적지 포트로만 프레임을 전달합니다.
                    </InfoBox>
                    <InfoBox color="amber" title="브로드캐스트">
                        같은 <T id="vlan">VLAN</T>(브로드캐스트 도메인) 내 모든 호스트에게 전달됩니다.
                        과도한 브로드캐스트는 네트워크 성능 저하를 유발합니다.
                    </InfoBox>
                    <InfoBox color="purple" title="멀티캐스트">
                        IGMP Snooping을 사용하면 스위치가 멀티캐스트 그룹에
                        가입한 포트로만 전달하여 효율성을 높입니다.
                    </InfoBox>
                </CardGrid>

                <Alert variant="tip" title="브로드캐스트 도메인">
                    브로드캐스트가 도달하는 범위를 브로드캐스트 도메인이라 합니다.
                    라우터(L3 장비)는 브로드캐스트를 차단하므로, 서로 다른 서브넷은 다른 브로드캐스트 도메인입니다.
                    VLAN을 이용하면 하나의 물리 스위치에서도 브로드캐스트 도메인을 논리적으로 분리할 수 있습니다.
                </Alert>
            </Section>

            {/* ── 3.8 VLAN과 802.1Q ── */}
            <Section id="s038" title="3.8  VLAN과 802.1Q">
                <Prose>
                    VLAN(Virtual LAN)은 하나의 물리적 스위치를 여러 개의 논리적 네트워크로 분리하는 기술입니다.
                    IEEE 802.1Q 표준은 Ethernet 프레임에 4바이트 태그를 삽입하여 VLAN 정보를 전달합니다.
                </Prose>

                <InfoBox color="indigo" title="802.1Q 태그 구조 (4 bytes)">
                    Ethernet 프레임의 Source MAC과 EtherType 사이에 4바이트 VLAN 태그가 삽입됩니다.
                    태그가 있는 프레임의 최대 크기는 1522 bytes로 늘어납니다.
                </InfoBox>

                <InfoTable
                    headers={['필드', '크기', '설명']}
                    rows={vlanTagRows}
                />

                <CardGrid cols={2}>
                    <StatCard title="최대 VLAN 수" value="4,094" color="purple" desc="VID 1~4094 사용 가능 (0, 4095 예약)" />
                    <StatCard title="Native VLAN" value="VLAN 1 (기본)" color="gray" desc="Trunk에서 태그 없이 전송되는 VLAN" />
                </CardGrid>

                <InfoTable
                    headers={['포트 유형', '소속 VLAN', '태그 처리', '연결 대상']}
                    rows={portTypeRows}
                />

                <InfoBox color="green" title="Access Port 동작">
                    PC에서 들어오는 태그 없는 프레임에 설정된 VLAN 태그를 추가하고,
                    나갈 때는 태그를 제거하여 전달합니다. 엔드 디바이스는 VLAN을 인식할 필요가 없습니다.
                </InfoBox>

                <InfoBox color="teal" title="Trunk Port 동작">
                    여러 VLAN의 트래픽을 하나의 물리 링크로 전달합니다.
                    모든 프레임에 802.1Q 태그를 포함하며, Native VLAN의 프레임만 태그 없이 전송할 수 있습니다.
                </InfoBox>

                <CodeBlock code={vlanConfigCode} language="bash" filename="VLAN 설정 (리눅스)" />
            </Section>

            {/* ── 3.9 Double VLAN과 VLAN 확장 ── */}
            <Section id="s039" title="3.9  Double VLAN (QinQ)과 VLAN 확장">
                <Prose>
                    표준 802.1Q VLAN은 12비트 VID로 최대 4,094개까지만 지원합니다.
                    대규모 ISP나 멀티테넌트 환경에서는 이 한계를 극복하기 위해 VLAN 태그를 이중으로 쌓는
                    QinQ(802.1ad)를 사용합니다.
                </Prose>

                <InfoBox color="indigo" title="QinQ (Double VLAN Tagging, 802.1ad)">
                    기존 802.1Q 태그(Customer VLAN) 바깥에 S-Tag(Service VLAN)를 한 겹 더 추가합니다.
                    ISP는 S-Tag로 고객사를 구분하고, 고객 내부의 C-Tag는 그대로 보존됩니다.
                    프레임 구조: [Dest MAC | Src MAC | S-Tag(4B) | C-Tag(4B) | EtherType | Payload | FCS]
                </InfoBox>

                <InfoTable
                    headers={['항목', '802.1Q (Single Tag)', '802.1ad (QinQ / Double Tag)']}
                    rows={[
                        { cells: ['태그 수', '1개 (C-Tag)', '2개 (S-Tag + C-Tag)'] },
                        { cells: ['최대 VLAN 수', '4,094', '4,094 × 4,094 ≈ 16M'] },
                        { cells: ['프레임 크기', '최대 1,522 bytes', '최대 1,526 bytes'] },
                        { cells: ['사용 환경', '기업 내부, 캠퍼스', 'ISP, 데이터센터, 멀티테넌트'] },
                        { cells: ['EtherType', '0x8100', '외부: 0x88A8, 내부: 0x8100'] },
                    ]}
                />

                <Alert variant="info" title="VLAN의 한계와 오버레이 기술">
                    QinQ로도 부족한 대규모 데이터센터에서는 <T id="vxlan">VXLAN</T>(Virtual Extensible LAN)을 사용합니다.
                    VXLAN은 L2 프레임을 UDP로 캡슐화하여 L3 네트워크 위에 가상 L2 네트워크를 만들며,
                    24비트 VNI로 약 1,600만 개의 세그먼트를 지원합니다.
                    자세한 내용은 Topic 15 (클라우드·컨테이너 네트워크)에서 다룹니다.
                </Alert>
            </Section>

            {/* ── 3.10 NIC Bonding과 LACP ── */}
            <Section id="s0310" title="3.10  NIC Bonding과 LACP">
                <Prose>
                    NIC bonding(Linux) 또는 teaming은 여러 물리 NIC를 하나의 논리 인터페이스로 묶어
                    대역폭을 확장하거나 장애 시 자동 전환(failover)을 제공하는 기술입니다.
                    <T id="lacp">LACP</T>(Link Aggregation Control Protocol, IEEE 802.3ad)는 스위치와 서버 간에
                    동적으로 링크 집합을 구성하는 표준 프로토콜입니다.
                </Prose>

                <InfoTable
                    headers={['모드', '이름', '설명']}
                    rows={bondingModeRows}
                />

                <CardGrid cols={2}>
                    <InfoBox color="blue" title="Bonding의 장점">
                        <ul className="list-disc ml-4 space-y-1">
                            <li>고가용성: 하나의 NIC가 고장 나도 다른 NIC로 트래픽 전환</li>
                            <li>대역폭 확장: 여러 링크를 묶어 총 대역폭 증가</li>
                            <li>부하 분산: 트래픽을 여러 링크에 분산 처리</li>
                        </ul>
                    </InfoBox>
                    <InfoBox color="rose" title="LACP 주의사항">
                        <ul className="list-disc ml-4 space-y-1">
                            <li>양쪽(서버 + 스위치) 모두 LACP를 지원하고 설정해야 합니다</li>
                            <li>해시 알고리즘(L2, L3, L3+4)에 따라 분산 효율이 달라집니다</li>
                            <li>단일 TCP 연결은 하나의 링크만 사용합니다</li>
                        </ul>
                    </InfoBox>
                </CardGrid>

                <CodeBlock code={bondingCode} language="bash" filename="Linux NIC Bonding 설정" />
            </Section>

            {/* ── 3.11 Speed/Duplex/Link State ── */}
            <Section id="s0311" title="3.11  Speed, Duplex, Link State">
                <Prose>
                    물리 계층과 링크 계층의 상태를 파악하는 것은 네트워크 문제 해결의 첫 단계입니다.
                    Speed, Duplex, Link State는 <InlineCode>ethtool</InlineCode>이나
                    <InlineCode>ip link</InlineCode> 명령으로 확인할 수 있습니다.
                </Prose>

                <InfoTable
                    headers={['속성', '값', '설명']}
                    rows={linkStateRows}
                />

                <Alert variant="warning" title="Duplex Mismatch">
                    한쪽은 Full Duplex, 다른 쪽은 Half Duplex로 설정되면 심각한 성능 저하가 발생합니다.
                    양쪽 모두 Auto-negotiation을 켜거나, 양쪽 모두 같은 값으로 고정 설정해야 합니다.
                </Alert>
            </Section>

            {/* ── 3.12 요약 ── */}
            <Section id="s0312" title="3.12  요약">
                <InfoBox color="gray" title="이 토픽에서 배운 핵심 내용">
                    <ul className="list-disc ml-4 space-y-1">
                        <li><strong>Ethernet 프레임</strong>: Preamble, MAC 주소, EtherType, Payload, FCS로 구성</li>
                        <li><strong>NIC</strong>: 신호 변환, MAC 필터링, CRC 검증, 인터럽트 발생</li>
                        <li><strong>MAC 주소</strong>: 48비트 고유 식별자, OUI + Device ID</li>
                        <li><strong>스위치</strong>: Learning → Flooding → Forwarding으로 효율적 전달</li>
                        <li><strong>ARP</strong>: IP → MAC 주소 해석, 브로드캐스트 기반</li>
                        <li><strong>유니/브로드/멀티캐스트</strong>: 수신 대상 수에 따른 전송 방식 구분</li>
                        <li><strong>VLAN</strong>: 802.1Q 태그로 논리적 네트워크 분리</li>
                        <li><strong>QinQ</strong>: 이중 태그(802.1ad)로 ISP/멀티테넌트 VLAN 확장, VXLAN으로 L3 오버레이</li>
                        <li><strong>Bonding/LACP</strong>: NIC 묶어서 고가용성과 대역폭 확장</li>
                        <li><strong>Speed/Duplex/Link State</strong>: ethtool, ip link로 물리 계층 상태 모니터링</li>
                    </ul>
                </InfoBox>
            </Section>

            <TopicNavigation topicId="03-link-layer" />
        </div>
    )
}
