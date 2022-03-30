import { useRouter } from 'vue-router'
import { useGlobSetting } from '../setting'
import { useLocaleStore } from '/@/store/modules/locale'
import { useTitle as usePageTitle } from '@vueuse/core'
import { unref, watch } from 'vue'
import { REDIRECT_NAME } from '/@/router/constant'

/**
 * 监听页面变化并动态改变网站标题
 */
export function useTitle() {
  const { title } = useGlobSetting()
  const { currentRoute } = useRouter()
  const localeStore = useLocaleStore()

  const pageTitle = usePageTitle()

  watch(
    [() => currentRoute.value.path, () => localeStore.getLocale],
    () => {
      const route = unref(currentRoute)
      if (route.name === REDIRECT_NAME) {
        return
      }
      const tTitle = route?.meta?.title as string
      pageTitle.value = tTitle ? ` ${tTitle} - ${title} ` : `${title}`
    },
    { immediate: true },
  )
}
