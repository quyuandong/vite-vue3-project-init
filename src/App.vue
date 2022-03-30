<template>
  <ConfigProvider :locale="getAntdLocale">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script setup lang="ts">
  import { ConfigProvider } from 'ant-design-vue' //全局配置
  import { useTitle } from './hooks/web/useTitle'
  import { AppProvider } from '/@/components/Application'
  import { useLocale } from '/@/locales/useLocale'

  // 多语言切换
  const { getAntdLocale } = useLocale()

  // 监听页面变化 动态改变网站标题
  useTitle()
</script>
