/**
 * 改变项目灰色模式状态
 */

import { toggleClass } from './util'
/**
 * 切换到灰色模式
 * @param gray 是否开启灰色
 */
export function updateGrayMode(gray: boolean) {
  toggleClass(gray, 'gray-mode', document.documentElement)
}
