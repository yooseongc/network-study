import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as d3 from 'd3'
import { networkTopics } from '../../data/networkTopics'
import { glossary } from '../../data/glossary'
import type { GlossaryCategory } from '../../data/glossary'
import { useIsDark } from '../../hooks/useIsDark'
import { D3Container } from '../../components/viz/D3Container'

/* ── colour maps ─────────────────────────────────────────── */

const CAT_COLOR: Record<string, string> = {
    fundamentals: '#3b82f6',
    link: '#a855f7',
    network: '#22c55e',
    transport: '#f97316',
    application: '#06b6d4',
    security: '#ef4444',
    linux: '#eab308',
    performance: '#f43f5e',
    design: '#6366f1',
    general: '#14b8a6',
}
const CAT_LABEL: Record<string, string> = {
    fundamentals: '기초',
    link: '링크 계층',
    network: '네트워크',
    transport: '전송 계층',
    application: '응용 계층',
    security: '보안',
    linux: '리눅스',
    performance: '성능',
    design: '설계',
    general: '일반',
}

const TOPIC_HUES = [250, 278, 305, 332, 5, 30, 57, 85, 112, 140, 168, 196]

/* ── data types ──────────────────────────────────────────── */

interface TopicNode extends d3.SimulationNodeDatum {
    id: string
    kind: 'topic'
    number: number
    title: string
    route: string
    hue: number
}

interface GlossaryNode extends d3.SimulationNodeDatum {
    id: string
    kind: 'glossary'
    term: string
    category: GlossaryCategory
    definition: string
}

type GraphNode = TopicNode | GlossaryNode

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
    type: 'topic-topic' | 'glossary-topic'
}

/* ── helpers ─────────────────────────────────────────────── */

function buildGraph(showTopics: boolean, showGlossary: boolean, catFilter: Set<string>) {
    const nodes: GraphNode[] = []
    const links: GraphLink[] = []
    const nodeSet = new Set<string>()

    if (showTopics) {
        for (const t of networkTopics) {
            const idx = t.number - 1
            nodes.push({
                id: t.id,
                kind: 'topic',
                number: t.number,
                title: t.title,
                route: t.route,
                hue: TOPIC_HUES[idx] ?? 0,
            })
            nodeSet.add(t.id)
        }

        // topic-topic links via shared tags
        const tagMap = new Map<string, string[]>()
        for (const t of networkTopics) {
            for (const tag of t.tags) {
                const arr = tagMap.get(tag) ?? []
                arr.push(t.id)
                tagMap.set(tag, arr)
            }
        }
        const seen = new Set<string>()
        for (const ids of tagMap.values()) {
            for (let i = 0; i < ids.length; i++) {
                for (let j = i + 1; j < ids.length; j++) {
                    const key = `${ids[i]}||${ids[j]}`
                    if (!seen.has(key)) {
                        seen.add(key)
                        links.push({ source: ids[i], target: ids[j], type: 'topic-topic' })
                    }
                }
            }
        }
    }

    if (showGlossary) {
        for (const g of glossary) {
            if (!catFilter.has(g.category)) continue
            nodes.push({
                id: `g:${g.id}`,
                kind: 'glossary',
                term: g.term,
                category: g.category,
                definition: g.definition,
            })
            nodeSet.add(`g:${g.id}`)
            if (showTopics) {
                for (const ref of g.topicRef) {
                    if (nodeSet.has(ref)) {
                        links.push({ source: `g:${g.id}`, target: ref, type: 'glossary-topic' })
                    }
                }
            }
        }
    }

    return { nodes, links }
}

/* ── component ───────────────────────────────────────────── */

