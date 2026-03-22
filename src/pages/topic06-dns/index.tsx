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
import { CodeBlock } from '../../components/viz/CodeBlock'
import { T } from '../../components/ui/GlossaryTooltip'
import { DnsResolutionDiagram } from '../../components/concepts/application/DnsResolutionDiagram'
import {
    digCode,
    nslookupCode,
    bindZoneCode,
    dnssecSignCode,
    dohDotCode,
    splitHorizonCode,
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
    { cells: ['CAA', 'CA 발급 제한', 'example.com CAA 0 issue "letsencrypt.org"'] },
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
    { cells: ['Knot DNS', '권한 서버 전용, 고성능', '자동 DNSSEC, Zone 관리 최적화'] },
]

const dnssecRecordRows = [
    { cells: ['RRSIG', '리소스 레코드 서명', '각 DNS 레코드에 대한 디지털 서명. 검증자가 ZSK로 확인'] },
    { cells: ['DNSKEY', 'Zone 공개키', 'ZSK(Zone Signing Key)와 KSK(Key Signing Key) 공개키 게시'] },
    { cells: ['DS', 'Delegation Signer', '상위 Zone에 등록. 하위 Zone의 KSK 해시를 포함하여 신뢰 체인 연결'] },
    { cells: ['NSEC/NSEC3', '부재 증명', '요청한 레코드가 존재하지 않음을 증명 (Zone Walking 방지: NSEC3)'] },
]

/* ── component ────────────────────────────────────────────────── */

