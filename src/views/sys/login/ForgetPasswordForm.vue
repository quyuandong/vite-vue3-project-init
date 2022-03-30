<template>
  <template v-if="getShow">
    <LoginFormTitle />
    <Form :model="formData" :rules="getFormRules" ref="formRef" class="enter-x p-4">
      <FormItem name="account" class="enter-x">
        <Input v-model:value="formData.account" placeholder="账号" size="large" />
      </FormItem>
      <FormItem name="mobile" class="enter-x">
        <Input size="large" v-model:value="formData.mobile" placeholder="手机号" />
      </FormItem>
      <FormItem name="sms" class="enter-x">
        <CountdownInput size="large" v-model:value="formData.sms" placeholder="短信验证码" />
      </FormItem>
      <FormItem>
        <Button type="primary" size="large" block @click="handleReset" :loading="loading">
          重置
        </Button>
        <Button block @click="handleBackLogin" class="mt-4"> 返回 </Button>
      </FormItem>
    </Form>
  </template>
</template>
<script lang="ts" setup>
  import LoginFormTitle from './LoginFormTitle.vue'
  import { Form, Input, Button } from 'ant-design-vue'
  import { CountdownInput } from '/@/components/CountDown'
  import { computed, reactive, ref, unref } from 'vue'
  import { LoginStateEnum, useFormRules, useLoginState } from './useLogin'

  const FormItem = Form.Item

  const { getFormRules } = useFormRules()
  const { getLoginState, handleBackLogin } = useLoginState()

  const formRef = ref()
  const loading = ref(false)

  const formData = reactive({
    account: '',
    mobile: '',
    sms: '',
  })

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.RESET_PASSWORD)

  // 重置表单
  async function handleReset() {
    const form = unref(formRef)
    if (!form) return
    await form.resetFields()
  }
</script>
