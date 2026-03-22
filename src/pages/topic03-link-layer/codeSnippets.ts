/* ── Topic 03 — 물리 계층과 링크 계층 코드 스니펫 ── */

export const ipLinkShowCode = `$ ip link show
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP mode DEFAULT
    link/ether 08:00:27:a1:b2:c3 brd ff:ff:ff:ff:ff:ff
3: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN
    link/ether 02:42:3e:f5:6a:01 brd ff:ff:ff:ff:ff:ff`

export const arpTableCode = `$ arp -n
Address         HWtype  HWaddress           Flags Mask  Iface
10.0.0.1        ether   00:1a:2b:3c:4d:5e   C           eth0
10.0.0.5        ether   08:00:27:a1:b2:c3   C           eth0
10.0.0.254      ether   aa:bb:cc:dd:ee:ff   C           eth0

$ ip neigh show
10.0.0.1 dev eth0 lladdr 00:1a:2b:3c:4d:5e REACHABLE
10.0.0.5 dev eth0 lladdr 08:00:27:a1:b2:c3 STALE
10.0.0.254 dev eth0 lladdr aa:bb:cc:dd:ee:ff DELAY`

export const bridgeFdbCode = `$ bridge fdb show
01:00:5e:00:00:01 dev eth0 self permanent
33:33:00:00:00:01 dev eth0 self permanent
08:00:27:a1:b2:c3 dev eth0 master br0
aa:bb:cc:dd:ee:ff dev eth0 master br0
00:1a:2b:3c:4d:5e dev eth1 master br0`

export const ethtoolCode = `$ ethtool eth0
Settings for eth0:
    Supported ports: [ TP ]
    Supported link modes:   10baseT/Half 10baseT/Full
                            100baseT/Half 100baseT/Full
                            1000baseT/Full
    Speed: 1000Mb/s
    Duplex: Full
    Auto-negotiation: on
    Link detected: yes

$ ethtool -i eth0
driver: e1000e
version: 6.1.0-kernel
firmware-version: 0.13-4
bus-info: 0000:00:19.0`

export const vlanConfigCode = `# VLAN 인터페이스 생성
$ ip link add link eth0 name eth0.100 type vlan id 100
$ ip link set eth0.100 up
$ ip addr add 192.168.100.1/24 dev eth0.100

# VLAN 확인
$ cat /proc/net/vlan/eth0.100
eth0.100  VID: 100   REORDER_HDR: 1  dev->priv_flags: 4001
         total frames received            1532
         total bytes received           142880`

export const bondingCode = `# bonding 모듈 로드 및 설정
$ modprobe bonding mode=802.3ad miimon=100

# bond 인터페이스 생성
$ ip link add bond0 type bond mode 802.3ad
$ ip link set eth0 master bond0
$ ip link set eth1 master bond0
$ ip link set bond0 up

# bonding 상태 확인
$ cat /proc/net/bonding/bond0
Ethernet Channel Bonding Driver: v5.15
Bonding Mode: IEEE 802.3ad Dynamic link aggregation
MII Status: up
802.3ad info
LACP rate: slow
Slave Interface: eth0
  MII Status: up
  Speed: 1000 Mbps
  Duplex: full
Slave Interface: eth1
  MII Status: up
  Speed: 1000 Mbps
  Duplex: full`

export const macAddressCode = `# MAC 주소 확인
$ ip link show eth0
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500
    link/ether 08:00:27:a1:b2:c3 brd ff:ff:ff:ff:ff:ff

# MAC 주소 변경 (테스트용)
$ ip link set dev eth0 down
$ ip link set dev eth0 address 02:42:ac:11:00:02
$ ip link set dev eth0 up`

export const gratuitousArpCode = `# Gratuitous ARP 전송 (arping 사용)
$ arping -U -I eth0 10.0.0.5
ARPING 10.0.0.5 from 10.0.0.5 eth0
Sent 1 probes (1 broadcast(s))

# Gratuitous ARP는 다음 상황에서 사용:
# 1. IP 충돌 감지
# 2. 페일오버 시 MAC 업데이트
# 3. VRRP/HSRP 전환`
