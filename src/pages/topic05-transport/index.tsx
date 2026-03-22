import { Section } from '../../components/ui/Section'
import { Prose } from '../../components/ui/Prose'
import { InfoBox } from '../../components/ui/InfoBox'
import { InfoTable } from '../../components/ui/InfoTable'
import { StatCard } from '../../components/ui/StatCard'
import { Alert } from '../../components/ui/Alert'
import { LearningCard } from '../../components/ui/LearningCard'
import { TopicNavigation } from '../../components/ui/TopicNavigation'
import { CodeBlock } from '../../components/viz/CodeBlock'
import { TcpHandshakeDiagram } from '../../components/concepts/transport/TcpHandshakeDiagram'
import { CongestionControlViz } from '../../components/concepts/transport/CongestionControlViz'
import {
    ssCommandCode,
    netstatCode,
    tcpdumpHandshakeCode,
    tcpSocketCode,
    tcpTuningCode,
} from './codeSnippets'

/* ── inline data ──────────────────────────────────────────────── */

const portRangeRows = [
    { cells: ['Well-Known', '0 ~ 1023', 'IANA 공식 할당', 'HTTP(80), HTTPS(443), SSH(22), DNS(53)'] },
    { cells: ['Registered', '1024 ~ 49151', '벤더/앱 등록', 'MySQL(3306), PostgreSQL(5432), Redis(6379)'] },
    { cells: ['Dynamic', '49152 ~ 65535', 'OS가 자동 할당', '클라이언트 임시 포트 (Ephemeral Port)'] },
]

const tcpVsUdpRows = [
    { cells: ['연결 방식', '연결 지향 (Connection-Oriented)', '비연결 (Connectionless)'] },
    { cells: ['신뢰성', '보장 (ACK, 재전송)', '보장하지 않음'] },
    { cells: ['순서 보장', '시퀀스 번호로 보장', '보장하지 않음'] },
    { cells: ['흐름 제어', '슬라이딩 윈도우', '없음'] },
    { cells: ['혼잡 제어', 'Slow Start, AIMD 등', '없음'] },
    { cells: ['헤더 크기', '20~60 바이트', '8 바이트'] },
    { cells: ['속도', '상대적으로 느림 (오버헤드)', '빠름 (최소 오버헤드)'] },
    { cells: ['전송 단위', 'Segment (세그먼트)', 'Datagram (데이터그램)'] },
    { cells: ['활용 사례', 'HTTP, SSH, FTP, SMTP', 'DNS, DHCP, 영상 스트리밍, 게임'] },
]

const tcpHeaderRows = [
    { cells: ['Source Port', '16비트', '송신측 포트 번호'] },
    { cells: ['Destination Port', '16비트', '수신측 포트 번호'] },
    { cells: ['Sequence Number', '32비트', '이 세그먼트의 첫 바이트 번호'] },
    { cells: ['Acknowledgment Number', '32비트', '다음에 받기를 기대하는 바이트 번호'] },
    { cells: ['Data Offset', '4비트', 'TCP 헤더 길이 (4바이트 단위)'] },
    { cells: ['Flags', '9비트', 'SYN, ACK, FIN, RST, PSH, URG 등'] },
    { cells: ['Window Size', '16비트', '수신 윈도우 크기 (흐름 제어)'] },
    { cells: ['Checksum', '16비트', '헤더 + 데이터 오류 검출'] },
    { cells: ['Urgent Pointer', '16비트', '긴급 데이터 오프셋'] },
]

const tcpStateRows = [
    { cells: ['CLOSED', '연결 없음', '초기/최종 상태'] },
    { cells: ['LISTEN', '서버가 연결 대기', 'bind() + listen() 이후'] },
    { cells: ['SYN_SENT', 'SYN 보낸 후 대기', 'connect() 호출'] },
    { cells: ['SYN_RCVD', 'SYN 받고 SYN+ACK 보냄', '서버 측'] },
    { cells: ['ESTABLISHED', '연결 수립 완료', '데이터 송수신 가능'] },
    { cells: ['FIN_WAIT_1', 'FIN 보냄', '능동 종료 측'] },
    { cells: ['FIN_WAIT_2', 'FIN의 ACK 받음', 'FIN 대기'] },
    { cells: ['CLOSE_WAIT', 'FIN 받고 ACK 보냄', '수동 종료 측'] },
    { cells: ['LAST_ACK', 'FIN 보내고 ACK 대기', '수동 종료 측'] },
    { cells: ['TIME_WAIT', '마지막 ACK 보냄', '2MSL 동안 대기'] },
]

