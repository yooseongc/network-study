import { Section } from '../../components/ui/Section'
import { Prose } from '../../components/ui/Prose'
import { LearningCard } from '../../components/ui/LearningCard'
import { TopicNavigation } from '../../components/ui/TopicNavigation'

export default function Topic01() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-14">
            <header className="space-y-3">
                <p className="text-xs font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                    Topic 01
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    네트워크의 기초와 전체 구조
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    Network Fundamentals & Architecture
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    네트워크가 왜 계층적으로 설계되었는지 이해하고, 데이터가 어떤 단위를 거쳐 전달되는지 큰 그림을 잡습니다.
                </p>
            </header>

            <LearningCard
                topicId="01-basics"
                items={[
                    'OSI 7계층과 TCP/IP 모델의 차이를 이해한다',
                    '캡슐화/역캡슐화 과정을 시각적으로 파악한다',
                    'MTU의 의미와 중요성을 설명할 수 있다',
                ]}
            />

            <Section id="s011" title="1.1  네트워크란 무엇인가">
                <Prose>이 섹션은 준비 중입니다.</Prose>
            </Section>

            <TopicNavigation topicId="01-basics" />
        </div>
    )
}
