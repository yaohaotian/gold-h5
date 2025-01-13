<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { showToast } from 'vant'
import { reqCollectIdeaList, reqCollectIdea } from '@/api/sys'

import Navbar from '@/components/Navbar.vue'
import IdeaBox from '@/components/IdeaBox.vue'

onMounted(() => {
  getCollectIdeaList()
})

const collectIdeaList = ref([])

const getCollectIdeaList = async () => {
  try {
    const res = await reqCollectIdeaList()
    collectIdeaList.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const cancelCollect = async (id: number, index: number) => {
  const result = await reqCollectIdea(id)
  if (!result.data) {
    collectIdeaList.value.splice(index, 1)
    showToast('删除收藏成功')
  }
}
</script>

<template>
  <Navbar title="我的收藏" />
  <van-swipe-cell v-for="(idea, index) in collectIdeaList" :key="index">
    <IdeaBox :idea="idea" />
    <template #right>
      <van-button
        square
        text="删除"
        type="danger"
        class="delete-button"
        @click="cancelCollect(idea.id, index)"
      />
    </template>
  </van-swipe-cell>
</template>

<style scoped>
.delete-button {
  height: 100%;
}
</style>
