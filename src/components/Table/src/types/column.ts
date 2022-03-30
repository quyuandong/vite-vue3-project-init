import { VNodeChild } from 'vue'

export interface ColumnFilterItem {
  text?: string
  value?: string
  children?: any
}

export declare type SortOrder = 'ascend' | 'descend'

export interface RecordProps<T> {
  text: any
  record: T
  index: number
}

export interface FilterDropdownProps {
  prefixCls?: string
  setSelectedKeys?: (selectedKeys: string[]) => void
  selectedKeys?: string[]
  confirm?: () => void
  clearFilters?: () => void
  filters?: ColumnFilterItem[]
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
  visible?: boolean
}

export declare type CustomRenderFunction<T> = (record: RecordProps<T>) => VNodeChild | JSX.Element

export interface ColumnProps<T> {
  // 设置列内容的对齐方式
  align?: 'left' | 'right' | 'center'

  // 超过宽度将自动省略，暂不支持和排序筛选一起使用。设置为 true 时，表格布局将变成 tableLayout="fixed"
  ellipsis?: boolean

  // 表头列合并,设置为 0 时，不渲染
  colSpan?: number

  // 	列数据在数据项中对应的 key，支持 a.b.c 的嵌套写法
  dataIndex?: string

  // 默认筛选值
  defaultFilteredValue?: string[]

  /**
   * Default order of sorted values: 'ascend' 'descend' null
   * @type string
   */
  defaultSortOrder?: SortOrder

  // 可以自定义筛选菜单，此函数只负责渲染图层，需要自行编写各种交互
  filterDropdown?:
    | VNodeChild
    | JSX.Element
    | ((props: FilterDropdownProps) => VNodeChild | JSX.Element)

  // 用于控制自定义筛选菜单是否可见
  filterDropdownVisible?: boolean

  // 标识数据是否经过过滤，筛选图标会高亮
  filtered?: boolean

  // 筛选的受控属性，外界可用此控制列的筛选状态，值为已筛选的 value 数组
  filteredValue?: string[]

  // 自定义 filter 图标。
  filterIcon?: boolean | VNodeChild | JSX.Element

  // 是否多选
  filterMultiple?: boolean

  // 表头的筛选菜单项
  filters?: ColumnFilterItem[]

  // 	列是否固定，可选 true(等效于 left) 'left' 'right'
  fixed?: boolean | 'left' | 'right'

  // Vue 需要的 key，如果已经设置了唯一的 dataIndex，可以忽略这个属性
  key?: string

  // 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，
  customRender?: CustomRenderFunction<T> | VNodeChild | JSX.Element

  // 排序函数，本地排序使用一个函数(参考 Array.sort 的 compareFunction)，需要服务端排序可设为 true
  sorter?: boolean | Function

  // 排序的受控属性，外界可用此控制列的排序，可设置为 'ascend' 'descend' false
  sortOrder?: boolean | SortOrder

  // 支持的排序方式，取值为 'ascend' 'descend'
  sortDirections?: SortOrder[]

  // 列头显示文字
  title?: VNodeChild | JSX.Element

  // 列宽
  width?: string | number

  // 设置单元格属性
  customCell?: (record: T, rowIndex: number) => object

  // 设置头部单元格属性
  customHeaderCell?: (column: ColumnProps<T>) => object

  // 本地模式下，确定筛选的运行函数, 使用 template 或 jsx 时作为filter事件使用
  onFilter?: (value: any, record: T) => boolean

  // 自定义筛选菜单可见变化时调用，使用 template 或 jsx 时作为filterDropdownVisibleChange事件使用
  onFilterDropdownVisibleChange?: (visible: boolean) => void

  // 使用 columns 时，可以通过该属性配置支持 slot 的属性，如 slots: { filterIcon: 'XXX'}
  slots?: Recordable<string>
}
