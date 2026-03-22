export const digCode = `# dig: DNS 질의 도구 (A 레코드 조회)
$ dig example.com

;; QUESTION SECTION:
;example.com.                   IN      A

;; ANSWER SECTION:
example.com.            300     IN      A       93.184.216.34

;; Query time: 12 msec
;; SERVER: 8.8.8.8#53(8.8.8.8)

# 특정 레코드 타입 조회
$ dig example.com MX
example.com.            3600    IN      MX      10 mail.example.com.

$ dig example.com AAAA
example.com.            300     IN      AAAA    2606:2800:220:1:248:1893:25c8:1946

$ dig example.com NS
example.com.            86400   IN      NS      a.iana-servers.net.
example.com.            86400   IN      NS      b.iana-servers.net.

# CNAME 레코드 확인
$ dig www.example.com CNAME
www.example.com.        3600    IN      CNAME   example.com.`

export const nslookupCode = `# nslookup: DNS 질의 (Windows/Linux 공통)
$ nslookup example.com
Server:         8.8.8.8
Address:        8.8.8.8#53

Non-authoritative answer:
Name:   example.com
Address: 93.184.216.34

# 특정 DNS 서버에 질의
$ nslookup example.com 1.1.1.1
Server:         1.1.1.1
Address:        1.1.1.1#53

Non-authoritative answer:
Name:   example.com
Address: 93.184.216.34

# 역방향 DNS 조회 (IP → 도메인)
$ nslookup 8.8.8.8
8.8.8.8.in-addr.arpa    name = dns.google.`

export const curlCode = `# curl: HTTP 요청 전송
$ curl -v https://example.com

# --- 요청 ---
> GET / HTTP/2
> Host: example.com
> User-Agent: curl/8.5.0
> Accept: */*

# --- 응답 ---
< HTTP/2 200
< content-type: text/html; charset=UTF-8
< content-length: 1256
< cache-control: max-age=604800
< date: Sat, 22 Mar 2026 12:00:00 GMT

# HEAD 요청 (헤더만 확인)
$ curl -I https://example.com
HTTP/2 200
content-type: text/html; charset=UTF-8
content-length: 1256

# POST 요청 (JSON 데이터)
$ curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Alice", "email": "alice@example.com"}'

# 리다이렉트 따라가기 (-L)
$ curl -L http://example.com  # HTTP → HTTPS 리다이렉트 추적`

export const opensslCode = `# openssl s_client: TLS 연결 및 인증서 확인
$ openssl s_client -connect example.com:443 -servername example.com

CONNECTED(00000003)
depth=2 C = US, O = DigiCert Inc, CN = DigiCert Global Root G2
verify return:1
depth=1 C = US, O = DigiCert Inc, CN = DigiCert SHA2 Extended Validation Server CA
verify return:1
depth=0 CN = example.com
verify return:1
---
Certificate chain
 0 s:CN = example.com
   i:C = US, O = DigiCert Inc, CN = DigiCert SHA2 Extended Validation Server CA
 1 s:C = US, O = DigiCert Inc, CN = DigiCert SHA2 Extended Validation Server CA
   i:C = US, O = DigiCert Inc, CN = DigiCert Global Root G2
---
Server certificate
-----BEGIN CERTIFICATE-----
MIIHQDCCBiigAwIBAgIQD...
-----END CERTIFICATE-----
---
New, TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384
Protocol  : TLSv1.3
Cipher    : TLS_AES_256_GCM_SHA384

# 인증서 만료일 확인
$ echo | openssl s_client -connect example.com:443 2>/dev/null \\
  | openssl x509 -noout -dates
notBefore=Jan  1 00:00:00 2025 GMT
notAfter=Dec 31 23:59:59 2025 GMT`

