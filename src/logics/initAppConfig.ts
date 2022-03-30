/**
 * 初始化项目的配置
 */
import { primaryColor } from '../../build/config/themeConfig'
import { ThemeEnum } from '../enums/appEnum'
import { PROJ_CFG_KEY } from '../enums/cacheEnum'
import { useAppStore } from '../store/modules/app'
import { useLocaleStore } from '../store/modules/locale'
import { deepMerge } from '../utils'
import { Persistent } from '../utils/cache/persistent'
import { getCommonStoragePrefix, getStorageShortName } from '../utils/env'
import { changeTheme } from './theme'
import { updateDarkTheme } from './theme/dark'
import { updateHeaderBgColor, updateSidebarBgColor } from './theme/updateBackground'
import { updateColorWeak } from './theme/updateColorWeak'
import { updateGrayMode } from './theme/updateGrayMode'
import { ProjectConfig } from '/#/config'
import projectSetting from '/@/settings/projectSetting'

export function initAppConfigStore() {
  // 多语言store
  const localeStore = useLocaleStore()
  const appStore = useAppStore()
  let projCfg: ProjectConfig = Persistent.getLocal(PROJ_CFG_KEY) as ProjectConfig
  projCfg = deepMerge(projectSetting, projCfg || {})
  const darkMode = appStore.getDarkMode
  const {
    colorWeak, //色弱
    grayMode, // 灰色
    themeColor, // 主题色
    headerSetting: { bgColor: headerBgColor } = {},
    menuSetting: { bgColor } = {},
  } = projCfg

  // 改变主题
  if (themeColor && themeColor !== primaryColor) {
    changeTheme(themeColor)
  }
  // 是否使用灰色模式
  grayMode && updateGrayMode(grayMode)
  // 是否使用颜色弱化
  colorWeak && updateColorWeak(colorWeak)
  // 保存配置
  appStore.setProjectConfig(projCfg)

  // 初始化项目主题色调
  updateDarkTheme(darkMode)
  if (darkMode === ThemeEnum.DARK) {
    updateHeaderBgColor()
    updateSidebarBgColor()
  } else {
    headerBgColor && updateHeaderBgColor(headerBgColor)
    bgColor && updateSidebarBgColor(bgColor)
  }
  // 初始化语言
  localeStore.initLocale()

  // 清空本地存储
  setTimeout(() => {
    clearObsoleteStorage()
  }, 16)
}

/**
 * 清除本地的一些缓存--不是必要的缓存
 */
export function clearObsoleteStorage() {
  const commonPrefix = getCommonStoragePrefix()
  const shortPrefix = getStorageShortName()

  ;[localStorage, sessionStorage].forEach((item: Storage) => {
    Object.keys(item).forEach(key => {
      if (key && key.startsWith(commonPrefix) && !key.startsWith(shortPrefix)) {
        item.removeItem(key)
      }
    })
  })
}
