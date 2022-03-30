/**
 * 消息提示组件
 */

import type { ModalFunc, ModalFuncProps } from 'ant-design-vue/lib/modal/Modal'
import { InfoCircleFilled, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons-vue'
import { Modal, message as Message, notification } from 'ant-design-vue'
import { isString } from '/@/utils/is'
import { ConfigProps, NotificationArgsProps } from 'ant-design-vue/lib/notification'

//  定义图标类型
export interface ModalOptionsEx extends Omit<ModalFuncProps, 'iconType'> {
  iconType: 'warning' | 'success' | 'error' | 'info'
}

export type ModalOptionsPartial = Partial<ModalOptionsEx> & Pick<ModalOptionsEx, 'content'>

// 定义confirm接口参数
interface ConfirmOptions {
  info: ModalFunc
  success: ModalFunc
  error: ModalFunc
  warn: ModalFunc
  warning: ModalFunc
}
// 定义消息通知对外api
export interface NotifyApi {
  info(config: NotificationArgsProps): void
  success(config: NotificationArgsProps): void
  error(config: NotificationArgsProps): void
  warn(config: NotificationArgsProps): void
  warning(config: NotificationArgsProps): void
  open(args: NotificationArgsProps): void
  close(key: String): void
  config(options: ConfigProps): void
  destroy(): void
}

/**
 * 获取渲染展示的内容
 * @param param0 配置项
 * @returns 返回修改后的内容详情
 */
function renderContent({ content }: Pick<ModalOptionsEx, 'content'>) {
  if (isString(content)) {
    return <div innerHTML={`<div>${content}</div>`}></div>
  } else {
    return content
  }
}

/**
 * 获取弹框的基本配置
 * @returns 返回弹框的基本配置
 */
const getBaseOptions = () => {
  return {
    okText: '确认',
    centered: true,
  }
}

/**
 * 获取图标
 * @param iconType 图标类型
 * @returns 返回对应的图标
 */
function getIcon(iconType: string) {
  switch (iconType) {
    case 'warning':
      return <InfoCircleFilled class="modal-icon-warning" />
    case 'success':
      return <CheckCircleFilled class="modal-icon-success" />
    case 'info':
      return <InfoCircleFilled class="modal-icon-info" />
    default:
      return <CloseCircleFilled class="modal-icon-error" />
  }
}

/**
 * 创建弹框参数主函数
 * @param options 参数
 * @param icon 图标
 * @returns 返回参数
 */
function createModalOptions(options: ModalOptionsPartial, icon: string): ModalOptionsPartial {
  return {
    ...getBaseOptions(),
    ...options,
    content: renderContent(options),
    icon: getIcon(icon),
  }
}

// 创建 成功弹框
function createSuccessModal(options: ModalOptionsPartial) {
  return Modal.success(createModalOptions(options, 'success'))
}
// 创建 错误弹框
function createErrorModal(options: ModalOptionsPartial) {
  return Modal.error(createModalOptions(options, 'close'))
}
// 创建 消息弹框
function createInfoModal(options: ModalOptionsPartial) {
  return Modal.info(createModalOptions(options, 'info'))
}
// 创建 警告弹框
function createWarningModal(options: ModalOptionsPartial) {
  return Modal.warning(createModalOptions(options, 'warning'))
}

// 创建确认弹框
function createConfirm(options: ModalOptionsEx): ConfirmOptions {
  const iconType = options.iconType || 'warning'
  Reflect.deleteProperty(options, 'iconType')
  const opt: ModalOptionsEx = {
    centered: true,
    icon: getIcon(iconType),
    ...options,
    content: renderContent(options),
  }
  return Modal.confirm(opt) as unknown as ConfirmOptions
}
// 配置消息通知的参数  右上 3s
notification.config({
  placement: 'topRight',
  duration: 3,
})

/**
 * 导出常用的 消息提示弹框
 * @returns
 */
export function useMessage() {
  return {
    createMessage: Message,
    notification: notification as NotifyApi,
    createConfirm,
    createSuccessModal,
    createWarningModal,
    createErrorModal,
    createInfoModal,
  }
}
