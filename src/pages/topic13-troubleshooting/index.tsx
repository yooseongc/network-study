import { TroubleshootFlowDiagram } from '../../components/concepts/troubleshoot/TroubleshootFlowDiagram'
import { Alert, CardGrid, CodeBlock, InfoBox, InfoTable, InlineCode, Prose, Section, StatCard, T , TopicPage } from '@study-ui/components'
import {
    pingCode, tracerouteCode, mtrCode, tcpdumpBasicCode, tcpdumpFlagCode,
    dnsDebugCode, tcpDebugCode, mtuDebugCode, ssSocketCode, dmesgNetCode,
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
    { cells: ['Code 1', 'Host Unreachable', '호스트에 도달할 수 없음'] },
    { cells: ['Code 3', 'Port Unreachable', 'UDP 포트에 리스닝 프로세스 없음'] },
    { cells: ['Code 4', 'Fragmentation Needed', 'DF 비트인데 MTU 초과'] },
    { cells: ['Code 13', 'Comm. Admin Prohibited', '방화벽/ACL에 의해 차단'] },
]

const tcpFlagRows = [
    { cells: ['SYN', 'S', '연결 시작 요청', '3-way handshake 첫 단계'] },
    { cells: ['ACK', '.', '확인 응답', '거의 모든 패킷에 포함'] },
    { cells: ['SYN+ACK', 'S.', '연결 수락', '서버가 SYN에 응답'] },
    { cells: ['FIN', 'F', '정상 연결 종료', '4-way handshake'] },
    { cells: ['RST', 'R', '연결 강제 종료', '포트 닫힘, 방화벽 차단 등'] },
    { cells: ['PSH', 'P', '즉시 전달 요청', '버퍼 대기 없이 전달'] },
    { cells: ['URG', 'U', '긴급 데이터', '드물게 사용'] },
]

const rstCauseRows = [
    { cells: ['포트 닫힘', '대상 포트에 리스닝 프로세스가 없음', '서비스 미가동'] },
    { cells: ['방화벽 REJECT', '방화벽이 RST로 거부 응답', 'iptables -j REJECT'] },
    { cells: ['conntrack 만료', 'NAT 장비의 세션 테이블에서 삭제됨', '긴 유휴 연결'] },
    { cells: ['TCP 스택 이상', '잘못된 seq/ack, 비정상 상태', '커널 버그, 중간 장비 문제'] },
]

const dnsFailureRows = [
    { cells: ['SERVFAIL', 'DNS 서버 내부 오류', '재귀 질의 실패'] },
    { cells: ['NXDOMAIN', '도메인 존재하지 않음', '오타, 도메인 만료'] },
    { cells: ['REFUSED', 'DNS 서버가 질의 거부', '허용되지 않은 클라이언트'] },
    { cells: ['timeout', '응답 없음', 'DNS 서버 장애, UDP 53 차단'] },
]

const handshakeFailRows = [
    { cells: ['SYN → timeout', 'SYN 패킷 유실', '방화벽 DROP, 서버 다운'] },
    { cells: ['SYN → RST', '즉시 거부', '포트 닫힘, 방화벽 REJECT'] },
    { cells: ['SYN → SYN-ACK → timeout', 'ACK 유실', '비대칭 라우팅'] },
    { cells: ['ESTABLISHED → RST', '연결 중 리셋', 'conntrack 만료'] },
    { cells: ['재전송 반복', 'ACK 미수신', '패킷 유실, MTU 문제'] },
]

const mtuScenarioRows = [
    { cells: ['VPN/터널', 'GRE: 1476, IPSec: ~1400', '터널 헤더 추가로 유효 MTU 감소'] },
    { cells: ['PPPoE', '1492', 'PPPoE 헤더 8바이트'] },
    { cells: ['VXLAN', '1450', 'VXLAN 헤더 50바이트'] },
    { cells: ['Docker overlay', '1450', 'VXLAN 기반 오버레이'] },
    { cells: ['Jumbo Frame', '9000', '데이터센터 내부 고성능'] },
]

