/**
 * 状态重置，一般用于进入登陆界面时，清除多有的状态
 */

import { Router } from 'vue-router'
import { PageEnum } from '/@/enums/pageEnum'
import { removeTabChangeListener } from '/@/logics/mitt/routeChange'
import { useAppStore } from '/@/store/modules/app'
import { useMultipleTabStore } from '/@/store/modules/multipleTab'
import { usePermissionStore } from '/@/store/modules/permission'
import { useUserStore } from '/@/store/modules/user'

export function createStateGuard(router: Router) {
  router.afterEach(to => {
    if (to.path === PageEnum.BASE_LOGIN) {
      const tabStore = useMultipleTabStore()
      const userStore = useUserStore()
      const appStore = useAppStore()
      const permissionStore = usePermissionStore()
      tabStore.resetState()
      userStore.resetState()
      appStore.resetAllState()
      permissionStore.resetState()
      removeTabChangeListener()
    }
  })
}
