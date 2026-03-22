import { Section } from '../../components/ui/Section'
import { Prose } from '../../components/ui/Prose'
import { LearningCard } from '../../components/ui/LearningCard'
import { TopicNavigation } from '../../components/ui/TopicNavigation'

export default function Topic12() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-14">
            <header className="space-y-3">
                <p className="text-xs font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                    Topic 12
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    현대 네트워크와 실전 아키텍처
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    Modern Network Architecture
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    현대적인 네트워크 아키텍처의 핵심 개념과 실전 설계 원리를 종합적으로 학습합니다.
                </p>
            </header>

            <LearningCard
                topicId="12-modern-architecture"
                items={[
                    'L4/L7 로드밸런싱의 차이를 이해한다',
                    '클라우드/컨테이너 네트워크의 기초를 설명할 수 있다',
                    '고가용성 설계 원리를 파악한다',
                ]}
            />

            <Section id="s121" title="12.1  로드밸런싱의 원리">
                <Prose>이 섹션은 준비 중입니다.</Prose>
            </Section>

            <TopicNavigation topicId="12-modern-architecture" />
        </div>
    )
}
