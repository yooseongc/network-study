export const pingCode = `# 네트워크 연결 확인 — ICMP Echo Request/Reply
$ ping 8.8.8.8
PING 8.8.8.8 (8.8.8.8): 56 data bytes
64 bytes from 8.8.8.8: icmp_seq=0 ttl=117 time=3.42 ms
64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=3.51 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=117 time=3.38 ms

--- 8.8.8.8 ping statistics ---
3 packets transmitted, 3 packets received, 0% packet loss
round-trip min/avg/max/stddev = 3.380/3.437/3.510/0.054 ms`

export const mtuCheckCode = `# 현재 인터페이스의 MTU 확인
$ ip link show eth0
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel
    state UP mode DEFAULT group default qlen 1000
    link/ether 00:11:22:33:44:55 brd ff:ff:ff:ff:ff:ff

# MTU 변경 (관리자 권한 필요)
$ sudo ip link set eth0 mtu 9000

# Path MTU Discovery 테스트 (DF 비트 설정)
$ ping -M do -s 1472 8.8.8.8
PING 8.8.8.8 (8.8.8.8): 1472 data bytes
1480 bytes from 8.8.8.8: icmp_seq=0 ttl=117 time=3.52 ms`

export const tracerouteCode = `# 패킷이 목적지까지 거치는 경로 확인
$ traceroute www.google.com
traceroute to www.google.com (142.250.196.100), 30 hops max
 1  gateway (192.168.1.1)     1.234 ms
 2  isp-router (10.0.0.1)    5.678 ms
 3  core-router (172.16.0.1) 10.123 ms
 4  google-edge (142.250.196.100) 12.456 ms`

export const ethernetFrameAscii = `┌──────────┬──────────┬──────┬─────────────────────┬─────┐
│ Dest MAC │ Src MAC  │ Type │      Payload        │ FCS │
│  6 bytes │ 6 bytes  │  2B  │  46 ~ 1500 bytes    │ 4B  │
└──────────┴──────────┴──────┴─────────────────────┴─────┘
  ← ─ ─ ─ ─ ─ ─  Ethernet Frame (14 + payload + 4)  ─ ─ ─ ─ ─ ─ →`

export const ipPacketAscii = `┌─────────┬─────┬──────┬──────┬──────┬─────────────────┐
│ Version │ IHL │  TOS │ Total Length │  Identification │
├─────────┴─────┼──────┼──────┴──────┤                 │
│    Flags      │ Fragment Offset    │                 │
├───────────────┼────────────────────┼─────────────────┤
│      TTL      │     Protocol       │ Header Checksum │
├───────────────┴────────────────────┴─────────────────┤
│                 Source IP Address                     │
├──────────────────────────────────────────────────────┤
│              Destination IP Address                  │
├──────────────────────────────────────────────────────┤
│                    Payload                           │
└──────────────────────────────────────────────────────┘`
