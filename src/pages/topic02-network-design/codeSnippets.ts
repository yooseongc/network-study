// Topic 02 — 실제 네트워크 망 구성의 기초: 코드 스니펫 및 상수

export const homeNetworkConfigCode = `# 가정용 공유기 설정 예시
# WAN (인터넷 측)
WAN IP:       211.234.56.78    (ISP가 할당한 공인 IP)
WAN Gateway:  211.234.56.1
WAN DNS:      168.126.63.1     (KT DNS)

# LAN (내부 측)
LAN IP:       192.168.0.1      (게이트웨이)
Subnet Mask:  255.255.255.0    (/24)
DHCP Range:   192.168.0.100 ~ 192.168.0.254
`

export const enterpriseSubnetCode = `# 기업 네트워크 서브넷 설계 예시
#
# 10.0.0.0/8 대역을 부서/용도별로 분할

# 서버 망
10.10.1.0/24    웹 서버 팜           (254 hosts)
10.10.2.0/24    DB 서버 팜           (254 hosts)
10.10.3.0/24    애플리케이션 서버     (254 hosts)

# 사용자 망
10.20.1.0/24    개발팀               (254 hosts)
10.20.2.0/24    기획팀               (254 hosts)
10.20.3.0/24    영업팀               (254 hosts)

# 관리 망
10.30.1.0/24    네트워크 장비 관리    (254 hosts)
10.30.2.0/24    서버 관리 (IPMI/iLO) (254 hosts)

# DMZ
10.100.1.0/24   공개 웹 서버          (254 hosts)
10.100.2.0/24   메일 서버             (254 hosts)
`

export const privateIpRangesCode = `# RFC 1918 — 사설 IP 대역
#
# Class A:  10.0.0.0    ~ 10.255.255.255    (10.0.0.0/8)
#           → 16,777,216개 주소
#           → 대규모 기업, 데이터센터
#
# Class B:  172.16.0.0  ~ 172.31.255.255    (172.16.0.0/12)
#           → 1,048,576개 주소
#           → 중규모 기업
#
# Class C:  192.168.0.0 ~ 192.168.255.255   (192.168.0.0/16)
#           → 65,536개 주소
#           → 가정, 소규모 사무실
`

export const firewallRuleExample = `# 방화벽 정책 예시 (iptables 형식)
# DMZ → 내부 서버망 접근 차단
iptables -A FORWARD -s 10.100.0.0/16 -d 10.10.0.0/16 -j DROP

# 외부 → DMZ 웹 서버 80/443 허용
iptables -A FORWARD -i eth0 -d 10.100.1.0/24 \\
         -p tcp --dport 80  -j ACCEPT
iptables -A FORWARD -i eth0 -d 10.100.1.0/24 \\
         -p tcp --dport 443 -j ACCEPT

# 사용자망 → 인터넷 허용 (NAT)
iptables -t nat -A POSTROUTING -s 10.20.0.0/16 \\
         -o eth0 -j MASQUERADE

# 관리망은 특정 관리자 IP만 접근 허용
iptables -A INPUT -s 10.30.1.10 -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -j DROP
`

export const redundancyConfigCode = `# VRRP (Virtual Router Redundancy Protocol) 설정 예시
#
# Router A (Master)
interface eth0
  ip address 10.10.1.2/24
  vrrp 1 priority 200          ← 높은 우선순위 = Master
  vrrp 1 virtual-ip 10.10.1.1  ← 가상 IP (게이트웨이)

# Router B (Backup)
interface eth0
  ip address 10.10.1.3/24
  vrrp 1 priority 100          ← 낮은 우선순위 = Backup
  vrrp 1 virtual-ip 10.10.1.1  ← 같은 가상 IP

# 서버/PC의 기본 게이트웨이 = 10.10.1.1 (가상 IP)
# Router A 장애 시 → Router B가 자동으로 Master 승격
`

/* ── 신규 스니펫 (2.4 / 2.9 확장) ──────────────────────────────────── */

