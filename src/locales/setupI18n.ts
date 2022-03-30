/**
 * 设置语言
 */

import { App } from 'vue'
import { createI18n, I18n, I18nOptions } from 'vue-i18n'
import { localeSetting } from '../settings/localeSetting'
import { useLocaleStoreWithOut } from '../store/modules/locale'
import { setHtmlPageLang, setLoadLocalePool } from './helper'

const { defaultLocale, allLocales } = localeSetting

export let i18n: ReturnType<typeof createI18n>

async function createI18nOptions(): Promise<I18nOptions> {
  const localeStore = useLocaleStoreWithOut()
  const locale = localeStore.getLocale
  const defaultLocal = await import(`./lang/${locale}.ts`)
  const message = defaultLocal.default?.message ?? {}

  setHtmlPageLang(locale)
  setLoadLocalePool(loadLocalePool => {
    loadLocalePool.push(locale)
  })

  return {
    legacy: false,
    locale,
    fallbackLocale: defaultLocale,
    messages: {
      [locale]: message,
    },
    availableLocales: allLocales,
    sync: true, //如果不想从全局范围继承区域设置，则需要将i18n组件选项的sync设置为false。
    silentTranslationWarn: true, // 是否开启关闭警告
    missingWarn: false,
    silentFallbackWarn: true,
  }
}

//使用glob设置i18n实例
// setup i18n instance with glob
export async function setupI18n(app: App) {
  const options = await createI18nOptions()
  i18n = createI18n(options) as I18n
  app.use(i18n)
}