const diagToolRows = [
    { cells: ['소켓 상태', 'ss -tnp', '연결 상태, 프로세스 매핑'] },
    { cells: ['라우팅 경로', 'ip route get <IP>', '실제 사용 경로'] },
    { cells: ['ARP/Neighbor', 'ip neigh show', 'L2 도달성'] },
    { cells: ['인터페이스 통계', 'ip -s link show', '드롭, 에러 카운터'] },
    { cells: ['커널 로그', 'dmesg | grep -i net', 'conntrack full 등'] },
    { cells: ['conntrack', 'conntrack -L', 'NAT 세션 테이블'] },
    { cells: ['패킷 캡처', 'tcpdump -i eth0', '실제 패킷 흐름 확인'] },
    { cells: ['방화벽 카운터', 'iptables -L -v -n', '규칙별 매치 카운트'] },
]

/* ── Component ────────────────────────────────────────────────────── */

export default function Topic13Troubleshooting() {
    return (
        <TopicPage topicId="13-troubleshooting" learningItems={[
                    'tcpdump로 패킷 캡처 및 분석을 수행할 수 있다',
                    '장애 원인을 DNS/TCP/TLS 단계별로 구분할 수 있다',
                    '체계적 장애 분석 절차를 설명할 수 있다',
                ]}>

            <Section id="s131" title="13.1  장애 분석 기본 절차">
                <Prose>
                    네트워크 장애 분석에서 가장 중요한 것은 <strong>체계적 접근</strong>입니다.
                    OSI/TCP-IP 계층 모델을 기반으로 <strong>아래에서 위로(Bottom-Up)</strong> 순서대로 확인하는 것이 핵심입니다.
                </Prose>
                <InfoBox color="blue" title="Bottom-Up 접근법 (권장)">
                    물리 계층부터 시작하여 한 단계씩 올라가며 확인합니다.
                </InfoBox>
                <InfoTable headers={['단계', '확인 대상', '확인 내용', '주요 도구']} rows={troubleshootSteps} />
                <TroubleshootFlowDiagram />
                <Alert variant="tip" title="핵심 원칙:">
                    한 번에 하나의 변수만 변경하고, 변경 전 상태를 기록해 두세요.
                </Alert>
            </Section>

            <Section id="s132" title="13.2  ping과 ICMP">
                <Prose>
                    <InlineCode>ping</InlineCode>은 가장 기본적인 네트워크 진단 도구입니다.
                    ICMP Echo Request를 보내고 Echo Reply를 받아 도달성과 RTT를 확인합니다.
                </Prose>
                <CardGrid cols={3}>
                    <StatCard title="RTT" value="< 1ms" color="green" desc="같은 LAN 내" />
                    <StatCard title="RTT" value="1~50ms" color="amber" desc="같은 국가 내" />
                    <StatCard title="RTT" value="100~300ms" color="red" desc="대륙 간" />
                </CardGrid>
                <CodeBlock code={pingCode} language="bash" filename="ping 사용법" />
                <InfoTable headers={['타입', '이름', '설명']} rows={icmpTypeRows} />
                <InfoTable headers={['Code', '의미', '주요 원인']} rows={icmpUnreachCodes} />
                <Alert variant="warning" title="주의:">
                    ping이 성공해도 TCP/UDP 서비스가 정상이라는 보장은 없습니다.
                </Alert>
            </Section>

            <Section id="s133" title="13.3  traceroute와 mtr">
                <Prose>
                    <InlineCode>traceroute</InlineCode>는 TTL을 1부터 증가시키며 경로 상의 각 홉을 식별합니다.
                </Prose>
                <CodeBlock code={tracerouteCode} language="bash" filename="traceroute 사용법" />
                <Prose>
                    <InlineCode>mtr</InlineCode>은 ping과 traceroute를 결합한 도구입니다.
                </Prose>
                <CodeBlock code={mtrCode} language="bash" filename="mtr 사용법과 해석" />
                <Alert variant="info" title="mtr 해석 팁:">
                    특정 홉에서만 Loss%가 높고 그 이후 홉에서는 정상이면, ICMP rate-limiting일 수 있습니다.
                </Alert>
            </Section>

            <Section id="s134" title="13.4  tcpdump 기초">
                <Prose>
                    <InlineCode>tcpdump</InlineCode>는 리눅스에서 가장 많이 사용되는 패킷 캡처 도구입니다.
                </Prose>
                <CodeBlock code={tcpdumpBasicCode} language="bash" filename="tcpdump 기본 필터" />
                <Alert variant="tip" title="실무 팁:">
                    프로덕션 서버에서는 반드시 <InlineCode>-c</InlineCode> 옵션으로 패킷 수를 제한하세요.
                </Alert>
            </Section>

            <Section id="s135" title="13.5  TCP 플래그 읽기">
                <Prose>
                    <T id="tcpdump">tcpdump</T> 출력에서 <T id="tcp">TCP</T> 플래그를 읽는 것은 장애 분석의 핵심 기술입니다.
                </Prose>
                <InfoTable headers={['플래그', 'tcpdump 표기', '의미', '사용 맥락']} rows={tcpFlagRows} />
                <CodeBlock code={tcpdumpFlagCode} language="bash" filename="TCP 플래그 캡처와 해석" />
                <InfoBox color="red" title="RST(Reset) 패킷의 의미">
                    RST는 비정상 상황에서 발생하며, 장애 분석에서 RST의 원인을 파악하는 것이 중요합니다.
                </InfoBox>
                <InfoTable headers={['RST 원인', '설명', '대표적 상황']} rows={rstCauseRows} />
            </Section>

            <Section id="s136" title="13.6  DNS 장애 분석">
                <Prose>
                    &quot;사이트 접속이 안 된다&quot;는 신고의 상당수가 <T id="dns">DNS</T> 문제입니다.
                </Prose>
                <InfoTable headers={['응답 코드', '의미', '주요 원인']} rows={dnsFailureRows} />
                <CodeBlock code={dnsDebugCode} language="bash" filename="DNS 장애 진단 명령어" />
                <InfoBox color="amber" title="DNS vs TCP 장애 구분법">
                    IP 주소로 직접 접속을 시도합니다. IP로는 접속되는데 도메인으로는 안 되면 DNS 문제입니다.
                </InfoBox>
            </Section>

            <Section id="s137" title="13.7  TCP 연결 장애 분석">
                <Prose>
                    DNS가 정상인데 접속이 안 되면 TCP 연결 단계를 분석합니다.
                </Prose>
                <InfoTable headers={['패턴', '증상', '가능한 원인']} rows={handshakeFailRows} />
                <CodeBlock code={tcpDebugCode} language="bash" filename="TCP 연결 장애 진단" />
                <CardGrid cols={2}>
                    <StatCard title="TCP SYN 재전송" value="6회" color="amber" desc="net.ipv4.tcp_syn_retries" />
                    <StatCard title="재전송 간격" value="1s → 2s → 4s" color="red" desc="지수적 백오프" />
                </CardGrid>
            </Section>

            <Section id="s138" title="13.8  MTU / PMTU 문제">
                <Prose>
                    <T id="mtu">MTU</T>(Maximum Transmission Unit)는 한 번에 전송할 수 있는 최대 패킷 크기입니다.
                </Prose>
                <CodeBlock code={mtuDebugCode} language="bash" filename="MTU / PMTU 진단" />
                <InfoTable headers={['환경', 'MTU 값', '설명']} rows={mtuScenarioRows} />
                <Alert variant="warning" title="자주 놓치는 포인트:">
                    VPN이나 컨테이너 환경에서 MTU 문제가 특히 잘 발생합니다.
                </Alert>
            </Section>

            <Section id="s139" title="13.9  체계적 장애 분석 절차">
                <Prose>
                    실제 장애 상황에서는 패킷 캡처, 소켓 상태, 라우팅 테이블, 커널 로그를 종합적으로 확인해야 합니다.
                </Prose>
                <InfoTable headers={['관점', '명령어', '확인 내용']} rows={diagToolRows} />
                <CodeBlock code={ssSocketCode} language="bash" filename="통합 진단" />
                <CodeBlock code={dmesgNetCode} language="bash" filename="커널 로그로 네트워크 문제 확인" />
                <CardGrid cols={3}>
                    <InfoBox color="blue" title="NAT 문제 패턴">
                        - conntrack table full 로그{'\n'}
                        - 간헐적 연결 실패{'\n'}
                        - 특정 출발지만 문제
                    </InfoBox>
                    <InfoBox color="purple" title="방화벽 문제 패턴">
                        - SYN 보냈으나 응답 없음 (DROP){'\n'}
                        - SYN에 RST 응답 (REJECT){'\n'}
                        - iptables 카운터 증가
                    </InfoBox>
                    <InfoBox color="amber" title="라우팅 문제 패턴">
                        - 비대칭 라우팅{'\n'}
                        - 블랙홀 라우트{'\n'}
                        - Policy routing 충돌
                    </InfoBox>
                </CardGrid>
            </Section>

            <Section id="s1310" title="13.10  요약">
                <CardGrid cols={2}>
                    <InfoBox color="blue" title="진단 도구">
                        - <strong>ping</strong>: ICMP 기반 도달성 확인{'\n'}
                        - <strong>traceroute/mtr</strong>: 경로 추적{'\n'}
                        - <strong>tcpdump</strong>: 패킷 캡처{'\n'}
                        - <strong>ss</strong>: 소켓 상태{'\n'}
                        - <strong>dig</strong>: DNS 질의 테스트
                    </InfoBox>
                    <InfoBox color="green" title="장애 구분법">
                        - <strong>DNS 장애</strong>: IP로는 접속, 도메인으로는 불가{'\n'}
                        - <strong>TCP 장애</strong>: SYN timeout, RST, retransmission{'\n'}
                        - <strong>MTU 문제</strong>: 작은 패킷 OK, 큰 패킷 실패{'\n'}
                        - <strong>방화벽</strong>: DROP(timeout) vs REJECT(RST)
                    </InfoBox>
                </CardGrid>
                <CardGrid cols={3}>
                    <InfoBox color="amber" title="1. 체계적 접근">
                        Bottom-Up으로 물리→링크→네트워크→전송→응용 순서대로 원인을 좁혀갑니다.
                        ping 게이트웨이부터 시작하세요.
                    </InfoBox>
                    <InfoBox color="purple" title="2. 변수 하나씩">
                        한 번에 하나의 변수만 변경합니다.
                        동시에 여러 설정을 바꾸면 원인 특정이 불가능합니다.
                    </InfoBox>
                    <InfoBox color="cyan" title="3. 교차 검증">
                        패킷(tcpdump), 소켓(ss), 라우팅(ip route), 커널 로그(dmesg)를
                        함께 확인하여 다각도로 원인을 검증합니다.
                    </InfoBox>
                    <InfoBox color="red" title="4. 구간 분리">
                        정상 동작하는 구간과 장애 구간을 명확히 나눕니다.
                        traceroute로 어디까지 도달하는지 확인하세요.
                    </InfoBox>
                    <InfoBox color="indigo" title="5. 기록과 문서화">
                        변경 전 상태를 기록하고, 조치 내용과 결과를 문서화합니다.
                        동일 장애 재발 시 빠르게 대응할 수 있습니다.
                    </InfoBox>
                </CardGrid>
            </Section>
        </TopicPage>
    )
}
