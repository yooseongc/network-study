import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { ThemeProvider, StudyProvider, AppLayout } from '@study-ui/components'
import { siteConfig } from './data/siteConfig'
import Home from './pages/Home'

const Topic01 = lazy(() => import('./pages/topic01-basics'))
const Topic02 = lazy(() => import('./pages/topic02-network-design'))
const Topic03 = lazy(() => import('./pages/topic03-link-layer'))
const Topic04 = lazy(() => import('./pages/topic04-ip-routing'))
const Topic05 = lazy(() => import('./pages/topic05-transport'))
const Topic06 = lazy(() => import('./pages/topic06-dns'))
const Topic07 = lazy(() => import('./pages/topic07-http-tls-security'))
const Topic08 = lazy(() => import('./pages/topic08-service-flow'))
const Topic09 = lazy(() => import('./pages/topic09-linux-stack'))
const Topic10 = lazy(() => import('./pages/topic10-iproute2-admin'))
const Topic11 = lazy(() => import('./pages/topic11-packet-processing'))
const Topic12 = lazy(() => import('./pages/topic12-performance'))
const Topic13 = lazy(() => import('./pages/topic13-troubleshooting'))
const Topic14 = lazy(() => import('./pages/topic14-load-balancing'))
const Topic15 = lazy(() => import('./pages/topic15-cloud-container'))
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
            <StudyProvider config={siteConfig}>
                <BrowserRouter basename="/network-study">
                    <Routes>
                        <Route element={<AppLayout />}>
                            <Route index element={<Home />} />
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
                                <Route path="topic/06-dns" element={<Topic06 />} />
                                <Route path="topic/07-http-tls-security" element={<Topic07 />} />
                                <Route path="topic/08-service-flow" element={<Topic08 />} />
                                <Route path="topic/09-linux-stack" element={<Topic09 />} />
                                <Route path="topic/10-iproute2-admin" element={<Topic10 />} />
                                <Route path="topic/11-packet-processing" element={<Topic11 />} />
                                <Route path="topic/12-performance" element={<Topic12 />} />
                                <Route path="topic/13-troubleshooting" element={<Topic13 />} />
                                <Route path="topic/14-load-balancing" element={<Topic14 />} />
                                <Route path="topic/15-cloud-container" element={<Topic15 />} />
                                <Route path="glossary" element={<Glossary />} />
                                <Route path="graph" element={<Graph />} />
                            </Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </StudyProvider>
        </ThemeProvider>
    )
}
