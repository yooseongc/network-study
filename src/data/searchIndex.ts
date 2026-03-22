export interface SectionEntry {
    topicId: string
    sectionId: string
    title: string
    route: string
}

// 각 토픽 페이지가 구현되면 섹션 인덱스를 추가합니다
export const sectionIndex: SectionEntry[] = []
