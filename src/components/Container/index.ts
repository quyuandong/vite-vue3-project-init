/**
 * ****常用的一些容器：
 * 1. 折叠容器
 * 2. ScrollContainer：滚动容器
 * 3. 懒加载
 */
import { withInstall } from '/@/utils'
import collapseContainer from './src/collapse/CollapseContainer.vue'
import scrollContainer from './src/ScrollContainer.vue'
import lazyContainer from './src/LazyContainer.vue'

export const CollapseContainer = withInstall(collapseContainer)
export const ScrollContainer = withInstall(scrollContainer)
export const LazyContainer = withInstall(lazyContainer)

export * from './src/typing'
