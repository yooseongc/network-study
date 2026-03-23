import { OsiTcpIpCompare } from '../../components/concepts/basics/OsiTcpIpCompare'
import { EncapsulationDiagram } from '../../components/concepts/basics/EncapsulationDiagram'
import { Alert, CardGrid, CodeBlock, InfoBox, InfoTable, Prose, Section, StatCard, T , TopicPage } from '@study-ui/components'
import {
    pingCode,
    mtuCheckCode,
    tracerouteCode,
    ethernetFrameAscii,
    ipPacketAscii,
} from './codeSnippets'

/* ── Inline data ──────────────────────────────────────────────────── */

const lanWanRows = [
    { cells: ['LAN', 'Local Area Network', '건물 내부 / 캠퍼스', 'Ethernet, Wi-Fi', '1 Gbps ~ 100 Gbps', '관리자가 직접 소유/관리'] },
    { cells: ['WAN', 'Wide Area Network', '도시 ~ 국가 간', 'MPLS, 전용선', '수십 Mbps ~ 수 Gbps', 'ISP가 제공하는 회선'] },
    { cells: ['Internet', 'Network of Networks', '전 세계', 'TCP/IP 기반', '가변', 'ISP 간 피어링/트랜짓'] },
]

const switchingRows = [
    { cells: ['회선 교환', '통화 전 전용 경로 확보', '전화 네트워크 (PSTN)', '경로 독점으로 안정적', '비효율적 자원 사용'] },
    { cells: ['패킷 교환', '데이터를 패킷 단위로 분할', '인터넷', '자원 공유로 효율적', '지연/순서 뒤바뀜 가능'] },
]

const pduRows = [
    { cells: ['응용 계층', 'Data (데이터)', 'HTTP 메시지, 이메일 본문 등'] },
    { cells: ['전송 계층', 'Segment (세그먼트)', 'TCP 헤더 + 데이터'] },
    { cells: ['네트워크 계층', 'Packet (패킷)', 'IP 헤더 + 세그먼트'] },
    { cells: ['데이터링크 계층', 'Frame (프레임)', 'Ethernet 헤더 + 패킷 + FCS'] },
    { cells: ['물리 계층', 'Bit (비트)', '전기/광 신호로 변환된 프레임'] },
]

const osiDetailRows = [
    { cells: ['7', '응용 (Application)', '사용자와 직접 상호작용', 'HTTP, FTP, DNS, SMTP'] },
    { cells: ['6', '표현 (Presentation)', '데이터 형식 변환, 암호화', 'SSL/TLS, JPEG, ASCII'] },
    { cells: ['5', '세션 (Session)', '연결 설정/유지/종료 관리', 'NetBIOS, RPC'] },
    { cells: ['4', '전송 (Transport)', '종단 간 신뢰성 있는 전달', 'TCP, UDP'] },
    { cells: ['3', '네트워크 (Network)', '논리적 주소, 경로 결정', 'IP, ICMP, ARP'] },
    { cells: ['2', '데이터링크 (Data Link)', '물리적 주소, 오류 검출', 'Ethernet, Wi-Fi, PPP'] },
    { cells: ['1', '물리 (Physical)', '비트를 신호로 변환', '전기/광/무선 신호'] },
]

/* ── Component ────────────────────────────────────────────────────── */

