import { toggleClass } from './util'

/**
 * 切换为颜色弱化模式的状态
 * @param colorWeak 是否开启颜色弱化
 */
export function updateColorWeak(colorWeak: boolean) {
  toggleClass(colorWeak, 'color-weak', document.documentElement)
}
