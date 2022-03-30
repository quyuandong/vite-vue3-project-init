import { computed } from 'vue'
import { TransitionSetting } from '/#/config'
import { RouterTransitionEnum } from '/@/enums/appEnum'
import { useAppStore } from '/@/store/modules/app'

/**
 * 是否使用过度动画设置
 */
export function useTransitionSetting() {
  const appStore = useAppStore()

  // 是否开启切换动画
  const getEnableTransition = computed((): boolean => appStore.getTransitionSetting.enable)

  // 是否打开页面切换顶部进度条
  const getOpenNProgress = computed((): boolean => appStore.getTransitionSetting.openNProgress)

  // 是否打开页面切换loading
  const getOpenPageLoading = computed(
    (): boolean => !!appStore.getTransitionSetting.openPageLoading,
  )

  //路由切换动画名
  const getBasicTransition = computed(
    (): RouterTransitionEnum => appStore.getTransitionSetting?.basicTransition,
  )

  // 设置过度动画参数
  function setTransitionSetting(transitionSetting: Partial<TransitionSetting>) {
    appStore.setProjectConfig({ transitionSetting })
  }

  return {
    setTransitionSetting,
    getEnableTransition,
    getOpenNProgress,
    getOpenPageLoading,
    getBasicTransition,
  }
}
