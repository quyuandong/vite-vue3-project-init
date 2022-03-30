<!-- 
  * 多语言切换组件
 -->
<template>
  <Dropdown
    placement="bottomCenter"
    :trigger="['click']"
    :drop-menu-list="localeList"
    :selected-keys="selectedKeys"
    @menu-event="handleMenuEvent"
    overlayClassName="app-locale-picker-overlay"
  >
    <span class="cursor-pointer flex items-center">
      <Icon icon="ion:language" />
      <span v-if="showText" class="ml-1">{{ getLocaleText }}</span>
    </span>
  </Dropdown>
</template>
<script lang="ts" setup>
  import { computed, ref, unref, watchEffect } from 'vue'
  import { LocaleType } from '/#/config'
  import type { DropMenu } from '/@/components/Dropdown'
  import { Dropdown } from '/@/components/Dropdown'
  import { useLocale } from '/@/locales/useLocale'
  import { localeList } from '/@/settings/localeSetting'
  import { Icon } from '/@/components/Icon'

  const props = defineProps({
    showText: { type: Boolean, default: true }, // 是否显示文本
    reload: { type: Boolean }, //更改时是否刷新接口
  })

  const selectedKeys = ref<string[]>([])
  const { changeLocale, getLocale } = useLocale()

  // 获取当前的语言
  const getLocaleText = computed(() => {
    const key = selectedKeys.value[0]
    if (!key) return ''
    return localeList.find(item => item.event === key)?.text
  })

  // 监控语言的选择
  watchEffect(() => {
    selectedKeys.value = [unref(getLocale)]
  })

  // 切换语言
  async function toggleLocale(lang: LocaleType | string) {
    await changeLocale(lang as LocaleType)
    selectedKeys.value = [lang as string]
    props.reload && location.reload()
  }

  // 下拉菜单点击事件
  function handleMenuEvent(menu: DropMenu) {
    if (unref(getLocale) === menu.event) return
    toggleLocale(menu.event as string)
  }
</script>

<style lang="less">
  .app-locale-picker-overlay {
    .ant-dropdown-menu-item {
      min-width: 160px;
    }
  }
</style>
