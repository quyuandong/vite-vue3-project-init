<template>
  <div :class="prefixCls">
    <CollapseHeader v-bind="$props" :prefixCls="prefixCls" :show="show" @expand="handleExpand">
      <template #title>
        <slot name="title"></slot>
      </template>
      <template #action>
        <slot name="action"></slot>
      </template>
    </CollapseHeader>

    <div class="p-2">
      <CollapseTransition :enable="canExpan">
        <Skeleton v-if="loading" :active="loading" />
        <div :class="`${prefixCls}__body`" v-else v-show="show">
          <slot></slot>
        </div>
      </CollapseTransition>
    </div>
    <div :class="`${prefixCls}__footer`" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import type { PropType } from 'vue'
  import { ref } from 'vue'
  // component
  import { Skeleton } from 'ant-design-vue'
  import { CollapseTransition } from '/@/components/Transition'
  import CollapseHeader from './CollapseHeader.vue'
  import { triggerWindowResize } from '/@/utils/event'
  // hook
  import { useTimeoutFn } from '/@/hooks/core/useTimeout'
  import { useDesign } from '/@/hooks/web/useDesign'

  const props = defineProps({
    title: { type: String, default: '' },
    loading: { type: Boolean },
    // 是否可以扩展
    canExpan: { type: Boolean, default: true },
    // 在标题右侧的温馨提示
    helpMessage: {
      type: [Array, String] as PropType<string[] | string>,
      default: '',
    },
    // 是否触发窗口。 扩展和收缩时调整大小
    triggerWindowResize: { type: Boolean },
    // 延迟加载时间
    lazyTime: { type: Number, default: 0 },
  })

  const show = ref(true)

  const { prefixCls } = useDesign('collapse-container')

  /**
   * @description: Handling development events
   */
  function handleExpand() {
    show.value = !show.value
    if (props.triggerWindowResize) {
      // 200 milliseconds here is because the expansion has animation,
      useTimeoutFn(triggerWindowResize, 200)
    }
  }
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-collapse-container';

  .@{prefix-cls} {
    background-color: @component-background;
    border-radius: 2px;
    transition: all 0.3s ease-in-out;

    &__header {
      display: flex;
      height: 32px;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid @border-color-light;
    }

    &__footer {
      border-top: 1px solid @border-color-light;
    }

    &__action {
      display: flex;
      text-align: right;
      flex: 1;
      align-items: center;
      justify-content: flex-end;
    }
  }
</style>
