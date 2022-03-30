<script lang="ts">
  /**
   * 适配配置----手机端与pc端
   * provide inject 全局参数(样式前缀，与当前模式)
   * 模式切换保存菜单状态
   */
  import { defineComponent, ref, toRefs, unref } from 'vue'
  import { createAppProviderContext } from './useAppContext'
  import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum'
  import { createBreakpointListen } from '/@/hooks/event/useBreakpoint'
  import { prefixCls } from '/@/settings/designSetting'
  import { useAppStore } from '/@/store/modules/app'

  const props = {
    // 样式前缀
    prefixCls: { type: String, default: prefixCls },
  }

  export default defineComponent({
    name: 'AppProvider',
    inheritAttrs: false, //是否将属性直接作用页签上
    props,
    setup(props, { slots }) {
      const isMobile = ref(false) //是否是手机模式
      const isSetState = ref(false)
      const appStore = useAppStore()

      // 监控屏幕大小的改变
      createBreakpointListen(({ screenMap, sizeEnum, width }) => {
        const lgWidth = screenMap.get(sizeEnum.LG)
        if (lgWidth) {
          isMobile.value = width.value - 1 < lgWidth //赋值是否是手机模式
          handleRestoreState()
        }
      })

      const { prefixCls } = toRefs(props)
      //   将变量注入全局变量
      createAppProviderContext({ prefixCls, isMobile })

      /**
       * 是否手机模式 保存和恢复菜单的状态
       */
      function handleRestoreState() {
        //   是否是手机模式
        if (unref(isMobile)) {
          if (!unref(isSetState)) {
            isSetState.value = true
            const {
              menuSetting: {
                type: menuType,
                mode: menuMode,
                collapsed: menuCollapsed,
                split: menuSplit,
              },
            } = appStore.getProjectConfig
            appStore.setProjectConfig({
              menuSetting: {
                type: MenuTypeEnum.SIDEBAR,
                mode: MenuModeEnum.INLINE,
                split: false,
              },
            })
            appStore.setBeforeMiniInfo({ menuMode, menuCollapsed, menuType, menuSplit })
          }
        } else {
          if (unref(isSetState)) {
            isSetState.value = false
            const { menuMode, menuCollapsed, menuType, menuSplit } = appStore.getBeforeMiniInfo
            appStore.setProjectConfig({
              menuSetting: {
                type: menuType,
                mode: menuMode,
                collapsed: menuCollapsed,
                split: menuSplit,
              },
            })
          }
        }
      }

      // 插槽
      return () => slots.default?.()
    },
  })
</script>
