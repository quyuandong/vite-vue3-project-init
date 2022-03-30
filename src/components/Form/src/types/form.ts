import type { NamePath, RuleObject } from 'ant-design-vue/lib/form/interface'
import type { VNode } from 'vue'
import type { ButtonProps as AntdButtonProps } from '/@/components/Button'
import type { FormItem } from './formItem'
import type { ColEx, ComponentType } from './index'
import type { TableActionType } from '/@/components/Table/src/types/table'
import type { CSSProperties } from 'vue'
import type { RowProps } from 'ant-design-vue/lib/grid/Row'

export type FieldMapToTime = [string, [string, string], string?][]

export type Rule = RuleObject & {
  trigger?: 'blur' | 'change' | ['change', 'blur']
}

export interface RenderCallbackParams {
  schema: FormSchema
  values: Recordable
  model: Recordable
  field: string
}

export interface ButtonProps extends AntdButtonProps {
  text?: string
}

export interface FormActionType {
  submit: () => Promise<void>
  setFieldsValue: <T>(values: T) => Promise<void>
  resetFields: () => Promise<void>
  getFieldsValue: () => Recordable
  clearValidate: (name?: string | string[]) => Promise<void>
  updateSchema: (data: Partial<FormSchema> | Partial<FormSchema>[]) => Promise<void>
  resetSchema: (data: Partial<FormSchema> | Partial<FormSchema>[]) => Promise<void>
  setProps: (formProps: Partial<FormProps>) => Promise<void>
  removeSchemaByFiled: (field: string | string[]) => Promise<void>
  appendSchemaByField: (
    schema: FormSchema,
    prefixField: string | undefined,
    first?: boolean | undefined,
  ) => Promise<void>
  validateFields: (nameList?: NamePath[]) => Promise<any>
  validate: (nameList?: NamePath[]) => Promise<any>
  scrollToField: (name: NamePath, options?: ScrollOptions) => Promise<void>
}

export type RegisterFn = (formInstance: FormActionType) => void

export type UseFormReturnType = [RegisterFn, FormActionType]

export interface FormProps {
  layout?: 'vertical' | 'inline' | 'horizontal' // 表单布局
  model?: Recordable // 表单数据对象
  labelWidth?: number | string // label宽度
  labelAlign?: 'left' | 'right' // 标签的文本对齐方式
  rowProps?: RowProps // 表单的行配置
  submitOnReset?: boolean // 是否重置时提交表单
  labelCol?: Partial<ColEx> // label 标签布局
  wrapperCol?: Partial<ColEx> // 需要为输入控件设置布局样式时，使用该属性，用法同 labelCol
  baseRowStyle?: CSSProperties // 一行风格样式
  baseColProps?: Partial<ColEx> // 基础传参
  schemas?: FormSchema[] // 表单规则配置
  mergeDynamicData?: Recordable //用于合并到动态控件表单项的函数值
  compact?: boolean // 搜索表单 是否使用紧凑模式
  emptySpan?: number | Partial<ColEx> // 空行跨度
  size?: 'default' | 'small' | 'large' // 窗体内部组件大小
  disabled?: boolean // 是否可编辑
  fieldMapToTime?: FieldMapToTime // 时间间隔字段映射
  autoSetPlaceHolder?: boolean // 是否自动设置占位符
  autoSubmitOnEnter?: boolean // 是否通过回车自动提交
  rulesMessageJoinLabel?: boolean // 标签上是否加上规则信息
  showAdvancedButton?: boolean // 是否显示折叠和展开按钮
  autoFocusFirstItem?: boolean // 是否聚集于第一个输入框，仅当输入第一个表单项时有效
  autoAdvancedLine?: number //按照指定的行数自动折叠
  alwaysShowLines?: number // 总是显示的行数
  showActionButtonGroup?: boolean // 是否显示操作按钮
  resetButtonOptions?: Partial<ButtonProps> // 重置按钮配置
  submitButtonOptions?: Partial<ButtonProps> // 确认按钮配置
  actionColOptions?: Partial<ColEx> // 操作列配置
  showResetButton?: boolean // 是否显示重置按钮
  showSubmitButton?: boolean // 是否显示提交按钮
  resetFunc?: () => Promise<void> // 重置方法
  submitFunc?: () => Promise<void> // 提交方法
  transformDateFunc?: (date: any) => string // 时间处理方法
  colon?: boolean // 配合 label 属性使用，表示是否显示 label 后面的冒号
}
export interface FormSchema {
  field: string // 字段名
  changeEvent?: string // 事件名
  valueField?: string // 绑定v-model的变量名
  label: string | VNode // 标签名
  subLabel?: string // 副标签名
  helpMessage?: // 帮助信息
  string | string[] | ((renderCallbackParams: RenderCallbackParams) => string | string[])
  helpComponentProps?: Partial<HelpComponentProps> // 帮助组件传参
  labelWidth?: string | number // 标签宽度
  disabledLabelWidth?: boolean //是否 在formModel的全局设置中禁用labelWidth的调整，并手动设置labelCol和wrapperCol
  component: ComponentType // 渲染的组件类型
  componentProps?: // 组件传参
  | ((opt: {
        schema: FormSchema
        tableAction: TableActionType
        formActionType: FormActionType
        formModel: Recordable
      }) => Recordable)
    | object
  required?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean) // 是否必须
  suffix?: string | number | ((values: RenderCallbackParams) => string | number) // 后缀
  rules?: Rule[] // 校验规则
  rulesMessageJoinLabel?: boolean // 规则信息是否加入到label
  itemProps?: Partial<FormItem> // 子项传参
  colProps?: Partial<ColEx>
  defaultValue?: any // 默认值
  isAdvanced?: boolean // 是否预置

  // Matching details components
  span?: number // 匹配的细节部分

  ifShow?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean)

  show?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean)

  // 渲染标签
  render?: (renderCallbackParams: RenderCallbackParams) => VNode | VNode[] | string

  // 渲染内容
  renderColContent?: (renderCallbackParams: RenderCallbackParams) => VNode | VNode[] | string

  renderComponentContent?:
    | ((renderCallbackParams: RenderCallbackParams) => any)
    | VNode
    | VNode[]
    | string

  // Custom slot, in from-item
  slot?: string

  // 自定义插槽
  colSlot?: string
  dynamicDisabled?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean)

  dynamicRules?: (renderCallbackParams: RenderCallbackParams) => Rule[]
}
export interface HelpComponentProps {
  // 最小宽度
  maxWidth: string
  // 是否显示序列号
  showIndex: boolean
  // 文本列表
  text: any
  // 样色
  color: string
  // 文本大小
  fontSize: string
  icon: string // 图标
  absolute: boolean // 是否绝对
  // Positioning
  position: any // 定位
}