const udpUseCaseRows = [
    { cells: ['DNS', '53', '빠른 조회, 작은 패킷, 재질의로 충분'] },
    { cells: ['DHCP', '67/68', 'IP 할당 전이라 TCP 연결 불가'] },
    { cells: ['영상 스트리밍', '다양', '일부 손실보다 지연이 더 치명적'] },
    { cells: ['온라인 게임', '다양', '실시간성이 중요, 오래된 데이터는 무의미'] },
    { cells: ['VoIP', '다양', '지터(jitter) 최소화 필요'] },
    { cells: ['SNMP', '161/162', '네트워크 모니터링, 간단한 질의/응답'] },
    { cells: ['NTP', '123', '시간 동기화, 경량 프로토콜'] },
]

const quicVsTcpRows = [
    { cells: ['연결 수립', '1-RTT 또는 0-RTT (재접속)', 'TCP + TLS = 2~3 RTT'] },
    { cells: ['HOL Blocking', '스트림 단위 독립 처리', '하나의 손실이 전체 블로킹'] },
    { cells: ['전송 계층', 'UDP 위에 구현', 'OS 커널의 TCP 스택'] },
    { cells: ['암호화', '기본 내장 (TLS 1.3)', '별도 TLS 계층 필요'] },
    { cells: ['연결 마이그레이션', 'Connection ID로 가능', 'IP:Port 변경 시 재연결'] },
    { cells: ['멀티플렉싱', '스트림 기반 다중화', '하나의 바이트 스트림'] },
    { cells: ['배포/업데이트', '사용자 공간, 빠른 업데이트', '커널 업데이트 필요'] },
]

/* ── component ────────────────────────────────────────────────── */

