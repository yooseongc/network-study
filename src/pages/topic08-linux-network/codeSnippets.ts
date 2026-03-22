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
$ sudo ip link set eth0 promisc off

# TX 큐 길이 조정
$ sudo ip link set eth0 txqueuelen 5000

# 인터페이스 삭제
$ sudo ip link del br0
$ sudo ip link del veth0    # peer(veth1)도 함께 삭제됨

# ── 실무 예시: bridge 기반 컨테이너 네트워크 ──
# 1) 브리지 + veth 생성
$ sudo ip link add br-container type bridge
$ sudo ip link set br-container up
$ sudo ip addr add 172.18.0.1/16 dev br-container

# 2) 컨테이너용 veth 쌍 생성 → 한쪽을 브리지에 연결
$ sudo ip link add veth-c1 type veth peer name eth0-c1
$ sudo ip link set veth-c1 master br-container
$ sudo ip link set veth-c1 up
# eth0-c1은 컨테이너 네임스페이스로 이동 후 IP 할당`

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
# 동일 비용 경로 여러 개 → 트래픽 분산
$ sudo ip route add 10.50.0.0/16 \\
    nexthop via 10.0.0.1 dev eth1 weight 1 \\
    nexthop via 10.0.0.2 dev eth2 weight 1

# weight로 비율 조정 (2:1 분산)
$ sudo ip route add 10.60.0.0/16 \\
    nexthop via 10.0.0.1 dev eth1 weight 2 \\
    nexthop via 10.0.0.2 dev eth2 weight 1

# ── ip route get — 실제 경로 확인 (디버깅 필수) ──
$ ip route get 8.8.8.8
8.8.8.8 via 192.168.1.1 dev eth0 src 192.168.1.100 uid 1000
    cache

# 출발지 지정 시
$ ip route get 8.8.8.8 from 10.0.0.50
8.8.8.8 from 10.0.0.50 via 10.0.0.1 dev eth1 table 100 uid 1000

# ── replace (있으면 수정, 없으면 추가) ──
$ sudo ip route replace 10.10.0.0/16 via 10.0.0.254 dev eth1

# ── 실무 예시: multi-homing (이중 ISP) ──
# ISP-A: eth0 (211.x.x.x), ISP-B: eth1 (121.x.x.x)
$ sudo ip route add default via 211.x.x.1 dev eth0 table 10
$ sudo ip route add default via 121.x.x.1 dev eth1 table 20
# → ip rule과 조합하여 출발지 기반 라우팅`

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
$ sudo ip rule del priority 100

# ── 실무 예시 1: VPN split tunneling ──
# VPN 대역만 터널, 나머지는 일반 인터넷
$ sudo ip rule add to 10.0.0.0/8 table 100 priority 100
$ sudo ip route add 10.0.0.0/8 dev tun0 table 100
# 기본 게이트웨이는 main 테이블에서 일반 ISP 사용

# ── 실무 예시 2: 다중 ISP 라우팅 (완전 구성) ──
# ISP-A: eth0 192.168.1.0/24, gw 192.168.1.1
# ISP-B: eth1 10.0.0.0/24, gw 10.0.0.1

# 테이블 생성 (이름 매핑은 /etc/iproute2/rt_tables)
#   10  isp_a
#   20  isp_b
$ sudo ip route add default via 192.168.1.1 dev eth0 table 10
$ sudo ip route add 192.168.1.0/24 dev eth0 table 10
$ sudo ip route add default via 10.0.0.1 dev eth1 table 20
$ sudo ip route add 10.0.0.0/24 dev eth1 table 20

$ sudo ip rule add from 192.168.1.0/24 table 10 priority 100
$ sudo ip rule add from 10.0.0.0/24 table 20 priority 200`

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

export const ethtoolCode = `# NIC 정보 확인
$ ethtool eth0
Settings for eth0:
    Speed: 1000Mb/s
    Duplex: Full
    Auto-negotiation: on
    Link detected: yes

# NIC 드라이버 정보
$ ethtool -i eth0
driver: e1000e
version: 5.15.0-generic
firmware-version: 0.13-4
bus-info: 0000:00:19.0