export const dhcpCode = `# DHCP 클라이언트 갱신 (Linux)
$ sudo dhclient -v eth0
Listening on LPF/eth0/08:00:27:4e:66:a1
Sending on   LPF/eth0/08:00:27:4e:66:a1
DHCPDISCOVER on eth0 to 255.255.255.255 port 67
DHCPOFFER of 192.168.1.100 from 192.168.1.1
DHCPREQUEST for 192.168.1.100 on eth0 to 255.255.255.255 port 67
DHCPACK of 192.168.1.100 from 192.168.1.1
bound to 192.168.1.100 -- renewal in 3600 seconds.

# DHCP 리스 정보 확인
$ cat /var/lib/dhcp/dhclient.leases
lease {
  interface "eth0";
  fixed-address 192.168.1.100;
  option subnet-mask 255.255.255.0;
  option routers 192.168.1.1;
  option domain-name-servers 8.8.8.8, 8.8.4.4;
  option domain-name "home.local";
  renew 5 2026/03/22 18:00:00;
  expire 6 2026/03/23 06:00:00;
}

# Windows에서 DHCP 갱신
> ipconfig /release
> ipconfig /renew`

export const sshCode = `# SSH 기본 접속
$ ssh user@192.168.1.10

# 특정 포트로 접속
$ ssh -p 2222 user@example.com

# SSH 키 생성 (Ed25519 — 현재 권장)
$ ssh-keygen -t ed25519 -C "user@example.com"
Generating public/private ed25519 key pair.
Enter file in which to save the key (~/.ssh/id_ed25519):
Your identification has been saved in ~/.ssh/id_ed25519
Your public key has been saved in ~/.ssh/id_ed25519.pub

# 공개키를 서버에 복사
$ ssh-copy-id user@192.168.1.10

# SSH 포트 포워딩 (로컬 → 원격)
$ ssh -L 8080:localhost:80 user@192.168.1.10
# 로컬 8080 포트로 접속 → 원격 서버의 80 포트로 전달

# SSH 터널을 통한 SOCKS 프록시
$ ssh -D 1080 user@192.168.1.10
# 브라우저에서 SOCKS5 프록시 localhost:1080 설정`

/* ── 신규 코드 스니펫 ──────────────────────────────────────── */

export const bindZoneCode = `# BIND Zone File 예시 (/etc/bind/zones/db.example.com)
$TTL    86400       ; 기본 TTL: 24시간
@       IN      SOA     ns1.example.com. admin.example.com. (
                        2026032201  ; Serial (YYYYMMDDNN)
                        3600        ; Refresh (1시간)
                        900         ; Retry (15분)
                        604800      ; Expire (7일)
                        86400       ; Negative Cache TTL (1일)
                        )

; 네임서버 레코드
@       IN      NS      ns1.example.com.
@       IN      NS      ns2.example.com.

; A 레코드 (IPv4)
@       IN      A       93.184.216.34
www     IN      A       93.184.216.34
api     IN      A       93.184.216.35

; AAAA 레코드 (IPv6)
@       IN      AAAA    2606:2800:220:1:248:1893:25c8:1946

; CNAME 레코드
blog    IN      CNAME   www.example.com.
cdn     IN      CNAME   d1234.cloudfront.net.

; MX 레코드 (메일 서버)
@       IN      MX      10 mail.example.com.
@       IN      MX      20 mail-backup.example.com.

; TXT 레코드 (SPF, DKIM 등)
@       IN      TXT     "v=spf1 include:_spf.google.com ~all"

; DNSSEC 관련: Zone Signing
# Zone 서명 (BIND dnssec-signzone)
$ dnssec-keygen -a ECDSAP256SHA256 -n ZONE example.com
$ dnssec-signzone -o example.com -N INCREMENT db.example.com`

