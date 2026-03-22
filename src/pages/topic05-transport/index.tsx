import { Section } from '../../components/ui/Section'
import { Prose } from '../../components/ui/Prose'
import { LearningCard } from '../../components/ui/LearningCard'
import { TopicNavigation } from '../../components/ui/TopicNavigation'

export default function Topic05() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-14">
            <header className="space-y-3">
                <p className="text-xs font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                    Topic 05
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    전송 계층: TCP와 UDP
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    Transport Layer: TCP & UDP
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    TCP의 연결 설정/해제 과정과 흐름/혼잡 제어 메커니즘을 시각화하고, UDP와의 차이를 비교합니다.
                </p>
            </header>

            <LearningCard
                topicId="05-transport"
                items={[
                    'TCP 3-way/4-way handshake 과정을 이해한다',
                    '흐름/혼잡 제어 메커니즘을 설명할 수 있다',
                    'UDP의 특징과 활용 사례를 파악한다',
                ]}
            />

            <Section id="s051" title="5.1  전송 계층의 역할">
                <Prose>이 섹션은 준비 중입니다.</Prose>
            </Section>

            <TopicNavigation topicId="05-transport" />
        </div>
    )
}
