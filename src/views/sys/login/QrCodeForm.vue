<template>
  <template v-if="getShow">
    <LoginFormTitle />
    <div class="enter-x min-w-64 min-h-64">
      <QrCode
        :value="qrCodeUrl"
        :logo="selfLogo"
        class="enter-x flex justify-center xl:justify-start"
        :width="280"
      />
      <Divider class="enter-x">扫码后点击"确认"，即可完成登陆</Divider>
      <Button size="large" block class="mt-4 enter-x" @click="handleBackLogin"> 返回 </Button>
    </div>
  </template>
</template>
<script lang="ts" setup>
  import { computed, unref } from 'vue'
  import { Divider, Button } from 'ant-design-vue'
  import { LoginStateEnum, useLoginState } from './useLogin'
  import LoginFormTitle from './LoginFormTitle.vue'
  import { LogoType, QrCode } from '/@/components/Qrcode'

  const qrCodeUrl = 'https://www.baidu.com'

  const { handleBackLogin, getLoginState } = useLoginState()

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.QR_CODE)
  const selfLogo: LogoType = {
    src: 'http://m.imeitou.com/uploads/allimg/2019111010/zd0rxuqkrea.jpeg',
    logoSize: 0.15,
    bgColor: '#ffffff',
    borderSize: 0.05,
    borderRadius: 10,
    logoRadius: 0,
    borderColor: '',
    crossOrigin: '',
  }
</script>
