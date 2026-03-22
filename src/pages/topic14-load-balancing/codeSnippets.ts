export const nginxLbCode = `# nginx 로드밸런서 설정 (Round Robin)
upstream backend_servers {
    server 10.0.1.10:8080;
    server 10.0.1.11:8080;
    server 10.0.1.12:8080;
}

# Weighted Round Robin
upstream weighted_backend {
    server 10.0.1.10:8080 weight=5;   # 50% 트래픽
    server 10.0.1.11:8080 weight=3;   # 30% 트래픽
    server 10.0.1.12:8080 weight=2;   # 20% 트래픽
}

# Least Connections
upstream least_conn_backend {
    least_conn;
    server 10.0.1.10:8080;
    server 10.0.1.11:8080;
    server 10.0.1.12:8080;
}

# IP Hash (세션 고정)
upstream ip_hash_backend {
    ip_hash;
    server 10.0.1.10:8080;
    server 10.0.1.11:8080;
    server 10.0.1.12:8080;
}

server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://backend_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health Check (nginx plus 또는 별도 모듈 필요)
    location /health {
        return 200 'OK';
    }
}`

export const nginxReverseProxyCode = `# 리버스 프록시 + API 게이트웨이 패턴
server {
    listen 443 ssl http2;
    server_name api.example.com;

    ssl_certificate     /etc/ssl/certs/api.example.com.pem;
    ssl_certificate_key /etc/ssl/private/api.example.com.key;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/s;

    # /users → User Service
    location /api/users {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://user-service:3000;
        proxy_set_header Host $host;
    }

    # /orders → Order Service
    location /api/orders {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://order-service:3001;
        proxy_set_header Host $host;
    }

    # /products → Product Service
    location /api/products {
        proxy_pass http://product-service:3002;
        proxy_cache api_cache;
        proxy_cache_valid 200 5m;
    }

    # WebSocket 지원
    location /ws {
        proxy_pass http://ws-service:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}`

export const haproxyHealthCode = `# HAProxy 헬스체크 + failover 설정
frontend http_front
    bind *:80
    default_backend app_servers

backend app_servers
    balance roundrobin
    option httpchk GET /health HTTP/1.1\\r\\nHost:\\ localhost

    # Health Check 파라미터
    # inter: 체크 간격, fall: 실패 횟수, rise: 복구 횟수
    server app1 10.0.1.10:8080 check inter 3s fall 3 rise 2
    server app2 10.0.1.11:8080 check inter 3s fall 3 rise 2
    server app3 10.0.1.12:8080 check inter 3s fall 3 rise 2 backup

    # 타임아웃 설정
    timeout connect 5s
    timeout server 30s
    timeout check 3s

# 통계 페이지 (모니터링)
listen stats
    bind *:8404
    stats enable
    stats uri /stats
    stats refresh 10s`

export const gslbDnsCode = `# GSLB DNS 기반 글로벌 로드밸런싱 예시
# dig로 GeoDNS 응답 확인 (한국에서 질의)
$ dig api.example.com +short
203.0.113.10    # 한국 리전 Edge IP

# 미국에서 동일 질의 시
$ dig api.example.com +short
198.51.100.20   # 미국 리전 Edge IP

# GSLB Health Check 설정 예시 (F5 GTM / BIG-IP DNS)
# Pool Member 정의
ltm pool /Common/kr-pool {
    monitor /Common/https_head_f5
    members {
        203.0.113.10:443 { address 203.0.113.10 }
        203.0.113.11:443 { address 203.0.113.11 }
    }
}

ltm pool /Common/us-pool {
    monitor /Common/https_head_f5
    members {
        198.51.100.20:443 { address 198.51.100.20 }
        198.51.100.21:443 { address 198.51.100.21 }
    }
}

# Wide IP (GSLB 가상 도메인)
gtm wideip /Common/api.example.com {
    pool-lb-mode topology        # 지리 기반 분산
    pools {
        /Common/kr-pool { order 0 }
        /Common/us-pool { order 1 }
    }
    # Failover: kr-pool 전체 장애 시 us-pool로 자동 전환
    # Health Monitor: 30초 간격, 3회 실패 시 장애 판정
}

# Anycast와 GSLB 비교:
# Anycast: 같은 IP를 여러 위치에서 광고, BGP가 최단 경로 선택
# GSLB:    DNS 응답으로 다른 IP를 반환, 더 세밀한 제어 가능
# 실무:    CDN은 Anycast, 애플리케이션 LB는 GSLB를 주로 사용`

