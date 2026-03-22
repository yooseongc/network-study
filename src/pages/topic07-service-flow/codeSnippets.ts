export const iptablesNatCode = `# iptables NAT 규칙 예제

# 1. SNAT: 내부 사용자의 인터넷 접속 (출발지 NAT)
#    내부 IP(10.0.0.0/8) → 공인 IP(203.0.113.1)로 변환
$ sudo iptables -t nat -A POSTROUTING \\
    -s 10.0.0.0/8 -o eth0 \\
    -j SNAT --to-source 203.0.113.1

# 2. Masquerade: 동적 공인 IP 환경에서의 SNAT
#    (DHCP로 공인 IP를 받는 경우)
$ sudo iptables -t nat -A POSTROUTING \\
    -s 192.168.1.0/24 -o eth0 \\
    -j MASQUERADE

# 3. DNAT: 외부에서 내부 웹서버로 포트포워딩
#    공인 IP:80 → 내부 서버 10.10.1.11:8080
$ sudo iptables -t nat -A PREROUTING \\
    -d 203.0.113.80 -p tcp --dport 80 \\
    -j DNAT --to-destination 10.10.1.11:8080

# 4. 현재 NAT 테이블 확인
$ sudo iptables -t nat -L -n -v --line-numbers
Chain PREROUTING (policy ACCEPT)
num  target     prot opt source        destination
1    DNAT       tcp  --  0.0.0.0/0     203.0.113.80    tcp dpt:80 to:10.10.1.11:8080

Chain POSTROUTING (policy ACCEPT)
num  target     prot opt source        destination
1    SNAT       all  --  10.0.0.0/8    0.0.0.0/0       to:203.0.113.1

# 5. conntrack으로 NAT 세션 확인
$ sudo conntrack -L | head -5
tcp  6 431998 ESTABLISHED src=10.0.1.50 dst=142.250.196.110 \\
  sport=52340 dport=443 src=142.250.196.110 dst=203.0.113.1 \\
  sport=443 dport=52340 [ASSURED] mark=0 use=1`

export const nginxReverseProxyCode = `# nginx 리버스 프록시 설정 예제
# /etc/nginx/conf.d/service.conf

# upstream: 백엔드 서버 그룹 정의 (로드 밸런싱)
upstream backend_servers {
    # 가중치 기반 라운드로빈
    server 10.10.2.21:8080 weight=3;
    server 10.10.2.22:8080 weight=2;
    server 10.10.2.23:8080 weight=1;

    # 헬스 체크 (실패 시 제외)
    # max_fails=3: 3회 실패 시 비활성화
    # fail_timeout=30s: 30초 후 재시도
    server 10.10.2.24:8080 max_fails=3 fail_timeout=30s;

    # 백업 서버 (주 서버 모두 다운 시 사용)
    server 10.10.2.25:8080 backup;

    # 세션 유지 (IP 해시)
    # ip_hash;

    # Keep-Alive 연결 풀
    keepalive 32;
}

server {
    listen 80;
    server_name service.example.com;

    # HTTP → HTTPS 리다이렉트
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name service.example.com;

    ssl_certificate     /etc/ssl/certs/service.pem;
    ssl_certificate_key /etc/ssl/private/service-key.pem;

    # 프록시 설정
    location / {
        proxy_pass http://backend_servers;

        # 원본 클라이언트 정보 전달
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 타임아웃 설정
        proxy_connect_timeout 5s;
        proxy_read_timeout    30s;
        proxy_send_timeout    30s;
    }

    # 정적 파일은 직접 서빙
    location /static/ {
        alias /var/www/static/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # 헬스 체크 엔드포인트
    location /health {
        access_log off;
        return 200 "OK";
    }
}`

export const haproxyConfigCode = `# HAProxy 로드 밸런서 설정 예제
# /etc/haproxy/haproxy.cfg

global
    log         /dev/log local0
    maxconn     4096
    stats socket /var/run/haproxy.sock mode 660

defaults
    mode    http
    log     global
    timeout connect  5s
    timeout client  30s
    timeout server  30s
    option  httplog
    option  dontlognull
    option  forwardfor     # X-Forwarded-For 헤더 추가

# 프론트엔드: 클라이언트 요청 수신
frontend http_front
    bind *:80
    bind *:443 ssl crt /etc/ssl/certs/service.pem

    # ACL 기반 라우팅
    acl is_api   path_beg /api/
    acl is_admin path_beg /admin/

    # 조건별 백엔드 분기
    use_backend api_servers   if is_api
    use_backend admin_servers if is_admin
    default_backend web_servers

# 백엔드: 웹 서버 그룹
backend web_servers
    balance roundrobin
    option httpchk GET /health
    http-check expect status 200

    server web1 10.10.1.11:8080 check inter 3s fall 3 rise 2
    server web2 10.10.1.12:8080 check inter 3s fall 3 rise 2
    server web3 10.10.1.13:8080 check inter 3s fall 3 rise 2

# 백엔드: API 서버 그룹 (최소 연결 방식)
backend api_servers
    balance leastconn
    option httpchk GET /api/health

    server api1 10.10.2.21:8080 check weight 100
    server api2 10.10.2.22:8080 check weight 100
    server api3 10.10.2.23:8080 check weight 50   # 스펙이 낮은 서버

# 백엔드: 관리자 서버 (Active-Standby)
backend admin_servers
    balance roundrobin
    server admin1 10.10.3.31:8080 check
    server admin2 10.10.3.32:8080 check backup

# 통계 페이지
listen stats
    bind *:8404
    stats enable
    stats uri /stats
    stats refresh 10s
    stats admin if TRUE`

export const keepalivedVrrpCode = `# Keepalived (VRRP) Active-Standby 구성 예제
# /etc/keepalived/keepalived.conf

# Active(Master) 노드 설정
vrrp_instance VI_1 {
    state MASTER          # 이 노드의 초기 상태
    interface eth0        # VRRP 통신 인터페이스
    virtual_router_id 51  # 같은 VRRP 그룹은 동일 ID
    priority 100          # 우선순위 (높을수록 Master)
    advert_int 1          # 상태 광고 주기 (초)

    authentication {
        auth_type PASS
        auth_pass SecretKey123
    }

    virtual_ipaddress {
        203.0.113.80/24   # VIP (가상 IP)
    }

    # Master 전환 시 실행 스크립트
    notify_master "/etc/keepalived/notify.sh master"
    notify_backup "/etc/keepalived/notify.sh backup"
}

# Standby 노드 설정 (다른 서버)
# state BACKUP, priority 90 으로만 변경`
