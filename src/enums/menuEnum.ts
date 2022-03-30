/**
 * 菜单相关的枚举信息
 */

// 菜单类型
export enum MenuTypeEnum {
  SIDEBAR = 'sidebar', // 左侧菜单
  MIX_SIDEBAR = 'mix-sidebar', // 主 + 侧
  MIX = 'mix', //主菜单
  TOP_MENU = 'top-menu', //顶部菜单
}

// 菜单模式
export enum MenuModeEnum {
  VERTICAL = 'vertical', // 垂直
  HORIZONTAL = 'horizontal', //水平
  VERTICAL_RIGHT = 'vertical-right', // 水平靠右
  INLINE = 'inline', //内联
}
// 菜单分割
export enum MenuSplitTyeEnum {
  NONE, // 不分割
  TOP, // 顶部分割
  LEFT, // 左侧份额
}

// 顶部菜单布局
export type TopMenuAlign = 'start' | 'center' | 'end'

// 折叠触发器位置
export enum TriggerEnum {
  NONE = 'NONE', // 不显示
  FOOTER = 'FOOTER', // 菜单底部
  HEADER = 'HEADER', // 头部
}

// 左侧混合菜单模块切换触发方式
export enum MixSidebarTriggerEnum {
  HOVER = 'hover',
  CLICK = 'click',
}

// 顶部菜单的居中方式
export enum TopMenuAlignEnum {
  CENTER = 'center',
  START = 'start',
  END = 'end',
}
