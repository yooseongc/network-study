export const ipAddrCode = `# 인터페이스 IP 주소 확인
$ ip addr show
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
    inet6 ::1/128 scope host
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP
    link/ether 52:54:00:12:34:56 brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.100/24 brd 192.168.1.255 scope global dynamic eth0
    inet6 fe80::5054:ff:fe12:3456/64 scope link

# 특정 인터페이스만 확인
$ ip addr show dev eth0`

export const ipAddrDetailCode = `# Primary + Secondary 주소 추가
# 첫 번째 주소가 primary, 이후는 secondary
$ sudo ip addr add 192.168.1.100/24 dev eth0          # primary
$ sudo ip addr add 192.168.1.200/24 dev eth0           # secondary
$ sudo ip addr add 10.0.0.10/24 dev eth0 label eth0:1  # label(alias) 지정

# scope 지정 — 주소의 유효 범위 결정
$ sudo ip addr add 192.168.1.100/24 dev eth0 scope global   # 어디서든 라우팅 가능 (기본값)
$ sudo ip addr add 169.254.1.1/16 dev eth0 scope link       # 같은 링크 내에서만 유효
$ sudo ip addr add 127.0.0.2/8 dev lo scope host            # 로컬 호스트 내에서만 유효

# IPv6 주소 확인 — link-local, global, temporary
$ ip -6 addr show dev eth0
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 state UP
    inet6 2001:db8::100/64 scope global dynamic mngtmpaddr
       valid_lft 86400sec preferred_lft 14400sec
    inet6 2001:db8::a1b2:c3d4:e5f6:7890/64 scope global temporary dynamic
       valid_lft 86400sec preferred_lft 14400sec
    inet6 fe80::5054:ff:fe12:3456/64 scope link
       valid_lft forever preferred_lft forever

# 주소 삭제
$ sudo ip addr del 10.0.0.10/24 dev eth0

# 인터페이스의 모든 주소 일괄 삭제
$ sudo ip addr flush dev eth0

# 실무 예시: 서비스 VIP 추가 (keepalived/VRRP 없이 수동)
$ sudo ip addr add 10.0.0.100/32 dev lo   # loopback에 VIP 추가 (DSR LB용)
$ sudo ip addr add 192.168.1.250/24 dev eth0 label eth0:vip  # 서비스 VIP`

export const ipLinkCode = `# 네트워크 인터페이스 목록 및 상태 확인
$ ip link show
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP
    link/ether 52:54:00:12:34:56 brd ff:ff:ff:ff:ff:ff
3: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN
    link/ether 02:42:ac:11:00:01 brd ff:ff:ff:ff:ff:ff

# 인터페이스 UP/DOWN
$ sudo ip link set eth0 up
$ sudo ip link set eth0 down

# MTU 변경
$ sudo ip link set eth0 mtu 9000

# MAC 주소 변경
$ sudo ip link set eth0 address 00:11:22:33:44:55`

export const ipLinkDetailCode = `# ── 가상 인터페이스 생성 ──

# veth 쌍 (컨테이너 연결용)
$ sudo ip link add veth0 type veth peer name veth1

# 브리지 생성 및 포트 연결
$ sudo ip link add br0 type bridge
$ sudo ip link set eth0 master br0
$ sudo ip link set veth0 master br0
$ sudo ip link set br0 up

# VLAN 인터페이스 (802.1Q)
$ sudo ip link add link eth0 name eth0.100 type vlan id 100

# 본딩 (bond) — 여러 NIC를 하나로 묶기
$ sudo ip link add bond0 type bond mode 802.3ad
$ sudo ip link set eth0 master bond0
$ sudo ip link set eth1 master bond0

# macvlan — 하나의 NIC에 여러 MAC 주소
$ sudo ip link add macvlan0 link eth0 type macvlan mode bridge

# ipvlan — 하나의 NIC에 여러 IP (MAC 공유)
$ sudo ip link add ipvlan0 link eth0 type ipvlan mode l3

# VXLAN — 오버레이 네트워크 (컨테이너/클라우드)
$ sudo ip link add vxlan100 type vxlan id 100 \\
    dstport 4789 local 10.0.0.1 remote 10.0.0.2 dev eth0

# dummy 인터페이스 (테스트/앵커용)
$ sudo ip link add dummy0 type dummy

# ── 인터페이스 속성 변경 ──

# 프로미스큐어스 모드 (모든 패킷 수신)
$ sudo ip link set eth0 promisc on

# TX 큐 길이 조정
$ sudo ip link set eth0 txqueuelen 5000

# 인터페이스 삭제
$ sudo ip link del br0
$ sudo ip link del veth0    # peer(veth1)도 함께 삭제됨`

