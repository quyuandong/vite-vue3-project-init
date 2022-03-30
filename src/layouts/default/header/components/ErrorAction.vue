<template>
  <Tooltip title="错误日志" placement="bottom" :mouse-enter-delay="0.5" @click="handleToErrorList">
    <Badge :count="getCount" :offset="[0, 10]" :overflow-count="99">
      <Icon icon="ion:bug-outline" />
    </Badge>
  </Tooltip>
</template>
<script lang="ts">
  import { Badge, Tooltip } from 'ant-design-vue'
  import { computed, defineComponent } from 'vue'
  import { useRouter } from 'vue-router'
  import Icon from '/@/components/Icon'
  import { PageEnum } from '/@/enums/pageEnum'
  import { useErrorLogStore } from '/@/store/modules/errorLog'

  export default defineComponent({
    name: 'ErrorAction',
    components: { Icon, Tooltip, Badge },
    setup() {
      const { push } = useRouter()
      const errorLogStore = useErrorLogStore()
      const getCount = computed(() => errorLogStore.getErrorLogListCount)

      function handleToErrorList() {
        push(PageEnum.ERROR_LOG_PAGE).then(() => {
          errorLogStore.setErrorLogListCount(0)
        })
      }

      return {
        getCount,
        handleToErrorList,
      }
    },
  })
</script>
