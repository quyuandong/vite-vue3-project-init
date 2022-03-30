<template>
  <MenuItem :key="item.path">
    <MenuItemContent v-bind="getProps" :item="item" />
  </MenuItem>
</template>
<script lang="ts">
  import { computed, defineComponent } from 'vue'
  import { Menu } from 'ant-design-vue'
  import { itemProps } from '../props'

  import MenuItemContent from './MenuItemContent.vue'
  export default defineComponent({
    name: 'BasicMenuItem',
    components: { MenuItem: Menu.Item, MenuItemContent },
    props: itemProps,
    setup(props) {
      const getProps = computed(() => ({ ...props }))
      return { getProps }
    },
  })
</script>
