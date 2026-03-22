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

## Sprint 13: UI 공통 컴포넌트 리팩토링 (2026-03-22)

### 완료 항목

- [x] InlineCode 공통 컴포넌트 생성 (`src/components/ui/InlineCode.tsx`) — 반복되는 인라인 코드 스타일링을 컴포넌트로 추출
- [x] CardGrid 공통 컴포넌트 생성 (`src/components/ui/CardGrid.tsx`) — 반복되는 그리드 레이아웃(2열/3열/4열)을 컴포넌트로 추출
- [x] 6개 토픽 페이지에서 InlineCode 패턴 적용 (topic03, 04, 06, 09, 10, 11 — 총 27개소)
- [x] 11개 페이지에서 CardGrid 패턴 적용 (Home, topic01~07, 09, 11, 12 — 총 64개소)
- [x] TypeScript 타입 체크 통과

---

## Sprint 14: 용어 사전 페이지 업그레이드 (2026-03-22)

### 완료 항목

- [x] glossary 데이터에 `GlossaryCategory` 타입, `CATEGORY_LABEL`, `CATEGORY_COLOR` export 추가 (`src/data/glossary.ts`)
- [x] Glossary 페이지 전면 리라이트 — 검색, 카테고리 필터 칩(rounded-full), 한국어 정렬, 카테고리 배지, 토픽 참조 링크, 빈 결과 안내, anchor scroll 지원 (`src/pages/Glossary/index.tsx`)
- [x] GlossaryTooltip에서 로컬 CATEGORY_LABEL/CATEGORY_COLOR 제거, 공유 데이터에서 import (`src/components/ui/GlossaryTooltip.tsx`)
- [x] TypeScript 타입 체크 통과

---

## Sprint 15: 개념 지도 (Graph) 페이지 구현 (2026-03-22)

### 완료 항목

- [x] Graph 페이지 kernel-study 기반 전면 재작성 — oklch 색상, ref 기반 tooltip, 원형 초기 배치, forceX/Y 중심 유지
- [x] 12개 토픽 노드 (원 안 번호 + 원 아래 제목 레이블, oklch 색상)
- [x] 24개 용어 노드 (원 우측 이름 레이블, 카테고리 색상)
- [x] 토픽 간 공유 태그 링크 (실선) + 용어→토픽 참조 링크 (점선)
- [x] 인터랙티브: 드래그, 줌/팬, 클릭 시 페이지 이동, ref 기반 hover tooltip
- [x] 필터 버튼: 토픽/용어 토글, 10개 카테고리 필터 (oklch 색상)
- [x] 하단 범례 + font-family 지정 (Pretendard / JetBrains Mono)
- [x] TypeScript 타입 체크 + 빌드 통과

---

## Sprint 16: Topic 02 콘텐츠 확장 — 장비 상세 및 이중화 (2026-03-22)

### 완료 항목

- [x] Topic 02 index.tsx 대폭 확장 (~400행 → ~700행): 2.4 네트워크 장비 상세, 2.9 이중화 구성 상세
- [x] 2.4 장비 상세: L2 스위치 (MAC 테이블, VLAN, STP/RSTP, 포트 미러링, Storm Control, PoE, 관리형 vs 비관리형)
- [x] 2.4 장비 상세: L3 스위치 (Inter-VLAN routing, ASIC 고속 라우팅, ACL/TCAM, DHCP relay, 라우터와 비교표)
- [x] 2.4 장비 상세: L4/L7 로드밸런서 (DSR, health check, sticky session, 실제 제품: F5 BIG-IP, HAProxy, nginx)
- [x] 2.4 장비 상세: 백본 라우터 (BGP/OSPF, 라인 카드 구조, ISP 피어링, OSPF 설정 예시)
- [x] 2.4 장비 상세: 방화벽 (stateful inspection, DPI, UTM vs NGFW, zone-based policy, VPN 터미네이션, 제품 비교표)
- [x] 2.9 이중화 상세: 물리적 이중화 (이중 전원, 이중 NIC bonding/LACP, 이중 스위치 MC-LAG/vPC)
- [x] 2.9 이중화 상세: 게이트웨이 이중화 (VRRP/HSRP 동작 원리, virtual IP, preempt, priority, Keepalived 설정)
- [x] 2.9 이중화 상세: 링크 이중화 (LACP, bond mode 0/1/2/4 비교표, min-links, Netplan LACP 설정)
- [x] 2.9 이중화 상세: 경로 이중화 (ECMP, BFD sub-second failover)
- [x] 2.9 이중화 상세: 실제 구성 예시 — 사무실 인터넷 접속망 (Dual ISP + VRRP + LACP) ASCII 다이어그램
- [x] 2.9 이중화 상세: 실제 구성 예시 — 서버팜 (Dual ToR + MC-LAG + VRRP + LB HA pair) ASCII 다이어그램
- [x] codeSnippets.ts 확장: keepalived VRRP, LACP bonding, OSPF 기본, 스위치/라우터 확인 명령어, 이중화 구성도 2종
- [x] TypeScript 타입 체크 통과

