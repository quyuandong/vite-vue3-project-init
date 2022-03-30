<template>
  <Drawer :class="prefixCls" @close="onClose" v-bind="getBindValues">
    <template #title v-if="!$slots.title">
      <!-- 头部 -->
      <DrawerHeader
        :title="getMergeProps.title"
        :is-detail="isDetail"
        :show-detail-back="showDetailBack"
        @close="onClose"
      >
        <template #titleToolbar>
          <slot name="titleToolbar"></slot>
        </template>
      </DrawerHeader>
    </template>
    <template v-else #title>
      <slot name="title"></slot>
    </template>

    <!-- 中间滚动区域 -->
    <ScrollContainer
      :style="getScrollContentStyle"
      v-loading="getLoading"
      :loading-tip="loadingText || '加载中...'"
    >
      <slot></slot>
    </ScrollContainer>

    <!-- 底部按钮区域 -->
    <DrawerFooter v-bind="getProps" @close="onClose" @ok="handleOk" :height="getFooterHeight">
      <template #[item]="data" v-for="item in Object.keys($slots)">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </DrawerFooter>
  </Drawer>
</template>
<script lang="ts">
  import {
    computed,
    defineComponent,
    getCurrentInstance,
    ref,
    unref,
    toRaw,
    CSSProperties,
    watch,
    nextTick,
  } from 'vue'
  import { Drawer } from 'ant-design-vue'
  import { basicProps } from './props'
  import { DrawerInstance, DrawerProps } from './typing'
  import { useAttrs } from '/@/hooks/core/useAttrs'
  import { useDesign } from '/@/hooks/web/useDesign'
  import { deepMerge } from '/@/utils'
  import { isFunction, isNumber } from '/@/utils/is'
  import DrawerHeader from './components/DrawerHeader.vue'
  import DrawerFooter from './components/DrawerFooter.vue'
  import { ScrollContainer } from '/@/components/Container'

  export default defineComponent({
    name: 'BasicDrawer',
    components: { Drawer, DrawerHeader, DrawerFooter, ScrollContainer },
    inheritAttrs: false,
    props: basicProps,
    emits: ['visible-change', 'ok', 'close', 'register'],
    setup(props, { emit }) {
      const visibleRef = ref(false)
      const attrs = useAttrs()
      const propsRef = ref<Partial<Nullable<DrawerProps>>>(null)

      const { prefixCls, prefixVar } = useDesign('basic-drawer')

      // 设置抽屉产出
      function setDrawerProps(props: Partial<DrawerProps>): void {
        propsRef.value = deepMerge(unref(propsRef) || ({} as any), props)
        if (Reflect.has(props, 'visible')) {
          visibleRef.value = !!props.visible
        }
      }
      // 获取抽屉实例
      const drawerInstance: DrawerInstance = {
        setDrawerProps: setDrawerProps,
        emitVisible: undefined,
      }
      // 获取当实例，并进行注册
      const instance = getCurrentInstance()
      instance && emit('register', drawerInstance, instance.uid)
      // 获取合并后的传参props
      const getMergeProps = computed((): DrawerProps => {
        return deepMerge(toRaw(props), unref(propsRef))
      })
      // 获取传递的参数props
      const getProps = computed((): DrawerProps => {
        const opt = {
          placement: 'right',
          ...unref(attrs),
          ...unref(getMergeProps),
          visible: unref(visibleRef),
        }
        opt.title = undefined
        const { isDetail, width, wrapClassName, getContainer } = opt
        if (isDetail) {
          if (!width) {
            opt.width = '100%'
          }
          const detailCls = `${prefixCls}__detail`
          opt.wrapClassName = wrapClassName ? `${wrapClassName} ${detailCls}` : detailCls

          if (!getContainer) {
            opt.getContainer = `.${prefixVar}-layout-content` as any
          }
        }

        return opt as DrawerProps
      })
      // 获取所有要绑定的值
      const getBindValues = computed((): DrawerProps => {
        return {
          ...attrs,
          ...unref(getProps),
        }
      })
      // 自定义实现底部按钮
      const getFooterHeight = computed(() => {
        const { footerHeight, showFooter } = unref(getProps)
        if (showFooter && footerHeight) {
          return isNumber(footerHeight)
            ? `${footerHeight}px`
            : `${footerHeight.replace('px', '')}px`
        }
        return `0px`
      })

      // 获取滚动区域样式
      const getScrollContentStyle = computed((): CSSProperties => {
        const footerHeight = unref(getFooterHeight)
        return {
          position: 'relative',
          height: `calc(100% - ${footerHeight})`,
        }
      })

      // 获取加载动画
      const getLoading = computed(() => {
        return !!unref(getProps)?.loading
      })

      watch(
        () => props.visible,
        (newVal, oldVal) => {
          if (newVal !== oldVal) visibleRef.value = newVal
        },
        { deep: true },
      )

      watch(
        () => visibleRef.value,
        visible => {
          nextTick(() => {
            emit('visible-change', visible)
            instance && drawerInstance.emitVisible?.(visible, instance.uid)
          })
        },
      )

      // 关闭
      async function onClose(e: Recordable) {
        const { closeFunc } = unref(getProps)
        emit('close', e)
        if (closeFunc && isFunction(closeFunc)) {
          const res = await closeFunc()
          visibleRef.value = !res
          return
        }
        visibleRef.value = false
      }

      function handleOk() {
        emit('ok')
      }

      return {
        prefixCls,
        onClose,
        getMergeProps: getMergeProps as any,
        getScrollContentStyle,
        getProps: getProps as any,
        getLoading,
        getBindValues,
        getFooterHeight,
        handleOk,
      }
    },
  })
</script>
