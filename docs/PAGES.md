# Network Study — 페이지 목록 및 콘텐츠 개요

## 라우트 테이블

| 경로 | 페이지 | 상태 |
|------|--------|------|
| `/` | Home — 전체 토픽 목록 | draft |
| `/topic/01-basics` | Topic 01 — 네트워크의 기초와 전체 구조 | draft |
| `/topic/02-network-design` | Topic 02 — 실제 네트워크 망 구성의 기초 | draft |
| `/topic/03-link-layer` | Topic 03 — 물리 계층과 링크 계층 | draft |
| `/topic/04-ip-routing` | Topic 04 — IP 주소와 라우팅의 기초 | draft |
| `/topic/05-transport` | Topic 05 — 전송 계층: TCP와 UDP | draft |
| `/topic/06-application` | Topic 06 — 이름 해석과 주요 응용 프로토콜 | draft |
| `/topic/07-service-flow` | Topic 07 — 실제 서비스 망 설계와 트래픽 흐름 | draft |
| `/topic/08-linux-network` | Topic 08 — 리눅스에서의 네트워크 동작 | draft |
| `/topic/09-packet-processing` | Topic 09 — 패킷 처리와 방화벽 / NAT / 프록시 | draft |
| `/topic/10-performance` | Topic 10 — 성능과 트래픽 제어 | draft |
| `/topic/11-troubleshooting` | Topic 11 — 네트워크 장애 분석과 관측 | draft |
| `/topic/12-modern-architecture` | Topic 12 — 현대 네트워크와 실전 아키텍처 | draft |
| `/glossary` | 용어 사전 | draft |
| `/graph` | 개념 지도 | draft |

---

## 토픽 개요

### Topic 01 — 네트워크의 기초와 전체 구조
- **부제**: Network Fundamentals & Architecture
- **난이도**: 입문
- **내용**: LAN/WAN, 패킷 교환, 프로토콜, OSI/TCP-IP 모델, 캡슐화, MTU
- **학습 목표**:
  - OSI 7계층과 TCP/IP 모델의 차이를 이해한다
  - 캡슐화/역캡슐화 과정을 시각적으로 파악한다
  - MTU의 의미와 중요성을 설명할 수 있다

### Topic 02 — 실제 네트워크 망 구성의 기초
- **부제**: Real-World Network Design
- **난이도**: 입문
- **선수 지식**: Topic 01
- **내용**: 가정/기업 네트워크, ISP, 라우터/스위치 역할, DMZ, 망 분리, 방화벽 배치
- **학습 목표**:
  - 가정용/기업 네트워크 구조 차이를 설명할 수 있다
  - DMZ와 망 분리 개념을 이해한다
  - 보안장비 배치 위치와 역할을 파악한다

### Topic 03 — 물리 계층과 링크 계층
- **부제**: Physical & Link Layer
- **난이도**: 입문
- **선수 지식**: Topic 01
- **내용**: Ethernet, NIC, MAC 주소, 스위치 동작, ARP, VLAN, 802.1Q
- **학습 목표**:
  - Ethernet 프레임 구조를 이해한다
  - 스위치의 MAC 테이블 동작을 설명할 수 있다
  - VLAN과 802.1Q 태깅의 원리를 파악한다

### Topic 04 — IP 주소와 라우팅의 기초
- **부제**: IP Addressing & Routing
- **난이도**: 입문
- **선수 지식**: Topic 01, Topic 03
- **내용**: IPv4/IPv6, 서브넷, CIDR, 게이트웨이, 라우팅 테이블, longest prefix match
- **학습 목표**:
  - IPv4/IPv6 주소 체계를 이해한다
  - 서브넷팅과 CIDR 표기법을 활용할 수 있다
  - 라우팅 테이블과 longest prefix match를 설명할 수 있다

