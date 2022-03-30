import { nextTick, unref } from 'vue'
/**
 * 是否用来拖拽
 * 参考参数：https://www.itxst.com/sortablejs/mbe2yaam.html
 */

import { Ref } from 'vue'
import type { Options } from 'sortablejs'

export function useSortable(el: HTMLElement | Ref<HTMLElement>, options?: Options) {
  function initSortable() {
    nextTick(async () => {
      if (!el) return
      const Sortable = (await import('sortablejs')).default
      Sortable.create(unref(el), {
        animation: 500,
        delay: 400, // 延迟多久运行被拖动
        delayOnTouchOnly: true, // 属性为true时，delay属性只在移动触摸时生效。
        ...options,
      })
    })
  }

  return { initSortable }
}