---

## Topic 08 iproute2 콘텐츠 확장 (2026-03-22)

### 완료 항목

- [x] 기존 8.5 iproute2 섹션을 5개 상세 섹션으로 분리 (8.5 ip addr, 8.6 ip link, 8.7 ip route, 8.8 ip rule, 8.9 ip neigh)
- [x] ip addr: primary/secondary, scope(global/link/host), label, IPv6(link-local/global/temporary), flush 상세 설명
- [x] ip link: 가상 인터페이스 8종(veth/bridge/vlan/bond/macvlan/ipvlan/vxlan/dummy), promiscuous mode, txqueuelen
- [x] ip route: main/local/default 테이블, metric, src 힌트, blackhole/unreachable/prohibit, ECMP, ip route get
- [x] ip rule: RPDB 구조, priority/from/to/fwmark/iif/oif 조건, VPN split tunneling, 다중 ISP 완전 구성 예시
- [x] ip neigh: ARP 캐시 상태(REACHABLE/STALE/FAILED 등), static entry, IPv6 NDP
- [x] 기존 8.6~8.10 → 8.10~8.13으로 번호 재조정
- [x] codeSnippets.ts에 ipAddrDetailCode, ipLinkDetailCode, ipRouteDetailCode, ipRuleDetailCode, ipNeighCode 추가
- [x] LearningCard 항목을 10개로 확장 (iproute2 각 서브커맨드별 학습 목표 추가)
- [x] 요약(8.13) 핵심 정리를 10개 항목으로 확장
- [x] TypeScript 타입 체크 통과

---

## Topic 06 콘텐츠 확장 — DNS, TLS, 네트워크 보안 (2026-03-22)

### 완료 항목

- [x] Topic 06 index.tsx 대폭 확장 (~577행 → ~868행): DNS 서버 상세, TLS 상세, 네트워크 보안 신규 섹션
- [x] 6.1 DNS 서버의 종류와 역할 확장: 권한 NS(Primary/Secondary, Zone Transfer AXFR/IXFR), 재귀 리졸버, 루트 서버(Anycast), Stub Resolver
- [x] 6.1 DNS 서버 소프트웨어: BIND, Unbound, PowerDNS, CoreDNS(K8s), dnsmasq
- [x] 6.1 기업 환경 DNS: Split-Horizon DNS (내부/외부 DNS 분리)
- [x] 6.1 DNS 보안: DNSSEC (Chain of Trust, RRSIG, DNSKEY, DS), DoH, DoT
- [x] 6.1 DNS 캐시 포이즈닝과 방어 (소스 포트 랜덤화, RRL, 0x20 인코딩)
- [x] 6.2 DNS 질의 상세: TTL과 캐시 정책, Negative Caching, DNS Amplification 공격
- [x] 6.4 TLS 상세 확장: TLS 1.2 vs 1.3 비교표, 인증서 체인 (Root/Intermediate/End-entity), DV/OV/EV 인증서
- [x] 6.4 SNI, OCSP Stapling, mTLS (상호 인증), 인증서 Pinning, TLS 종료 위치
- [x] 6.8 네트워크 보안 기초 신규 섹션: 계층별 위협, 공격 유형 6종, 방어 기술 6종
- [x] 6.8 네트워크 세그멘테이션, VPN 보안, 802.1X/NAC, 제로 트러스트 원칙
- [x] 기존 6.8 프록시 → 6.9, 기존 6.9 요약 → 6.10으로 이동
- [x] codeSnippets.ts 확장: BIND Zone 파일, openssl 인증서 체인 검증, mTLS curl, 암호 스위트 확인/해석
- [x] TypeScript 타입 체크 통과

---

## 일관성 검증 및 수정 (2026-03-22)

### 완료 항목

