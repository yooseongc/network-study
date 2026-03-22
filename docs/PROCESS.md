# Network Study — 진행사항

## Sprint 1: 프로젝트 초기 설정 (2026-03-22)

### 완료 항목
- [x] 프로젝트 구조 설정 (React + TypeScript + pnpm)
- [x] 데이터 모델 정의 (`networkTopics`, `glossary`, `searchIndex`)
- [x] 홈 페이지 구현 (`src/pages/Home/index.tsx`)
- [x] 12개 토픽 placeholder 페이지 생성 (`src/pages/topic01-basics` ~ `topic12-modern-architecture`)
- [x] 용어 사전 페이지 구현 (`src/pages/Glossary/index.tsx`)
- [x] 개념 지도 placeholder 페이지 구현 (`src/pages/Graph/index.tsx`)
- [x] favicon 생성 (`public/favicon.svg`)
- [x] docs/PAGES.md 작성 (라우트 테이블 및 12개 토픽 개요)

- [x] UI 공통 컴포넌트 구현 (Section, Prose, InfoTable, InfoBox, StatCard, Alert, LearningCard, TopicNavigation, RfcRef, GlossaryTooltip)
- [x] 라우터 설정 및 레이아웃 구성 (AppLayout, Sidebar, TableOfContents, BackToTop)
- [x] 사이드바 네비게이션 (12개 토픽 + 용어사전 + 개념지도)
- [x] 다크/라이트 모드 지원 (ThemeContext + localStorage)
- [x] 검색 기능 (Cmd+K SearchModal)
- [x] 시각화 공통 컴포넌트 (D3Container, AnimatedDiagram, MermaidDiagram, CodeBlock, WebGLCanvas)
- [x] GitHub Pages 배포 설정 (.github/workflows/deploy.yml)
- [x] TypeScript 타입 체크 + 프로덕션 빌드 통과

- [x] Topic 01 전체 콘텐츠 작성 (`src/pages/topic01-basics/index.tsx`, 10개 섹션)
- [x] Topic 01 코드 스니펫 추출 (`src/pages/topic01-basics/codeSnippets.ts`)
- [x] OSI/TCP-IP 비교 D3 시각화 (`src/components/concepts/basics/OsiTcpIpCompare.tsx`)
- [x] 캡슐화/역캡슐화 애니메이션 다이어그램 (`src/components/concepts/basics/EncapsulationDiagram.tsx`)

---

## Sprint 2: Topic 02 콘텐츠 작성 (2026-03-22)

### 완료 항목
- [x] Topic 02 전체 콘텐츠 작성 (10개 섹션: 가정/기업 네트워크, ISP, 공인/사설 IP, 장비 역할, 3-Tier, 망 분리, DMZ, 보안장비, 이중화, 요약)
- [x] D3 시각화 컴포넌트: HomeVsEnterprise (가정 vs 기업 네트워크 비교 다이어그램)
- [x] D3 시각화 컴포넌트: NetworkTiersDiagram (3-Tier 스위치 계층 구조 다이어그램)
- [x] codeSnippets.ts 작성 (사설 IP 대역, 서브넷 설계, 방화벽 정책, VRRP 설정 예시)
- [x] TypeScript 타입 체크 통과

---

## Sprint 3: Topic 03 콘텐츠 작성 (2026-03-22)

### 완료 항목
- [x] Topic 03 전체 콘텐츠 작성 (10개 섹션: Ethernet 기본 구조, NIC 역할, MAC 주소, 스위치 동작, MAC 테이블, ARP 동작, 유니/브로드/멀티캐스트, VLAN과 802.1Q, NIC Bonding/LACP, 요약)
- [x] D3 시각화 컴포넌트: EthernetFrameDiagram (Ethernet 프레임 구조 색상 코딩 다이어그램)
- [x] 애니메이션 시각화 컴포넌트: ArpFlowDiagram (ARP Request/Reply 4단계 애니메이션)
- [x] codeSnippets.ts 작성 (ip link show, arp -n, bridge fdb show, ethtool, VLAN 설정, bonding 설정, MAC 주소 관리, Gratuitous ARP)
- [x] TypeScript 타입 체크 통과

---

## Sprint 4: Topic 04 콘텐츠 작성 (2026-03-22)

