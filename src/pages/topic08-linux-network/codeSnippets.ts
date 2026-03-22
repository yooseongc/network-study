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
$ ip addr show dev eth0

# IP 주소 추가/삭제
$ sudo ip addr add 10.0.0.10/24 dev eth0
$ sudo ip addr del 10.0.0.10/24 dev eth0`

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
