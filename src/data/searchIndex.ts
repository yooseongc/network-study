export interface SectionEntry {
    topicId: string
    sectionId: string
    title: string
    route: string
}

export const sectionIndex: SectionEntry[] = [
    // Topic 01 — 네트워크의 기초와 전체 구조
    { topicId: '01-basics', sectionId: 's011', title: '1.1  네트워크란 무엇인가', route: '/topic/01-basics#s011' },
    { topicId: '01-basics', sectionId: 's012', title: '1.2  LAN, WAN, Internet', route: '/topic/01-basics#s012' },
    { topicId: '01-basics', sectionId: 's013', title: '1.3  패킷 교환 방식', route: '/topic/01-basics#s013' },
    { topicId: '01-basics', sectionId: 's014', title: '1.4  프로토콜의 의미와 역할', route: '/topic/01-basics#s014' },
    { topicId: '01-basics', sectionId: 's015', title: '1.5  계층형 설계의 필요성', route: '/topic/01-basics#s015' },
    { topicId: '01-basics', sectionId: 's016', title: '1.6  OSI 7계층과 TCP/IP 모델 비교', route: '/topic/01-basics#s016' },
    { topicId: '01-basics', sectionId: 's017', title: '1.7  캡슐화와 역캡슐화', route: '/topic/01-basics#s017' },
    { topicId: '01-basics', sectionId: 's018', title: '1.8  프레임, 패킷, 세그먼트', route: '/topic/01-basics#s018' },
    { topicId: '01-basics', sectionId: 's019', title: '1.9  MTU의 의미', route: '/topic/01-basics#s019' },
    { topicId: '01-basics', sectionId: 's0110', title: '1.10  요약', route: '/topic/01-basics#s0110' },

    // Topic 02 — 실제 네트워크 망 구성의 기초
    { topicId: '02-network-design', sectionId: 's021', title: '2.1  가정용 네트워크 vs 기업 네트워크', route: '/topic/02-network-design#s021' },
    { topicId: '02-network-design', sectionId: 's022', title: '2.2  인터넷 회선과 ISP', route: '/topic/02-network-design#s022' },
    { topicId: '02-network-design', sectionId: 's023', title: '2.3  공인 IP와 사설 IP', route: '/topic/02-network-design#s023' },
    { topicId: '02-network-design', sectionId: 's024', title: '2.4  네트워크 장비 상세', route: '/topic/02-network-design#s024' },
    { topicId: '02-network-design', sectionId: 's025', title: '2.5  스위치 계층 구조 (3-Tier Architecture)', route: '/topic/02-network-design#s025' },
    { topicId: '02-network-design', sectionId: 's026', title: '2.6  망 분리의 원칙', route: '/topic/02-network-design#s026' },
    { topicId: '02-network-design', sectionId: 's027', title: '2.7  DMZ의 개념과 목적', route: '/topic/02-network-design#s027' },
    { topicId: '02-network-design', sectionId: 's028', title: '2.8  보안장비 배치', route: '/topic/02-network-design#s028' },
    { topicId: '02-network-design', sectionId: 's029', title: '2.9  이중화 구성 상세', route: '/topic/02-network-design#s029' },
    { topicId: '02-network-design', sectionId: 's0210', title: '2.10  요약', route: '/topic/02-network-design#s0210' },

    // Topic 03 — 물리 계층과 링크 계층
    { topicId: '03-link-layer', sectionId: 's031', title: '3.1  Ethernet의 기본 구조', route: '/topic/03-link-layer#s031' },
    { topicId: '03-link-layer', sectionId: 's032', title: '3.2  NIC(Network Interface Card)의 역할', route: '/topic/03-link-layer#s032' },
    { topicId: '03-link-layer', sectionId: 's033', title: '3.3  MAC 주소의 의미', route: '/topic/03-link-layer#s033' },
    { topicId: '03-link-layer', sectionId: 's034', title: '3.4  스위치의 동작 원리', route: '/topic/03-link-layer#s034' },
    { topicId: '03-link-layer', sectionId: 's035', title: '3.5  MAC 주소 테이블', route: '/topic/03-link-layer#s035' },
    { topicId: '03-link-layer', sectionId: 's036', title: '3.6  ARP 동작 과정', route: '/topic/03-link-layer#s036' },
    { topicId: '03-link-layer', sectionId: 's037', title: '3.7  유니캐스트, 브로드캐스트, 멀티캐스트', route: '/topic/03-link-layer#s037' },
    { topicId: '03-link-layer', sectionId: 's038', title: '3.8  VLAN과 802.1Q', route: '/topic/03-link-layer#s038' },
    { topicId: '03-link-layer', sectionId: 's039', title: '3.9  NIC Bonding과 LACP', route: '/topic/03-link-layer#s039' },
    { topicId: '03-link-layer', sectionId: 's0310', title: '3.10  요약', route: '/topic/03-link-layer#s0310' },

    // Topic 04 — IP 주소와 라우팅의 기초
    { topicId: '04-ip-routing', sectionId: 's041', title: '4.1  IPv4 주소 구조', route: '/topic/04-ip-routing#s041' },
    { topicId: '04-ip-routing', sectionId: 's042', title: '4.2  서브넷 마스크와 CIDR', route: '/topic/04-ip-routing#s042' },
    { topicId: '04-ip-routing', sectionId: 's043', title: '4.3  네트워크 주소와 브로드캐스트 주소', route: '/topic/04-ip-routing#s043' },
    { topicId: '04-ip-routing', sectionId: 's044', title: '4.4  기본 게이트웨이', route: '/topic/04-ip-routing#s044' },
    { topicId: '04-ip-routing', sectionId: 's045', title: '4.5  라우터의 역할', route: '/topic/04-ip-routing#s045' },
    { topicId: '04-ip-routing', sectionId: 's046', title: '4.6  라우팅 테이블', route: '/topic/04-ip-routing#s046' },
    { topicId: '04-ip-routing', sectionId: 's047', title: '4.7  Longest Prefix Match', route: '/topic/04-ip-routing#s047' },
    { topicId: '04-ip-routing', sectionId: 's048', title: '4.8  정적 라우팅과 동적 라우팅', route: '/topic/04-ip-routing#s048' },
    { topicId: '04-ip-routing', sectionId: 's049', title: '4.9  TTL과 hop', route: '/topic/04-ip-routing#s049' },
    { topicId: '04-ip-routing', sectionId: 's0410', title: '4.10  IPv6 기초', route: '/topic/04-ip-routing#s0410' },
    { topicId: '04-ip-routing', sectionId: 's0411', title: '4.11  요약', route: '/topic/04-ip-routing#s0411' },

    // Topic 05 — 전송 계층: TCP와 UDP
    { topicId: '05-transport', sectionId: 's051', title: '5.1  포트 번호와 소켓', route: '/topic/05-transport#s051' },
    { topicId: '05-transport', sectionId: 's052', title: '5.2  TCP vs UDP 비교', route: '/topic/05-transport#s052' },
    { topicId: '05-transport', sectionId: 's053', title: '5.3  TCP 3-way Handshake', route: '/topic/05-transport#s053' },
    { topicId: '05-transport', sectionId: 's054', title: '5.4  TCP 4-way Handshake (연결 종료)', route: '/topic/05-transport#s054' },
    { topicId: '05-transport', sectionId: 's055', title: '5.5  시퀀스 번호와 ACK', route: '/topic/05-transport#s055' },
    { topicId: '05-transport', sectionId: 's056', title: '5.6  흐름 제어 (Flow Control)', route: '/topic/05-transport#s056' },
    { topicId: '05-transport', sectionId: 's057', title: '5.7  혼잡 제어 (Congestion Control)', route: '/topic/05-transport#s057' },
    { topicId: '05-transport', sectionId: 's058', title: '5.8  재전송과 타이머', route: '/topic/05-transport#s058' },
    { topicId: '05-transport', sectionId: 's059', title: '5.9  UDP의 특징과 활용', route: '/topic/05-transport#s059' },
    { topicId: '05-transport', sectionId: 's0510', title: '5.10  QUIC 프로토콜', route: '/topic/05-transport#s0510' },
    { topicId: '05-transport', sectionId: 's0511', title: '5.11  요약', route: '/topic/05-transport#s0511' },

    // Topic 06 — 이름 해석과 주요 응용 프로토콜
    { topicId: '06-application', sectionId: 's061', title: '6.1  DNS 서버의 종류와 역할', route: '/topic/06-application#s061' },
    { topicId: '06-application', sectionId: 's062', title: '6.2  DNS 질의 과정', route: '/topic/06-application#s062' },
    { topicId: '06-application', sectionId: 's063', title: '6.3  HTTP 기본 구조', route: '/topic/06-application#s063' },
    { topicId: '06-application', sectionId: 's064', title: '6.4  HTTPS와 TLS 상세', route: '/topic/06-application#s064' },
    { topicId: '06-application', sectionId: 's065', title: '6.5  DHCP', route: '/topic/06-application#s065' },
    { topicId: '06-application', sectionId: 's066', title: '6.6  SSH와 원격 접속', route: '/topic/06-application#s066' },
    { topicId: '06-application', sectionId: 's067', title: '6.7  기타 응용 프로토콜', route: '/topic/06-application#s067' },
    { topicId: '06-application', sectionId: 's068', title: '6.8  네트워크 보안 기초', route: '/topic/06-application#s068' },
    { topicId: '06-application', sectionId: 's069', title: '6.9  프록시와 리버스 프록시', route: '/topic/06-application#s069' },
    { topicId: '06-application', sectionId: 's0610', title: '6.10  요약', route: '/topic/06-application#s0610' },

    // Topic 07 — 실제 서비스 망 설계와 트래픽 흐름
    { topicId: '07-service-flow', sectionId: 's071', title: '7.1  사용자 요청의 전체 경로', route: '/topic/07-service-flow#s071' },
    { topicId: '07-service-flow', sectionId: 's072', title: '7.2  사내 인터넷 접속망 구조', route: '/topic/07-service-flow#s072' },
    { topicId: '07-service-flow', sectionId: 's073', title: '7.3  서버 인프라 분리 (Web / WAS / DB 3-Tier)', route: '/topic/07-service-flow#s073' },
    { topicId: '07-service-flow', sectionId: 's074', title: '7.4  DMZ와 공개 서비스망', route: '/topic/07-service-flow#s074' },
    { topicId: '07-service-flow', sectionId: 's075', title: '7.5  East-West vs North-South 트래픽', route: '/topic/07-service-flow#s075' },
    { topicId: '07-service-flow', sectionId: 's076', title: '7.6  NAT 적용 위치와 동작', route: '/topic/07-service-flow#s076' },
    { topicId: '07-service-flow', sectionId: 's077', title: '7.7  프록시 기반 트래픽 흐름', route: '/topic/07-service-flow#s077' },
    { topicId: '07-service-flow', sectionId: 's078', title: '7.8  보안장비 삽입 구조 (Inline vs Out-of-Path)', route: '/topic/07-service-flow#s078' },
    { topicId: '07-service-flow', sectionId: 's079', title: '7.9  고가용성 설계 기초', route: '/topic/07-service-flow#s079' },
    { topicId: '07-service-flow', sectionId: 's0710', title: '7.10  요약', route: '/topic/07-service-flow#s0710' },

    // Topic 08 — 리눅스에서의 네트워크 동작
    { topicId: '08-linux-network', sectionId: 's081', title: '8.1  리눅스 네트워크 스택 개요', route: '/topic/08-linux-network#s081' },
    { topicId: '08-linux-network', sectionId: 's082', title: '8.2  NIC 드라이버와 인터럽트', route: '/topic/08-linux-network#s082' },
    { topicId: '08-linux-network', sectionId: 's083', title: '8.3  NAPI와 패킷 수신 경로', route: '/topic/08-linux-network#s083' },
    { topicId: '08-linux-network', sectionId: 's084', title: '8.4  sk_buff 구조', route: '/topic/08-linux-network#s084' },
    { topicId: '08-linux-network', sectionId: 's085', title: '8.5  ip addr — 주소 관리 상세', route: '/topic/08-linux-network#s085' },
    { topicId: '08-linux-network', sectionId: 's086', title: '8.6  ip link — 인터페이스 관리 상세', route: '/topic/08-linux-network#s086' },
    { topicId: '08-linux-network', sectionId: 's087', title: '8.7  ip route — 라우팅 테이블 상세', route: '/topic/08-linux-network#s087' },
    { topicId: '08-linux-network', sectionId: 's088', title: '8.8  ip rule — 정책 라우팅 상세', route: '/topic/08-linux-network#s088' },
    { topicId: '08-linux-network', sectionId: 's089', title: '8.9  ip neigh — ARP/NDP 관리', route: '/topic/08-linux-network#s089' },
    { topicId: '08-linux-network', sectionId: 's0810', title: '8.10  ss와 소켓 상태 관찰', route: '/topic/08-linux-network#s0810' },
    { topicId: '08-linux-network', sectionId: 's0811', title: '8.11  sysctl 네트워크 파라미터', route: '/topic/08-linux-network#s0811' },
    { topicId: '08-linux-network', sectionId: 's0812', title: '8.12  네트워크 네임스페이스와 veth', route: '/topic/08-linux-network#s0812' },
    { topicId: '08-linux-network', sectionId: 's0813', title: '8.13  요약', route: '/topic/08-linux-network#s0813' },

    // Topic 09 — 패킷 처리와 방화벽 / NAT / 프록시
    { topicId: '09-packet-processing', sectionId: 's091', title: '9.1  Netfilter 구조', route: '/topic/09-packet-processing#s091' },
    { topicId: '09-packet-processing', sectionId: 's092', title: '9.2  iptables와 nftables', route: '/topic/09-packet-processing#s092' },
    { topicId: '09-packet-processing', sectionId: 's093', title: '9.3  conntrack과 stateful 방화벽', route: '/topic/09-packet-processing#s093' },
    { topicId: '09-packet-processing', sectionId: 's094', title: '9.4  SNAT / DNAT / MASQUERADE', route: '/topic/09-packet-processing#s094' },
    { topicId: '09-packet-processing', sectionId: 's095', title: '9.5  포트 포워딩', route: '/topic/09-packet-processing#s095' },
    { topicId: '09-packet-processing', sectionId: 's096', title: '9.6  mark / fwmark과 policy routing', route: '/topic/09-packet-processing#s096' },
    { topicId: '09-packet-processing', sectionId: 's097', title: '9.7  TPROXY와 transparent proxy', route: '/topic/09-packet-processing#s097' },
    { topicId: '09-packet-processing', sectionId: 's098', title: '9.8  inline vs out-of-path 장비', route: '/topic/09-packet-processing#s098' },
    { topicId: '09-packet-processing', sectionId: 's099', title: '9.9  요약', route: '/topic/09-packet-processing#s099' },

    // Topic 10 — 성능과 트래픽 제어
    { topicId: '10-performance', sectionId: 's101', title: '10.1  네트워크 성능 지표', route: '/topic/10-performance#s101' },
    { topicId: '10-performance', sectionId: 's102', title: '10.2  RTT와 throughput, BDP', route: '/topic/10-performance#s102' },
    { topicId: '10-performance', sectionId: 's103', title: '10.3  병목 지점 분석', route: '/topic/10-performance#s103' },
    { topicId: '10-performance', sectionId: 's104', title: '10.4  NIC offload 기능', route: '/topic/10-performance#s104' },
    { topicId: '10-performance', sectionId: 's105', title: '10.5  멀티코어 패킷 분산 (RSS/RPS/RFS/XPS)', route: '/topic/10-performance#s105' },
    { topicId: '10-performance', sectionId: 's106', title: '10.6  IRQ affinity와 CPU locality', route: '/topic/10-performance#s106' },
    { topicId: '10-performance', sectionId: 's107', title: '10.7  qdisc와 tc', route: '/topic/10-performance#s107' },
    { topicId: '10-performance', sectionId: 's108', title: '10.8  고성능 패킷 처리 (XDP, AF_PACKET, DPDK)', route: '/topic/10-performance#s108' },
    { topicId: '10-performance', sectionId: 's109', title: '10.9  요약', route: '/topic/10-performance#s109' },

    // Topic 11 — 네트워크 장애 분석과 관측
    { topicId: '11-troubleshooting', sectionId: 's111', title: '11.1  장애 분석 기본 절차', route: '/topic/11-troubleshooting#s111' },
    { topicId: '11-troubleshooting', sectionId: 's112', title: '11.2  ping과 ICMP', route: '/topic/11-troubleshooting#s112' },
    { topicId: '11-troubleshooting', sectionId: 's113', title: '11.3  traceroute와 mtr', route: '/topic/11-troubleshooting#s113' },
    { topicId: '11-troubleshooting', sectionId: 's114', title: '11.4  tcpdump 기초', route: '/topic/11-troubleshooting#s114' },
    { topicId: '11-troubleshooting', sectionId: 's115', title: '11.5  TCP 플래그 읽기', route: '/topic/11-troubleshooting#s115' },
    { topicId: '11-troubleshooting', sectionId: 's116', title: '11.6  DNS 장애 분석', route: '/topic/11-troubleshooting#s116' },
    { topicId: '11-troubleshooting', sectionId: 's117', title: '11.7  TCP 연결 장애 분석', route: '/topic/11-troubleshooting#s117' },
    { topicId: '11-troubleshooting', sectionId: 's118', title: '11.8  MTU / PMTU 문제', route: '/topic/11-troubleshooting#s118' },
    { topicId: '11-troubleshooting', sectionId: 's119', title: '11.9  체계적 장애 분석 절차', route: '/topic/11-troubleshooting#s119' },
    { topicId: '11-troubleshooting', sectionId: 's1110', title: '11.10  요약', route: '/topic/11-troubleshooting#s1110' },

    // Topic 12 — 현대 네트워크와 실전 아키텍처
    { topicId: '12-modern-architecture', sectionId: 's121', title: '12.1  로드밸런서 기본 구조', route: '/topic/12-modern-architecture#s121' },
    { topicId: '12-modern-architecture', sectionId: 's122', title: '12.2  L4 vs L7 로드밸런싱', route: '/topic/12-modern-architecture#s122' },
    { topicId: '12-modern-architecture', sectionId: 's123', title: '12.3  리버스 프록시와 API 게이트웨이', route: '/topic/12-modern-architecture#s123' },
    { topicId: '12-modern-architecture', sectionId: 's124', title: '12.4  CDN의 원리', route: '/topic/12-modern-architecture#s124' },
    { topicId: '12-modern-architecture', sectionId: 's125', title: '12.5  VPN과 터널링', route: '/topic/12-modern-architecture#s125' },
    { topicId: '12-modern-architecture', sectionId: 's126', title: '12.6  클라우드 네트워킹', route: '/topic/12-modern-architecture#s126' },
    { topicId: '12-modern-architecture', sectionId: 's127', title: '12.7  컨테이너 네트워크', route: '/topic/12-modern-architecture#s127' },
    { topicId: '12-modern-architecture', sectionId: 's128', title: '12.8  서비스 메시', route: '/topic/12-modern-architecture#s128' },
    { topicId: '12-modern-architecture', sectionId: 's129', title: '12.9  Zero Trust 네트워크', route: '/topic/12-modern-architecture#s129' },
    { topicId: '12-modern-architecture', sectionId: 's1210', title: '12.10  고가용성 설계', route: '/topic/12-modern-architecture#s1210' },
    { topicId: '12-modern-architecture', sectionId: 's1211', title: '12.11  요약', route: '/topic/12-modern-architecture#s1211' },
]
