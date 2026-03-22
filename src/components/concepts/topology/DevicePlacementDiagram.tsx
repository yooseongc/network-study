import { useCallback, useState } from 'react'
import * as d3 from 'd3'
import { D3Container } from '../../viz/D3Container'
import { useIsDark } from '../../../hooks/useIsDark'
import { themeColors, createColorMap } from '../../../lib/colors'

const FONT = "'Pretendard Variable', Pretendard, sans-serif"
const MONO = "'JetBrains Mono', monospace"

type DeviceType = 'l2' | 'l3' | 'router' | 'firewall' | 'lb'

interface DeviceNode {
    id: string
    label: string
    sublabel?: string
    type: DeviceType
    col: number // 0=left, 1=right (within a tier pair)
    row: number // tier row index
}

interface LinkDef {
    from: string
    to: string
    dashed?: boolean
    label?: string // redundancy protocol label
}

const TYPE_META: Record<DeviceType, { colorKey: 'blue' | 'purple' | 'red' | 'amber' | 'green'; label: string }> = {
    l2: { colorKey: 'blue', label: 'L2 스위치' },
    l3: { colorKey: 'purple', label: 'L3 스위치' },
    router: { colorKey: 'red', label: '라우터' },
    firewall: { colorKey: 'amber', label: '방화벽' },
    lb: { colorKey: 'green', label: '로드밸런서' },
}

