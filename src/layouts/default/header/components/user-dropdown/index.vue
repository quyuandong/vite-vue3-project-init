<template>
  <Dropdown placement="bottomLeft" :open-class-name="`${prefixCls}-dropdown-overlay`">
    <span :class="[prefixCls, `${prefixCls}--${theme}`]" class="flex">
      <img :src="getUserInfo.avatar" alt="" :class="`${prefixCls}__header`" />
      <span :class="`${prefixCls}__info hidden md:block`">
        <span :class="`${prefixCls}__name  `" class="truncate">
          {{ getUserInfo.realName }}
        </span>
      </span>
    </span>

    <template #overlay>
      <Menu @click="handleMenuClick">
        <MenuItem menuKey="doc" text="文档" icon="ion:document-text-outline" v-if="getShowDoc" />
        <MenuDivider v-if="getShowDoc" />
        <MenuItem
          menuKey="lock"
          text="锁定屏幕"
          icon="ion:lock-closed-outline"
          v-if="getUseLockPage"
        />
        <MenuItem menuKey="logout" text="退出系统" icon="ion:power-outline" />
      </Menu>
    </template>
  </Dropdown>
  <LockAction @register="register" />
</template>
<script lang="ts">
  import { Dropdown, Menu, message } from 'ant-design-vue'
  import { computed, defineComponent } from 'vue'
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting'
  import { useDesign } from '/@/hooks/web/useDesign'
  import { useUserStore } from '/@/store/modules/user'
  import { propTypes } from '/@/utils/propTypes'
  import headerImg from '/@/assets/images/header.jpg'
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent'
  import { useModal } from '/@/components/Modal'

  type MenuEvent = 'logout' | 'doc' | 'lock'

  export default defineComponent({
    name: 'UserDropDown',
    components: {
      Dropdown,
      Menu,
      MenuItem: createAsyncComponent(() => import('./DropMenuItem.vue')),
      MenuDivider: Menu.Divider,
      LockAction: createAsyncComponent(() => import('../lock/LockModal.vue')),
    },
    props: { theme: propTypes.oneOf(['dark', 'light']) },
    setup() {
      const { prefixCls } = useDesign('header-user-dropdown')
      const { getShowDoc, getUseLockPage } = useHeaderSetting()
      const userStore = useUserStore()

      const [register, { openModal }] = useModal()

      // 获取用户信息
      const getUserInfo = computed(() => {
        const { realName = '', avatar, desc } = userStore.getUserInfo || {}
        return { realName, avatar: avatar || headerImg, desc }
      })

      function handleMenuClick(e: { key: MenuEvent }) {
        switch (e.key) {
          case 'logout':
            handleLoginOut()
            break
          case 'doc':
            openDoc()
            break
          case 'lock':
            handleLock()
            break
        }
      }

      // 锁屏
      function handleLock() {
        openModal(true)
      }

      //  退出
      function handleLoginOut() {
        // TODO: 暂时有问题
        userStore.confirmLoginOut()
      }

      // 打开文档
      function openDoc() {
        message.warning('暂未有文档')
      }

      return {
        prefixCls,
        getUserInfo,
        getShowDoc,
        getUseLockPage,
        register,
        handleMenuClick,
      }
    },
  })
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-user-dropdown';

  .@{prefix-cls} {
    height: @header-height;
    padding: 0 0 0 10px;
    padding-right: 10px;
    overflow: hidden;
    font-size: 12px;
    cursor: pointer;
    align-items: center;

    img {
      width: 24px;
      height: 24px;
      margin-right: 12px;
    }

    &__header {
      border-radius: 50%;
    }

    &__name {
      font-size: 14px;
    }

    &--dark {
      &:hover {
        background-color: @header-dark-bg-hover-color;
      }
    }

    &--light {
      &:hover {
        background-color: @header-light-bg-hover-color;
      }

      .@{prefix-cls}__name {
        color: @text-color-base;
      }

      .@{prefix-cls}__desc {
        color: @header-light-desc-color;
      }
    }

    &-dropdown-overlay {
      .ant-dropdown-menu-item {
        min-width: 160px;
      }
    }
  }
</style>
