import { Section } from '../../components/ui/Section'
import { Prose } from '../../components/ui/Prose'
import { LearningCard } from '../../components/ui/LearningCard'
import { TopicNavigation } from '../../components/ui/TopicNavigation'

export default function Topic08() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-14">
            <header className="space-y-3">
                <p className="text-xs font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                    Topic 08
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    리눅스에서의 네트워크 동작
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    Linux Network Stack
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    리눅스 커널의 네트워크 스택 내부 구조와 패킷 처리 과정을 단계별로 학습합니다.
                </p>
            </header>

            <LearningCard
                topicId="08-linux-network"
                items={[
                    'NIC 드라이버와 NAPI 구조를 이해한다',
                    'sk_buff 데이터 구조의 역할을 설명할 수 있다',
                    'iproute2 도구를 활용할 수 있다',
                ]}
            />

            <Section id="s081" title="8.1  리눅스 네트워크 스택 개요">
                <Prose>이 섹션은 준비 중입니다.</Prose>
            </Section>

            <TopicNavigation topicId="08-linux-network" />
        </div>
    )
}
