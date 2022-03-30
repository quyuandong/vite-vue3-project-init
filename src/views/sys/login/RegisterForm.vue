<template>
  <template v-if="getShow">
    <LoginFormTitle />
    <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <FormItem name="account" class="enter-x">
        <Input
          class="fix-auto-fill"
          size="large"
          v-model:value="formData.account"
          placeholder="账号"
        />
      </FormItem>
      <FormItem name="mobile" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.mobile"
          placeholder="手机号码"
          class="fix-auto-fill"
        />
      </FormItem>
      <FormItem>
        <StrengthMeter size="large" v-model:value="formData.password" placeholder="密码" />
      </FormItem>
      <FormItem name="confirmPassword" class="enter-x">
        <InputPassword
          size="large"
          visibilityToggle
          v-model:value="formData.confirmPassword"
          placeholder="确认密码"
        />
      </FormItem>
      <FormItem name="sms" class="enter-x">
        <CountdownInput
          size="large"
          class="fix-auto-fill"
          v-model:value="formData.sms"
          placeholder="短信验证码"
        />
      </FormItem>
      <FormItem class="enter-x" name="policy">
        <Checkbox v-model:checked="formData.policy" size="small"> 我同意***隐私政策 </Checkbox>
      </FormItem>

      <Button
        type="primary"
        class="enter-x"
        size="large"
        block
        @click="handleRegister"
        :loading="loading"
      >
        注册
      </Button>
      <Button size="large" block class="mt-4 enter-x" @click="handleBackLogin"> 返回 </Button>
    </Form>
  </template>
</template>
<script lang="ts" setup>
  import { Form, Input, Button, Checkbox } from 'ant-design-vue'
  import { computed, reactive, ref, unref } from 'vue'
  import { LoginStateEnum, useFormRules, useFormValid, useLoginState } from './useLogin'
  import LoginFormTitle from './LoginFormTitle.vue'
  import { CountdownInput } from '/@/components/CountDown'
  import { StrengthMeter } from '/@/components/StrengthMeter'

  const FormItem = Form.Item
  const InputPassword = Input.Password

  const { handleBackLogin, getLoginState } = useLoginState()

  const formRef = ref()
  const loading = ref(false)

  const formData = reactive({
    account: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    sms: '',
    policy: false,
  })

  const { getFormRules } = useFormRules()
  const { validForm } = useFormValid(formRef)

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.REGISTER)

  async function handleRegister() {
    const data = await validForm()
    if (!data) return
  }
</script>
