import { Section } from '../../components/ui/Section'
import { Prose } from '../../components/ui/Prose'
import { LearningCard } from '../../components/ui/LearningCard'
import { TopicNavigation } from '../../components/ui/TopicNavigation'

export default function Topic03() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-14">
            <header className="space-y-3">
                <p className="text-xs font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                    Topic 03
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    물리 계층과 링크 계층
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    Physical & Link Layer
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    Ethernet 프레임의 구조를 이해하고, 스위치가 MAC 주소를 학습하여 패킷을 전달하는 과정을 시각화합니다.
                </p>
            </header>

            <LearningCard
                topicId="03-link-layer"
                items={[
                    'Ethernet 프레임 구조를 이해한다',
                    '스위치의 MAC 테이블 동작을 설명할 수 있다',
                    'VLAN과 802.1Q 태깅의 원리를 파악한다',
                ]}
            />

            <Section id="s031" title="3.1  물리 계층의 역할">
                <Prose>이 섹션은 준비 중입니다.</Prose>
            </Section>

            <TopicNavigation topicId="03-link-layer" />
        </div>
    )
}
