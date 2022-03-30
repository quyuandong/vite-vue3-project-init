import { computed, h, inject, onUnmounted, Ref } from 'vue'
/**
 * 滚动条
 */
import { defineComponent, getCurrentInstance, ref } from 'vue'
import { BAR_MAP, renderThumbStyle } from './util'
import { off, on } from '/@/utils/domUtils'
export default defineComponent({
  name: 'Bar',
  props: {
    vertical: Boolean, // 是否垂直
    size: String, // 大小
    move: Number, // 移动距离
  },
  setup(props) {
    const instance = getCurrentInstance()
    const thumb = ref()
    const wrap = inject('scroll-bar-wrap', {} as Ref<Nullable<HTMLElement>>) as any

    const bar = computed(() => {
      return BAR_MAP[props.vertical ? 'vertical' : 'horizontal']
    })

    const barStore = ref<Recordable>({})
    const cursorDown = ref()

    const clickThumbHandler = (e: any) => {
      // 防止点击右键事件
      if (e.ctrlKey || e.button === 2) {
        return
      }
      window.getSelection()?.removeAllRanges()
      startDrag(e)
      barStore.value[bar.value.axis] =
        e.currentTarget[bar.value.offset] -
        (e[bar.value.client] - e.currentTarget.getBoundingClientRect()[bar.value.direction])
    }

    const clickTrackHandler = (e: any) => {
      const offset = Math.abs(
        e.target.getBoundingClientRect()[bar.value.direction] - e[bar.value.client],
      )
      const thumbHalf = thumb.value[bar.value.offset] / 2
      const thumbPositionPercentage =
        ((offset - thumbHalf) * 100) / instance?.vnode.el?.[bar.value.offset]

      wrap.value[bar.value.scroll] =
        (thumbPositionPercentage * wrap.value[bar.value.scrollSize]) / 100
    }

    const startDrag = (e: any) => {
      e.stopImmediatePropagation()
      cursorDown.value = true
      on(document, 'mousemove', mouseMoveDocumentHandler)
      on(document, 'mouseup', mouseUpDocumentHandler)
      document.onselectstart = () => false
    }
    const mouseMoveDocumentHandler = (e: any) => {
      if (cursorDown.value == false) return
      const prevPage = barStore.value[bar.value.axis]

      if (!prevPage) return

      const offset =
        (instance?.vnode.el?.getBoundingClientRect()[bar.value.direction] - e[bar.value.client]) *
        -1
      const thumbClickPosition = thumb.value[bar.value.offset] - prevPage
      const thumbPositionPercentage =
        ((offset - thumbClickPosition) * 100) / instance?.vnode.el?.[bar.value.offset]
      wrap.value[bar.value.scroll] =
        (thumbPositionPercentage * wrap.value[bar.value.scrollSize]) / 100
    }

    function mouseUpDocumentHandler() {
      cursorDown.value = false
      barStore.value[bar.value.axis] = 0
      off(document, 'mousemove', mouseMoveDocumentHandler)
      document.onselectstart = null
    }

    onUnmounted(() => {
      off(document, 'mouseup', mouseUpDocumentHandler)
    })

    return () =>
      h(
        'div',
        {
          class: ['scrollbar__bar', 'is-' + bar.value.key],
          onMousedown: clickThumbHandler,
        },
        h('div', {
          ref: thumb,
          class: 'scrollbar__thumb',
          onMousedown: clickTrackHandler,
          style: renderThumbStyle({
            size: props.size,
            move: props.move,
            bar: bar.value,
          }),
        }),
      )
  },
})
