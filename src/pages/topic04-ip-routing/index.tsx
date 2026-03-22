import { Section } from '../../components/ui/Section'
import { Prose } from '../../components/ui/Prose'
import { LearningCard } from '../../components/ui/LearningCard'
import { TopicNavigation } from '../../components/ui/TopicNavigation'

export default function Topic04() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-14">
            <header className="space-y-3">
                <p className="text-xs font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                    Topic 04
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    IP 주소와 라우팅의 기초
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    IP Addressing & Routing
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    IP 주소 체계와 서브넷팅을 이해하고, 라우팅 테이블이 패킷의 경로를 결정하는 과정을 학습합니다.
                </p>
            </header>

            <LearningCard
                topicId="04-ip-routing"
                items={[
                    'IPv4/IPv6 주소 체계를 이해한다',
                    '서브넷팅과 CIDR 표기법을 활용할 수 있다',
                    '라우팅 테이블과 longest prefix match를 설명할 수 있다',
                ]}
            />

            <Section id="s041" title="4.1  IP 주소의 구조">
                <Prose>이 섹션은 준비 중입니다.</Prose>
            </Section>

            <TopicNavigation topicId="04-ip-routing" />
        </div>
    )
}
