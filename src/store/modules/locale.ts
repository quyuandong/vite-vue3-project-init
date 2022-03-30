import { defineStore } from 'pinia'
import { store } from '/@/store'
import { LocaleSetting, LocaleType } from '/#/config'
import { LOCALE_KEY } from '/@/enums/cacheEnum'
import { localeSetting } from '/@/settings/localeSetting'
import { createLocalStorage } from '/@/utils/cache'
/**
 * 多语言相关store
 */
interface LocaleState {
  localInfo: LocaleSetting
}

const ls = createLocalStorage()

// 获取当前相关的语言设置--（本地缓存 或 默认）
const lsLocaleSetting = (ls.get(LOCALE_KEY) || localeSetting) as LocaleSetting

export const useLocaleStore = defineStore({
  id: 'app-locale',
  state: (): LocaleState => ({
    localInfo: lsLocaleSetting,
  }),
  getters: {
    // 是否显示语言选择器
    getShowPicker(): boolean {
      return !!this.localInfo.showPicker
    },
    // 获取当前语言，默认中文
    getLocale(): LocaleType {
      return this.localInfo.locale ?? 'zh_CN'
    },
  },
  actions: {
    // 设置多语言信息缓存
    setLocaleInfo(info: Partial<LocaleSetting>) {
      this.localInfo = { ...this.localInfo, ...info }
      ls.set(LOCALE_KEY, this.localInfo)
    },
    // 初始化多语言信息并从本地缓存加载现有配置
    initLocale() {
      this.setLocaleInfo({
        ...localeSetting,
        ...this.localInfo,
      })
    },
  },
})

export function useLocaleStoreWithOut() {
  return useLocaleStore(store)
}
