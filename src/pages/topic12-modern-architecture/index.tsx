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
import {
    nginxLbCode,
    nginxReverseProxyCode,
    wireguardCode,
    dockerNetworkCode,
    kubectlNetworkCode,
    haproxyHealthCode,
    istioSidecarCode,
} from './codeSnippets'

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

const vpnCompareRows = [
    { cells: ['IPsec', 'L3', '게이트웨이 간 (Site-to-Site)', 'ESP/AH, IKEv2'] },
    { cells: ['WireGuard', 'L3', 'P2P / 원격 접속', 'Noise Protocol, UDP'] },
    { cells: ['OpenVPN', 'L3/L2', '원격 접속', 'TLS + UDP/TCP'] },
    { cells: ['VXLAN', 'L2 over L3', '데이터센터 오버레이', 'UDP 4789, VNI 24bit'] },
    { cells: ['GRE', 'L3', '터널링', 'IP Protocol 47'] },
]

const cloudNetRows = [
    { cells: ['VPC', '격리된 가상 네트워크 (CIDR 범위 지정)'] },
    { cells: ['Subnet', 'VPC 내 AZ별 IP 대역 분할 (Public/Private)'] },
    { cells: ['Internet Gateway', 'VPC와 인터넷 간 통신 게이트웨이'] },
    { cells: ['NAT Gateway', 'Private Subnet의 아웃바운드 인터넷 접속'] },
    { cells: ['Security Group', '인스턴스 레벨 상태 기반 방화벽 (Allow 전용)'] },
    { cells: ['NACL', '서브넷 레벨 Stateless 방화벽 (Allow/Deny)'] },
    { cells: ['Route Table', '서브넷별 라우팅 규칙'] },
    { cells: ['VPC Peering', 'VPC 간 사설 네트워크 연결'] },
]

const containerNetRows = [
    { cells: ['Bridge', '단일 호스트 내 컨테이너 연결', 'docker0, veth pair'] },
    { cells: ['Host', '호스트 네트워크 스택 공유', '성능 최적, 격리 없음'] },
    { cells: ['Overlay', '멀티 호스트 간 L2 네트워크', 'VXLAN 기반 터널'] },
    { cells: ['Macvlan', '컨테이너에 물리 MAC 할당', '직접 L2 접근'] },
    { cells: ['None', '네트워크 없음', '완전 격리'] },
]

const cniRows = [
    { cells: ['Calico', 'BGP 기반 L3 라우팅', 'NetworkPolicy, 대규모'] },
    { cells: ['Cilium', 'eBPF 기반 고성능', 'L7 정책, 모니터링'] },
    { cells: ['Flannel', 'VXLAN 오버레이', '단순, 소규모'] },
    { cells: ['Weave', '메시 오버레이', '자동 구성, 암호화'] },
]

const zeroTrustRows = [
    { cells: ['기본 원칙', '"Never trust, always verify"'] },
    { cells: ['네트워크 경계', '경계 없음 (Perimeter-less)'] },
    { cells: ['인증', '모든 요청마다 신원 확인 (mTLS)'] },
    { cells: ['권한', '최소 권한 원칙 (Least Privilege)'] },
    { cells: ['세분화', 'Micro-segmentation'] },
    { cells: ['모니터링', '지속적 검증 및 로깅'] },
]

const haRows = [
    { cells: ['Active-Standby', '대기 서버가 장애 시 인수', 'Keepalived, VRRP'] },
    { cells: ['Active-Active', '모든 노드가 트래픽 처리', 'LB + 다중 인스턴스'] },
    { cells: ['DNS Failover', 'DNS 레코드 전환으로 트래픽 이동', 'Route 53, Cloudflare'] },
    { cells: ['Anycast', '동일 IP, 가장 가까운 노드 응답', 'CDN, DNS 루트 서버'] },
    { cells: ['Multi-AZ', '여러 가용 영역에 분산 배치', '클라우드 HA 기본'] },
]

/* ── Component ────────────────────────────────────────────────────── */

