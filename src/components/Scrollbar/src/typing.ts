export interface BarMap {
  vertical: BarMapItem
  horizontal: BarMapItem
}

export interface BarMapItem {
  offset: string
  scroll: string
  scrollSize: string
  size: string
  key: string
  axis: string //x轴
  client: string
  direction: string // 方向
}
// 滚动条
export interface ScrollbarType {
  wrap: ElRef
}
