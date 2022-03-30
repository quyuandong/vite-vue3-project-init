/**
 * 命令：是否点击 区域外的地方 触发对应的事件
 */
import { ComponentPublicInstance, DirectiveBinding, ObjectDirective } from 'vue'
import { on } from '../utils/domUtils'
import { isServer } from '../utils/is'

type DocumentHandler = <T extends MouseEvent>(mouseup: T, mousedown: T) => void

type FlushList = Map<
  HTMLElement,
  { documentHandler: DocumentHandler; bindingFn: (...args: unknown[]) => unknown }
>

const nodeList: FlushList = new Map()
let startClick: MouseEvent
// 监控鼠标安县与抬起事件
if (!isServer) {
  on(document, 'mousedown', (e: MouseEvent) => (startClick = e))
  on(document, 'mouseup', (e: MouseEvent) => {
    for (const { documentHandler } of nodeList.values()) {
      documentHandler(e, startClick)
    }
  })
}

// 创建事件
function createDocumentHandler(el: HTMLElement, binding: DirectiveBinding): DocumentHandler {
  let excludes: HTMLElement[] = []
  if (Array.isArray(binding.arg)) {
    excludes = binding.arg
  } else {
    excludes.push(binding.arg as unknown as HTMLElement)
  }

  return function (mouseup, mousedown) {
    const popperRef = (
      binding.instance as ComponentPublicInstance<{
        popperRef: Nullable<HTMLElement>
      }>
    ).popperRef
    const mouseUpTarget = mouseup.target as Node
    const mouseDownTarget = mousedown.target as Node
    const isBound = !binding || !binding.instance
    const isTargetExists = !mouseUpTarget || !mouseDownTarget
    const isContainedByEl = el.contains(mouseUpTarget) || el.contains(mouseDownTarget)
    const isSelf = el === mouseUpTarget

    const isTargetExcluded =
      (excludes.length && excludes.some(item => item?.contains(mouseUpTarget))) ||
      (excludes.length && excludes.includes(mouseDownTarget as HTMLElement))

    const isContainedByPopper =
      popperRef && (popperRef.contains(mouseUpTarget) || popperRef.contains(mouseDownTarget))

    if (
      isBound ||
      isTargetExists ||
      isContainedByEl ||
      isSelf ||
      isTargetExcluded ||
      isContainedByPopper
    ) {
      return
    }
    binding.value()
  }
}

const ClickOutside: ObjectDirective = {
  beforeMount(el, binding) {
    nodeList.set(el, {
      documentHandler: createDocumentHandler(el, binding),
      bindingFn: binding.value,
    })
  },

  updated(el, binding) {
    nodeList.set(el, {
      documentHandler: createDocumentHandler(el, binding),
      bindingFn: binding.value,
    })
  },
  unmounted(el) {
    nodeList.delete(el)
  },
}

export default ClickOutside