- [x] 12개 토픽 페이지 섹션 ID/번호 일관성 검증 — 모두 순차적, 패턴(`s{NN}{M}`) 준수 확인
- [x] TopicNavigation topicId 일관성 검증 — 12개 전체 정상
- [x] LearningCard topicId 일관성 검증 — 12개 전체 정상
- [x] import 경로 일관성 검증 — 모두 `../../components` 상대경로, 깨진 참조 없음
- [x] App.tsx 라우트 ↔ 파일 경로 일관성 검증 — 12개 토픽 + glossary + graph 전체 일치
- [x] networkTopics.ts prerequisites 검증 — 모든 참조 ID가 유효한 토픽 ID
- [x] networkTopics.ts status: 'draft' → 'complete'로 12개 전체 수정 (PAGES.md와 동기화)
- [x] searchIndex.ts 전체 섹션 인덱스 채움 (빈 배열 → 119개 섹션 엔트리)
- [x] PAGES.md 라우트 테이블 검증 — 12개 토픽 모두 done 상태 확인
- [x] `pnpm tsc --noEmit` 통과 확인

---

## Topic 08 분할: Topic 09 (리눅스 네트워크 스택) + Topic 10 (iproute2) 신규 생성 (2026-03-22)

### 완료 항목

- [x] Topic 08의 커널 이론 섹션(8.1~8.4, 8.11)을 Topic 09 (리눅스 네트워크 스택)으로 분리
- [x] Topic 08의 iproute2 섹션(8.5~8.10, 8.12)을 Topic 10 (iproute2와 리눅스 네트워크 관리)으로 분리
- [x] Topic 09: 6개 섹션 (9.1 스택 개요, 9.2 NIC 드라이버, 9.3 NAPI, 9.4 sk_buff, 9.5 sysctl, 9.6 요약)
- [x] Topic 09: LinuxNetworkStackDiagram, SkbuffDiagram import, sysctl 고급 튜닝 코드 추가
- [x] Topic 10: 10개 섹션 (10.1 ip addr, 10.2 ip link, 10.3 ip route, 10.4 ip rule, 10.5 ip neigh, 10.6 정책 해석 실습, 10.7 tc/qdisc 상세, 10.8 ss, 10.9 네임스페이스, 10.10 요약)
- [x] Topic 10 신규 콘텐츠: ip route show 출력 한 줄씩 해석, ip rule show 각 필드 의미, RPDB 매칭 시뮬레이션
- [x] Topic 10 신규 콘텐츠: fwmark 기반 VPN split-tunnel 시나리오, multi-ISP failover 실전 구성
- [x] Topic 10 신규 콘텐츠: tc/qdisc 상세 (HTB 계층 구조, netem 시뮬레이션, fq_codel 동작, 대역폭 제한, tc mirred 포트 미러링, tc -s qdisc show 출력 읽기)
- [x] IprouteFlowDiagram (기존) import하여 Topic 10.6에서 활용
- [x] App.tsx에 두 신규 토픽 라우트 추가
- [x] networkTopics.ts에 두 신규 토픽 등록
- [x] PAGES.md 라우트 테이블 및 토픽 개요 업데이트
- [x] 기존 Topic 08 (topic08-linux-network) 유지 (삭제/수정 없음)
- [x] TypeScript 타입 체크 통과

---

## 토픽 구조 재편: 번호 변경 + 분리 + Topic 02 확장 (2026-03-22)

### 완료 항목

- [x] Topic 12 (현대 아키텍처) → Topic 14 (로드밸런싱과 글로벌 트래픽 관리) + Topic 15 (클라우드·컨테이너 네트워크와 제로 트러스트) 분리
- [x] Topic 14: 7개 섹션 (14.1 LB 기본, 14.2 L4vsL7, 14.3 리버스프록시/API GW, 14.4 CDN, 14.5 GSLB(신규), 14.6 고가용성, 14.7 요약)
- [x] Topic 14: GSLB 신규 섹션 추가 (DNS 기반 글로벌 LB, health check, geo-routing, failover, Anycast 비교, GslbDiagram import)
- [x] Topic 15: 6개 섹션 (15.1 VPN/터널링, 15.2 클라우드, 15.3 컨테이너/CNI, 15.4 서비스 메시, 15.5 Zero Trust, 15.6 요약)
- [x] Old Topic 07 → New Topic 08 (service-flow): 섹션 ID s07X→s08X, 번호 7.N→8.N
- [x] Old Topic 09 → New Topic 11 (packet-processing): 섹션 ID s09X→s11X, 번호 9.N→11.N
- [x] Old Topic 10 → New Topic 12 (performance): 섹션 ID s10X→s12X, 번호 10.N→12.N, QoS 섹션(12.8) 신규 추가
- [x] Topic 12 QoS 신규: DiffServ/IntServ, DSCP 마킹 (EF/AF/BE), 큐잉 전략 InfoTable (PQ/WFQ/CBWFQ/LLQ), 셰이핑 vs 폴리싱, tc QoS 실전 예제 (HTB+prio), 기업 QoS 정책 사례
- [x] Old Topic 11 → New Topic 13 (troubleshooting): 섹션 ID s11X→s13X, 번호 11.N→13.N
- [x] Topic 02 확장: 기존 2.4 (장비 통합) → 2.4 L2 스위치, 2.5 L3 스위치, 2.6 라우터/백본, 2.7 방화벽, 2.8 L4/L7 LB 분리
- [x] Topic 02: L2 스위치에 STP/RSTP/MSTP, SPAN/RSPAN/ERSPAN, 관리형 vs 비관리형, 제조사 비교 추가
- [x] Topic 02: 기존 2.5~2.10 → 2.9~2.14로 번호 재조정
- [x] 기존 토픽 디렉토리(topic07~topic12)는 수정/삭제하지 않음
- [x] App.tsx에 6개 신규 라우트 추가
- [x] PAGES.md 라우트 테이블 및 토픽 개요 업데이트
- [x] TypeScript 타입 체크 (`pnpm tsc --noEmit`) 통과

