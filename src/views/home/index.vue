<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { reqIdeaList, reqDepartmentList } from '@/api/sys'
import { Icon } from '@iconify/vue'

import Navbar from '@/components/Navbar.vue'
import IdeaBox from '@/components/IdeaBox.vue'

const router = useRouter()

const active = ref(0)

const departmentList = ref<any[]>([])

onMounted(() => {
  getDepartmentList()
})

const getDepartmentList = async () => {
  const result = await reqDepartmentList()
  departmentList.value = [
    ...[{ name: '全部', sortIndex: 0, ideaList: [] }],
    ...result.data,
  ].map((i) => ({
    ...i,
    catalog: i.name,
    page: 1,
    size: 999,
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
  result.data.content.map((i: any) => {
    const { catalog } = i
    const obj = departmentList.value.find((list) => list.catalog === catalog)
    obj && obj.ideaList.push(i)
  })
}

const tabChange = (index: number) => {
  console.log(index)
}

const goAdd = () => {
  router.push({ name: 'Add' })
}
</script>

<template>
  <Navbar title="浙水设计金点子" />
  <van-tabs v-model="active" animated swipeable @change="tabChange">
    <van-tab v-for="(i, index) in departmentList" :key="index" :title="i.name">
      <IdeaBox v-for="(x, inIndex) in i.ideaList" :key="inIndex" :idea="x" />
    </van-tab>
  </van-tabs>
  <Icon
    class="add-btn"
    icon="gridicons:add"
    width="54"
    height="54"
    color="#22A4F1"
    @click="goAdd"
  />
</template>

<style lang="less" scoped>
.add-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
}
</style>
