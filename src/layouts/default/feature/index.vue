<template>
  <!-- 锁屏 -->
  <LayoutLockPage />
  <!-- 回到顶部 -->
  <BackTop v-if="getUseOpenBackTop" :target="getTarget" />
  <!-- 项目设置-抽屉 -->
  <SettingDrawer v-if="getIsFixedSettingDrawer" :class="prefixCls" />
  <!-- 会话过期到登陆 -->
  <SessionTimeoutLogin v-if="getIsSessionTimeout" />
</template>
<script lang="ts">
  import { computed, defineComponent, unref } from 'vue'
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent'
  import { BackTop } from 'ant-design-vue'
  import SessionTimeoutLogin from '/@/views/sys/login/SessionTimeoutLogin.vue'
  import { useRootSetting } from '/@/hooks/setting/useRootSetting'
  import { useUserStoreWithOut } from '/@/store/modules/user'
  import { useDesign } from '/@/hooks/web/useDesign'
  import { SettingButtonPositionEnum } from '/@/enums/appEnum'
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting'

  export default defineComponent({
    name: 'LayoutFeatures',
    components: {
      BackTop,
      LayoutLockPage: createAsyncComponent(() => import('/@/views/sys/lock/index.vue')),
      SettingDrawer: createAsyncComponent(() => import('/@/layouts/default/setting/index.vue')),
      SessionTimeoutLogin,
    },
    setup() {
      const { getUseOpenBackTop, getShowSettingButton, getSettingButtonPosition, getFullContent } =
        useRootSetting()

      const userStore = useUserStoreWithOut()
      const { prefixCls } = useDesign('setting-drawer-feature')
      const { getShowHeader } = useHeaderSetting()

      // 会话是否过期
      const getIsSessionTimeout = computed(() => userStore.getSessionTimeout)

      const getIsFixedSettingDrawer = computed(() => {
        if (!unref(getShowSettingButton)) return false

        const settingButtonPosition = unref(getSettingButtonPosition)

        if (settingButtonPosition === SettingButtonPositionEnum.AUTO) {
          return !unref(getShowHeader) || unref(getFullContent)
        }
        return settingButtonPosition === SettingButtonPositionEnum.FIXED
      })

      return {
        getTarget: () => document.body,
        getUseOpenBackTop,
        getIsFixedSettingDrawer,
        prefixCls,
        getIsSessionTimeout,
      }
    },
  })
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-setting-drawer-feature';

  .@{prefix-cls}{
    position: absolute;
    top: 45%;
    right: 0;
    z-index: 10;
    display: flex;
    padding: 10px;
    color: @white;
    cursor: pointer;
    background-color: @primary-color;
     border-radius: 6px 0 0 6px;
    justify-content: center;
    align-items: center;

    svg {
      width: 1em;
      height: 1em;
    }
  }
</style>
