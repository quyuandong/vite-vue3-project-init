export type ScrollType = 'default' | 'main'

// 滚动容器参数
export interface ScrollContainerOptions {
  enableScroll?: boolean
  type?: ScrollType
}

//折叠参数
export interface CollapseContainerOptions {
  canExpand?: boolean
  title?: string
  helpMessage?: Array<any> | string
}

export type ScrollActionType = RefType<{
  scrollBottom: () => void
  getScrollWrap: () => Nullable<HTMLElement>
  scrollTo: (top: number) => void
}>
