<template>
  <div
    :class="prefixCls"
    class="fixed inset-0 flex h-screen w-screen bg-black items-center justify-center"
  >
    <!-- 点击解锁模块 -->
    <div
      :class="`${prefixCls}__unlock`"
      class="
        absolute
        top-0
        left-1/2
        flex
        pt-5
        h-16
        items-center
        justify-center
        sm:text-md
        xl:text-xl
        text-white
        flex-col
        cursor-pointer
        transform
        translate-x-1/2
      "
      @click="handleShowForm(false)"
      v-show="showDate"
    >
      <LockOutlined />
      <span>点击解锁</span>
    </div>

    <!-- 时分 模块 -->
    <div class="flex w-screen h-screen justify-center items-center">
      <div :class="`${prefixCls}__hour`" class="relative mr-5 md:mr-20 w-2/5 h-2/5 md:h-4/5">
        <span>{{ hour }}</span>
        <span class="meridiem absolute left-5 top-5 text-md xl:text-xl" v-show="showDate">{{
          meridiem
        }}</span>
      </div>
      <div :class="`${prefixCls}__minute w-2/5 h-2/5 md:h-4/5 `">
        <span> {{ minute }}</span>
      </div>
    </div>

    <!-- 解锁 密码输入模块 -->
    <transition name="fade-slide">
      <div :class="`${prefixCls}-entry`" v-show="!showDate">
        <div :class="`${prefixCls}-entry-content`">
          <div :class="`${prefixCls}-entry__header enter-x`">
            <img :src="userInfo.avatar || headerImg" :class="`${prefixCls}-entry__header-img`" />
            <p :class="`${prefixCls}-entry__header-name`">
              {{ userInfo.realName }}
            </p>
          </div>
          <InputPassword
            placeholder="请输入锁屏密码或者用户密码"
            class="enter-x"
            v-model:value="password"
            @pressEnter="unLock()"
          />
          <span :class="`${prefixCls}-entry__err-msg enter-x`" v-if="errMsg"> 锁屏密码错误 </span>
          <div :class="`${prefixCls}-entry__footer enter-x`">
            <a-button
              type="link"
              size="small"
              class="mt-2 mr-2 enter-x"
              :disabled="loading"
              @click="handleShowForm(true)"
            >
              返回
            </a-button>
            <a-button
              type="link"
              size="small"
              class="mt-2 mr-2 enter-x"
              :disabled="loading"
              @click="goLogin"
            >
              返回登陆
            </a-button>
            <a-button class="mt-2" type="link" size="small" @click="unLock()" :loading="loading">
              返回系统
            </a-button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 底部时间 -->
    <div class="absolute bottom-5 w-full text-gray-300 xl:text-xl 2xl:text-3xl text-center enter-y">
      <div class="text-5xl mb-4 enter-x" v-show="!showDate">
        {{ hour }}:{{ minute }} <span class="text-3xl">{{ meridiem }}</span>
      </div>
      <div class="text-2xl">{{ year }}/{{ month }}/{{ day }} {{ week }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import { useDesign } from '/@/hooks/web/useDesign'
  import { LockOutlined } from '@ant-design/icons-vue'
  import { useLockStore } from '/@/store/modules/lock'
  import { useUserStore } from '/@/store/modules/user'
  import { useNow } from './useNow'
  import headerImg from '/@/assets/images/header.jpg'
  import { Input } from 'ant-design-vue'

  const InputPassword = Input.Password

  const password = ref('')
  const loading = ref(false)
  const errMsg = ref(false)
  const showDate = ref(true)

  const { prefixCls } = useDesign('lock-page')
  const lockStore = useLockStore()
  const userStore = useUserStore()

  const { hour, month, minute, meridiem, year, day, week } = useNow(true)

  const userInfo = computed(() => {
    return userStore.getUserInfo || {}
  })

  async function unLock() {
    if (!password.value) return
    let pwd = password.value
    try {
      loading.value = true
      const res = await lockStore.unLock(pwd)
      errMsg.value = !res
    } finally {
      loading.value = false
    }
  }
  function goLogin() {
    // 退出并重试登陆
    userStore.logout(true)
    lockStore.resetLockInfo()
  }

  function handleShowForm(show = false) {
    errMsg.value = false
    showDate.value = show
    password.value = ''
  }
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-lock-page';

  .@{prefix-cls}{
    z-index: @lock-page-z-index;

    &__unlock {
      transform: translate(-50%,0);
    }

    &__hour,
    &__minute{
      display: flex;
      font-weight: 700;
      color: #bababa;
      background-color: #141313;
      border-radius: 30px;
      justify-content: center;
      align-items: center;

      @media screen and (max-width: @screen-md) {
        span:not(.meridiem){
          font-size: 160px;
        }
      }

      @media screen and (min-width: @screen-md) {
        span:not(.meridiem){
          font-size: 160px;
        }
      }

      @media screen and (max-width: @screen-sm) {
        span:not(.meridiem) {
          font-size: 90px;
        }
      }
      @media screen and (min-width: @screen-lg) {
        span:not(.meridiem) {
          font-size: 220px;
        }
      }

      @media screen and (min-width: @screen-xl) {
        span:not(.meridiem) {
          font-size: 260px;
        }
      }
      @media screen and (min-width: @screen-2xl) {
        span:not(.meridiem) {
          font-size: 320px;
        }
      }
    }

    &-entry{
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      width: 100%;
      height: 100%;
      background-color: rgb(0 0 0 / 50%);
      backdrop-filter: blur(8px);
      justify-content: center;
      align-items: center;

      &-content{
        width: 260px;
      }

      &__header{
        text-align: center;

        &-img{
          width: 70px;
          margin: 0 auto;
          border-radius: 50%;
        }

        &-name{
          margin-top: 5px;
          font-weight: 500;
          color: #bababa;
        }
      }

      &__err-msg {
        display: inline-block;
        margin-top: 10px;
        color: @error-color;
      }

      &__footer {
        display: flex;
        justify-content: space-between;
      }
    }

  }
</style>
