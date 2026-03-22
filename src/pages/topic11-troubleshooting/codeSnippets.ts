export const pingCode = `# 기본 ping (ICMP Echo Request → Echo Reply)
$ ping -c 4 192.168.1.1
PING 192.168.1.1 (192.168.1.1) 56(84) bytes of data.
64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=0.523 ms
64 bytes from 192.168.1.1: icmp_seq=2 ttl=64 time=0.412 ms
64 bytes from 192.168.1.1: icmp_seq=3 ttl=64 time=0.398 ms
64 bytes from 192.168.1.1: icmp_seq=4 ttl=64 time=0.445 ms

--- 192.168.1.1 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max/mdev = 0.398/0.444/0.523/0.050 ms

# 패킷 크기 지정 (MTU 문제 진단 시 유용)
$ ping -c 3 -s 1472 -M do 10.0.0.1
PING 10.0.0.1 (10.0.0.1) 1472(1500) bytes of data.
ping: local error: message too long, mtu=1400

# 인터페이스 지정
$ ping -c 3 -I eth0 8.8.8.8

# TTL 지정 (hop 수 제한)
$ ping -c 3 -t 5 10.0.0.1

# ping 실패 예시 (호스트 도달 불가)
$ ping -c 3 10.0.0.99
PING 10.0.0.99 (10.0.0.99) 56(84) bytes of data.
From 192.168.1.1 icmp_seq=1 Destination Host Unreachable
From 192.168.1.1 icmp_seq=2 Destination Host Unreachable`

export const tracerouteCode = `# traceroute: 경로 상의 각 홉(라우터)을 추적
$ traceroute -n 8.8.8.8
traceroute to 8.8.8.8 (8.8.8.8), 30 hops max, 60 byte packets
 1  192.168.1.1      0.523 ms  0.412 ms  0.398 ms
 2  10.0.0.1         2.123 ms  1.987 ms  2.045 ms
 3  172.16.0.1       5.234 ms  5.012 ms  5.145 ms
 4  * * *            ← 해당 라우터가 ICMP 응답을 하지 않음
 5  209.85.243.177   8.456 ms  8.123 ms  8.234 ms
 6  8.8.8.8          9.012 ms  8.876 ms  8.945 ms

# TCP 기반 traceroute (방화벽이 ICMP를 차단할 때)
$ sudo traceroute -T -p 443 -n 10.0.0.5

# UDP 기반 (기본)
$ traceroute -U -n 10.0.0.5`

export const mtrCode = `# mtr: ping + traceroute 통합 (실시간 모니터링)
$ mtr -n --report -c 100 8.8.8.8
Start: 2024-01-15T10:30:00+0900
HOST:                  Loss%   Snt   Last   Avg  Best  Wrst StDev
  1.|-- 192.168.1.1     0.0%   100    0.5   0.6   0.3   1.2   0.2
  2.|-- 10.0.0.1        0.0%   100    2.1   2.3   1.8   4.5   0.4
  3.|-- 172.16.0.1      2.0%   100    5.2   5.8   4.1  12.3   1.5
  4.|-- 209.85.243.177  0.0%   100    8.5   8.9   7.2  15.6   1.2
  5.|-- 8.8.8.8         0.0%   100    9.0   9.3   8.1  14.2   1.0

# 해석 포인트:
# - Loss% > 0 인 홉: 해당 구간에서 패킷 유실 발생
# - 특정 홉부터 Loss 증가 → 해당 구간이 병목
# - StDev가 큰 홉: 지터(jitter)가 심함, 불안정한 구간
# - 마지막 홉만 Loss 있으면: 목적지 자체 문제

# JSON 출력 (스크립트 연동)
$ mtr -n --report --json 8.8.8.8`

export const tcpdumpBasicCode = `# 기본 캡처 (모든 패킷, 이름 해석 안 함)
$ sudo tcpdump -i eth0 -nn

# 특정 호스트 필터
$ sudo tcpdump -i eth0 host 10.0.0.5 -nn

# 특정 포트 필터
$ sudo tcpdump -i eth0 port 443 -nn

# 호스트 + 포트 조합
$ sudo tcpdump -i eth0 host 10.0.0.5 and port 80 -nn

# 특정 방향 (src/dst)
$ sudo tcpdump -i eth0 src host 192.168.1.100 and dst port 443 -nn

# 프로토콜 필터
$ sudo tcpdump -i eth0 icmp -nn
$ sudo tcpdump -i eth0 tcp -nn
$ sudo tcpdump -i eth0 udp port 53 -nn

# 패킷 수 제한
$ sudo tcpdump -i eth0 -c 100 -nn

# 파일로 저장 (Wireshark에서 열기)
$ sudo tcpdump -i eth0 -w capture.pcap -c 1000

# 저장된 파일 읽기
$ sudo tcpdump -r capture.pcap -nn

# 패킷 내용 출력 (-X: hex+ASCII, -v: 상세)
$ sudo tcpdump -i eth0 -X -v -c 5 -nn`

