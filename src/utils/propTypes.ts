import { createTypes, VueTypesInterface, VueTypeValidableDef } from 'vue-types'
import { CSSProperties, VNodeChild } from 'vue'
/**
 * VueTypes 是一组可配置的prop 验证器 （打开新窗口）对于 Vue.js，受 React 启发prop-types。
 * 文档：https://dwightjack.github.io/vue-types/
 */

export type VueNode = VNodeChild | JSX.Element

type PropTypes = VueTypesInterface & {
  readonly style: VueTypeValidableDef<CSSProperties>
  readonly VNodeChild: VueTypeValidableDef<VueNode>
}

const propTypes = createTypes({
  func: undefined,
  bool: undefined,
  string: undefined,
  number: undefined,
  object: undefined,
  integer: undefined,
}) as PropTypes

propTypes.extend([
  {
    name: 'style',
    getter: true,
    type: [String, Object],
    default: undefined,
  },
  {
    name: 'VNodeChild',
    getter: true,
    type: undefined,
  },
])

export { propTypes }
