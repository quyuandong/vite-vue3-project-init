<template>
  <Layout :class="prefixCls" v-bind="lockEvents">
    <!-- 配置锁屏，回到顶部，项目设置(抽屉)，会话超时 -->
    <LayoutFeatures />

    <!-- 头部 -->
    <LayoutHeader fixed v-if="getShowFullHeaderRef" />

    <!-- 主布局 -->
    <Layout :class="[layoutClass]">
      <LayoutSideBar v-if="getShowSidebar || getIsMobile" />
      <Layout :class="`${prefixCls}-main`">
        <LayoutMultipleHeader />
        <LayoutContent />
        <LayoutFooter />
      </Layout>
    </Layout>
  </Layout>
</template>
<script lang="ts">
  import { Layout } from 'ant-design-vue'
  import { computed, defineComponent, unref } from 'vue'
  import { useDesign } from '/@/hooks/web/useDesign'
  import { useLockPage } from '/@/hooks/web/useLockPage'
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent'

  import LayoutHeader from './header/index.vue'
  import LayoutSideBar from './sider/index.vue'
  import LayoutMultipleHeader from './header/MultipleHeader.vue'
  import LayoutContent from './content/index.vue'

  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting'
  import { useAppInject } from '/@/hooks/web/useAppInject'
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting'

  export default defineComponent({
    name: 'DefaultLayout',
    components: {
      Layout,
      LayoutFeatures: createAsyncComponent(() => import('/@/layouts/default/feature/index.vue')),
      LayoutFooter: createAsyncComponent(() => import('/@/layouts/default/footer/index.vue')),
      LayoutHeader,
      LayoutSideBar,
      LayoutMultipleHeader,
      LayoutContent,
    },
    setup() {
      const { prefixCls } = useDesign('default-layout')
      const { getIsMobile } = useAppInject()
      const { getShowFullHeaderRef } = useHeaderSetting()
      const { getShowSidebar, getIsMixSidebar, getShowMenu } = useMenuSetting()

      //   创建一个锁定屏幕监视器
      const lockEvents = useLockPage()

      const layoutClass = computed(() => {
        let cls: string[] = ['ant-layout']
        if (unref(getIsMixSidebar) || unref(getShowMenu)) {
          cls.push('ant-layout-has-sider')
        }
        return cls
      })

      return {
        getShowFullHeaderRef,
        getShowSidebar,
        prefixCls,
        getIsMobile,
        getIsMixSidebar,
        layoutClass,
        lockEvents,
      }
    },
  })
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-default-layout';

  .@{prefix-cls} {
    display: flex;
    width: 100%;
    min-height: 100%;
    background-color: @content-bg;
    flex-direction: column;

    > .ant-layout {
      min-height: 100%;
    }

    &-main {
      width: 100%;
      margin-left: 1px;
    }
  }
</style>