export const tcpdumpFlagCode = `# TCP SYN 패킷만 캡처 (연결 시도)
$ sudo tcpdump -i eth0 'tcp[tcpflags] & tcp-syn != 0' -nn

# SYN-ACK 패킷만 (연결 수락)
$ sudo tcpdump -i eth0 'tcp[tcpflags] & (tcp-syn|tcp-ack) == (tcp-syn|tcp-ack)' -nn

# RST 패킷만 (연결 거부/비정상 종료)
$ sudo tcpdump -i eth0 'tcp[tcpflags] & tcp-rst != 0' -nn

# FIN 패킷만 (정상 종료)
$ sudo tcpdump -i eth0 'tcp[tcpflags] & tcp-fin != 0' -nn

# 3-way handshake 전체 캡처 (포트 80)
$ sudo tcpdump -i eth0 port 80 and \\
  '(tcp[tcpflags] & (tcp-syn|tcp-ack|tcp-fin|tcp-rst) != 0)' -nn

# tcpdump 출력 해석 예시:
# 10:30:01.123456 IP 192.168.1.100.54321 > 10.0.0.5.80: Flags [S], seq 1000, win 65535
# 10:30:01.124567 IP 10.0.0.5.80 > 192.168.1.100.54321: Flags [S.], seq 2000, ack 1001, win 28960
# 10:30:01.124789 IP 192.168.1.100.54321 > 10.0.0.5.80: Flags [.], ack 2001, win 65535
#
# Flags 표기:  S=SYN  .=ACK  F=FIN  R=RST  P=PSH  U=URG
# [S]   = SYN
# [S.]  = SYN+ACK
# [.]   = ACK
# [P.]  = PSH+ACK (데이터 전송)
# [F.]  = FIN+ACK (연결 종료)
# [R.]  = RST+ACK (연결 리셋)`

export const dnsDebugCode = `# DNS 조회 확인
$ dig example.com
;; ANSWER SECTION:
example.com.    3600    IN    A    93.184.216.34
;; Query time: 12 msec
;; SERVER: 8.8.8.8#53(8.8.8.8)

# 특정 DNS 서버 지정
$ dig @8.8.8.8 example.com

# DNS 추적 (재귀 질의 전체 경로)
$ dig +trace example.com

# 역방향 DNS 조회
$ dig -x 93.184.216.34

# DNS 서버 응답 확인 (서버 문제 진단)
$ dig @192.168.1.1 example.com +short
93.184.216.34

$ dig @192.168.1.1 example.com +short
;; connection timed out   ← DNS 서버 장애

# nslookup으로 빠른 확인
$ nslookup example.com
Server:   192.168.1.1
Address:  192.168.1.1#53
Non-authoritative answer:
Name: example.com
Address: 93.184.216.34

# /etc/resolv.conf 확인
$ cat /etc/resolv.conf
nameserver 192.168.1.1
nameserver 8.8.8.8
search example.local

# systemd-resolved 상태 확인
$ resolvectl status
Link 2 (eth0):
  DNS Servers: 192.168.1.1
  DNS Domain: example.local`

export const tcpDebugCode = `# TCP 연결 상태 확인
$ ss -tnp
State    Recv-Q  Send-Q  Local Address:Port    Peer Address:Port
ESTAB    0       0       192.168.1.100:22      192.168.1.50:51234
SYN-SENT 0       1       192.168.1.100:54321   10.0.0.5:443     ← 연결 시도 중
CLOSE-WAIT 0     0       192.168.1.100:8080    10.0.0.10:55432   ← 상대방이 종료했지만 미처리

# SYN_SENT 상태가 많으면: 목적지 도달 불가 또는 방화벽 차단
$ ss -tn state syn-sent
Recv-Q Send-Q Local Address:Port  Peer Address:Port
0      1      192.168.1.100:54321 10.0.0.5:443

# TIME_WAIT 상태 확인 (과다 시 포트 고갈 가능)
$ ss -tn state time-wait | wc -l
245

# TCP 재전송 통계 확인
$ ss -ti dst 10.0.0.5
    cubic wscale:7,7 rto:204 rtt:1.5/0.5 retrans:0/3
    ← retrans: 현재/누적 재전송 횟수

# netstat으로 TCP 상태별 카운트
$ ss -tan | awk '{print $1}' | sort | uniq -c | sort -rn
     15 ESTAB
      5 TIME-WAIT
      3 LISTEN
      2 SYN-SENT
      1 CLOSE-WAIT

# 커널 TCP 재전송 통계
$ cat /proc/net/snmp | grep Tcp:
Tcp: ... RetransSegs ...
Tcp: ... 1234 ...`

