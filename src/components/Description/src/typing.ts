import type { VNode, CSSProperties } from 'vue'
import type { CollapseContainerOptions } from '/@/components/Container/index'
import type { DescriptionsProps } from 'ant-design-vue/es/descriptions/index'

export interface DescItem {
  labelMinWidth?: number
  contentMinWidth?: number
  labelStyle?: CSSProperties // 自定义标签样式
  field: string
  label: string | VNode | JSX.Element
  // Merge column
  span?: number
  show?: (...arg: any) => boolean
  // render
  render?: (
    val: any,
    data: Recordable,
  ) => VNode | undefined | JSX.Element | Element | string | number
}

export interface DescriptionProps extends DescriptionsProps {
  // 是否包含折叠组件
  useCollapse?: boolean
  // 子项配置
  schema: DescItem[]

  // 数据
  data: Recordable

  // 内置的CollapseContainer组件配置
  collapseOptions?: CollapseContainerOptions
}

export interface DescInstance {
  setDescProps(descProps: Partial<DescriptionProps>): void
}

export type Register = (descInstance: DescInstance) => void

/**
 * @description:
 */
export type UseDescReturnType = [Register, DescInstance]
