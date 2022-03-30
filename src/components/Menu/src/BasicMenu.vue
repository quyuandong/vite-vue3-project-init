<template>
  <Menu
    :selected-keys="selectedKeys"
    :defaultSelectedKeys="defaultSelectedKeys"
    :mode="mode"
    :open-keys="getOpenKeys"
    :theme="theme"
    :class="getMenuClass"
    :sub-menu-close-delay="0.2"
    v-bind="getInlineCollapseOptions"
    @open-change="handleOpenChange"
    @click="handleMenuClick"
  >
    <template v-for="item in items" :key="item.path">
      <BasicSubMenuItem :item="item" :theme="theme" :isHorizontal="isHorizontal" />
    </template>
  </Menu>
</template>
<script lang="ts">
  import { Menu } from 'ant-design-vue'
  import BasicSubMenuItem from './components/BasicSubMenuItem.vue'
  import { computed, defineComponent, reactive, ref, toRefs, unref, watch } from 'vue'
  import { RouteLocationNormalizedLoaded, useRouter } from 'vue-router'
  import { basicProps } from './props'
  import { MenuState } from './typing'
  import { useOpenKeys } from './useOpenKeys'
  import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum'
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting'
  import { useDesign } from '/@/hooks/web/useDesign'
  import { listenerRouteChange } from '/@/logics/mitt/routeChange'
  import { REDIRECT_NAME } from '/@/router/constant'
  import { getAllParentPath } from '/@/router/helper/menuHelper'
  import { getCurrentParentPath } from '/@/router/menus'
  import { isFunction } from '/@/utils/is'

  export default defineComponent({
    name: 'BasicMenu',
    components: { Menu, BasicSubMenuItem },
    props: basicProps,
    emits: ['menuClick'],
    setup(props, { emit }) {
      // 是否点击了菜单
      const isClickGo = ref(false)
      // 当前激活的菜单
      const currentActiveMenu = ref('')

      // 菜单状态
      const menuState = reactive<MenuState>({
        defaultSelectedKeys: [],
        openKeys: [],
        selectedKeys: [],
        collapsedOpenKeys: [],
      })

      const { prefixCls } = useDesign('basic-menu')
      const { items, mode, accordion } = toRefs(props)

      const { getCollapsed, getTopMenuAlign, getSplit } = useMenuSetting()

      const { currentRoute } = useRouter()

      const { handleOpenChange, setOpenKeys, getOpenKeys } = useOpenKeys(
        menuState,
        items,
        mode as any,
        accordion,
      )

      // 是否是顶部
      const getIsTopMenu = computed(() => {
        const { type, mode } = props
        return (
          (type === MenuTypeEnum.TOP_MENU && mode === MenuModeEnum.HORIZONTAL) ||
          (props.isHorizontal && unref(getSplit))
        )
      })

      // 获取菜单样式
      const getMenuClass = computed(() => {
        const align = props.isHorizontal && unref(getSplit) ? 'start' : unref(getTopMenuAlign)
        return [
          prefixCls,
          `justify-${align}`,
          {
            [`${prefixCls}__second`]: !props.isHorizontal && unref(getSplit),
            [`${prefixCls}__sidebar-hor`]: unref(getIsTopMenu),
          },
        ]
      })

      //获取内联折叠选项
      const getInlineCollapseOptions = computed(() => {
        const isInline = props.mode === MenuModeEnum.INLINE
        const inlineCollapseOptions: { inlineCollapsed?: boolean } = {}
        if (isInline) {
          inlineCollapseOptions.inlineCollapsed = props.mixSider ? false : unref(getCollapsed)
        }
        return inlineCollapseOptions
      })

      // 监听路由变化
      listenerRouteChange(route => {
        if (route.name === REDIRECT_NAME) return
        handleMenuChange(route)
        currentActiveMenu.value = route.meta.currentActiveMenu as string
        if (unref(currentActiveMenu)) {
          menuState.selectedKeys = [unref(currentActiveMenu)]
          setOpenKeys(unref(currentActiveMenu))
        }
      })

      // 不是混合菜单时
      !props.mixSider &&
        watch(
          () => props.items,
          () => {
            handleMenuChange()
          },
        )
      /**
       * 点击菜单
       * @param param
       */
      async function handleMenuClick({ key }: { key: string; keyPath: string[] }) {
        const { beforeClickFn } = props
        if (beforeClickFn && isFunction(beforeClickFn)) {
          const flag = await beforeClickFn(key)
          if (!flag) return
          emit('menuClick', key)
          isClickGo.value = true
          menuState.selectedKeys = [key]
        }
      }

      /**
       * 菜单改变
       * @param route
       */
      async function handleMenuChange(route?: RouteLocationNormalizedLoaded) {
        if (unref(isClickGo)) {
          isClickGo.value = false
          return
        }
        const path =
          (route || unref(currentRoute)).meta.currentActiveMenu ||
          (route || unref(currentRoute)).path
        // 打开对应菜单
        setOpenKeys(path)
        if (unref(currentActiveMenu)) return
        if (props.isHorizontal && unref(getSplit)) {
          const parentPath = await getCurrentParentPath(path)
          menuState.selectedKeys = [parentPath]
        } else {
          const parentPath = await getAllParentPath(props.items, path)
          menuState.selectedKeys = parentPath
        }
      }

      return {
        handleMenuClick,
        getInlineCollapseOptions,
        getMenuClass,
        handleOpenChange,
        getOpenKeys,
        ...toRefs(menuState),
      }
    },
  })
</script>
<style lang="less">
  @import './index.less';
</style>
