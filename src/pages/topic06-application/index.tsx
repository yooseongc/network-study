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
import { DnsResolutionDiagram } from '../../components/concepts/application/DnsResolutionDiagram'
import { TlsHandshakeDiagram } from '../../components/concepts/application/TlsHandshakeDiagram'
import {
    digCode,
    nslookupCode,
    curlCode,
    opensslCode,
    dhcpCode,
    sshCode,
} from './codeSnippets'

/* ── inline data ──────────────────────────────────────────────── */

const dnsRecordRows = [
    { cells: ['A', '도메인 → IPv4 주소', 'example.com → 93.184.216.34'] },
    { cells: ['AAAA', '도메인 → IPv6 주소', 'example.com → 2606:2800:220:1:...'] },
    { cells: ['CNAME', '도메인 → 다른 도메인 (별칭)', 'www.example.com → example.com'] },
    { cells: ['MX', '메일 서버 지정', 'example.com → mail.example.com (우선순위 10)'] },
    { cells: ['NS', '네임서버 지정', 'example.com → a.iana-servers.net'] },
    { cells: ['TXT', '텍스트 정보 (SPF, DKIM 등)', '"v=spf1 include:_spf.google.com ~all"'] },
    { cells: ['SOA', 'Zone 권한 시작 레코드', '시리얼 번호, 갱신 간격, 만료 시간 등'] },
    { cells: ['PTR', 'IP → 도메인 (역방향)', '34.216.184.93 → example.com'] },
    { cells: ['SRV', '서비스 위치 지정', '_sip._tcp.example.com → sip.example.com:5060'] },
]

const httpMethodRows = [
    { cells: ['GET', '리소스 조회', '멱등', '요청 본문 없음. 가장 많이 사용'] },
    { cells: ['POST', '리소스 생성/처리', '비멱등', '요청 본문에 데이터 포함'] },
    { cells: ['PUT', '리소스 전체 교체', '멱등', '존재하면 교체, 없으면 생성'] },
    { cells: ['PATCH', '리소스 부분 수정', '비멱등', '변경할 필드만 전송'] },
    { cells: ['DELETE', '리소스 삭제', '멱등', '지정된 리소스 제거'] },
    { cells: ['HEAD', 'GET과 동일하나 본문 없음', '멱등', '헤더만 확인 (캐시 검증 등)'] },
    { cells: ['OPTIONS', '지원 메서드 확인', '멱등', 'CORS preflight에 사용'] },
]

const httpStatusRows = [
    { cells: ['1xx', '정보 응답', '100 Continue, 101 Switching Protocols'] },
    { cells: ['2xx', '성공', '200 OK, 201 Created, 204 No Content'] },
    { cells: ['3xx', '리다이렉션', '301 Moved Permanently, 302 Found, 304 Not Modified'] },
    { cells: ['4xx', '클라이언트 에러', '400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found'] },
    { cells: ['5xx', '서버 에러', '500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable'] },
]

const tlsVersionRows = [
    { cells: ['SSL 3.0', '1996', '사용 금지', 'POODLE 취약점'] },
    { cells: ['TLS 1.0', '1999', '사용 금지', 'BEAST 취약점'] },
    { cells: ['TLS 1.1', '2006', '사용 금지', '약한 암호 스위트'] },
    { cells: ['TLS 1.2', '2008', '허용 (최소)', '현재 가장 널리 사용'] },
    { cells: ['TLS 1.3', '2018', '권장', '1-RTT handshake, 강화된 보안'] },
]

const dhcpSteps = [
    { cells: ['Discover', 'Client → Broadcast', 'DHCP 서버를 찾는 브로드캐스트 메시지'] },
    { cells: ['Offer', 'Server → Client', '사용 가능한 IP 주소와 설정 정보 제안'] },
    { cells: ['Request', 'Client → Broadcast', '제안받은 IP 주소 사용을 요청 (다른 서버에도 알림)'] },
    { cells: ['Ack', 'Server → Client', 'IP 주소 할당 확정, 임대 기간 시작'] },
]

