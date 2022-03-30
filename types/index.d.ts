/**
 * 声明全局变量类型
 */

// 声明方法的泛型接口
declare interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

declare type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null

// 声明元素 泛型接口
declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

// 浏览器窗口打开方式
declare type TargetContext = '_self' | '_blank'

// 触发方法
declare type EmitType = (event: string, ...args: any[]) => void

// promise 方法类型
declare interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>
}

// 下拉框选择类型定义
declare type LabelValueOptions = {
  label: string
  value: any
  [key: string]: string | number | boolean
}[]

declare type RefType<T> = T | null
