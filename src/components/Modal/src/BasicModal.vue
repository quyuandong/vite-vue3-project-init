<template>
  <Modal v-bind="getBindValue" @cancel="handleCancel">
    <!-- 关闭按钮 -->
    <template #closeIcon v-if="!$slots.closeIcon">
      <ModalClose
        :can-fullscreen="getProps.canFullscreen"
        :full-screen="fullScreenRef"
        @cancel="handleCancel"
        @fullscreen="handleFullScreen"
      />
    </template>
    <!-- 标题 -->
    <template #title v-if="!$slots.title">
      <ModalHeader
        :helpMessage="getProps.helpMessage"
        :title="getMergeProps.title"
        @dblclick="handleTitleDbClick"
      />
    </template>
    <!-- 底部按钮区域 -->
    <template #footer v-if="!$slots.footer">
      <ModalFooter v-bind="getBindValue" @ok="handleOk" @cancel="handleCancel">
        <template #[item]="data" v-for="item in Object.keys($slots)">
          <slot :name="item" v-bind="data || {}"></slot>
        </template>
      </ModalFooter>
    </template>
    <!-- 中间区域 -->
    <ModalWrapper
      :useWrapper="getProps.useWrapper"
      :footerOffset="wrapperFooterOffset"
      :fullScreen="fullScreenRef"
      ref="modalWrapperRef"
      :loading="getProps.loading"
      :loading-tip="getProps.loadingTip"
      :minHeight="getProps.minHeight"
      :height="getWrapperHeight"
      :visible="visibleRef"
      :modalFooterHeight="footer !== undefined && !footer ? 0 : undefined"
      v-bind="omit(getProps.wrapperProps, 'visible', 'height', 'modalFooterHeight')"
      @ext-height="handleExtHeight"
      @height-change="handleHeightChange"
    >
      <slot></slot>
    </ModalWrapper>

    <!-- 其他插槽 -->
    <template #[item]="data" v-for="item in Object.keys(omit($slots, 'default'))">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </Modal>
</template>
<script lang="ts">
  import {
    computed,
    defineComponent,
    getCurrentInstance,
    nextTick,
    ref,
    toRef,
    unref,
    watch,
    watchEffect,
  } from 'vue'
  import { basicProps } from './props'

  import Modal from './components/Modal'
  import { ModalMethods, ModalProps } from './typing'
  import { useDesign } from '/@/hooks/web/useDesign'
  import { useFullScreen } from './hooks/useModalFullScreen'
  import { omit } from 'lodash-es'
  import { isFunction } from '/@/utils/is'
  import { deepMerge } from '/@/utils'
  import ModalClose from './components/ModalClose.vue'
  import ModalWrapper from './components/ModalWrapper.vue'
  import ModalFooter from './components/ModalFooter.vue'
  import ModalHeader from './components/ModalHeader.vue'

  export default defineComponent({
    name: 'BasicModal',
    components: { Modal, ModalClose, ModalWrapper, ModalFooter, ModalHeader },
    inheritAttrs: false,
    props: basicProps,
    emits: ['visible-change', 'height-change', 'cancel', 'ok', 'register', 'update:visible'],
    setup(props, { emit, attrs }) {
      const visibleRef = ref(false)
      const propsRef = ref<Partial<ModalProps> | null>(null)
      const modalWrapperRef = ref<any>(null)
      const { prefixCls } = useDesign('basic-modal')

      const extHeightRef = ref(0)
      // 弹框的方法
      const modalMethods: ModalMethods = {
        setModalProps,
        emitVisible: undefined,
        redoModalHeight: () => {
          nextTick(() => {
            if (unref(modalWrapperRef)) {
              ;(unref(modalWrapperRef) as any).setModalHeight()
            }
          })
        },
      }

      const instance = getCurrentInstance()
      if (instance) {
        emit('register', modalMethods, instance.uid)
      }

      // 获取合并后的参数
      const getMergeProps = computed((): Recordable => {
        return {
          ...props,
          ...(unref(propsRef) as any),
        }
      })

      // 全屏
      const { handleFullScreen, getWrapClassName, fullScreenRef } = useFullScreen({
        modalWrapperRef,
        extHeightRef,
        wrapClassName: toRef(getMergeProps.value, 'wrapClassName'),
      })

      // 不需要标题和确定按钮的弹框组件
      const getProps = computed((): Recordable => {
        const opt = {
          ...unref(getMergeProps),
          visible: unref(visibleRef),
          okButtonProps: undefined,
          cancelButtonProps: undefined,
          title: undefined,
        }
        return {
          ...opt,
          wrapClassName: unref(getWrapClassName),
        }
      })

      // 获取绑定的值
      const getBindValue = computed((): Recordable => {
        const attr = {
          ...attrs,
          ...unref(getMergeProps),
          visible: unref(visibleRef),
          wrapClassName: unref(getWrapClassName),
        }
        if (unref(fullScreenRef)) {
          // 全屏  去掉高度 和 标题
          return omit(attr, ['height', 'title'])
        }
        return omit(attr, 'title')
      })

      // 获取容器高度
      const getWrapperHeight = computed(() => {
        if (unref(fullScreenRef)) return undefined
        return unref(getProps).height
      })

      // 监控全屏 和是否可见
      watchEffect(() => {
        visibleRef.value = !!props.visible
        fullScreenRef.value = !!props.defaultFullscreen
      })

      // 监听是否显示
      watch(
        () => unref(visibleRef),
        v => {
          emit('visible-change', v)
          emit('update:visible', v)
          instance && modalMethods.emitVisible?.(v, instance.uid)
          nextTick(() => {
            if (props.scrollTop && v && unref(modalWrapperRef)) {
              ;(unref(modalWrapperRef) as any).scrollTop()
            }
          })
        },
        { immediate: true },
      )

      // 取消事件
      async function handleCancel(e: Event) {
        e.stopPropagation()
        // 过滤自定义关闭按钮的空白区域
        if ((e.target as HTMLElement)?.classList?.contains(prefixCls + '-close--custom')) return
        if (props.closeFunc && isFunction(props.closeFunc)) {
          const isClose: boolean = await props.closeFunc()
          visibleRef.value = !isClose
          return
        }
        visibleRef.value = false
        emit('cancel', e)
      }

      // 设置modal参数
      function setModalProps(props: Partial<ModalProps>): void {
        propsRef.value = deepMerge(unref(propsRef) || ({} as any), props)
        if (Reflect.has(props, 'visible')) {
          visibleRef.value = !!props.visible
        }
        if (Reflect.has(props, 'defaultFullscreen')) {
          fullScreenRef.value = !!props.defaultFullscreen
        }
      }

      // 点击确认
      function handleOk(e: Event) {
        emit('ok', e)
      }
      // 高度改变
      function handleHeightChange(height: string) {
        emit('height-change', height)
      }
      // 退出的高度
      function handleExtHeight(height: number) {
        extHeightRef.value = height
      }
      // 标题双击
      function handleTitleDbClick(e) {
        if (!props.canFullscreen) return
        e.stopPropagation()
        handleFullScreen(e)
      }

      return {
        handleCancel,
        getBindValue,
        getProps,
        handleFullScreen,
        fullScreenRef,
        getMergeProps,
        handleOk,
        visibleRef,
        omit,
        modalWrapperRef,
        handleExtHeight,
        handleHeightChange,
        handleTitleDbClick,
        getWrapperHeight,
      }
    },
  })
</script>
