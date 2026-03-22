import { Section } from '../../components/ui/Section'
import { Prose } from '../../components/ui/Prose'
import { LearningCard } from '../../components/ui/LearningCard'
import { TopicNavigation } from '../../components/ui/TopicNavigation'

export default function Topic10() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-14">
            <header className="space-y-3">
                <p className="text-xs font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                    Topic 10
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    성능과 트래픽 제어
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    Performance & Traffic Control
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    네트워크 성능 최적화 기법과 트래픽 제어 메커니즘을 심층적으로 학습합니다.
                </p>
            </header>

            <LearningCard
                topicId="10-performance"
                items={[
                    'NIC offload 기능의 종류와 효과를 이해한다',
                    'RSS/RPS로 멀티코어 분산 처리를 설명할 수 있다',
                    'XDP와 DPDK의 개요와 차이를 파악한다',
                ]}
            />

            <Section id="s101" title="10.1  네트워크 성능의 기본 지표">
                <Prose>이 섹션은 준비 중입니다.</Prose>
            </Section>

            <TopicNavigation topicId="10-performance" />
        </div>
    )
}