const emailProtocolRows = [
    { cells: ['SMTP', '25, 465(SSL), 587(TLS)', '메일 발송', '서버 간 메일 전달 (Push)'] },
    { cells: ['POP3', '110, 995(SSL)', '메일 수신', '서버에서 다운로드 후 삭제 (기본)'] },
    { cells: ['IMAP', '143, 993(SSL)', '메일 관리', '서버에 보관, 폴더 동기화, 여러 기기 지원'] },
]

const fileProtocolRows = [
    { cells: ['FTP', '20(Data), 21(Control)', '파일 전송', '비암호화, Active/Passive 모드'] },
    { cells: ['SFTP', '22 (SSH)', '보안 파일 전송', 'SSH 위에서 동작, 암호화'] },
    { cells: ['SCP', '22 (SSH)', '파일 복사', 'SSH 기반 단순 복사'] },
    { cells: ['SMB/CIFS', '445', '파일 공유', 'Windows 네트워크 공유'] },
    { cells: ['NFS', '2049', '파일 공유', 'Unix/Linux 네트워크 파일 시스템'] },
]

const proxyCompareRows = [
    { cells: ['위치', '클라이언트 앞 (Client-side)', '서버 앞 (Server-side)'] },
    { cells: ['클라이언트 인식', '클라이언트가 프록시를 알고 있음', '클라이언트가 프록시를 모름'] },
    { cells: ['주 용도', '익명성, 접근 제어, 캐싱', '로드 밸런싱, SSL 종단, 보안'] },
    { cells: ['대상 보호', '클라이언트 보호', '서버 보호'] },
    { cells: ['예시', 'Squid, 기업 웹 프록시', 'Nginx, HAProxy, AWS ALB/ELB'] },
    { cells: ['캐싱', '클라이언트 측 캐시', 'CDN, 서버 측 캐시'] },
]

/* ── component ────────────────────────────────────────────────── */

