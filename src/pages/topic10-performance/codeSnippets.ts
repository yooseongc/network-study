export const ethtoolOffloadCode = `# NIC offload 기능 확인
$ ethtool -k eth0
Features for eth0:
rx-checksumming: on
tx-checksumming: on
  tx-checksum-ipv4: on
  tx-checksum-ipv6: on
scatter-gather: on
tcp-segmentation-offload: on      # TSO
  tx-tcp-segmentation: on
  tx-tcp6-segmentation: on
generic-segmentation-offload: on  # GSO
generic-receive-offload: on       # GRO
large-receive-offload: off        # LRO (보통 off)
rx-vlan-offload: on
tx-vlan-offload: on

# 특정 offload 기능 끄기/켜기
$ sudo ethtool -K eth0 tso off
$ sudo ethtool -K eth0 gro on
$ sudo ethtool -K eth0 lro off`

export const ethtoolStatsCode = `# NIC 통계 확인
$ ethtool -S eth0 | head -30
NIC statistics:
     rx_packets: 1284503
     tx_packets: 983201
     rx_bytes: 1847293056
     tx_bytes: 245820416
     rx_errors: 0
     tx_errors: 0
     rx_dropped: 12
     tx_dropped: 0
     rx_queue_0_packets: 321126
     rx_queue_1_packets: 321125
     rx_queue_2_packets: 321126
     rx_queue_3_packets: 321126
     tx_queue_0_packets: 245800
     tx_queue_1_packets: 245800
     tx_queue_2_packets: 245800
     tx_queue_3_packets: 245801

# 링 버퍼 크기 확인/변경
$ ethtool -g eth0
Ring parameters for eth0:
Pre-set maximums:
RX:    4096
TX:    4096
Current hardware settings:
RX:    256
TX:    256

$ sudo ethtool -G eth0 rx 2048 tx 2048`

export const tcQdiscCode = `# 현재 qdisc 확인
$ tc qdisc show dev eth0
qdisc fq_codel 0: root refcnt 2 limit 10240p flows 1024
      quantum 1514 target 5ms interval 100ms memory_limit 32Mb
      ecn drop_batch 64

# HTB(Hierarchical Token Bucket) 설정 예제
# root qdisc를 HTB로 변경
$ sudo tc qdisc add dev eth0 root handle 1: htb default 30

# 전체 대역폭 100Mbps 클래스
$ sudo tc class add dev eth0 parent 1: classid 1:1 \\
    htb rate 100mbit ceil 100mbit

# 고우선순위 클래스: 50Mbps 보장, 최대 100Mbps
$ sudo tc class add dev eth0 parent 1:1 classid 1:10 \\
    htb rate 50mbit ceil 100mbit prio 1

# 일반 클래스: 30Mbps 보장, 최대 80Mbps
$ sudo tc class add dev eth0 parent 1:1 classid 1:20 \\
    htb rate 30mbit ceil 80mbit prio 2

# 저우선순위 클래스: 20Mbps 보장, 최대 50Mbps
$ sudo tc class add dev eth0 parent 1:1 classid 1:30 \\
    htb rate 20mbit ceil 50mbit prio 3

# 필터: 포트 80 트래픽을 고우선순위로 분류
$ sudo tc filter add dev eth0 parent 1: protocol ip prio 1 \\
    u32 match ip dport 80 0xffff flowid 1:10`

export const tcNetemCode = `# netem을 이용한 네트워크 지연/손실 시뮬레이션
# 100ms 지연 추가
$ sudo tc qdisc add dev eth0 root netem delay 100ms

# 100ms 지연 + 10ms 지터 (정규분포)
$ sudo tc qdisc add dev eth0 root netem delay 100ms 10ms

# 1% 패킷 손실
$ sudo tc qdisc add dev eth0 root netem loss 1%

# 대역폭 제한 (TBF: Token Bucket Filter)
$ sudo tc qdisc add dev eth0 root tbf \\
    rate 10mbit burst 32kbit latency 400ms

# qdisc 삭제
$ sudo tc qdisc del dev eth0 root`

export const procInterruptsCode = `# CPU별 인터럽트 분포 확인
$ cat /proc/interrupts | grep eth0
  26:  12845032    0    0    0  PCI-MSI  eth0-TxRx-0
  27:         0  12845031    0    0  PCI-MSI  eth0-TxRx-1
  28:         0    0  12845032    0  PCI-MSI  eth0-TxRx-2
  29:         0    0    0  12845032  PCI-MSI  eth0-TxRx-3

# IRQ affinity 설정 (IRQ 26을 CPU 0에 바인딩)
$ echo 1 > /proc/irq/26/smp_affinity     # bitmask: CPU 0
$ echo 2 > /proc/irq/27/smp_affinity     # bitmask: CPU 1
$ echo 4 > /proc/irq/28/smp_affinity     # bitmask: CPU 2
$ echo 8 > /proc/irq/29/smp_affinity     # bitmask: CPU 3

# 현재 affinity 확인
$ cat /proc/irq/26/smp_affinity
00000001
$ cat /proc/irq/26/smp_affinity_list
0`

