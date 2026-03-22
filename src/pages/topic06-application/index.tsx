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
import { DnsResolutionDiagram } from '../../components/concepts/application/DnsResolutionDiagram'
import { TlsHandshakeDiagram } from '../../components/concepts/application/TlsHandshakeDiagram'
import {
    digCode,
    nslookupCode,
    curlCode,
    opensslCode,
    dhcpCode,
    sshCode,
    bindZoneCode,
    opensslChainCode,
    mtlsCurlCode,
    cipherSuiteCode,
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

const dnsServerTypeRows = [
    { cells: ['권한 네임서버 (Authoritative)', '특정 도메인의 실제 레코드를 보유', 'Primary(Master)와 Secondary(Slave)로 구분. Zone Transfer(AXFR/IXFR)로 동기화'] },
    { cells: ['재귀 리졸버 (Recursive Resolver)', '클라이언트 대신 DNS 트리를 탐색', '캐싱 기능, Forwarder 설정 가능. 8.8.8.8, 1.1.1.1 등'] },
    { cells: ['루트 네임서버 (Root NS)', 'TLD 네임서버 주소를 안내', '13개 클러스터(a~m), Anycast로 전 세계 분산 배치'] },
    { cells: ['TLD 네임서버', '.com, .net, .kr 등 최상위 도메인 관리', '해당 TLD 하위 도메인의 권한 NS를 안내'] },
    { cells: ['Stub Resolver', '최종 사용자 OS의 DNS 클라이언트', '/etc/resolv.conf에 설정된 재귀 리졸버에 질의 위임'] },
]

const dnsSoftwareRows = [
    { cells: ['BIND', '가장 오래된 DNS 서버, 기능 풍부', '권한/재귀 겸용, Zone 관리, DNSSEC 지원'] },
    { cells: ['Unbound', '재귀 리졸버 전용, 경량', '높은 성능, DNSSEC 검증, DoH/DoT 지원'] },
    { cells: ['PowerDNS', '데이터베이스 백엔드 지원', '권한 서버(MySQL/PostgreSQL), API 관리'] },
    { cells: ['CoreDNS', 'Kubernetes 기본 DNS', '플러그인 구조, Go 기반, 클라우드 네이티브'] },
    { cells: ['dnsmasq', '경량 DNS/DHCP 겸용', '소규모 네트워크, 가정용 라우터 내장'] },
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

const tls12vs13Rows = [
    { cells: ['Handshake RTT', '2-RTT', '1-RTT (0-RTT resumption 가능)'] },
    { cells: ['키 교환', 'RSA, DHE, ECDHE', 'ECDHE만 허용 (Forward Secrecy 필수)'] },
    { cells: ['암호 스위트', '다수 (취약한 것 포함)', 'AEAD만 허용 (5개)'] },
    { cells: ['ServerHello 이후', '평문', '암호화 (Encrypted Extensions)'] },
    { cells: ['인증서 전송', '평문', '암호화된 상태에서 전송'] },
    { cells: ['0-RTT', '미지원', '지원 (Replay 위험 주의)'] },
    { cells: ['압축', '지원 (CRIME 취약점)', '제거'] },
    { cells: ['재협상', '지원', '제거 (KeyUpdate로 대체)'] },
]

const certTypeRows = [
    { cells: ['DV (Domain Validation)', '도메인 소유권만 검증', '빠른 발급 (수 분), 저비용/무료 (Let\'s Encrypt)'] },
    { cells: ['OV (Organization Validation)', '조직 실체 확인', '기업 정보 심사, 1~3일 소요'] },
    { cells: ['EV (Extended Validation)', '엄격한 조직 검증', '녹색 주소창(구 브라우저), 법적 실체 확인, 최고 비용'] },
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

const attackTypeRows = [
    { cells: ['DDoS', '분산 서비스 거부', '대량의 트래픽/요청으로 서버/네트워크 마비', 'L3/L4(SYN Flood, UDP Flood), L7(HTTP Flood)'] },
    { cells: ['MITM', '중간자 공격', '통신 중간에서 데이터 도청/변조', 'ARP Spoofing, SSL Stripping, Rogue AP'] },
    { cells: ['DNS Spoofing', 'DNS 위조', '가짜 DNS 응답으로 악성 사이트로 유도', 'Cache Poisoning, Pharming'] },
    { cells: ['ARP Spoofing', 'ARP 위조', '가짜 ARP 응답으로 트래픽 가로채기', '동일 LAN 내 공격, Gateway 사칭'] },
    { cells: ['Port Scanning', '포트 스캔', '열린 포트/서비스 탐지', 'nmap SYN scan, Connect scan, UDP scan'] },
    { cells: ['Replay Attack', '재전송 공격', '정상 통신을 캡처 후 재전송', '인증 토큰 탈취, TLS 0-RTT 악용'] },
]

const defenseRows = [
    { cells: ['ACL', '접근 제어 목록', 'IP/포트 기반 트래픽 허용/차단'] },
    { cells: ['방화벽', 'Stateful Packet Inspection', 'L3/L4 연결 상태 추적 기반 필터링'] },
    { cells: ['IDS/IPS', '침입 탐지/방지 시스템', '시그니처/행위 기반 공격 탐지 (Snort, Suricata)'] },
    { cells: ['WAF', '웹 애플리케이션 방화벽', 'L7 HTTP 요청 검사 (SQL Injection, XSS 방어)'] },
    { cells: ['DLP', '데이터 유출 방지', '민감 데이터의 외부 전송 탐지/차단'] },
    { cells: ['NAC', '네트워크 접근 제어', '802.1X 인증, 단말 보안 상태 검사 후 접속 허용'] },
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
                    핵심 프로토콜을 포괄적으로 다룹니다. 네트워크 보안의 기초 개념도 함께 살펴봅니다.
                </p>
            </header>

            <LearningCard
                topicId="06-application"
                items={[
                    'DNS 서버 종류와 재귀/반복 질의 과정을 이해한다',
                    'DNSSEC, DoH, DoT 등 DNS 보안 기술을 설명할 수 있다',
                    'HTTP 요청/응답 구조와 주요 메서드를 설명할 수 있다',
                    'TLS 1.2/1.3 handshake 차이와 인증서 체인을 이해한다',
                    'mTLS와 암호 스위트 구성을 설명할 수 있다',
                    'DHCP DORA 프로세스를 설명할 수 있다',
                    '주요 네트워크 공격 유형과 방어 기술을 파악한다',
                    '프록시와 리버스 프록시의 차이를 파악한다',
                ]}
            />

            {/* ── 6.1 DNS 서버의 종류와 역할 ──────────────────────── */}
            <Section id="s061" title="6.1  DNS 서버의 종류와 역할">
                <Prose>
                    DNS(Domain Name System)는 사람이 읽을 수 있는 도메인 이름(예:{' '}
                    <InlineCode>
                        www.example.com
                    </InlineCode>
                    )을 컴퓨터가 사용하는 IP 주소로 변환하는 분산 계층형 데이터베이스입니다.
                    인터넷의 전화번호부 역할을 하며, 거의 모든 인터넷 통신의 첫 단계입니다.
                    DNS 인프라는 역할에 따라 여러 종류의 서버로 구성됩니다.
                </Prose>

                <InfoBox color="blue" title="DNS 도메인 계층 구조">
                    <p>DNS는 트리 구조의 계층형 네임스페이스를 사용합니다.</p>
                    <p className="font-mono mt-1">. (Root) → .com (TLD) → example.com (SLD) → www.example.com (호스트)</p>
                    <p className="mt-1">각 수준은 서로 다른 네임서버가 관리하며, 이를 통해 전 세계 도메인을 분산 관리합니다.</p>
                </InfoBox>

                <CardGrid cols={4}>
                    <StatCard title="Root NS" value="13개 클러스터" color="blue" desc="a~m.root-servers.net (Anycast)" />
                    <StatCard title="기본 포트" value="UDP 53" color="purple" desc="TCP도 사용 (Zone Transfer)" />
                    <StatCard title="캐시 TTL" value="300 ~ 86400 s" color="green" desc="도메인별 설정" />
                    <StatCard title="전 세계 도메인" value="~3.5억 개" color="amber" desc="지속 증가 중" />
                </CardGrid>

                <InfoTable
                    headers={['서버 종류', '역할', '특징']}
                    rows={dnsServerTypeRows}
                />

                <InfoBox color="purple" title="DNS 서버 소프트웨어">
                    DNS 서버는 용도와 환경에 따라 다양한 소프트웨어를 선택합니다.
                    Kubernetes 환경에서는 CoreDNS가 사실상 표준입니다.
                </InfoBox>

                <InfoTable
                    headers={['소프트웨어', '특징', '주요 기능']}
                    rows={dnsSoftwareRows}
                />

                <CardGrid cols={2}>
                    <InfoBox color="green" title="기업 DNS 구성: Split-Horizon DNS">
                        <p><strong>내부 DNS:</strong> 사내 서비스 도메인 해석 (예: db.internal.corp)</p>
                        <p><strong>외부 DNS:</strong> 공개 서비스 도메인 해석 (예: www.corp.com)</p>
                        <p className="mt-1">동일 도메인에 대해 질의 출처(내부/외부)에 따라 다른 IP를 응답합니다.</p>
                        <p>내부 DNS는 외부로 노출하지 않아 보안을 강화합니다.</p>
                    </InfoBox>
                    <InfoBox color="amber" title="Zone Transfer (영역 전송)">
                        <p><strong>AXFR (Full Transfer):</strong> 전체 Zone 데이터를 복제 (TCP)</p>
                        <p><strong>IXFR (Incremental):</strong> 변경분만 전송 (효율적)</p>
                        <p className="mt-1">Primary → Secondary 서버 간 동기화에 사용됩니다.</p>
                        <p>보안: ACL로 허용된 서버만 Zone Transfer를 수행하도록 제한해야 합니다.</p>
                    </InfoBox>
                </CardGrid>

                <InfoBox color="rose" title="DNS 보안: DNSSEC">
                    <p><strong>Chain of Trust:</strong> Root Zone → TLD → 도메인까지 서명 체인으로 연결</p>
                    <p><strong>RRSIG 레코드:</strong> 각 DNS 레코드에 대한 디지털 서명</p>
                    <p><strong>DNSKEY 레코드:</strong> 서명 검증에 사용하는 공개키 (ZSK/KSK)</p>
                    <p><strong>DS 레코드:</strong> 상위 Zone에 등록하여 하위 Zone의 DNSKEY를 인증</p>
                    <p className="mt-1">DNSSEC은 응답의 무결성과 출처를 검증하지만, 기밀성(암호화)은 제공하지 않습니다.</p>
                </InfoBox>

                <CardGrid cols={2}>
                    <InfoBox color="cyan" title="DNS over HTTPS (DoH)">
                        <p>HTTPS(포트 443)를 통해 DNS 질의를 암호화</p>
                        <p>일반 HTTPS 트래픽과 구분 불가 → 검열 우회 가능</p>
                        <p className="mt-1">브라우저 내장: Chrome, Firefox, Edge 등</p>
                    </InfoBox>
                    <InfoBox color="purple" title="DNS over TLS (DoT)">
                        <p>TLS(포트 853)를 통해 DNS 질의를 암호화</p>
                        <p>전용 포트 사용 → 네트워크 관리자가 식별/차단 가능</p>
                        <p className="mt-1">OS/resolver 수준에서 설정: systemd-resolved, Unbound</p>
                    </InfoBox>
                </CardGrid>

                <Alert variant="warning" title="DNS 캐시 포이즈닝:">
                    공격자가 위조된 DNS 응답을 리졸버에 주입하여 사용자를 악성 사이트로 유도합니다.
                    방어: DNSSEC 검증, 소스 포트 랜덤화, Response Rate Limiting(RRL),
                    리졸버의 0x20 인코딩(쿼리 이름 대소문자 랜덤화)을 적용합니다.
                </Alert>

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
                    <RfcRef rfc={4033} label="RFC 4033 — DNSSEC Introduction" />
                    <RfcRef rfc={8484} label="RFC 8484 — DNS over HTTPS (DoH)" />
                    <RfcRef rfc={7858} label="RFC 7858 — DNS over TLS (DoT)" />
                </div>

                <CodeBlock code={digCode} language="bash" filename="dig — DNS 질의" />
                <CodeBlock code={nslookupCode} language="bash" filename="nslookup — DNS 조회" />
                <CodeBlock code={bindZoneCode} language="bash" filename="BIND Zone 파일 예시 + DNSSEC 서명" />
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

                <CardGrid cols={2}>
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
                </CardGrid>

                <DnsResolutionDiagram />

                <CardGrid cols={3}>
                    <InfoBox color="green" title="TTL과 캐시 정책">
                        <p><strong>양의 캐시:</strong> 성공 응답을 TTL 동안 보관</p>
                        <p><strong>TTL 전략:</strong> 짧은 TTL(60~300s)은 빠른 변경, 긴 TTL(86400s)은 안정성</p>
                        <p className="mt-1">CDN/로드밸런서 전환 전 TTL을 미리 낮춰 두는 것이 중요</p>
                    </InfoBox>
                    <InfoBox color="purple" title="Negative Caching">
                        <p>NXDOMAIN(존재하지 않는 도메인) 응답도 캐시합니다</p>
                        <p>SOA 레코드의 Minimum TTL 값 사용</p>
                        <p className="mt-1">잘못된 도메인 반복 질의 방지, DNS 서버 부하 경감</p>
                    </InfoBox>
                    <InfoBox color="rose" title="DNS Amplification 공격">
                        <p>출발지 IP를 위조(스푸핑)하여 Open Resolver에 질의</p>
                        <p>작은 질의 → 큰 응답 (증폭 비율 최대 70배)</p>
                        <p className="mt-1"><strong>방어:</strong> Response Rate Limiting, BCP38(출발지 검증), Open Resolver 차단</p>
                    </InfoBox>
                </CardGrid>

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

                <CardGrid cols={2}>
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
                </CardGrid>

                <CardGrid cols={4}>
                    <StatCard title="기본 포트" value="80 (HTTP)" color="blue" desc="암호화 없음" />
                    <StatCard title="보안 포트" value="443 (HTTPS)" color="green" desc="TLS 암호화" />
                    <StatCard title="HTTP/2" value="2015" color="purple" desc="멀티플렉싱, 헤더 압축" />
                    <StatCard title="HTTP/3" value="2022" color="amber" desc="QUIC 기반 (UDP)" />
                </CardGrid>

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

            {/* ── 6.4 HTTPS와 TLS 상세 ────────────────────────────── */}
            <Section id="s064" title="6.4  HTTPS와 TLS 상세">
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
                    0-RTT resumption을 지원합니다. TLS 1.2와 1.3의 주요 차이를 비교합니다.
                </Prose>

                <InfoBox color="blue" title="TLS 1.2 vs TLS 1.3 Handshake 비교">
                    TLS 1.3은 보안을 강화하면서도 성능을 개선했습니다.
                    키 교환을 (EC)DHE로 제한하여 Forward Secrecy를 필수화했습니다.
                </InfoBox>

                <InfoTable
                    headers={['항목', 'TLS 1.2', 'TLS 1.3']}
                    rows={tls12vs13Rows}
                />

                <TlsHandshakeDiagram />

                <Prose>
                    TLS 인증서는 Root CA(인증기관) → Intermediate CA → End-entity(서버) 인증서로
                    이어지는 체인 구조로 신뢰를 형성합니다. 브라우저/OS는 사전 내장된 Root CA 목록을
                    신뢰 기준(Trust Store)으로 사용합니다.
                </Prose>

                <CardGrid cols={3}>
                    <InfoBox color="blue" title="Root CA (루트 인증기관)">
                        <p>최상위 신뢰 기관 (DigiCert, Let&apos;s Encrypt 등)</p>
                        <p>자체 서명된 인증서 보유</p>
                        <p className="mt-1">OS/브라우저 Trust Store에 사전 내장</p>
                    </InfoBox>
                    <InfoBox color="purple" title="Intermediate CA (중간 인증기관)">
                        <p>Root CA가 서명한 중간 인증서</p>
                        <p>실제 서버 인증서 발급을 담당</p>
                        <p className="mt-1">Root CA의 개인키 노출 위험 분산</p>
                    </InfoBox>
                    <InfoBox color="green" title="End-entity (서버 인증서)">
                        <p>최종 서버에 설치되는 인증서</p>
                        <p>도메인 소유권 증명</p>
                        <p className="mt-1">Intermediate CA가 서명</p>
                    </InfoBox>
                </CardGrid>

                <InfoBox color="amber" title="인증서 종류: DV / OV / EV">
                    인증서는 검증 수준에 따라 세 가지로 구분됩니다.
                </InfoBox>

                <InfoTable
                    headers={['종류', '검증 수준', '특징']}
                    rows={certTypeRows}
                />

                <CardGrid cols={2}>
                    <InfoBox color="cyan" title="SNI (Server Name Indication)">
                        <p>TLS ClientHello에 요청 도메인을 포함하는 확장 필드</p>
                        <p>하나의 IP에서 여러 도메인의 인증서를 제공 가능 (가상 호스팅)</p>
                        <p className="mt-1">SNI 없이는 IP당 하나의 인증서만 사용 가능했음</p>
                        <p>ECH(Encrypted Client Hello)로 SNI 암호화 진행 중</p>
                    </InfoBox>
                    <InfoBox color="rose" title="OCSP Stapling">
                        <p>서버가 CA의 OCSP 응답을 미리 받아서 TLS handshake 시 제공</p>
                        <p>클라이언트가 별도로 CA에 인증서 폐지 여부를 확인할 필요 없음</p>
                        <p className="mt-1">성능 향상 + 프라이버시 보호 (CA가 방문 사이트를 알 수 없음)</p>
                    </InfoBox>
                </CardGrid>

                <CardGrid cols={3}>
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
                </CardGrid>

                <InfoBox color="purple" title="mTLS (상호 TLS 인증)">
                    <p>일반 TLS는 서버만 인증서를 제시하지만, mTLS는 클라이언트도 인증서를 제시하여 양방향 인증을 수행합니다.</p>
                    <p className="mt-1"><strong>활용 사례:</strong></p>
                    <p>- Kubernetes API 서버 인증</p>
                    <p>- 서비스 메시(Istio, Linkerd)의 서비스 간 통신</p>
                    <p>- 금융/의료 시스템의 API 접근 제어</p>
                    <p>- IoT 디바이스 인증</p>
                </InfoBox>

                <CardGrid cols={2}>
                    <InfoBox color="amber" title="인증서 Pinning">
                        <p>특정 인증서/공개키만 신뢰하도록 클라이언트에 고정(Pin)</p>
                        <p>MITM 공격 시 위조 인증서를 거부</p>
                        <p className="mt-1">모바일 앱에서 주로 사용, 인증서 교체 시 앱 업데이트 필요</p>
                        <p>HPKP(HTTP Public Key Pinning)는 위험성으로 폐기됨</p>
                    </InfoBox>
                    <InfoBox color="green" title="TLS 종료 위치">
                        <p><strong>LB/리버스 프록시에서 종료:</strong> 백엔드는 HTTP, 인증서 관리 집중화</p>
                        <p><strong>End-to-end 암호화:</strong> 백엔드까지 TLS 유지, 내부 통신도 보호</p>
                        <p className="mt-1">보안 요구사항과 성능/관리 편의성을 고려하여 선택</p>
                        <p>mTLS + 서비스 메시로 내부 통신도 암호화하는 추세</p>
                    </InfoBox>
                </CardGrid>

                <Alert variant="warning" title="주의:">
                    TLS 1.3의 0-RTT(Early Data)는 재전송 공격(Replay Attack)에 취약할 수 있습니다.
                    민감한 작업(결제, 상태 변경)에는 0-RTT 데이터를 사용하지 않아야 합니다.
                </Alert>

                <div className="flex flex-wrap gap-2">
                    <RfcRef rfc={8446} label="RFC 8446 — TLS 1.3" />
                    <RfcRef rfc={6125} label="RFC 6125 — 인증서 검증" />
                    <RfcRef rfc={6066} label="RFC 6066 — TLS Extensions (SNI)" />
                    <RfcRef rfc={6960} label="RFC 6960 — OCSP" />
                </div>

                <CodeBlock code={opensslCode} language="bash" filename="openssl s_client — TLS 연결 확인" />
                <CodeBlock code={opensslChainCode} language="bash" filename="인증서 체인 검증 및 SAN 확인" />
                <CodeBlock code={mtlsCurlCode} language="bash" filename="mTLS — 클라이언트 인증서 인증" />
                <CodeBlock code={cipherSuiteCode} language="bash" filename="암호 스위트 확인 및 해석" />
            </Section>

            {/* ── 6.5 DHCP ──────────────────────────────────────── */}
            <Section id="s065" title="6.5  DHCP">
                <Prose>
                    DHCP(Dynamic Host Configuration Protocol)는 네트워크에 접속하는 장치에
                    IP 주소, 서브넷 마스크, 게이트웨이, DNS 서버 등의 네트워크 설정을
                    자동으로 할당하는 프로토콜입니다. 가정의 공유기부터 대규모 기업 네트워크까지
                    광범위하게 사용됩니다.
                </Prose>

                <CardGrid cols={4}>
                    <StatCard title="서버 포트" value="UDP 67" color="blue" desc="서버 수신" />
                    <StatCard title="클라이언트 포트" value="UDP 68" color="purple" desc="클라이언트 수신" />
                    <StatCard title="임대 시간" value="1 ~ 24시간" color="green" desc="네트워크별 설정" />
                    <StatCard title="DORA" value="4단계" color="amber" desc="Discover→Offer→Request→Ack" />
                </CardGrid>

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

                <CardGrid cols={4}>
                    <StatCard title="기본 포트" value="TCP 22" color="blue" desc="변경 권장 (보안)" />
                    <StatCard title="현재 버전" value="SSH-2" color="green" desc="SSH-1은 사용 금지" />
                    <StatCard title="키 알고리즘" value="Ed25519" color="purple" desc="현재 권장 (빠르고 안전)" />
                    <StatCard title="Telnet 대체" value="1995~" color="amber" desc="암호화 통신" />
                </CardGrid>

                <CardGrid cols={2}>
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
                </CardGrid>

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
                        <InlineCode>chrony</InlineCode>{' '}
                        또는{' '}
                        <InlineCode>systemd-timesyncd</InlineCode>
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

            {/* ── 6.8 네트워크 보안 기초 ──────────────────────────── */}
            <Section id="s068" title="6.8  네트워크 보안 기초">
                <Prose>
                    네트워크 보안은 OSI 각 계층에서 다양한 공격과 방어 기술이 존재합니다.
                    응용 프로토콜을 학습한 후, 이 프로토콜들이 직면하는 보안 위협과
                    이에 대응하는 방어 기술을 이해하는 것이 중요합니다.
                </Prose>

                <InfoBox color="blue" title="네트워크 보안 계층별 위협">
                    <p><strong>물리 계층:</strong> 도청(Wiretapping), 전파 방해(Jamming)</p>
                    <p><strong>링크 계층:</strong> ARP Spoofing, MAC Flooding, VLAN Hopping</p>
                    <p><strong>네트워크 계층:</strong> IP Spoofing, ICMP Redirect, 라우팅 공격</p>
                    <p><strong>전송 계층:</strong> SYN Flood, TCP Reset 공격, 포트 스캔</p>
                    <p><strong>응용 계층:</strong> DNS Spoofing, HTTP Flood, SQL Injection, XSS</p>
                </InfoBox>

                <InfoBox color="rose" title="주요 공격 유형">
                    네트워크에 대한 공격은 가용성, 기밀성, 무결성 중 하나 이상을 침해합니다.
                </InfoBox>

                <InfoTable
                    headers={['공격', '분류', '설명', '세부 유형']}
                    rows={attackTypeRows}
                />

                <InfoBox color="green" title="방어 기술">
                    다층 방어(Defense in Depth) 전략으로 여러 보안 계층을 조합합니다.
                </InfoBox>

                <InfoTable
                    headers={['기술', '설명', '특징']}
                    rows={defenseRows}
                />

                <CardGrid cols={2}>
                    <InfoBox color="purple" title="네트워크 세그멘테이션">
                        <p><strong>전통적 세그멘테이션:</strong> VLAN, 서브넷 분리, 방화벽 경계</p>
                        <p><strong>마이크로 세그멘테이션:</strong> 워크로드/호스트 단위 정책 적용</p>
                        <p className="mt-1">침입 시 횡이동(Lateral Movement) 범위를 제한합니다.</p>
                        <p>Kubernetes NetworkPolicy, VMware NSX 등</p>
                    </InfoBox>
                    <InfoBox color="cyan" title="VPN의 보안 역할">
                        <p><strong>Site-to-Site VPN:</strong> 지사 간 암호화 터널 (IPsec, WireGuard)</p>
                        <p><strong>Remote Access VPN:</strong> 원격 근무자 → 사내망 접속</p>
                        <p className="mt-1">공용 네트워크 위에 암호화된 가상 사설망을 구성합니다.</p>
                        <p>Split tunneling vs Full tunneling 선택</p>
                    </InfoBox>
                </CardGrid>

                <CardGrid cols={2}>
                    <InfoBox color="amber" title="802.1X 인증과 NAC">
                        <p>네트워크 접속 전 인증을 수행하는 IEEE 표준</p>
                        <p><strong>3주체:</strong> Supplicant(단말) → Authenticator(스위치/AP) → Auth Server(RADIUS)</p>
                        <p className="mt-1">인증 실패 시 네트워크 접속 자체를 차단합니다.</p>
                        <p>NAC: 단말 보안 상태(패치, AV) 검사 후 접속 허용</p>
                    </InfoBox>
                    <InfoBox color="rose" title="제로 트러스트 네트워크 원칙">
                        <p>&quot;Never trust, always verify&quot; — 내부 네트워크도 신뢰하지 않음</p>
                        <p>모든 접근에 인증/인가 적용, 최소 권한 원칙</p>
                        <p className="mt-1">마이크로 세그멘테이션 + mTLS + 지속적 검증</p>
                        <p>Topic 12에서 상세히 다룹니다.</p>
                    </InfoBox>
                </CardGrid>

                <Alert variant="info" title="심층 방어 (Defense in Depth):">
                    단일 보안 기술에 의존하지 않고, 네트워크 경계(방화벽), 호스트(IDS/IPS),
                    애플리케이션(WAF), 데이터(암호화) 등 여러 계층에 보안을 적용하여
                    하나의 방어선이 뚫려도 다음 방어선이 보호합니다.
                </Alert>
            </Section>

            {/* ── 6.9 프록시와 리버스 프록시 ────────────────────── */}
            <Section id="s069" title="6.9  프록시와 리버스 프록시">
                <Prose>
                    프록시(Proxy)는 클라이언트와 서버 사이에서 요청을 중계하는 중간 서버입니다.
                    프록시의 위치와 역할에 따라{' '}
                    <strong className="text-gray-800 dark:text-gray-200">포워드 프록시</strong>와{' '}
                    <strong className="text-gray-800 dark:text-gray-200">리버스 프록시</strong>로 구분합니다.
                </Prose>

                <CardGrid cols={2}>
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
                </CardGrid>

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

            {/* ── 6.10 요약 ──────────────────────────────────────── */}
            <Section id="s0610" title="6.10  요약">
                <CardGrid cols={2}>
                    <InfoBox color="blue" title="DNS">
                        <p>도메인 → IP 변환, 계층형 분산 시스템</p>
                        <p>재귀 질의 + 반복 질의 조합</p>
                        <p>DNSSEC, DoH, DoT로 보안 강화</p>
                    </InfoBox>
                    <InfoBox color="green" title="HTTP/HTTPS">
                        <p>요청-응답 모델, 무상태 프로토콜</p>
                        <p>GET/POST/PUT/DELETE 등 메서드</p>
                        <p>TLS로 암호화 → HTTPS</p>
                    </InfoBox>
                    <InfoBox color="purple" title="TLS">
                        <p>기밀성 + 무결성 + 인증</p>
                        <p>TLS 1.3: 1-RTT, Forward Secrecy 필수</p>
                        <p>인증서 체인, mTLS, SNI, OCSP Stapling</p>
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
                    <InfoBox color="rose" title="네트워크 보안">
                        <p>다층 방어: 방화벽, IDS/IPS, WAF</p>
                        <p>세그멘테이션, VPN, 802.1X</p>
                        <p>제로 트러스트 원칙</p>
                    </InfoBox>
                </CardGrid>

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
