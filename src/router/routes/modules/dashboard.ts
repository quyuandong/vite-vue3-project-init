import { LAYOUT } from '/@/router/constant'
import type { AppRouteRecordRaw } from '/@/router/types'
/**
 * 主页
 */
const dashboard: AppRouteRecordRaw = {
  path: '/dashboard',
  name: 'Dashboard',
  component: LAYOUT,
  redirect: '/dashboard/analysis',
  meta: {
    orderNo: 10,
    icon: 'ion:grid-outline',
    title: 'Dashboard',
  },
  children: [
    {
      path: 'analysis',
      name: 'Analysis',
      component: () => import('/@/views/dashboard/analysis/index.vue'),
      meta: {
        title: '首页',
      },
    },
  ],
}

export default dashboard
