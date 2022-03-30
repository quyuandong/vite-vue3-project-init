/**
 * 1. 基础的抽屉
 * 2. 抽屉的配套使用方法
 */
import { withInstall } from '/@/utils'
import basicDrawer from './src/BasicDrawer.vue'

export const BasicDrawer = withInstall(basicDrawer)
export * from './src/typing'
export { useDrawer, useDrawerInner } from './src/useDrawer'
