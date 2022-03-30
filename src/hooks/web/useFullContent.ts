import { computed, unref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '/@/store/modules/app'

export const useFullContent = () => {
  const appStore = useAppStore()
  const router = useRouter()
  const { currentRoute } = router

  // 是否全屏显示内容不显示菜单
  const getFullContent = computed(() => {
    const route = unref(currentRoute)
    const query = route.query
    if (query && Reflect.has(query, '__full__')) {
      return true
    }
    // 返回配置文件中是否全屏的配置
    return appStore.getProjectConfig.fullContent
  })

  return {
    getFullContent,
  }
}
