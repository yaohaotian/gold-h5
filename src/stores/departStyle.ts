import { defineStore } from 'pinia'
import { reqDepartmentList } from '@/api/sys'

export const useStylesStore = defineStore('styles', {
  state: () => ({
    styles: [] as any,
  }),
  getters: {
    fullstyles: (state) => {
      return state.styles
    },
  },
  actions: {
    // 异步更新 message
    async updateStyles() {
      try {
        // 进行网络请求，例如通过 Fetch 或 Axios 获取数据
        const result = await reqDepartmentList()
        this.styles = result.data.map((i: any) => {
          i.displayStyle = JSON.parse(i.displayStyle)
          return i
        })
      } catch (err) {}
    },
    getStyle(name: string) {
      const obj = this.styles.find((i: any) => i.name === name)
      return obj?.displayStyle || {}
    },
  },
})
