export const ssCommandCode = `# ss: 소켓 통계 확인 (netstat 후속)
$ ss -tnp
State    Recv-Q  Send-Q  Local Address:Port   Peer Address:Port   Process
ESTAB    0       0       192.168.1.100:22     10.0.0.50:54321     users:(("sshd",pid=1234,fd=3))
ESTAB    0       0       192.168.1.100:443    203.0.113.5:49876   users:(("nginx",pid=5678,fd=9))
LISTEN   0       128     0.0.0.0:80            0.0.0.0:*           users:(("nginx",pid=5678,fd=6))
LISTEN   0       128     0.0.0.0:443           0.0.0.0:*           users:(("nginx",pid=5678,fd=7))
TIME-WAIT 0      0       192.168.1.100:443    198.51.100.3:52341

# -t: TCP 소켓만, -n: 숫자로 표시, -p: 프로세스 정보
# -l: LISTEN 상태만, -a: 모든 상태, -s: 요약 통계

# ss로 소켓 상태 요약 보기
$ ss -s
Total: 156
TCP:   12 (estab 3, closed 2, orphaned 0, timewait 2)
Transport  Total    IP     IPv6
RAW        0        0      0
UDP        4        3      1
TCP        10       8      2
INET       14       11     3
FRAG       0        0      0`

export const netstatCode = `# netstat: 네트워크 연결 상태 확인 (레거시, ss 권장)
$ netstat -tnlp
Proto  Recv-Q  Send-Q  Local Address      Foreign Address    State       PID/Program
tcp    0       0       0.0.0.0:22         0.0.0.0:*          LISTEN      1234/sshd
tcp    0       0       0.0.0.0:80         0.0.0.0:*          LISTEN      5678/nginx
tcp    0       0       192.168.1.100:22   10.0.0.50:54321    ESTABLISHED 1234/sshd
tcp6   0       0       :::443             :::*               LISTEN      5678/nginx

# Windows에서 네트워크 연결 확인
> netstat -ano
  Proto  Local Address      Foreign Address    State       PID
  TCP    0.0.0.0:80         0.0.0.0:0          LISTENING   1234
  TCP    192.168.1.10:443   203.0.113.5:49876  ESTABLISHED 5678
  TCP    192.168.1.10:443   198.51.100.3:52341 TIME_WAIT   0`

export const tcpdumpHandshakeCode = `# tcpdump: TCP 3-way handshake 캡처
$ sudo tcpdump -i eth0 -nn 'tcp[tcpflags] & (tcp-syn|tcp-fin) != 0' -c 10

# 3-way Handshake 캡처 결과 예시
14:23:01.001 IP 192.168.1.100.54321 > 93.184.216.34.443: Flags [S], seq 1000000, win 65535, options [mss 1460,sackOK,TS val 123456 ecr 0,nop,wscale 7], length 0
14:23:01.045 IP 93.184.216.34.443 > 192.168.1.100.54321: Flags [S.], seq 2000000, ack 1000001, win 65535, options [mss 1460,sackOK,TS val 789012 ecr 123456,nop,wscale 7], length 0
14:23:01.045 IP 192.168.1.100.54321 > 93.184.216.34.443: Flags [.], ack 2000001, win 512, options [nop,nop,TS val 123457 ecr 789012], length 0

# Flags 해석:
# [S]   = SYN
# [S.]  = SYN+ACK
# [.]   = ACK
# [F.]  = FIN+ACK
# [P.]  = PSH+ACK (데이터 전송)
# [R.]  = RST+ACK (연결 강제 종료)`

export const tcpSocketCode = `# Python으로 TCP 소켓 프로그래밍 기초 이해

# ── 서버 측 ──
import socket

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)  # TCP 소켓
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server.bind(('0.0.0.0', 8080))     # IP:Port에 바인딩
server.listen(128)                  # backlog 큐 크기

conn, addr = server.accept()       # 3-way handshake 완료 대기
data = conn.recv(4096)             # 데이터 수신
conn.send(b'HTTP/1.1 200 OK\\r\\n')  # 데이터 송신
conn.close()                       # 4-way handshake 시작

# ── 클라이언트 측 ──
client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.connect(('example.com', 80))  # 3-way handshake 수행
client.send(b'GET / HTTP/1.1\\r\\n')  # 데이터 전송
response = client.recv(4096)         # 응답 수신
client.close()                       # 연결 종료`

export const tcpTuningCode = `# TCP 커널 파라미터 확인 및 튜닝

# 현재 혼잡 제어 알고리즘 확인
$ sysctl net.ipv4.tcp_congestion_control
net.ipv4.tcp_congestion_control = cubic

# 사용 가능한 혼잡 제어 알고리즘 목록
$ sysctl net.ipv4.tcp_available_congestion_control
net.ipv4.tcp_available_congestion_control = reno cubic bbr

# BBR로 변경
$ sudo sysctl -w net.ipv4.tcp_congestion_control=bbr

# TCP keepalive 설정 확인
$ sysctl net.ipv4.tcp_keepalive_time       # 기본 7200초 (2시간)
$ sysctl net.ipv4.tcp_keepalive_intvl      # 재시도 간격 75초
$ sysctl net.ipv4.tcp_keepalive_probes     # 재시도 횟수 9회

# TCP 버퍼 크기 확인 (min, default, max)
$ sysctl net.ipv4.tcp_rmem
net.ipv4.tcp_rmem = 4096  131072  6291456
$ sysctl net.ipv4.tcp_wmem
net.ipv4.tcp_wmem = 4096  16384   4194304

# Nagle 알고리즘은 소켓 옵션으로 제어
# setsockopt(fd, IPPROTO_TCP, TCP_NODELAY, &flag, sizeof(flag))`