export default function Topic12() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-14">
            {/* ── Header ─────────────────────────────────────────── */}
            <header className="space-y-3">
                <p className="text-xs font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                    Topic 12
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    현대 네트워크와 실전 아키텍처
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    Modern Network Architecture
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    로드밸런서, CDN, VPN, 클라우드 네트워크, 컨테이너 네트워크, 서비스 메시 등
                    현대적인 네트워크 아키텍처의 핵심 개념과 실전 설계 원리를 종합적으로 학습합니다.
                </p>
            </header>

            {/* ── Learning Card ───────────────────────────────────── */}
            <LearningCard
                topicId="12-modern-architecture"
                items={[
                    'L4/L7 로드밸런싱의 차이를 이해한다',
                    '리버스 프록시와 API 게이트웨이의 역할을 설명할 수 있다',
                    'CDN의 캐싱 원리와 Origin Pull 구조를 파악한다',
                    'VPN/터널링 기술의 종류와 차이를 구분할 수 있다',
                    '클라우드/컨테이너 네트워크의 기초를 설명할 수 있다',
                    '서비스 메시와 Zero Trust 개념을 이해한다',
                    '고가용성(HA) 설계 원리를 파악한다',
                ]}
            />

            {/* ── 12.1 로드밸런서 기본 구조 ────────────────────── */}
            <Section id="s121" title="12.1  로드밸런서 기본 구조">
                <Prose>
                    로드밸런서(Load Balancer)는 클라이언트의 요청을 여러 백엔드 서버에 분배하여
                    가용성과 확장성을 확보하는 네트워크 장치입니다. 단일 서버의 한계를 넘어
                    수평 확장(Scale-out)을 가능하게 하는 핵심 인프라 컴포넌트입니다.
                </Prose>

                <InfoBox color="blue" title="로드밸런서의 핵심 역할">
                    <ul className="space-y-1 list-disc list-inside">
                        <li><strong>부하 분산</strong> — 트래픽을 여러 서버에 균등하게 분배</li>
                        <li><strong>고가용성</strong> — 장애 서버를 자동 제외하고 정상 서버로 전환</li>
                        <li><strong>확장성</strong> — 서버 추가/제거로 용량 조절 (Scale-out)</li>
                        <li><strong>Health Check</strong> — 주기적으로 서버 상태를 확인하여 장애 감지</li>
                    </ul>
                </InfoBox>

                <InfoTable
                    headers={['알고리즘', '동작 방식', '특징']}
                    rows={lbAlgorithmRows}
                />

                <CodeBlock language="nginx" filename="nginx 로드밸런서 설정" code={nginxLbCode} />

                <Alert variant="tip" title="DSR (Direct Server Return)">
                    L4 로드밸런서에서 응답 패킷이 LB를 거치지 않고 서버에서 클라이언트로 직접 전달되는 방식입니다.
                    LB의 대역폭 병목을 제거하여 대용량 응답(동영상 스트리밍 등)에 유리합니다.
                </Alert>
            </Section>

            {/* ── 12.2 L4 vs L7 로드밸런싱 ─────────────────────── */}
            <Section id="s122" title="12.2  L4 vs L7 로드밸런싱">
                <Prose>
                    로드밸런서는 동작하는 OSI 계층에 따라 L4(전송 계층)와 L7(응용 계층)으로 구분됩니다.
                    L4는 TCP/UDP 패킷 수준에서 동작하여 빠르고 단순하며,
                    L7은 HTTP 요청을 해석하여 URL, 헤더, 쿠키 등을 기반으로 세밀한 라우팅이 가능합니다.
                </Prose>

                <L4vsL7Diagram />

                <InfoTable
                    headers={['항목', 'L4 LB', 'L7 LB']}
                    rows={l4vsL7Rows}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <StatCard title="L4 처리량" value="~10M PPS" color="blue" desc="패킷 레벨 포워딩으로 초당 수백만 패킷 처리 (IPVS, DPDK 기반)" />
                    <StatCard title="L7 지연 추가" value="~1-5 ms" color="green" desc="TLS 종료 + HTTP 파싱 + 프록시 연결에 따른 추가 지연" />
                </div>

                <InfoBox color="purple" title="L4 + L7 조합 아키텍처">
                    대규모 서비스에서는 L4와 L7을 함께 사용합니다.
                    앞단의 L4 LB(IPVS, NLB 등)가 트래픽을 여러 L7 LB(nginx, Envoy)에 분배하고,
                    L7 LB가 URL/헤더 기반 라우팅, TLS 종료, 캐싱 등을 수행합니다.
                    Google의 Maglev, Facebook의 Katran 등이 이 구조를 사용합니다.
                </InfoBox>
            </Section>

            {/* ── 12.3 리버스 프록시와 API 게이트웨이 ──────────── */}
            <Section id="s123" title="12.3  리버스 프록시와 API 게이트웨이">
                <Prose>
                    리버스 프록시는 클라이언트와 백엔드 서버 사이에서 요청을 중계하는 서버입니다.
                    클라이언트는 리버스 프록시의 주소만 알고, 실제 백엔드 서버는 외부에 노출되지 않습니다.
                    API 게이트웨이는 리버스 프록시의 기능을 확장하여 인증, Rate Limiting, 요청 변환 등
                    API 관리 기능을 통합한 진입점입니다.
                </Prose>

                <InfoBox color="cyan" title="리버스 프록시의 주요 기능">
                    <ul className="space-y-1 list-disc list-inside">
                        <li><strong>TLS Termination</strong> — SSL/TLS 복호화를 프록시에서 처리</li>
                        <li><strong>캐싱</strong> — 정적 콘텐츠 캐싱으로 백엔드 부하 감소</li>
                        <li><strong>압축</strong> — gzip/brotli 압축으로 전송량 절감</li>
                        <li><strong>보안</strong> — 백엔드 서버 IP 은닉, WAF 연동</li>
                        <li><strong>로드밸런싱</strong> — 여러 백엔드 서버에 요청 분배</li>
                    </ul>
                </InfoBox>

                <InfoBox color="amber" title="API 게이트웨이 추가 기능">
                    <ul className="space-y-1 list-disc list-inside">
                        <li><strong>인증/인가</strong> — JWT 검증, OAuth 2.0, API Key 관리</li>
                        <li><strong>Rate Limiting</strong> — 클라이언트별 요청 횟수 제한</li>
                        <li><strong>요청 변환</strong> — 헤더 추가/수정, 경로 재작성</li>
                        <li><strong>Circuit Breaker</strong> — 장애 백엔드 자동 차단</li>
                        <li><strong>모니터링</strong> — 요청/응답 메트릭, 분산 추적</li>
                    </ul>
                </InfoBox>

                <CodeBlock language="nginx" filename="리버스 프록시 + API 게이트웨이 설정" code={nginxReverseProxyCode} />

                <Alert variant="info" title="대표적인 API 게이트웨이">
                    Kong, AWS API Gateway, Apigee, Traefik, APISIX 등이 있으며,
                    마이크로서비스 환경에서 서비스 간 통신을 제어하는 핵심 컴포넌트입니다.
                </Alert>
            </Section>

            {/* ── 12.4 CDN의 원리 ──────────────────────────────── */}
            <Section id="s124" title="12.4  CDN의 원리">
                <Prose>
                    CDN(Content Delivery Network)은 전 세계에 분산된 Edge 서버를 통해
                    사용자와 가장 가까운 위치에서 콘텐츠를 제공하는 네트워크 인프라입니다.
                    지연 시간을 줄이고 Origin 서버의 부하를 분산합니다.
                </Prose>

                <InfoBox color="green" title="CDN 핵심 동작 방식">
                    <div className="space-y-2">
                        <div>
                            <strong>1. DNS 기반 라우팅</strong> — 사용자의 DNS 요청을 가장 가까운 Edge POP(Point of Presence)으로 안내합니다.
                            Anycast 또는 GeoDNS를 사용하여 지리적으로 최적의 서버를 선택합니다.
                        </div>
                        <div>
                            <strong>2. Edge Caching</strong> — Edge 서버가 콘텐츠를 캐싱하여 후속 요청에 즉시 응답합니다.
                            Cache-Control, ETag 등 HTTP 캐시 헤더에 따라 캐시 정책이 결정됩니다.
                        </div>
                        <div>
                            <strong>3. Origin Pull</strong> — Edge 서버에 캐시가 없으면(Cache Miss) Origin 서버에서 콘텐츠를 가져와
                            캐싱한 뒤 클라이언트에 전달합니다. 이후 동일 요청은 Edge에서 직접 응답합니다.
                        </div>
                    </div>
                </InfoBox>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <StatCard title="Cache Hit Ratio" value="~95%+" color="green" desc="효율적인 CDN은 대부분의 요청을 Edge에서 처리" />
                    <StatCard title="지연 시간 개선" value="~50-200ms" color="cyan" desc="Origin 직접 접속 대비 지연 감소 (지역에 따라 다름)" />
                    <StatCard title="글로벌 POP" value="200+" color="amber" desc="주요 CDN 업체의 전 세계 Edge 서버 위치 수" />
                </div>

                <InfoBox color="blue" title="CDN이 처리하는 콘텐츠 유형">
                    <ul className="space-y-1 list-disc list-inside">
                        <li><strong>정적 콘텐츠</strong> — 이미지, CSS, JS, 폰트, 동영상 (Cache 효율 높음)</li>
                        <li><strong>동적 콘텐츠</strong> — API 응답, 개인화 페이지 (Edge Computing / ESI 활용)</li>
                        <li><strong>라이브 스트리밍</strong> — HLS/DASH 세그먼트 분배</li>
                        <li><strong>소프트웨어 배포</strong> — OS 업데이트, 앱 바이너리</li>
                    </ul>
                </InfoBox>

                <Alert variant="tip" title="Cache Invalidation">
                    CDN 캐시 무효화는 파일명에 해시를 포함(예: app.a1b2c3.js)하는 Cache Busting이 가장 안정적입니다.
                    Purge API로 특정 경로의 캐시를 즉시 삭제할 수도 있습니다.
                </Alert>
            </Section>

            {/* ── 12.5 VPN과 터널링 ────────────────────────────── */}
            <Section id="s125" title="12.5  VPN과 터널링">
                <Prose>
                    VPN(Virtual Private Network)은 공용 네트워크 위에 암호화된 터널을 만들어
                    사설 네트워크처럼 안전하게 통신하는 기술입니다. 원격 접속, 사이트 간 연결,
                    데이터센터 오버레이 네트워크 등 다양한 용도로 사용됩니다.
                </Prose>

                <InfoTable
                    headers={['기술', '계층', '주요 용도', '프로토콜/특징']}
                    rows={vpnCompareRows}
                />

                <InfoBox color="indigo" title="IPsec vs WireGuard">
                    <div className="space-y-2">
                        <div>
                            <strong>IPsec</strong>은 오랜 역사와 광범위한 장비 호환성을 갖추고 있으며,
                            IKEv2를 통한 키 교환과 ESP(Encapsulating Security Payload)로 데이터를 암호화합니다.
                            복잡한 설정이 단점이지만, 엔터프라이즈 Site-to-Site VPN의 표준입니다.
                        </div>
                        <div>
                            <strong>WireGuard</strong>는 약 4,000줄의 간결한 코드로 구현되어 있으며,
                            Noise Protocol Framework 기반의 현대적 암호화(ChaCha20, Curve25519)를 사용합니다.
                            Linux 커널에 내장되어 있으며 설정이 매우 간단합니다.
                        </div>
                    </div>
                </InfoBox>

                <CodeBlock language="ini" filename="WireGuard 설정" code={wireguardCode} />

                <InfoBox color="orange" title="VXLAN — 데이터센터 오버레이">
                    VXLAN(Virtual Extensible LAN)은 L2 프레임을 UDP(포트 4789)로 캡슐화하여
                    L3 네트워크 위에 가상 L2 세그먼트를 구성합니다. 24비트 VNI(VXLAN Network Identifier)로
                    최대 1,600만 개의 가상 네트워크를 지원하여 VLAN의 4,096개 제한을 극복합니다.
                    클라우드 환경과 컨테이너 오버레이 네트워크의 핵심 기술입니다.
                </InfoBox>
            </Section>

            {/* ── 12.6 클라우드 네트워킹 ───────────────────────── */}
            <Section id="s126" title="12.6  클라우드 네트워킹">
                <Prose>
                    클라우드 환경에서의 네트워크는 소프트웨어로 정의되고 API로 관리됩니다.
                    물리 네트워크 위에 가상 네트워크(VPC)를 구성하고, 서브넷, 라우팅 테이블,
                    보안 그룹 등을 통해 격리와 접근 제어를 구현합니다.
                </Prose>

                <InfoTable
                    headers={['구성 요소', '설명']}
                    rows={cloudNetRows}
                />

                <InfoBox color="sky" title="VPC 설계 모범 사례">
                    <ul className="space-y-1 list-disc list-inside">
                        <li>CIDR은 충분히 크게 설정 (예: /16) — 나중에 확장 불가</li>
                        <li>Public Subnet과 Private Subnet을 분리</li>
                        <li>AZ(가용 영역)별로 서브넷을 생성하여 고가용성 확보</li>
                        <li>NAT Gateway로 Private Subnet의 아웃바운드만 허용</li>
                        <li>Security Group은 최소 권한 원칙으로 인바운드 제한</li>
                    </ul>
                </InfoBox>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoBox color="green" title="Security Group (상태 기반)">
                        인스턴스 레벨에서 동작하며, Allow 규칙만 정의합니다.
                        인바운드 트래픽을 허용하면 응답 트래픽은 자동 허용됩니다 (Stateful).
                        여러 인스턴스에 동일 SG를 할당할 수 있습니다.
                    </InfoBox>
                    <InfoBox color="amber" title="NACL (무상태)">
                        서브넷 레벨에서 동작하며, Allow/Deny 규칙을 모두 지원합니다.
                        규칙 번호 순서로 평가되며, 인바운드/아웃바운드를 각각 정의해야 합니다 (Stateless).
                        서브넷의 2차 방어선으로 활용합니다.
                    </InfoBox>
                </div>

                <Alert variant="info" title="VPC Peering vs Transit Gateway">
                    VPC Peering은 두 VPC 간 1:1 연결이며, Transit Gateway는 허브-스포크 모델로
                    여러 VPC, 온프레미스, VPN을 중앙에서 연결합니다. VPC 수가 많을수록 Transit Gateway가 유리합니다.
                </Alert>
            </Section>

            {/* ── 12.7 컨테이너 네트워크 ───────────────────────── */}
            <Section id="s127" title="12.7  컨테이너 네트워크">
                <Prose>
                    컨테이너는 Linux 네트워크 네임스페이스를 기반으로 격리된 네트워크 환경을 제공합니다.
                    Docker의 기본 브릿지 네트워크부터 Kubernetes의 CNI(Container Network Interface)까지,
                    컨테이너 간 통신을 위한 다양한 네트워크 모델이 존재합니다.
                </Prose>

                <InfoTable
                    headers={['드라이버', '설명', '구현 방식']}
                    rows={containerNetRows}
                />

                <CodeBlock language="bash" filename="Docker 네트워크 관리" code={dockerNetworkCode} />

                <InfoBox color="violet" title="Kubernetes 네트워크 모델">
                    <div className="space-y-2">
                        <div>Kubernetes는 다음 네트워크 규칙을 요구합니다:</div>
                        <ul className="space-y-1 list-disc list-inside">
                            <li>모든 Pod는 NAT 없이 다른 모든 Pod와 통신 가능</li>
                            <li>모든 Node는 NAT 없이 모든 Pod와 통신 가능</li>
                            <li>Pod가 인식하는 자신의 IP = 다른 Pod가 보는 IP</li>
                        </ul>
                        <div>이 규칙을 구현하는 것이 CNI 플러그인의 역할입니다.</div>
                    </div>
                </InfoBox>

                <InfoTable
                    headers={['CNI 플러그인', '방식', '특징']}
                    rows={cniRows}
                />

                <CodeBlock language="bash" filename="Kubernetes 네트워크 관리" code={kubectlNetworkCode} />

                <Alert variant="tip" title="kube-proxy와 Service">
                    Kubernetes Service는 ClusterIP(내부), NodePort(노드 포트), LoadBalancer(외부 LB)
                    타입이 있으며, kube-proxy가 iptables/IPVS 규칙으로 Service IP를 Pod IP로 변환합니다.
                    Cilium은 kube-proxy를 eBPF로 대체하여 더 높은 성능을 제공합니다.
                </Alert>
            </Section>

            {/* ── 12.8 서비스 메시 ──────────────────────────────── */}
            <Section id="s128" title="12.8  서비스 메시">
                <Prose>
                    서비스 메시(Service Mesh)는 마이크로서비스 간 네트워크 통신을 인프라 레벨에서
                    투명하게 관리하는 전용 레이어입니다. 각 서비스 옆에 사이드카 프록시를 배치하여
                    트래픽 제어, 보안(mTLS), 관측성(observability)을 애플리케이션 코드 수정 없이 제공합니다.
                </Prose>

                <InfoBox color="purple" title="서비스 메시의 구성 요소">
                    <div className="space-y-2">
                        <div>
                            <strong>Data Plane (데이터 플레인)</strong> — 각 Pod에 사이드카로 배포된 프록시(Envoy 등)가
                            실제 트래픽을 가로채어 처리합니다. iptables 또는 eBPF로 트래픽을 사이드카로 리다이렉트합니다.
                        </div>
                        <div>
                            <strong>Control Plane (컨트롤 플레인)</strong> — Istiod, Linkerd-controller 등이
                            라우팅 규칙, 인증서, 정책을 관리하고 Data Plane에 전달합니다.
                        </div>
                    </div>
                </InfoBox>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <StatCard title="mTLS" value="자동 암호화" color="purple" desc="서비스 간 통신을 자동으로 상호 TLS 인증" />
                    <StatCard title="트래픽 제어" value="카나리 배포" color="cyan" desc="가중치 기반 트래픽 분할 (v1: 90%, v2: 10%)" />
                    <StatCard title="관측성" value="분산 추적" color="amber" desc="Jaeger, Zipkin 연동으로 요청 추적" />
                </div>

                <CodeBlock language="yaml" filename="Istio VirtualService + DestinationRule" code={istioSidecarCode} />

                <InfoBox color="teal" title="Istio vs Linkerd vs Cilium Service Mesh">
                    <ul className="space-y-1 list-disc list-inside">
                        <li><strong>Istio</strong> — 가장 풍부한 기능, Envoy 기반, 복잡한 구성</li>
                        <li><strong>Linkerd</strong> — 경량화, Rust 기반 프록시, 간단한 운영</li>
                        <li><strong>Cilium</strong> — eBPF 기반, 사이드카 없이 커널 레벨에서 처리, 높은 성능</li>
                    </ul>
                </InfoBox>
            </Section>

            {/* ── 12.9 Zero Trust 네트워크 ─────────────────────── */}
            <Section id="s129" title="12.9  Zero Trust 네트워크">
                <Prose>
                    전통적인 네트워크 보안은 내부/외부 경계(Perimeter)를 기준으로 &quot;내부는 신뢰, 외부는 불신&quot;하는
                    모델이었습니다. Zero Trust는 이 경계를 없애고 &quot;누구도 기본적으로 신뢰하지 않으며,
                    모든 접근을 검증한다&quot;는 원칙에 기반합니다.
                </Prose>

                <InfoTable
                    headers={['항목', '내용']}
                    rows={zeroTrustRows}
                />

                <InfoBox color="red" title="전통 모델 vs Zero Trust">
                    <div className="space-y-2">
                        <div>
                            <strong>전통 모델 (Castle-and-Moat)</strong>: 방화벽으로 외부를 차단하면 내부는 안전하다고 가정.
                            내부 공격자, 횡적 이동(Lateral Movement)에 취약합니다.
                        </div>
                        <div>
                            <strong>Zero Trust</strong>: 모든 네트워크 세그먼트, 모든 요청에 대해 인증과 권한을 확인.
                            mTLS, SPIFFE/SPIRE, BeyondCorp 등으로 구현합니다.
                        </div>
                    </div>
                </InfoBox>

                <InfoBox color="emerald" title="Zero Trust 구현 요소">
                    <ul className="space-y-1 list-disc list-inside">
                        <li><strong>Identity-Aware Proxy</strong> — 네트워크 위치 대신 사용자 ID 기반 접근 (Google BeyondCorp)</li>
                        <li><strong>Micro-segmentation</strong> — 워크로드 단위로 네트워크를 세분화</li>
                        <li><strong>mTLS Everywhere</strong> — 모든 서비스 간 통신을 상호 TLS로 암호화</li>
                        <li><strong>Continuous Verification</strong> — 세션 중에도 지속적으로 보안 상태 재검증</li>
                        <li><strong>Least Privilege Access</strong> — 필요한 최소 권한만 부여, 시간 제한</li>
                    </ul>
                </InfoBox>

                <Alert variant="warning" title="Zero Trust는 목표이자 여정">
                    Zero Trust는 단일 제품이 아니라 보안 아키텍처 원칙입니다.
                    기존 인프라에 점진적으로 적용하며, mTLS 도입, IAM 강화,
                    네트워크 세분화 순으로 단계적으로 구현하는 것이 현실적입니다.
                </Alert>
            </Section>

            {/* ── 12.10 고가용성 설계 ──────────────────────────── */}
            <Section id="s1210" title="12.10  고가용성 설계">
                <Prose>
                    고가용성(HA, High Availability)은 서비스가 장애 상황에서도 지속적으로 동작하도록
                    설계하는 것을 의미합니다. 단일 장애 지점(SPOF)을 제거하고,
                    Health Check, Failover, 다중화를 통해 가용성을 확보합니다.
                </Prose>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <StatCard title="99.9% (Three 9s)" value="~8.7시간/년" color="amber" desc="연간 허용 다운타임" />
                    <StatCard title="99.99% (Four 9s)" value="~52분/년" color="green" desc="고가용성 서비스 목표" />
                    <StatCard title="99.999% (Five 9s)" value="~5분/년" color="blue" desc="통신/금융 수준 가용성" />
                </div>

                <InfoTable
                    headers={['전략', '설명', '대표 구현']}
                    rows={haRows}
                />

                <InfoBox color="blue" title="Health Check 설계">
                    <div className="space-y-2">
                        <div>
                            <strong>Liveness Check</strong> — 서버가 살아있는지 확인 (TCP 연결, ICMP ping).
                            실패 시 서버를 재시작하거나 트래픽 제외합니다.
                        </div>
                        <div>
                            <strong>Readiness Check</strong> — 서버가 요청을 처리할 준비가 되었는지 확인.
                            시작 중이거나 의존 서비스 연결이 안 되면 트래픽을 보내지 않습니다.
                        </div>
                        <div>
                            <strong>Deep Health Check</strong> — DB 연결, 캐시 상태, 디스크 공간 등
                            종속 리소스까지 확인하는 심층 점검입니다.
                        </div>
                    </div>
                </InfoBox>

                <CodeBlock language="text" filename="HAProxy Health Check + Failover" code={haproxyHealthCode} />

                <InfoBox color="rose" title="Failover 전략">
                    <ul className="space-y-1 list-disc list-inside">
                        <li><strong>Cold Standby</strong> — 대기 서버가 꺼져 있다가 장애 시 시작 (수분 소요)</li>
                        <li><strong>Warm Standby</strong> — 대기 서버가 실행 중이나 트래픽 미수신 (수초 전환)</li>
                        <li><strong>Hot Standby</strong> — 대기 서버가 실시간 동기화, 즉시 전환 (ms 단위)</li>
                        <li><strong>Active-Active</strong> — 모든 서버가 동시에 트래픽 처리, 장애 서버만 제외</li>
                    </ul>
                </InfoBox>

                <Alert variant="tip" title="DNS Failover 한계">
                    DNS TTL 기반 failover는 클라이언트의 DNS 캐시로 인해 전환에 시간이 걸립니다.
                    빠른 failover가 필요하면 Anycast, LB Health Check, VRRP 등을 함께 사용해야 합니다.
                </Alert>
            </Section>

            {/* ── 12.11 요약 ───────────────────────────────────── */}
            <Section id="s1211" title="12.11  요약">
                <InfoBox color="gray" title="핵심 정리">
                    <ul className="space-y-1 list-disc list-inside">
                        <li><strong>로드밸런서</strong>는 L4(패킷 수준, 고성능)와 L7(HTTP 수준, 고기능)으로 구분되며, 대규모 서비스는 둘을 조합합니다</li>
                        <li><strong>리버스 프록시</strong>는 TLS 종료, 캐싱, 라우팅을 수행하며, API 게이트웨이는 인증, Rate Limiting 등을 추가합니다</li>
                        <li><strong>CDN</strong>은 Edge 캐싱과 Origin Pull로 지연을 줄이고, Anycast/GeoDNS로 최적의 Edge를 선택합니다</li>
                        <li><strong>VPN/터널링</strong>은 IPsec(사이트 간), WireGuard(현대적 원격 접속), VXLAN(DC 오버레이)으로 구분됩니다</li>
                        <li><strong>클라우드 네트워크</strong>는 VPC, Subnet, Security Group으로 격리와 접근 제어를 구현합니다</li>
                        <li><strong>컨테이너 네트워크</strong>는 네임스페이스 기반 격리 위에 CNI 플러그인(Calico, Cilium 등)으로 Pod 간 통신을 구현합니다</li>
                        <li><strong>서비스 메시</strong>는 사이드카 프록시로 mTLS, 트래픽 제어, 관측성을 투명하게 제공합니다</li>
                        <li><strong>Zero Trust</strong>는 네트워크 경계를 없애고, 모든 요청을 인증/검증하는 보안 모델입니다</li>
                        <li><strong>고가용성</strong>은 Health Check, Failover, 다중화로 SPOF를 제거하고 99.99%+ 가용성을 목표로 합니다</li>
                    </ul>
                </InfoBox>
            </Section>

            {/* ── Navigation ──────────────────────────────────── */}
            <TopicNavigation topicId="12-modern-architecture" />
        </div>
    )
}
