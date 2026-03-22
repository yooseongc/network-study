# network-study

네트워크의 핵심 동작을 인터랙티브 시각화로 배우는 학습 사이트입니다.
D3, Three.js, Mermaid, drawio 기반 다이어그램을 활용합니다.

**라이브 사이트:** https://yooseongc.github.io/network-study/

---

## 기술 스택

| 구분 | 사용 기술 |
|------|----------|
| 프레임워크 | React 19 + TypeScript |
| 번들러 | Vite 8 |
| 스타일링 | Tailwind CSS v4 |
| 라우팅 | React Router 7 (HashRouter) |
| 시각화 | D3 v7, Three.js 0.183, Mermaid 11 |
| 코드 하이라이팅 | react-syntax-highlighter |
| 배포 | GitHub Pages (GitHub Actions) |

---

## 로컬 개발

```bash
pnpm install
pnpm dev       # 개발 서버 (http://localhost:5173)
pnpm build     # 프로덕션 빌드
pnpm preview   # 빌드 결과 미리보기
pnpm lint      # ESLint 검사
```

---

## 프로젝트 구조

```
src/
├── pages/
│   ├── Home/                    # 홈 화면
│   ├── Glossary/                # 용어사전
│   └── topicXX-*/index.tsx      # 12개 토픽 페이지
├── components/
│   ├── layout/                  # AppLayout, Sidebar, TOC, BackToTop
│   ├── ui/                      # Section, Prose, InfoTable, GlossaryTooltip
│   └── viz/                     # D3Container, AnimatedDiagram, MermaidDiagram, CodeBlock
├── data/
│   ├── networkTopics.ts         # 토픽 메타데이터
│   └── glossary.ts              # 용어사전 데이터
├── contexts/ThemeContext.tsx    # 다크/라이트 모드
├── hooks/                       # useD3, useThree, useAnimationStep
└── lib/colors.ts                # oklch 색상 팔레트
docs/
├── PAGES.md                     # 토픽별 콘텐츠 개요
├── PROCESS.md                   # 스프린트 진행 로그
└── STYLE.md                     # 코딩 컨벤션
```

---

## 토픽 목록

| # | 토픽 | 주요 내용 |
|---|------|----------|
| 01 | 네트워크의 기초와 전체 구조 | OSI 7계층, TCP/IP 모델, 캡슐화, MTU |
| 02 | 실제 네트워크 망 구성의 기초 | LAN/WAN, ISP, DMZ, 이중화 구성 |
| 03 | 물리 계층과 링크 계층 | Ethernet, MAC, 스위치, VLAN, ARP |
| 04 | IP 주소와 라우팅의 기초 | IPv4/IPv6, 서브넷, 라우팅 테이블, longest prefix match |
| 05 | 전송 계층: TCP와 UDP | 3-way handshake, 흐름/혼잡 제어, QUIC |
| 06 | 이름 해석과 주요 응용 프로토콜 | DNS, HTTP/HTTPS, TLS, DHCP, SSH |
| 07 | 실제 서비스 망 설계와 트래픽 흐름 | DMZ, NAT, East-West/North-South 트래픽 |
| 08 | 리눅스에서의 네트워크 동작 | sk_buff, NAPI, iproute2, 네트워크 네임스페이스 |
| 09 | 패킷 처리와 방화벽 / NAT / 프록시 | netfilter, conntrack, iptables, TPROXY |
| 10 | 성능과 트래픽 제어 | RSS/RPS, NIC offload, XDP, tc/qdisc |
| 11 | 네트워크 장애 분석과 관측 | tcpdump, Wireshark, mtr, 장애 분석 절차 |
| 12 | 현대 네트워크와 실전 아키텍처 | 로드밸런서, CDN, VPN, 컨테이너 네트워크, 서비스 메시 |

---

## 배포

`main` 브랜치에 push하면 GitHub Actions가 자동으로 빌드 후 `gh-pages` 브랜치에 배포합니다.

`vite.config.ts`의 `base: '/network-study/'` 설정으로 GitHub Pages 서브패스에서 동작합니다.

---

## 문서

- [`docs/PAGES.md`](docs/PAGES.md) — 토픽별 콘텐츠 목차와 섹션 개요
- [`docs/PROCESS.md`](docs/PROCESS.md) — 스프린트별 작업 로그
- [`docs/STYLE.md`](docs/STYLE.md) — D3 시각화, Mermaid 사용 규칙, 다크모드 규칙
- [`CLAUDE.md`](CLAUDE.md) — AI 협업 규칙 및 프로젝트 가이드