# NIC 통계 (드롭, 에러 등)
$ ethtool -S eth0 | head -15
NIC statistics:
     rx_packets: 1234567
     tx_packets: 987654
     rx_bytes: 1073741824
     tx_bytes: 536870912
     rx_errors: 0
     tx_errors: 0
     rx_dropped: 12
     tx_dropped: 0

# Ring buffer 크기 확인 및 변경
$ ethtool -g eth0
Ring parameters for eth0:
Pre-set maximums:
RX:     4096
TX:     4096
Current hardware settings:
RX:     256
TX:     256

$ sudo ethtool -G eth0 rx 2048 tx 2048

# Offload 기능 확인
$ ethtool -k eth0
tx-checksum-ipv4: on
tcp-segmentation-offload: on
generic-receive-offload: on`

export const sysctlCode = `# 현재 IP 포워딩 상태 확인
$ sysctl net.ipv4.ip_forward
net.ipv4.ip_forward = 0

# IP 포워딩 활성화 (라우터/게이트웨이 역할 시 필수)
$ sudo sysctl -w net.ipv4.ip_forward=1

# 영구 설정 (/etc/sysctl.conf 또는 /etc/sysctl.d/*.conf)
net.ipv4.ip_forward = 1

# rp_filter (Reverse Path Filtering)
# 0 = 비활성, 1 = strict mode, 2 = loose mode
$ sysctl net.ipv4.conf.all.rp_filter
net.ipv4.conf.all.rp_filter = 1

# 비대칭 라우팅 환경에서는 loose mode 필요
$ sudo sysctl -w net.ipv4.conf.all.rp_filter=2

# TCP 관련 주요 파라미터
$ sysctl net.ipv4.tcp_syncookies          # SYN flood 방어
net.ipv4.tcp_syncookies = 1

$ sysctl net.ipv4.tcp_max_syn_backlog     # SYN 큐 크기
net.ipv4.tcp_max_syn_backlog = 1024

$ sysctl net.core.somaxconn               # listen() backlog 최대값
net.core.somaxconn = 4096

$ sysctl net.core.rmem_max                # 수신 버퍼 최대 크기
net.core.rmem_max = 16777216

$ sysctl net.core.wmem_max                # 송신 버퍼 최대 크기
net.core.wmem_max = 16777216

$ sysctl net.ipv4.tcp_rmem                # TCP 수신 버퍼 (min default max)
net.ipv4.tcp_rmem = 4096  131072  6291456

$ sysctl net.ipv4.tcp_wmem                # TCP 송신 버퍼 (min default max)
net.ipv4.tcp_wmem = 4096  16384   4194304`

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

export const tcpdumpCode = `# 특정 인터페이스에서 패킷 캡처
$ sudo tcpdump -i eth0 -nn

# 특정 호스트/포트 필터
$ sudo tcpdump -i eth0 host 10.0.0.5 and port 80 -nn

# 패킷 내용까지 출력 (-X: hex + ASCII)
$ sudo tcpdump -i eth0 -X -c 5

# pcap 파일로 저장 (Wireshark에서 분석용)
$ sudo tcpdump -i eth0 -w capture.pcap -c 1000

# TCP 플래그 필터링 (SYN 패킷만)
$ sudo tcpdump -i eth0 'tcp[tcpflags] & tcp-syn != 0' -nn`

export const skbAscii = `┌───────────────────────────────────────────────┐
│                 sk_buff (skb)                 │
├───────────────────────────────────────────────┤
│  head ──────────►┌─────────────────────┐      │
│                  │     headroom        │      │
│  data ──────────►├─────────────────────┤      │
│                  │   L2 (Ethernet)     │      │
│                  │   L3 (IP)           │      │
│                  │   L4 (TCP/UDP)      │      │
│                  │   Payload           │      │
│  tail ──────────►├─────────────────────┤      │
│                  │     tailroom        │      │
│  end  ──────────►└─────────────────────┘      │
├───────────────────────────────────────────────┤
│  dev, protocol, len, data_len, ...            │
│  transport_header, network_header, mac_header │
│  sk (socket), tstamp, mark, priority          │
└───────────────────────────────────────────────┘`
