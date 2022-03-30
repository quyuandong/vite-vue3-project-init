/**
 * 多语言设置
 */

import { DropMenu } from '../components/Dropdown'
import { LocaleSetting, LocaleType } from '/#/config'

// 定义语言
export const LOCALE: { [key: string]: LocaleType } = {
  //中文
  ZH_CN: 'zh_CN',
  // 英文
  EN_US: 'en',
}

//语言设置
export const localeSetting: LocaleSetting = {
  // 是否显示语言选择器
  showPicker: true,
  // 当前语言
  locale: LOCALE.ZH_CN,
  // 默认语言
  defaultLocale: LOCALE.ZH_CN,
  // 允许的语言
  allLocales: [LOCALE.ZH_CN, LOCALE.EN_US],
}

// 配置语言列表
export const localeList: DropMenu[] = [
  {
    text: '简体中文',
    event: 'zh_CN',
  },
  {
    text: 'English',
    event: 'en',
  },
]
