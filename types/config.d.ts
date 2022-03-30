import { RouterTransitionEnum, TabsThemeEnum, ThemeEnum } from './../src/enums/appEnum'
import {
  ContentEnum,
  SessionTimeoutProcessingEnum,
  PermissionModeEnum,
  SettingButtonPositionEnum,
} from '/@/enums/appEnum'
/**
 * 设置--定义类型文件
 */

import { CacheTypeEnum } from '/@/enums/cacheEnum'
import {
  MenuModeEnum,
  MenuTypeEnum,
  MixSidebarTriggerEnum,
  TopMenuAlign,
  TriggerEnum,
} from '/@/enums/menuEnum'

// 定义多语言类型
export type LocaleType = 'zh_CN' | 'en'

// 定义多语言设置类型
export interface LocaleSetting {
  showPicker: boolean // 是否显示语言选择器
  locale: LocaleType //当前语言
  defaultLocale: LocaleType // 默认语言
  allLocales: LocaleType[] //允许使用的语言列表
}

// 头部配置
export interface HeaderSetting {
  bgColor: string // 背景色
  fixed: boolean // 是否固定头部
  show: boolean // 是否显示顶部
  theme: ThemeEnum // 主题
  showFullScreen: boolean // 是否显示全屏按钮
  useLockPage: boolean // 是否开启锁屏功能
  showDoc: boolean // 是否显示文档按钮
  showNotice: boolean // 是否显示消息中心按钮
  showSearch: boolean // 是否显示菜单搜索按钮
}

// 菜单配置
export interface MenuSetting {
  bgColor: string //背景色
  fixed: boolean // 是否固定菜单
  collapsed: boolean // 菜单是否折叠
  collapsedShowTitle: boolean // 折叠菜单时 是否显示菜单名字
  canDrag: boolean // 菜单是否可拖拽
  show: boolean //是否显示菜单
  hidden: boolean // 是否隐藏
  split: boolean // 是否分割菜单
  menuWidth: number // 菜单宽度
  mode: MenuModeEnum // 菜单模式
  type: MenuTypeEnum // 菜单类型
  theme: ThemeEnum // 菜单主题
  topMenuAlign: TopMenuAlign // 顶部菜单布局
  trigger: TriggerEnum // 折叠触发器位置
  accordion: boolean // 手风琴模式，只展示一个菜单
  closeMixSidebarOnChange: boolean // 在路由切换的时候关闭左侧混合菜单展开菜单
  mixSideTrigger: MixSidebarTriggerEnum //左侧混合菜单模块切换触发方式
  mixSideFixed: boolean // 是否固定左侧混合菜单
}
// 多页签配置
export interface MultiTabsSetting {
  cache: boolean // 刷新之后是否保留已经打开的页签
  show: boolean // 是否使用多页签
  showQuick: boolean // 是否开启快速操作
  canDrag: boolean // 是否可以拖动
  showRedo: boolean // 是否显示刷新按钮
  showFold: boolean // 是否显示折叠按钮
  theme: TabsThemeEnum // 页签样式
}

// 动画配置
export interface TransitionSetting {
  enable: boolean // 是否开启切换动画
  basicTransition: RouterTransitionEnum //路由切换动画名
  openPageLoading: boolean // 是否打开页面切换loading
  openNProgress: boolean // 是否打开页面切换顶部进度条
}

// 项目配置
export interface ProjectConfig {
  permissionCacheType: CacheTypeEnum // 权限缓存存放位置。
  showSettingButton: boolean // 是否显示设置按钮
  showDarkModeToggle: boolean // 是覅显示主题切换按钮
  settingButtonPosition: SettingButtonPositionEnum // 设置按钮位置枚举
  permissionMode: PermissionModeEnum // 权限模式
  sessionTimeoutProcessing: SessionTimeoutProcessingEnum // 会话超时解决方案
  grayMode: boolean // 网站灰色模式，用于可能悼念的日期开启
  colorWeak: boolean // 色弱模式
  themeColor: string // 项目主题色
  fullContent: boolean // 是否取消菜单,顶部,多标签页显示, 用于可能内嵌在别的系统内
  contentMode: ContentEnum //主题内容宽度
  showLogo: boolean // 是否显示logo
  showFooter: boolean // 是否显示底部信息copyright
  headerSetting: HeaderSetting // 头部配置
  menuSetting: MenuSetting // 菜单配置
  multiTabsSetting: MultiTabsSetting // 多页签配置
  transitionSetting: TransitionSetting // 动画配置
  openKeepAlive: boolean //是否开启keepAlive缓存
  lockTime: number // 自动锁屏时间
  showBreadCrumb: boolean // 是否显示面包屑
  showBreadCrumbIcon: boolean // 是否显示面包屑图标
  useErrorHandle: boolean // 实现使用全局错误捕捉
  useOpenBackTop: boolean // 是否开启回到顶部
  canEmbedIFramePage: boolean //  是否可以嵌入iframe页面
  closeMessageOnSwitch: boolean // 切换界面的时候是否删除未关闭的message及notify
  removeAllHttpPending: boolean // 切换界面的时候是否取消已经发送但是未响应的http请求
}

// 全局环境配置
export interface GlobEnvConfig {
  VITE_GLOB_APP_TITLE: string // 网站标题
  VITE_GLOB_API_URL: string // 接口地址
  VITE_GLOB_API_URL_PREFIX?: string // 接口前缀
  VITE_GLOB_APP_SHORT_NAME: string // 简称，用于配置文件名字
  VITE_GLOB_UPLOAD_URL?: string // 文件上传地址
}

// 全局配置
export interface GlobConfig {
  title: string // 网站标题
  apiUrl: string // 接口地址
  uploadUrl?: string // 文件上传地址
  urlPrefix?: string // 接口前缀
  shortName: string // 简称，用于配置文件名称
}
