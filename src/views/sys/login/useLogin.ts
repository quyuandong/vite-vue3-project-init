import { ValidationRule } from 'ant-design-vue/lib/form/Form'
import { RuleObject } from 'ant-design-vue/lib/form/interface'
import { computed, Ref, ref, unref } from 'vue'

export enum LoginStateEnum {
  LOGIN,
  REGISTER,
  RESET_PASSWORD,
  MOBILE,
  QR_CODE,
}

const currentState = ref(LoginStateEnum.LOGIN)

/**
 * 创建规则
 * @param message 提示信息
 * @returns
 */
function createRule(message: string) {
  return {
    require: true,
    message,
    trigger: 'change',
  }
}

/**
 * 当前的登陆界面状态
 * @returns
 */
export function useLoginState() {
  // 设置当前的登陆状态
  function setLoginState(state: LoginStateEnum) {
    currentState.value = state
  }
  // 获取当前是什么登陆
  const getLoginState = computed(() => currentState.value)
  // 返回到账号密码登陆
  function handleBackLogin() {
    setLoginState(LoginStateEnum.LOGIN)
  }

  return { setLoginState, getLoginState, handleBackLogin }
}

/**
 * 使用校验规则
 * @param formData 数据
 */
export function useFormRules(formData?: Recordable) {
  const getAccountFormRule = computed(() => createRule('请输入账号'))
  const getPasswordFormRule = computed(() => createRule('请输入密码'))
  const getSmsFormRule = computed(() => createRule('请输入验证码'))
  const getMobileFormRule = computed(() => createRule('请输入手机号码'))

  // 校验是否勾选隐私
  const validatePolicy = async (_: RuleObject, value: boolean) => {
    return !value ? Promise.reject('勾选之后才能注册') : Promise.resolve()
  }

  // 校验密码是否为空 和 两次密码是否一致
  const validateConfirmPassword = (password: string) => {
    return async (_: RuleObject, value: string) => {
      if (!value) return Promise.reject('请输入密码')
      if (value !== password) return Promise.reject('两次输入密码不一致')
      return Promise.resolve()
    }
  }

  // 获取到校验规则
  const getFormRules = computed((): { [k: string]: ValidationRule | ValidationRule[] } => {
    const accountFormRule = unref(getAccountFormRule)
    const passwordFormRule = unref(getPasswordFormRule)
    const smsFormRule = unref(getSmsFormRule)
    const mobileFormRule = unref(getMobileFormRule)

    const mobileRule = {
      sms: smsFormRule,
      mobile: mobileFormRule,
    }
    switch (unref(currentState)) {
      case LoginStateEnum.REGISTER:
        return {
          account: accountFormRule,
          password: passwordFormRule,
          confirmPassword: [
            { validator: validateConfirmPassword(formData?.password), trigger: 'change' },
          ],
          policy: [{ validator: validatePolicy, trigger: 'change' }],
          ...mobileRule,
        }
      case LoginStateEnum.RESET_PASSWORD:
        return {
          account: accountFormRule,
          ...mobileRule,
        }
      case LoginStateEnum.MOBILE:
        return mobileRule
      default:
        return {
          account: accountFormRule,
          password: passwordFormRule,
        }
    }
  })
  return { getFormRules }
}

/**
 * 校验form表单
 * @param formRef ref引用组件
 * @returns
 */
export function useFormValid<T extends Object = any>(formRef: Ref<any>) {
  async function validForm() {
    const form = unref(formRef)
    if (!form) return
    const data = await form.validate()
    return data as T
  }

  return { validForm }
}
