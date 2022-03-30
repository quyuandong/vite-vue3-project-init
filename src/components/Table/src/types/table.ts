import type { VNodeChild } from 'vue'
import type { PaginationProps } from './pagination'
import type { FormProps } from '/@/components/Form'
import type {
  ColumnProps,
  TableRowSelection as ITableRowSelection,
} from 'ant-design-vue/lib/table/interface'

import { ComponentType } from './componentType'
import { VueNode } from '/@/utils/propTypes'
import { RoleEnum } from '/@/enums/roleEnum'

export declare type SortOrder = 'ascend' | 'descend'

export interface TableCurrentDataSource<T = Recordable> {
  currentDataSource: T[]
}

export interface TableRowSelection<T = any> extends ITableRowSelection {
  /**
   * Callback executed when selected rows change
   * @type Function
   */
  onChange?: (selectedRowKeys: string[] | number[], selectedRows: T[]) => any

  /**
   * Callback executed when select/deselect one row
   * @type Function
   */
  onSelect?: (record: T, selected: boolean, selectedRows: Object[], nativeEvent: Event) => any

  /**
   * Callback executed when select/deselect all rows
   * @type Function
   */
  onSelectAll?: (selected: boolean, selectedRows: T[], changeRows: T[]) => any

  /**
   * Callback executed when row selection is inverted
   * @type Function
   */
  onSelectInvert?: (selectedRows: string[] | number[]) => any
}

export interface TableCustomRecord<T> {
  record?: T
  index?: number
}

export interface ExpandedRowRenderRecord<T> extends TableCustomRecord<T> {
  indent?: number
  expanded?: boolean
}
export interface ColumnFilterItem {
  text?: string
  value?: string
  children?: any
}

export interface TableCustomRecord<T = Recordable> {
  record?: T
  index?: number
}

export interface SorterResult {
  column: ColumnProps
  order: SortOrder
  field: string
  columnKey: string
}

export interface FetchParams {
  searchInfo?: Recordable
  page?: number
  sortInfo?: Recordable
  filterInfo?: Recordable
}

export interface GetColumnsParams {
  ignoreIndex?: boolean
  ignoreAction?: boolean
  sort?: boolean
}

export type SizeType = 'default' | 'middle' | 'small' | 'large'

export interface TableActionType {
  reload: (opt?: FetchParams) => Promise<void>
  getSelectRows: <T = Recordable>() => T[]
  clearSelectedRowKeys: () => void
  expandAll: () => void
  collapseAll: () => void
  getSelectRowKeys: () => string[]
  deleteSelectRowByKey: (key: string) => void
  setPagination: (info: Partial<PaginationProps>) => void
  setTableData: <T = Recordable>(values: T[]) => void
  updateTableDataRecord: (rowKey: string | number, record: Recordable) => Recordable | void
  deleteTableDataRecord: (rowKey: string | number | string[] | number[]) => void
  insertTableDataRecord: (record: Recordable, index?: number) => Recordable | void
  findTableDataRecord: (rowKey: string | number) => Recordable | void
  getColumns: (opt?: GetColumnsParams) => BasicColumn[]
  setColumns: (columns: BasicColumn[] | string[]) => void
  getDataSource: <T = Recordable>() => T[]
  getRawDataSource: <T = Recordable>() => T
  setLoading: (loading: boolean) => void
  setProps: (props: Partial<BasicTableProps>) => void
  redoHeight: () => void
  setSelectedRowKeys: (rowKeys: string[] | number[]) => void
  getPaginationRef: () => PaginationProps | boolean
  getSize: () => SizeType
  getRowSelection: () => TableRowSelection<Recordable>
  getCacheColumns: () => BasicColumn[]
  emit?: EmitType
  updateTableData: (index: number, key: string, value: any) => Recordable
  setShowPagination: (show: boolean) => Promise<void>
  getShowPagination: () => boolean
  setCacheColumnsByField?: (dataIndex: string | undefined, value: BasicColumn) => void
}

export interface FetchSetting {
  // 请求接口当前页数
  pageField: string
  // 每页显示多少条
  sizeField: string
  // 请求结果列表字段  支持 a.b.c
  listField: string
  // 请求结果总数字段  支持 a.b.c
  totalField: string
}

export interface TableSetting {
  redo?: boolean
  size?: boolean
  setting?: boolean
  fullScreen?: boolean
}

export interface BasicTableProps<T = any> {
  // 点击行选中
  clickToRowSelect?: boolean
  isTreeTable?: boolean
  // 自定义排序方法
  sortFn?: (sortInfo: SorterResult) => any
  // 排序方法
  filterFn?: (data: Partial<Recordable<string[]>>) => any
  // 取消表格的默认padding
  inset?: boolean
  // 显示表格设置
  showTableSetting?: boolean
  tableSetting?: TableSetting
  // 斑马纹
  striped?: boolean
  // 是否自动生成key
  autoCreateKey?: boolean
  // 计算合计行的方法
  summaryFunc?: (...arg: any) => Recordable[]
  // 自定义合计表格内容
  summaryData?: Recordable[]
  // 是否显示合计行
  showSummary?: boolean
  // 是否可拖拽列
  canColDrag?: boolean
  // 接口请求对象
  api?: (...arg: any) => Promise<any>
  // 请求之前处理参数
  beforeFetch?: Fn
  // 自定义处理接口返回参数
  afterFetch?: Fn
  // 查询条件请求之前处理
  handleSearchInfoFn?: Fn
  // 请求接口配置
  fetchSetting?: Partial<FetchSetting>
  // 立即请求接口
  immediate?: boolean
  // 在开起搜索表单的时候，如果没有数据是否显示表格
  emptyDataIsShowTable?: boolean
  // 额外的请求参数
  searchInfo?: Recordable
  // 默认的排序参数
  defSort?: Recordable
  // 使用搜索表单
  useSearchForm?: boolean
  // 表单配置
  formConfig?: Partial<FormProps>
  // 列配置
  columns: BasicColumn[]
  // 是否显示序号列
  showIndexColumn?: boolean
  // 序号列配置
  indexColumnProps?: BasicColumn
  actionColumn?: BasicColumn
  // 文本超过宽度是否显示。。。
  ellipsis?: boolean
  // 是否可以自适应高度
  canResize?: boolean
  // 自适应高度偏移， 计算结果-偏移量
  resizeHeightOffset?: number

