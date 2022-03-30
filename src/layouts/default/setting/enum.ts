import { ContentEnum, RouterTransitionEnum, TabsThemeEnum } from '/@/enums/appEnum'
import {
  MenuModeEnum,
  MenuTypeEnum,
  MixSidebarTriggerEnum,
  TopMenuAlignEnum,
  TriggerEnum,
} from '/@/enums/menuEnum'

export enum HandlerEnum {
  // 系统相关的处理方法
  CHANGE_LAYOUT,
  CHANGE_THEME_COLOR,
  CHANGE_THEME,

  // 菜单
  MENU_HAS_DRAG,
  MENU_ACCORDION,
  MENU_TRIGGER,
  MENU_TOP_ALIGN,
  MENU_COLLAPSED,
  MENU_COLLAPSED_SHOW_TITLE,
  MENU_WIDTH,
  MENU_SHOW_SIDEBAR,
  MENU_THEME,
  MENU_SPLIT,
  MENU_FIXED,
  MENU_CLOSE_MIX_SIDEBAR_ON_CHANGE,
  MENU_TRIGGER_MIX_SIDEBAR,
  MENU_FIXED_MIX_SIDEBAR,

  // 头部
  HEADER_SHOW,
  HEADER_THEME,
  HEADER_FIXED,
  // 头部搜索
  HEADER_SEARCH,

  // 页签
  TABS_SHOW_QUICK,
  TABS_SHOW_REDO,
  TABS_SHOW,
  TABS_SHOW_FOLD,
  TABS_THEME,

  // 锁屏几面
  LOCK_TIME,
  FULL_CONTENT,
  CONTENT_MODE,
  SHOW_BREADCRUMB,
  SHOW_BREADCRUMB_ICON,
  GRAY_MODE,
  COLOR_WEAK,
  SHOW_LOGO,
  SHOW_FOOTER,

  // 过度动画
  ROUTER_TRANSITION,
  OPEN_PROGRESS,
  OPEN_PAGE_LOADING,
  OPEN_ROUTE_TRANSITION,
}

// 标签页样式
export const tabsThemeOptions = [
  {
    value: TabsThemeEnum.SMOOTH,
    label: '圆滑',
  },
  {
    value: TabsThemeEnum.CARD,
    label: '卡片',
  },
  {
    value: TabsThemeEnum.SIMPLE,
    label: '极简',
  },
]

// 菜单类型列表
export const menuTypeList = [
  {
    title: '左侧菜单模式',
    mode: MenuModeEnum.INLINE,
    type: MenuTypeEnum.SIDEBAR,
  },
  {
    title: '左侧菜单混合模式',
    mode: MenuModeEnum.INLINE,
    type: MenuTypeEnum.MIX_SIDEBAR,
  },
  {
    title: '顶部菜单模式',
    mode: MenuModeEnum.HORIZONTAL,
    type: MenuTypeEnum.TOP_MENU,
  },
  {
    title: '顶部菜单混合模式',
    mode: MenuModeEnum.INLINE,
    type: MenuTypeEnum.MIX,
  },
]

export const mixSidebarTriggerOptions = [
  {
    value: MixSidebarTriggerEnum.HOVER,
    label: '悬停',
  },
  {
    value: MixSidebarTriggerEnum.CLICK,
    label: '点击',
  },
]

export const contentModeOptions = [
  {
    value: ContentEnum.FULL,
    label: '流式',
  },
  {
    value: ContentEnum.FIXED,
    label: '定宽',
  },
]

export const topMenuAlignOptions = [
  {
    value: TopMenuAlignEnum.CENTER,
    label: '居中',
  },
  {
    value: TopMenuAlignEnum.START,
    label: '居左',
  },
  {
    value: TopMenuAlignEnum.END,
    label: '居右',
  },
]

export const getMenuTriggerOptions = (hideTop: boolean) => {
  return [
    {
      value: TriggerEnum.NONE,
      label: '不显示',
    },
    {
      value: TriggerEnum.FOOTER,
      label: '底部',
    },
    ...(hideTop
      ? []
      : [
          {
            value: TriggerEnum.HEADER,
            label: '顶部',
          },
        ]),
  ]
}

export const routerTransitionOptions = [
  RouterTransitionEnum.ZOOM_FADE,
  RouterTransitionEnum.FADE,
  RouterTransitionEnum.ZOOM_OUT,
  RouterTransitionEnum.FADE_SIDE,
  RouterTransitionEnum.FADE_BOTTOM,
  RouterTransitionEnum.FADE_SCALE,
].map(item => {
  return {
    label: item,
    value: item,
  }
})
