import type { SiteConfig } from '@study-ui/components'
import { networkTopics } from './networkTopics'
import { glossary, CATEGORY_LABEL, CATEGORY_COLOR } from './glossary'
import { sectionIndex } from './searchIndex'

export const siteConfig: SiteConfig = {
    name: 'Network Study',
    subtitle: 'Network Fundamentals Visualized',
    topics: networkTopics,
    glossary: {
        entries: glossary,
        categoryLabels: CATEGORY_LABEL,
        categoryColors: CATEGORY_COLOR,
    },
    searchIndex: sectionIndex,
    footerLinks: [
        { label: '용어 사전', to: '/glossary', icon: 'glossary' },
        { label: '개념 지도', to: '/graph', icon: 'graph' },
    ],
}
