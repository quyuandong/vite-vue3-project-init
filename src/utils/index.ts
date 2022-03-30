import { App, Plugin, unref } from 'vue'
import { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router'
import { isObject } from './is'

/**
 * 组件注入（默认非全局组件）
 * @param component 引入的组件
 * @param alias 全局变量名
 * @returns 返回引入组件
 */
export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any
  comp.install = (app: App) => {
    // 注入当前页
    app.component(comp.name || comp.displayName, component)
    if (alias) {
      // 注入全局
      app.config.globalProperties[alias] = component
    }
  }
  return component as T & Plugin
}

/**
 * 对环境变量中的数据进行处理
 * @param envConf   获取到的变量
 * @returns 新的环境变量
 */
export function wrapperEnv(envConf: Recordable): ViteEnv {
  const ret: any = {}
  Object.keys(envConf).forEach(envName => {
    let realName = envConf[envName].replace(/\\n/g, '\n')
    // 将字符串型转为boolean类型
    realName = realName === 'true' ? true : realName === 'false' ? false : realName
    //   端口号由字符串转为数字
    if (envName === 'VITE_PORT') {
      realName = Number(realName)
    }
    // 处理代理问题
    if (envName === 'VITE_PROXY' && realName) {
      try {
        realName = JSON.parse(realName.replace(/'/g, '"'))
      } catch (error) {
        realName = ''
      }
    }
    ret[envName] = realName
    if (typeof realName === 'string') {
      process.env[envName] = realName
    } else if (typeof realName === 'object') {
      process.env[envName] = JSON.stringify(realName)
    }
  })
  return ret
}

/**
 * TODO: 获取一组路由
 * @param route 路由
 * @returns
 */
export function getRawRoute(route: RouteLocationNormalized): RouteLocationNormalized {
  if (!route) return route
  // TODO: 后续需要甄别一下matched
  const { matched, ...opt } = route
  return {
    ...opt,
    matched: (matched
      ? matched.map(item => ({
          meta: item.meta,
          name: item.name,
          path: item.path,
        }))
      : undefined) as RouteRecordNormalized[],
  }
}

/**
 * 将目标参数深拷贝给源参
 * @param source 源参
 * @param target 目标参
 * @returns
 */
export function deepMerge<T = any>(source: any = {}, target: any = {}): T {
  let key: string
  for (key in target) {
    source[key] = isObject(source[key])
      ? deepMerge(source[key], target[key])
      : (source[key] = target[key])
  }
  return source
}

/**
 * 将参数拼接到url上
 * @param baseUrl 基础url
 * @param obj 参数
 * @returns
 * @ eg: setObjToUrlParams('www.baidu.com', obj) ==>  www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = ''
  for (const key in obj) {
    parameters += `${key}=${encodeURIComponent(obj[key])}&`
  }
  parameters = parameters.replace(/&$/, '')
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters
}

export function openWindow(
  url: string,
  opt?: { target?: TargetContext | string; noopener?: boolean; noreferrer?: boolean },
) {
  const { target = '__blank', noopener = true, noreferrer = true } = opt || {}
  const feature: string[] = []

  noopener && feature.push('noopener=yes')
  noreferrer && feature.push('noreferrer=yes')

  window.open(url, target, feature.join(','))
}

// TODO: 循环-待做（主要是失败时候的重做）
export const noop = () => {}

// 设置ui挂载节点
export function getPopupContainer(node?: HTMLElement): HTMLElement {
  return (node?.parentNode as HTMLElement) ?? document.body
}

// 动态挂载props
export function getDynamicProps<T, U>(props: T): Partial<U> {
  const ret: Recordable = {}

  Object.keys(props).map(key => {
    ret[key] = unref((props as Recordable)[key])
  })

  return ret as Partial<U>
}
