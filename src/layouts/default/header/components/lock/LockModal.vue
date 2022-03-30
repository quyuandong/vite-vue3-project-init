<template>
  <BasicModal
    :footer="null"
    title="锁定屏幕"
    v-bind="$attrs"
    :class="prefixCls"
    @register="register"
  >
    <div :class="`${prefixCls}__entry`">
      <div :class="`${prefixCls}__header`">
        <img :src="avatar" :class="`${prefixCls}__header-img`" />
        <p :class="`${prefixCls}__header-name`">
          {{ getRealName }}
        </p>
      </div>

      <BasicForm @register="registerForm" />

      <div :class="`${prefixCls}__footer`">
        <a-button type="primary" block class="mt-2" @click="handleLock"> 锁定 </a-button>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { computed, defineComponent } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { useDesign } from '/@/hooks/web/useDesign'
  import { useLockStore } from '/@/store/modules/lock'
  import { useUserStore } from '/@/store/modules/user'
  import headerImg from '/@/assets/images/header.jpg'
  import { BasicForm, useForm } from '/@/components/Form'

  export default defineComponent({
    name: 'LockModal',
    components: { BasicModal, BasicForm },
    setup() {
      const { prefixCls } = useDesign('header-lock-modal')
      const userStore = useUserStore()
      const lockStore = useLockStore()

      const getRealName = computed(() => userStore.getUserInfo.realName)
      const [register, { closeModal }] = useModalInner()

      const [registerForm, { validateFields, resetFields }] = useForm({
        showActionButtonGroup: false,
        schemas: [
          {
            field: 'password',
            label: '锁屏密码',
            component: 'InputPassword',
            required: true,
            componentProps: {
              onPressEnter: () => {
                handleLock()
              },
            },
          },
        ],
      })
      async function handleLock() {
        const values = (await validateFields()) as any
        const password: string | undefined = values.password
        closeModal()
        lockStore.setLockInfo({
          isLock: true,
          pwd: password,
        })
        await resetFields()
      }

      const avatar = computed(() => {
        const { avatar } = userStore.getUserInfo
        return avatar || headerImg
      })

      return { prefixCls, handleLock, avatar, getRealName, register, registerForm }
    },
  })
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-header-lock-modal';

  .@{prefix-cls} {
    &__entry {
      position: relative;
      //height: 240px;
      padding: 130px 30px 30px;
      border-radius: 10px;
    }

    &__header {
      position: absolute;
      top: 0;
      left: calc(50% - 45px);
      width: auto;
      text-align: center;

      &-img {
        width: 70px;
        border-radius: 50%;
      }

      &-name {
        margin-top: 5px;
      }
    }

    &__footer {
      text-align: center;
    }
  }
</style>
