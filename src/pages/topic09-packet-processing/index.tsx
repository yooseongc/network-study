import { Section } from '../../components/ui/Section'
import { Prose } from '../../components/ui/Prose'
import { LearningCard } from '../../components/ui/LearningCard'
import { TopicNavigation } from '../../components/ui/TopicNavigation'

export default function Topic09() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-14">
            <header className="space-y-3">
                <p className="text-xs font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                    Topic 09
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    패킷 처리와 방화벽 / NAT / 프록시
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    Packet Processing, Firewall, NAT & Proxy
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    Netfilter 기반의 패킷 필터링, NAT, 프록시 동작을 커널 수준에서 이해합니다.
                </p>
            </header>

            <LearningCard
                topicId="09-packet-processing"
                items={[
                    'Netfilter 5개 훅 포인트를 이해한다',
                    'conntrack과 stateful 방화벽의 동작을 설명할 수 있다',
                    'TPROXY와 transparent proxy의 원리를 파악한다',
                ]}
            />

            <Section id="s091" title="9.1  Netfilter 아키텍처">
                <Prose>이 섹션은 준비 중입니다.</Prose>
            </Section>

            <TopicNavigation topicId="09-packet-processing" />
        </div>
    )
}
