<template>
  <div :class="[prefixCls, `${prefixCls}--${theme}`]">
    <a-breadcrumb :routes="routes">
      <template #itemRender="{ route, routes: routesMatched, paths }">
        <Icon :icon="getIcon(route)" v-if="getShowBreadCrumbIcon && getIcon(route)" />
        <!-- 不重定向 -->
        <span v-if="!hasRedirect(routesMatched, route)">{{ route.name || route.meta.name }}</span>
        <!-- 重定向 -->
        <router-link v-else to="" @click="handleClick(route, paths, $event)">
          {{ route.name || route.meta.name }}
        </router-link>
      </template>
    </a-breadcrumb>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, watchEffect } from 'vue'
  import { RouteLocationMatched, useRouter } from 'vue-router'

  import { Breadcrumb } from 'ant-design-vue'
  import { Icon } from '/@/components/Icon'

  import { useRootSetting } from '/@/hooks/setting/useRootSetting'
  import { useDesign } from '/@/hooks/web/useDesign'
  import { useGo } from '/@/hooks/web/usePage'
  import { REDIRECT_NAME } from '/@/router/constant'
  import { getAllParentPath } from '/@/router/helper/menuHelper'
  import { getMenus } from '/@/router/menus'
  import { Menu } from '/@/router/types'
  import { filter } from '/@/utils/helper/treeHelper'
  import { isString } from '/@/utils/is'
  import { propTypes } from '/@/utils/propTypes'

  export default defineComponent({
    name: 'LayoutBreadcrumb',
    components: { Icon, [Breadcrumb.name]: Breadcrumb },
    props: {
      theme: propTypes.oneOf(['dark', 'light']),
    },
    setup() {
      const routes = ref<RouteLocationMatched[]>([])
      const { currentRoute } = useRouter()
      const { prefixCls } = useDesign('layout-breadcrumb')
      // 是否显示面包屑图标
      const { getShowBreadCrumbIcon } = useRootSetting()
      // 页面跳转
      const go = useGo()

      // 监控
      watchEffect(async () => {
        // 重定向的name去除
        if (currentRoute.value.name === REDIRECT_NAME) return
        const menus = await getMenus()

        // 栈
        const routeMatched = currentRoute.value.matched
        const cur = routeMatched?.[routeMatched.length - 1]
        let path = currentRoute.value.path

        if (cur && cur?.meta.currentActiveMenu) {
          path = cur.meta.currentActiveMenu as string
        }

        // 获取所有的父级路径【父级，子级...】
        const parent = getAllParentPath(menus, path)
        const filterMenus = menus.filter(item => item.path === parent[0])
        const matched = getMatched(filterMenus, parent) as any

        if (!matched || matched.length === 0) return

        const breadcrumbList = filterItem(matched)

        if (currentRoute.value.meta?.currentActiveMenu) {
          breadcrumbList.push({
            ...currentRoute.value,
            name: currentRoute.value.meta?.title || currentRoute.value.name,
          } as unknown as RouteLocationMatched)
        }
        routes.value = breadcrumbList
      })

      /**
       * 获取路径上的所有菜单（平铺）
       * @param menus 菜单
       * @param parent 所有的父级路径
       */
      function getMatched(menus: Menu[], parent: string[]) {
        const matched: Menu[] = []
        menus.forEach(item => {
          if (parent.includes(item.path)) {
            matched.push({
              ...item,
              name: item.meta?.title || item.name,
            })
          }
          if (item.children?.length) {
            matched.push(...getMatched(item.children, parent))
          }
        })
        return matched
      }

      /**
       * 过滤掉隐藏面包屑的菜单
       * @param list
       */
      function filterItem(list: RouteLocationMatched[]) {
        return filter(list, item => {
          const { meta, name } = item
          if (!meta) return !!name
          const { title, hideBreadcrumb } = meta
          if (!title || hideBreadcrumb) return false
          return true
        }).filter(item => !item.meta.hideBreadcrumb)
      }

      /**
       * 点击面包屑进行跳转
       * @param route 路由
       * @param paths 地址
       * @param e 事件
       */
      function handleClick(route: RouteLocationMatched, paths: string[], e: Event) {
        // 取消默认事件
        e?.preventDefault()
        const { children, redirect, meta } = route

        if (children?.length && !redirect) {
          // 取消冒泡事件
          e.stopPropagation()
          return
        }
        // 参数是否需要在tab页上显示
        if (meta.carryParam) return
        if (redirect && isString(redirect)) {
          go(redirect)
        } else {
          let goPath = ''
          if (paths.length === 1) {
            goPath = paths[0]
          } else {
            const ps = paths.slice(1)
            const lastPath = ps.pop() || ''
            goPath = `${lastPath}`
          }
          goPath = /^\//.test(goPath) ? goPath : `/${goPath}`
          go(goPath)
        }
      }
      // 是否重定向
      function hasRedirect(routes: RouteLocationMatched[], route: RouteLocationMatched) {
        return routes.indexOf(route) !== routes.length - 1
      }
      // 获取面包屑图标
      function getIcon(route) {
        return route.icon || route.meta.icon
      }

      return {
        routes,
        prefixCls,
        getIcon,
        getShowBreadCrumbIcon,
        handleClick,
        hasRedirect,
      }
    },
  })
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-layout-breadcrumb';

  .@{prefix-cls} {
    display: flex;
    padding: 0 8px;
    align-items: center;

    .ant-breadcrumb-link {
      .anticon {
        margin-right: 4px;
        margin-bottom: 2px;
      }
    }

    &--light {
      .ant-breadcrumb-link {
        color: @breadcrumb-item-normal-color;

        a {
          color: rgb(0 0 0 / 65%);

          &:hover {
            color: @primary-color;
          }
        }
      }

      .ant-breadcrumb-separator {
        color: @breadcrumb-item-normal-color;
      }
    }

    &--dark {
      .ant-breadcrumb-link {
        color: rgb(255 255 255 / 60%);

        a {
          color: rgb(255 255 255 / 80%);

          &:hover {
            color: @white;
          }
        }
      }

      .ant-breadcrumb-separator,
      .anticon {
        color: rgb(255 255 255 / 80%);
      }
    }
  }
</style>