export const ipRouteCode = `# 라우팅 테이블 확인
$ ip route show
default via 192.168.1.1 dev eth0 proto dhcp metric 100
10.0.0.0/8 via 10.0.0.1 dev eth1 proto static
172.16.0.0/16 dev eth2 proto kernel scope link src 172.16.0.100
192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.100

# 특정 목적지의 경로 조회
$ ip route get 10.1.2.5
10.1.2.5 via 10.0.0.1 dev eth1 src 10.0.0.100 uid 1000

# 정적 라우트 추가/삭제
$ sudo ip route add 10.10.0.0/16 via 10.0.0.1 dev eth1
$ sudo ip route del 10.10.0.0/16

# 기본 게이트웨이 변경
$ sudo ip route replace default via 192.168.1.254 dev eth0`

export const ipRouteDetailCode = `# ── 라우팅 테이블 종류 ──

# main 테이블 (기본, 일반적인 라우트)
$ ip route show table main

# local 테이블 (자기 자신의 주소, broadcast — 커널 자동 관리)
$ ip route show table local
local 127.0.0.0/8 dev lo proto kernel scope host src 127.0.0.1
local 127.0.0.1 dev lo proto kernel scope host src 127.0.0.1
broadcast 192.168.1.255 dev eth0 proto kernel scope link src 192.168.1.100
local 192.168.1.100 dev eth0 proto kernel scope host src 192.168.1.100

# default 테이블 (보통 비어 있음)
$ ip route show table default

# 모든 테이블의 라우트 한꺼번에 보기
$ ip route show table all

# ── metric (우선순위) ──
# metric이 낮을수록 우선순위 높음
$ sudo ip route add default via 192.168.1.1 dev eth0 metric 100
$ sudo ip route add default via 10.0.0.1 dev eth1 metric 200

# ── nexthop / via / dev ──
$ sudo ip route add 10.20.0.0/16 via 10.0.0.1 dev eth1    # 게이트웨이 + 디바이스
$ sudo ip route add 10.30.0.0/16 dev eth2                  # directly connected

# ── src 힌트 (source address selection) ──
$ sudo ip route add 10.40.0.0/16 via 10.0.0.1 src 10.0.0.50 dev eth1

# ── 특수 라우트 ──
# blackhole: 패킷을 조용히 폐기 (ICMP 응답 없음)
$ sudo ip route add blackhole 198.51.100.0/24

# unreachable: ICMP Destination Unreachable 응답
$ sudo ip route add unreachable 203.0.113.0/24

# prohibit: ICMP Communication Administratively Prohibited 응답
$ sudo ip route add prohibit 192.0.2.0/24

# ── ECMP (Equal-Cost Multi-Path) ──
$ sudo ip route add 10.50.0.0/16 \\
    nexthop via 10.0.0.1 dev eth1 weight 1 \\
    nexthop via 10.0.0.2 dev eth2 weight 1`

export const ipRuleCode = `# policy routing: ip rule 확인
$ ip rule show
0:      from all lookup local
32766:  from all lookup main
32767:  from all lookup default

# 특정 출발지에 대한 별도 라우팅 테이블 사용
$ sudo ip rule add from 10.0.1.0/24 table 100
$ sudo ip route add default via 10.0.1.1 dev eth1 table 100

# 여러 ISP 연결 시 policy routing 예시
# ISP-A: eth0 (192.168.1.0/24), ISP-B: eth1 (10.0.0.0/24)
$ sudo ip rule add from 192.168.1.0/24 table 10
$ sudo ip rule add from 10.0.0.0/24 table 20
$ sudo ip route add default via 192.168.1.1 table 10
$ sudo ip route add default via 10.0.0.1 table 20

# 마킹 기반 rule (iptables/nftables와 연동)
$ sudo ip rule add fwmark 0x1 table 100`

