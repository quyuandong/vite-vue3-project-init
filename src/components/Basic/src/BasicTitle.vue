<template>
  <span :class="getClass">
    <slot></slot>
    <BasicHelp :class="`${prefixCls}-help`" v-if="helpMessage" :text="helpMessage" />
  </span>
</template>
<script lang="ts" setup>
  import { computed, PropType, useSlots } from 'vue'
  import { useDesign } from '/@/hooks/web/useDesign'
  import BasicHelp from './BasicHelp.vue'

  const props = defineProps({
    helpMessage: { type: [String, Array] as PropType<string | string[]>, default: '' }, // 帮助文本列表或字符串
    span: { type: Boolean }, //颜色块是否在标题的左侧
    normal: { type: Boolean }, // 是否将文本设置为默认值，即不加粗
  })

  const { prefixCls } = useDesign('basic-title')
  const slots = useSlots()
  // 获取样式
  const getClass = computed(() => [
    prefixCls,
    { [`${prefixCls}-show-span`]: props.span && slots.default },
    { [`${prefixCls}-normal`]: props.normal },
  ])
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-basic-title';

  .@{prefix-cls} {
    position: relative;
    display: flex;
    padding-left: 7px;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: @text-color-base;
    cursor: pointer;
    user-select: none;

    &-normal {
      font-size: 14px;
      font-weight: 500;
    }

    &-show-span::before {
      position: absolute;
      top: 4px;
      left: 0;
      width: 3px;
      height: 16px;
      margin-right: 4px;
      background-color: @primary-color;
      content: '';
    }

    &-help {
      margin-left: 10px;
    }
  }
</style>
