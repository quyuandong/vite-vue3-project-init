/**
 * 将一些变量 注入成全局变量
 */

import { InjectionKey, Ref } from 'vue'
import { createContext, useContext } from '/@/hooks/core/useContext'

export interface AppProviderContextProps {
  prefixCls: Ref<string>
  isMobile: Ref<boolean>
}

const key: InjectionKey<AppProviderContextProps> = Symbol()

// 全局注入 provide
export function createAppProviderContext(context: AppProviderContextProps) {
  return createContext<AppProviderContextProps>(context, key)
}

// 获取注入值 inject
export function useAppProviderContext() {
  return useContext<AppProviderContextProps>(key)
}
