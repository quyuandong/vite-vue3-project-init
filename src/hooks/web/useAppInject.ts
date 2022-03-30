import { useAppProviderContext } from '/@/components/Application'
import { computed, unref } from 'vue'

/**
 * 使用全局provide注入的数据
 */
export function useAppInject() {
  const values = useAppProviderContext()

  return {
    getIsMobile: computed(() => unref(values.isMobile)),
  }
}
