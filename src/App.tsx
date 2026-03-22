import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AppLayout } from './components/layout/AppLayout'
import Home from './pages/Home'

const Topic01 = lazy(() => import('./pages/topic01-basics'))
const Topic02 = lazy(() => import('./pages/topic02-network-design'))
const Topic03 = lazy(() => import('./pages/topic03-link-layer'))
const Topic04 = lazy(() => import('./pages/topic04-ip-routing'))
const Topic05 = lazy(() => import('./pages/topic05-transport'))
const Topic06 = lazy(() => import('./pages/topic06-application'))
const Topic07 = lazy(() => import('./pages/topic07-service-flow'))
const Topic08 = lazy(() => import('./pages/topic08-linux-network'))
const Topic09 = lazy(() => import('./pages/topic09-packet-processing'))
const Topic10 = lazy(() => import('./pages/topic10-performance'))
const Topic11 = lazy(() => import('./pages/topic11-troubleshooting'))
const Topic12 = lazy(() => import('./pages/topic12-modern-architecture'))
const Glossary = lazy(() => import('./pages/Glossary'))
const Graph = lazy(() => import('./pages/Graph'))

function PageFallback() {
    return (
        <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-600">
            <svg className="animate-spin w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="text-sm font-mono">Loading...</span>
        </div>
    )
}

export default function App() {
    return (
        <ThemeProvider>
            <HashRouter>
                <Routes>
                    <Route element={<AppLayout />}>
                        <Route index element={<Home />} />
                        {/* Suspense는 Routes 직계 자식이 될 수 없으므로 중간 레이아웃 Route로 감쌈 */}
                        <Route
                            element={
                                <Suspense fallback={<PageFallback />}>
                                    <Outlet />
                                </Suspense>
                            }
                        >
                            <Route path="topic/01-basics" element={<Topic01 />} />
                            <Route path="topic/02-network-design" element={<Topic02 />} />
                            <Route path="topic/03-link-layer" element={<Topic03 />} />
                            <Route path="topic/04-ip-routing" element={<Topic04 />} />
                            <Route path="topic/05-transport" element={<Topic05 />} />
                            <Route path="topic/06-application" element={<Topic06 />} />
                            <Route path="topic/07-service-flow" element={<Topic07 />} />
                            <Route path="topic/08-linux-network" element={<Topic08 />} />
                            <Route path="topic/09-packet-processing" element={<Topic09 />} />
                            <Route path="topic/10-performance" element={<Topic10 />} />
                            <Route path="topic/11-troubleshooting" element={<Topic11 />} />
                            <Route path="topic/12-modern-architecture" element={<Topic12 />} />
                            <Route path="glossary" element={<Glossary />} />
                            <Route path="graph" element={<Graph />} />
                        </Route>
                    </Route>
                </Routes>
            </HashRouter>
        </ThemeProvider>
    )
}
