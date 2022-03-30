/**
 * 切换语言
 */

import moment from 'moment'
import { computed, unref } from 'vue'
import { useLocaleStoreWithOut } from '../store/modules/locale'
import { loadLocalePool, setHtmlPageLang } from './helper'
import { i18n } from './setupI18n'
import { LocaleType } from '/#/config'

interface LangModule {
  message: Recordable
  momentLocale: Recordable
  momentLocaleName: string
}

/**
 * 设置语言
 * @param locale 语言
 */
function setI18nLanguage(locale: LocaleType) {
  const localeStore = useLocaleStoreWithOut()

  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale
  } else {
    ;(i18n.global.locale as any).value = locale
  }
  localeStore.setLocaleInfo({ locale })
  setHtmlPageLang(locale)
}

/**
 * 语言切换-入口
 * @returns
 */
export function useLocale() {
  const localeStore = useLocaleStoreWithOut()
  const getLocale = computed((): any => localeStore.getLocale)
  // 是否显示语言切换器
  const getShowLocalePicker = computed(() => localeStore.getShowPicker)

  const getAntdLocale = computed((): any => {
    return i18n.global.getLocaleMessage(unref(getLocale)).antdLocale ?? {}
  })

  /**
   * 切换语言
   * @param locale 语言
   */
  async function changeLocale(locale: LocaleType) {
    const globalI18n = i18n.global
    const currentLocale = unref(globalI18n.locale)
    if (currentLocale === locale) return locale

    if (loadLocalePool.includes(locale)) {
      setI18nLanguage(locale)
      return locale
    }

    const langModule = ((await import(`./lang/${locale}.ts`)) as any).default as LangModule
    if (!langModule) return

    const { message, momentLocale, momentLocaleName } = langModule
    globalI18n.setLocaleMessage(locale, message)
    moment.updateLocale(momentLocaleName, momentLocale)
    loadLocalePool.push(locale)

    setI18nLanguage(locale)
    return locale
  }

  return {
    getLocale,
    getShowLocalePicker,
    changeLocale,
    getAntdLocale,
  }
}
