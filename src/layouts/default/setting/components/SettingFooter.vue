<template>
  <div :class="prefixCls">
    <a-button color="warning" block @click="handleResetSetting" class="my-3">
      <RedoOutlined class="mr-2" />
      重置
    </a-button>

    <a-button color="error" block @click="handleClearAndRedo">
      <RedoOutlined class="mr-2" />
      清空缓存并返回登陆页
    </a-button>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'

  import { RedoOutlined } from '@ant-design/icons-vue'

  import { useAppStore } from '/@/store/modules/app'
  import { usePermissionStore } from '/@/store/modules/permission'
  import { useMultipleTabStore } from '/@/store/modules/multipleTab'
  import { useUserStore } from '/@/store/modules/user'

  import { useDesign } from '/@/hooks/web/useDesign'
  import { useMessage } from '/@/hooks/web/useMessage'

  import { updateColorWeak } from '/@/logics/theme/updateColorWeak'
  import { updateGrayMode } from '/@/logics/theme/updateGrayMode'
  import defaultSetting from '/@/settings/projectSetting'

  export default defineComponent({
    name: 'SettingFooter',
    components: { RedoOutlined },
    setup() {
      const permissionStore = usePermissionStore()
      const { prefixCls } = useDesign('setting-footer')
      const { createMessage } = useMessage()
      const tabStore = useMultipleTabStore()
      const userStore = useUserStore()
      const appStore = useAppStore()

      function handleResetSetting() {
        try {
          appStore.setProjectConfig(defaultSetting)
          const { colorWeak, grayMode } = defaultSetting
          // updateTheme(themeColor);
          updateColorWeak(colorWeak)
          updateGrayMode(grayMode)
          createMessage.success('重置成功!')
        } catch (error: any) {
          createMessage.error(error)
        }
      }

      function handleClearAndRedo() {
        localStorage.clear()
        appStore.resetAllState()
        permissionStore.resetState()
        tabStore.resetState()
        userStore.resetState()
        location.reload()
      }
      return {
        prefixCls,
        handleResetSetting,
        handleClearAndRedo,
      }
    },
  })
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-setting-footer';

  .@{prefix-cls} {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
