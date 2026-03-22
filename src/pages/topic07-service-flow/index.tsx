import { Section } from '../../components/ui/Section'
import { Prose } from '../../components/ui/Prose'
import { LearningCard } from '../../components/ui/LearningCard'
import { TopicNavigation } from '../../components/ui/TopicNavigation'

export default function Topic07() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-14">
            <header className="space-y-3">
                <p className="text-xs font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                    Topic 07
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    실제 서비스 망 설계와 트래픽 흐름
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    Service Network Design & Traffic Flow
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    사용자의 요청이 실제로 어떤 경로를 거쳐 서버에 도달하는지, NAT과 로드밸런서의 역할을 추적합니다.
                </p>
            </header>

            <LearningCard
                topicId="07-service-flow"
                items={[
                    '사용자 요청의 실제 경로를 추적할 수 있다',
                    'NAT 적용 위치와 동작을 이해한다',
                    'East-West/North-South 트래픽을 구분할 수 있다',
                ]}
            />

            <Section id="s071" title="7.1  서비스 트래픽의 흐름">
                <Prose>이 섹션은 준비 중입니다.</Prose>
            </Section>

            <TopicNavigation topicId="07-service-flow" />
        </div>
    )
}