export const mtuDebugCode = `# 현재 MTU 확인
$ ip link show eth0
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 ...

# PMTU 확인 (Path MTU Discovery)
$ ip route get 10.0.0.5
10.0.0.5 via 192.168.1.1 dev eth0 src 192.168.1.100
    cache  mtu 1400   ← 경로상 실제 MTU (PMTU)

# DF 비트 설정하여 MTU 테스트
$ ping -c 1 -s 1472 -M do 10.0.0.5
# 1472 + 28 (IP 20 + ICMP 8) = 1500 → MTU 1500이면 성공
# MTU가 더 작으면: "message too long, mtu=XXXX"

# MTU 이진 탐색 방법
$ ping -c 1 -s 1472 -M do 10.0.0.5    # 실패 → MTU < 1500
$ ping -c 1 -s 1400 -M do 10.0.0.5    # 성공 → 1400 < MTU < 1500
$ ping -c 1 -s 1436 -M do 10.0.0.5    # 성공 → MTU ≈ 1464

# MTU 변경
$ sudo ip link set eth0 mtu 1400

# MSS clamping (VPN/터널에서 자주 사용)
$ sudo iptables -t mangle -A FORWARD \\
  -p tcp --tcp-flags SYN,RST SYN \\
  -j TCPMSS --clamp-mss-to-pmtu

# PMTU 캐시 확인
$ ip route show cache | grep mtu`

export const ssSocketCode = `# 소켓, 라우팅, 패킷을 함께 보는 통합 진단
# 1단계: 소켓 상태 확인
$ ss -tnp dst 10.0.0.5
State  Recv-Q Send-Q Local Address:Port  Peer Address:Port Process
ESTAB  0      0      192.168.1.100:54321 10.0.0.5:443      users:(("curl",pid=1234))

# 2단계: 라우팅 경로 확인
$ ip route get 10.0.0.5
10.0.0.5 via 192.168.1.1 dev eth0 src 192.168.1.100

# 3단계: ARP/Neighbor 확인
$ ip neigh show dev eth0
192.168.1.1 lladdr 00:11:22:33:44:55 REACHABLE

# 4단계: 인터페이스 통계
$ ip -s link show eth0
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP>
    RX:  bytes  packets errors dropped
         1.2G   890000  0      12
    TX:  bytes  packets errors dropped
         450M   560000  0      0

# 5단계: 커널 로그 확인
$ dmesg | tail -20
[ 1234.567] nf_conntrack: table full, dropping packet
[ 1235.678] TCP: out of memory -- consider tuning tcp_mem

# 6단계: conntrack 상태 확인 (NAT/방화벽 환경)
$ sudo conntrack -L -d 10.0.0.5
tcp  6 300 ESTABLISHED src=192.168.1.100 dst=10.0.0.5 sport=54321 dport=443

# 7단계: iptables 카운터 확인
$ sudo iptables -L -v -n | head -20
Chain INPUT (policy ACCEPT 12345 packets, 6789K bytes)
 pkts bytes target  prot opt in  out  source    destination
  500 30K   DROP    tcp  --  *   *    0.0.0.0/0 0.0.0.0/0  tcp dpt:8080`

export const dmesgNetCode = `# 네트워크 관련 커널 로그 확인
$ dmesg | grep -i -E 'net|eth|link|tcp|drop|conntrack'

# 대표적 커널 경고 메시지:
# [  123.456] nf_conntrack: table full, dropping packet
#   → conntrack 테이블 포화, 새 연결 거부됨
#   → 해결: sysctl net.netfilter.nf_conntrack_max 증가

# [  234.567] TCP: out of memory -- consider tuning tcp_mem
#   → TCP 메모리 부족
#   → 해결: sysctl net.ipv4.tcp_mem 튜닝

# [  345.678] eth0: NIC Link is Down
#   → 물리 링크 단절 (케이블, 스위치 포트 문제)

# [  456.789] possible SYN flooding on port 80
#   → SYN flood 공격 또는 backlog 부족
#   → 해결: net.ipv4.tcp_syncookies=1, net.core.somaxconn 증가

# [  567.890] neighbour table overflow
#   → ARP 테이블 포화
#   → 해결: net.ipv4.neigh.default.gc_thresh3 증가

# 실시간 로그 모니터링
$ dmesg -w | grep -i -E 'drop|error|fail|overflow'

# journalctl로 네트워크 서비스 로그
$ journalctl -u NetworkManager --since "5 min ago"
$ journalctl -u systemd-networkd --since "5 min ago"`
