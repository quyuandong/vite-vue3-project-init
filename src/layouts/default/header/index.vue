<template>
  <Header :class="getHeaderClass">
    <!-- 左侧 start -->
    <div :class="`${prefixCls}-left`">
      <!-- logo -->
      <AppLogo
        v-if="getShowHeaderLogo || getIsMobile"
        :class="`${prefixCls}-logo`"
        :theme="getHeaderTheme"
        :style="getLogoWidth"
      />
      <!-- 菜单折叠按钮 -->
      <LayoutTrigger
        v-if="
          (getShowContent && getShowHeaderTrigger && !getSplit && !getIsMixSidebar) || getIsMobile
        "
        :theme="getHeaderTheme"
        :sider="false"
      />
      <!-- 面包屑 -->
      <LayoutBreadcrumb v-if="getShowContent && getShowBread" :theme="getHeaderTheme" />
    </div>
    <!-- 左侧 end -->

    <!-- 顶部菜单 start -->
    <div :class="`${prefixCls}-menu`" v-if="getShowTopMenu && !getIsMobile">
      <LayoutMenu
        :is-horizontal="true"
        :theme="getHeaderTheme"
        :split-type="getSplitType"
        :menu-mode="getMenuMode"
      />
    </div>
    <!-- 菜单 end -->

    <!-- 其他功能操作  -->
    <div :class="`${prefixCls}-action`">
      <!-- 搜索 -->
      <AppSearch :class="`${prefixCls}-action__item`" v-if="getShowSearch" />
      <!-- 日志 -->
      <ErrorAction v-if="getUseErrorHandle" :class="`${prefixCls}-action__item error-action`" />
      <!-- 消息通知 -->
      <Notify v-if="getShowNotice" :class="`${prefixCls}-action__item notify-item`" />
      <!-- 全屏 -->
      <FullScreen v-if="getShowFullScreen" :class="`${prefixCls}-action__item fullscreen-item`" />
      <!-- 语言切换 -->
      <AppLocalePicker
        v-if="getShowLocalePicker"
        :reload="true"
        :showText="false"
        :class="`${prefixCls}-action__item`"
      />
      <!-- 用户信息 -->
      <UserDropDown :theme="getHeaderTheme" />
      <!-- 抽屉按钮 -->
      <SettingDrawer :class="`${prefixCls}-action__item`" />
    </div>
  </Header>
</template>
<script lang="ts">
  import { Layout } from 'ant-design-vue'
  import { computed, defineComponent, unref } from 'vue'

  import { AppLocalePicker, AppLogo } from '/@/components/Application'
  import LayoutTrigger from '../trigger/index.vue'
  import LayoutMenu from '../menu/index.vue'

  import { SettingButtonPositionEnum } from '/@/enums/appEnum'
  import { MenuModeEnum, MenuSplitTyeEnum } from '/@/enums/menuEnum'

  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting'
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting'
  import { useRootSetting } from '/@/hooks/setting/useRootSetting'

  import { useAppInject } from '/@/hooks/web/useAppInject'
  import { useDesign } from '/@/hooks/web/useDesign'
  import { useLocale } from '/@/locales/useLocale'
  import { propTypes } from '/@/utils/propTypes'

  import { AppSearch } from '/@/components/Application'
  import { ErrorAction, Notify, LayoutBreadcrumb, FullScreen, UserDropDown } from './components'
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent'

  export default defineComponent({
    name: 'LayoutHeader',
    components: {
      Header: Layout.Header,
      AppLogo,
      LayoutTrigger,
      LayoutBreadcrumb,
      LayoutMenu,
      AppSearch,
      ErrorAction,
      Notify,
      FullScreen,
      AppLocalePicker,
      UserDropDown,
      SettingDrawer: createAsyncComponent(() => import('/@/layouts/default/setting/index.vue'), {
        loading: true,
      }),
    },
    props: {
      fixed: propTypes.bool, //是否固定
    },
    setup(props) {
      const { prefixCls } = useDesign('layout-header')

      // 基本配置
      const { getUseErrorHandle, getShowSettingButton, getSettingButtonPosition } = useRootSetting()
      // 菜单配置
      const {
        getShowTopMenu,
        getShowHeaderTrigger,
        getSplit,
        getIsMixMode,
        getIsMixSidebar,
        getMenuWidth,
      } = useMenuSetting()
      // 头部配置
      const {
        getHeaderTheme,
        getShowFullScreen,
        getShowNotice,
        getShowContent,
        getShowBread,
        getShowHeaderLogo,
        getShowHeader,
        getShowSearch,
      } = useHeaderSetting()

      const { getShowLocalePicker } = useLocale()

      // 是否是手机模式
      const { getIsMobile } = useAppInject()

      // 头部样式
      const getHeaderClass = computed(() => {
        const theme = unref(getHeaderTheme)
        return [
          prefixCls,
          {
            [`${prefixCls}--fixed`]: props.fixed,
            [`${prefixCls}--mobile`]: unref(getIsMobile),
            [`${prefixCls}--${theme}`]: theme,
          },
        ]
      })
      // 是否显示设置
      const getShowSetting = computed(() => {
        if (!unref(getShowSettingButton)) {
          return false
        }
        const settingButtonPosition = unref(getSettingButtonPosition)
        if (settingButtonPosition === SettingButtonPositionEnum.AUTO) {
          return unref(getShowHeader)
        }
        return settingButtonPosition === SettingButtonPositionEnum.HEADER
      })
      // 获取logo宽度
      const getLogoWidth = computed(() => {
        if (!unref(getIsMixMode) || unref(getIsMobile)) {
          return {}
        }
        const width = unref(getMenuWidth) < 180 ? 180 : unref(getMenuWidth)
        return { width: `${width}px` }
      })
      // 获取分割类型
      const getSplitType = computed(() => {
        return unref(getSplit) ? MenuSplitTyeEnum.TOP : MenuSplitTyeEnum.NONE
      })
      // 菜单模型
      const getMenuMode = computed(() => {
        return unref(getSplit) ? MenuModeEnum.HORIZONTAL : null
      })

      return {
        prefixCls,
        getHeaderClass,
        getShowHeaderLogo,
        getHeaderTheme,
        getShowHeaderTrigger,
        getIsMobile,
        getShowBread,
        getShowContent,
        getSplitType,
        getSplit,
        getMenuMode,
        getShowTopMenu,
        getShowLocalePicker,
        getShowFullScreen,
        getShowNotice,
        getUseErrorHandle,
        getLogoWidth,
        getIsMixSidebar,
        getShowSettingButton,
        getShowSetting,
        getShowSearch,
      }
    },
  })
</script>
<style lang="less">
  @import './index.less';
</style>
