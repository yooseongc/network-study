import { Link } from 'react-router-dom'
import { networkTopics } from '../../data/networkTopics'
import { CardGrid } from '@study-ui/components'

const difficultyLabel = { beginner: '입문', intermediate: '중급', advanced: '심화' }
const difficultyColor = {
    beginner: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30',
    intermediate: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30',
    advanced: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30',
}

export default function Home() {
    return (
        <div className="max-w-5xl mx-auto px-6 py-10">
            {/* Hero */}
            <div className="mb-12">
                <div className="inline-block text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 rounded-full px-3 py-1 mb-4">
                    네트워크 내부 동작 시각화 학습
                </div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                    네트워크 스터디
                    <span className="text-blue-600 dark:text-blue-400 ml-3 text-2xl font-normal">Network Study</span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl leading-relaxed">
                    네트워크의 핵심 동작을 인터랙티브 시각화로 배워봅니다. 실제 망이 어떻게 구성되고,
                    패킷이 어떤 경로로 흐르는지 — 개념, 구조, 흐름을 한눈에.
                </p>
                <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">
                    검색하려면{' '}
                    <kbd className="border border-gray-300 dark:border-gray-700 rounded px-1.5 py-0.5 font-mono text-xs">
                        ⌘K
                    </kbd>{' '}
                    를 누르세요
                </p>
            </div>

            {/* 안내 메시지 */}
            <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 mb-10 flex gap-4">
                <div className="text-3xl">🌐</div>
                <div>
                    <div className="font-semibold text-gray-800 dark:text-gray-200 mb-1">어떻게 사용하나요?</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        왼쪽 사이드바에서 원하는 토픽을 선택하세요. 각 페이지는{' '}
                        <span className="text-blue-600 dark:text-blue-400">인터랙티브 다이어그램</span>,{' '}
                        <span className="text-orange-500 dark:text-orange-400">단계별 애니메이션</span>,{' '}
                        <span className="text-green-600 dark:text-green-400">실제 네트워크 명령어와 구성 예시</span>와 함께 개념을
                        설명합니다. D3 기반 인터랙티브 다이어그램과 SVG 애니메이션으로 구성되어 있습니다.
                    </p>
                </div>
            </div>

            {/* 토픽 그리드 */}
            <CardGrid cols={2} className="gap-4">
                {networkTopics.map((topic) => (
                    <Link
                        key={topic.id}
                        to={topic.route}
                        className="group rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-400 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all duration-200 p-5 flex gap-4"
                    >
                        <div className="shrink-0 w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40 flex items-center justify-center font-mono text-sm font-bold text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {String(topic.number).padStart(2, '0')}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white text-sm leading-snug">
                                    {topic.title}
                                </h2>
                                <span
                                    className={`shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded ${difficultyColor[topic.difficulty]}`}
                                >
                                    {difficultyLabel[topic.difficulty]}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">{topic.description}</p>
                            {topic.prerequisites.length > 0 && (
                                <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-1.5">
                                    선수 지식:{' '}
                                    {topic.prerequisites
                                        .map((id) => {
                                            const t = networkTopics.find((k) => k.id === id)
                                            return t ? `Topic ${String(t.number).padStart(2, '0')}` : id
                                        })
                                        .join(', ')}
                                </p>
                            )}
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {topic.tags.slice(0, 3).map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5 font-mono"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Link>
                ))}
            </CardGrid>

            <p className="text-center text-xs text-gray-400 dark:text-gray-700 mt-10">
                © 2026 yooseongc · network-study
            </p>
        </div>
    )
}
