/**
 * 全局类型文件
 */
import type {
  ComponentRenderProxy,
  VNode,
  VNodeChild,
  ComponentPublicInstance,
  FunctionalComponent,
  PropType as VuePropType,
} from 'vue'
declare global {
  const __APP_INFO__: {
    pkg: {
      name: string
      version: string
      dependencies: Recordable<string>
      devDependencies: Recordable<string>
    }
    lastBuildTime: string
  }

  // 定义导入时的变量类型提示
  interface ImportMetaEnv extends ViteEnv {
    __: unknown
  }

  // 定义环境变量中的类型
  declare interface ViteEnv {
    VITE_PUBLIC_PATH: string // 资源公共路径,需要以 /开头和结尾
    VITE_PORT: number // 端口号
    VITE_USE_MOCK: boolean //是否开启mock
    VITE_USE_PWA: boolean //打包是否开启pwq功能
    VITE_PROXY: [string, string][] //本地开发代理，解决跨域及多地址代理
    VITE_GLOB_APP_TITLE: string //网站标题
    VITE_GLOB_APP_SHORT_NAME: string //简称，用于配置文件名字
    VITE_USE_CDN: boolean // 是否使用CDN
    VITE_DROP_CONSOLE: boolean // 是否删除console.long
    VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none' //打包输出的文件类型
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean // 使用压缩时是否删除原始文件
    VITE_LEGACY: boolean //是否兼容旧版浏览器。
    VITE_USE_IMAGEMIN: boolean //打包是否压缩图片
    VITE_GENERATE_UI: string //引用的UI
  }

  declare function parseInt(s: string | number, radix?: number): number

  declare function parseFloat(string: string | number): number

  declare type Nullable<T> = T | null
  declare type NonNullable<T> = T extends null | undefined ? never : T
  declare type Recordable<T = any> = Record<string, T>
  declare type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T
  }
  declare type Indexable<T = any> = {
    [key: string]: T
  }
  declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>
  }
  // 延时器与定时器的类型
  declare type TimeoutHandle = ReturnType<typeof setTimeout>
  declare type IntervalHandle = ReturnType<typeof setInterval>

  declare interface ChangeEvent extends Event {
    target: HTMLInputElement
  }

  declare interface WheelEvent {
    path?: EventTarget[]
  }

  // JSX一些语法声明
  namespace JSX {
    // tslint:disable no-empty-interface
    type Element = VNode
    // tslint:disable no-empty-interface
    type ElementClass = ComponentRenderProxy
    interface ElementAttributesProperty {
      $props: any
    }
    interface IntrinsicElements {
      [elem: string]: any
    }
    interface IntrinsicAttributes {
      [elem: string]: any
    }
  }

  // vue
  declare type PropType<T> = VuePropType<T>
  declare type VueNode = VNodeChild | JSX.Element

  export type Writable<T> = {
    -readonly [P in keyof T]: T[P]
  }
}
declare module 'vue' {
  export type JSXComponent<Props = any> =
    | { new (): ComponentPublicInstance<Props> }
    | FunctionalComponent<Props>
}
