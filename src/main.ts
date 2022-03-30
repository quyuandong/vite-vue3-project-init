import '/@/design/index.less'
import 'virtual:windi-base.css'
import 'virtual:windi-components.css'
import 'virtual:windi-utilities.css'
// 注册雪碧图
import 'virtual:svg-icons-register'
import { createApp } from 'vue'
import App from './App.vue'
import { initAppConfigStore } from './logics/initAppConfig'
import { setupErrorHandle } from '/@/logics/error-handle'
import { router, setupRouter } from './router'
import { setupRouterGuard } from './router/guard'
import { setupStore } from './store'
import { setupGlobDirectives } from './directives'
import { setupI18n } from '/@/locales/setupI18n'
import { registerGlobComp } from '/@/components/registerGlobComp'

// 本地开发 引入ant-design所有的样式文件
if (import.meta.env.DEV) {
  import('ant-design-vue/dist/antd.less')
}

async function initApp() {
  const app = createApp(App)

  // 设置store 仓库
  setupStore(app)

  // 注册全局组件
  registerGlobComp(app)

  // 初始化系统内部配置
  initAppConfigStore()

  // 多语言配置 (异步情况:语言文件可能从服务器端获取  )
  await setupI18n(app)

  // 设置路由
  setupRouter(app)

  // 路由守卫
  setupRouterGuard(router)

  // 全局指令注册
  setupGlobDirectives(app)

  //全局错误捕捉
  setupErrorHandle(app)

  // 渲染
  app.mount('#app')
}

initApp()