export default function Topic01() {
    return (
        <TopicPage topicId="01-basics" learningItems={[
                    'LAN, WAN, Internet의 차이를 구분할 수 있다',
                    '패킷 교환 방식과 회선 교환 방식의 차이를 이해한다',
                    'OSI 7계층과 TCP/IP 모델의 차이를 이해한다',
                    '캡슐화/역캡슐화 과정을 시각적으로 파악한다',
                    'MTU의 의미와 중요성을 설명할 수 있다',
                ]}>
            {/* ── Header ─────────────────────────────────────────── */}

            {/* ── Learning Card ───────────────────────────────────── */}

            {/* ── 1.1 네트워크란 무엇인가 ──────────────────────────── */}
            <Section id="s011" title="1.1  네트워크란 무엇인가">
                <Prose>
                    네트워크(Network)란 둘 이상의 장치(컴퓨터, 서버, 스마트폰 등)가 데이터를 주고받을 수
                    있도록 연결된 시스템을 말합니다. 우리가 웹 브라우저에서 웹사이트를 열거나, 이메일을 보내거나,
                    영상 통화를 하는 모든 행위의 뒤에는 네트워크가 동작하고 있습니다.
                </Prose>

                <InfoBox color="blue" title="일상의 비유">
                    네트워크는 도로 체계와 비슷합니다. 도로가 없으면 차량이 다닐 수 없듯,
                    네트워크가 없으면 데이터가 전달될 수 없습니다. 도로에 교통 규칙이 있듯,
                    네트워크에도 &quot;프로토콜&quot;이라는 통신 규칙이 필요합니다.
                </InfoBox>

                <Prose>
                    네트워크가 존재하는 근본적인 이유는 자원의 공유입니다. 하나의 프린터를
                    여러 컴퓨터가 함께 사용하고, 중앙 서버의 파일에 여러 사용자가 접근하며,
                    인터넷을 통해 전 세계의 정보에 접근할 수 있게 해줍니다.
                </Prose>

                <CardGrid cols={3}>
                    <StatCard title="연결된 장치 수 (2025)" value="~410억" color="blue" desc="IoT 포함 전 세계 네트워크 연결 장치" />
                    <StatCard title="글로벌 인터넷 트래픽" value="~4.8 ZB/년" color="purple" desc="매년 기하급수적으로 증가하는 데이터" />
                    <StatCard title="해저 케이블 수" value="~550+" color="cyan" desc="대륙 간 데이터를 전달하는 물리 인프라" />
                </CardGrid>

                <Prose>
                    네트워크의 핵심 구성 요소는 다음과 같습니다: 통신하려는 장치(호스트), 데이터를 전달하는
                    매체(케이블, 무선 등), 경로를 결정하고 전달을 중계하는 네트워크 장비(스위치, 라우터),
                    그리고 이 모든 것을 조율하는 프로토콜(규약)입니다.
                </Prose>
            </Section>

            {/* ── 1.2 LAN, WAN, Internet ──────────────────────────── */}
            <Section id="s012" title="1.2  LAN, WAN, Internet">
                <Prose>
                    네트워크는 그 범위에 따라 크게 LAN, WAN, 그리고 Internet으로 구분합니다.
                    각각은 규모, 속도, 관리 방식이 다르며, 이 구분을 이해하는 것은
                    네트워크 설계의 첫걸음입니다.
                </Prose>

                <InfoTable
                    headers={['구분', '정식 명칭', '범위', '기술', '속도', '특징']}
                    rows={lanWanRows}
                />

                <InfoBox color="green" title="LAN (Local Area Network)">
                    가정, 사무실, 학교 등 제한된 공간 내에서 장치들을 연결합니다.
                    보통 이더넷(Ethernet) 케이블이나 Wi-Fi를 사용합니다.
                    관리자가 직접 네트워크를 소유하고 관리하기 때문에
                    높은 대역폭과 낮은 지연 시간을 제공합니다.
                </InfoBox>

                <InfoBox color="amber" title="WAN (Wide Area Network)">
                    도시, 국가, 대륙 간에 걸친 넓은 범위의 네트워크입니다.
                    ISP(Internet Service Provider)가 제공하는 전용선이나 MPLS 같은
                    기술을 사용합니다. 기업의 본사와 지사를 연결하는 경우가 대표적입니다.
                </InfoBox>

                <InfoBox color="purple" title="Internet">
                    전 세계의 LAN과 WAN이 TCP/IP 프로토콜로 상호 연결된 거대한
                    &quot;네트워크의 네트워크&quot;입니다. ISP 간의 피어링(peering)과
                    트랜짓(transit) 계약을 통해 연결됩니다.
                </InfoBox>

                <Alert variant="info" title="참고:">
                    MAN(Metropolitan Area Network)이라는 중간 규모의 분류도 있습니다.
                    도시 단위의 네트워크로, 케이블 TV망이나 메트로 이더넷이 해당합니다.
                </Alert>
            </Section>

            {/* ── 1.3 패킷 교환 방식 ──────────────────────────────── */}
            <Section id="s013" title="1.3  패킷 교환 방식">
                <Prose>
                    데이터를 네트워크를 통해 전달하는 방식에는 크게 두 가지가 있습니다:
                    회선 교환(Circuit Switching)과 패킷 교환(Packet Switching)입니다.
                    현대 인터넷은 패킷 교환 방식을 사용합니다.
                </Prose>

                <InfoTable
                    headers={['방식', '핵심 원리', '사용 예', '장점', '단점']}
                    rows={switchingRows}
                />

                <InfoBox color="blue" title="회선 교환 (Circuit Switching)">
                    전통적인 전화 네트워크(PSTN)에서 사용되는 방식입니다.
                    통화가 시작되면 발신자와 수신자 사이에 전용 경로가 확보되고,
                    통화가 끝날 때까지 그 경로를 독점합니다.
                    안정적이지만, 통화 중이 아닌 시간에도 회선을 점유하므로
                    자원 활용이 비효율적입니다.
                </InfoBox>

                <InfoBox color="green" title="패킷 교환 (Packet Switching)">
                    데이터를 작은 단위인 패킷(packet)으로 나누어 독립적으로 전송합니다.
                    각 패킷은 서로 다른 경로를 통해 목적지에 도달할 수 있으며,
                    도착 후 다시 조합됩니다. 여러 사용자가 동일한 네트워크 자원을
                    효율적으로 공유할 수 있습니다.
                </InfoBox>

                <Alert variant="tip" title="핵심:">
                    인터넷이 패킷 교환 방식을 채택한 이유는 효율성 때문입니다.
                    웹 브라우징처럼 데이터가 간헐적으로 발생하는 (bursty) 트래픽에서,
                    회선 교환은 대부분의 시간에 회선을 낭비하게 됩니다.
                    패킷 교환은 이런 낭비 없이 자원을 공유합니다.
                </Alert>

                <Prose>
                    패킷 교환의 핵심 개념은 &quot;store and forward&quot;(저장 후 전달)입니다.
                    라우터는 패킷 전체를 수신한 후, 목적지를 확인하고 다음 라우터로 전달합니다.
                    이 과정이 목적지까지 반복됩니다.
                </Prose>

                <CodeBlock code={tracerouteCode} language="bash" filename="traceroute 예시" />
            </Section>

            {/* ── 1.4 프로토콜의 의미와 역할 ───────────────────────── */}
            <Section id="s014" title="1.4  프로토콜의 의미와 역할">
                <Prose>
                    프로토콜(Protocol)이란 네트워크에서 데이터를 주고받기 위해 미리 약속한 규칙의 집합입니다.
                    사람이 대화할 때 언어와 예절이 필요하듯, 컴퓨터 간 통신에도 약속된 형식과 절차가 필요합니다.
                </Prose>

                <InfoBox color="purple" title="일상의 비유: 편지 보내기">
                    편지를 보내려면 봉투에 받는 사람 주소, 보내는 사람 주소를 정해진 위치에 적고,
                    우표를 붙이는 &quot;규칙&quot;을 따라야 합니다. 이 규칙을 지키지 않으면
                    우체국에서 편지를 배달할 수 없습니다.
                    네트워크 프로토콜도 마찬가지로, 데이터의 형식, 전송 순서, 오류 처리 방법 등을
                    미리 약속합니다.
                </InfoBox>

                <Prose>
                    프로토콜이 정의하는 요소는 크게 세 가지입니다:
                </Prose>

                <CardGrid cols={3}>
                    <InfoBox color="blue" title="구문 (Syntax)">
                        데이터의 형식과 구조를 정의합니다.
                        예: IP 패킷의 헤더 크기와 각 필드의 위치
                    </InfoBox>
                    <InfoBox color="green" title="의미 (Semantics)">
                        각 필드가 무엇을 의미하는지 정의합니다.
                        예: TTL 필드는 패킷의 수명을 나타냄
                    </InfoBox>
                    <InfoBox color="amber" title="타이밍 (Timing)">
                        데이터를 보내는 순서와 속도를 정의합니다.
                        예: TCP 3-way handshake의 순서
                    </InfoBox>
                </CardGrid>

                <Alert variant="info" title="대표적 프로토콜:">
                    HTTP(웹), <T id="tcp">TCP</T>(신뢰성 있는 전송), IP(경로 지정), <T id="dns">DNS</T>(이름 해석),
                    DHCP(자동 IP 할당), <T id="arp">ARP</T>(MAC 주소 탐색) 등이 있습니다.
                    각 프로토콜은 네트워크의 특정 계층에서 특정 역할을 수행합니다.
                </Alert>

                <CodeBlock code={pingCode} language="bash" filename="ping — ICMP 프로토콜 동작 예시" />
            </Section>

            {/* ── 1.5 계층형 설계의 필요성 ──────────────────────────── */}
            <Section id="s015" title="1.5  계층형 설계의 필요성">
                <Prose>
                    네트워크 통신은 매우 복잡한 과정을 거칩니다. 응용 프로그램의 데이터가 전기 신호로
                    변환되어 케이블을 타고 전달되고, 수신 측에서 다시 원래 데이터로 복원됩니다.
                    이 복잡한 과정을 하나의 거대한 시스템으로 설계하면 유지보수와 확장이 거의 불가능합니다.
                </Prose>

                <InfoBox color="indigo" title="일상의 비유: 택배 시스템">
                    택배 시스템을 생각해보세요. 상품 포장 담당, 배송 트럭 담당, 물류 허브 담당,
                    최종 배달 담당이 각각 분리되어 있습니다. 포장 방식이 바뀌어도 배송 트럭의
                    운행 방법은 변하지 않습니다. 네트워크도 마찬가지로 각 계층이 독립적으로 동작합니다.
                </InfoBox>

                <Prose>
                    계층형 설계(Layered Architecture)의 핵심 이점은 다음과 같습니다:
                </Prose>

                <CardGrid cols={2}>
                    <InfoBox color="blue" title="모듈화 (Modularity)">
                        각 계층은 독립적인 기능을 담당합니다.
                        한 계층의 내부 구현을 변경해도 다른 계층에 영향을 주지 않습니다.
                        예: Wi-Fi에서 이더넷으로 바꿔도 TCP/IP는 그대로 동작합니다.
                    </InfoBox>
                    <InfoBox color="green" title="표준화 (Standardization)">
                        각 계층의 인터페이스가 표준으로 정의되어 있어,
                        서로 다른 제조사의 장비와 소프트웨어가 함께 동작할 수 있습니다.
                    </InfoBox>
                    <InfoBox color="purple" title="추상화 (Abstraction)">
                        상위 계층은 하위 계층의 세부 사항을 몰라도 됩니다.
                        웹 개발자는 HTTP만 이해하면 되고, 전기 신호 레벨의 동작은
                        알 필요가 없습니다.
                    </InfoBox>
                    <InfoBox color="amber" title="재사용성 (Reusability)">
                        같은 계층의 프로토콜을 여러 상위 프로토콜이 재사용합니다.
                        IP 위에서 TCP도, <T id="udp">UDP</T>도, ICMP도 동작할 수 있습니다.
                    </InfoBox>
                </CardGrid>

                <Alert variant="tip" title="핵심:">
                    계층형 설계 덕분에 네트워크 기술은 빠르게 발전할 수 있었습니다.
                    물리 매체가 동축 케이블에서 광섬유로 바뀌어도, 그 위에서 동작하는
                    TCP/IP 프로토콜은 수정 없이 그대로 동작합니다.
                </Alert>
            </Section>

            {/* ── 1.6 OSI 7계층과 TCP/IP 모델 ─────────────────────── */}
            <Section id="s016" title="1.6  OSI 7계층과 TCP/IP 모델 비교">
                <Prose>
                    네트워크 계층 모델에는 대표적으로 두 가지가 있습니다: <T id="osi">OSI 7계층 모델</T>과 <T id="tcp-ip">TCP/IP 4계층 모델</T>입니다.
                    OSI 모델은 국제표준화기구(ISO)가 만든 이론적 참조 모델이고,
                    TCP/IP 모델은 실제 인터넷에서 사용하는 실용적 모델입니다.
                </Prose>

                <OsiTcpIpCompare />

                <InfoTable
                    headers={['계층', '이름', '역할', '대표 프로토콜']}
                    rows={osiDetailRows}
                />

                <InfoBox color="cyan" title="OSI vs TCP/IP 핵심 차이">
                    OSI 모델은 7개 계층으로 세분화하여 이론적으로 깔끔하지만,
                    실제 구현에서 표현/세션 계층은 응용 계층에 통합되는 경우가 대부분입니다.
                    TCP/IP 모델은 4개 계층으로 단순화하여 실제 인터넷 동작을 더 잘 반영합니다.
                    네트워크를 학습할 때는 OSI 모델의 개념적 분류를 이해하되,
                    실무에서는 TCP/IP 모델을 기준으로 사고하는 것이 효율적입니다.
                </InfoBox>

                <Alert variant="tip" title="실무 관점:">
                    면접이나 자격증 시험에서는 OSI 7계층을 많이 묻지만,
                    실제 네트워크 엔지니어링에서는 &quot;L2 스위치&quot;, &quot;L3 라우팅&quot;,
                    &quot;L4 로드밸런싱&quot;, &quot;L7 프록시&quot;처럼 혼합해서 사용합니다.
                </Alert>
            </Section>

            {/* ── 1.7 캡슐화와 역캡슐화 ───────────────────────────── */}
            <Section id="s017" title="1.7  캡슐화와 역캡슐화">
                <Prose>
                    캡슐화(Encapsulation)는 데이터가 송신 측에서 각 계층을 내려갈 때마다
                    해당 계층의 헤더(header)가 추가되는 과정입니다. 마치 편지를 봉투에 넣고,
                    그 봉투를 택배 상자에 넣는 것과 비슷합니다.
                </Prose>

                <Prose>
                    역캡슐화(Decapsulation)는 수신 측에서 각 계층을 올라가며
                    해당 계층의 헤더를 제거하는 반대 과정입니다.
                    아래 다이어그램에서 단계별로 확인해보세요.
                </Prose>

                <EncapsulationDiagram />

                <InfoBox color="green" title="캡슐화의 핵심 원리">
                    각 계층은 자신의 헤더만 읽고, 나머지 내용(상위 계층의 헤더 + 데이터)은
                    하나의 덩어리(payload)로 취급합니다. 이것이 계층형 설계의 핵심입니다.
                    라우터(L3)는 IP 헤더만 읽고, TCP 헤더나 HTTP 데이터는 관심 없이
                    그대로 전달합니다.
                </InfoBox>

                <Alert variant="info" title="오버헤드:">
                    캡슐화 과정에서 각 계층의 헤더가 추가되므로, 실제 전송되는 데이터는
                    원본보다 크기가 커집니다. 이를 프로토콜 오버헤드(overhead)라고 합니다.
                    예: 1,460 바이트의 데이터를 보내려면 TCP(20B) + IP(20B) + Ethernet(18B) =
                    총 58 바이트의 헤더가 추가되어 1,518 바이트가 전송됩니다.
                </Alert>
            </Section>

            {/* ── 1.8 프레임, 패킷, 세그먼트 ──────────────────────── */}
            <Section id="s018" title="1.8  프레임, 패킷, 세그먼트">
                <Prose>
                    네트워크에서 데이터를 부르는 이름은 어떤 계층에서 보느냐에 따라 달라집니다.
                    이를 PDU(Protocol Data Unit)라고 합니다. 각 계층의 PDU를 정확히 구분하면
                    네트워크 문제를 분석할 때 어느 계층에서 문제가 발생했는지 파악하기 쉬워집니다.
                </Prose>

                <InfoTable
                    headers={['계층', 'PDU 이름', '설명']}
                    rows={pduRows}
                />

                <CodeBlock code={ethernetFrameAscii} language="text" filename="Ethernet Frame 구조" />
                <CodeBlock code={ipPacketAscii} language="text" filename="IP Packet Header 구조" />

                <InfoBox color="violet" title="스트림 (Stream)은?">
                    TCP는 데이터를 연속적인 바이트 스트림(byte stream)으로 취급합니다.
                    응용 프로그램은 개별 세그먼트를 의식하지 않고, 연속된 데이터 흐름으로
                    데이터를 읽고 씁니다. 세그먼트로의 분할과 재조합은 TCP가 자동으로 처리합니다.
                </InfoBox>

                <Alert variant="tip" title="용어 혼용 주의:">
                    실무에서는 &quot;패킷&quot;이라는 용어를 계층 구분 없이 넓은 의미로
                    사용하는 경우가 많습니다. 하지만 정확한 분석이 필요할 때는
                    프레임(L2), 패킷(L3), 세그먼트(L4)를 구분해서 사용하는 것이 중요합니다.
                </Alert>
            </Section>

            {/* ── 1.9 MTU의 의미 ──────────────────────────────────── */}
            <Section id="s019" title="1.9  MTU의 의미">
                <Prose>
                    <T id="mtu">MTU</T>(Maximum Transmission Unit)는 L2 프레임이 수용할 수 있는 L3 페이로드의 최대 크기입니다.
                    이더넷의 기본 MTU는 1,500 바이트이며, 이는 프레임 전체 크기(1518B)가 아닌 페이로드 부분만을 가리킵니다.
                    MTU를 초과하는 IP 패킷은 분할(Fragmentation)되거나 폐기됩니다.
                </Prose>

                <CardGrid cols={3}>
                    <StatCard title="이더넷 기본 MTU" value="1,500 B" color="blue" desc="가장 일반적인 MTU 값" />
                    <StatCard title="점보 프레임" value="9,000 B" color="green" desc="데이터센터 내부에서 사용" />
                    <StatCard title="최소 MTU (IPv6)" value="1,280 B" color="amber" desc="IPv6이 보장하는 최소 크기" />
                </CardGrid>

                <InfoBox color="orange" title="MTU와 MSS의 관계">
                    MSS(Maximum Segment Size)는 TCP 세그먼트의 최대 데이터 크기입니다.
                    일반적으로 MSS = MTU - IP 헤더(20B) - TCP 헤더(20B) = 1,460 바이트입니다.
                    TCP 연결 시 <T id="three-way-handshake">3-way handshake</T>에서 양쪽이 MSS 값을 교환합니다.
                </InfoBox>

                <Prose>
                    MTU를 초과하는 패킷이 발생하면 두 가지 처리 방법이 있습니다:
                </Prose>

                <CardGrid cols={2}>
                    <InfoBox color="red" title="IP 단편화 (Fragmentation)">
                        라우터가 큰 패킷을 MTU에 맞게 여러 조각으로 분할합니다.
                        수신 측에서 재조립하지만, 하나라도 유실되면 전체를 재전송해야 하므로
                        성능에 좋지 않습니다. IPv6에서는 중간 라우터의 단편화가 금지됩니다.
                    </InfoBox>
                    <InfoBox color="green" title="Path MTU Discovery">
                        패킷에 DF(Don&apos;t Fragment) 비트를 설정하여, 경로상의 최소 MTU를
                        자동으로 탐지합니다. 단편화 대신 송신 측에서 패킷 크기를 줄입니다.
                        현대 네트워크에서 권장되는 방식입니다.
                    </InfoBox>
                </CardGrid>

                <CodeBlock code={mtuCheckCode} language="bash" filename="MTU 확인 및 테스트" />

                <Alert variant="warning" title="실무 주의:">
                    VPN, VXLAN, GRE 등 터널링을 사용하면 추가 헤더가 붙어 실효 MTU가 줄어듭니다.
                    예를 들어 VXLAN은 50 바이트의 오버헤드가 추가되어 실효 MTU가 1,450 바이트가 됩니다.
                    터널링 환경에서 MTU 설정을 잘못하면 패킷 유실이나 성능 저하가 발생할 수 있습니다.
                </Alert>
            </Section>

            {/* ── 1.10 요약 ───────────────────────────────────────── */}
            <Section id="s0110" title="1.10  요약">
                <Prose>
                    이 토픽에서는 네트워크의 가장 기본적인 개념들을 학습했습니다.
                    아래의 핵심 내용을 다시 한번 정리합니다.
                </Prose>

                <div className="space-y-3">
                    <InfoBox color="blue" title="네트워크의 정의">
                        네트워크는 둘 이상의 장치가 데이터를 주고받을 수 있도록 연결된 시스템이며,
                        자원 공유가 핵심 목적입니다.
                    </InfoBox>
                    <InfoBox color="green" title="네트워크 범위">
                        LAN(근거리), WAN(광역), Internet(전 세계)으로 구분하며,
                        각각 속도, 관리 방식, 사용 기술이 다릅니다.
                    </InfoBox>
                    <InfoBox color="purple" title="패킷 교환">
                        인터넷은 패킷 교환 방식을 사용합니다. 데이터를 작은 패킷으로 나누어
                        독립적으로 전송하며, 자원을 효율적으로 공유합니다.
                    </InfoBox>
                    <InfoBox color="cyan" title="프로토콜과 계층 설계">
                        프로토콜은 통신 규칙이며, 계층형 설계를 통해 복잡한 통신을
                        독립적인 모듈로 분리합니다.
                    </InfoBox>
                    <InfoBox color="amber" title="캡슐화와 PDU">
                        데이터는 각 계층을 내려가며 헤더가 추가(캡슐화)되고,
                        수신 측에서는 역순으로 헤더가 제거(역캡슐화)됩니다.
                        계층별 PDU: 데이터 → 세그먼트 → 패킷 → 프레임 → 비트
                    </InfoBox>
                    <InfoBox color="orange" title="MTU">
                        한 번에 전송 가능한 최대 패킷 크기이며, 이더넷 기본값은 1,500 바이트입니다.
                        MTU 불일치는 성능 문제의 흔한 원인입니다.
                    </InfoBox>
                </div>

                <Alert variant="tip" title="다음 토픽:">
                    다음 토픽에서는 이 기초 지식을 바탕으로 실제 가정과 기업의 네트워크가
                    어떻게 구성되는지, 라우터, 스위치, 방화벽 등이 어떤 위치에서 어떤 역할을
                    하는지 살펴봅니다.
                </Alert>
            </Section>

            {/* ── Navigation ─────────────────────────────────────── */}
        </TopicPage>
    )
}
