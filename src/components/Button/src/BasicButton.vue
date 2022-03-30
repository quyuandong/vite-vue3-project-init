<template>
  <Button v-bind="getBindValue" :class="getButtonClass" @click="onClick">
    <template #default="data">
      <Icon :icon="preIcon" v-if="preIcon" :size="iconSize" />
      <slot v-bind="data || {}"></slot>
      <Icon :icon="postIcon" v-if="postIcon" :size="iconSize" />
    </template>
  </Button>
</template>
<script lang="ts">
  // @ts-ignore
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'AButton',
    inheritAttrs: false,
  })
</script>

<script lang="ts" setup>
  import { computed, unref } from 'vue'
  import { buttonProps } from './props'
  import { useAttrs } from '/@/hooks/core/useAttrs'
  import { Button } from 'ant-design-vue'
  import Icon from '/@/components/Icon/src/Icon.vue'
  const props = defineProps(buttonProps)

  // 获取所有的attrs 包括 样式
  const attrs = useAttrs({ excludeDefaultKeys: false })

  // 获取按钮的样式
  const getButtonClass = computed(() => {
    const { color, disabled } = props
    return [
      {
        [`ant-btn-${color}`]: !!color,
        ['is-disabled']: disabled,
      },
    ]
  })

  // 获取继承绑定值
  const getBindValue = computed(() => ({ ...unref(attrs), ...props }))
</script>
