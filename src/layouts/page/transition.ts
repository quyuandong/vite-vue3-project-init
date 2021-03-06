import { FunctionalComponent } from 'vue'
import { RouteLocation } from 'vue-router'

export interface DefaultContext {
  Component: FunctionalComponent & { type: Recordable }
  route: RouteLocation
}

// 获取加载动画名字
export function getTransitionName({
  route,
  openCache,
  cacheTabs,
  enableTransition,
  def,
}: Pick<DefaultContext, 'route'> & {
  enableTransition: boolean
  openCache: boolean
  def: string
  cacheTabs: string[]
}): string | undefined {
  if (!enableTransition) return undefined

  const isInCache = cacheTabs.includes(route.name as string)
  const transitionName = 'fade-slide'

  let name: string | undefined = transitionName
  if (openCache) {
    name = isInCache && route.meta.loaded ? transitionName : undefined
  }

  return name || (route.meta.transitionName as string) || def
}