export default function Graph() {
    const isDark = useIsDark()
    const navigate = useNavigate()

    const [showTopics, setShowTopics] = useState(true)
    const [showGlossary, setShowGlossary] = useState(true)
    const allCats = useMemo(() => Object.keys(CAT_COLOR), [])
    const [catFilter, setCatFilter] = useState<Set<string>>(() => new Set(allCats))

    const toggleCat = useCallback((cat: string) => {
        setCatFilter((prev) => {
            const next = new Set(prev)
            if (next.has(cat)) next.delete(cat)
            else next.add(cat)
            return next
        })
    }, [])

    const graph = useMemo(
        () => buildGraph(showTopics, showGlossary, catFilter),
        [showTopics, showGlossary, catFilter],
    )

    const renderGraph = useCallback(
        (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, height: number) => {
            if (graph.nodes.length === 0) return

            const g = svg.append('g')

            // deep-clone to avoid mutating cached graph
            const nodes: GraphNode[] = graph.nodes.map((n) => ({ ...n }))
            const links: GraphLink[] = graph.links.map((l) => ({
                ...l,
                source: typeof l.source === 'string' ? l.source : (l.source as GraphNode).id,
                target: typeof l.target === 'string' ? l.target : (l.target as GraphNode).id,
            }))

            const sim = d3
                .forceSimulation<GraphNode>(nodes)
                .force(
                    'link',
                    d3
                        .forceLink<GraphNode, GraphLink>(links)
                        .id((d) => d.id)
                        .distance((l) => (l.type === 'topic-topic' ? 160 : 90)),
                )
                .force('charge', d3.forceManyBody().strength(-300))
                .force('center', d3.forceCenter(width / 2, height / 2))
                .force(
                    'collision',
                    d3.forceCollide<GraphNode>().radius((d) => (d.kind === 'topic' ? 32 : 14)),
                )

            // tooltip
            const tooltip = d3
                .select('body')
                .append('div')
                .attr('class', 'graph-tooltip')
                .style('position', 'absolute')
                .style('pointer-events', 'none')
                .style('padding', '8px 12px')
                .style('border-radius', '8px')
                .style('font-size', '12px')
                .style('line-height', '1.5')
                .style('max-width', '260px')
                .style('z-index', '9999')
                .style('opacity', 0)
                .style('background', isDark ? '#1f2937' : '#fff')
                .style('color', isDark ? '#e5e7eb' : '#1f2937')
                .style('border', `1px solid ${isDark ? '#374151' : '#e5e7eb'}`)
                .style('box-shadow', '0 4px 12px rgba(0,0,0,0.15)')

            // links
            const link = g
                .append('g')
                .selectAll<SVGLineElement, GraphLink>('line')
                .data(links)
                .join('line')
                .attr('stroke', isDark ? '#4b5563' : '#d1d5db')
                .attr('stroke-width', (d) => (d.type === 'topic-topic' ? 2 : 1))
                .attr('stroke-dasharray', (d) => (d.type === 'glossary-topic' ? '4 3' : 'none'))
                .attr('stroke-opacity', 0.6)

            // node groups
            const node = g
                .append('g')
                .selectAll<SVGGElement, GraphNode>('g')
                .data(nodes)
                .join('g')
                .style('cursor', 'pointer')
                .on('mouseover', (_event, d) => {
                    let html = ''
                    if (d.kind === 'topic') {
                        html = `<strong>${d.number}. ${d.title}</strong>`
                    } else {
                        html = `<strong>${d.term}</strong><br/><span style="color:${CAT_COLOR[d.category]}">${CAT_LABEL[d.category]}</span><br/>${d.definition}`
                    }
                    tooltip.html(html).style('opacity', 1)
                })
                .on('mousemove', (event) => {
                    tooltip
                        .style('left', `${event.pageX + 14}px`)
                        .style('top', `${event.pageY - 10}px`)
                })
                .on('mouseout', () => {
                    tooltip.style('opacity', 0)
                })
                .on('click', (_event, d) => {
                    if (d.kind === 'topic') {
                        navigate(d.route)
                    }
                })

            // topic circles
            node.filter((d) => d.kind === 'topic')
                .append('circle')
                .attr('r', 26)
                .attr('fill', (d) => {
                    const t = d as TopicNode
                    return `hsl(${t.hue}, 65%, ${isDark ? 35 : 55}%)`
                })
                .attr('stroke', (d) => {
                    const t = d as TopicNode
                    return `hsl(${t.hue}, 70%, ${isDark ? 55 : 40}%)`
                })
                .attr('stroke-width', 2.5)

            node.filter((d) => d.kind === 'topic')
                .append('text')
                .text((d) => String((d as TopicNode).number))
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'central')
                .attr('fill', '#fff')
                .attr('font-size', '13px')
                .attr('font-weight', '700')

            // glossary circles
            node.filter((d) => d.kind === 'glossary')
                .append('circle')
                .attr('r', 10)
                .attr('fill', (d) => CAT_COLOR[(d as GlossaryNode).category] ?? '#999')
                .attr('fill-opacity', isDark ? 0.7 : 0.85)
                .attr('stroke', (d) => CAT_COLOR[(d as GlossaryNode).category] ?? '#999')
                .attr('stroke-width', 1.5)
                .attr('stroke-opacity', 0.5)

            node.filter((d) => d.kind === 'glossary')
                .append('text')
                .text((d) => (d as GlossaryNode).term.slice(0, 4))
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'central')
                .attr('fill', '#fff')
                .attr('font-size', '7px')
                .attr('font-weight', '600')

            // drag behaviour
            const drag = d3
                .drag<SVGGElement, GraphNode>()
                .on('start', (event, d) => {
                    if (!event.active) sim.alphaTarget(0.3).restart()
                    d.fx = d.x
                    d.fy = d.y
                })
                .on('drag', (event, d) => {
                    d.fx = event.x
                    d.fy = event.y
                })
                .on('end', (event, d) => {
                    if (!event.active) sim.alphaTarget(0)
                    d.fx = null
                    d.fy = null
                })

            node.call(drag)

            // tick
            sim.on('tick', () => {
                link.attr('x1', (d) => (d.source as GraphNode).x ?? 0)
                    .attr('y1', (d) => (d.source as GraphNode).y ?? 0)
                    .attr('x2', (d) => (d.target as GraphNode).x ?? 0)
                    .attr('y2', (d) => (d.target as GraphNode).y ?? 0)

                node.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`)
            })

            // cleanup tooltip on unmount
            return () => {
                tooltip.remove()
                sim.stop()
            }
        },
        [graph, isDark, navigate],
    )

    return (
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
            {/* header */}
            <header className="space-y-3">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">네트워크 개념 그래프</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    12개 토픽과 용어 사이의 관계를 힘-방향 그래프로 탐색합니다. 노드를 드래그하거나
                    클릭하여 이동할 수 있습니다.
                </p>
            </header>

            {/* filters */}
            <div className="flex flex-wrap items-center gap-2">
                <button
                    onClick={() => setShowTopics((v) => !v)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        showTopics
                            ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100'
                            : 'bg-transparent text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600'
                    }`}
                >
                    토픽
                </button>
                <button
                    onClick={() => setShowGlossary((v) => !v)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        showGlossary
                            ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100'
                            : 'bg-transparent text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600'
                    }`}
                >
                    용어
                </button>

                <span className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />

                {allCats.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => toggleCat(cat)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                            catFilter.has(cat)
                                ? 'border-current'
                                : 'opacity-30 border-gray-300 dark:border-gray-600'
                        }`}
                        style={{ color: CAT_COLOR[cat] }}
                    >
                        {CAT_LABEL[cat]}
                    </button>
                ))}
            </div>

            {/* graph */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 overflow-hidden">
                <D3Container
                    renderFn={renderGraph}
                    deps={[graph, isDark]}
                    height={560}
                    zoomable
                />
            </div>

            {/* legend */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-4 space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">범례</h3>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1.5">
                        <span className="inline-block w-5 h-5 rounded-full bg-indigo-500 border-2 border-indigo-400 text-white text-[9px] font-bold flex items-center justify-center leading-none">
                            N
                        </span>
                        토픽 (번호)
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="inline-block w-3 h-3 rounded-full bg-gray-400" />
                        용어
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="inline-block w-5 border-t-2 border-gray-400" />
                        공유 태그 (토픽 간)
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="inline-block w-5 border-t border-dashed border-gray-400" />
                        참조 (용어 → 토픽)
                    </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
                    {allCats.map((cat) => (
                        <span key={cat} className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                            <span
                                className="inline-block w-2.5 h-2.5 rounded-full"
                                style={{ background: CAT_COLOR[cat] }}
                            />
                            {CAT_LABEL[cat]}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}
