export const iptablesListCode = `# iptables 규칙 전체 확인 (줄 번호 + 패킷 카운터)
$ sudo iptables -L -n -v --line-numbers
Chain INPUT (policy ACCEPT 0 packets, 0 bytes)
num   pkts bytes target   prot opt in  out  source      destination
1     1234  98K ACCEPT   all  --  lo  *    0.0.0.0/0   0.0.0.0/0
2     5678 450K ACCEPT   all  --  *   *    0.0.0.0/0   0.0.0.0/0   state RELATED,ESTABLISHED
3      123  10K ACCEPT   tcp  --  *   *    0.0.0.0/0   0.0.0.0/0   tcp dpt:22
4       45  3K  ACCEPT   tcp  --  *   *    0.0.0.0/0   0.0.0.0/0   tcp dpt:80
5        0   0  DROP     all  --  *   *    0.0.0.0/0   0.0.0.0/0

Chain FORWARD (policy DROP 0 packets, 0 bytes)
num   pkts bytes target   prot opt in     out    source        destination
1     8901 700K ACCEPT   all  --  eth1   eth0   10.0.0.0/24   0.0.0.0/0   state RELATED,ESTABLISHED
2     2345 180K ACCEPT   all  --  eth0   eth1   0.0.0.0/0     10.0.0.0/24

Chain OUTPUT (policy ACCEPT 12345 packets, 1M bytes)
num   pkts bytes target   prot opt in  out  source      destination`

export const iptablesBasicCode = `# 기본 방화벽 정책 설정
$ sudo iptables -P INPUT DROP        # 기본 차단
$ sudo iptables -P FORWARD DROP      # 기본 차단
$ sudo iptables -P OUTPUT ACCEPT     # 기본 허용

# 루프백 허용
$ sudo iptables -A INPUT -i lo -j ACCEPT

# 이미 연결된 세션 허용 (stateful)
$ sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# SSH 허용 (특정 IP에서만)
$ sudo iptables -A INPUT -p tcp -s 192.168.1.0/24 --dport 22 -j ACCEPT

# HTTP/HTTPS 허용
$ sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
$ sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# ICMP(ping) 허용
$ sudo iptables -A INPUT -p icmp --icmp-type echo-request -j ACCEPT

# 나머지 차단 (로깅 후 드롭)
$ sudo iptables -A INPUT -j LOG --log-prefix "IPT-DROP: "
$ sudo iptables -A INPUT -j DROP

# 규칙 삭제 (줄 번호 지정)
$ sudo iptables -D INPUT 3

# 규칙 저장 / 복원
$ sudo iptables-save > /etc/iptables/rules.v4
$ sudo iptables-restore < /etc/iptables/rules.v4`

export const nftablesCode = `# nftables 테이블 및 체인 생성
$ sudo nft add table inet my_filter
$ sudo nft add chain inet my_filter input \\
    { type filter hook input priority 0 \\; policy drop \\; }
$ sudo nft add chain inet my_filter forward \\
    { type filter hook forward priority 0 \\; policy drop \\; }
$ sudo nft add chain inet my_filter output \\
    { type filter hook output priority 0 \\; policy accept \\; }

# 규칙 추가
$ sudo nft add rule inet my_filter input iif lo accept
$ sudo nft add rule inet my_filter input ct state established,related accept
$ sudo nft add rule inet my_filter input tcp dport { 22, 80, 443 } accept
$ sudo nft add rule inet my_filter input ip protocol icmp accept
$ sudo nft add rule inet my_filter input log prefix "NFT-DROP: " drop

# 규칙 확인
$ sudo nft list ruleset
table inet my_filter {
    chain input {
        type filter hook input priority filter; policy drop;
        iif "lo" accept
        ct state established,related accept
        tcp dport { 22, 80, 443 } accept
        ip protocol icmp accept
        log prefix "NFT-DROP: " drop
    }
    chain forward {
        type filter hook forward priority filter; policy drop;
    }
    chain output {
        type filter hook output priority filter; policy accept;
    }
}

# 규칙 삭제 (핸들 번호 확인 후)
$ sudo nft -a list chain inet my_filter input   # handle 확인
$ sudo nft delete rule inet my_filter input handle 5`

