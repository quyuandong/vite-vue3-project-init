/**
 *****基础的组件
 * 1. BasicArrow: 带动画的箭头组件
 * 2. BasicHelp: 帮助组件
 * 3. BasicTitle: 标题组件（融合了BasicHelp组件）
 */
import { withInstall } from '/@/utils'
import basicArrow from './src/BasicArrow.vue'
import basicTitle from './src/BasicTitle.vue'
import basicHelp from './src/BasicHelp.vue'

export const BasicArrow = withInstall(basicArrow)
export const BasicTitle = withInstall(basicTitle)
export const BasicHelp = withInstall(basicHelp)
