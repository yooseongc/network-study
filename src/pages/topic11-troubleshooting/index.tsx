import { Section } from '../../components/ui/Section'
import { Prose } from '../../components/ui/Prose'
import { LearningCard } from '../../components/ui/LearningCard'
import { TopicNavigation } from '../../components/ui/TopicNavigation'

export default function Topic11() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-14">
            <header className="space-y-3">
                <p className="text-xs font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                    Topic 11
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    네트워크 장애 분석과 관측
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    Network Troubleshooting & Observability
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    네트워크 장애의 원인을 체계적으로 분석하고, 다양한 진단 도구를 활용하는 방법을 학습합니다.
                </p>
            </header>

            <LearningCard
                topicId="11-troubleshooting"
                items={[
                    'tcpdump로 패킷 캡처 및 분석을 수행할 수 있다',
                    '장애 원인을 DNS/TCP/TLS 단계별로 구분할 수 있다',
                    '체계적 장애 분석 절차를 설명할 수 있다',
                ]}
            />

            <Section id="s111" title="11.1  장애 분석의 기본 접근">
                <Prose>이 섹션은 준비 중입니다.</Prose>
            </Section>

            <TopicNavigation topicId="11-troubleshooting" />
        </div>
    )
}
