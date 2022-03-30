import { defineStore } from 'pinia'
import { store } from '/@/store'
import {
  HeaderSetting,
  MenuSetting,
  MultiTabsSetting,
  ProjectConfig,
  TransitionSetting,
} from '/#/config'
import { BeforeMiniState } from '/#/store'
import { Persistent } from '/@/utils/cache/persistent'
import { APP_DARK_MODE_KEY, PROJ_CFG_KEY } from '/@/enums/cacheEnum'
import { ThemeEnum } from '/@/enums/appEnum'
import { darkMode } from '/@/settings/designSetting'
import { deepMerge } from '/@/utils'
import { resetRouter } from '/@/router'
interface AppState {
  darkMode?: ThemeEnum // 主题枚举
  pageLoading: boolean // 页面加载状态
  projectConfig: ProjectConfig | null // 项目配置
  beforeMiniInfo: BeforeMiniState // 当窗口缩小时，记住一些状态，并在窗口恢复时恢复这些状态
}
let timeId: TimeoutHandle
export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    darkMode: undefined,
    pageLoading: false,
    projectConfig: Persistent.getLocal(PROJ_CFG_KEY),
    beforeMiniInfo: {},
  }),
  getters: {
    // 获取页面加载状态
    getPageLoading(): boolean {
      return this.pageLoading
    },

    // 获取当前主题
    getDarkMode(): 'light' | 'dark' | string {
      return this.darkMode || localStorage.getItem(APP_DARK_MODE_KEY) || darkMode
    },

    // 获取窗口改变之前的状态
    getBeforeMiniInfo(): BeforeMiniState {
      return this.beforeMiniInfo
    },

    // 获取项目配置
    getProjectConfig(): ProjectConfig {
      return this.projectConfig || ({} as ProjectConfig)
    },

    // 获取头部配置
    getHeaderSetting(): HeaderSetting {
      return this.getProjectConfig.headerSetting
    },

    // 获取菜单配置
    getMenuSetting(): MenuSetting {
      return this.getProjectConfig.menuSetting
    },

    // 获取动画配置
    getTransitionSetting(): TransitionSetting {
      return this.getProjectConfig.transitionSetting
    },

    // 获取页签配置
    getMultiTabsSetting(): MultiTabsSetting {
      return this.getProjectConfig.multiTabsSetting
    },
  },
  actions: {
    // 设置页面加载状态
    setPageLoading(loading: boolean): void {
      this.pageLoading = loading
    },

    // 设置主题
    setDarkMode(mode: ThemeEnum): void {
      this.darkMode = mode
      localStorage.setItem(APP_DARK_MODE_KEY, mode)
    },

    // 设置窗口改变之前的参数
    setBeforeMiniInfo(state: BeforeMiniState): void {
      this.beforeMiniInfo = state
    },

    // 设置项目配置
    setProjectConfig(config: DeepPartial<ProjectConfig>): void {
      this.projectConfig = deepMerge(this.projectConfig || {}, config)
      Persistent.setLocal(PROJ_CFG_KEY, this.projectConfig)
    },

    // 重置所有状态
    async resetAllState() {
      // 重置路由
      resetRouter()
      // 清除缓存
      Persistent.clearAll()
    },

    // 设置页面动画 重复延长
    async setPageLoadingAction(loading: boolean): Promise<void> {
      if (loading) {
        clearTimeout(timeId)
        timeId = setTimeout(() => {
          this.setPageLoading(loading)
        }, 50)
      } else {
        this.setPageLoading(loading)
        clearTimeout(timeId)
      }
    },
  },
})

// 需要在设置之之外使用
export function useAppStoreWithOut() {
  return useAppStore(store)
}
