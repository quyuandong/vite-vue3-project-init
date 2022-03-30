import { PageEnum } from '/@/enums/pageEnum'
import { MULTIPLE_TABS_KEY } from '/@/enums/cacheEnum'
import projectSetting from '/@/settings/projectSetting'
import { RouteLocationNormalized, RouteLocationRaw, Router } from 'vue-router'
import { defineStore } from 'pinia'
import { Persistent } from '/@/utils/cache/persistent'
import { store } from '/@/store'
import { useGo, useRedo } from '/@/hooks/web/usePage'
import { getRawRoute } from '/@/utils'
import { toRaw, unref } from 'vue'
import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/routes/basic'
import { useUserStore } from './user'

export interface MultipleTabState {
  cacheTabList: Set<string> //需要缓存的选项卡
  tabList: RouteLocationNormalized[] //tab列表
  lastDragEndIndex: number //上次移动的标签索引
}

// 是否缓存已经打开的页签（刷新）
const cacheTab = projectSetting.multiTabsSetting.cache

// 跳转到对应的路由
function handleGoToPage(router: Router) {
  const go = useGo(router)
  go(unref(router.currentRoute).path, true)
}

// 获取目标跳转的页签
const getToTarget = (tabItem: RouteLocationNormalized) => {
  const { params, path, query } = tabItem
  return {
    params: params || {},
    path,
    query: query || {},
  }
}