export const ipRuleDetailCode = `# ── RPDB (Routing Policy Database) 구조 ──
# 커널은 rule을 priority 순서로 순회하며 조건 매칭
$ ip rule show
0:      from all lookup local          # 자기 자신 주소 확인 (항상 최우선)
100:    from 10.0.1.0/24 lookup 100    # 사용자 정의 rule
200:    from all fwmark 0x2 lookup 200
32766:  from all lookup main           # 일반 라우팅 테이블
32767:  from all lookup default        # 기본 (보통 비어 있음)

# ── priority 지정 ──
$ sudo ip rule add from 10.0.1.0/24 table 100 priority 100
$ sudo ip rule add from 10.0.2.0/24 table 200 priority 200

# ── 다양한 조건 ──
# from: 출발지 IP
$ sudo ip rule add from 192.168.1.0/24 table 10

# to: 목적지 IP
$ sudo ip rule add to 10.100.0.0/16 table 50

# fwmark: iptables/nftables에서 설정한 패킷 마크
$ sudo iptables -t mangle -A OUTPUT -p tcp --dport 80 -j MARK --set-mark 0x1
$ sudo ip rule add fwmark 0x1 table 100

# iif: 수신 인터페이스
$ sudo ip rule add iif eth1 table 30

# oif: 송신 인터페이스 (locally generated 패킷만)
$ sudo ip rule add oif eth0 table 40

# ── rule 삭제 ──
$ sudo ip rule del from 10.0.1.0/24 table 100
$ sudo ip rule del priority 100`

export const ipRouteInterpretCode = `# ── ip route show 출력 한 줄씩 해석 ──

$ ip route show
# 1) default via 192.168.1.1 dev eth0 proto dhcp metric 100
#    ├─ default        → 0.0.0.0/0 (모든 목적지)
#    ├─ via 192.168.1.1 → 다음 홉 게이트웨이 IP
#    ├─ dev eth0       → 출력 인터페이스
#    ├─ proto dhcp     → 이 경로를 설정한 주체 (dhcp 클라이언트)
#    └─ metric 100     → 경로 우선순위 (낮을수록 높음)

# 2) 10.0.0.0/8 via 10.0.0.1 dev eth1 proto static
#    ├─ 10.0.0.0/8     → 목적지 네트워크 (CIDR)
#    ├─ via 10.0.0.1   → 게이트웨이
#    ├─ dev eth1       → 출력 인터페이스
#    └─ proto static   → 관리자가 수동 추가한 경로

# 3) 172.16.0.0/16 dev eth2 proto kernel scope link src 172.16.0.100
#    ├─ 172.16.0.0/16  → 목적지 네트워크
#    ├─ dev eth2       → 직접 연결 (via 없음 = directly connected)
#    ├─ proto kernel   → 커널이 자동 생성 (인터페이스 IP 설정 시)
#    ├─ scope link     → 같은 링크(L2 세그먼트) 내에서만 유효
#    └─ src 172.16.0.100 → 이 경로로 나갈 때 사용할 출발지 IP

# ── proto 값의 의미 ──
# kernel  : 커널이 인터페이스 설정 시 자동 추가
# boot    : 부팅 시 설정 (static과 유사)
# static  : 관리자가 ip route add로 수동 추가
# dhcp    : DHCP 클라이언트가 추가
# ra      : IPv6 Router Advertisement로 추가
# bgp/ospf: 동적 라우팅 데몬이 추가

# ── scope 값의 의미 ──
# global  : 모든 곳에서 유효 (기본값)
# link    : 같은 L2 세그먼트 내에서만 유효
# host    : 로컬 호스트 내에서만 유효`

