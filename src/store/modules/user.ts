import { defineStore } from 'pinia'
import { UserInfo } from '/#/store'
import { store } from '/@/store'
import { RoleEnum } from '/@/enums/roleEnum'
import { getAuthCache, setAuthCache } from '/@/utils/auth'
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '/@/enums/cacheEnum'
import { router } from '/@/router'
import { PageEnum } from '/@/enums/pageEnum'
import { useMessage } from '/@/hooks/web/useMessage'
import { h } from 'vue'
import { doLogout, getUserInfo, loginApi } from '/@/api/sys/user'
import { GetUserInfoModel, LoginParams } from '/@/api/sys/model/userModel'
import { ErrorMessageMode } from '/#/axios'
import { isArray } from '/@/utils/is'
import { usePermissionStore } from './permission'
import { RouteRecordRaw } from 'vue-router'
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic'
/**
 * 用户信息相关 仓库
 */
interface UserState {
  userInfo: Nullable<UserInfo> // 用户信息
  token?: string // token
  roleList: RoleEnum[] // 角色列表
  sessionTimeout?: boolean // 登陆是否过期
  lastUpdateTime: number // 最后获取时间
}
export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    userInfo: null,
    token: undefined,
    roleList: [],
    sessionTimeout: false,
    lastUpdateTime: 0,
  }),
  getters: {
    // 获取用户信息
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {}
    },
    // 获取token信息
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY)
    },
    // 获取角色列表
    getRoleList(): RoleEnum[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY)
    },
    // 获取登陆是否过期（绘画）
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout
    },
    // 获取最后登陆时间
    getLastUpdateTime(): number {
      return this.lastUpdateTime
    },
  },
  actions: {
    // 设置token
    setToken(token: string | undefined) {
      this.token = token ? token : ''
      setAuthCache(TOKEN_KEY, token)
    },
    // 设置角色
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList
      setAuthCache(ROLES_KEY, roleList)
    },
    // 设置用户信息
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info
      this.lastUpdateTime = new Date().getTime()
      setAuthCache(USER_INFO_KEY, info)
    },
    // 设置登陆过期凭证
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag
    },
    // 重置所有的状态
    resetState() {
      this.userInfo = null
      this.token = ''
      this.roleList = []
      this.sessionTimeout = false
    },

    /**
     * 登陆方法
     * @param params 登陆参数
     * @returns
     */
    async login(
      params: LoginParams & {
        goHome?: boolean
        mode?: ErrorMessageMode
      },
    ): Promise<GetUserInfoModel | null> {
      const { goHome = true, mode, ...loginParams } = params
      const { token } = await loginApi(loginParams, mode)
      this.setToken(token)
      return this.afterLoginAction(goHome)
    },

    /**
     * 登陆之后的动作
     * @param goHome 是否直接跳转首页
     * @returns
     */
    async afterLoginAction(goHome?: boolean): Promise<GetUserInfoModel | null> {
      if (!this.getToken) return null
      // 获取用户信息
      const userInfo = await this.getUserInfoAction()
      const sessionTimeout = this.sessionTimeout
      if (sessionTimeout) {
        this.setSessionTimeout(false)
      } else {
        const permissionStore = usePermissionStore()
        // 是否动态添加路由
        if (!permissionStore.isDynamicAddedRoute) {
          // 自己构建路由
          const routes = await permissionStore.buildRoutesAction()
          routes.forEach(route => {
            router.addRoute(route as unknown as RouteRecordRaw)
          })
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw)
          permissionStore.setDynamicAddedRoute(true)
        }
        goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME))
      }
      return userInfo
    },

    /**
     * 获取用户信息的动作
     * @returns 返回用户信息
     */
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken) return null
      const userInfo = await getUserInfo()
      const { roles = [] } = userInfo
      if (isArray(roles)) {
        const roleList = roles.map(item => item.value as RoleEnum)
        this.setRoleList(roleList)
      } else {
        userInfo.roles = []
        this.setRoleList([])
      }
      this.setUserInfo(userInfo)
      return userInfo
    },

    /**
     * 退出登陆
     * @param goLogin 是否到登陆页面
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          await doLogout()
        } catch {
          console.log('注销Token失败')
        }
      }
      this.setToken(undefined)
      this.setSessionTimeout(false)
      this.setUserInfo(null)
      goLogin && router.push(PageEnum.BASE_LOGIN)
    },

    /**
     * 是否确认退出系统
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage()
      createConfirm({
        iconType: 'warning',
        title: () => h('span', '温馨提示'),
        content: () => h('span', '是否确认退出系统'),
        onOk: async () => {
          await this.logout(true)
        },
      })
    },
  },
})

// 需要在设置之之外使用
export function useUserStoreWithOut() {
  return useUserStore(store)
}
