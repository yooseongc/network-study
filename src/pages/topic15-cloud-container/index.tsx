import { wireguardCode, dockerNetworkCode, kubectlNetworkCode, istioSidecarCode } from './codeSnippets'
import { Alert, CardGrid, CodeBlock, InfoBox, InfoTable, LearningCard, Prose, Section, StatCard, T, TopicNavigation } from '@study-ui/components'

/* ── Inline data ──────────────────────────────────────────────────── */

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

/* ── Component ────────────────────────────────────────────────────── */

export default function Topic15CloudContainer() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-14">
            <header className="space-y-3">
                <p className="text-xs font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                    Topic 15
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    클라우드·컨테이너 네트워크와 제로 트러스트
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Cloud, Container Network & Zero Trust
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    VPN/터널링, 클라우드 VPC, 컨테이너 네트워크, 서비스 메시, Zero Trust 등
                    현대적인 인프라 네트워크의 핵심 기술을 학습합니다.
                </p>
            </header>

            <LearningCard
                topicId="15-cloud-container"
                items={[
                    'VPN/터널링 기술의 종류와 차이를 구분할 수 있다',
                    '클라우드 VPC 네트워크의 기초를 설명할 수 있다',
                    '컨테이너 네트워크와 CNI 플러그인의 역할을 이해한다',
                    '서비스 메시의 구조와 mTLS를 설명할 수 있다',
                    'Zero Trust 보안 모델의 핵심 원칙을 파악한다',
                ]}
            />

            {/* ── 15.1 ────────────────────────────────────────────── */}
            <Section id="s151" title="15.1  VPN과 터널링">
                <Prose>
                    VPN(Virtual Private Network)은 공용 네트워크 위에 암호화된 터널을 만들어
                    사설 네트워크처럼 안전하게 통신하는 기술입니다.
                </Prose>
                <InfoTable headers={['기술', '계층', '주요 용도', '프로토콜/특징']} rows={vpnCompareRows} />
                <InfoBox color="indigo" title="IPsec vs WireGuard">
                    <div className="space-y-2">
                        <div>
                            <strong>IPsec</strong>은 오랜 역사와 광범위한 호환성을 갖추고 있으며,
                            IKEv2를 통한 키 교환과 ESP로 데이터를 암호화합니다.
                            엔터프라이즈 Site-to-Site VPN의 표준입니다.
                        </div>
                        <div>
                            <strong>WireGuard</strong>는 약 4,000줄의 간결한 코드로 구현되어 있으며,
                            Linux 커널에 내장되어 있고 설정이 매우 간단합니다.
                        </div>
                    </div>
                </InfoBox>
                <CodeBlock language="ini" filename="WireGuard 설정" code={wireguardCode} />
                <InfoBox color="orange" title="VXLAN -- 데이터센터 오버레이">
                    <T id="vxlan">VXLAN</T>은 L2 프레임을 UDP(포트 4789)로 캡슐화하여 L3 네트워크 위에 가상 L2 세그먼트를 구성합니다.
                    24비트 VNI로 최대 1,600만 개의 가상 네트워크를 지원합니다.
                </InfoBox>
            </Section>

            {/* ── 15.2 ────────────────────────────────────────────── */}
            <Section id="s152" title="15.2  클라우드 네트워킹">
                <Prose>
                    클라우드 환경에서의 네트워크는 소프트웨어로 정의되고 API로 관리됩니다.
                    물리 네트워크 위에 가상 네트워크(VPC)를 구성합니다.
                </Prose>
                <InfoTable headers={['구성 요소', '설명']} rows={cloudNetRows} />
                <InfoBox color="sky" title="VPC 설계 모범 사례">
                    <ul className="space-y-1 list-disc list-inside">
                        <li>CIDR은 충분히 크게 설정 (예: /16)</li>
                        <li>Public Subnet과 Private Subnet을 분리</li>
                        <li>AZ별로 서브넷을 생성하여 고가용성 확보</li>
                        <li>NAT Gateway로 Private Subnet의 아웃바운드만 허용</li>
                        <li>Security Group은 최소 권한 원칙</li>
                    </ul>
                </InfoBox>
                <CardGrid cols={2}>
                    <InfoBox color="green" title="Security Group (상태 기반)">
                        인스턴스 레벨에서 동작하며, Allow 규칙만 정의합니다. Stateful입니다.
                    </InfoBox>
                    <InfoBox color="amber" title="NACL (무상태)">
                        서브넷 레벨에서 동작하며, Allow/Deny 모두 지원합니다. Stateless입니다.
                    </InfoBox>
                </CardGrid>
                <Alert variant="info" title="VPC Peering vs Transit Gateway">
                    VPC Peering은 두 VPC 간 1:1 연결이며, Transit Gateway는 허브-스포크 모델로
                    여러 VPC를 중앙에서 연결합니다.
                </Alert>
            </Section>

            {/* ── 15.3 ────────────────────────────────────────────── */}
            <Section id="s153" title="15.3  컨테이너 네트워크와 CNI">
                <Prose>
                    컨테이너는 Linux 네트워크 네임스페이스를 기반으로 격리된 네트워크 환경을 제공합니다.
                </Prose>
                <InfoTable headers={['드라이버', '설명', '구현 방식']} rows={containerNetRows} />
                <CodeBlock language="bash" filename="Docker 네트워크 관리" code={dockerNetworkCode} />
                <InfoBox color="violet" title="Kubernetes 네트워크 모델">
                    <div className="space-y-2">
                        <div>Kubernetes는 다음 네트워크 규칙을 요구합니다:</div>
                        <ul className="space-y-1 list-disc list-inside">
                            <li>모든 Pod는 NAT 없이 다른 모든 Pod와 통신 가능</li>
                            <li>모든 Node는 NAT 없이 모든 Pod와 통신 가능</li>
                            <li>Pod가 인식하는 자신의 IP = 다른 Pod가 보는 IP</li>
                        </ul>
                    </div>
                </InfoBox>
                <InfoTable headers={['CNI 플러그인', '방식', '특징']} rows={cniRows} />
                <CodeBlock language="bash" filename="Kubernetes 네트워크 관리" code={kubectlNetworkCode} />
                <Alert variant="tip" title="kube-proxy와 Service">
                    kube-proxy가 iptables/IPVS 규칙으로 Service IP를 Pod IP로 변환합니다.
                    Cilium은 kube-proxy를 eBPF로 대체하여 더 높은 성능을 제공합니다.
                </Alert>
            </Section>

            {/* ── 15.4 ────────────────────────────────────────────── */}
            <Section id="s154" title="15.4  서비스 메시">
                <Prose>
                    <T id="service-mesh">서비스 메시</T>(Service Mesh)는 마이크로서비스 간 네트워크 통신을
                    인프라 레벨에서 투명하게 관리하는 전용 레이어입니다.
                </Prose>
                <InfoBox color="purple" title="서비스 메시의 구성 요소">
                    <div className="space-y-2">
                        <div><strong>Data Plane</strong> -- 각 Pod에 사이드카로 배포된 프록시(Envoy 등)</div>
                        <div><strong>Control Plane</strong> -- Istiod 등이 라우팅 규칙, 인증서, 정책을 관리</div>
                    </div>
                </InfoBox>
                <CardGrid cols={3}>
                    <StatCard title="mTLS" value="자동 암호화" color="purple" desc="서비스 간 상호 TLS 인증" />
                    <StatCard title="트래픽 제어" value="카나리 배포" color="cyan" desc="가중치 기반 분할" />
                    <StatCard title="관측성" value="분산 추적" color="amber" desc="Jaeger, Zipkin 연동" />
                </CardGrid>
                <CodeBlock language="yaml" filename="Istio VirtualService + DestinationRule" code={istioSidecarCode} />
                <InfoBox color="teal" title="Istio vs Linkerd vs Cilium">
                    <ul className="space-y-1 list-disc list-inside">
                        <li><strong>Istio</strong> -- 풍부한 기능, Envoy 기반, 복잡한 구성</li>
                        <li><strong>Linkerd</strong> -- 경량화, Rust 기반 프록시</li>
                        <li><strong>Cilium</strong> -- eBPF 기반, 사이드카 없이 커널 레벨에서 처리</li>
                    </ul>
                </InfoBox>
            </Section>

            {/* ── 15.5 ────────────────────────────────────────────── */}
            <Section id="s155" title="15.5  Zero Trust 네트워크">
                <Prose>
                    전통적인 네트워크 보안은 내부/외부 경계를 기준으로 &quot;내부는 신뢰&quot;하는 모델이었습니다.
                    <T id="zero-trust">Zero Trust</T>는 이 경계를 없애고 &quot;누구도 기본적으로 신뢰하지 않는다&quot;는 원칙에 기반합니다.
                </Prose>
                <InfoTable headers={['항목', '내용']} rows={zeroTrustRows} />
                <InfoBox color="red" title="전통 모델 vs Zero Trust">
                    <div className="space-y-2">
                        <div>
                            <strong>전통 모델 (Castle-and-Moat)</strong>: 방화벽으로 외부를 차단하면 내부는 안전하다고 가정.
                            내부 공격자, 횡적 이동에 취약합니다.
                        </div>
                        <div>
                            <strong>Zero Trust</strong>: 모든 네트워크 세그먼트, 모든 요청에 대해 인증과 권한을 확인.
                            mTLS, SPIFFE/SPIRE, BeyondCorp 등으로 구현합니다.
                        </div>
                    </div>
                </InfoBox>
                <InfoBox color="emerald" title="Zero Trust 구현 요소">
                    <ul className="space-y-1 list-disc list-inside">
                        <li><strong>Identity-Aware Proxy</strong> -- 사용자 ID 기반 접근</li>
                        <li><strong>Micro-segmentation</strong> -- 워크로드 단위 네트워크 세분화</li>
                        <li><strong>mTLS Everywhere</strong> -- 모든 서비스 간 통신 암호화</li>
                        <li><strong>Continuous Verification</strong> -- 세션 중에도 지속적 보안 상태 재검증</li>
                        <li><strong>Least Privilege Access</strong> -- 필요한 최소 권한만 부여</li>
                    </ul>
                </InfoBox>
                <Alert variant="warning" title="Zero Trust는 목표이자 여정">
                    Zero Trust는 단일 제품이 아니라 보안 아키텍처 원칙입니다.
                    mTLS 도입, IAM 강화, 네트워크 세분화 순으로 점진적으로 구현합니다.
                </Alert>
            </Section>

            {/* ── 15.6 ────────────────────────────────────────────── */}
            <Section id="s156" title="15.6  요약">
                <InfoBox color="gray" title="핵심 정리">
                    <ul className="space-y-1 list-disc list-inside">
                        <li><strong>VPN/터널링</strong>은 IPsec(사이트 간), WireGuard(현대적 원격 접속), VXLAN(DC 오버레이)으로 구분됩니다</li>
                        <li><strong>클라우드 네트워크</strong>는 VPC, Subnet, Security Group으로 격리와 접근 제어를 구현합니다</li>
                        <li><strong>컨테이너 네트워크</strong>는 네임스페이스 기반 격리 위에 <T id="cni">CNI</T> 플러그인으로 Pod 간 통신을 구현합니다</li>
                        <li><strong>서비스 메시</strong>는 사이드카 프록시로 mTLS, 트래픽 제어, 관측성을 투명하게 제공합니다</li>
                        <li><strong>Zero Trust</strong>는 네트워크 경계를 없애고, 모든 요청을 인증/검증하는 보안 모델입니다</li>
                    </ul>
                </InfoBox>
            </Section>

            <TopicNavigation topicId="15-cloud-container" />
        </div>
    )
}
