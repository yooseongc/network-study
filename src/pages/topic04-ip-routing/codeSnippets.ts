export const ipAddrShowCode = `# 리눅스에서 IP 주소 확인
$ ip addr show
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536
    inet 127.0.0.1/8 scope host lo
    inet6 ::1/128 scope host
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500
    inet 192.168.1.100/24 brd 192.168.1.255 scope global eth0
    inet6 fe80::a00:27ff:fe4e:66a1/64 scope link

# Windows에서 IP 주소 확인
> ipconfig
Ethernet adapter Ethernet:
   IPv4 Address. . . . . . . : 192.168.1.100
   Subnet Mask . . . . . . . : 255.255.255.0
   Default Gateway . . . . . : 192.168.1.1`

export const ipRouteShowCode = `# 리눅스 라우팅 테이블 확인
$ ip route show
default via 192.168.1.1 dev eth0 proto dhcp metric 100
10.0.0.0/8 via 10.0.0.1 dev eth1 proto static
172.16.0.0/16 via 172.16.0.1 dev eth2
192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.100

# 특정 목적지에 대한 라우트 확인
$ ip route get 10.1.2.5
10.1.2.5 via 10.0.0.1 dev eth1 src 10.0.0.100 uid 1000

# Windows 라우팅 테이블 확인
> route print
===========================================================================
Active Routes:
Network Destination    Netmask          Gateway       Interface  Metric
          0.0.0.0      0.0.0.0      192.168.1.1   192.168.1.100     25
       10.0.0.0    255.0.0.0       10.0.0.1      10.0.0.100     30
      172.16.0.0  255.255.0.0     172.16.0.1     172.16.0.100     35
     192.168.1.0  255.255.255.0   On-link       192.168.1.100     25`

export const tracerouteCode = `# traceroute: 패킷이 목적지까지 거치는 경로 확인 (TTL 증가)
$ traceroute 8.8.8.8
traceroute to 8.8.8.8 (8.8.8.8), 30 hops max, 60 byte packets
 1  gateway (192.168.1.1)        1.234 ms   0.987 ms   1.102 ms
 2  isp-gw (10.0.0.1)           5.678 ms   5.432 ms   5.891 ms
 3  core-rtr (172.16.0.1)      12.345 ms  12.123 ms  12.567 ms
 4  * * *                                  (응답 없음 — 방화벽)
 5  edge-rtr (203.0.113.1)     15.678 ms  15.432 ms  15.891 ms
 6  google-peer (72.14.236.1)  18.234 ms  18.012 ms  18.456 ms
 7  dns.google (8.8.8.8)       20.123 ms  19.987 ms  20.345 ms

# TTL 값은 각 홉에서 1씩 감소
# TTL이 0이 되면 라우터가 ICMP Time Exceeded 메시지를 반환
# 이를 통해 경로상의 라우터를 하나씩 발견`

export const subnetCalcCode = `# 서브넷 계산 예제: 192.168.1.0/24

IP 주소 (2진수):    11000000.10101000.00000001.00000000
서브넷 마스크:      11111111.11111111.11111111.00000000  (/24)
────────────────────────────────────────────────────────
네트워크 주소:      11000000.10101000.00000001.00000000  → 192.168.1.0
브로드캐스트 주소:  11000000.10101000.00000001.11111111  → 192.168.1.255
호스트 범위:        192.168.1.1 ~ 192.168.1.254
호스트 수:          2^8 - 2 = 254개

# /26 서브넷 분할 예제: 192.168.1.0/26

서브넷 마스크:      11111111.11111111.11111111.11000000  (/26)
────────────────────────────────────────────────────────
서브넷 1: 192.168.1.0/26    (호스트: .1 ~ .63,   62개)
서브넷 2: 192.168.1.64/26   (호스트: .65 ~ .127,  62개)
서브넷 3: 192.168.1.128/26  (호스트: .129 ~ .191, 62개)
서브넷 4: 192.168.1.192/26  (호스트: .193 ~ .254, 62개)`

export const ipv6ExampleCode = `# IPv6 주소 확인
$ ip -6 addr show
1: lo: <LOOPBACK,UP,LOWER_UP>
    inet6 ::1/128 scope host
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP>
    inet6 2001:db8:1::100/64 scope global
    inet6 fe80::a00:27ff:fe4e:66a1/64 scope link

# IPv6 라우팅 테이블
$ ip -6 route show
2001:db8:1::/64 dev eth0 proto kernel metric 256
fe80::/64 dev eth0 proto kernel metric 256
default via 2001:db8:1::1 dev eth0 proto ra metric 1024

# IPv6 ping
$ ping6 2001:db8:1::1
PING 2001:db8:1::1(2001:db8:1::1) 56 data bytes
64 bytes from 2001:db8:1::1: icmp_seq=1 ttl=64 time=0.543 ms`