### Topic 05 — 전송 계층: TCP와 UDP
- **부제**: Transport Layer: TCP & UDP
- **난이도**: 중급
- **선수 지식**: Topic 04
- **내용**: 포트, 소켓, 3-way/4-way handshake, 흐름/혼잡 제어, QUIC
- **학습 목표**:
  - TCP 3-way/4-way handshake 과정을 이해한다
  - 흐름/혼잡 제어 메커니즘을 설명할 수 있다
  - UDP의 특징과 활용 사례를 파악한다

### Topic 06 — 이름 해석과 주요 응용 프로토콜
- **부제**: DNS, HTTP, TLS & Application Protocols
- **난이도**: 중급
- **선수 지식**: Topic 05
- **내용**: DNS, HTTP/HTTPS, TLS handshake, DHCP, SSH, 프록시
- **학습 목표**:
  - DNS 재귀/반복 질의 과정을 이해한다
  - HTTP/HTTPS 차이와 TLS handshake를 설명할 수 있다
  - 프록시와 리버스 프록시의 역할을 파악한다

### Topic 07 — 실제 서비스 망 설계와 트래픽 흐름
- **부제**: Service Network Design & Traffic Flow
- **난이도**: 중급
- **선수 지식**: Topic 02, Topic 06
- **내용**: 클라이언트→서버 경로, DMZ, LB, NAT, East-West/North-South 트래픽
- **학습 목표**:
  - 사용자 요청의 실제 경로를 추적할 수 있다
  - NAT 적용 위치와 동작을 이해한다
  - East-West/North-South 트래픽을 구분할 수 있다

### Topic 08 — 리눅스에서의 네트워크 동작
- **부제**: Linux Network Stack
- **난이도**: 중급
- **선수 지식**: Topic 04, Topic 05
- **내용**: NIC 드라이버, NAPI, sk_buff, iproute2, sysctl, 네트워크 네임스페이스
- **학습 목표**:
  - NIC 드라이버와 NAPI 구조를 이해한다
  - sk_buff 데이터 구조의 역할을 설명할 수 있다
  - iproute2 도구를 활용할 수 있다

### Topic 09 — 패킷 처리와 방화벽 / NAT / 프록시
- **부제**: Packet Processing, Firewall, NAT & Proxy
- **난이도**: 심화
- **선수 지식**: Topic 08
- **내용**: netfilter, iptables/nftables, conntrack, SNAT/DNAT, TPROXY
- **학습 목표**:
  - Netfilter 5개 훅 포인트를 이해한다
  - conntrack과 stateful 방화벽의 동작을 설명할 수 있다
  - TPROXY와 transparent proxy의 원리를 파악한다

### Topic 10 — 성능과 트래픽 제어
- **부제**: Performance & Traffic Control
- **난이도**: 심화
- **선수 지식**: Topic 08
- **내용**: RTT, BDP, NIC offload, RSS/RPS, qdisc, XDP, DPDK
- **학습 목표**:
  - NIC offload 기능의 종류와 효과를 이해한다
  - RSS/RPS로 멀티코어 분산 처리를 설명할 수 있다
  - XDP와 DPDK의 개요와 차이를 파악한다

### Topic 11 — 네트워크 장애 분석과 관측
- **부제**: Network Troubleshooting & Observability
- **난이도**: 중급
- **선수 지식**: Topic 05, Topic 08
- **내용**: ping, traceroute, tcpdump, Wireshark, MTU/PMTU, 장애 분석 절차
- **학습 목표**:
  - tcpdump로 패킷 캡처 및 분석을 수행할 수 있다
  - 장애 원인을 DNS/TCP/TLS 단계별로 구분할 수 있다
  - 체계적 장애 분석 절차를 설명할 수 있다

### Topic 12 — 현대 네트워크와 실전 아키텍처
- **부제**: Modern Network Architecture
- **난이도**: 심화
- **선수 지식**: Topic 07, Topic 09
- **내용**: L4/L7 LB, CDN, VPN, 클라우드 네트워크, 컨테이너 네트워크, 서비스 메시
- **학습 목표**:
  - L4/L7 로드밸런싱의 차이를 이해한다
  - 클라우드/컨테이너 네트워크의 기초를 설명할 수 있다
  - 고가용성 설계 원리를 파악한다
