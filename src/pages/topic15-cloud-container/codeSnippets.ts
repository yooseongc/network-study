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
