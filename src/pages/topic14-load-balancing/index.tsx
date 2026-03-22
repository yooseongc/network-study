import { CardGrid } from '../../components/ui/CardGrid'
import { Section } from '../../components/ui/Section'
import { Prose } from '../../components/ui/Prose'
import { InfoTable } from '../../components/ui/InfoTable'
import { InfoBox } from '../../components/ui/InfoBox'
import { StatCard } from '../../components/ui/StatCard'
import { Alert } from '../../components/ui/Alert'
import { LearningCard } from '../../components/ui/LearningCard'
import { TopicNavigation } from '../../components/ui/TopicNavigation'
import { CodeBlock } from '../../components/viz/CodeBlock'
import { L4vsL7Diagram } from '../../components/concepts/modern/L4vsL7Diagram'
import { GslbDiagram } from '../../components/concepts/modern/GslbDiagram'
import { nginxLbCode, nginxReverseProxyCode, haproxyHealthCode, gslbDnsCode } from './codeSnippets'

/* ── Inline data ──────────────────────────────────────────────────── */

const lbAlgorithmRows = [
    { cells: ['Round Robin', '순차적으로 서버에 분배', '간단, 균등 분배'] },
    { cells: ['Weighted RR', '가중치 비율로 분배', '서버 성능 차이 반영'] },
    { cells: ['Least Connections', '연결 수가 적은 서버 우선', '불균등 처리 시간에 유리'] },
    { cells: ['IP Hash', '클라이언트 IP 기반 고정', '세션 유지 필요 시'] },
    { cells: ['Random', '무작위 선택', '대규모 분산 시 통계적 균형'] },
]

const l4vsL7Rows = [
    { cells: ['동작 계층', 'L4 (TCP/UDP)', 'L7 (HTTP/gRPC)'] },
    { cells: ['판단 기준', 'IP, Port', 'URL, Header, Cookie'] },
    { cells: ['TLS 처리', 'Pass-through (미해석)', 'Termination (복호화)'] },
    { cells: ['연결 방식', 'TCP 연결 포워딩 (DSR 가능)', '두 개의 TCP 연결 (프록시)'] },
    { cells: ['성능', '높은 PPS, 낮은 지연', '상대적 오버헤드'] },
    { cells: ['기능', '기본 분배', '라우팅, 캐싱, 인증, 압축'] },
    { cells: ['대표 구현', 'LVS, IPVS, NLB', 'nginx, HAProxy, ALB, Envoy'] },
]

const haRows = [
    { cells: ['Active-Standby', '대기 서버가 장애 시 인수', 'Keepalived, VRRP'] },
    { cells: ['Active-Active', '모든 노드가 트래픽 처리', 'LB + 다중 인스턴스'] },
    { cells: ['DNS Failover', 'DNS 레코드 전환으로 트래픽 이동', 'Route 53, Cloudflare'] },
    { cells: ['Anycast', '동일 IP, 가장 가까운 노드 응답', 'CDN, DNS 루트 서버'] },
    { cells: ['Multi-AZ', '여러 가용 영역에 분산 배치', '클라우드 HA 기본'] },
]

const gslbMethodRows = [
    { cells: ['지리 기반 (Geo)', '클라이언트 IP의 지리적 위치로 가장 가까운 사이트 선택', '대부분의 CDN, 글로벌 서비스'] },
    { cells: ['지연시간 기반 (Latency)', '각 사이트까지의 RTT를 측정하여 가장 빠른 사이트 선택', 'AWS Route 53 Latency Routing'] },
    { cells: ['가중치 기반 (Weighted)', '사이트별 가중치 비율로 트래픽 분산', '카나리 배포, 점진적 이전'] },
    { cells: ['장애 대응 (Failover)', 'Primary 사이트 장애 시 Secondary로 전환', '재해 복구(DR) 구성'] },
]

/* ── Component ────────────────────────────────────────────────────── */

