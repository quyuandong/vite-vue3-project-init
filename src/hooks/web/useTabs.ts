import { unref } from 'vue'
import { RouteLocationNormalized, Router, useRouter } from 'vue-router'
import { useAppStore } from '/@/store/modules/app'
import { useMultipleTabStore } from '/@/store/modules/multipleTab'

/**
 * 使用页签
 */
// 页签关闭方式
enum TabsActionEnum {
  REFRESH,
  CLOSE_ALL,
  CLOSE_LEFT,
  CLOSE_RIGHT,
  CLOSE_OTHER,
  CLOSE_CURRENT,
  CLOSE,
}
export function useTabs(_router?: Router) {
  const appStore = useAppStore()

  //是否显示tab 多页签
  function canUseTabs(): boolean {
    const { show } = appStore.getMenuSetting
    if (!show) {
      throw new Error('多标签页目前未打开，请在设置中打开  ')
    }
    return !!show
  }

  const tabStore = useMultipleTabStore()
  const router = _router || useRouter()

  const { currentRoute } = router

  // 获取到当前的tab
  function getCurrentTab() {
    const route = unref(currentRoute)
    return tabStore.getTabList.find(item => item.path == route.path)!
  }

  // 更新tab 标题
  async function updateTabTitle(title: string, tab?: RouteLocationNormalized) {
    const canUse = canUseTabs()
    if (!canUse) return
    const targetTab = tab || getCurrentTab()
    await tabStore.setTabTitle(title, targetTab)
  }

  // 更新tab 路径
  async function updateTabPath(path: string, tab?: RouteLocationNormalized) {
    const canIUse = canUseTabs()
    if (!canIUse) {
      return
    }
    const targetTab = tab || getCurrentTab()
    await tabStore.updateTabPath(path, targetTab)
  }

  async function handleTabAction(action: TabsActionEnum, tab?: RouteLocationNormalized) {
    const canIUse = canUseTabs()
    if (!canIUse) {
      return
    }
    const currentTab = getCurrentTab()
    switch (action) {
      case TabsActionEnum.REFRESH:
        await tabStore.refreshPage(router)
        break

      case TabsActionEnum.CLOSE_ALL:
        await tabStore.closeAllTab(router)
        break

      case TabsActionEnum.CLOSE_LEFT:
        await tabStore.closeLeftTabs(currentTab, router)
        break

      case TabsActionEnum.CLOSE_RIGHT:
        await tabStore.closeRightTabs(currentTab, router)
        break

      case TabsActionEnum.CLOSE_OTHER:
        await tabStore.closeOtherTabs(currentTab, router)
        break

      case TabsActionEnum.CLOSE_CURRENT:
      case TabsActionEnum.CLOSE:
        await tabStore.closeTab(tab || currentTab, router)
        break
    }
  }

  return {
    refreshPage: () => handleTabAction(TabsActionEnum.REFRESH),
    closeAll: () => handleTabAction(TabsActionEnum.CLOSE_ALL),
    closeLeft: () => handleTabAction(TabsActionEnum.CLOSE_LEFT),
    closeRight: () => handleTabAction(TabsActionEnum.CLOSE_RIGHT),
    closeOther: () => handleTabAction(TabsActionEnum.CLOSE_OTHER),
    closeCurrent: () => handleTabAction(TabsActionEnum.CLOSE_CURRENT),
    close: (tab?: RouteLocationNormalized) => handleTabAction(TabsActionEnum.CLOSE, tab),
    setTitle: (title: string, tab?: RouteLocationNormalized) => updateTabTitle(title, tab),
    updatePath: (fullPath: string, tab?: RouteLocationNormalized) => updateTabPath(fullPath, tab),
  }
}
