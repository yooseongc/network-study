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

export const sysctlAdvancedCode = `# ── rp_filter 상세 ──
# strict(1): 수신 패킷의 src로 역라우팅 → 같은 인터페이스여야 통과
# loose(2): 어떤 인터페이스로든 라우팅 가능하면 통과
# 인터페이스별 개별 설정 (all과 인터페이스 설정 중 max 값이 적용)
$ sysctl net.ipv4.conf.eth0.rp_filter
$ sysctl net.ipv4.conf.eth1.rp_filter

# ── ip_forward 인터페이스별 설정 ──
$ sysctl net.ipv4.conf.all.forwarding        # 전체
$ sysctl net.ipv4.conf.eth0.forwarding       # 특정 인터페이스

# ── TCP 성능 튜닝 ──
# tcp_tw_reuse: TIME_WAIT 소켓 재사용 (클라이언트 측)
$ sysctl net.ipv4.tcp_tw_reuse
net.ipv4.tcp_tw_reuse = 2

# tcp_fin_timeout: FIN_WAIT_2 타임아웃 (기본 60초)
$ sysctl net.ipv4.tcp_fin_timeout
net.ipv4.tcp_fin_timeout = 60

# tcp_keepalive_time: keepalive 프로브 시작까지 대기 시간
$ sysctl net.ipv4.tcp_keepalive_time
net.ipv4.tcp_keepalive_time = 7200

# ── 네트워크 버퍼 ──
# netdev_budget: softirq 한 번에 처리할 최대 패킷 수
$ sysctl net.core.netdev_budget
net.core.netdev_budget = 300

# netdev_max_backlog: 인터페이스별 수신 큐 최대 길이
$ sysctl net.core.netdev_max_backlog
net.core.netdev_max_backlog = 1000

# ── 실무 예시: 고부하 웹 서버 튜닝 ──
$ cat /etc/sysctl.d/99-webserver.conf
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 65535
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 87380 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216
net.ipv4.tcp_fin_timeout = 30
net.ipv4.tcp_tw_reuse = 1
net.core.netdev_max_backlog = 5000`