  // 在分页改变的时候清空选项
  clearSelectOnPageChange?: boolean
  //
  rowKey?: string | ((record: Recordable) => string)
  // 数据
  dataSource?: Recordable[]
  // 标题右侧提示
  titleHelpMessage?: string | string[]
  // 表格滚动最大高度
  maxHeight?: number
  // 是否显示边框
  bordered?: boolean
  // 分页配置
  pagination?: PaginationProps | boolean
  // loading加载
  loading?: boolean

  // 指定树形结构的列名
  childrenColumnName?: string

  // 覆盖默认的 table 元素
  components?: object

  // 初始时，是否展开所有行
  defaultExpandAllRows?: boolean

  // 默认展开的行
  defaultExpandedRowKeys?: string[]

  // 展开的行，控制属性
  expandedRowKeys?: string[]

  // 额外的展开行
  expandedRowRender?: (record?: ExpandedRowRenderRecord<T>) => VNodeChild | JSX.Element

  // 自定义展开图标
  expandIcon?: Function | VNodeChild | JSX.Element

  // 通过点击行来展开子行
  expandRowByClick?: boolean

  // 展开的图标显示在哪一列，如果没有 rowSelection，默认显示在第一列，否则显示在选择框后面
  expandIconColumnIndex?: number

  // 表格尾部
  footer?: Function | VNodeChild | JSX.Element

  // 展示树形数据时，每层缩进的宽度，以 px 为单位 默认15
  indentSize?: number

  // 默认文案设置，目前包括排序、过滤、空数据文案
  locale?: object

  // 表格行的类名
  rowClassName?: (record: TableCustomRecord<T>, index: number) => string

  // 列表项是否可选择，配置项
  rowSelection?: TableRowSelection

  // 设置横向或纵向滚动，也可用于指定滚动区域的宽和高，建议为 x 设置一个数字，如果要设置为 true，需要配合样式 .ant-table td { white-space: nowrap; }
  scroll?: { x?: number | true; y?: number }

  // 是否显示表头
  showHeader?: boolean

  // 表格大小
  size?: SizeType

  // 表格标题
  title?: VNodeChild | JSX.Element | string | ((data: Recordable) => string)

  // 设置头部行属性
  customHeaderRow?: (column: ColumnProps, index: number) => object

  // 设置行属性
  customRow?: (record: T, index: number) => object

  // 表格元素的 table-layout 属性，设为 fixed 表示内容不会影响列的布局	- | 'auto' | 'fixed'
  tableLayout?: 'auto' | 'fixed' | string

  // 设置表格内各类浮层的渲染节点，如筛选菜单
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement

  // 数据渲染前可以再次改变，一般用户空数据的默认配置，可以通过 ConfigProvider 全局统一配置
  transformCellText?: Function

  // 行编辑提交之前 执行该方法
  beforeEditSubmit?: (data: {
    record: Recordable
    index: number
    key: string | number
    value: any
  }) => Promise<any>

  // 选中项发生变化时的回调
  onChange?: (pagination: any, filters: any, sorter: any, extra: any) => void

  // 当单击行展开图标时执行的回调
  onExpand?: (expande: boolean, record: T) => void

  // 当扩展行的更改时执行的回调
  onExpandedRowsChange?: (expandedRows: string[] | number[]) => void

  // 列改变时的回调
  onColumnsChange?: (data: ColumnChangeParam[]) => void
}

export type CellFormat =
  | string
  | ((text: string, record: Recordable, index: number) => string | number)
  | Map<string | number, any>

// @ts-ignore
export interface BasicColumn extends ColumnProps {
  children?: BasicColumn[]
  filters?: {
    text: string
    value: string
    children?:
      | unknown[]
      | (((props: Record<string, unknown>) => unknown[]) & (() => unknown[]) & (() => unknown[]))
  }[]

  //
  flag?: 'INDEX' | 'DEFAULT' | 'CHECKBOX' | 'RADIO' | 'ACTION'
  customTitle?: VueNode

  slots?: Recordable

  // Whether to hide the column by default, it can be displayed in the column configuration
  defaultHidden?: boolean

  // Help text for table column header
  helpMessage?: string | string[]

  format?: CellFormat

  // Editable
  edit?: boolean
  editRow?: boolean
  editable?: boolean
  editComponent?: ComponentType
  editComponentProps?: Recordable
  editRule?: boolean | ((text: string, record: Recordable) => Promise<string>)
  editValueMap?: (value: any) => string
  onEditRow?: () => void
  // 权限编码控制是否显示
  auth?: RoleEnum | RoleEnum[] | string | string[]
  // 业务控制是否显示
  ifShow?: boolean | ((column: BasicColumn) => boolean)
}

export type ColumnChangeParam = {
  dataIndex: string
  fixed: boolean | 'left' | 'right' | undefined
  visible: boolean
}

export interface InnerHandlers {
  onColumnsChange: (data: ColumnChangeParam[]) => void
}
