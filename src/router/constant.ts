/**
 * 路由中定义一些常量
 */

// 重定向
export const REDIRECT_NAME = 'Redirect'

// 未找到页面
export const PAGE_NOT_FOUND_NAME = 'PageNotFound'

// 父级布局
export const PARENT_LAYOUT_NAME = 'ParentLayout'

// 默认layout布局
export const LAYOUT = () => import('/@/layouts/default/index.vue')

// 缺省页面
export const EXCEPTION_COMPONENT = () => import('/@/views/sys/exception/Exception.vue')

// 获取父级的布局视图
export const getParentLayout = (_name?: string) => {
  return () =>
    new Promise(resolve => {
      resolve({
        name: PARENT_LAYOUT_NAME,
      })
    })
}
