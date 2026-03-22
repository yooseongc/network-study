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
