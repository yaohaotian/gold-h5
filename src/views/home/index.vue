<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { reqIdeaList, reqDepartmentList } from '@/api/sys'

import Navbar from '@/components/Navbar.vue'

const active = ref(0)

const departmentList = ref<any[]>([
  { name: '全部', sortIndex: 0, ideaList: [] },
])

onMounted(() => {
  getDepartmentList()
})

const getDepartmentList = async () => {
  const result = await reqDepartmentList()
  departmentList.value = [...departmentList.value, ...result.data].map((i) => ({
    ...i,
    catalog: i.name,
    page: 1,
    size: 5,
    ideaList: [],
  }))
  getIdeaList(0)
}

const getIdeaList = async (index: number) => {
  const { catalog, page, size } = departmentList.value[index]
  const params = { catalog: index === 0 ? '' : catalog, page, size }
  const result = await reqIdeaList(params)
  departmentList.value[index].ideaList = [
    ...departmentList.value[index].ideaList,
    ...result.data.content,
  ]
  console.log(departmentList.value[index])
}

const tabChange = (index: number) => {
  console.log(index)
}
</script>

<template>
  <Navbar title="浙水设计金点子" />
  <van-tabs v-model="active" animated swipeable @change="tabChange">
    <van-tab v-for="(i, index) in departmentList" :key="index" :title="i.name">
      {{ 1 }}
    </van-tab>
  </van-tabs>
</template>
