import { Section } from '../../components/ui/Section'
import { Prose } from '../../components/ui/Prose'
import { LearningCard } from '../../components/ui/LearningCard'
import { TopicNavigation } from '../../components/ui/TopicNavigation'

export default function Topic06() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-14">
            <header className="space-y-3">
                <p className="text-xs font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                    Topic 06
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    이름 해석과 주요 응용 프로토콜
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    DNS, HTTP, TLS & Application Protocols
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    DNS 질의 과정과 HTTP/HTTPS 통신, TLS handshake의 동작을 단계별로 학습합니다.
                </p>
            </header>

            <LearningCard
                topicId="06-application"
                items={[
                    'DNS 재귀/반복 질의 과정을 이해한다',
                    'HTTP/HTTPS 차이와 TLS handshake를 설명할 수 있다',
                    '프록시와 리버스 프록시의 역할을 파악한다',
                ]}
            />

            <Section id="s061" title="6.1  DNS의 구조와 동작">
                <Prose>이 섹션은 준비 중입니다.</Prose>
            </Section>

            <TopicNavigation topicId="06-application" />
        </div>
    )
}
