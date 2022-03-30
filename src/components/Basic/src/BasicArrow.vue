<!--
  带有动画的箭头组件
-->
<template>
  <span :class="getClass">
    <Icon icon="ion:chevron-forward" :style="$attrs.iconStyle" />
  </span>
</template>
<script lang="ts" setup>
  import { computed } from 'vue'
  import { Icon } from '/@/components/Icon'
  import { useDesign } from '/@/hooks/web/useDesign'

  const props = defineProps({
    expand: { type: Boolean }, //箭头是否缩放
    up: { type: Boolean }, //箭头默认向上
    down: { type: Boolean }, //箭头默认向下
    inset: { type: Boolean }, //是否取消内联样式（padding/margin）
  })

  const { prefixCls } = useDesign('basic-arrow')

  // 获取样式
  const getClass = computed(() => {
    const { expand, up, down, inset } = props
    return [
      prefixCls,
      {
        [`${prefixCls}--active`]: expand,
        up,
        inset,
        down,
      },
    ]
  })
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-basic-arrow';

  .@{prefix-cls} {
    display: inline-block;
    cursor: pointer;
    transform: rotate(0deg);
    transition: all 0.3s ease 0.1s;
    transform-origin: center center;

    &--active {
      transform: rotate(90deg);
    }

    &.inset {
      line-height: 0px;
    }

    &.up {
      transform: rotate(-90deg);
    }

    &.down {
      transform: rotate(90deg);
    }

    &.up.@{prefix-cls}--active {
      transform: rotate(90deg);
    }

    &.down.@{prefix-cls}--active {
      transform: rotate(-90deg);
    }
  }
</style>