export default function Topic14LoadBalancing() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-14">
            <header className="space-y-3">
                <p className="text-xs font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                    Topic 14
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    로드밸런싱과 글로벌 트래픽 관리
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    Load Balancing & Global Traffic Management
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    로드밸런서의 기본 구조부터 L4/L7 비교, 리버스 프록시, CDN, GSLB, 고가용성 설계까지
                    트래픽 분산과 글로벌 서비스 아키텍처의 핵심을 학습합니다.
                </p>
            </header>

            <LearningCard
                topicId="14-load-balancing"
                items={[
                    'L4/L7 로드밸런싱의 차이를 이해한다',
                    '리버스 프록시와 API 게이트웨이의 역할을 설명할 수 있다',
                    'CDN의 캐싱 원리와 Origin Pull 구조를 파악한다',
                    'GSLB의 DNS 기반 글로벌 분산 원리를 이해한다',
                    '고가용성(HA) 설계 원리를 파악한다',
                ]}
            />

            {/* ── 14.1 ────────────────────────────────────────────── */}
            <Section id="s141" title="14.1  로드밸런서 기본 구조">
                <Prose>
                    로드밸런서(Load Balancer)는 클라이언트의 요청을 여러 백엔드 서버에 분배하여
                    가용성과 확장성을 확보하는 네트워크 장치입니다.
                </Prose>
                <InfoBox color="blue" title="로드밸런서의 핵심 역할">
                    <ul className="space-y-1 list-disc list-inside">
                        <li><strong>부하 분산</strong> -- 트래픽을 여러 서버에 균등하게 분배</li>
                        <li><strong>고가용성</strong> -- 장애 서버를 자동 제외하고 정상 서버로 전환</li>
                        <li><strong>확장성</strong> -- 서버 추가/제거로 용량 조절 (Scale-out)</li>
                        <li><strong>Health Check</strong> -- 주기적으로 서버 상태를 확인</li>
                    </ul>
                </InfoBox>
                <InfoTable headers={['알고리즘', '동작 방식', '특징']} rows={lbAlgorithmRows} />
                <CodeBlock language="nginx" filename="nginx 로드밸런서 설정" code={nginxLbCode} />
                <Alert variant="tip" title="DSR (Direct Server Return)">
                    L4 로드밸런서에서 응답 패킷이 LB를 거치지 않고 서버에서 직접 전달되는 방식입니다.
                    대용량 응답(동영상 스트리밍 등)에 유리합니다.
                </Alert>
            </Section>

            {/* ── 14.2 ────────────────────────────────────────────── */}
            <Section id="s142" title="14.2  L4 vs L7 로드밸런싱">
                <Prose>
                    로드밸런서는 동작하는 OSI 계층에 따라 L4(전송 계층)와 L7(응용 계층)으로 구분됩니다.
                </Prose>
                <L4vsL7Diagram />
                <InfoTable headers={['항목', 'L4 LB', 'L7 LB']} rows={l4vsL7Rows} />
                <CardGrid cols={2}>
                    <StatCard title="L4 처리량" value="~10M PPS" color="blue" desc="패킷 레벨 포워딩" />
                    <StatCard title="L7 지연 추가" value="~1-5 ms" color="green" desc="TLS 종료 + HTTP 파싱" />
                </CardGrid>
                <InfoBox color="purple" title="L4 + L7 조합 아키텍처">
                    대규모 서비스에서는 L4와 L7을 함께 사용합니다.
                    앞단의 L4 LB가 트래픽을 여러 L7 LB에 분배하고,
                    L7 LB가 URL/헤더 기반 라우팅을 수행합니다.
                </InfoBox>
            </Section>

            {/* ── 14.3 ────────────────────────────────────────────── */}
            <Section id="s143" title="14.3  리버스 프록시와 API 게이트웨이">
                <Prose>
                    리버스 프록시는 클라이언트와 백엔드 서버 사이에서 요청을 중계합니다.
                    API 게이트웨이는 리버스 프록시의 기능을 확장하여 인증, Rate Limiting 등을 통합합니다.
                </Prose>
                <InfoBox color="cyan" title="리버스 프록시의 주요 기능">
                    <ul className="space-y-1 list-disc list-inside">
                        <li><strong>TLS Termination</strong> -- SSL/TLS 복호화를 프록시에서 처리</li>
                        <li><strong>캐싱</strong> -- 정적 콘텐츠 캐싱으로 백엔드 부하 감소</li>
                        <li><strong>압축</strong> -- gzip/brotli 압축으로 전송량 절감</li>
                        <li><strong>보안</strong> -- 백엔드 서버 IP 은닉, WAF 연동</li>
                    </ul>
                </InfoBox>
                <InfoBox color="amber" title="API 게이트웨이 추가 기능">
                    <ul className="space-y-1 list-disc list-inside">
                        <li><strong>인증/인가</strong> -- JWT 검증, OAuth 2.0, API Key</li>
                        <li><strong>Rate Limiting</strong> -- 클라이언트별 요청 횟수 제한</li>
                        <li><strong>Circuit Breaker</strong> -- 장애 백엔드 자동 차단</li>
                    </ul>
                </InfoBox>
                <CodeBlock language="nginx" filename="리버스 프록시 + API 게이트웨이" code={nginxReverseProxyCode} />
                <Alert variant="info" title="대표적인 API 게이트웨이">
                    Kong, AWS API Gateway, Apigee, Traefik, APISIX 등이 있습니다.
                </Alert>
            </Section>

            {/* ── 14.4 ────────────────────────────────────────────── */}
            <Section id="s144" title="14.4  CDN의 원리">
                <Prose>
                    CDN(Content Delivery Network)은 전 세계에 분산된 Edge 서버를 통해
                    사용자와 가장 가까운 위치에서 콘텐츠를 제공합니다.
                </Prose>
                <InfoBox color="green" title="CDN 핵심 동작 방식">
                    <div className="space-y-2">
                        <div><strong>1. DNS 기반 라우팅</strong> -- Anycast 또는 GeoDNS로 최적의 Edge 선택</div>
                        <div><strong>2. Edge Caching</strong> -- Cache-Control, ETag 등에 따라 캐시 정책 결정</div>
                        <div><strong>3. Origin Pull</strong> -- Cache Miss 시 Origin에서 가져와 캐싱</div>
                    </div>
                </InfoBox>
                <CardGrid cols={3}>
                    <StatCard title="Cache Hit Ratio" value="~95%+" color="green" desc="대부분 Edge에서 처리" />
                    <StatCard title="지연 개선" value="~50-200ms" color="cyan" desc="Origin 대비 감소" />
                    <StatCard title="글로벌 POP" value="200+" color="amber" desc="주요 CDN 업체 기준" />
                </CardGrid>
                <Alert variant="tip" title="Cache Invalidation">
                    파일명에 해시를 포함(app.a1b2c3.js)하는 Cache Busting이 가장 안정적입니다.
                </Alert>
            </Section>

            {/* ── 14.5 GSLB (NEW) ─────────────────────────────────── */}
            <Section id="s145" title="14.5  GSLB (Global Server Load Balancing)">
                <Prose>
                    GSLB(Global Server Load Balancing)는 DNS를 기반으로 여러 지역의 데이터센터나
                    클라우드 리전에 트래픽을 분산하는 글로벌 로드밸런싱 기술입니다.
                    일반 로드밸런서가 단일 사이트 내에서 서버 간 분산을 담당한다면,
                    GSLB는 사이트(리전) 간 분산을 담당합니다.
                </Prose>

                <GslbDiagram />

                <InfoBox color="blue" title="GSLB 동작 원리">
                    <div className="space-y-2">
                        <div>
                            <strong>1. 클라이언트 DNS 질의</strong> -- 클라이언트가 api.example.com을 질의하면
                            GSLB가 권한 DNS 서버 역할을 수행합니다.
                        </div>
                        <div>
                            <strong>2. Health Check</strong> -- GSLB는 각 사이트의 서버를 주기적으로
                            모니터링하여 가용성을 확인합니다 (HTTP, TCP, ICMP 등).
                        </div>
                        <div>
                            <strong>3. 최적 사이트 선택</strong> -- 클라이언트의 위치, 사이트 건강 상태,
                            부하 수준, 정책에 따라 최적의 사이트 IP를 DNS 응답으로 반환합니다.
                        </div>
                        <div>
                            <strong>4. Failover</strong> -- 특정 사이트가 장애 상태이면 자동으로
                            다른 사이트의 IP를 반환하여 재해 복구(DR)를 수행합니다.
                        </div>
                    </div>
                </InfoBox>

                <InfoTable
                    headers={['분산 방식', '설명', '사용 사례']}
                    rows={gslbMethodRows}
                />

                <CardGrid cols={2}>
                    <InfoBox color="green" title="Anycast vs GSLB">
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li><strong>Anycast</strong>: 같은 IP를 여러 위치에서 BGP 광고, 네트워크가 최단 경로 선택</li>
                            <li><strong>GSLB</strong>: DNS 응답으로 서로 다른 IP 반환, 애플리케이션 수준 제어</li>
                            <li>CDN은 Anycast, 애플리케이션 LB는 GSLB를 주로 사용</li>
                            <li>두 기술을 결합하여 사용하는 경우도 많음</li>
                        </ul>
                    </InfoBox>
                    <InfoBox color="purple" title="GSLB 제품/서비스">
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li><strong>F5 BIG-IP DNS (GTM)</strong>: 온프레미스 GSLB 대표 제품</li>
                            <li><strong>AWS Route 53</strong>: Latency/Geo/Failover 라우팅</li>
                            <li><strong>Cloudflare Load Balancing</strong>: Edge 기반 글로벌 LB</li>
                            <li><strong>GCP Cloud DNS</strong>: Geo 라우팅 + Health Check</li>
                        </ul>
                    </InfoBox>
                </CardGrid>

                <CodeBlock language="bash" filename="GSLB DNS 기반 글로벌 분산" code={gslbDnsCode} />

                <Alert variant="warning" title="DNS TTL과 Failover 속도">
                    GSLB의 failover 속도는 DNS TTL에 의존합니다. TTL이 300초이면 최대 5분간
                    클라이언트가 장애 사이트로 접속할 수 있습니다. 빠른 failover가 필요하면
                    TTL을 30~60초로 낮추되, DNS 서버 부하가 증가하는 트레이드오프를 고려합니다.
                </Alert>
            </Section>

            {/* ── 14.6 ────────────────────────────────────────────── */}
            <Section id="s146" title="14.6  고가용성 설계">
                <Prose>
                    고가용성(HA)은 서비스가 장애 상황에서도 지속적으로 동작하도록 설계하는 것입니다.
                </Prose>
                <CardGrid cols={3}>
                    <StatCard title="99.9%" value="~8.7시간/년" color="amber" desc="Three 9s" />
                    <StatCard title="99.99%" value="~52분/년" color="green" desc="Four 9s" />
                    <StatCard title="99.999%" value="~5분/년" color="blue" desc="Five 9s" />
                </CardGrid>
                <InfoTable headers={['전략', '설명', '대표 구현']} rows={haRows} />
                <InfoBox color="blue" title="Health Check 설계">
                    <div className="space-y-2">
                        <div><strong>Liveness Check</strong> -- 서버가 살아있는지 확인</div>
                        <div><strong>Readiness Check</strong> -- 요청을 처리할 준비가 되었는지 확인</div>
                        <div><strong>Deep Health Check</strong> -- DB 연결, 캐시 상태 등 종속 리소스까지 확인</div>
                    </div>
                </InfoBox>
                <CodeBlock language="text" filename="HAProxy Health Check + Failover" code={haproxyHealthCode} />
                <InfoBox color="rose" title="Failover 전략">
                    <ul className="space-y-1 list-disc list-inside">
                        <li><strong>Cold Standby</strong> -- 장애 시 서버 시작 (수분 소요)</li>
                        <li><strong>Warm Standby</strong> -- 실행 중이나 트래픽 미수신 (수초 전환)</li>
                        <li><strong>Hot Standby</strong> -- 실시간 동기화, 즉시 전환 (ms 단위)</li>
                        <li><strong>Active-Active</strong> -- 모든 서버가 동시 처리, 장애 서버만 제외</li>
                    </ul>
                </InfoBox>
            </Section>

            {/* ── 14.7 ────────────────────────────────────────────── */}
            <Section id="s147" title="14.7  요약">
                <InfoBox color="gray" title="핵심 정리">
                    <ul className="space-y-1 list-disc list-inside">
                        <li><strong>로드밸런서</strong>는 L4(패킷 수준)와 L7(HTTP 수준)으로 구분되며, 대규모 서비스는 둘을 조합합니다</li>
                        <li><strong>리버스 프록시</strong>는 TLS 종료, 캐싱, 라우팅을 수행하며, API 게이트웨이는 인증, Rate Limiting을 추가합니다</li>
                        <li><strong>CDN</strong>은 Edge 캐싱과 Origin Pull로 지연을 줄이고, Anycast/GeoDNS로 최적의 Edge를 선택합니다</li>
                        <li><strong>GSLB</strong>는 DNS 기반으로 여러 리전에 트래픽을 분산하며, Health Check와 Failover로 글로벌 HA를 제공합니다</li>
                        <li><strong>고가용성</strong>은 Health Check, Failover, 다중화로 SPOF를 제거하고 99.99%+ 가용성을 목표로 합니다</li>
                    </ul>
                </InfoBox>
            </Section>

            <TopicNavigation topicId="14-load-balancing" />
        </div>
    )
}
