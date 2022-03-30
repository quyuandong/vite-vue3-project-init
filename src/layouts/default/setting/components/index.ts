/**
 * 项目配置各子项
 * 1. typePicker: 导航栏模式布局
 */

import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent'

// 类型选择
export const TypePicker = createAsyncComponent(() => import('./TypePicker.vue'))
// 颜色选择
export const ThemeColorPicker = createAsyncComponent(() => import('./ThemeColorPicker.vue'))
// 底部
export const SettingFooter = createAsyncComponent(() => import('./SettingFooter.vue'))
// 选择
export const SwitchItem = createAsyncComponent(() => import('./SwitchItem.vue'))
// 下拉
export const SelectItem = createAsyncComponent(() => import('./SelectItem.vue'))
// 输入
export const InputNumberItem = createAsyncComponent(() => import('./InputNumberItem.vue'))