export function DevicePlacementDiagram() {
    const isDark = useIsDark()
    const [highlight, setHighlight] = useState<DeviceType | null>(null)

    const renderFn = useCallback(
        (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, _height: number) => {
            const tc = themeColors(isDark)
            const g = svg.append('g')
            const cm = createColorMap(tc, ['blue', 'purple', 'red', 'amber', 'green', 'cyan'])
            const cx = width / 2

            const fontSize = Math.max(7.5, Math.min(10, width / 55))
            const subFont = fontSize * 0.8
            const boxW = Math.min(100, width * 0.15)
            const boxH = 32
            // wide enough so label badges (VRRP, Active-Active) fit between the two boxes
            const pairGap = Math.min(280, Math.max(180, width * 0.42))

            // ── Row Y positions ──
            const titleY = 16
            const rows = [
                { y: 50, zone: 'Internet' },        // 0: Internet
                { y: 105, zone: '경계 보안 구간' },   // 1: Router A/B
                { y: 165, zone: '' },                // 2: Firewall A/B
                { y: 225, zone: '' },                // 3: LB A/B
                { y: 290, zone: '코어/배포 구간' },   // 4: Core L3 A/B
                { y: 355, zone: '' },                // 5: Dist L3
                { y: 420, zone: '액세스 구간' },      // 6: Access L2
                { y: 480, zone: '' },                // 7: Endpoints
            ]

            // ── Devices ──
            const devices: DeviceNode[] = [
                { id: 'internet', label: 'Internet', type: 'router', col: -1, row: 0 },

                { id: 'rtr-a', label: 'Router A', sublabel: 'VRRP Master', type: 'router', col: 0, row: 1 },
                { id: 'rtr-b', label: 'Router B', sublabel: 'VRRP Backup', type: 'router', col: 1, row: 1 },

                { id: 'fw-a', label: 'Firewall A', sublabel: 'Active', type: 'firewall', col: 0, row: 2 },
                { id: 'fw-b', label: 'Firewall B', sublabel: 'Standby', type: 'firewall', col: 1, row: 2 },

                { id: 'lb-a', label: 'LB A', sublabel: 'Active', type: 'lb', col: 0, row: 3 },
                { id: 'lb-b', label: 'LB B', sublabel: 'Active', type: 'lb', col: 1, row: 3 },

                { id: 'core-a', label: '백본 SW A', sublabel: '코어 L3', type: 'l3', col: 0, row: 4 },
                { id: 'core-b', label: '백본 SW B', sublabel: '코어 L3', type: 'l3', col: 1, row: 4 },

                { id: 'dist-a', label: '배포 L3', sublabel: '서버망', type: 'l3', col: 0, row: 5 },
                { id: 'dist-b', label: '배포 L3', sublabel: '사용자망', type: 'l3', col: 1, row: 5 },

                { id: 'acc-a', label: '액세스 L2', sublabel: 'PoE', type: 'l2', col: 0, row: 6 },
                { id: 'acc-b', label: '액세스 L2', sublabel: 'PoE', type: 'l2', col: 1, row: 6 },

                { id: 'srv', label: '서버', type: 'l2', col: 0, row: 7 },
                { id: 'usr', label: '사용자 PC', type: 'l2', col: 1, row: 7 },
            ]

            // ── Links ──
            const links: LinkDef[] = [
                // Internet to both routers
                { from: 'internet', to: 'rtr-a' },
                { from: 'internet', to: 'rtr-b' },
                // Router HA pair
                { from: 'rtr-a', to: 'rtr-b', dashed: true, label: 'VRRP' },
                // Router → Firewall (straight down)
                { from: 'rtr-a', to: 'fw-a' },
                { from: 'rtr-b', to: 'fw-b' },
                // Firewall HA pair
                { from: 'fw-a', to: 'fw-b', dashed: true, label: 'HA' },
                // FW → LB (straight down)
                { from: 'fw-a', to: 'lb-a' },
                { from: 'fw-b', to: 'lb-b' },
                // LB pair
                { from: 'lb-a', to: 'lb-b', dashed: true, label: 'Active-Active' },
                // LB → Core (straight down)
                { from: 'lb-a', to: 'core-a' },
                { from: 'lb-b', to: 'core-b' },
                // Core pair
                { from: 'core-a', to: 'core-b', dashed: true, label: 'MC-LAG' },
                // Core → Dist (straight down)
                { from: 'core-a', to: 'dist-a' },
                { from: 'core-b', to: 'dist-b' },
                // Dist → Access (straight down)
                { from: 'dist-a', to: 'acc-a' },
                { from: 'dist-b', to: 'acc-b' },
                // Access → endpoints
                { from: 'acc-a', to: 'srv' },
                { from: 'acc-b', to: 'usr' },
            ]

            // ── Resolve positions ──
            function getPos(dev: DeviceNode): { x: number; y: number } {
                const y = rows[dev.row].y
                if (dev.col === -1) return { x: cx, y } // centered (internet)
                const x = dev.col === 0 ? cx - pairGap / 2 : cx + pairGap / 2
                return { x, y }
            }

            const posMap = new Map<string, { x: number; y: number }>()
            for (const d of devices) posMap.set(d.id, getPos(d))

            // ── Title ──
            g.append('text')
                .attr('x', cx).attr('y', titleY)
                .attr('text-anchor', 'middle')
                .attr('font-size', Math.max(11, fontSize * 1.2)).attr('font-weight', 'bold')
                .attr('fill', tc.text).attr('font-family', FONT)
                .text('이중화 네트워크 장비 배치도')

            // ── Zone backgrounds ──
            const zones = [
                { label: '경계 보안', yStart: rows[1].y - 22, yEnd: rows[3].y + 22, color: tc.amberFill, stroke: tc.amberStroke, text: tc.amberText },
                { label: '코어/배포', yStart: rows[4].y - 22, yEnd: rows[5].y + 22, color: tc.purpleFill, stroke: tc.purpleStroke, text: tc.purpleText },
                { label: '액세스', yStart: rows[6].y - 22, yEnd: rows[7].y + 22, color: tc.blueFill, stroke: tc.blueStroke, text: tc.blueText },
            ]
            const zoneMargin = Math.max(16, width * 0.03)
            zones.forEach(z => {
                g.append('rect')
                    .attr('x', zoneMargin).attr('y', z.yStart)
                    .attr('width', width - zoneMargin * 2).attr('height', z.yEnd - z.yStart)
                    .attr('rx', 8)
                    .attr('fill', z.color).attr('stroke', z.stroke)
                    .attr('stroke-width', 0.8).attr('stroke-dasharray', '4,3').attr('opacity', 0.4)

                g.append('text')
                    .attr('x', zoneMargin + 8).attr('y', z.yStart + 12)
                    .attr('font-size', subFont).attr('font-weight', 600)
                    .attr('fill', z.text).attr('font-family', FONT).attr('opacity', 0.7)
                    .text(z.label)
            })

            // ── Draw links (lines only, labels deferred) ──
            const deferredLabels: { x: number; y: number; text: string }[] = []

            for (const link of links) {
                const s = posMap.get(link.from)!
                const t = posMap.get(link.to)!
                const sType = devices.find(d => d.id === link.from)?.type
                const tType = devices.find(d => d.id === link.to)?.type
                const dimmed = highlight !== null && sType !== highlight && tType !== highlight

                const isHorizontal = s.y === t.y

                // Horizontal links: connect side faces (x ± boxW/2)
                // Vertical links: connect top/bottom faces (y ± boxH/2)
                let x1: number, y1: number, x2: number, y2: number
                if (isHorizontal) {
                    x1 = s.x + boxW / 2
                    y1 = s.y
                    x2 = t.x - boxW / 2
                    y2 = t.y
                } else {
                    x1 = s.x
                    y1 = s.y + boxH / 2
                    x2 = t.x
                    y2 = t.y - boxH / 2
                }

                const mainColor = isDark ? 'oklch(60% 0 0)' : 'oklch(45% 0 0)'
                const dashColor = isDark ? 'oklch(55% 0.08 250)' : 'oklch(50% 0.08 250)'

                g.append('line')
                    .attr('x1', x1).attr('y1', y1)
                    .attr('x2', x2).attr('y2', y2)
                    .attr('stroke', dimmed ? tc.border : (link.dashed ? dashColor : mainColor))
                    .attr('stroke-width', dimmed ? 0.4 : (link.dashed ? 1.5 : 2))
                    .attr('stroke-dasharray', link.dashed ? '5,4' : 'none')
                    .attr('opacity', dimmed ? 0.1 : (link.dashed ? 0.6 : 0.8))

                // Collect labels for deferred rendering (on top of everything)
                if (link.label && isHorizontal && !dimmed) {
                    deferredLabels.push({
                        x: (s.x + t.x) / 2,
                        y: s.y,
                        text: link.label,
                    })
                }
            }

            // ── Draw devices ──
            for (const dev of devices) {
                const pos = posMap.get(dev.id)!
                const meta = TYPE_META[dev.type]
                const c = cm[meta.colorKey]
                const dimmed = highlight !== null && dev.type !== highlight
                const isEndpoint = ['srv', 'usr'].includes(dev.id)
                const effectiveDim = isEndpoint ? highlight !== null && highlight !== 'l2' : dimmed

                const ng = g.append('g')
                    .attr('transform', `translate(${pos.x},${pos.y})`)
                    .attr('opacity', effectiveDim ? 0.12 : 1)

                ng.append('rect')
                    .attr('x', -boxW / 2).attr('y', -boxH / 2)
                    .attr('width', boxW).attr('height', boxH)
                    .attr('rx', 6)
                    .attr('fill', c.fill).attr('stroke', c.stroke).attr('stroke-width', 1.5)

                const labelY = dev.sublabel ? -3 : 4
                ng.append('text')
                    .attr('x', 0).attr('y', labelY)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', fontSize * 0.85).attr('font-weight', 700)
                    .attr('fill', c.text).attr('font-family', FONT)
                    .text(dev.label)

                if (dev.sublabel) {
                    const subHasKorean = /[\uAC00-\uD7AF]/.test(dev.sublabel)
                    ng.append('text')
                        .attr('x', 0).attr('y', 10)
                        .attr('text-anchor', 'middle')
                        .attr('font-size', subFont).attr('font-weight', 400)
                        .attr('fill', tc.textDim).attr('font-family', subHasKorean ? FONT : MONO)
                        .text(dev.sublabel)
                }
            }

            // ── Draw deferred labels (topmost layer, with background) ──
            for (const lbl of deferredLabels) {
                const lblLen = lbl.text.length * subFont * 0.55 + 10
                const lblH = subFont + 6
                g.append('rect')
                    .attr('x', lbl.x - lblLen / 2).attr('y', lbl.y - lblH / 2 - 8)
                    .attr('width', lblLen).attr('height', lblH)
                    .attr('rx', 3)
                    .attr('fill', isDark ? 'oklch(16% 0 0)' : 'oklch(99% 0 0)')
                    .attr('stroke', tc.border).attr('stroke-width', 0.5)
                g.append('text')
                    .attr('x', lbl.x).attr('y', lbl.y - 5)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', subFont * 0.85).attr('font-weight', 700)
                    .attr('fill', tc.textMuted).attr('font-family', MONO)
                    .text(lbl.text)
            }
        },
        [isDark, highlight],
    )

    const types: { key: DeviceType; label: string; section: string }[] = [
        { key: 'l2', label: 'L2 스위치', section: '2.4' },
        { key: 'l3', label: 'L3 스위치', section: '2.5' },
        { key: 'router', label: '라우터', section: '2.6' },
        { key: 'firewall', label: '방화벽', section: '2.7' },
        { key: 'lb', label: '로드밸런서', section: '2.8' },
    ]

    return (
        <div className="space-y-3">
            <D3Container
                renderFn={renderFn}
                deps={[isDark, highlight]}
                height={520}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                zoomable
            />
            <div className="flex flex-wrap justify-center gap-2">
                <button
                    onClick={() => setHighlight(null)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        highlight === null
                            ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                    전체 보기
                </button>
                {types.map(t => (
                    <button
                        key={t.key}
                        onClick={() => setHighlight(highlight === t.key ? null : t.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                            highlight === t.key
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                    >
                        {t.section} {t.label}
                    </button>
                ))}
            </div>
        </div>
    )
}
