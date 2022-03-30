/**
 * 系统相关的一些枚举
 */

export const SIDE_BAR_MINI_WIDTH = 48
export const SIDE_BAR_SHOW_TIT_MINI_WIDTH = 80

//菜单主题枚举
export enum ThemeEnum {
  DARK = 'dark', //黑暗模式
  LIGHT = 'light', // 明亮模式
}

// 设置按钮位置枚举
export enum SettingButtonPositionEnum {
  AUTO = 'auto', // 自动选择
  HEADER = 'header', // 位于头部
  FIXED = 'fixed', // 固定在右侧
}

// 权限模式枚举
export enum PermissionModeEnum {
  ROLE = 'ROLE', //通过用户角色来过滤菜单(前端方式控制)，菜单和路由分开配置
  ROUTE_MAPPING = 'ROUTE_MAPPING', // 通过用户角色来过滤菜单(前端方式控制)，菜单由路由配置自动生成
  BACK = 'BACK', // 通过后台来动态生成路由表(后台方式控制)
}

// 会话超时解决方案
export enum SessionTimeoutProcessingEnum {
  ROUTE_JUMP, // 路由跳转到登陆页
  PAGE_COVERAGE, // 生成登陆弹框，覆盖当前页面
}

// 主题内容宽度
export enum ContentEnum {
  FULL = 'full', // 流式布局
  FIXED = 'fixed', // 定宽布局
}

// 路由切换动画
// TODO: 待具名化
export enum RouterTransitionEnum {
  ZOOM_FADE = 'zoom-fade',
  ZOOM_OUT = 'zoom-out',
  FADE_SIDE = 'fade-slide',
  FADE = 'fade',
  FADE_BOTTOM = 'fade-bottom',
  FADE_SCALE = 'fade-scale',
}

// 标签样式
export enum TabsThemeEnum {
  SMOOTH = 'smooth', // 圆滑
  CARD = 'card', // 卡片
  SIMPLE = 'simple', // 极简
}