### 완료 항목
- [x] Topic 04 전체 콘텐츠 작성 (11개 섹션: IPv4 주소 구조, 서브넷 마스크/CIDR, 네트워크/브로드캐스트 주소, 기본 게이트웨이, 라우터 역할, 라우팅 테이블, Longest Prefix Match, 정적/동적 라우팅, TTL/hop, IPv6 기초, 요약)
- [x] D3 시각화 컴포넌트: SubnetDiagram (IPv4 주소의 네트워크/호스트 부분 비트 단위 표시)
- [x] D3 시각화 컴포넌트: RoutingTableViz (Longest Prefix Match 단계별 애니메이션)
- [x] codeSnippets.ts 작성 (ip addr show, ip route show, traceroute, 서브넷 계산, IPv6 예제)
- [x] TypeScript 타입 체크 통과

---

## Sprint 5: Topic 06 콘텐츠 작성 (2026-03-22)

### 완료 항목
- [x] Topic 06 전체 콘텐츠 작성 (9개 섹션: DNS 역할과 동작, DNS 질의 과정, HTTP 기본 구조, HTTPS와 TLS, DHCP, SSH와 원격 접속, 기타 응용 프로토콜, 프록시와 리버스 프록시, 요약)
- [x] 애니메이션 시각화 컴포넌트: DnsResolutionDiagram (DNS 재귀/반복 질의 6단계 애니메이션)
- [x] D3 시각화 컴포넌트: TlsHandshakeDiagram (TLS 1.3 handshake 단계별 타임라인)
- [x] codeSnippets.ts 작성 (dig, nslookup, curl, openssl s_client, dhclient, ssh 예제)
- [x] TypeScript 타입 체크 통과

---

## Sprint 6: Topic 07 콘텐츠 작성 (2026-03-22)

### 완료 항목
- [x] Topic 07 전체 콘텐츠 작성 (10개 섹션: 사용자 요청 전체 경로, 사내 인터넷 접속망, 서버 인프라 3-Tier 분리, DMZ와 공개 서비스망, East-West vs North-South 트래픽, NAT 적용 위치, 프록시 기반 트래픽 흐름, 보안장비 삽입 구조, 고가용성 설계 기초, 요약)
- [x] D3 시각화 컴포넌트: TrafficFlowDiagram (End-to-End 요청 경로 단계별 애니메이션)
- [x] D3 시각화 컴포넌트: EastWestNorthSouth (데이터센터 트래픽 패턴 시각화, N-S/E-W 토글)
- [x] codeSnippets.ts 작성 (iptables NAT 규칙, nginx reverse proxy, HAProxy 로드밸런서, Keepalived VRRP 설정)
- [x] TypeScript 타입 체크 통과

---

## Sprint 7: Topic 05 콘텐츠 작성 (2026-03-22)

### 완료 항목
- [x] Topic 05 전체 콘텐츠 작성 (11개 섹션: 포트 번호와 소켓, TCP vs UDP 비교, TCP 3-way Handshake, TCP 4-way Handshake, 시퀀스 번호와 ACK, 흐름 제어, 혼잡 제어, 재전송과 타이머, UDP 특징과 활용, QUIC 프로토콜, 요약)
- [x] 애니메이션 시각화 컴포넌트: TcpHandshakeDiagram (SYN→SYN+ACK→ACK 4단계 애니메이션)
- [x] D3 시각화 컴포넌트: CongestionControlViz (Slow Start→Congestion Avoidance→Loss→Fast Recovery cwnd 그래프)
- [x] codeSnippets.ts 작성 (ss -tnp, netstat, tcpdump handshake, Python TCP 소켓, TCP 커널 튜닝 예제)
- [x] 인라인 SVG 다이어그램: TCP 4-way Handshake, 시퀀스 번호/ACK 흐름, 슬라이딩 윈도우 시각화
- [x] TypeScript 타입 체크 대기

---

## Sprint 8: Topic 08 콘텐츠 작성 (2026-03-22)

### 완료 항목
- [x] Topic 08 전체 콘텐츠 작성 (10개 섹션: 네트워크 스택 개요, NIC 드라이버와 인터럽트, NAPI와 패킷 수신, sk_buff 구조, iproute2 도구, ss와 소켓 상태, 라우팅 테이블과 Policy Routing, sysctl 파라미터, 네트워크 네임스페이스와 veth, 요약)
- [x] D3 시각화 컴포넌트: LinuxNetworkStackDiagram (Linux 네트워크 스택 계층 구조 다이어그램)
- [x] D3 시각화 컴포넌트: SkbuffDiagram (sk_buff head/data/tail/end 포인터 구조 다이어그램)
- [x] codeSnippets.ts 작성 (ip addr, ip link, ip route, ip rule, ss, ethtool, sysctl, ip netns, tcpdump, sk_buff ASCII)
- [x] TypeScript 타입 체크 통과

