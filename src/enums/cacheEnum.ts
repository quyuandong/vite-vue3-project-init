/**
 * 缓存相关的枚举及常量
 */

// 缓存类型
export enum CacheTypeEnum {
  SESSION,
  LOCAL,
}

// 项目配置 主键
export const PROJ_CFG_KEY = 'PROJ_CGH_KEY'

// token 主键
export const TOKEN_KEY = 'TOKEN_KEY'

// locale 主键
export const LOCALE_KEY = 'LOCALE_KEY'

// 用户信息 主键
export const USER_INFO_KEY = 'USER_INFO_KEY'

// 角色信息 主键
export const ROLES_KEY = 'ROLES_KEY'

// 锁屏信息 主键
export const LOCK_INFO_KEY = 'LOCK_INFO_KEY'

// 多页签 主键
export const MULTIPLE_TABS_KEY = 'MULTIPLE_TABS_KEY'

//主题模式  主键
export const APP_DARK_MODE_KEY = 'APP_DARK_MODE_KEY'

// 基础的localStorage 主键
export const APP_LOCAL_CACHE_KEY = 'COMMON_LOCAL_KEY'

// 基础的sessionStorage 主键
export const APP_SESSION_CACHE_KEY = 'COMMON_SESSION_KEY'
