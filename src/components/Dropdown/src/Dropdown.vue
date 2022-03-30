<template>
  <a-dropdown :trigger="trigger" v-bind="$attrs">
    <span>
      <slot></slot>
    </span>
    <template #overlay>
      <a-menu :selectedKeys="selectedKeys">
        <template v-for="item in dropMenuList" :key="`${item.event}`">
          <a-menu-item
            v-bind="getArr(item.event)"
            @click="handleClickMenu(item)"
            :disabled="item.disabled"
          >
            <a-popconfirm
              v-if="popconfirm && item.popConfirm"
              v-bind="getPopConfirnAttrs(item.popConfirm)"
            >
              <template #icon v-if="item.popConfirm.icon">
                <Icon :icon="item.popConfirm.icon" />
              </template>
              <div>
                <Icon :icon="item.icon" v-if="item.icon" />
                <span class="ml-1">{{ item.text }}</span>
              </div>
            </a-popconfirm>
            <template v-else>
              <Icon :icon="item.icon" v-if="item.icon" />
              <span class="ml-1">{{ item.text }}</span>
            </template>
          </a-menu-item>
          <a-menu-divider v-if="item.divider" :key="`d-${item.event}`" />
        </template>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<script lang="ts" setup>
  import { computed, PropType } from 'vue'
  import { DropMenu } from './typing'
  import { Dropdown, Menu, Popconfirm } from 'ant-design-vue'
  import { Icon } from '/@/components/Icon'
  import { omit } from 'lodash-es'
  import { isFunction } from '/@/utils/is'

  // 组件进行重命名
  const ADropdown = Dropdown
  const AMenu = Menu
  const AMenuItem = Menu.Item
  const AMenuDivider = Menu.Divider
  const APopconfirm = Popconfirm

  // 传递过来的参数
  const props = defineProps({
    popconfirm: Boolean,
    trigger: {
      // 触发方式
      type: Array as PropType<('contextmenu' | 'click' | 'hover')[]>,
      default: () => ['contextmenu'],
    },
    dropMenuList: {
      // 下拉菜单项
      type: Array as PropType<(DropMenu & Recordable)[]>,
      default: () => [],
    },
    selectedKeys: {
      // 选择的键值
      type: Array as PropType<string[]>,
      default: () => [],
    },
  })

  // 触发方法
  const emit = defineEmits(['menuEvent'])

  // 点击下拉框
  function handleClickMenu(item: DropMenu) {
    const { event } = item
    const menu = props.dropMenuList.find(item => `${item.event}` === `${event}`)
    emit('menuEvent', menu)
    item.onClick?.()
  }

  // 获取确认弹框的一些属性
  const getPopConfirnAttrs = computed(() => {
    return attrs => {
      const originAttrs = omit(attrs, ['confirm', 'cancel', 'icon'])
      if (!attrs.onConfirm && attrs.confirm && isFunction(attrs.confirm))
        originAttrs['onConfirm'] = attrs.confirm
      if (!attrs.onCancel && attrs.cancel && isFunction(attrs.cancel))
        originAttrs['onCancel'] = attrs.cancel
      return originAttrs
    }
  })

  const getArr = (key: string | number) => ({ key })
</script>
