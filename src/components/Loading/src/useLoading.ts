import { Ref, unref } from 'vue'
import { createLoading } from './createLoading'
import { LoadingProps } from './typing'

// 加载动画参数
export interface UseLoadingOptions {
  target?: any
  props?: Partial<LoadingProps>
}

export function useLoading(props: Partial<LoadingProps>): [Fn, Fn, (string) => void]
export function useLoading(opt: Partial<UseLoadingOptions>): [Fn, Fn, (string) => void]
export function useLoading(
  opt: Partial<LoadingProps> | Partial<UseLoadingOptions>,
): [Fn, Fn, (string) => void] {
  let props: Partial<LoadingProps>
  let target: HTMLElement | Ref<ElRef> = document.body

  if (Reflect.has(opt, 'target') || Reflect.has(opt, 'props')) {
    const options = opt as Partial<UseLoadingOptions>
    props = options.props || {}
    target = options.target || {}
  } else {
    props = opt as Partial<LoadingProps>
  }

  const instance = createLoading(props, undefined, true)

  const open = (): void => {
    const t = unref(target as Ref<ElRef>)
    if (!t) return
    instance.open(t)
  }

  const close = (): void => {
    instance.close()
  }

  const setTip = (tip: string) => {
    instance.setTip(tip)
  }

  return [open, close, setTip]
}
