import type { NamePath } from 'ant-design-vue/lib/form/interface'
import type { ColProps } from 'ant-design-vue/lib/grid/Col'
import type { HTMLAttributes, VNodeChild } from 'vue'

export interface FormItem {
  colon?: boolean // 配合 label 属性使用，表示是否显示 label 后面的冒号

  extra?: string | VNodeChild | JSX.Element // 	额外的提示信息，和 help 类似，当需要错误信息和提示文案同时出现时，可以使用这个。

  hasFeedback?: boolean // 配合 validateStatus 属性使用，展示校验状态图标，建议只配合 Input 组件使用

  help?: string | VNodeChild | JSX.Element // 	提示信息，如不设置，则会根据校验规则自动生成

  label?: string | VNodeChild | JSX.Element // label 标签的文本

  labelCol?: ColProps & HTMLAttributes //label 标签布局，同 <Col> 组件，设置 span offset 值，如 {span: 3, offset: 12} 或 sm: {span: 3, offset: 12}

  required?: boolean //是否必填，如不设置，则会根据校验规则自动生成

  validateStatus?: '' | 'success' | 'warning' | 'error' | 'validating' // 校验状态，如不设置，则会根据校验规则自动生成，可选：'success' 'warning' 'error' 'validating'

  wrapperCol?: ColProps // 需要为输入控件设置布局样式时，使用该属性，用法同 labelCol

  htmlFor?: string // 设置子元素 label htmlFor 属性

  labelAlign?: 'left' | 'right' // 标签文本对齐方式

  name?: NamePath // 表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的

  rules?: object | object[] // 表单验证规则

  autoLink?: boolean // 是否自动关联表单域

  validateFirst?: boolean // 当某一规则校验不通过时，是否停止剩下的规则的校验。

  validateTrigger?: string | string[] | false // 设置字段校验的时机
}