---

## 용어 사전 확장: 24 → 55 용어 (2026-03-22)

### 완료 항목

- [x] glossary.ts 기존 24개 용어의 topicRef를 신규 15-토픽 ID 체계로 업데이트 (06-dns, 07-http-tls-security, 08-service-flow, 09-linux-stack, 10-iproute2-admin, 11-packet-processing, 12-performance, 13-troubleshooting, 14-load-balancing, 15-cloud-container)
- [x] network(routing) 카테고리 5개 용어 추가: BGP, OSPF, ECMP, BFD, Anycast
- [x] security 카테고리 8개 용어 추가: IDS, IPS, WAF, DDoS, DNSSEC, OCSP, SNI, Zero Trust
- [x] application 카테고리 6개 용어 추가: GSLB, QUIC, HTTP/3, gRPC, WebSocket, Service Mesh
- [x] design 카테고리 8개 용어 추가: VRRP, HSRP, LACP, MC-LAG, VXLAN, CNI, SPAN, QoS
- [x] linux 카테고리 5개 용어 추가: NAPI, sysctl, Network Namespace, ip rule, tc qdisc
- [x] TypeScript 타입 체크 통과

---

## GlossaryTooltip 적용: Topic 02~15 (2026-03-22)

### 완료 항목

- [x] Topic 02: DMZ, NAT, VRRP, LACP, MC-LAG, VLAN, BGP, OSPF, IPS, WAF, 로드밸런서 (11개 용어)
- [x] Topic 03: MAC 주소, ARP, VLAN, VXLAN, LACP (5개 용어)
- [x] Topic 04: 서브넷, CIDR, 라우팅 테이블, OSPF, BGP (5개 용어)
- [x] Topic 05: TCP, UDP, 3-way Handshake, QUIC (4개 용어)
- [x] Topic 06: DNS, DNSSEC (2개 용어)
- [x] Topic 07: TLS, HTTP/3, SNI, OCSP, IDS, IPS, WAF, DDoS (8개 용어)
- [x] Topic 08: DMZ, NAT, 로드 밸런서 (3개 용어)
- [x] Topic 09: Netfilter, sk_buff, NAPI, sysctl (4개 용어)
- [x] Topic 10: ip rule, tc/qdisc, 네트워크 네임스페이스, vxlan (4개 용어)
- [x] Topic 11: Netfilter, conntrack, NAT (3개 용어)
- [x] Topic 12: tc/qdisc, QoS, XDP, DPDK (4개 용어)
- [x] Topic 13: tcpdump, TCP, DNS, MTU (4개 용어)
- [x] Topic 14: 로드밸런서, CDN, Anycast, GSLB (4개 용어)
- [x] Topic 15: VXLAN, 서비스 메시, Zero Trust, CNI (4개 용어)
- [x] TypeScript 타입 체크 (`pnpm tsc --noEmit`) 통과

---

## 마일스톤

| 마일스톤 | 목표 | 상태 |
|----------|------|------|
| M1 — 프로젝트 셋업 | 기본 구조, 라우팅, placeholder 페이지 | 완료 |
| M2 — 첫 토픽 완성 | Topic 01 콘텐츠 + D3 시각화 | 완료 |
| M3 — 기초 토픽 (01~04) | 입문 난이도 4개 토픽 완성 | 완료 |
| M4 — 중급 토픽 (05~08, 11) | 중급 난이도 5개 토픽 완성 | 완료 |
| M5 — 심화 토픽 (09, 10, 12) | 심화 난이도 3개 토픽 완성 | 완료 |
| M6 — 용어 사전 & 개념 지도 | 보조 페이지 완성 | 완료 |
| M7 — 배포 | GitHub Pages 배포 | 완료 (자동) |