export default function Topic05() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-14">
            {/* Header */}
            <header className="space-y-3">
                <p className="text-xs font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                    Topic 05
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    전송 계층: TCP와 UDP
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    Transport Layer: TCP & UDP
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    전송 계층은 프로세스 간 통신을 담당합니다. TCP의 연결 설정/해제 과정과
                    흐름/혼잡 제어 메커니즘을 시각화하고, UDP와의 차이를 비교하며,
                    차세대 프로토콜 QUIC의 등장 배경까지 살펴봅니다.
                </p>
            </header>

            <LearningCard
                topicId="05-transport"
                items={[
                    '포트 번호와 소켓의 개념을 이해한다',
                    'TCP 3-way/4-way handshake 과정을 설명할 수 있다',
                    '시퀀스 번호, 흐름/혼잡 제어 메커니즘을 이해한다',
                    'UDP의 특징과 활용 사례를 파악한다',
                    'QUIC의 등장 배경과 장점을 설명할 수 있다',
                ]}
            />

            {/* ── 5.1 포트 번호와 소켓 ────────────────────────── */}
            <Section id="s051" title="5.1  포트 번호와 소켓">
                <Prose>
                    IP 주소가 호스트를 식별한다면, 포트 번호는 그 호스트 내의 프로세스를 식별합니다.
                    전송 계층은 16비트 포트 번호(0~65535)를 사용하여 하나의 호스트에서 동시에
                    실행되는 여러 애플리케이션을 구별합니다.
                </Prose>

                <InfoTable
                    headers={['범위', '포트 번호', '할당 방식', '예시']}
                    rows={portRangeRows}
                />

                <InfoBox color="blue" title="소켓(Socket)이란?">
                    소켓은 네트워크 통신의 끝점(endpoint)입니다. 하나의 소켓은
                    <strong className="mx-1">(프로토콜, IP 주소, 포트 번호)</strong>의 조합으로 식별됩니다.
                    TCP 연결은 두 소켓의 쌍으로 유일하게 구별되므로, 같은 서버 포트에 수천 개의
                    클라이언트가 동시 접속할 수 있습니다.
                </InfoBox>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatCard title="전체 포트 수" value="65,536" desc="0 ~ 65535 (16비트)" color="blue" />
                    <StatCard title="Well-Known" value="1,024" desc="0 ~ 1023" color="purple" />
                    <StatCard title="Registered" value="48,128" desc="1024 ~ 49151" color="green" />
                    <StatCard title="Dynamic" value="16,384" desc="49152 ~ 65535" color="amber" />
                </div>

                <InfoBox color="gray" title="소켓 주소의 구조">
                    <code className="text-xs">
                        TCP 연결 = (src_ip:src_port, dst_ip:dst_port)<br />
                        예: (192.168.1.100:54321, 93.184.216.34:443)<br /><br />
                        같은 서버 포트 443에 여러 클라이언트가 연결 가능:<br />
                        (10.0.0.1:50001, 93.184.216.34:443) -- 연결 1<br />
                        (10.0.0.2:50002, 93.184.216.34:443) -- 연결 2<br />
                        (10.0.0.1:50003, 93.184.216.34:443) -- 연결 3
                    </code>
                </InfoBox>

                <CodeBlock code={ssCommandCode} language="bash" filename="ss-socket-status.sh" />
            </Section>

            {/* ── 5.2 TCP vs UDP 비교 ─────────────────────────── */}
            <Section id="s052" title="5.2  TCP vs UDP 비교">
                <Prose>
                    전송 계층에는 크게 두 가지 프로토콜이 있습니다. TCP(Transmission Control Protocol)는
                    신뢰성 있는 데이터 전달을 보장하고, UDP(User Datagram Protocol)는 최소한의 오버헤드로
                    빠른 전송을 제공합니다. 애플리케이션의 요구 사항에 따라 적절한 프로토콜을 선택합니다.
                </Prose>

                <InfoTable
                    headers={['항목', 'TCP', 'UDP']}
                    rows={tcpVsUdpRows}
                />

                <Alert variant="tip" title="프로토콜 선택 기준:">
                    데이터의 완전성이 중요하면 TCP, 실시간성이 중요하면 UDP를 선택합니다.
                    최근에는 QUIC처럼 UDP 위에 신뢰성을 직접 구현하는 방식도 널리 사용됩니다.
                </Alert>

                <InfoBox color="cyan" title="TCP 헤더 구조 (20~60 바이트)">
                    TCP 헤더에는 연결 관리, 흐름 제어, 오류 검출에 필요한 모든 정보가 담겨 있습니다.
                </InfoBox>
                <InfoTable
                    headers={['필드', '크기', '설명']}
                    rows={tcpHeaderRows}
                />
            </Section>

            {/* ── 5.3 TCP 3-way Handshake ─────────────────────── */}
            <Section id="s053" title="5.3  TCP 3-way Handshake">
                <Prose>
                    TCP 연결은 3단계의 핸드셰이크를 통해 수립됩니다. 이 과정에서 양측은 초기 시퀀스 번호(ISN)를
                    교환하고, 상대방의 수신 능력을 확인합니다. 보안을 위해 ISN은 예측 불가능한 값으로 설정됩니다.
                </Prose>

                <TcpHandshakeDiagram />

                <InfoBox color="green" title="왜 3-way인가?">
                    2-way로는 부족합니다. 클라이언트가 SYN을 보내고 서버가 ACK만 보내면,
                    서버는 클라이언트의 수신 능력을 확인할 수 없습니다. 또한 네트워크에서
                    지연된 오래된 SYN 패킷이 도착했을 때, 불필요한 연결이 생성되는 것을
                    방지하기 위해 3-way가 필요합니다.
                </InfoBox>

                <Alert variant="warning" title="SYN Flood 공격:">
                    공격자가 가짜 IP로 대량의 SYN 패킷을 보내면, 서버는 SYN_RCVD 상태의
                    반열림(half-open) 연결을 유지하느라 자원이 고갈됩니다.
                    방어 기법으로 SYN Cookie가 사용됩니다 (서버가 상태를 저장하지 않고
                    시퀀스 번호에 검증 정보를 인코딩).
                </Alert>

                <CodeBlock code={tcpdumpHandshakeCode} language="bash" filename="tcpdump-handshake.sh" />
            </Section>

            {/* ── 5.4 TCP 4-way Handshake ─────────────────────── */}
            <Section id="s054" title="5.4  TCP 4-way Handshake (연결 종료)">
                <Prose>
                    TCP 연결 종료는 4단계로 이루어집니다. 연결 수립과 달리 종료는 양방향
                    독립적(half-close)이기 때문에 각 방향마다 FIN+ACK가 필요합니다.
                </Prose>

                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
                    <svg viewBox="0 0 540 280" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
                        <text x={120} y={18} textAnchor="middle" className="text-sm font-bold fill-blue-600 dark:fill-blue-400">Active Close</text>
                        <text x={420} y={18} textAnchor="middle" className="text-sm font-bold fill-purple-600 dark:fill-purple-400">Passive Close</text>

                        <line x1={120} y1={28} x2={120} y2={270} stroke="currentColor" strokeWidth={2} strokeDasharray="4,3" className="text-gray-300 dark:text-gray-700" />
                        <line x1={420} y1={28} x2={420} y2={270} stroke="currentColor" strokeWidth={2} strokeDasharray="4,3" className="text-gray-300 dark:text-gray-700" />

                        {/* Step 1: FIN */}
                        <line x1={120} y1={60} x2={408} y2={60} stroke="#ef4444" strokeWidth={2} />
                        <polygon points="410,60 400,55 400,65" fill="#ef4444" />
                        <text x={270} y={52} textAnchor="middle" className="text-xs font-bold font-mono fill-red-600 dark:fill-red-400">FIN</text>
                        <text x={270} y={74} textAnchor="middle" className="text-[10px] font-mono fill-gray-500 dark:fill-gray-400">seq=u</text>
                        <text x={50} y={64} textAnchor="middle" className="text-[10px] font-mono fill-orange-600 dark:fill-orange-400">FIN_WAIT_1</text>

                        {/* Step 2: ACK */}
                        <line x1={420} y1={110} x2={132} y2={110} stroke="#8b5cf6" strokeWidth={2} />
                        <polygon points="130,110 140,105 140,115" fill="#8b5cf6" />
                        <text x={270} y={102} textAnchor="middle" className="text-xs font-bold font-mono fill-purple-600 dark:fill-purple-400">ACK</text>
                        <text x={270} y={124} textAnchor="middle" className="text-[10px] font-mono fill-gray-500 dark:fill-gray-400">ack=u+1</text>
                        <text x={50} y={114} textAnchor="middle" className="text-[10px] font-mono fill-orange-600 dark:fill-orange-400">FIN_WAIT_2</text>
                        <text x={490} y={114} textAnchor="middle" className="text-[10px] font-mono fill-violet-600 dark:fill-violet-400">CLOSE_WAIT</text>

                        {/* Step 3: FIN */}
                        <line x1={420} y1={170} x2={132} y2={170} stroke="#ef4444" strokeWidth={2} />
                        <polygon points="130,170 140,165 140,175" fill="#ef4444" />
                        <text x={270} y={162} textAnchor="middle" className="text-xs font-bold font-mono fill-red-600 dark:fill-red-400">FIN</text>
                        <text x={270} y={184} textAnchor="middle" className="text-[10px] font-mono fill-gray-500 dark:fill-gray-400">seq=w</text>
                        <text x={490} y={174} textAnchor="middle" className="text-[10px] font-mono fill-violet-600 dark:fill-violet-400">LAST_ACK</text>

                        {/* Step 4: ACK */}
                        <line x1={120} y1={220} x2={408} y2={220} stroke="#10b981" strokeWidth={2} />
                        <polygon points="410,220 400,215 400,225" fill="#10b981" />
                        <text x={270} y={212} textAnchor="middle" className="text-xs font-bold font-mono fill-emerald-600 dark:fill-emerald-400">ACK</text>
                        <text x={270} y={234} textAnchor="middle" className="text-[10px] font-mono fill-gray-500 dark:fill-gray-400">ack=w+1</text>
                        <text x={50} y={224} textAnchor="middle" className="text-[10px] font-mono fill-orange-600 dark:fill-orange-400">TIME_WAIT</text>
                        <text x={490} y={224} textAnchor="middle" className="text-[10px] font-mono fill-emerald-600 dark:fill-emerald-400">CLOSED</text>

                        {/* TIME_WAIT note */}
                        <text x={120} y={258} textAnchor="middle" className="text-[9px] fill-gray-400 dark:fill-gray-500">(2MSL 후 CLOSED)</text>
                    </svg>
                </div>

                <InfoBox color="amber" title="TIME_WAIT 상태와 2MSL">
                    능동 종료 측은 마지막 ACK를 보낸 후 TIME_WAIT 상태로 2MSL(Maximum Segment Lifetime,
                    보통 60초) 동안 대기합니다. 이는 두 가지 이유 때문입니다:
                    <br /><br />
                    <strong>1)</strong> 마지막 ACK가 유실되었을 때, 상대방이 FIN을 재전송하면 다시 ACK를 보낼 수 있습니다.
                    <br />
                    <strong>2)</strong> 이전 연결의 지연된 패킷이 새 연결에 영향을 주는 것을 방지합니다.
                </InfoBox>

                <InfoTable
                    headers={['상태', '설명', '발생 시점']}
                    rows={tcpStateRows}
                />
            </Section>

            {/* ── 5.5 시퀀스 번호와 ACK ───────────────────────── */}
            <Section id="s055" title="5.5  시퀀스 번호와 ACK">
                <Prose>
                    TCP는 바이트 스트림 프로토콜입니다. 시퀀스 번호는 전송하는 데이터의 첫 번째
                    바이트의 번호를 나타내고, ACK 번호는 다음에 수신하기를 기대하는 바이트 번호를
                    나타냅니다. 이를 통해 순서 보장, 중복 감지, 손실 탐지가 가능합니다.
                </Prose>

                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
                    <svg viewBox="0 0 540 200" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
                        <text x={120} y={18} textAnchor="middle" className="text-sm font-bold fill-blue-600 dark:fill-blue-400">Sender</text>
                        <text x={420} y={18} textAnchor="middle" className="text-sm font-bold fill-purple-600 dark:fill-purple-400">Receiver</text>

                        <line x1={120} y1={28} x2={120} y2={190} stroke="currentColor" strokeWidth={2} strokeDasharray="4,3" className="text-gray-300 dark:text-gray-700" />
                        <line x1={420} y1={28} x2={420} y2={190} stroke="currentColor" strokeWidth={2} strokeDasharray="4,3" className="text-gray-300 dark:text-gray-700" />

                        {/* Data 1 */}
                        <line x1={120} y1={48} x2={408} y2={58} stroke="#3b82f6" strokeWidth={2} />
                        <polygon points="410,58 400,53 400,63" fill="#3b82f6" />
                        <text x={260} y={42} textAnchor="middle" className="text-[10px] font-bold font-mono fill-blue-600 dark:fill-blue-400">DATA seq=1, len=100</text>

                        {/* Data 2 */}
                        <line x1={120} y1={68} x2={408} y2={78} stroke="#3b82f6" strokeWidth={2} />
                        <polygon points="410,78 400,73 400,83" fill="#3b82f6" />
                        <text x={260} y={66} textAnchor="middle" className="text-[10px] font-bold font-mono fill-blue-600 dark:fill-blue-400">DATA seq=101, len=100</text>

                        {/* ACK for both */}
                        <line x1={420} y1={100} x2={132} y2={110} stroke="#10b981" strokeWidth={2} />
                        <polygon points="130,110 140,105 140,115" fill="#10b981" />
                        <text x={270} y={96} textAnchor="middle" className="text-[10px] font-bold font-mono fill-emerald-600 dark:fill-emerald-400">ACK ack=201 (누적 확인)</text>

                        {/* Data 3 */}
                        <line x1={120} y1={130} x2={408} y2={140} stroke="#3b82f6" strokeWidth={2} />
                        <polygon points="410,140 400,135 400,145" fill="#3b82f6" />
                        <text x={260} y={128} textAnchor="middle" className="text-[10px] font-bold font-mono fill-blue-600 dark:fill-blue-400">DATA seq=201, len=100</text>

                        {/* ACK */}
                        <line x1={420} y1={162} x2={132} y2={172} stroke="#10b981" strokeWidth={2} />
                        <polygon points="130,172 140,167 140,177" fill="#10b981" />
                        <text x={270} y={158} textAnchor="middle" className="text-[10px] font-bold font-mono fill-emerald-600 dark:fill-emerald-400">ACK ack=301</text>
                    </svg>
                </div>

                <InfoBox color="indigo" title="누적 확인 응답 (Cumulative ACK)">
                    TCP의 ACK는 누적(cumulative) 방식입니다. ACK=201은 "200번 바이트까지 모두 받았고,
                    201번부터 보내달라"는 의미입니다. 이 방식은 간단하지만, 중간 패킷만 유실된 경우
                    어떤 것이 유실되었는지 정확히 알 수 없다는 단점이 있습니다.
                    이를 보완하기 위해 <strong>SACK(Selective ACK)</strong> 옵션이 사용됩니다.
                </InfoBox>

                <Alert variant="info">
                    ISN(Initial Sequence Number)은 0부터 시작하지 않고 랜덤 값으로 설정됩니다.
                    이는 이전 연결의 패킷이 새 연결에 유입되는 것을 방지하고,
                    TCP 시퀀스 번호 예측 공격을 차단하기 위함입니다.
                </Alert>
            </Section>

            {/* ── 5.6 흐름 제어 ───────────────────────────────── */}
            <Section id="s056" title="5.6  흐름 제어 (Flow Control)">
                <Prose>
                    흐름 제어는 송신자가 수신자의 처리 속도보다 빠르게 데이터를 보내지 않도록
                    조절하는 메커니즘입니다. TCP는 슬라이딩 윈도우(Sliding Window) 방식을 사용합니다.
                </Prose>

                <InfoBox color="teal" title="수신 윈도우 (Receive Window, rwnd)">
                    수신자는 TCP 헤더의 Window Size 필드를 통해 현재 받을 수 있는 버퍼 크기를
                    송신자에게 알립니다. 송신자는 ACK를 받지 못한 미확인 데이터가 rwnd를
                    초과하지 않도록 전송량을 제한합니다.
                </InfoBox>

                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-5">
                    <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-3 text-center">
                        슬라이딩 윈도우 개념도
                    </div>
                    <div className="flex items-center justify-center gap-0.5 flex-wrap">
                        {Array.from({ length: 16 }, (_, i) => {
                            let bg = 'bg-gray-200 dark:bg-gray-700'
                            let text = 'text-gray-400 dark:text-gray-500'
                            if (i < 3) {
                                bg = 'bg-green-200 dark:bg-green-900'
                                text = 'text-green-700 dark:text-green-400'
                            } else if (i < 6) {
                                bg = 'bg-blue-200 dark:bg-blue-900'
                                text = 'text-blue-700 dark:text-blue-400'
                            } else if (i < 10) {
                                bg = 'bg-amber-200 dark:bg-amber-900'
                                text = 'text-amber-700 dark:text-amber-400'
                            }
                            return (
                                <div key={i} className={`w-10 h-10 ${bg} rounded flex items-center justify-center`}>
                                    <span className={`text-[10px] font-mono font-bold ${text}`}>{i + 1}</span>
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex items-center justify-center gap-4 mt-3 text-[10px]">
                        <span className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded bg-green-200 dark:bg-green-900 inline-block" />
                            <span className="text-gray-600 dark:text-gray-400">ACK 수신 완료</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded bg-blue-200 dark:bg-blue-900 inline-block" />
                            <span className="text-gray-600 dark:text-gray-400">전송됨 (ACK 대기)</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded bg-amber-200 dark:bg-amber-900 inline-block" />
                            <span className="text-gray-600 dark:text-gray-400">전송 가능 (윈도우 내)</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded bg-gray-200 dark:bg-gray-700 inline-block" />
                            <span className="text-gray-600 dark:text-gray-400">전송 불가</span>
                        </span>
                    </div>
                    <div className="mt-2 text-center text-[10px] text-gray-500 dark:text-gray-500 font-mono">
                        Window Size = 7 segments (전송됨 3 + 전송 가능 4)
                    </div>
                </div>

                <Alert variant="info" title="Zero Window와 Window Probe:">
                    수신자의 버퍼가 가득 차면 Window Size=0을 보냅니다. 송신자는 전송을 멈추고,
                    주기적으로 Window Probe(1바이트 세그먼트)를 보내 수신자의 윈도우가
                    다시 열렸는지 확인합니다.
                </Alert>
            </Section>

            {/* ── 5.7 혼잡 제어 ───────────────────────────────── */}
            <Section id="s057" title="5.7  혼잡 제어 (Congestion Control)">
                <Prose>
                    흐름 제어가 수신자 보호라면, 혼잡 제어는 네트워크 보호입니다.
                    송신자는 네트워크의 혼잡 상태를 추정하여 전송 속도를 조절합니다.
                    TCP는 혼잡 윈도우(cwnd)를 사용하며, 실제 전송 가능량은 min(cwnd, rwnd)입니다.
                </Prose>

                <CongestionControlViz />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoBox color="blue" title="Slow Start (느린 시작)">
                        초기 cwnd=1 MSS에서 시작하여 ACK를 받을 때마다 cwnd를 1 MSS씩 증가시킵니다.
                        매 RTT마다 cwnd가 2배로 되므로 실제로는 지수적으로 증가합니다.
                        ssthresh에 도달하면 Congestion Avoidance로 전환합니다.
                    </InfoBox>
                    <InfoBox color="green" title="Congestion Avoidance (혼잡 회피)">
                        cwnd가 ssthresh 이상이면 매 RTT마다 cwnd를 1 MSS만 증가시킵니다 (AIMD의 AI 부분).
                        선형 증가를 통해 네트워크 용량에 조심스럽게 접근합니다.
                    </InfoBox>
                    <InfoBox color="red" title="패킷 손실 감지">
                        <strong>타임아웃:</strong> cwnd=1로 리셋, ssthresh=cwnd/2 (Tahoe 방식)<br />
                        <strong>3 Duplicate ACK:</strong> ssthresh=cwnd/2, cwnd=ssthresh로 설정 후
                        Fast Recovery 진입 (Reno 방식)
                    </InfoBox>
                    <InfoBox color="purple" title="Fast Recovery (빠른 회복)">
                        3개의 중복 ACK를 받으면 타임아웃까지 기다리지 않고 즉시 손실된 세그먼트를
                        재전송합니다 (Fast Retransmit). 이후 cwnd를 절반으로 줄이고 선형 증가를 재개합니다.
                    </InfoBox>
                </div>

                <Alert variant="tip" title="AIMD (Additive Increase, Multiplicative Decrease):">
                    TCP 혼잡 제어의 핵심 원리입니다. 정상 시에는 cwnd를 1씩 더하고(AI),
                    손실 시에는 절반으로 줄입니다(MD). 이 비대칭 전략이 네트워크 안정성과
                    공정성을 동시에 달성합니다.
                </Alert>

                <InfoBox color="sky" title="현대적 혼잡 제어 알고리즘">
                    <strong>CUBIC:</strong> Linux 기본 알고리즘. 3차 함수 기반으로 대역폭을 빠르게 탐색합니다.<br />
                    <strong>BBR (Bottleneck Bandwidth and RTT):</strong> Google이 개발. 패킷 손실이 아닌
                    대역폭과 RTT 측정 기반으로 최적 전송률을 찾습니다. 장거리/고대역폭 환경에서 효과적입니다.
                </InfoBox>
            </Section>

            {/* ── 5.8 재전송과 타이머 ─────────────────────────── */}
            <Section id="s058" title="5.8  재전송과 타이머">
                <Prose>
                    TCP는 데이터의 신뢰성을 보장하기 위해 타이머 기반 재전송 메커니즘을 사용합니다.
                    핵심은 RTO(Retransmission Timeout)를 적절하게 설정하는 것입니다.
                    너무 짧으면 불필요한 재전송이 발생하고, 너무 길면 복구가 느려집니다.
                </Prose>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <StatCard title="RTT" value="Round-Trip Time" desc="패킷이 왕복하는 데 걸리는 시간" color="blue" />
                    <StatCard title="SRTT" value="Smoothed RTT" desc="지수 가중 이동 평균으로 계산" color="green" />
                    <StatCard title="RTO" value="Retransmission Timeout" desc="SRTT + 4 x RTTVAR" color="red" />
                </div>

                <InfoBox color="orange" title="RTO 계산 (Jacobson 알고리즘, RFC 6298)">
                    <code className="text-xs">
                        SRTT = (1 - alpha) x SRTT + alpha x RTT_sample  (alpha = 1/8)<br />
                        RTTVAR = (1 - beta) x RTTVAR + beta x |SRTT - RTT_sample|  (beta = 1/4)<br />
                        RTO = SRTT + 4 x RTTVAR<br /><br />
                        초기값: SRTT = RTT_sample, RTTVAR = RTT_sample / 2<br />
                        최소 RTO: 1초 (RFC 권장), 최대 RTO: 일반적으로 60초
                    </code>
                </InfoBox>

                <InfoBox color="violet" title="지수 백오프 (Exponential Backoff)">
                    재전송 타임아웃이 발생할 때마다 RTO를 2배로 증가시킵니다 (1초 → 2초 → 4초 → 8초...).
                    이는 네트워크가 심각하게 혼잡한 상황에서 추가 트래픽을 줄여 회복을 돕습니다.
                </InfoBox>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoBox color="rose" title="Keepalive 타이머">
                        연결이 유휴 상태일 때 상대방이 살아있는지 확인합니다.
                        기본값은 7,200초(2시간) 후 첫 프로브를 보내고, 75초 간격으로 9회 재시도합니다.
                        웹 서버에서는 보통 더 짧게 설정합니다.
                    </InfoBox>
                    <InfoBox color="lime" title="Delayed ACK">
                        매 세그먼트마다 즉시 ACK를 보내는 대신, 최대 200ms(보통 40ms) 동안 기다려
                        응답 데이터와 ACK를 함께 보내는 piggybacking을 시도합니다.
                        네트워크 효율은 좋지만 Nagle 알고리즘과 함께 쓰면 지연이 발생할 수 있습니다.
                    </InfoBox>
                </div>

                <Alert variant="warning" title="Nagle + Delayed ACK = 지연 문제:">
                    Nagle 알고리즘은 작은 패킷들을 모아 하나의 큰 패킷으로 보내려 하고,
                    Delayed ACK는 ACK를 지연시킵니다. 둘이 동시에 활성화되면 서로를 기다리며
                    최대 200ms의 불필요한 지연이 발생합니다.
                    실시간 애플리케이션에서는 TCP_NODELAY 옵션으로 Nagle을 비활성화합니다.
                </Alert>

                <CodeBlock code={tcpTuningCode} language="bash" filename="tcp-tuning.sh" />
            </Section>

            {/* ── 5.9 UDP 특징과 활용 ─────────────────────────── */}
            <Section id="s059" title="5.9  UDP의 특징과 활용">
                <Prose>
                    UDP(User Datagram Protocol)는 연결 설정 없이 데이터를 전송하는 비연결형 프로토콜입니다.
                    헤더가 8바이트로 매우 간단하고, TCP의 오버헤드(핸드셰이크, 재전송, 흐름 제어)가
                    없어 지연 시간이 최소화됩니다.
                </Prose>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatCard title="헤더 크기" value="8 bytes" desc="Source Port + Dest Port + Length + Checksum" color="cyan" />
                    <StatCard title="연결 설정" value="없음" desc="바로 데이터 전송 가능" color="green" />
                    <StatCard title="신뢰성" value="미보장" desc="애플리케이션이 직접 처리" color="amber" />
                    <StatCard title="순서 보장" value="없음" desc="도착 순서 보장하지 않음" color="red" />
                </div>

                <InfoBox color="cyan" title="UDP 헤더 구조 (8바이트)">
                    <code className="text-xs">
                        0                   1                   2                   3<br />
                        0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1<br />
                        +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+<br />
                        |          Source Port          |       Destination Port        |<br />
                        +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+<br />
                        |            Length             |           Checksum            |<br />
                        +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
                    </code>
                </InfoBox>

                <InfoTable
                    headers={['프로토콜/용도', '포트', 'UDP를 쓰는 이유']}
                    rows={udpUseCaseRows}
                />

                <Alert variant="info" title="UDP 위의 신뢰성:">
                    UDP 자체는 신뢰성을 보장하지 않지만, 애플리케이션이 직접 구현할 수 있습니다.
                    DNS는 타임아웃 후 재질의, 게임은 최신 상태만 전송(오래된 데이터 폐기),
                    QUIC은 스트림 단위 재전송을 구현합니다.
                </Alert>

                <CodeBlock code={tcpSocketCode} language="python" filename="tcp-socket-example.py" />
            </Section>

            {/* ── 5.10 QUIC 프로토콜 ──────────────────────────── */}
            <Section id="s0510" title="5.10  QUIC 프로토콜">
                <Prose>
                    QUIC(Quick UDP Internet Connections)은 Google이 개발하고 IETF가 표준화한 전송 계층
                    프로토콜입니다. UDP 위에 구현되어 TCP+TLS의 기능을 통합하면서도, TCP의 근본적인
                    한계를 해결합니다. HTTP/3의 전송 계층으로 채택되었습니다.
                </Prose>

                <InfoBox color="emerald" title="QUIC 등장 배경: TCP의 한계">
                    <strong>1. Head-of-Line Blocking:</strong> TCP는 하나의 바이트 스트림이므로,
                    중간 패킷 하나가 유실되면 뒤따르는 모든 데이터가 블로킹됩니다.
                    HTTP/2의 멀티플렉싱도 TCP 위에서는 이 문제를 해결할 수 없습니다.<br /><br />
                    <strong>2. 느린 연결 수립:</strong> TCP 3-way handshake(1 RTT) + TLS 1.3(1 RTT) =
                    최소 2 RTT가 필요합니다. 모바일 환경에서 RTT가 100ms라면 연결에만 200ms가 소요됩니다.<br /><br />
                    <strong>3. 커널 의존성:</strong> TCP는 OS 커널에 구현되어 있어 프로토콜 개선 속도가
                    매우 느립니다. 배포에 수년이 걸릴 수 있습니다.
                </InfoBox>

                <InfoTable
                    headers={['항목', 'QUIC', 'TCP + TLS']}
                    rows={quicVsTcpRows}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <StatCard title="연결 수립" value="0~1 RTT" desc="재접속 시 0-RTT 가능" color="green" />
                    <StatCard title="HOL Blocking" value="스트림 독립" desc="개별 스트림 손실만 영향" color="blue" />
                    <StatCard title="채택 현황" value="HTTP/3" desc="Chrome, Safari 등 지원" color="purple" />
                </div>

                <Alert variant="tip" title="Connection Migration:">
                    QUIC는 Connection ID로 연결을 식별하므로, 모바일에서 Wi-Fi에서 LTE로 전환해도
                    (IP 주소가 바뀌어도) 연결이 끊기지 않습니다. TCP는 (IP:Port) 4-tuple로 연결을
                    식별하므로 IP가 바뀌면 재연결이 필요합니다.
                </Alert>

                <CodeBlock code={netstatCode} language="bash" filename="netstat-connections.sh" />
            </Section>

            {/* ── 5.11 요약 ───────────────────────────────────── */}
            <Section id="s0511" title="5.11  요약">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoBox color="blue" title="포트와 소켓">
                        포트 번호(16비트)로 프로세스를 식별하고, 소켓은 (프로토콜, IP, 포트)의 조합입니다.
                        TCP 연결은 두 소켓 쌍으로 유일하게 식별됩니다.
                    </InfoBox>
                    <InfoBox color="purple" title="TCP 연결 관리">
                        3-way handshake(SYN→SYN+ACK→ACK)로 연결을 수립하고,
                        4-way handshake(FIN→ACK→FIN→ACK)로 종료합니다.
                        TIME_WAIT는 2MSL 동안 유지됩니다.
                    </InfoBox>
                    <InfoBox color="green" title="신뢰성 보장">
                        시퀀스 번호와 누적 ACK로 순서 보장과 손실 감지를 수행합니다.
                        RTO 기반 재전송과 Fast Retransmit으로 유실된 데이터를 복구합니다.
                    </InfoBox>
                    <InfoBox color="amber" title="흐름/혼잡 제어">
                        흐름 제어(rwnd)는 수신자를, 혼잡 제어(cwnd)는 네트워크를 보호합니다.
                        Slow Start → Congestion Avoidance → Fast Recovery의 사이클로 동작합니다.
                    </InfoBox>
                    <InfoBox color="cyan" title="UDP">
                        8바이트 헤더, 비연결형, 신뢰성 미보장이지만 최소 지연이 장점입니다.
                        DNS, 스트리밍, 게임, VoIP 등 실시간 애플리케이션에 적합합니다.
                    </InfoBox>
                    <InfoBox color="emerald" title="QUIC">
                        UDP 위에 구현된 차세대 전송 프로토콜입니다. 0-RTT 연결, HOL Blocking 해결,
                        Connection Migration 등 TCP의 한계를 극복합니다. HTTP/3의 기반입니다.
                    </InfoBox>
                </div>

                <Alert variant="tip">
                    전송 계층은 OS 커널에서 구현되어 사용자가 직접 다루기 어렵지만,
                    ss, tcpdump, sysctl 등의 도구로 상태를 관찰하고 파라미터를 튜닝할 수 있습니다.
                    다음 토픽에서는 전송 계층 위에 구축되는 응용 계층 프로토콜을 학습합니다.
                </Alert>
            </Section>

            <TopicNavigation topicId="05-transport" />
        </div>
    )
}