export const keepalivedVrrpCode = `# Keepalived VRRP 설정 — /etc/keepalived/keepalived.conf
#
# ── Master 노드 ──
vrrp_instance VI_1 {
    state MASTER
    interface eth0
    virtual_router_id 51
    priority 200                  # Master: 높은 값
    advert_int 1                  # Advertisement 간격 (초)
    authentication {
        auth_type PASS
        auth_pass s3cret          # 양쪽 동일해야 함
    }
    virtual_ipaddress {
        10.10.1.1/24 dev eth0     # 가상 IP (VIP)
    }
    track_interface {
        eth0 weight -50           # 인터페이스 down 시 우선순위 -50
    }
    track_script {
        chk_haproxy               # 헬스체크 스크립트 연동
    }
}

vrrp_script chk_haproxy {
    script "/usr/bin/pgrep haproxy"
    interval 2
    weight -30                    # 프로세스 없으면 우선순위 -30
}

# ── Backup 노드 (차이점만) ──
# state BACKUP
# priority 100
`

export const lacpBondingCode = `# Linux NIC Bonding (LACP / 802.3ad) 설정
#
# ── /etc/netplan/01-bond.yaml (Ubuntu/Netplan) ──
network:
  version: 2
  ethernets:
    eth0: {}
    eth1: {}
  bonds:
    bond0:
      interfaces: [eth0, eth1]
      parameters:
        mode: 802.3ad           # LACP (mode 4)
        lacp-rate: fast         # 1초 간격 LACPDU
        mii-monitor-interval: 100
        transmit-hash-policy: layer3+4
        min-links: 1            # 최소 활성 링크 수
      addresses:
        - 10.10.1.10/24
      routes:
        - to: default
          via: 10.10.1.1

# ── Bonding 모드 비교 ──
# mode 0 (balance-rr)   : 라운드로빈, 스위치 설정 불필요
# mode 1 (active-backup) : 1개만 활성, 나머지 대기
# mode 2 (balance-xor)  : 해시 기반 분산
# mode 4 (802.3ad/LACP) : 스위치와 협상, 가장 권장
# mode 5 (balance-tlb)  : 송신만 분산
# mode 6 (balance-alb)  : 송수신 분산, 스위치 설정 불필요
`

export const ospfBasicCode = `# OSPF 기본 설정 (Cisco IOS 형식)
#
# ── Core Router (Area 0 — Backbone) ──
router ospf 1
  router-id 1.1.1.1
  network 10.10.0.0 0.0.255.255 area 0    # 서버망
  network 10.20.0.0 0.0.255.255 area 0    # 사용자망
  passive-interface default               # 모든 인터페이스 passive
  no passive-interface GigabitEthernet0/0  # OSPF 네이버 형성 허용
  no passive-interface GigabitEthernet0/1

# ── Interface 설정 ──
interface GigabitEthernet0/0
  ip address 10.10.1.1 255.255.255.0
  ip ospf cost 10                          # 낮은 cost = 우선 경로
  ip ospf hello-interval 10
  ip ospf dead-interval 40

# ── OSPF 경로 확인 ──
# show ip ospf neighbor          → 네이버 상태 확인
# show ip ospf database          → LSDB 확인
# show ip route ospf             → OSPF 학습 경로
`

export const switchVerifyCommandsCode = `# ── L2 스위치 확인 명령어 ──

# MAC 주소 테이블 확인
show mac address-table
# VLAN  MAC Address       Type     Ports
# 10    00:1a:2b:3c:4d:5e DYNAMIC  Gi0/1
# 20    00:1a:2b:3c:4d:5f DYNAMIC  Gi0/2

# STP 상태 확인
show spanning-tree
# Root ID    Priority 32768, Address 00:1a:2b:3c:4d:00
# Root Port  Gi0/24 (cost 4)

# VLAN 정보 확인
show vlan brief
# VLAN  Name          Status    Ports
# 10    SERVERS       active    Gi0/1-12
# 20    USERS         active    Gi0/13-24

# ── L3 스위치 / 라우터 확인 명령어 ──

# 인터페이스 상태
show ip interface brief
# Interface          IP-Address    Status  Protocol
# Vlan10             10.10.1.1     up      up
# Vlan20             10.20.1.1     up      up
# GigabitEthernet0/0 203.0.113.1   up      up

# 라우팅 테이블 확인
show ip route
# O    10.10.2.0/24 [110/20] via 10.10.1.2, Vlan10
# C    10.10.1.0/24 is directly connected, Vlan10
# S*   0.0.0.0/0 [1/0] via 203.0.113.1

# VRRP 상태 확인
show vrrp brief
# Interface  Grp  Pri  State   VR Addr
# Vlan10     1    200  Master  10.10.1.1
# Vlan20     2    200  Master  10.20.1.1

# LACP 상태 확인
show lacp neighbor
# Port     Partner          Port-Priority  Oper Key
# Gi0/1    00:1a:2b:3c:00   32768          0x1
# Gi0/2    00:1a:2b:3c:01   32768          0x1
`

