import { withInstall } from '/@/utils'

// 注入全局变量
import appProvider from './src/AppProvider.vue'
// 多语言切换
import appLocalePicker from './src/AppLocalePicker.vue'
// 主题切换
import appDarkModeToggle from './src/AppDarkModeToggle.vue'
// logo
import appLogo from './src/AppLogo.vue'
// 全局搜索
import appSearch from './src/search/AppSearch.vue'

// 导出全局变量
export { useAppProviderContext } from './src/useAppContext'

export const AppProvider = withInstall(appProvider)
export const AppLocalePicker = withInstall(appLocalePicker)
export const AppDarkModeToggle = withInstall(appDarkModeToggle)
export const AppLogo = withInstall(appLogo)
export const AppSearch = withInstall(appSearch)