export const ipRuleInterpretCode = `# ── ip rule show 각 필드 해석 ──

$ ip rule show
0:      from all lookup local
#  ├─ 0:           → priority (우선순위, 숫자가 작을수록 먼저 평가)
#  ├─ from all     → 조건: 모든 출발지 IP (= 무조건 매칭)
#  └─ lookup local → 동작: local 라우팅 테이블(ID 255) 조회
#     → local 테이블에는 자기 자신의 IP, loopback, broadcast 주소가 들어있음
#     → "이 패킷이 나 자신에게 온 것인가?" 를 가장 먼저 확인

100:    from 10.0.1.0/24 lookup 100
#  ├─ 100:              → priority 100
#  ├─ from 10.0.1.0/24  → 조건: 출발지가 10.0.1.0/24 서브넷
#  └─ lookup 100        → 동작: 라우팅 테이블 100번 조회
#     → 매칭되면 테이블 100에서 경로를 찾음
#     → 테이블 100에 경로가 없으면? → 다음 rule(priority 200)로 이동!

200:    from all fwmark 0x2 lookup 200
#  ├─ 200:            → priority 200
#  ├─ from all        → 출발지 조건 없음
#  ├─ fwmark 0x2      → 조건: 패킷의 fwmark 값이 0x2
#  └─ lookup 200      → 테이블 200번 조회

32766:  from all lookup main
#  ├─ 32766:          → 거의 마지막 priority
#  ├─ from all        → 모든 패킷 매칭
#  └─ lookup main     → main 테이블 (ip route show의 기본 테이블)
#     → 사용자 정의 rule에 매칭되지 않은 모든 패킷이 여기서 처리됨

32767:  from all lookup default
#  └─ 최종 fallback (보통 비어 있음)

# ── RPDB 매칭 시뮬레이션 ──
# 패킷: src=10.0.1.50, dst=8.8.8.8, fwmark=0
#
# Step 1: priority 0 → from all lookup local
#         → local 테이블 조회 → 8.8.8.8은 내 주소 아님 → 경로 없음 → 다음 rule
#
# Step 2: priority 100 → from 10.0.1.0/24 lookup 100
#         → src=10.0.1.50 매칭! → 테이블 100 조회
#         → 테이블 100에 "default via 10.0.1.1 dev eth1" 있음 → 경로 결정!
#
# 패킷: src=192.168.1.10, dst=8.8.8.8, fwmark=0
# Step 1: priority 0 → 경로 없음 → 다음
# Step 2: priority 100 → src 불일치 → 다음
# Step 3: priority 200 → fwmark 불일치 → 다음
# Step 4: priority 32766 → from all → main 테이블 조회 → default gw 사용`

export const vpnSplitTunnelCode = `# ── fwmark 기반 VPN split-tunnel 시나리오 ──
#
# 요구사항:
#   - 사내망(10.0.0.0/8)으로의 트래픽만 VPN(tun0) 경유
#   - 나머지 인터넷 트래픽은 일반 ISP 경유
#   - 특정 앱(포트 8443)은 강제로 VPN 경유

# 1) VPN 대역 직접 라우팅 (목적지 기반)
$ sudo ip route add 10.0.0.0/8 dev tun0 table 100
$ sudo ip route add default via 192.168.1.1 dev eth0 table 100
$ sudo ip rule add to 10.0.0.0/8 table 100 priority 100

# 2) fwmark 기반: 특정 트래픽 강제 VPN
# iptables로 마킹
$ sudo iptables -t mangle -A OUTPUT -p tcp --dport 8443 -j MARK --set-mark 0x10

# 마킹된 패킷은 VPN 전용 테이블 사용
$ sudo ip route add default dev tun0 table 200
$ sudo ip rule add fwmark 0x10 table 200 priority 50

# 3) 확인
$ ip rule show
0:     from all lookup local
50:    from all fwmark 0x10 lookup 200    # 마킹 트래픽 → VPN
100:   to 10.0.0.0/8 lookup 100           # 사내망 → VPN
32766: from all lookup main               # 나머지 → 일반 ISP

# 4) 검증
$ ip route get 10.1.2.3
10.1.2.3 dev tun0 table 100 src 10.8.0.2
$ ip route get 8.8.8.8
8.8.8.8 via 192.168.1.1 dev eth0 src 192.168.1.100`

