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
    { topicId: '02-network-design', sectionId: 's024', title: '2.4  L2 스위치', route: '/topic/02-network-design#s024' },
    { topicId: '02-network-design', sectionId: 's025', title: '2.5  L3 스위치', route: '/topic/02-network-design#s025' },
    { topicId: '02-network-design', sectionId: 's026', title: '2.6  라우터 / 백본 라우터', route: '/topic/02-network-design#s026' },
    { topicId: '02-network-design', sectionId: 's027', title: '2.7  방화벽', route: '/topic/02-network-design#s027' },
    { topicId: '02-network-design', sectionId: 's028', title: '2.8  L4 / L7 로드밸런서', route: '/topic/02-network-design#s028' },
    { topicId: '02-network-design', sectionId: 's029', title: '2.9  스위치 계층 구조 (3-Tier Architecture)', route: '/topic/02-network-design#s029' },
    { topicId: '02-network-design', sectionId: 's0210', title: '2.10  망 분리의 원칙', route: '/topic/02-network-design#s0210' },
    { topicId: '02-network-design', sectionId: 's0211', title: '2.11  DMZ의 개념과 목적', route: '/topic/02-network-design#s0211' },
    { topicId: '02-network-design', sectionId: 's0212', title: '2.12  보안장비 배치', route: '/topic/02-network-design#s0212' },
    { topicId: '02-network-design', sectionId: 's0213', title: '2.13  이중화 구성 상세', route: '/topic/02-network-design#s0213' },
    { topicId: '02-network-design', sectionId: 's0214', title: '2.14  요약', route: '/topic/02-network-design#s0214' },

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

    // Topic 06 — DNS 심화
    { topicId: '06-dns', sectionId: 's061', title: '6.1  DNS의 역할과 구조', route: '/topic/06-dns#s061' },
    { topicId: '06-dns', sectionId: 's062', title: '6.2  DNS 서버의 종류', route: '/topic/06-dns#s062' },
    { topicId: '06-dns', sectionId: 's063', title: '6.3  DNS 질의 과정', route: '/topic/06-dns#s063' },
    { topicId: '06-dns', sectionId: 's064', title: '6.4  DNSSEC', route: '/topic/06-dns#s064' },
    { topicId: '06-dns', sectionId: 's065', title: '6.5  DNS 보안과 프라이버시', route: '/topic/06-dns#s065' },
    { topicId: '06-dns', sectionId: 's066', title: '6.6  기업 DNS 구성', route: '/topic/06-dns#s066' },
    { topicId: '06-dns', sectionId: 's067', title: '6.7  요약', route: '/topic/06-dns#s067' },

    // Topic 07 — HTTP/TLS와 보안
    { topicId: '07-http-tls-security', sectionId: 's071', title: '7.1  HTTP 기본 구조', route: '/topic/07-http-tls-security#s071' },
    { topicId: '07-http-tls-security', sectionId: 's072', title: '7.2  HTTPS와 TLS 상세', route: '/topic/07-http-tls-security#s072' },
    { topicId: '07-http-tls-security', sectionId: 's073', title: '7.3  인증서와 PKI', route: '/topic/07-http-tls-security#s073' },
    { topicId: '07-http-tls-security', sectionId: 's074', title: '7.4  DHCP와 NTP', route: '/topic/07-http-tls-security#s074' },
    { topicId: '07-http-tls-security', sectionId: 's075', title: '7.5  SSH와 원격 접속', route: '/topic/07-http-tls-security#s075' },
    { topicId: '07-http-tls-security', sectionId: 's076', title: '7.6  기타 응용 프로토콜', route: '/topic/07-http-tls-security#s076' },
    { topicId: '07-http-tls-security', sectionId: 's077', title: '7.7  네트워크 보안 기초', route: '/topic/07-http-tls-security#s077' },
    { topicId: '07-http-tls-security', sectionId: 's078', title: '7.8  프록시와 리버스 프록시', route: '/topic/07-http-tls-security#s078' },
    { topicId: '07-http-tls-security', sectionId: 's079', title: '7.9  요약', route: '/topic/07-http-tls-security#s079' },

    // Topic 08 — 실제 서비스 망 설계와 트래픽 흐름
    { topicId: '08-service-flow', sectionId: 's081', title: '8.1  사용자 요청의 전체 경로', route: '/topic/08-service-flow#s081' },
    { topicId: '08-service-flow', sectionId: 's082', title: '8.2  사내 인터넷 접속망 구조', route: '/topic/08-service-flow#s082' },
    { topicId: '08-service-flow', sectionId: 's083', title: '8.3  서버 인프라 분리 (Web / WAS / DB 3-Tier)', route: '/topic/08-service-flow#s083' },
    { topicId: '08-service-flow', sectionId: 's084', title: '8.4  DMZ와 공개 서비스망', route: '/topic/08-service-flow#s084' },
    { topicId: '08-service-flow', sectionId: 's085', title: '8.5  East-West vs North-South 트래픽', route: '/topic/08-service-flow#s085' },
    { topicId: '08-service-flow', sectionId: 's086', title: '8.6  NAT 적용 위치와 동작', route: '/topic/08-service-flow#s086' },
    { topicId: '08-service-flow', sectionId: 's087', title: '8.7  프록시 기반 트래픽 흐름', route: '/topic/08-service-flow#s087' },
    { topicId: '08-service-flow', sectionId: 's088', title: '8.8  보안장비 삽입 구조 (Inline vs Out-of-Path)', route: '/topic/08-service-flow#s088' },
    { topicId: '08-service-flow', sectionId: 's089', title: '8.9  고가용성 설계 기초', route: '/topic/08-service-flow#s089' },
    { topicId: '08-service-flow', sectionId: 's0810', title: '8.10  요약', route: '/topic/08-service-flow#s0810' },

    // Topic 09 — 리눅스 네트워크 스택
    { topicId: '09-linux-stack', sectionId: 's091', title: '9.1  리눅스 네트워크 스택 개요', route: '/topic/09-linux-stack#s091' },
    { topicId: '09-linux-stack', sectionId: 's092', title: '9.2  NIC 드라이버와 인터럽트', route: '/topic/09-linux-stack#s092' },
    { topicId: '09-linux-stack', sectionId: 's093', title: '9.3  NAPI와 패킷 수신 경로', route: '/topic/09-linux-stack#s093' },
    { topicId: '09-linux-stack', sectionId: 's094', title: '9.4  sk_buff 구조', route: '/topic/09-linux-stack#s094' },
    { topicId: '09-linux-stack', sectionId: 's095', title: '9.5  sysctl 네트워크 파라미터', route: '/topic/09-linux-stack#s095' },
    { topicId: '09-linux-stack', sectionId: 's096', title: '9.6  요약', route: '/topic/09-linux-stack#s096' },

    // Topic 10 — iproute2와 리눅스 네트워크 관리
    { topicId: '10-iproute2-admin', sectionId: 's101', title: '10.1  ip addr — 주소 관리 상세', route: '/topic/10-iproute2-admin#s101' },
    { topicId: '10-iproute2-admin', sectionId: 's102', title: '10.2  ip link — 인터페이스 관리 상세', route: '/topic/10-iproute2-admin#s102' },
    { topicId: '10-iproute2-admin', sectionId: 's103', title: '10.3  ip route — 라우팅 테이블 상세', route: '/topic/10-iproute2-admin#s103' },
    { topicId: '10-iproute2-admin', sectionId: 's104', title: '10.4  ip rule — 정책 라우팅 상세', route: '/topic/10-iproute2-admin#s104' },
    { topicId: '10-iproute2-admin', sectionId: 's105', title: '10.5  ip neigh — ARP/NDP 관리', route: '/topic/10-iproute2-admin#s105' },
    { topicId: '10-iproute2-admin', sectionId: 's106', title: '10.6  ip route/rule 정책 해석 실습', route: '/topic/10-iproute2-admin#s106' },
    { topicId: '10-iproute2-admin', sectionId: 's107', title: '10.7  tc/qdisc 상세 사용법', route: '/topic/10-iproute2-admin#s107' },
    { topicId: '10-iproute2-admin', sectionId: 's108', title: '10.8  ss와 소켓 상태 관찰', route: '/topic/10-iproute2-admin#s108' },
    { topicId: '10-iproute2-admin', sectionId: 's109', title: '10.9  네트워크 네임스페이스와 veth', route: '/topic/10-iproute2-admin#s109' },
    { topicId: '10-iproute2-admin', sectionId: 's1010', title: '10.10  요약', route: '/topic/10-iproute2-admin#s1010' },

    // Topic 11 — 패킷 처리와 방화벽 / NAT / 프록시
    { topicId: '11-packet-processing', sectionId: 's111', title: '11.1  Netfilter 구조', route: '/topic/11-packet-processing#s111' },
    { topicId: '11-packet-processing', sectionId: 's112', title: '11.2  iptables와 nftables', route: '/topic/11-packet-processing#s112' },
    { topicId: '11-packet-processing', sectionId: 's113', title: '11.3  conntrack과 stateful 방화벽', route: '/topic/11-packet-processing#s113' },
    { topicId: '11-packet-processing', sectionId: 's114', title: '11.4  SNAT / DNAT / MASQUERADE', route: '/topic/11-packet-processing#s114' },
    { topicId: '11-packet-processing', sectionId: 's115', title: '11.5  포트 포워딩', route: '/topic/11-packet-processing#s115' },
    { topicId: '11-packet-processing', sectionId: 's116', title: '11.6  mark / fwmark과 policy routing', route: '/topic/11-packet-processing#s116' },
    { topicId: '11-packet-processing', sectionId: 's117', title: '11.7  TPROXY와 transparent proxy', route: '/topic/11-packet-processing#s117' },
    { topicId: '11-packet-processing', sectionId: 's118', title: '11.8  inline vs out-of-path 장비', route: '/topic/11-packet-processing#s118' },
    { topicId: '11-packet-processing', sectionId: 's119', title: '11.9  요약', route: '/topic/11-packet-processing#s119' },

    // Topic 12 — 성능과 트래픽 제어
    { topicId: '12-performance', sectionId: 's121', title: '12.1  네트워크 성능 지표', route: '/topic/12-performance#s121' },
    { topicId: '12-performance', sectionId: 's122', title: '12.2  RTT와 throughput, BDP', route: '/topic/12-performance#s122' },
    { topicId: '12-performance', sectionId: 's123', title: '12.3  병목 지점 분석', route: '/topic/12-performance#s123' },
    { topicId: '12-performance', sectionId: 's124', title: '12.4  NIC offload 기능', route: '/topic/12-performance#s124' },
    { topicId: '12-performance', sectionId: 's125', title: '12.5  멀티코어 패킷 분산 (RSS/RPS/RFS/XPS)', route: '/topic/12-performance#s125' },
    { topicId: '12-performance', sectionId: 's126', title: '12.6  IRQ affinity와 CPU locality', route: '/topic/12-performance#s126' },
    { topicId: '12-performance', sectionId: 's127', title: '12.7  qdisc와 tc', route: '/topic/12-performance#s127' },
    { topicId: '12-performance', sectionId: 's128', title: '12.8  QoS (Quality of Service)', route: '/topic/12-performance#s128' },
    { topicId: '12-performance', sectionId: 's129', title: '12.9  고성능 패킷 처리 (XDP, AF_PACKET, DPDK)', route: '/topic/12-performance#s129' },
    { topicId: '12-performance', sectionId: 's1210', title: '12.10  요약', route: '/topic/12-performance#s1210' },

    // Topic 13 — 네트워크 장애 분석과 관측
    { topicId: '13-troubleshooting', sectionId: 's131', title: '13.1  장애 분석 기본 절차', route: '/topic/13-troubleshooting#s131' },
    { topicId: '13-troubleshooting', sectionId: 's132', title: '13.2  ping과 ICMP', route: '/topic/13-troubleshooting#s132' },
    { topicId: '13-troubleshooting', sectionId: 's133', title: '13.3  traceroute와 mtr', route: '/topic/13-troubleshooting#s133' },
    { topicId: '13-troubleshooting', sectionId: 's134', title: '13.4  tcpdump 기초', route: '/topic/13-troubleshooting#s134' },
    { topicId: '13-troubleshooting', sectionId: 's135', title: '13.5  TCP 플래그 읽기', route: '/topic/13-troubleshooting#s135' },
    { topicId: '13-troubleshooting', sectionId: 's136', title: '13.6  DNS 장애 분석', route: '/topic/13-troubleshooting#s136' },
    { topicId: '13-troubleshooting', sectionId: 's137', title: '13.7  TCP 연결 장애 분석', route: '/topic/13-troubleshooting#s137' },
    { topicId: '13-troubleshooting', sectionId: 's138', title: '13.8  MTU / PMTU 문제', route: '/topic/13-troubleshooting#s138' },
    { topicId: '13-troubleshooting', sectionId: 's139', title: '13.9  체계적 장애 분석 절차', route: '/topic/13-troubleshooting#s139' },
    { topicId: '13-troubleshooting', sectionId: 's1310', title: '13.10  요약', route: '/topic/13-troubleshooting#s1310' },

    // Topic 14 — 로드밸런싱과 글로벌 트래픽 관리
    { topicId: '14-load-balancing', sectionId: 's141', title: '14.1  로드밸런서 기본 구조', route: '/topic/14-load-balancing#s141' },
    { topicId: '14-load-balancing', sectionId: 's142', title: '14.2  L4 vs L7 로드밸런싱', route: '/topic/14-load-balancing#s142' },
    { topicId: '14-load-balancing', sectionId: 's143', title: '14.3  리버스 프록시와 API 게이트웨이', route: '/topic/14-load-balancing#s143' },
    { topicId: '14-load-balancing', sectionId: 's144', title: '14.4  CDN의 원리', route: '/topic/14-load-balancing#s144' },
    { topicId: '14-load-balancing', sectionId: 's145', title: '14.5  GSLB (Global Server Load Balancing)', route: '/topic/14-load-balancing#s145' },
    { topicId: '14-load-balancing', sectionId: 's146', title: '14.6  고가용성 설계', route: '/topic/14-load-balancing#s146' },
    { topicId: '14-load-balancing', sectionId: 's147', title: '14.7  요약', route: '/topic/14-load-balancing#s147' },

    // Topic 15 — 클라우드·컨테이너 네트워크와 제로 트러스트
    { topicId: '15-cloud-container', sectionId: 's151', title: '15.1  VPN과 터널링', route: '/topic/15-cloud-container#s151' },
    { topicId: '15-cloud-container', sectionId: 's152', title: '15.2  클라우드 네트워킹', route: '/topic/15-cloud-container#s152' },
    { topicId: '15-cloud-container', sectionId: 's153', title: '15.3  컨테이너 네트워크와 CNI', route: '/topic/15-cloud-container#s153' },
    { topicId: '15-cloud-container', sectionId: 's154', title: '15.4  서비스 메시', route: '/topic/15-cloud-container#s154' },
    { topicId: '15-cloud-container', sectionId: 's155', title: '15.5  Zero Trust 네트워크', route: '/topic/15-cloud-container#s155' },
    { topicId: '15-cloud-container', sectionId: 's156', title: '15.6  요약', route: '/topic/15-cloud-container#s156' },
]
