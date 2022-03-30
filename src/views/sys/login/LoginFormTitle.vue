<template>
  <h2 class="mb-3 text-2xl font-bold text-center xl:text-3xl xl:text-left enter-x">
    {{ getFormTitle }}
  </h2>
</template>
<script lang="ts" setup>
  import { computed, unref } from 'vue'
  import { LoginStateEnum, useLoginState } from './useLogin'

  const { getLoginState } = useLoginState()

  const getFormTitle = computed(() => {
    const titleObj = {
      [LoginStateEnum.LOGIN]: '登陆',
      [LoginStateEnum.REGISTER]: '注册',
      [LoginStateEnum.MOBILE]: '手机登陆',
      [LoginStateEnum.QR_CODE]: '二维码登陆',
      [LoginStateEnum.RESET_PASSWORD]: '重置密码',
    }
    return titleObj[unref(getLoginState)]
  })
</script>
