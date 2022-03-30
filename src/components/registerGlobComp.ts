/**
 * 注册一些全局组件
 */
import { Button } from './Button'

import {
  // Need
  Button as AntButton,
  Input,
  Layout,
} from 'ant-design-vue'
import { App } from 'vue'

const compList = [AntButton.Group]

export function registerGlobComp(app: App) {
  compList.forEach(comp => {
    app.component(comp.name || comp.displayName, comp)
  })

  app.use(Input).use(Button).use(Layout)
}
