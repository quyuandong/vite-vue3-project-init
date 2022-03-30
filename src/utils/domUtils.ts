/***
 * 操作dom相关的工具方法
 */

import { FunctionArgs } from '@vueuse/core'
import { upperFirst } from 'lodash-es'

// 元素偏移量类型
export interface ViewPortOffsetResult {
  left: number
  top: number
  right: number
  bottom: number
  rightIncludeBody: number
  bottomIncludeBody: number
}

/**
 * 获取某个元素相对于视窗的位置集合
 * @param element dom元素
 * @returns
 */
export function getBoundingClientRect(element: Element): DOMRect | number {
  if (!element || !element.getBoundingClientRect) return 0
  return element.getBoundingClientRect()
}

/**
 * 去除字符串前后的空格
 * @param string 字符串
 * @returns
 */
function trim(string: string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}

/**
 * dom元素上是否有对应的类名
 * @param el dem元素
 * @param cls 类名
 * @returns
 */
export function hasClass(el: Element, cls: string) {
  if (!el || !cls) return false
  if (cls.indexOf(' ') !== -1) throw new Error('className 类名不能包含空格')
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}

/**
 * 给指定元素添加className
 * @param el dem元素
 * @param cls 样式名字
 * @returns
 */
export function addClass(el: Element, cls: string) {
  if (!el) return false
  let curClass = el.className
  const classes = (cls || '').split(' ')
  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) continue
    if (el.classList) {
      el.classList.add(clsName)
    } else if (!hasClass(el, clsName)) {
      curClass += ' ' + clsName
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
}

/**
 * 删除指定元素的className
 * @param el dem元素
 * @param cls 样式名字
 * @returns
 */
export function removeClass(el: Element, cls: string) {
  if (!el || !cls) return
  const classes = cls.split(' ')
  let curClass = ' ' + el.className + ' '

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.remove(clsName)
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ')
    }
  }
  if (!el.classList) {
    el.className = trim(curClass)
  }
}

/**
 *  获取当前元素的左偏移量和顶偏移量
 * @param element 元素
 * @returns
 * left：最左边元素和文档左边之间的距离
 * top：元素顶部到文档顶部的距离
 * right：元素的最右边到文档右边的距离
 * bottom：元素底部到文档底部的距离
 * rightIncludeBody：文档最左边的元素和右边之间的距离
 * bottomIncludeBody：元素底部到文档底部的距离
 */
export function getViewportOffset(element: Element): ViewPortOffsetResult {
  const doc = document.documentElement

  const docScrollLeft = doc.scrollLeft
  const docScrollTop = doc.scrollTop
  const docClientLeft = doc.clientLeft
  const docClientTop = doc.clientTop

  const pageXOffset = window.pageXOffset
  const pageYOffset = window.pageYOffset

  // 方法返回元素的大小及其相对于视口的位置。
  const box = getBoundingClientRect(element)
  const { left: retLeft, top: rectTop, width: rectWidth, height: rectHeight } = box as DOMRect

  const scrollLeft = (pageXOffset || docScrollLeft) - (docClientLeft || 0)
  const scrollTop = (pageYOffset || docScrollTop) - (docClientTop || 0)
  const offsetLeft = retLeft + pageXOffset
  const offsetTop = rectTop + pageYOffset

  const left = offsetLeft - scrollLeft
  const top = offsetTop - scrollTop

  const clientWidth = window.document.documentElement.clientWidth
  const clientHeight = window.document.documentElement.clientHeight
  return {
    left: left,
    top: top,
    right: clientWidth - rectWidth - left,
    bottom: clientHeight - rectHeight - top,
    rightIncludeBody: clientWidth - left,
    bottomIncludeBody: clientHeight - top,
  }
}

/**
 * 样式添加前缀，兼容不同浏览器
 * @param attr css属性
 * @param value css值
 * @returns
 */
export function hackCss(attr: string, value: string) {
  const prefix: string[] = ['webkit', 'Moz', 'ms', 'OT']

  const styleObj: any = {}
  prefix.forEach(item => {
    // 转换字符串string的首字母为大写。
    styleObj[`${item}${upperFirst(attr)}`] = value
  })
  return {
    ...styleObj,
    [attr]: value,
  }
}

/**
 * 添加响应事件
 * @param element
 * @param event
 * @param handler
 */
export function on(
  element: Element | HTMLElement | Document | Window,
  event: string,
  handler: EventListenerOrEventListenerObject,
): void {
  if (element && event && handler) {
    element.addEventListener(event, handler, false)
  }
}

/**
 * 移除响应事件
 * @param element
 * @param event
 * @param handler
 */
export function off(
  element: Element | HTMLElement | Document | Window,
  event: string,
  handler: Fn,
): void {
  if (element && event && handler) {
    element.removeEventListener(event, handler, false)
  }
}

/**
 * 只调用一次的事件
 * @param el 元素
 * @param event 事件
 * @param fn 回调
 */
export function once(el: HTMLElement, event: string, fn: EventListener): void {
  const listener = function (this: any, ...args: unknown[]) {
    if (fn) {
      fn.apply(this, args)
    }
    off(el, event, listener)
  }
  on(el, event, listener)
}

// 页面刷新
export function useRafThrottle<T extends FunctionArgs>(fn: T): T {
  let locked = false
  // @ts-ignore
  return function (...args: any[]) {
    if (locked) return
    locked = true
    window.requestAnimationFrame(() => {
      // @ts-ignore
      fn.apply(this, args)
      locked = false
    })
  }
}
