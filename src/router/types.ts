import { RoleEnum } from '../enums/roleEnum'
import type { RouteRecordRaw, RouteMeta } from 'vue-router'
import { defineComponent } from 'vue'

/**
 * 路由的类型定义
 */

// 定义Component 的类型
export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

// @ts-ignore
export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
  name: string
  meta: RouteMeta
  component?: Component | string
  components?: Component
  children?: AppRouteRecordRaw[]
  props?: Recordable
  fullPath?: string
}

export interface MenuTag {
  type?: 'primary' | 'error' | 'warn' | 'success' // 类型
  content?: string // 内容
  dot?: boolean // 为true则显示小圆点
}

export interface Menu {
  //  菜单名
  name: string
  // 菜单图标,如果没有，则会尝试使用route.meta.icon
  icon?: string
  // 菜单路径
  path: string
  paramPath?: string
  // 是否禁用
  disabled?: boolean
  children?: Menu[]
  orderNo?: number
  roles?: RoleEnum[]
  meta?: Partial<RouteMeta>
  // 菜单标签设置
  tag?: MenuTag
  // 是否隐藏菜单
  hideMenu?: boolean
}

// 菜单模块
export interface MenuModule {
  orderNo?: number //排序
  menu: Menu //菜单
}
// 导出类型 RouteModule | AppRouteRecordRaw
export type AppRouteModule = AppRouteRecordRaw