export const multiIspFailoverCode = `# ── Multi-ISP Failover 실전 구성 ──
#
# 구성:
#   ISP-A: eth0 (211.100.1.0/24, gw 211.100.1.1)
#   ISP-B: eth1 (121.160.1.0/24, gw 121.160.1.1)
#
# 목표:
#   - ISP-A 출발 패킷은 ISP-A 게이트웨이로
#   - ISP-B 출발 패킷은 ISP-B 게이트웨이로
#   - ISP-A 장애 시 ISP-B로 failover

# 1) /etc/iproute2/rt_tables에 테이블 이름 등록
#   10  isp_a
#   20  isp_b

# 2) 각 ISP 테이블에 라우트 설정
$ sudo ip route add 211.100.1.0/24 dev eth0 table isp_a
$ sudo ip route add default via 211.100.1.1 dev eth0 table isp_a

$ sudo ip route add 121.160.1.0/24 dev eth1 table isp_b
$ sudo ip route add default via 121.160.1.1 dev eth1 table isp_b

# 3) 출발지 기반 policy rule
$ sudo ip rule add from 211.100.1.0/24 table isp_a priority 100
$ sudo ip rule add from 121.160.1.0/24 table isp_b priority 200

# 4) main 테이블에 기본 경로 (ISP-A 우선, failover용 ISP-B)
$ sudo ip route add default via 211.100.1.1 dev eth0 metric 100
$ sudo ip route add default via 121.160.1.1 dev eth1 metric 200

# 5) 상태 확인
$ ip rule show
0:     from all lookup local
100:   from 211.100.1.0/24 lookup isp_a
200:   from 121.160.1.0/24 lookup isp_b
32766: from all lookup main
32767: from all lookup default

# 6) Failover 스크립트 (cron/systemd timer로 주기 실행)
# #!/bin/bash
# if ! ping -c 2 -W 2 -I eth0 211.100.1.1 > /dev/null 2>&1; then
#     ip route replace default via 121.160.1.1 dev eth1 metric 100
#     logger "ISP-A down, switched to ISP-B"
# else
#     ip route replace default via 211.100.1.1 dev eth0 metric 100
# fi`

export const ipNeighCode = `# ── ARP 캐시 확인 ──
$ ip neigh show
192.168.1.1 dev eth0 lladdr 00:0c:29:ab:cd:ef REACHABLE
192.168.1.50 dev eth0 lladdr 52:54:00:aa:bb:cc STALE
10.0.0.1 dev eth1 lladdr 00:11:22:33:44:55 REACHABLE
192.168.1.200 dev eth0  FAILED

# ── 상태 의미 ──
# REACHABLE : 최근 통신으로 유효성 확인됨
# STALE     : 일정 시간 미사용, 재확인 필요 (다음 전송 시 probe)
# DELAY     : STALE에서 재확인 대기 중
# PROBE     : 유효성 확인용 ARP Request 전송 중
# FAILED    : ARP 응답 없음 (도달 불가)
# INCOMPLETE: ARP Request 전송 후 응답 대기 중
# PERMANENT : 수동 설정 (static entry)

# ── static ARP entry 추가/삭제 ──
$ sudo ip neigh add 192.168.1.99 lladdr 00:aa:bb:cc:dd:ee dev eth0 nud permanent
$ sudo ip neigh del 192.168.1.99 dev eth0

# ── ARP 캐시 항목 변경 ──
$ sudo ip neigh replace 192.168.1.1 lladdr 00:0c:29:ff:ff:ff dev eth0

# ── 특정 인터페이스의 ARP 전체 삭제 ──
$ sudo ip neigh flush dev eth0

# ── IPv6 NDP (Neighbor Discovery Protocol) ──
$ ip -6 neigh show
fe80::1 dev eth0 lladdr 00:0c:29:ab:cd:ef router REACHABLE
2001:db8::50 dev eth0 lladdr 52:54:00:aa:bb:cc STALE

# IPv6 static neighbor
$ sudo ip -6 neigh add 2001:db8::99 lladdr 00:aa:bb:cc:dd:ee dev eth0`