export const useMultipleTabStore = defineStore({
  id: 'app-multiple-tab',
  state: (): MultipleTabState => ({
    // 缓存的页签
    cacheTabList: new Set(),
    // tab页签集合
    tabList: cacheTab ? Persistent.getLocal(MULTIPLE_TABS_KEY) || [] : [],
    // 最后一次移动的页签索引
    lastDragEndIndex: 0,
  }),
  getters: {
    getTabList(): RouteLocationNormalized[] {
      return this.tabList
    },
    getCachedTabList(): string[] {
      // 对一个类似数组或可迭代对象创建一个新的，浅拷贝的数组实例
      return Array.from(this.cacheTabList)
    },
    getLastDragEndIndex(): number {
      return this.lastDragEndIndex
    },
  },
  actions: {
    // 取消缓存的tab页签
    clearCacheTabs(): void {
      this.cacheTabList = new Set()
    },
    // 重置所有的状态
    resetState(): void {
      this.tabList = []
      this.clearCacheTabs()
    },
    // 根据当前打开的tab选项卡
    async updateCacheTab() {
      const cacheMap: Set<string> = new Set()

      for (const tab of this.tabList) {
        // 获取一级路由
        const item = getRawRoute(tab)
        const needCache = !item?.meta.ignoreKeepAlive
        if (!needCache) continue
        const name = item.name as string
        cacheMap.add(name)
      }
      this.cacheTabList = cacheMap
    },

    // 刷新tabs
    async refreshPage(router: Router) {
      const { currentRoute } = router
      const route = unref(currentRoute)

      const name = route.name

      const findTab = this.getCachedTabList.find(item => item === name)
      if (findTab) {
        this.cacheTabList.delete(findTab)
      }
      const redo = useRedo(router)
      await redo()
    },

    // 跳转页面
    goToPage(router: Router) {
      const go = useGo(router)
      const len = this.tabList.length
      const { path } = unref(router.currentRoute)

      let toPath: PageEnum | string = PageEnum.BASE_HOME
      if (len > 0) {
        const page = this.tabList[len - 1]
        const p = page.fullPath || page.path
        if (p) toPath = p
      }
      // 跳转到当前页面并报告一个错误
      path !== toPath && go(toPath as PageEnum, true)
    },

    // 添加tab页签
    async addTab(route: RouteLocationNormalized) {
      const { path, name, fullPath, params, query, meta } = getRawRoute(route)
      if (
        path === PageEnum.ERROR_PAGE ||
        path === PageEnum.BASE_HOME ||
        !name ||
        [REDIRECT_ROUTE.name, PAGE_NOT_FOUND_ROUTE.name].includes(name as string)
      ) {
        return
      }

      let updateIndex = -1

      // 判断页签是否已经添加
      const tabHasExits = this.tabList.some((tab, index) => {
        updateIndex = index
        return (tab.fullPath || tab.path) === (fullPath || path)
      })

      if (tabHasExits) {
        // 选项卡存在 进行更新
        const curTab = toRaw(this.tabList)[updateIndex]
        if (!curTab) return
        curTab.params = params || curTab.params
        curTab.query = query || curTab.query
        curTab.fullPath = fullPath || curTab.fullPath
        this.tabList.splice(updateIndex, 1, curTab)
      } else {
        // 选项卡不存在，新增

        // 获取动态路由打开数，超过 0 即代表需要控制打开数
        const dynamicLevel = meta?.dynamicLevel ?? -1
        if (dynamicLevel > 0) {
          // 如果动态路由层级大于 0 了，那么就要限制该路由的打开数限制了,获取真实路由
          const realPath = meta?.realPath ?? ''
          // 获取到已经打开的动态路由数, 判断是否大于某一个值
          if (
            this.tabList.filter(e => e.meta?.realPath ?? '' === realPath).length >= dynamicLevel
          ) {
            // 关闭第一个
            const index = this.tabList.findIndex(item => item.meta.realPath === realPath)
            index !== -1 && this.tabList.splice(index, 1)
          }
        }
        this.tabList.push(route)
      }
      this.updateCacheTab()
      cacheTab && Persistent.setLocal(MULTIPLE_TABS_KEY, this.tabList)
    },

    // 关闭 tab标签
    async closeTab(tab: RouteLocationNormalized, router: Router) {
      const close = (route: RouteLocationNormalized) => {
        const { fullPath, meta: { affix } = {} } = route
        if (affix) return
        const index = this.tabList.findIndex(item => item.fullPath === fullPath)
        index !== -1 && this.tabList.splice(index, 1)
      }

      const { currentRoute, replace } = router
      const { path } = unref(currentRoute)

      if (path !== tab.path) {
        close(tab)
        return
      }

      let toTarget: RouteLocationRaw = {}
      const index = this.tabList.findIndex(item => item.path === path)

      // 是否是最后一个页签
      if (index === 0) {
        // 只有一个选项卡，然后跳转到主页，否则跳转到右选项卡
        if (this.tabList.length === 1) {
          const userStore = useUserStore()
          toTarget = userStore.getUserInfo.homePath || PageEnum.BASE_HOME
        } else {
          const page = this.tabList[index + 1]
          toTarget = getToTarget(page)
        }
      } else {
        const page = this.tabList[index - 1]
        toTarget = getToTarget(page)
      }
      close(currentRoute.value)
      await replace(toTarget)
    },

    // 通过键 关闭tab标签
    async closeTabByKey(key: string, router: Router) {
      const index = this.tabList.findIndex(item => (item.fullPath || item.path) === key)
      if (index !== -1) {
        await this.closeTab(this.tabList[index], router)
        const { currentRoute, replace } = router
        // 当前路由是否存在于tabList中
        const isActivated = this.tabList.findIndex(item => {
          return item.fullPath === currentRoute.value.fullPath
        })

        // 如果当前路由不在tabList中，尝试切换到其他的路由
        if (isActivated === -1) {
          let pageIndex
          if (index > 0) {
            pageIndex = index - 1
          } else if (index < this.tabList.length - 1) {
            pageIndex = index + 1
          } else {
            pageIndex = -1
          }

          if (pageIndex >= 0) {
            const page = this.tabList[index - 1]
            const toTarget = getToTarget(page)
            await replace(toTarget)
          }
        }
      }
    },

    // 排序tab标签
    async sortTabs(oldIndex: number, newIndex: number) {
      const currentTab = this.tabList[oldIndex]
      this.tabList.splice(oldIndex, 1)
      this.tabList.splice(newIndex, 0, currentTab)
      this.lastDragEndIndex = this.lastDragEndIndex + 1
    },

    // 关闭右侧的标签
    async closeLeftTabs(route: RouteLocationNormalized, router: Router) {
      const index = this.tabList.findIndex(item => item.path === route.path)

      if (index > 0) {
        const leftTabs = this.tabList.splice(0, index)
        const pathList: string[] = []
        for (const item of leftTabs) {
          const affix = item?.meta?.affix ?? false
          if (!affix) {
            pathList.push(item.fullPath)
          }
        }
        this.bulkCloseTabs(pathList)
      }
      this.updateCacheTab()
      handleGoToPage(router)
    },

    // 关闭左侧的标签
    async closeRightTabs(route: RouteLocationNormalized, router: Router) {
      const index = this.tabList.findIndex(item => (item.fullPath = route.fullPath))

      if (index >= 0 && index < this.tabList.length - 1) {
        const rightTabs = this.tabList.splice(index + 1, this.tabList.length)
        const pathList: string[] = []
        for (const item of rightTabs) {
          const affix = item?.meta?.affix ?? false
          if (!affix) pathList.push(item.fullPath)
        }
        this.bulkCloseTabs(pathList)
      }
      this.updateCacheTab()
      handleGoToPage(router)
    },

    // 关闭所有的tabs
    async closeAllTab(router: Router) {
      this.tabList = this.tabList.filter(item => item?.meta?.affix ?? false)
      this.clearCacheTabs()
      this.goToPage(router)
    },

    // 关闭其他页签
    async closeOtherTabs(route: RouteLocationNormalized, router: Router) {
      const closePathList = this.tabList.map(item => item.fullPath)

      const pathList: string[] = []

      for (const path of closePathList) {
        if (path !== route.fullPath) {
          const closeItem = this.tabList.find(item => item.path === path)
          if (!closeItem) {
            continue
          }
          const affix = closeItem?.meta?.affix ?? false
          if (!affix) {
            pathList.push(closeItem.fullPath)
          }
        }
      }
      this.bulkCloseTabs(pathList)
      this.updateCacheTab()
      handleGoToPage(router)
    },

    // 批量关闭页签
    async bulkCloseTabs(pathList: string[]) {
      this.tabList = this.tabList.filter(item => !pathList.includes(item.fullPath))
    },

    // 设置页签标题
    async setTabTitle(title: string, route: RouteLocationNormalized) {
      const findTab = this.getTabList.find(item => item === route)
      if (findTab) {
        findTab.meta.title = title
        await this.updateCacheTab()
      }
    },

    // 替换tab路径
    async updateTabPath(fullPath: string, route: RouteLocationNormalized) {
      const findTab = this.getTabList.find(item => item === route)
      if (findTab) {
        findTab.fullPath = fullPath
        findTab.path = fullPath
        await this.updateCacheTab()
      }
    },
  },
})

export function useMultipleTabWithOutStore() {
  return useMultipleTabStore(store)
}