export const rssRpsCode = `# RSS(Receive Side Scaling) - 하드웨어 큐 수 확인/변경
$ ethtool -l eth0
Channel parameters for eth0:
Pre-set maximums:
RX:    0
TX:    0
Other: 1
Combined: 8
Current hardware settings:
RX:    0
TX:    0
Other: 1
Combined: 4

# combined 큐 수를 8로 변경
$ sudo ethtool -L eth0 combined 8

# RSS 해시 설정 확인
$ ethtool -n eth0 rx-flow-hash tcp4
TCP over IPV4 flows use these fields for computing Hash flow key:
IP SA, IP DA, L4 bytes 0, L4 bytes 1 [TCP/UDP src port]
                       , L4 bytes 2, L4 bytes 3 [TCP/UDP dst port]

# RPS(Receive Packet Steering) 설정 — CPU 0~3에 분산
$ echo f > /sys/class/net/eth0/queues/rx-0/rps_cpus

# RFS(Receive Flow Steering) 설정
$ echo 32768 > /proc/sys/net/core/rps_sock_flow_entries
$ echo 2048 > /sys/class/net/eth0/queues/rx-0/rps_flow_cnt

# XPS(Transmit Packet Steering) 설정 — tx-0을 CPU 0에 매핑
$ echo 1 > /sys/class/net/eth0/queues/tx-0/xps_cpus
$ echo 2 > /sys/class/net/eth0/queues/tx-1/xps_cpus`

export const iperfCode = `# iperf3로 네트워크 성능 측정

# 서버 측
$ iperf3 -s
-----------------------------------------------------------
Server listening on 5201 (test #1)
-----------------------------------------------------------

# 클라이언트: TCP throughput 측정 (10초)
$ iperf3 -c 10.0.0.1 -t 10
[ ID] Interval           Transfer    Bitrate         Retr
[  5]   0.00-10.00  sec  1.10 GBytes   941 Mbits/sec    0    sender
[  5]   0.00-10.00  sec  1.09 GBytes   939 Mbits/sec         receiver

# 양방향 테스트
$ iperf3 -c 10.0.0.1 --bidir

# UDP 테스트 (대역폭 지정)
$ iperf3 -c 10.0.0.1 -u -b 500M
[ ID] Interval           Transfer    Bitrate         Jitter    Lost/Total
[  5]   0.00-10.00  sec   596 MBytes   500 Mbits/sec  0.012 ms  2/76159 (0.0026%)

# 병렬 스트림 (4개)
$ iperf3 -c 10.0.0.1 -P 4

# MSS(Maximum Segment Size) 지정
$ iperf3 -c 10.0.0.1 -M 1460`

export const busyPollingCode = `# busy polling 활성화
# 소켓별 busy poll 시간 (마이크로초)
$ sudo sysctl -w net.core.busy_poll=50
$ sudo sysctl -w net.core.busy_read=50

# 글로벌 설정 (/etc/sysctl.conf)
net.core.busy_poll = 50
net.core.busy_read = 50

# 애플리케이션에서 소켓 옵션으로 설정
# setsockopt(fd, SOL_SOCKET, SO_BUSY_POLL, &timeout, sizeof(timeout));`

export const xdpCode = `// XDP 프로그램 기본 구조 (BPF C)
#include <linux/bpf.h>
#include <bpf/bpf_helpers.h>
#include <linux/if_ether.h>
#include <linux/ip.h>

SEC("xdp")
int xdp_drop_icmp(struct xdp_md *ctx)
{
    void *data = (void *)(long)ctx->data;
    void *data_end = (void *)(long)ctx->data_end;

    struct ethhdr *eth = data;
    if ((void *)(eth + 1) > data_end)
        return XDP_PASS;

    if (eth->h_proto != __constant_htons(ETH_P_IP))
        return XDP_PASS;

    struct iphdr *ip = (void *)(eth + 1);
    if ((void *)(ip + 1) > data_end)
        return XDP_PASS;

    // ICMP 패킷 차단
    if (ip->protocol == IPPROTO_ICMP)
        return XDP_DROP;

    return XDP_PASS;
}

char _license[] SEC("license") = "GPL";

// XDP 프로그램 로드
// $ ip link set dev eth0 xdpgeneric obj xdp_drop.o sec xdp
// $ ip link show dev eth0  # xdpgeneric 확인`
