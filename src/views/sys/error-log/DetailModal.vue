<template>
  <BasicModal :width="800" title="详情" v-bind="$attrs">
    <Description :data="info" @register="register" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal } from '/@/components/Modal'
  import { Description, useDescription } from '/@/components/Description'
  import { ErrorLogInfo } from '/#/store'
  import { getDescSchema } from './data'

  defineProps({
    info: { type: Object as PropType<ErrorLogInfo>, default: null },
  })

  const [register] = useDescription({
    column: 2,
    schema: getDescSchema(),
  })
</script>

<style scoped lang="less"></style>
