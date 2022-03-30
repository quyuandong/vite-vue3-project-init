/**
 * 仓库相关的类型定义
 */

import { ErrorTypeEnum } from '/@/enums/exceptionEnum'
import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum'

// 用户信息
export interface UserInfo {
  userId: string | number // 用户id
  username: string // 用户名
  realName: string // 真实姓名
  avatar: string // 头像
  desc?: string // 介绍
  homePath?: string
  roles: RoleInfo[] //角色
}

// 角色信息定义
export interface RoleInfo {
  roleName: string
  value: string
}

// 当窗口缩小时，记住一些状态，并在窗口恢复时恢复这些状态
export interface BeforeMiniState {
  menuCollapsed?: boolean // 是否折叠
  menuSplit?: boolean //是否拆分
  menuMode?: MenuModeEnum // 菜单模式
  menuType?: MenuTypeEnum // 菜单类型
}

// 锁屏信息
export interface LockInfo {
  pwd?: string | undefined // 密码
  isLock?: boolean // 是否是锁屏
}

// 错误日志
export interface ErrorLogInfo {
  type: ErrorTypeEnum // 错误类型
  file: string // 错误文件
  name?: string // 错误名字
  message: string // 错误消息
  stack?: string // 错误堆栈
  detail: string // 错误详情
  url: string // 错误的url
  time?: string // 错误时间
}