export const tcQdiscBasicCode = `# ── qdisc (Queueing Discipline) 개요 ──
# qdisc는 패킷이 NIC로 전송되기 전에 거치는 큐잉/스케줄링 메커니즘
# 대역폭 제한, 지연 시뮬레이션, 공정 큐잉 등을 구현

# 현재 설정된 qdisc 확인
$ tc qdisc show
qdisc fq_codel 0: dev eth0 root refcnt 2 limit 10240p flows 1024 \\
    quantum 1514 target 5ms interval 100ms memory_limit 32Mb ecn drop_batch 64
qdisc noqueue 0: dev lo root refcnt 2

# qdisc 통계 (패킷 수, 드롭 수 등)
$ tc -s qdisc show dev eth0
qdisc fq_codel 0: dev eth0 root refcnt 2 limit 10240p flows 1024 ...
 Sent 1234567890 bytes 987654 pkt (dropped 42, overlimits 0 requeues 15)
 backlog 0b 0p requeues 15
  maxpacket 1514 drop_overlimit 0 new_flow_count 5432 ecn_mark 0
  new_flows_len 0 old_flows_len 2

# ── tc -s qdisc show 출력 읽기 ──
# Sent X bytes Y pkt  → 이 qdisc를 통과한 총 바이트/패킷 수
# dropped Z           → qdisc에서 폐기된 패킷 수
# overlimits N        → 제한 초과 이벤트 횟수
# requeues M          → 재큐잉 횟수 (드라이버가 busy여서 재시도)
# backlog Xb Yp       → 현재 큐에 대기 중인 바이트/패킷 수`

export const tcHtbCode = `# ── HTB (Hierarchical Token Bucket) — 계층적 대역폭 제어 ──
#
# 구조: root qdisc → class(부모) → class(자식) → leaf qdisc
#
# 시나리오: eth0의 총 대역폭을 100Mbps로 제한
#   - 웹 트래픽: 보장 50Mbps, 최대 80Mbps
#   - 기타 트래픽: 보장 20Mbps, 최대 100Mbps
#   - 백그라운드: 보장 10Mbps, 최대 30Mbps

# 1) root qdisc 설정 (HTB)
$ sudo tc qdisc add dev eth0 root handle 1: htb default 30

# 2) root class — 전체 대역폭 상한
$ sudo tc class add dev eth0 parent 1: classid 1:1 htb \\
    rate 100mbit ceil 100mbit

# 3) 자식 class — 각 트래픽 유형별 대역폭 할당
# 웹 트래픽 (rate=보장, ceil=최대)
$ sudo tc class add dev eth0 parent 1:1 classid 1:10 htb \\
    rate 50mbit ceil 80mbit

# 기타 트래픽
$ sudo tc class add dev eth0 parent 1:1 classid 1:20 htb \\
    rate 20mbit ceil 100mbit

# 백그라운드 트래픽
$ sudo tc class add dev eth0 parent 1:1 classid 1:30 htb \\
    rate 10mbit ceil 30mbit

# 4) 각 leaf class에 fq_codel qdisc 추가 (공정 큐잉)
$ sudo tc qdisc add dev eth0 parent 1:10 handle 10: fq_codel
$ sudo tc qdisc add dev eth0 parent 1:20 handle 20: fq_codel
$ sudo tc qdisc add dev eth0 parent 1:30 handle 30: fq_codel

# 5) filter로 트래픽 분류 (tc filter + u32/flower)
$ sudo tc filter add dev eth0 parent 1: protocol ip prio 1 \\
    u32 match ip dport 80 0xffff flowid 1:10
$ sudo tc filter add dev eth0 parent 1: protocol ip prio 1 \\
    u32 match ip dport 443 0xffff flowid 1:10

# 6) 확인
$ tc class show dev eth0
$ tc -s class show dev eth0   # 통계 포함`

export const tcNetemCode = `# ── netem — 네트워크 조건 시뮬레이션 ──

# 지연(latency) 추가 — 모든 패킷에 100ms 지연
$ sudo tc qdisc add dev eth0 root netem delay 100ms

# 지연 + 변동(jitter) — 100ms ± 20ms (정규 분포)
$ sudo tc qdisc add dev eth0 root netem delay 100ms 20ms

# 지연 + 상관관계 — 연속 패킷의 지연이 25% 상관
$ sudo tc qdisc add dev eth0 root netem delay 100ms 20ms 25%

# 패킷 손실(loss) — 1% 확률로 패킷 드롭
$ sudo tc qdisc add dev eth0 root netem loss 1%

# 패킷 손실 + 상관관계 — burst loss 시뮬레이션
$ sudo tc qdisc add dev eth0 root netem loss 5% 25%

# 패킷 중복(duplicate) — 1% 확률로 패킷 복제
$ sudo tc qdisc add dev eth0 root netem duplicate 1%

# 패킷 순서 변경(reorder) — 25% 확률로 순서 뒤바뀜
$ sudo tc qdisc add dev eth0 root netem reorder 25% 50%

# 패킷 손상(corrupt) — 0.1% 확률로 비트 손상
$ sudo tc qdisc add dev eth0 root netem corrupt 0.1%

# 대역폭 제한 + 지연 (조합)
$ sudo tc qdisc add dev eth0 root handle 1: htb default 1
$ sudo tc class add dev eth0 parent 1: classid 1:1 htb \\
    rate 1mbit ceil 1mbit
$ sudo tc qdisc add dev eth0 parent 1:1 handle 10: netem \\
    delay 50ms 10ms loss 0.5%

# 모든 netem 설정 삭제
$ sudo tc qdisc del dev eth0 root

# 현재 설정 확인
$ tc qdisc show dev eth0`