export default function Topic06() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-14">
            {/* Header */}
            <header className="space-y-3">
                <p className="text-xs font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                    Topic 06
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    이름 해석과 주요 응용 프로토콜
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    DNS, HTTP, TLS & Application Protocols
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    DNS 질의 과정과 HTTP/HTTPS 통신, TLS handshake의 동작을 단계별로 학습합니다.
                    DHCP, SSH, 메일/파일 전송 프로토콜, 그리고 프록시의 역할까지 응용 계층의
                    핵심 프로토콜을 포괄적으로 다룹니다.
                </p>
            </header>

            <LearningCard
                topicId="06-application"
                items={[
                    'DNS 재귀/반복 질의 과정을 이해한다',
                    'HTTP 요청/응답 구조와 주요 메서드를 설명할 수 있다',
                    'TLS 1.3 handshake 과정을 이해한다',
                    'DHCP DORA 프로세스를 설명할 수 있다',
                    '프록시와 리버스 프록시의 차이를 파악한다',
                ]}
            />

            {/* ── 6.1 DNS의 역할과 동작 ─────────────────────────── */}
            <Section id="s061" title="6.1  DNS의 역할과 동작">
                <Prose>
                    DNS(Domain Name System)는 사람이 읽을 수 있는 도메인 이름(예:{' '}
                    <code className="bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono">
                        www.example.com
                    </code>
                    )을 컴퓨터가 사용하는 IP 주소로 변환하는 분산 계층형 데이터베이스입니다.
                    인터넷의 전화번호부 역할을 하며, 거의 모든 인터넷 통신의 첫 단계입니다.
                </Prose>

                <InfoBox color="blue" title="DNS 도메인 계층 구조">
                    <p>DNS는 트리 구조의 계층형 네임스페이스를 사용합니다.</p>
                    <p className="font-mono mt-1">. (Root) → .com (TLD) → example.com (SLD) → www.example.com (호스트)</p>
                    <p className="mt-1">각 수준은 서로 다른 네임서버가 관리하며, 이를 통해 전 세계 도메인을 분산 관리합니다.</p>
                </InfoBox>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatCard title="Root NS" value="13개 클러스터" color="blue" desc="a~m.root-servers.net" />
                    <StatCard title="기본 포트" value="UDP 53" color="purple" desc="TCP도 사용 (Zone Transfer)" />
                    <StatCard title="캐시 TTL" value="300 ~ 86400 s" color="green" desc="도메인별 설정" />
                    <StatCard title="전 세계 도메인" value="~3.5억 개" color="amber" desc="지속 증가 중" />
                </div>

                <InfoBox color="green" title="주요 DNS 레코드 타입">
                    DNS 서버는 다양한 유형의 레코드를 저장합니다. 각 레코드는 특정 목적에 맞는 정보를 제공합니다.
                </InfoBox>

                <InfoTable
                    headers={['레코드', '설명', '예시']}
                    rows={dnsRecordRows}
                />

                <Alert variant="tip" title="DNS 캐싱:">
                    DNS 응답에는 TTL(Time To Live) 값이 포함됩니다. 클라이언트와 Local Resolver는
                    이 시간 동안 결과를 캐시하여 반복 질의를 줄입니다. TTL이 짧으면 변경이 빠르게 반영되지만
                    질의 빈도가 높아집니다.
                </Alert>

                <div className="flex flex-wrap gap-2">
                    <RfcRef rfc={1035} label="RFC 1035 — DNS" />
                    <RfcRef rfc={8484} label="RFC 8484 — DNS over HTTPS (DoH)" />
                    <RfcRef rfc={7858} label="RFC 7858 — DNS over TLS (DoT)" />
                </div>

                <CodeBlock code={digCode} language="bash" filename="dig — DNS 질의" />
                <CodeBlock code={nslookupCode} language="bash" filename="nslookup — DNS 조회" />
            </Section>

            {/* ── 6.2 DNS 질의 과정 ─────────────────────────────── */}
            <Section id="s062" title="6.2  DNS 질의 과정">
                <Prose>
                    DNS 질의에는 두 가지 방식이 있습니다.{' '}
                    <strong className="text-gray-800 dark:text-gray-200">재귀 질의(Recursive Query)</strong>는
                    클라이언트가 Local Resolver에게 최종 답을 요구하는 방식이고,{' '}
                    <strong className="text-gray-800 dark:text-gray-200">반복 질의(Iterative Query)</strong>는
                    Local Resolver가 각 네임서버에 차례로 질의하여 답을 찾아가는 방식입니다.
                </Prose>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoBox color="blue" title="재귀 질의 (Recursive)">
                        <p>클라이언트 → Local Resolver</p>
                        <p>&quot;최종 답을 알려주세요&quot;</p>
                        <p className="mt-1">Resolver가 모든 탐색을 대행</p>
                        <p>클라이언트는 한 번의 요청으로 결과를 받음</p>
                    </InfoBox>
                    <InfoBox color="amber" title="반복 질의 (Iterative)">
                        <p>Local Resolver → Root/TLD/Auth NS</p>
                        <p>&quot;다음에 누구에게 물어봐야 하나요?&quot;</p>
                        <p className="mt-1">각 NS가 다음 NS의 주소를 알려줌 (Referral)</p>
                        <p>Resolver가 단계별로 질의를 반복</p>
                    </InfoBox>
                </div>

                <DnsResolutionDiagram />

                <Alert variant="info" title="보안 참고:">
                    기본 DNS 질의는 암호화되지 않아 도청이 가능합니다. 이를 보완하기 위해
                    DNS over HTTPS(DoH, 포트 443)와 DNS over TLS(DoT, 포트 853)가 도입되었습니다.
                    DNSSEC은 응답의 무결성을 검증하여 DNS 스푸핑을 방지합니다.
                </Alert>
            </Section>

            {/* ── 6.3 HTTP 기본 구조 ────────────────────────────── */}
            <Section id="s063" title="6.3  HTTP 기본 구조">
                <Prose>
                    HTTP(HyperText Transfer Protocol)는 웹에서 클라이언트(브라우저)와 서버 간에
                    데이터를 교환하는 응용 계층 프로토콜입니다. 요청-응답(Request-Response) 모델을
                    기반으로 하며, 기본적으로 무상태(Stateless) 프로토콜입니다.
                </Prose>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoBox color="blue" title="HTTP 요청 (Request) 구조">
                        <p className="font-mono">GET /index.html HTTP/1.1</p>
                        <p className="font-mono">Host: www.example.com</p>
                        <p className="font-mono">User-Agent: Mozilla/5.0 ...</p>
                        <p className="font-mono">Accept: text/html</p>
                        <p className="font-mono">Connection: keep-alive</p>
                        <p className="mt-1">[요청 본문 — POST/PUT 시]</p>
                    </InfoBox>
                    <InfoBox color="green" title="HTTP 응답 (Response) 구조">
                        <p className="font-mono">HTTP/1.1 200 OK</p>
                        <p className="font-mono">Content-Type: text/html</p>
                        <p className="font-mono">Content-Length: 1256</p>
                        <p className="font-mono">Cache-Control: max-age=3600</p>
                        <p className="font-mono">Set-Cookie: sid=abc123</p>
                        <p className="mt-1">[응답 본문 — HTML, JSON 등]</p>
                    </InfoBox>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatCard title="기본 포트" value="80 (HTTP)" color="blue" desc="암호화 없음" />
                    <StatCard title="보안 포트" value="443 (HTTPS)" color="green" desc="TLS 암호화" />
                    <StatCard title="HTTP/2" value="2015" color="purple" desc="멀티플렉싱, 헤더 압축" />
                    <StatCard title="HTTP/3" value="2022" color="amber" desc="QUIC 기반 (UDP)" />
                </div>

                <InfoBox color="purple" title="HTTP 메서드">
                    HTTP 메서드는 서버에 수행할 작업의 종류를 알려줍니다.
                    멱등(Idempotent) 메서드는 동일한 요청을 여러 번 보내도 결과가 같습니다.
                </InfoBox>

                <InfoTable
                    headers={['메서드', '용도', '멱등성', '비고']}
                    rows={httpMethodRows}
                />

                <InfoBox color="amber" title="HTTP 상태 코드">
                    서버는 응답에 3자리 상태 코드를 포함합니다.
                    첫 번째 자릿수가 응답의 종류를 나타냅니다.
                </InfoBox>

                <InfoTable
                    headers={['범위', '분류', '주요 코드']}
                    rows={httpStatusRows}
                />

                <Alert variant="tip" title="HTTP/2 vs HTTP/3:">
                    HTTP/2는 단일 TCP 연결 위에 여러 스트림을 다중화(Multiplexing)합니다.
                    HTTP/3는 TCP 대신 QUIC(UDP 기반)을 사용하여 Head-of-Line Blocking 문제를
                    해결하고, 0-RTT 연결 재수립을 지원합니다.
                </Alert>

                <div className="flex flex-wrap gap-2">
                    <RfcRef rfc={9110} label="RFC 9110 — HTTP Semantics" />
                    <RfcRef rfc={9113} label="RFC 9113 — HTTP/2" />
                    <RfcRef rfc={9114} label="RFC 9114 — HTTP/3" />
                </div>

                <CodeBlock code={curlCode} language="bash" filename="curl — HTTP 요청" />
            </Section>

            {/* ── 6.4 HTTPS와 TLS ───────────────────────────────── */}
            <Section id="s064" title="6.4  HTTPS와 TLS">
                <Prose>
                    HTTPS는 HTTP에 TLS(Transport Layer Security) 암호화를 추가한 것입니다.
                    TLS는 데이터의 기밀성(도청 방지), 무결성(변조 방지), 인증(신원 확인)을
                    보장합니다. 현대 웹에서는 HTTPS가 사실상 필수이며, 브라우저는 HTTP 사이트에
                    보안 경고를 표시합니다.
                </Prose>

                <InfoBox color="green" title="TLS가 제공하는 보안 속성">
                    <p><strong>기밀성 (Confidentiality):</strong> 대칭 암호화(AES-GCM 등)로 통신 내용을 보호</p>
                    <p><strong>무결성 (Integrity):</strong> MAC/AEAD로 데이터 변조 탐지</p>
                    <p><strong>인증 (Authentication):</strong> X.509 인증서로 서버(선택적으로 클라이언트) 신원 확인</p>
                </InfoBox>

                <InfoTable
                    headers={['버전', '공개 연도', '현재 상태', '비고']}
                    rows={tlsVersionRows}
                />

                <Prose>
                    TLS 1.3은 handshake를 1-RTT로 줄이고, 취약한 암호 알고리즘을 제거하며,
                    0-RTT resumption을 지원합니다. 아래 다이어그램에서 TLS 1.3 handshake
                    과정을 단계별로 확인할 수 있습니다.
                </Prose>

                <TlsHandshakeDiagram />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <InfoBox color="blue" title="대칭 암호화">
                        <p>AES-128-GCM, AES-256-GCM</p>
                        <p>ChaCha20-Poly1305</p>
                        <p className="mt-1">빠른 속도, 동일 키로 암/복호화</p>
                    </InfoBox>
                    <InfoBox color="purple" title="비대칭 암호화 (키 교환)">
                        <p>ECDHE (Elliptic Curve Diffie-Hellman)</p>
                        <p>X25519, P-256</p>
                        <p className="mt-1">Forward Secrecy 보장</p>
                    </InfoBox>
                    <InfoBox color="green" title="인증서 (PKI)">
                        <p>X.509 v3 인증서</p>
                        <p>CA(인증기관) 체인 검증</p>
                        <p className="mt-1">Let&apos;s Encrypt 무료 인증서</p>
                    </InfoBox>
                </div>

                <Alert variant="warning" title="주의:">
                    TLS 1.3의 0-RTT(Early Data)는 재전송 공격(Replay Attack)에 취약할 수 있습니다.
                    민감한 작업(결제, 상태 변경)에는 0-RTT 데이터를 사용하지 않아야 합니다.
                </Alert>

                <div className="flex flex-wrap gap-2">
                    <RfcRef rfc={8446} label="RFC 8446 — TLS 1.3" />
                    <RfcRef rfc={6125} label="RFC 6125 — 인증서 검증" />
                </div>

                <CodeBlock code={opensslCode} language="bash" filename="openssl s_client — TLS 연결 확인" />
            </Section>

            {/* ── 6.5 DHCP ──────────────────────────────────────── */}
            <Section id="s065" title="6.5  DHCP">
                <Prose>
                    DHCP(Dynamic Host Configuration Protocol)는 네트워크에 접속하는 장치에
                    IP 주소, 서브넷 마스크, 게이트웨이, DNS 서버 등의 네트워크 설정을
                    자동으로 할당하는 프로토콜입니다. 가정의 공유기부터 대규모 기업 네트워크까지
                    광범위하게 사용됩니다.
                </Prose>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatCard title="서버 포트" value="UDP 67" color="blue" desc="서버 수신" />
                    <StatCard title="클라이언트 포트" value="UDP 68" color="purple" desc="클라이언트 수신" />
                    <StatCard title="임대 시간" value="1 ~ 24시간" color="green" desc="네트워크별 설정" />
                    <StatCard title="DORA" value="4단계" color="amber" desc="Discover→Offer→Request→Ack" />
                </div>

                <InfoBox color="blue" title="DHCP DORA 프로세스">
                    DHCP 주소 할당은 4단계로 이루어집니다. 클라이언트에 IP가 없는 상태에서
                    시작하므로 초기 메시지는 브로드캐스트로 전송됩니다.
                </InfoBox>

                <InfoTable
                    headers={['단계', '방향', '설명']}
                    rows={dhcpSteps}
                />

                <InfoBox color="amber" title="DHCP 임대 갱신">
                    <p><strong>T1 (50%):</strong> 임대 시간의 50%가 지나면 할당된 서버에 유니캐스트로 갱신 요청</p>
                    <p><strong>T2 (87.5%):</strong> T1 갱신 실패 시 브로드캐스트로 아무 DHCP 서버에 갱신 요청</p>
                    <p><strong>만료:</strong> 갱신 실패 시 IP 주소 반납, DORA 처음부터 다시 시작</p>
                </InfoBox>

                <Alert variant="info" title="DHCP Relay:">
                    DHCP 브로드캐스트는 라우터를 넘지 못합니다. 다른 서브넷의 DHCP 서버를
                    사용하려면 라우터에 DHCP Relay Agent를 설정하여 유니캐스트로 전달해야 합니다.
                </Alert>

                <div className="flex flex-wrap gap-2">
                    <RfcRef rfc={2131} label="RFC 2131 — DHCP" />
                    <RfcRef rfc={8415} label="RFC 8415 — DHCPv6" />
                </div>

                <CodeBlock code={dhcpCode} language="bash" filename="DHCP 클라이언트 동작" />
            </Section>

            {/* ── 6.6 SSH와 원격 접속 ───────────────────────────── */}
            <Section id="s066" title="6.6  SSH와 원격 접속">
                <Prose>
                    SSH(Secure Shell)는 암호화된 채널을 통해 원격 서버에 안전하게 접속하는
                    프로토콜입니다. 과거의 Telnet(평문 전송)을 대체하며, 원격 셸 접속뿐 아니라
                    파일 전송(SCP, SFTP), 포트 포워딩, VPN 터널링 등 다양한 용도로 활용됩니다.
                </Prose>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatCard title="기본 포트" value="TCP 22" color="blue" desc="변경 권장 (보안)" />
                    <StatCard title="현재 버전" value="SSH-2" color="green" desc="SSH-1은 사용 금지" />
                    <StatCard title="키 알고리즘" value="Ed25519" color="purple" desc="현재 권장 (빠르고 안전)" />
                    <StatCard title="Telnet 대체" value="1995~" color="amber" desc="암호화 통신" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoBox color="blue" title="비밀번호 인증">
                        <p>서버에 사용자 ID/PW를 전송하여 인증</p>
                        <p>간편하지만 브루트포스 공격에 취약</p>
                        <p className="mt-1">프로덕션 환경에서는 비활성화 권장</p>
                    </InfoBox>
                    <InfoBox color="green" title="공개키 인증 (권장)">
                        <p>클라이언트가 개인키로 서명, 서버가 공개키로 검증</p>
                        <p>비밀번호 없이 안전한 인증</p>
                        <p className="mt-1">~/.ssh/authorized_keys에 공개키 등록</p>
                    </InfoBox>
                </div>

                <InfoBox color="purple" title="SSH 포트 포워딩 (터널링)">
                    <p><strong>로컬 포워딩 (-L):</strong> 로컬 포트를 원격 서버의 포트로 전달. 방화벽 뒤의 서비스 접근에 유용.</p>
                    <p><strong>원격 포워딩 (-R):</strong> 원격 서버의 포트를 로컬로 전달. NAT 뒤의 서비스 노출에 사용.</p>
                    <p><strong>동적 포워딩 (-D):</strong> SOCKS 프록시 생성. 모든 트래픽을 SSH 터널로 전달.</p>
                </InfoBox>

                <Alert variant="warning" title="보안 강화:">
                    SSH 서버 보안을 위해 (1) 기본 포트 변경, (2) 비밀번호 인증 비활성화,
                    (3) root 로그인 차단, (4) fail2ban 설치를 권장합니다.
                </Alert>

                <div className="flex flex-wrap gap-2">
                    <RfcRef rfc={4253} label="RFC 4253 — SSH Transport" />
                    <RfcRef rfc={4254} label="RFC 4254 — SSH Connection" />
                </div>

                <CodeBlock code={sshCode} language="bash" filename="SSH 접속 및 키 관리" />
            </Section>

            {/* ── 6.7 기타 응용 프로토콜 ────────────────────────── */}
            <Section id="s067" title="6.7  기타 응용 프로토콜">
                <Prose>
                    인터넷에서는 웹 브라우징 외에도 다양한 목적의 응용 프로토콜이 동작합니다.
                    이메일 송수신, 파일 전송, 시간 동기화 등 각 서비스에 특화된 프로토콜이
                    존재합니다.
                </Prose>

                <InfoBox color="blue" title="이메일 프로토콜: SMTP / POP3 / IMAP">
                    이메일은 발송(SMTP)과 수신(POP3/IMAP)에 서로 다른 프로토콜을 사용합니다.
                    SMTP는 메일을 보내는 데, POP3/IMAP은 메일을 가져오는 데 사용됩니다.
                </InfoBox>

                <InfoTable
                    headers={['프로토콜', '포트', '용도', '특징']}
                    rows={emailProtocolRows}
                />

                <Alert variant="tip" title="IMAP vs POP3:">
                    POP3는 메일을 다운로드 후 서버에서 삭제하는 것이 기본이므로 단일 기기에 적합합니다.
                    IMAP은 서버에 메일을 보관하고 폴더를 동기화하므로 여러 기기에서 동일한 메일함을
                    관리할 수 있습니다. 현대 이메일 서비스 대부분은 IMAP을 권장합니다.
                </Alert>

                <InfoBox color="green" title="파일 전송 프로토콜: FTP / SFTP / SMB / NFS">
                    네트워크를 통한 파일 전송과 공유에는 용도와 보안 수준에 따라 다양한
                    프로토콜이 사용됩니다.
                </InfoBox>

                <InfoTable
                    headers={['프로토콜', '포트', '용도', '특징']}
                    rows={fileProtocolRows}
                />

                <InfoBox color="amber" title="NTP (Network Time Protocol)">
                    <p>NTP는 네트워크를 통해 시스템 시간을 동기화하는 프로토콜입니다 (UDP 123).</p>
                    <p>계층적 Stratum 구조를 사용합니다:</p>
                    <p className="font-mono mt-1">Stratum 0: 원자시계, GPS 수신기 (참조 시계)</p>
                    <p className="font-mono">Stratum 1: 직접 연결된 NTP 서버 (pool.ntp.org)</p>
                    <p className="font-mono">Stratum 2~15: 하위 계층 서버 (기업 내부 등)</p>
                    <p className="mt-1">
                        정확한 시간 동기화는 로그 분석, 인증서 유효성 검증, 분산 시스템 일관성에 필수적입니다.
                        Linux에서는{' '}
                        <code className="bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-300 px-1 py-0.5 rounded text-xs font-mono">
                            chrony
                        </code>{' '}
                        또는{' '}
                        <code className="bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-300 px-1 py-0.5 rounded text-xs font-mono">
                            systemd-timesyncd
                        </code>
                        를 사용합니다.
                    </p>
                </InfoBox>

                <div className="flex flex-wrap gap-2">
                    <RfcRef rfc={5321} label="RFC 5321 — SMTP" />
                    <RfcRef rfc={1939} label="RFC 1939 — POP3" />
                    <RfcRef rfc={9051} label="RFC 9051 — IMAP" />
                    <RfcRef rfc={5905} label="RFC 5905 — NTP v4" />
                </div>
            </Section>

            {/* ── 6.8 프록시와 리버스 프록시 ────────────────────── */}
            <Section id="s068" title="6.8  프록시와 리버스 프록시">
                <Prose>
                    프록시(Proxy)는 클라이언트와 서버 사이에서 요청을 중계하는 중간 서버입니다.
                    프록시의 위치와 역할에 따라{' '}
                    <strong className="text-gray-800 dark:text-gray-200">포워드 프록시</strong>와{' '}
                    <strong className="text-gray-800 dark:text-gray-200">리버스 프록시</strong>로 구분합니다.
                </Prose>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoBox color="blue" title="포워드 프록시 (Forward Proxy)">
                        <p className="font-mono">Client → [Forward Proxy] → Server</p>
                        <p className="mt-1">클라이언트 측에 위치하며 클라이언트를 대리합니다.</p>
                        <p><strong>용도:</strong> 익명성 보호, 접근 제어, 콘텐츠 필터링, 캐싱</p>
                        <p><strong>예시:</strong> 기업 웹 프록시, Squid, VPN</p>
                    </InfoBox>
                    <InfoBox color="green" title="리버스 프록시 (Reverse Proxy)">
                        <p className="font-mono">Client → [Reverse Proxy] → Backend Server(s)</p>
                        <p className="mt-1">서버 측에 위치하며 서버를 대리합니다.</p>
                        <p><strong>용도:</strong> 로드 밸런싱, SSL 종단, 캐싱, DDoS 방어</p>
                        <p><strong>예시:</strong> Nginx, HAProxy, Cloudflare, AWS ALB</p>
                    </InfoBox>
                </div>

                <InfoTable
                    headers={['비교 항목', '포워드 프록시', '리버스 프록시']}
                    rows={proxyCompareRows}
                />

                <Alert variant="tip" title="SSL/TLS 종단 (Termination):">
                    리버스 프록시에서 HTTPS를 종단하면, 백엔드 서버는 평문 HTTP로 통신할 수 있어
                    인증서 관리가 단순해지고 암/복호화 부하가 분산됩니다. 다만 프록시와 백엔드 간
                    통신이 내부 네트워크여야 보안이 유지됩니다.
                </Alert>

                <InfoBox color="purple" title="투명 프록시 (Transparent Proxy)">
                    <p>클라이언트가 프록시의 존재를 모르는 상태에서 동작합니다.</p>
                    <p>네트워크 장비(라우터, 방화벽)가 트래픽을 프록시로 리다이렉트합니다.</p>
                    <p className="mt-1">ISP의 HTTP 캐싱, 기업의 콘텐츠 필터링 등에 사용됩니다.</p>
                </InfoBox>
            </Section>

            {/* ── 6.9 요약 ──────────────────────────────────────── */}
            <Section id="s069" title="6.9  요약">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoBox color="blue" title="DNS">
                        <p>도메인 → IP 변환, 계층형 분산 시스템</p>
                        <p>재귀 질의 + 반복 질의 조합</p>
                        <p>A, AAAA, CNAME, MX 등 다양한 레코드</p>
                    </InfoBox>
                    <InfoBox color="green" title="HTTP/HTTPS">
                        <p>요청-응답 모델, 무상태 프로토콜</p>
                        <p>GET/POST/PUT/DELETE 등 메서드</p>
                        <p>TLS로 암호화 → HTTPS</p>
                    </InfoBox>
                    <InfoBox color="purple" title="TLS">
                        <p>기밀성 + 무결성 + 인증</p>
                        <p>TLS 1.3: 1-RTT handshake</p>
                        <p>ECDHE 키 교환 + AES-GCM 암호화</p>
                    </InfoBox>
                    <InfoBox color="amber" title="DHCP">
                        <p>IP 자동 할당 (DORA 4단계)</p>
                        <p>임대 기반 관리 (T1/T2 갱신)</p>
                        <p>브로드캐스트 → Relay Agent 필요</p>
                    </InfoBox>
                    <InfoBox color="cyan" title="SSH">
                        <p>암호화된 원격 접속 (포트 22)</p>
                        <p>공개키 인증 권장</p>
                        <p>포트 포워딩, SFTP 지원</p>
                    </InfoBox>
                    <InfoBox color="rose" title="프록시">
                        <p>포워드: 클라이언트 보호/제어</p>
                        <p>리버스: 서버 보호, LB, SSL 종단</p>
                        <p>투명 프록시: 클라이언트 비인지</p>
                    </InfoBox>
                </div>

                <Alert variant="info" title="다음 토픽:">
                    Topic 07에서는 지금까지 학습한 프로토콜들이 실제 서비스 환경에서 어떻게
                    조합되어 동작하는지, 클라이언트 요청이 DNS → TCP → TLS → HTTP를 거쳐
                    서버에 도달하는 전체 트래픽 흐름을 추적합니다.
                </Alert>
            </Section>

            <TopicNavigation topicId="06-application" />
        </div>
    )
}
