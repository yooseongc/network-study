import { Section } from '../../components/ui/Section'
import { Prose } from '../../components/ui/Prose'
import { LearningCard } from '../../components/ui/LearningCard'
import { TopicNavigation } from '../../components/ui/TopicNavigation'

export default function Topic02() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-14">
            <header className="space-y-3">
                <p className="text-xs font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                    Topic 02
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    실제 네트워크 망 구성의 기초
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    Real-World Network Design
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    가정용과 기업 네트워크 구조의 차이를 비교하고, DMZ와 보안장비 배치의 원리를 학습합니다.
                </p>
            </header>

            <LearningCard
                topicId="02-network-design"
                items={[
                    '가정용/기업 네트워크 구조 차이를 설명할 수 있다',
                    'DMZ와 망 분리 개념을 이해한다',
                    '보안장비 배치 위치와 역할을 파악한다',
                ]}
            />

            <Section id="s021" title="2.1  네트워크 토폴로지의 기본">
                <Prose>이 섹션은 준비 중입니다.</Prose>
            </Section>

            <TopicNavigation topicId="02-network-design" />
        </div>
    )
}
