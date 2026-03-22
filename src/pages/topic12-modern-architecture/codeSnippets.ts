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

export const wireguardCode = `# WireGuard 서버 설정 (/etc/wireguard/wg0.conf)
[Interface]
Address = 10.10.0.1/24
ListenPort = 51820
PrivateKey = <서버 개인키>

# NAT 설정 (클라이언트가 인터넷 접근 시)
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; \\
         iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; \\
           iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

[Peer]
# 클라이언트 A
PublicKey = <클라이언트A 공개키>
AllowedIPs = 10.10.0.2/32

[Peer]
# 클라이언트 B
PublicKey = <클라이언트B 공개키>
AllowedIPs = 10.10.0.3/32

---

# WireGuard 클라이언트 설정
[Interface]
Address = 10.10.0.2/24
PrivateKey = <클라이언트 개인키>
DNS = 1.1.1.1

[Peer]
PublicKey = <서버 공개키>
Endpoint = vpn.example.com:51820
AllowedIPs = 0.0.0.0/0        # 전체 트래픽 VPN 경유
PersistentKeepalive = 25      # NAT 뒤에서 연결 유지

---

# WireGuard 관리 명령어
$ sudo wg-quick up wg0        # 인터페이스 활성화
$ sudo wg show                # 연결 상태 확인
$ sudo wg-quick down wg0      # 인터페이스 비활성화`

export const dockerNetworkCode = `# Docker 네트워크 목록 확인
$ docker network ls
NETWORK ID     NAME      DRIVER    SCOPE
a1b2c3d4e5f6   bridge    bridge    local
f6e5d4c3b2a1   host      host      local
0f1e2d3c4b5a   none      null      local

# 사용자 정의 브릿지 네트워크 생성
$ docker network create --driver bridge \\
    --subnet 172.20.0.0/16 \\
    --gateway 172.20.0.1 \\
    my-app-net

# 컨테이너를 네트워크에 연결
$ docker run -d --name web --network my-app-net nginx
$ docker run -d --name api --network my-app-net node-app

# 같은 네트워크 내 컨테이너 간 DNS 통신
$ docker exec web ping api   # 컨테이너 이름으로 통신 가능

# 네트워크 상세 정보
$ docker network inspect my-app-net

# Overlay 네트워크 (Docker Swarm / multi-host)
$ docker network create --driver overlay \\
    --attachable \\
    --subnet 10.0.9.0/24 \\
    my-overlay-net`

export const kubectlNetworkCode = `# Pod 네트워크 확인
$ kubectl get pods -o wide
NAME        READY   STATUS    IP            NODE
web-abc     1/1     Running   10.244.1.5    node-1
api-def     1/1     Running   10.244.2.8    node-2

# Service 확인 (ClusterIP, NodePort, LoadBalancer)
$ kubectl get svc
NAME         TYPE           CLUSTER-IP     EXTERNAL-IP    PORT(S)
kubernetes   ClusterIP      10.96.0.1      <none>         443/TCP
web-svc      LoadBalancer   10.96.45.12    203.0.113.10   80:30080/TCP
api-svc      ClusterIP      10.96.78.34    <none>         8080/TCP

# NetworkPolicy 예시 (api-svc는 web-svc에서만 접근 가능)
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-allow-web
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: web
      ports:
        - port: 8080

# CNI 플러그인 확인
$ ls /etc/cni/net.d/
10-calico.conflist

# Pod 간 통신 테스트
$ kubectl exec web-abc -- curl http://10.244.2.8:8080/health`

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

export const istioSidecarCode = `# Istio sidecar injection 확인
$ kubectl get pods -n my-app
NAME              READY   STATUS
web-abc-xyz       2/2     Running    # 2/2 = app + envoy sidecar

# VirtualService (트래픽 라우팅)
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: web-vs
spec:
  hosts:
    - web-svc
  http:
    - route:
        - destination:
            host: web-svc
            subset: v1
          weight: 90
        - destination:
            host: web-svc
            subset: v2
          weight: 10    # 카나리 배포: 10% 트래픽

# DestinationRule (로드밸런싱 + Circuit Breaker)
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: web-dr
spec:
  host: web-svc
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        h2UpgradePolicy: UPGRADE
    outlierDetection:
      consecutive5xxErrors: 5
      interval: 30s
      baseEjectionTime: 60s`
