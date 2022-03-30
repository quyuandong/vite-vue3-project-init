import { ThemeEnum } from '/@/enums/appEnum'
/**
 * 样式配置
 */

// 样式前缀
// 注意与 src\design\var\index.less 中的namespace保持一致
export const prefixCls = 'qCls'

// 默认主题
export const darkMode = ThemeEnum.LIGHT

// App主题预设颜色
export const APP_PRESET_COLOR_LIST: string[] = [
  '#0960bd',
  '#0084f4',
  '#009688',
  '#536dfe',
  '#ff5c93',
  '#ee4f12',
  '#0096c7',
  '#9c27b0',
  '#ff9800',
]

// 标题预设颜色
export const HEADER_PRESET_BG_COLOR_LIST: string[] = [
  '#ffffff',
  '#151515',
  '#009688',
  '#5172DC',
  '#018ffb',
  '#409eff',
  '#e74c3c',
  '#24292e',
  '#394664',
  '#001529',
  '#383f45',
]

// 侧边栏预设颜色
export const SIDE_BAR_BG_COLOR_LIST: string[] = [
  '#001529',
  '#212121',
  '#273352',
  '#ffffff',
  '#191b24',
  '#191a23',
  '#304156',
  '#001628',
  '#28333E',
  '#344058',
  '#383f45',
]