export const dualIspVrrpDiagramCode = `# ── 사무실 인터넷 접속망 이중화 구성 ──
#
#   ISP-A (KT)           ISP-B (SK)
#     |                     |
#  [Router-A]           [Router-B]
#  pri=200               pri=100
#     |    VRRP VIP:        |
#     |  203.0.113.1/24     |
#     +--------+------------+
#              |
#        [Core Switch]
#         LACP bond0
#        /          \\
#  [Dist-SW-A]   [Dist-SW-B]     ← MC-LAG / vPC
#     |    \\     /    |
#     |     \\   /     |
#  [Access-SW]   [Access-SW]
#     |               |
#   [PC/서버]       [PC/서버]
#
# ▸ Router-A 장애 → VRRP failover → Router-B가 Master 승격
# ▸ ISP-A 장애   → BFD 감지 → 경로 전환 (< 1초)
# ▸ 링크 장애    → LACP failover → 나머지 링크로 트래픽 유지
`

export const serverFarmHaDiagramCode = `# ── 서버팜 이중화 구성 (Dual ToR) ──
#
#         [Core-SW-A]───────[Core-SW-B]
#              |     MC-LAG      |
#         [ToR-SW-A]────────[ToR-SW-B]    ← Top-of-Rack
#          /  |   \\          /  |   \\
#        S1   S2   S3      S4   S5   S6   ← 서버 (dual NIC)
#        (bond0: LACP to ToR-A + ToR-B)
#
#         [LB-A]────────────[LB-B]        ← Active-Standby HA
#          VIP: 10.10.1.100
#
# ▸ 서버 NIC: bond0 (LACP) → ToR-A + ToR-B에 각 1포트씩
# ▸ ToR 스위치: MC-LAG으로 서버의 LACP bond를 양쪽에서 수용
# ▸ Core-ToR 간: ECMP 또는 MLAG peer-link
# ▸ LB HA pair: VRRP로 VIP 공유, health check로 서버 상태 감시
`

export const vlanSwitchConfigCode = `# ── Cisco IOS 스위치 VLAN 설정 예시 ──────────────────────

# 1) VLAN 생성
Switch(config)# vlan 100
Switch(config-vlan)# name SERVER
Switch(config)# vlan 200
Switch(config-vlan)# name USER
Switch(config)# vlan 300
Switch(config-vlan)# name MGMT
Switch(config)# vlan 400
Switch(config-vlan)# name VOIP
Switch(config)# vlan 500
Switch(config-vlan)# name GUEST
Switch(config)# vlan 999
Switch(config-vlan)# name UNUSED

# 2) Access 포트 설정 (사용자 PC 연결 포트)
Switch(config)# interface GigabitEthernet0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 200
Switch(config-if)# spanning-tree portfast

# 3) IP Phone + PC 연결 포트 (Voice VLAN)
Switch(config)# interface GigabitEthernet0/2
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 200      ! PC 트래픽
Switch(config-if)# switchport voice vlan 400        ! VoIP 트래픽

# 4) Trunk 포트 설정 (스위치 간 연결)
Switch(config)# interface GigabitEthernet0/24
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 100,200,300,400
Switch(config-if)# switchport trunk native vlan 999  ! 보안: 미사용 VLAN

# 5) 미사용 포트 보안 처리
Switch(config)# interface range GigabitEthernet0/10-20
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 999
Switch(config-if-range)# shutdown

# ── Linux VLAN 설정 (iproute2) ────────────────────────
$ ip link add link eth0 name eth0.100 type vlan id 100
$ ip addr add 10.10.0.10/16 dev eth0.100
$ ip link set eth0.100 up`

