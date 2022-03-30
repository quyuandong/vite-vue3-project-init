<template>
  <transition>
    <div :class="prefixCls">
      <Login sessionTimeout />
    </div>
  </transition>
</template>
<script lang="ts" setup>
  import { onBeforeMount, onMounted, ref } from 'vue'
  import Login from './Login.vue'
  import { PermissionModeEnum } from '/@/enums/appEnum'
  import { useDesign } from '/@/hooks/web/useDesign'
  import { useAppStore } from '/@/store/modules/app'
  import { usePermissionStore } from '/@/store/modules/permission'
  import { useUserStore } from '/@/store/modules/user'

  const { prefixCls } = useDesign('st-login')
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  const appStore = useAppStore()
  const userId = ref<Nullable<number | string>>(0)

  // 是否是根据后台返回的菜单生成路由
  const isBackMode = () => {
    return appStore.getProjectConfig.permissionMode === PermissionModeEnum.BACK
  }

  onMounted(() => {
    // 记录当前的UerId
    userId.value = userStore.getUserInfo.userId
  })

  onBeforeMount(() => {
    if (userId.value && userId.value !== userStore.getUserInfo.userId) {
      // 登录的不是同一个用户，刷新整个页面以便丢弃之前用户的页面状态
      document.location.reload()
    } else if (isBackMode() && permissionStore.getLastBuildMenuTime === 0) {
      // 后台权限模式下，没有成功加载过菜单，就重新加载整个页面。这通常发生在会话过期后按F5刷新整个页面后载入了本模块这种场景
      document.location.reload()
    }
  })
</script>
