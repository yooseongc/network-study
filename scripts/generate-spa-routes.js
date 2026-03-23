/**
 * 빌드 후 SPA 라우트별 index.html을 생성합니다.
 * GitHub Pages는 서버사이드 라우팅을 지원하지 않으므로,
 * 각 라우트 경로에 index.html 사본을 배치하여 직접 접근/새로고침을 지원합니다.
 */
import { cpSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dist = resolve(__dirname, '..', 'dist')
const source = resolve(dist, 'index.html')

const routes = [
    'topic/01-basics',
    'topic/02-network-design',
    'topic/03-link-layer',
    'topic/04-ip-routing',
    'topic/05-transport',
    'topic/06-dns',
    'topic/07-http-tls-security',
    'topic/08-service-flow',
    'topic/09-linux-stack',
    'topic/10-iproute2-admin',
    'topic/11-packet-processing',
    'topic/12-performance',
    'topic/13-troubleshooting',
    'topic/14-load-balancing',
    'topic/15-cloud-container',
    'glossary',
    'graph',
]

if (!existsSync(source)) {
    console.error('dist/index.html not found. Run build first.')
    process.exit(1)
}

for (const route of routes) {
    const target = resolve(dist, route, 'index.html')
    mkdirSync(dirname(target), { recursive: true })
    cpSync(source, target)
}

console.log(`Generated ${routes.length} SPA route entries.`)
