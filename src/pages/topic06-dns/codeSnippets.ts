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

; SRV 레코드 (서비스 검색)
_sip._tcp IN    SRV     10 60 5060 sip.example.com.`

export const dnssecSignCode = `# DNSSEC Zone 서명 절차

# 1. ZSK (Zone Signing Key) 생성
$ dnssec-keygen -a ECDSAP256SHA256 -n ZONE example.com
Generating key pair..............++++++ .++++++
Kexample.com.+013+12345

# 2. KSK (Key Signing Key) 생성
$ dnssec-keygen -a ECDSAP256SHA256 -n ZONE -f KSK example.com
Generating key pair.........++++++ ..++++++
Kexample.com.+013+67890

# 3. Zone 서명
$ dnssec-signzone -o example.com -N INCREMENT \\
  -k Kexample.com.+013+67890 \\
  db.example.com \\
  Kexample.com.+013+12345

Verifying the zone using the following algorithms: ECDSAP256SHA256.
Zone fully signed:
Algorithm: ECDSAP256SHA256: KSKs: 1 active, 0 stand-by, 0 revoked
                            ZSKs: 1 active, 0 stand-by, 0 revoked

# 4. DS 레코드 생성 (상위 Zone에 등록)
$ dnssec-dsfromkey Kexample.com.+013+67890.key
example.com. IN DS 67890 13 2 E2D3C9...

# 5. DNSSEC 검증 확인
$ dig +dnssec example.com A
;; flags: qr rd ra ad; QUERY: 1, ANSWER: 2
;  ── ad 플래그: Authenticated Data (DNSSEC 검증 성공)
example.com.    300   IN  A     93.184.216.34
example.com.    300   IN  RRSIG A 13 2 300 20260401...`

export const dohDotCode = `# DNS over HTTPS (DoH) 질의 — curl 사용
$ curl -s -H 'accept: application/dns-json' \\
  'https://cloudflare-dns.com/dns-query?name=example.com&type=A' | jq
{
  "Status": 0,
  "Answer": [
    {
      "name": "example.com",
      "type": 1,
      "TTL": 300,
      "data": "93.184.216.34"
    }
  ]
}

# DNS over TLS (DoT) 질의 — kdig (knot-dnsutils)
$ kdig -d +tls-ca example.com @1.1.1.1
;; TLS session (TLS1.3)-(ECDHE-X25519)-(ECDSA-P256-SHA256)-(AES-256-GCM)
;; ANSWER SECTION:
example.com.    300   IN  A   93.184.216.34

# Unbound에서 DoT 설정 (/etc/unbound/unbound.conf)
server:
    tls-cert-bundle: /etc/ssl/certs/ca-certificates.crt

forward-zone:
    name: "."
    forward-tls-upstream: yes
    forward-addr: 1.1.1.1@853#cloudflare-dns.com
    forward-addr: 8.8.8.8@853#dns.google`

export const splitHorizonCode = `# Split-Horizon DNS 구성 예시 (BIND views)

# /etc/bind/named.conf
acl "internal" {
    10.0.0.0/8;
    172.16.0.0/12;
    192.168.0.0/16;
};

# 내부 사용자용 View
view "internal" {
    match-clients { internal; };
    zone "corp.example.com" {
        type master;
        file "/etc/bind/zones/internal.corp.example.com";
    };
};

# 외부 사용자용 View
view "external" {
    match-clients { any; };
    zone "corp.example.com" {
        type master;
        file "/etc/bind/zones/external.corp.example.com";
    };
};

# internal zone → 내부 IP 응답
# www.corp.example.com.   A   10.1.1.100

# external zone → 외부 IP 응답
# www.corp.example.com.   A   203.0.113.50`