export const conntrackCode = `# conntrack 엔트리 전체 확인
$ sudo conntrack -L
tcp      6 431999 ESTABLISHED src=192.168.1.100 dst=10.0.0.5 \\
    sport=49876 dport=443 src=10.0.0.5 dst=192.168.1.100 \\
    sport=443 dport=49876 [ASSURED] mark=0 use=1
udp     17 29 src=192.168.1.100 dst=8.8.8.8 sport=33456 dport=53 \\
    src=8.8.8.8 dst=192.168.1.100 sport=53 dport=33456 mark=0 use=1
tcp      6 117 TIME_WAIT src=192.168.1.100 dst=10.0.0.10 \\
    sport=51234 dport=80 src=10.0.0.10 dst=192.168.1.100 \\
    sport=80 dport=51234 [ASSURED] mark=0 use=1

# 엔트리 수 확인
$ sudo conntrack -C
256

# 최대 conntrack 테이블 크기 확인/변경
$ sysctl net.netfilter.nf_conntrack_max
net.netfilter.nf_conntrack_max = 65536

$ sudo sysctl -w net.netfilter.nf_conntrack_max=131072

# conntrack 이벤트 실시간 감시
$ sudo conntrack -E
[NEW] tcp      6 120 SYN_SENT src=192.168.1.100 dst=10.0.0.5 sport=52000 dport=80
[UPDATE] tcp   6 60 SYN_RECV src=192.168.1.100 dst=10.0.0.5 sport=52000 dport=80
[UPDATE] tcp   6 432000 ESTABLISHED src=192.168.1.100 dst=10.0.0.5 sport=52000 dport=80

# 특정 조건으로 필터
$ sudo conntrack -L -p tcp --dport 443 --state ESTABLISHED`

export const snatDnatCode = `# ── SNAT (Source NAT) ────────────────────────────────────
# 내부망(10.0.0.0/24) → 외부 나갈 때 출발지를 공인 IP로 변환
$ sudo iptables -t nat -A POSTROUTING \\
    -s 10.0.0.0/24 -o eth0 \\
    -j SNAT --to-source 203.0.113.10

# ── MASQUERADE (동적 SNAT) ──────────────────────────────
# 공인 IP가 동적으로 바뀌는 환경 (PPPoE, DHCP 등)
$ sudo iptables -t nat -A POSTROUTING \\
    -s 10.0.0.0/24 -o eth0 \\
    -j MASQUERADE

# ── DNAT (Destination NAT) ──────────────────────────────
# 외부에서 공인 IP:80으로 접근 → 내부 웹서버 10.0.0.5:8080으로 전달
$ sudo iptables -t nat -A PREROUTING \\
    -d 203.0.113.10 -p tcp --dport 80 \\
    -j DNAT --to-destination 10.0.0.5:8080

# 내부에서도 공인 IP로 접근 시 DNAT 적용 (hairpin NAT)
$ sudo iptables -t nat -A OUTPUT \\
    -d 203.0.113.10 -p tcp --dport 80 \\
    -j DNAT --to-destination 10.0.0.5:8080

# FORWARD 체인에서 해당 트래픽 허용 필수
$ sudo iptables -A FORWARD \\
    -d 10.0.0.5 -p tcp --dport 8080 \\
    -j ACCEPT`

export const portForwardCode = `# 포트 포워딩: 외부 2222 → 내부 SSH (10.0.0.5:22)
$ sudo iptables -t nat -A PREROUTING \\
    -p tcp --dport 2222 \\
    -j DNAT --to-destination 10.0.0.5:22

$ sudo iptables -A FORWARD \\
    -d 10.0.0.5 -p tcp --dport 22 \\
    -j ACCEPT

# 여러 서비스 포트 포워딩
$ sudo iptables -t nat -A PREROUTING -p tcp --dport 8080 \\
    -j DNAT --to-destination 10.0.0.10:80     # 웹서버
$ sudo iptables -t nat -A PREROUTING -p tcp --dport 3307 \\
    -j DNAT --to-destination 10.0.0.20:3306   # DB서버
$ sudo iptables -t nat -A PREROUTING -p udp --dport 51820 \\
    -j DNAT --to-destination 10.0.0.30:51820  # WireGuard

# nftables로 포트 포워딩
$ sudo nft add table ip nat
$ sudo nft add chain ip nat prerouting \\
    { type nat hook prerouting priority -100 \\; }
$ sudo nft add rule ip nat prerouting \\
    tcp dport 2222 dnat to 10.0.0.5:22`

