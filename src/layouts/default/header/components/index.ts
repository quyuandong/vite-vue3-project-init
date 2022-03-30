import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent'
import FullScreen from './FullScreen.vue'

// 面包屑
export const LayoutBreadcrumb = createAsyncComponent(() => import('./Breadcrumb.vue'))
// 消息通知
export const Notify = createAsyncComponent(() => import('./notify/index.vue'))
// 错误日志
export const ErrorAction = createAsyncComponent(() => import('./ErrorAction.vue'))
// 用户信息
export const UserDropDown = createAsyncComponent(() => import('./user-dropdown/index.vue'), {
  loading: true,
})

export { FullScreen }
