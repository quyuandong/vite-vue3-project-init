<script lang="tsx">
  import { computed, CSSProperties, defineComponent, PropType, toRef, unref } from 'vue'
  import { useSplitMenu } from './useLayoutMenu'
  import { AppLogo } from '/@/components/Application'
  import { ScrollContainer } from '/@/components/Container'
  import { BasicMenu } from '/@/components/Menu'
  import { SimpleMenu } from '/@/components/SimpleMenu'
  import { MenuModeEnum, MenuSplitTyeEnum } from '/@/enums/menuEnum'
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting'
  import { useRootSetting } from '/@/hooks/setting/useRootSetting'
  import { useAppInject } from '/@/hooks/web/useAppInject'
  import { useDesign } from '/@/hooks/web/useDesign'
  import { useGo } from '/@/hooks/web/usePage'
  import { openWindow } from '/@/utils'
  import { isUrl } from '/@/utils/is'
  import { propTypes } from '/@/utils/propTypes'

  export default defineComponent({
    name: 'LayoutMenu',
    props: {
      theme: propTypes.oneOf(['light', 'dark']),
      splitType: {
        type: Number as PropType<MenuSplitTyeEnum>,
        default: MenuSplitTyeEnum.NONE,
      },
      isHorizontal: propTypes.bool,
      menuMode: {
        type: [String] as PropType<MenuModeEnum | null>,
        default: '',
      },
    },
    setup(props) {
      const go = useGo()

      const {
        getMenuMode,
        getMenuType,
        getMenuTheme,
        getCollapsed,
        getCollapsedShowTitle,
        getAccordion,
        getIsHorizontal,
        getIsSidebarType,
        getSplit,
      } = useMenuSetting()

      const { getShowLogo } = useRootSetting()
      const { prefixCls } = useDesign('layout-menu')
      const { menusRef } = useSplitMenu(toRef(props, 'splitType'))
      const { getIsMobile } = useAppInject()

      // 获取菜单布局类型（水平/垂直...）
      const getComputedMenuMode = computed(() =>
        unref(getIsMobile) ? MenuModeEnum.INLINE : props.menuMode || unref(getMenuMode),
      )

      // 获取菜单主题
      const getComputedMenuTheme = computed(() => props.theme || unref(getMenuTheme))

      // 是否显示logo
      const getIsShowLogo = computed(() => unref(getShowLogo) && unref(getIsSidebarType))

      // 是否使用滚动条
      const getUseScroll = computed(() => {
        return (
          !unref(getIsHorizontal) &&
          (unref(getIsSidebarType) ||
            props.splitType === MenuSplitTyeEnum.LEFT ||
            props.splitType === MenuSplitTyeEnum.NONE)
        )
      })

      // 获取菜单容器的高度
      const getWrapperStyle = computed((): CSSProperties => {
        return {
          height: `calc(100% - ${unref(getIsShowLogo) ? '48px' : '0px'})`,
        }
      })

      // 获取logo的样式
      const getLogoClass = computed(() => {
        return [
          `${prefixCls}-logo`,
          unref(getComputedMenuTheme),
          {
            [`${prefixCls}--mobile`]: unref(getIsMobile),
          },
        ]
      })

      // 获取所有传递的参数
      const getCommonProps = computed(() => {
        const menus = unref(menusRef)
        return {
          menus,
          beforeClickFn: beforeMenuClickFn,
          items: menus,
          theme: unref(getComputedMenuTheme),
          accordion: unref(getAccordion),
          collapse: unref(getCollapsed),
          collapsedShowTitle: unref(getCollapsedShowTitle),
          onMenuClick: handleMenuClick,
        }
      })

      // 点击菜单
      function handleMenuClick(path: string) {
        go(path)
      }

      // 点击菜单之前操作
      async function beforeMenuClickFn(path: string) {
        if (!isUrl(path)) {
          return true
        }
        openWindow(path)
        return false
      }

      // x渲染菜单上边的头部 logo
      function renderHeader() {
        if (!unref(getIsShowLogo) && !unref(getIsMobile)) return null

        return (
          <AppLogo
            showTitle={!unref(getCollapsed)}
            class={unref(getLogoClass)}
            theme={unref(getComputedMenuTheme)}
          />
        )
      }

      // 渲染菜单
      function renderMenu() {
        const { menus, ...menuProps } = unref(getCommonProps)
        if (!menus || !menus.length) return
        return !props.isHorizontal ? (
          <SimpleMenu {...menuProps} isSplitMenu={unref(getSplit)} items={menus} />
        ) : (
          <BasicMenu
            {...(menuProps as any)}
            isHorizontal={props.isHorizontal}
            type={unref(getMenuType)}
            showLogo={unref(getIsShowLogo)}
            mode={unref(getComputedMenuMode as any)}
            items={menus}
          />
        )
      }

      return () => {
        return (
          <>
            {renderHeader()}
            {unref(getUseScroll) ? (
              <ScrollContainer style={unref(getWrapperStyle)}>{() => renderMenu()}</ScrollContainer>
            ) : (
              renderMenu()
            )}
          </>
        )
      }
    },
  })
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-layout-menu';
  @logo-prefix-cls: ~'@{namespace}-app-logo';

  .@{prefix-cls} {
    &-logo {
      height: @header-height;
      padding: 10px 4px 10px 10px;

      img {
        width: @logo-width;
        height: @logo-width;
      }
    }

    &--mobile {
      .@{logo-prefix-cls} {
        &__title {
          opacity: 100%;
        }
      }
    }
  }
</style>
