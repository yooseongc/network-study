import { useState } from 'react'
import { glossary, type GlossaryTerm } from '../../data/glossary'

const CATEGORIES: { value: GlossaryTerm['category']; label: string }[] = [
    { value: 'fundamentals', label: '기초' },
    { value: 'link', label: '링크 계층' },
    { value: 'network', label: '네트워크' },
    { value: 'transport', label: '전송 계층' },
    { value: 'application', label: '응용 계층' },
    { value: 'security', label: '보안' },
    { value: 'linux', label: '리눅스' },
    { value: 'performance', label: '성능' },
    { value: 'design', label: '설계' },
    { value: 'general', label: '일반' },
]

export default function Glossary() {
    const [filter, setFilter] = useState<GlossaryTerm['category'] | 'all'>('all')
    const filtered = filter === 'all' ? glossary : glossary.filter((g) => g.category === filter)

    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
            <header className="space-y-3">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">용어 사전</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    네트워크 학습에서 자주 등장하는 핵심 용어를 정리합니다.
                </p>
            </header>

            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setFilter('all')}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                        filter === 'all'
                            ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                >
                    전체 ({glossary.length})
                </button>
                {CATEGORIES.map((cat) => {
                    const count = glossary.filter((g) => g.category === cat.value).length
                    if (count === 0) return null
                    return (
                        <button
                            key={cat.value}
                            onClick={() => setFilter(cat.value)}
                            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                                filter === cat.value
                                    ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                        >
                            {cat.label} ({count})
                        </button>
                    )
                })}
            </div>

            <div className="space-y-4">
                {filtered.map((term) => (
                    <div
                        key={term.id}
                        id={term.id}
                        className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4"
                    >
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="font-mono font-semibold text-sm text-gray-900 dark:text-gray-100">
                                {term.term}
                                {term.aliases.length > 0 && (
                                    <span className="ml-2 font-normal text-gray-400 dark:text-gray-500 text-xs">
                                        ({term.aliases.join(', ')})
                                    </span>
                                )}
                            </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{term.definition}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
