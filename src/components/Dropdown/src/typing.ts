export interface DropMenu {
  onClick?: Fn //点击事件
  to?: string //跳转地址
  icon?: string //图标
  event: string | number //菜单值
  text: string //菜单名字
  disabled?: boolean //是否可以用
  divider?: boolean //是否有分割线
  popConfirm?: PopConfirm
}

export interface PopConfirm {
  icon: string
  confirm: Fn
  cancel: Fn
}
