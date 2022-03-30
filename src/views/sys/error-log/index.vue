<template>
  <div class="p-4">
    <DetailModal :info="rowInfo" @register="registerModal" />
    <!-- 表格顶部右侧区域 -->
    <BasicTable @register="register" @row-dbClick="handleDbClick" class="error-handle-table">
      <template #toolbar>
        <a-button type="primary" @click="fireVueError">点击触发vue错误</a-button>
      </template>
      <template #action="{ record }">
        <TableAction :actions="[{ label: '详情', onClick: handleDetail.bind(null, record) }]" />
      </template>
    </BasicTable>
  </div>
</template>

<script lang="ts" setup>
  import { cloneDeep } from 'lodash-es'
  import { nextTick, ref, watch } from 'vue'
  import { getColumns } from './data'
  import { ErrorLogInfo } from '/#/store'
  import { useModal } from '/@/components/Modal'
  import { BasicTable, useTable, TableAction } from '/@/components/Table/index'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { useErrorLogStore } from '/@/store/modules/errorLog'

  import DetailModal from './DetailModal.vue'

  const rowInfo = ref<ErrorLogInfo>()
  const errorLogStore = useErrorLogStore()

  const [register, { setTableData }] = useTable({
    title: '错误日志列表',
    columns: getColumns(),
    titleHelpMessage: '温馨提醒',
    bordered: true,
    tableSetting: { fullScreen: true },
    actionColumn: {
      width: 80,
      title: 'Action',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  })

  const [registerModal, { openModal }] = useModal()

  watch(
    () => errorLogStore.getErrorLogInfoList,
    list => {
      nextTick(() => {
        setTableData(cloneDeep(list))
      })
    },
    {
      immediate: true,
    },
  )

  const { createMessage } = useMessage()

  if (import.meta.env.DEV) {
    createMessage.info('只在`/src/settings/projectSetting.ts` 内的useErrorHandle=true时生效.')
  }

  function handleDetail(row: ErrorLogInfo) {
    rowInfo.value = row
    openModal(true)
  }

  function handleDbClick(record) {
    rowInfo.value = record
    openModal(true)
  }

  function fireVueError() {
    throw new Error('fire vue error!')
  }
</script>

<style scoped lang="less"></style>