export default function Topic06Dns() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-14">
            {/* Header */}
            <header className="space-y-3">
                <p className="text-xs font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                    Topic 06
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    DNS 심화
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    DNS Deep Dive
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    DNS의 계층 구조와 레코드 타입, 서버 종류, 질의 과정을 심층적으로 학습합니다.
                    DNSSEC의 신뢰 체인과 DNS 보안/프라이버시 기술(DoH, DoT), 그리고
                    기업 환경의 Split-Horizon DNS 구성까지 포괄적으로 다룹니다.
                </p>
            </header>

            <LearningCard
                topicId="06-dns"
                items={[
                    'DNS 도메인 계층 구조와 주요 레코드 타입을 설명할 수 있다',
                    'DNS 서버의 종류(Authoritative, Recursive, Root, Stub)를 구분할 수 있다',
                    '재귀 질의와 반복 질의의 차이를 이해한다',
                    'DNSSEC의 신뢰 체인(Chain of Trust)을 설명할 수 있다',
                    'DoH, DoT 등 DNS 프라이버시 기술을 비교할 수 있다',
                    'Split-Horizon DNS와 기업 DNS 구성을 이해한다',
                ]}
            />

            {/* ── 6.1 DNS의 역할과 구조 ──────────────────────────── */}
            <Section id="s061" title="6.1  DNS의 역할과 구조">
                <Prose>
                    <T id="dns">DNS</T>(Domain Name System)는 사람이 읽을 수 있는 도메인 이름(예:{' '}
                    <InlineCode>www.example.com</InlineCode>)을
                    컴퓨터가 사용하는 IP 주소로 변환하는 분산 계층형 데이터베이스입니다.
                    인터넷의 전화번호부 역할을 하며, 거의 모든 인터넷 통신의 첫 단계입니다.
                </Prose>

                <InfoBox color="blue" title="DNS 도메인 계층 구조">
                    <p>DNS는 트리 구조의 계층형 네임스페이스를 사용합니다.</p>
                    <p className="font-mono mt-1">. (Root) → .com (TLD) → example.com (SLD) → www.example.com (호스트)</p>
                    <p className="mt-1">각 수준은 서로 다른 네임서버가 관리하며, 이를 통해 전 세계 도메인을 분산 관리합니다.</p>
                    <p className="mt-1"><strong>FQDN (Fully Qualified Domain Name):</strong> 루트를 포함한 전체 도메인 이름. 예: <InlineCode>www.example.com.</InlineCode> (마침표가 루트를 의미)</p>
                </InfoBox>

                <CardGrid cols={4}>
                    <StatCard title="Root NS" value="13개 클러스터" color="blue" desc="a~m.root-servers.net (Anycast)" />
                    <StatCard title="기본 포트" value="UDP 53" color="purple" desc="TCP도 사용 (Zone Transfer, 큰 응답)" />
                    <StatCard title="캐시 TTL" value="300 ~ 86400 s" color="green" desc="도메인별 설정" />
                    <StatCard title="전 세계 도메인" value="~3.5억 개" color="amber" desc="지속 증가 중" />
                </CardGrid>

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
                    질의 빈도가 높아집니다. CDN/로드밸런서 전환 전 TTL을 미리 낮춰 두는 것이 중요합니다.
                </Alert>
            </Section>

            {/* ── 6.2 DNS 서버의 종류 ─────────────────────────────── */}
            <Section id="s062" title="6.2  DNS 서버의 종류">
                <Prose>
                    DNS 인프라는 역할에 따라 여러 종류의 서버로 구성됩니다.
                    각 서버는 DNS 질의 과정에서 서로 다른 책임을 담당하며,
                    이들의 협력으로 전 세계 도메인 이름 해석이 이루어집니다.
                </Prose>

                <InfoTable
                    headers={['서버 종류', '역할', '특징']}
                    rows={dnsServerTypeRows}
                />

                <CardGrid cols={2}>
                    <InfoBox color="amber" title="Zone Transfer (영역 전송)">
                        <p><strong>AXFR (Full Transfer):</strong> 전체 Zone 데이터를 복제 (TCP)</p>
                        <p><strong>IXFR (Incremental):</strong> 변경분만 전송 (효율적)</p>
                        <p className="mt-1">Primary → Secondary 서버 간 동기화에 사용됩니다.</p>
                        <p>보안: ACL로 허용된 서버만 Zone Transfer를 수행하도록 제한해야 합니다.</p>
                    </InfoBox>
                    <InfoBox color="purple" title="Anycast와 Root NS 분산">
                        <p>13개 Root NS 클러스터는 Anycast로 전 세계 1,700+ 인스턴스에 분산됩니다.</p>
                        <p>동일 IP에 대해 가장 가까운 인스턴스가 응답합니다.</p>
                        <p className="mt-1">DDoS 공격에 대한 복원력과 낮은 지연시간을 동시에 제공합니다.</p>
                    </InfoBox>
                </CardGrid>

                <InfoBox color="blue" title="DNS 서버 소프트웨어 비교">
                    DNS 서버는 용도와 환경에 따라 다양한 소프트웨어를 선택합니다.
                    Kubernetes 환경에서는 CoreDNS가 사실상 표준입니다.
                </InfoBox>

                <InfoTable
                    headers={['소프트웨어', '특징', '주요 기능']}
                    rows={dnsSoftwareRows}
                />

                <CodeBlock code={bindZoneCode} language="bash" filename="BIND Zone 파일 예시" />
            </Section>

            {/* ── 6.3 DNS 질의 과정 ───────────────────────────────── */}
            <Section id="s063" title="6.3  DNS 질의 과정">
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
                    <InfoBox color="cyan" title="Glue Record">
                        <p>네임서버 자체가 같은 도메인에 속할 때 필요</p>
                        <p>예: ns1.example.com이 example.com의 NS일 때</p>
                        <p className="mt-1">순환 참조를 방지하기 위해 상위 Zone에 IP를 직접 등록</p>
                    </InfoBox>
                </CardGrid>

                <CodeBlock code={digCode} language="bash" filename="dig -- DNS 질의" />
                <CodeBlock code={nslookupCode} language="bash" filename="nslookup -- DNS 조회" />
            </Section>

            {/* ── 6.4 DNSSEC ──────────────────────────────────────── */}
            <Section id="s064" title="6.4  DNSSEC">
                <Prose>
                    <T id="dnssec">DNSSEC</T>(DNS Security Extensions)은 DNS 응답의 무결성과 출처를 검증하는 보안 확장입니다.
                    디지털 서명을 통해 DNS 응답이 변조되지 않았음을 증명하며,
                    Root Zone에서 최종 도메인까지 이어지는 신뢰 체인(Chain of Trust)을 형성합니다.
                    단, DNSSEC은 기밀성(암호화)은 제공하지 않습니다.
                </Prose>

                <InfoBox color="rose" title="DNSSEC 신뢰 체인 (Chain of Trust)">
                    <p><strong>Root Zone:</strong> IANA가 관리하는 루트 KSK(Trust Anchor)로부터 시작</p>
                    <p><strong>TLD Zone:</strong> Root의 DS 레코드가 TLD의 KSK를 인증</p>
                    <p><strong>Domain Zone:</strong> TLD의 DS 레코드가 도메인의 KSK를 인증</p>
                    <p className="mt-1 font-mono text-xs">Root KSK → Root ZSK → .com DS → .com KSK → .com ZSK → example.com DS → example.com KSK → example.com ZSK → RRSIG</p>
                </InfoBox>

                <CardGrid cols={4}>
                    <StatCard title="KSK" value="Key Signing Key" color="blue" desc="DNSKEY 레코드 서명용" />
                    <StatCard title="ZSK" value="Zone Signing Key" color="green" desc="일반 레코드 서명용" />
                    <StatCard title="Trust Anchor" value="Root KSK" color="purple" desc="전체 체인의 시작점" />
                    <StatCard title="알고리즘" value="ECDSAP256" color="amber" desc="현재 권장 (알고리즘 13)" />
                </CardGrid>

                <InfoTable
                    headers={['레코드', '역할', '설명']}
                    rows={dnssecRecordRows}
                />

                <CardGrid cols={2}>
                    <InfoBox color="blue" title="KSK와 ZSK 분리 이유">
                        <p><strong>KSK:</strong> 강력한 키, 긴 수명, 교체 시 상위 Zone에 DS 갱신 필요</p>
                        <p><strong>ZSK:</strong> 상대적으로 짧은 키, 자주 교체, 상위 Zone 변경 불필요</p>
                        <p className="mt-1">KSK는 DNSKEY 레코드만 서명하고, ZSK는 나머지 모든 레코드를 서명합니다.</p>
                    </InfoBox>
                    <InfoBox color="amber" title="DNSSEC 한계">
                        <p>응답 크기 증가 (서명 데이터 추가)</p>
                        <p>키 관리 복잡성 (Key Rollover 절차)</p>
                        <p className="mt-1">NSEC에 의한 Zone Walking 가능 → NSEC3로 완화</p>
                        <p>기밀성 미제공 → DoH/DoT와 함께 사용해야 완전한 보안</p>
                    </InfoBox>
                </CardGrid>

                <CodeBlock code={dnssecSignCode} language="bash" filename="DNSSEC Zone 서명 절차" />
            </Section>

            {/* ── 6.5 DNS 보안과 프라이버시 ────────────────────────── */}
            <Section id="s065" title="6.5  DNS 보안과 프라이버시">
                <Prose>
                    기본 DNS 질의는 평문(UDP 53)으로 전송되어 도청, 변조, 검열에 취약합니다.
                    이를 보완하기 위해 DNS over HTTPS(DoH)와 DNS over TLS(DoT) 같은
                    암호화 전송 기술이 도입되었습니다. DNSSEC과 결합하면
                    무결성과 기밀성을 모두 확보할 수 있습니다.
                </Prose>

                <CardGrid cols={2}>
                    <InfoBox color="cyan" title="DNS over HTTPS (DoH)">
                        <p>HTTPS(포트 443)를 통해 DNS 질의를 암호화</p>
                        <p>일반 HTTPS 트래픽과 구분 불가 → 검열 우회 가능</p>
                        <p className="mt-1">브라우저 내장: Chrome, Firefox, Edge 등</p>
                        <p>RFC 8484 / 포맷: <InlineCode>application/dns-message</InlineCode> 또는 JSON</p>
                    </InfoBox>
                    <InfoBox color="purple" title="DNS over TLS (DoT)">
                        <p>TLS(포트 853)를 통해 DNS 질의를 암호화</p>
                        <p>전용 포트 사용 → 네트워크 관리자가 식별/차단 가능</p>
                        <p className="mt-1">OS/resolver 수준에서 설정: systemd-resolved, Unbound</p>
                        <p>RFC 7858 / 기업 환경에서 관리 가능성이 DoH보다 높음</p>
                    </InfoBox>
                </CardGrid>

                <Alert variant="warning" title="DNS 캐시 포이즈닝 (Cache Poisoning):">
                    공격자가 위조된 DNS 응답을 리졸버에 주입하여 사용자를 악성 사이트로 유도합니다.
                    방어: DNSSEC 검증, 소스 포트 랜덤화, Response Rate Limiting(RRL),
                    리졸버의 0x20 인코딩(쿼리 이름 대소문자 랜덤화)을 적용합니다.
                </Alert>

                <InfoBox color="rose" title="DNS Amplification 공격">
                    <p>출발지 IP를 위조(스푸핑)하여 Open Resolver에 질의</p>
                    <p>작은 질의(~60 bytes) → 큰 응답(~4,000 bytes), 증폭 비율 최대 70배</p>
                    <p className="mt-1"><strong>방어:</strong> Response Rate Limiting, BCP38(출발지 검증), Open Resolver 차단,
                        EDNS0 응답 크기 제한</p>
                </InfoBox>

                <CardGrid cols={3}>
                    <InfoBox color="green" title="DNS Rebinding">
                        <p>TTL을 극도로 짧게 설정하여 내부 IP로 전환</p>
                        <p>브라우저의 Same-Origin Policy 우회</p>
                        <p className="mt-1">방어: DNS pinning, 내부 IP 응답 필터링</p>
                    </InfoBox>
                    <InfoBox color="amber" title="DNS Tunneling">
                        <p>DNS 질의/응답에 데이터를 인코딩하여 은닉 통신</p>
                        <p>방화벽을 우회하는 C2 채널로 악용 가능</p>
                        <p className="mt-1">방어: 비정상적 질의 패턴 모니터링, TXT 레코드 크기 분석</p>
                    </InfoBox>
                    <InfoBox color="blue" title="EDNS0 (Extension Mechanisms)">
                        <p>DNS 메시지 크기를 512 bytes 이상으로 확장</p>
                        <p>DNSSEC, 대형 레코드 등에 필수</p>
                        <p className="mt-1">EDNS Client Subnet으로 CDN 최적화 지원</p>
                    </InfoBox>
                </CardGrid>

                <CodeBlock code={dohDotCode} language="bash" filename="DoH / DoT 질의 예시" />
            </Section>

            {/* ── 6.6 기업 DNS 구성 ────────────────────────────────── */}
            <Section id="s066" title="6.6  기업 DNS 구성">
                <Prose>
                    기업 환경에서는 내부 서비스와 외부 서비스에 대해 서로 다른 DNS 응답을 제공해야 하는
                    경우가 많습니다. Split-Horizon DNS는 질의 출처에 따라 다른 응답을 반환하여
                    내부 보안을 강화하면서도 외부 서비스를 정상적으로 운영할 수 있게 합니다.
                </Prose>

                <CardGrid cols={2}>
                    <InfoBox color="green" title="Split-Horizon DNS">
                        <p><strong>내부 DNS:</strong> 사내 서비스 도메인 해석 (예: <InlineCode>db.internal.corp</InlineCode>)</p>
                        <p><strong>외부 DNS:</strong> 공개 서비스 도메인 해석 (예: <InlineCode>www.corp.com</InlineCode>)</p>
                        <p className="mt-1">동일 도메인에 대해 질의 출처(내부/외부)에 따라 다른 IP를 응답합니다.</p>
                        <p>내부 DNS는 외부로 노출하지 않아 보안을 강화합니다.</p>
                    </InfoBox>
                    <InfoBox color="blue" title="내부 DNS 설계 원칙">
                        <p><strong>전용 내부 도메인:</strong> .internal, .corp, .local 등 비공개 TLD 사용</p>
                        <p><strong>Forwarder 설정:</strong> 내부 DNS가 외부 질의를 재귀 리졸버에 위임</p>
                        <p className="mt-1">Active Directory 환경에서는 AD 통합 DNS가 기본</p>
                        <p>서비스 디스커버리: SRV 레코드로 내부 서비스 위치 제공</p>
                    </InfoBox>
                </CardGrid>

                <CardGrid cols={3}>
                    <InfoBox color="purple" title="DNS 로드 밸런싱">
                        <p>동일 도메인에 여러 A 레코드(Round-Robin DNS)</p>
                        <p>GSLB: 지역/상태 기반 지능형 응답</p>
                        <p className="mt-1">Route 53, Cloud DNS 등 클라우드 DNS 활용</p>
                    </InfoBox>
                    <InfoBox color="amber" title="DNS Failover">
                        <p>Health Check 실패 시 자동으로 응답에서 제거</p>
                        <p>짧은 TTL(30~60s) + 헬스체크 조합</p>
                        <p className="mt-1">Active-Passive, Active-Active 구성 가능</p>
                    </InfoBox>
                    <InfoBox color="cyan" title="Kubernetes DNS">
                        <p>CoreDNS가 클러스터 내 서비스 디스커버리 담당</p>
                        <p><InlineCode>service.namespace.svc.cluster.local</InlineCode></p>
                        <p className="mt-1">Headless Service: 개별 Pod IP를 A 레코드로 반환</p>
                    </InfoBox>
                </CardGrid>

                <CodeBlock code={splitHorizonCode} language="bash" filename="Split-Horizon DNS 구성 (BIND views)" />
            </Section>

            {/* ── 6.7 요약 ────────────────────────────────────────── */}
            <Section id="s067" title="6.7  요약">
                <CardGrid cols={2}>
                    <InfoBox color="blue" title="DNS 구조와 레코드">
                        <p>계층형 분산 데이터베이스 (Root → TLD → SLD)</p>
                        <p>A, AAAA, CNAME, MX, NS, TXT, SRV, CAA 등 다양한 레코드</p>
                        <p>FQDN, TTL, 캐싱으로 효율적 이름 해석</p>
                    </InfoBox>
                    <InfoBox color="green" title="DNS 서버 종류">
                        <p>권한 NS, 재귀 리졸버, Root NS, TLD NS, Stub Resolver</p>
                        <p>Zone Transfer로 Primary-Secondary 동기화</p>
                        <p>BIND, Unbound, CoreDNS 등 용도별 소프트웨어</p>
                    </InfoBox>
                    <InfoBox color="purple" title="DNSSEC">
                        <p>Chain of Trust: Root → TLD → Domain</p>
                        <p>RRSIG, DNSKEY, DS, NSEC/NSEC3 레코드</p>
                        <p>무결성 검증 (기밀성은 별도)</p>
                    </InfoBox>
                    <InfoBox color="amber" title="DNS 보안과 프라이버시">
                        <p>DoH(포트 443), DoT(포트 853)로 암호화</p>
                        <p>Cache Poisoning, Amplification, Tunneling 방어</p>
                        <p>Split-Horizon, GSLB, Kubernetes DNS 활용</p>
                    </InfoBox>
                </CardGrid>

                <Alert variant="info" title="다음 토픽:">
                    Topic 07에서는 HTTP/HTTPS, TLS handshake, 인증서와 PKI, 그리고
                    DHCP, SSH, 네트워크 보안 기초와 프록시 구성까지 응용 계층의
                    핵심 프로토콜과 보안 기술을 학습합니다.
                </Alert>
            </Section>

            <TopicNavigation topicId="06-dns" />
        </div>
    )
}
