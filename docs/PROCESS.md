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

### 예정
- [ ] Topic 01 콘텐츠 작성 및 인터랙티브 시각화

---

## 마일스톤

| 마일스톤 | 목표 | 상태 |
|----------|------|------|
| M1 — 프로젝트 셋업 | 기본 구조, 라우팅, placeholder 페이지 | 완료 |
| M2 — 첫 토픽 완성 | Topic 01 콘텐츠 + D3 시각화 | 예정 |
| M3 — 기초 토픽 (01~04) | 입문 난이도 4개 토픽 완성 | 예정 |
| M4 — 중급 토픽 (05~08, 11) | 중급 난이도 5개 토픽 완성 | 예정 |
| M5 — 심화 토픽 (09, 10, 12) | 심화 난이도 3개 토픽 완성 | 예정 |
| M6 — 용어 사전 & 개념 지도 | 보조 페이지 완성 | 예정 |
| M7 — 배포 | GitHub Pages 배포 | 예정 |