export const opensslChainCode = `# 인증서 체인 확인 (Root CA → Intermediate CA → End-entity)
$ openssl s_client -connect example.com:443 -showcerts 2>/dev/null \\
  | openssl x509 -noout -text | head -20

Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number: 0a:01:41:42:00:00:01:53:85:73:6a:0b:85:ec:a7:08
    Signature Algorithm: sha256WithRSAEncryption
        Issuer: C=US, O=DigiCert Inc, CN=DigiCert SHA2 Extended Validation Server CA
        Validity
            Not Before: Jan  1 00:00:00 2025 GMT
            Not After : Dec 31 23:59:59 2025 GMT
        Subject: CN=example.com
        Subject Public Key Info:
            Public Key Algorithm: id-ecPublicKey
                Public-Key: (256 bit)

# 인증서 체인 검증 (Root CA로 End-entity 검증)
$ openssl verify -CAfile /etc/ssl/certs/ca-certificates.crt \\
  -untrusted intermediate.pem server.pem
server.pem: OK

# 인증서에서 SAN (Subject Alternative Name) 확인
$ openssl x509 -in server.pem -noout -ext subjectAltName
X509v3 Subject Alternative Name:
    DNS:example.com, DNS:www.example.com, DNS:api.example.com

# 인증서 종류 확인 (DV/OV/EV)
# - DV: Subject에 CN만 포함 (도메인 검증만)
# - OV: Subject에 O(Organization) 포함
# - EV: Subject에 O + serialNumber + jurisdictionC 포함
$ openssl x509 -in server.pem -noout -subject
subject=C=US, ST=California, O=Example Inc, CN=example.com  # OV 인증서`

export const mtlsCurlCode = `# mTLS (상호 인증): 클라이언트도 인증서를 제시
# 서버와 클라이언트 양방향 인증서 검증

# 1. 클라이언트 인증서 + 개인키로 mTLS 연결
$ curl --cert client.pem --key client-key.pem \\
  --cacert ca.pem \\
  https://secure-api.example.com/data

# 2. PKCS#12 (.p12) 형식 사용
$ curl --cert-type P12 --cert client.p12:password \\
  https://secure-api.example.com/data

# 3. openssl로 mTLS 연결 테스트
$ openssl s_client -connect secure-api.example.com:443 \\
  -cert client.pem -key client-key.pem \\
  -CAfile ca.pem -verify 4

Verify return code: 0 (ok)
---
SSL handshake has read 4521 bytes and written 2105 bytes
    Verify return code: 0 (ok)
    Extended master secret: no
    Max Early Data: 0
---

# mTLS 활용 사례:
# - Kubernetes API 서버 인증
# - 서비스 메시 (Istio, Linkerd)의 서비스 간 통신
# - 금융/의료 API 접근 제어
# - IoT 디바이스 인증`

export const cipherSuiteCode = `# TLS 암호 스위트(Cipher Suite) 확인 및 해석

# 서버가 지원하는 암호 스위트 확인
$ openssl s_client -connect example.com:443 -servername example.com \\
  2>/dev/null | grep "Cipher"
New, TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384

# nmap으로 서버의 전체 암호 스위트 목록 확인
$ nmap --script ssl-enum-ciphers -p 443 example.com
|   TLSv1.3:
|     ciphers:
|       TLS_AES_256_GCM_SHA384 (secp384r1) - A
|       TLS_AES_128_GCM_SHA256 (secp256r1) - A
|       TLS_CHACHA20_POLY1305_SHA256 (secp256r1) - A
|   TLSv1.2:
|     ciphers:
|       TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 (secp384r1) - A
|       TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 (secp256r1) - A

# ── TLS 1.2 암호 스위트 해석 ──
# TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
#  │     │    │        │   │   │    └── PRF/MAC 해시: SHA-384
#  │     │    │        │   │   └────── 블록 암호 모드: GCM (AEAD)
#  │     │    │        │   └────────── 키 길이: 256비트
#  │     │    │        └────────────── 대칭 암호: AES
#  │     │    └─────────────────────── 인증 알고리즘: RSA
#  │     └──────────────────────────── 키 교환: ECDHE (Forward Secrecy)
#  └────────────────────────────────── 프로토콜: TLS

# ── TLS 1.3 암호 스위트 (키 교환은 별도 협상) ──
# TLS_AES_256_GCM_SHA384
#  │    │   │   │    └── 해시: SHA-384
#  │    │   │   └────── 모드: GCM (AEAD)
#  │    │   └────────── 키 길이: 256비트
#  │    └────────────── 대칭 암호: AES
#  └─────────────────── 프로토콜: TLS
# 키 교환은 TLS 1.3에서 항상 (EC)DHE — Forward Secrecy 필수

# OCSP Stapling 확인
$ openssl s_client -connect example.com:443 -status 2>/dev/null \\
  | grep -A 5 "OCSP Response"
OCSP Response Status: successful (0x0)
    Response Type: Basic OCSP Response
    Cert Status: good`