export const tcFqCodelCode = `# ── fq_codel (Fair Queuing Controlled Delay) ──
#
# fq_codel은 리눅스의 기본 qdisc (커널 3.6+)
# 버퍼블로트(bufferbloat) 문제를 해결하는 AQM (Active Queue Management)
#
# 동작 원리:
# 1) Fair Queuing: 흐름(flow)별로 별도 큐 → 하나의 흐름이 독점 불가
# 2) CoDel: 큐 체류 시간(sojourn time)을 측정하여 과도하면 드롭
#    - target: 허용 최대 큐 지연 (기본 5ms)
#    - interval: 측정 주기 (기본 100ms)

# fq_codel 파라미터 확인
$ tc qdisc show dev eth0
qdisc fq_codel 0: dev eth0 root refcnt 2
    limit 10240p     ← 최대 패킷 수
    flows 1024       ← 최대 흐름 수
    quantum 1514     ← 라운드 당 디큐 바이트 (보통 MTU)
    target 5ms       ← CoDel 목표 지연
    interval 100ms   ← CoDel 측정 주기
    memory_limit 32Mb ← 메모리 상한
    ecn              ← ECN(Explicit Congestion Notification) 활성

# fq_codel 통계 (상세)
$ tc -s qdisc show dev eth0
  maxpacket 1514       ← 관측된 최대 패킷 크기
  drop_overlimit 0     ← 큐 가득 차서 드롭
  new_flow_count 5432  ← 새 흐름 수
  ecn_mark 0           ← ECN 마킹된 패킷 수
  new_flows_len 0      ← 현재 new_flows 큐 길이
  old_flows_len 2      ← 현재 old_flows 큐 길이

# fq_codel 수동 설정 (파라미터 튜닝)
$ sudo tc qdisc replace dev eth0 root fq_codel \\
    limit 4096 flows 512 target 5ms interval 100ms quantum 1514 ecn`

export const tcMirredCode = `# ── tc mirred — 포트 미러링 ──
#
# 패킷을 복제하여 다른 인터페이스로 전송 (모니터링, IDS 용)

# eth0의 ingress 트래픽을 eth1로 미러링
$ sudo tc qdisc add dev eth0 ingress
$ sudo tc filter add dev eth0 parent ffff: protocol all \\
    u32 match u32 0 0 \\
    action mirred egress mirror dev eth1

# eth0의 egress 트래픽도 eth1로 미러링
$ sudo tc qdisc add dev eth0 root handle 1: prio
$ sudo tc filter add dev eth0 parent 1: protocol all \\
    u32 match u32 0 0 \\
    action mirred egress mirror dev eth1

# 특정 트래픽만 미러링 (포트 80)
$ sudo tc filter add dev eth0 parent ffff: protocol ip \\
    u32 match ip dport 80 0xffff \\
    action mirred egress mirror dev eth1

# 미러링 삭제
$ sudo tc qdisc del dev eth0 ingress
$ sudo tc qdisc del dev eth0 root`

