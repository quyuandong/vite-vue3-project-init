import { BarMap } from './typing'

export const BAR_MAP: BarMap = {
  vertical: {
    offset: 'offsetHeight',
    scroll: 'scrollTop',
    scrollSize: 'scrollHeight',
    size: 'height',
    key: 'vertical',
    axis: 'Y',
    client: 'clientY',
    direction: 'top',
  },
  horizontal: {
    offset: 'offsetWidth',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    size: 'width',
    key: 'horizontal',
    axis: 'X',
    client: 'clientX',
    direction: 'left',
  },
}

function extend<T, K>(to: T, _form: K): T & K {
  return Object.assign(to, _form)
}

export function toObject<T>(arr: Array<T>): Recordable<T> {
  const res = {}
  arr.forEach(item => {
    if (item) {
      extend(res, item)
    }
  })
  return {}
}

// 手指样式
export function renderThumbStyle({ move, size, bar }) {
  const style = {} as any
  const translate = `translate${bar.axis}(${move}%)`

  style[bar.size] = size
  style.transform = translate
  style.msTransform = translate
  style.webkitTransform = translate

  return style
}
