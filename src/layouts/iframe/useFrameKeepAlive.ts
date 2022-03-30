import { uniqBy } from 'lodash-es'
import { AppRouteRecordRaw } from './../../router/types'
import { computed, toRaw, unref } from 'vue'
import { useRouter } from 'vue-router'
import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting'
import { useMultipleTabStore } from '/@/store/modules/multipleTab'
export function useFrameKeepAlive() {
  const router = useRouter()
  const { currentRoute } = router
  const { getShowMultipleTab } = useMultipleTabSetting()
  const tabStore = useMultipleTabStore()

  // 获取所有的frame页面
  const getFramePages = computed(() => {
    const ret = getAllFramePages(toRaw(router.getRoutes()) as unknown as AppRouteRecordRaw[]) || []
    return ret
  })

  // 获取打开的tab页签列表
  const getOpenTabList = computed((): string[] => {
    return tabStore.getTabList.reduce((prev: string[], next) => {
      if (next.meta && Reflect.has(next.meta, 'frameSrc')) {
        prev.push(next.name as string)
      }
      return prev
    }, [])
  })

  // 获取所有Frame页面
  function getAllFramePages(routes: AppRouteRecordRaw[]): AppRouteRecordRaw[] {
    let res: AppRouteRecordRaw[] = []
    for (const route of routes) {
      const { meta: { frameSrc } = {}, children } = route
      if (frameSrc) {
        res.push(route)
      }
      if (children && children.length) {
        res.push(...getAllFramePages(children))
      }
    }
    res = uniqBy(res, 'name')
    return res
  }

  // 是否显示Iframe
  function showIframe(item: AppRouteRecordRaw) {
    return item.name === unref(currentRoute).name
  }

  // 是否渲染了Frame
  function hasRenderFrame(name: string) {
    if (!unref(getShowMultipleTab)) {
      return router.currentRoute.value.name === name
    }
    return unref(getOpenTabList).includes(name)
  }

  return { hasRenderFrame, getFramePages, showIframe, getAllFramePages }
}