export const tcBandwidthCode = `# ── 대역폭 제한 실전 예시 ──

# 1) 단순 대역폭 제한 (tbf — Token Bucket Filter)
$ sudo tc qdisc add dev eth0 root tbf \\
    rate 10mbit burst 32kbit latency 400ms

# 2) HTB + filter — 특정 IP 대역폭 제한
$ sudo tc qdisc add dev eth0 root handle 1: htb default 99
$ sudo tc class add dev eth0 parent 1: classid 1:1 htb \\
    rate 100mbit ceil 100mbit
$ sudo tc class add dev eth0 parent 1:1 classid 1:10 htb \\
    rate 5mbit ceil 10mbit
$ sudo tc class add dev eth0 parent 1:1 classid 1:99 htb \\
    rate 95mbit ceil 100mbit
$ sudo tc filter add dev eth0 parent 1: protocol ip prio 1 \\
    u32 match ip dst 192.168.1.50/32 flowid 1:10

# 3) ingress 트래픽 제한 (ifb 활용)
# ingress는 직접 qdisc 제한이 어려우므로 IFB(Intermediate Functional Block)로 리다이렉트
$ sudo modprobe ifb numifbs=1
$ sudo ip link set ifb0 up
$ sudo tc qdisc add dev eth0 ingress
$ sudo tc filter add dev eth0 parent ffff: protocol ip \\
    u32 match u32 0 0 \\
    action mirred egress redirect dev ifb0
$ sudo tc qdisc add dev ifb0 root tbf \\
    rate 50mbit burst 64kbit latency 400ms

# 4) 확인 및 모니터링
$ tc -s qdisc show dev eth0
$ tc -s class show dev eth0
$ watch -n 1 'tc -s qdisc show dev eth0'`

export const ssCode = `# TCP 소켓 상태 확인 (연결 중인 소켓 + 프로세스 정보)
$ ss -tnp
State    Recv-Q  Send-Q  Local Address:Port    Peer Address:Port   Process
ESTAB    0       0       192.168.1.100:22      192.168.1.50:51234  users:(("sshd",pid=1234))
ESTAB    0       0       192.168.1.100:443     10.0.0.5:49876      users:(("nginx",pid=5678))
CLOSE-WAIT 0     0       192.168.1.100:8080    10.0.0.10:55432     users:(("java",pid=9012))

# LISTEN 상태의 소켓 확인
$ ss -tlnp
State   Recv-Q  Send-Q  Local Address:Port  Peer Address:Port  Process
LISTEN  0       128     0.0.0.0:22          0.0.0.0:*          users:(("sshd",pid=800))
LISTEN  0       511     0.0.0.0:80          0.0.0.0:*          users:(("nginx",pid=5678))
LISTEN  0       511     0.0.0.0:443         0.0.0.0:*          users:(("nginx",pid=5678))

# UDP 소켓 확인
$ ss -ulnp
State   Recv-Q  Send-Q  Local Address:Port  Peer Address:Port  Process
UNCONN  0       0       0.0.0.0:53          0.0.0.0:*          users:(("dnsmasq",pid=1100))

# 소켓 통계 요약
$ ss -s
Total: 156
TCP:   42 (estab 15, closed 8, orphaned 2, timewait 5)
UDP:   6
RAW:   0

# 특정 포트 필터링
$ ss -tnp sport = :443
$ ss -tnp dport = :3306`

export const ipNetnsCode = `# 네트워크 네임스페이스 목록 확인
$ ip netns list
red
blue

# 네임스페이스 생성
$ sudo ip netns add red
$ sudo ip netns add blue

# veth 쌍 생성 (가상 이더넷 케이블)
$ sudo ip link add veth-red type veth peer name veth-blue

# 각 veth를 네임스페이스에 할당
$ sudo ip link set veth-red netns red
$ sudo ip link set veth-blue netns blue

# 네임스페이스 내에서 IP 설정 및 인터페이스 UP
$ sudo ip netns exec red ip addr add 10.0.0.1/24 dev veth-red
$ sudo ip netns exec red ip link set veth-red up
$ sudo ip netns exec red ip link set lo up

$ sudo ip netns exec blue ip addr add 10.0.0.2/24 dev veth-blue
$ sudo ip netns exec blue ip link set veth-blue up
$ sudo ip netns exec blue ip link set lo up

# 네임스페이스 간 통신 확인
$ sudo ip netns exec red ping 10.0.0.2
PING 10.0.0.2 (10.0.0.2) 56(84) bytes of data.
64 bytes from 10.0.0.2: icmp_seq=1 ttl=64 time=0.031 ms

# 네임스페이스 내에서 명령 실행
$ sudo ip netns exec red ss -tlnp
$ sudo ip netns exec blue ip route show

# 네임스페이스 삭제
$ sudo ip netns del red`
