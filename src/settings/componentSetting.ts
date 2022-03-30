/**
 * 用于在不修改组件的情况下，对部分组件进行通用配置
 */

import { SorterResult } from '../components/Table'

export default {
  // 滚动条设置
  scrollbar: {
    // 是否使用原生滚动条
    // 打开后，菜单、模态、抽屉会将弹出式滚动条改为原生
    native: false,
  },

  // 表单设置
  table: {
    // 窗体接口请求通用配置
    // support xxx.xxx.xxx
    fetchSetting: {
      // 后端返回的当前页
      pageField: 'page',
      // 接口返回的分页大小
      sizeField: 'pageSize',
      // 接口返回的列表字段
      listField: 'items',
      // 接口返回的总数
      totalField: 'total',
    },
    // 可选的页面分页
    pageSizeOptions: ['10', '50', '80', '100'],
    // 默认分页
    defaultPageSize: 10,
    // 默认表格大小
    defaultSize: 'middle',
    // Custom general sort function
    defaultSortFn: (sortInfo: SorterResult) => {
      const { field, order } = sortInfo
      if (field && order) {
        return {
          // 排序字段
          field,
          // 排序方式 asc/desc
          order,
        }
      } else {
        return {}
      }
    },
    // 自定义过滤
    defaultFilterFn: (data: Partial<Recordable<string[]>>) => {
      return data
    },
  },
}