export const fwmarkCode = `# ── 패킷에 mark 설정 (iptables mangle 테이블) ──────────
# HTTPS 트래픽에 mark 1 부여
$ sudo iptables -t mangle -A PREROUTING \\
    -p tcp --dport 443 -j MARK --set-mark 0x1

# 특정 출발지에 mark 2 부여
$ sudo iptables -t mangle -A PREROUTING \\
    -s 10.0.1.0/24 -j MARK --set-mark 0x2

# ── mark 기반 policy routing ────────────────────────────
# mark 1 → 별도 라우팅 테이블 100 사용 (ISP-A 경로)
$ sudo ip rule add fwmark 0x1 table 100
$ sudo ip route add default via 203.0.113.1 dev eth0 table 100

# mark 2 → 별도 라우팅 테이블 200 사용 (ISP-B 경로)
$ sudo ip rule add fwmark 0x2 table 200
$ sudo ip route add default via 198.51.100.1 dev eth1 table 200

# 확인
$ ip rule show
0:      from all lookup local
100:    from all fwmark 0x1 lookup 100
200:    from all fwmark 0x2 lookup 200
32766:  from all lookup main
32767:  from all lookup default

# nftables에서 mark 설정
$ sudo nft add rule inet my_filter prerouting \\
    tcp dport 443 meta mark set 0x1`

export const tproxyCode = `# ── TPROXY 설정 (Squid 등의 transparent proxy) ──────────
# 1) IP rule: mark 1 → 로컬 라우팅 테이블 100
$ sudo ip rule add fwmark 0x1 lookup 100
$ sudo ip route add local 0.0.0.0/0 dev lo table 100

# 2) iptables: HTTP 트래픽을 TPROXY로 리다이렉트
$ sudo iptables -t mangle -A PREROUTING \\
    -p tcp --dport 80 \\
    -j TPROXY --tproxy-mark 0x1/0x1 --on-port 3129

# 3) HTTPS도 TPROXY 적용 시
$ sudo iptables -t mangle -A PREROUTING \\
    -p tcp --dport 443 \\
    -j TPROXY --tproxy-mark 0x1/0x1 --on-port 3130

# 4) 이미 확립된 연결은 mark만 부여
$ sudo iptables -t mangle -A PREROUTING \\
    -m socket -j MARK --set-mark 0x1

# ── REDIRECT 방식 (단순 transparent proxy) ──────────────
# 목적지를 로컬 프록시 포트로 변경 (소켓 원본 정보 손실)
$ sudo iptables -t nat -A PREROUTING \\
    -p tcp --dport 80 \\
    -j REDIRECT --to-port 3128

# TPROXY vs REDIRECT 차이:
# TPROXY: 원본 목적지 IP/포트 보존, IP_TRANSPARENT 소켓 사용
# REDIRECT: 목적지를 로컬로 변경, getsockopt(SO_ORIGINAL_DST)로 원본 확인`

export const natTableAscii = `┌──────────────────────────────────────────────────────────────────┐
│                    iptables 테이블 구조                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │  raw     │  │  mangle  │  │   nat    │  │  filter  │         │
│  │ (추적   │  │ (패킷   │  │ (주소   │  │ (허용/  │          │
│  │  제외)  │  │  변조)  │  │  변환)  │  │  차단)  │          │
│  └─────────┘  └──────────┘  └──────────┘  └──────────┘         │
│                                                                  │
│  우선순위: raw → mangle → nat → filter                          │
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐        │
│  │               체인 (Chain)                          │        │
│  │  PREROUTING : 패킷 도착 직후                       │        │
│  │  INPUT      : 로컬 프로세스로 전달 전              │        │
│  │  FORWARD    : 다른 인터페이스로 전달 시            │        │
│  │  OUTPUT     : 로컬 프로세스에서 나갈 때            │        │
│  │  POSTROUTING: 패킷이 나가기 직전                   │        │
│  └─────────────────────────────────────────────────────┘        │
└──────────────────────────────────────────────────────────────────┘`