---

## Sprint 9: Topic 09 콘텐츠 작성 (2026-03-22)

### 완료 항목
- [x] Topic 09 전체 콘텐츠 작성 (9개 섹션: Netfilter 구조, iptables와 nftables, conntrack과 stateful 방화벽, SNAT/DNAT/MASQUERADE, 포트 포워딩, mark/fwmark과 policy routing, TPROXY와 transparent proxy, inline vs out-of-path 장비, 요약)
- [x] D3 시각화 컴포넌트: NetfilterHooksDiagram (5개 훅 포인트 + 라우팅 결정 흐름 다이어그램)
- [x] codeSnippets.ts 작성 (iptables 규칙, nftables 설정, conntrack 명령, SNAT/DNAT, 포트 포워딩, fwmark, TPROXY 예제)
- [x] TypeScript 타입 체크 통과

---

## Sprint 10: Topic 10 콘텐츠 작성 (2026-03-22)

### 완료 항목
- [x] Topic 10 전체 콘텐츠 작성 (9개 섹션: 네트워크 성능 지표, RTT와 throughput/BDP, 병목 지점 분석, NIC offload, 멀티코어 패킷 분산 RSS/RPS/RFS/XPS, IRQ affinity, qdisc와 tc, 고성능 패킷 처리 XDP/AF_PACKET/DPDK, 요약)
- [x] D3 시각화 컴포넌트: RssRpsDiagram (RSS vs RPS 토글 비교 다이어그램, NIC 큐→CPU 매핑 시각화)
- [x] codeSnippets.ts 작성 (ethtool -k/-S, tc qdisc/netem, /proc/interrupts, RSS/RPS 설정, iperf3, busy polling, XDP 프로그램 예제)
- [x] TypeScript 타입 체크 통과

---

## Sprint 11: Topic 12 콘텐츠 작성 (2026-03-22)

### 완료 항목
- [x] Topic 12 전체 콘텐츠 작성 (11개 섹션: 로드밸런서 기본 구조, L4 vs L7 로드밸런싱, 리버스 프록시와 API 게이트웨이, CDN의 원리, VPN과 터널링, 클라우드 네트워킹, 컨테이너 네트워크, 서비스 메시, Zero Trust 네트워크, 고가용성 설계, 요약)
- [x] D3 시각화 컴포넌트: L4vsL7Diagram (L4 vs L7 로드밸런서 아키텍처 비교 다이어그램)
- [x] codeSnippets.ts 작성 (nginx LB/리버스 프록시, WireGuard, Docker 네트워크, kubectl/NetworkPolicy, HAProxy 헬스체크, Istio VirtualService/DestinationRule)
- [x] TypeScript 타입 체크 통과

---

## Sprint 12: Topic 11 콘텐츠 작성 (2026-03-22)

### 완료 항목
- [x] Topic 11 전체 콘텐츠 작성 (10개 섹션: 장애 분석 기본 절차, ping과 ICMP, traceroute와 mtr, tcpdump 기초, TCP 플래그 읽기, DNS 장애 분석, TCP 연결 장애 분석, MTU/PMTU 문제, 체계적 장애 분석 절차, 요약)
- [x] D3 시각화 컴포넌트: TroubleshootFlowDiagram (체계적 장애 분석 단계별 애니메이션 플로차트)
- [x] codeSnippets.ts 작성 (ping, traceroute, mtr, tcpdump 필터/플래그, dig/nslookup, ss TCP 디버깅, MTU/PMTU 진단, 통합 진단 절차, dmesg 커널 로그)
- [x] TypeScript 타입 체크 통과

---

## 마일스톤

| 마일스톤 | 목표 | 상태 |
|----------|------|------|
| M1 — 프로젝트 셋업 | 기본 구조, 라우팅, placeholder 페이지 | 완료 |
| M2 — 첫 토픽 완성 | Topic 01 콘텐츠 + D3 시각화 | 완료 |
| M3 — 기초 토픽 (01~04) | 입문 난이도 4개 토픽 완성 | 완료 |
| M4 — 중급 토픽 (05~08, 11) | 중급 난이도 5개 토픽 완성 | 완료 |
| M5 — 심화 토픽 (09, 10, 12) | 심화 난이도 3개 토픽 완성 | 완료 |
| M6 — 용어 사전 & 개념 지도 | 보조 페이지 완성 | 예정 |
| M7 — 배포 | GitHub Pages 배포 | 예정 |
