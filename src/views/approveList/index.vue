<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import {
  reqApproveIdeaList,
  middleApproveIdeaList,
  finalApproveIdeaList,
} from '@/api/sys'

import Navbar from '@/components/Navbar.vue'

const route = useRoute()

const active = ref(0)

const tabsList = reactive<any[]>([
  {
    title: '全部',
    approveState: [],
    ideaList: [],
  },
  {
    title: '待审批',
    approveState: ['APPROVING'],
    ideaList: [],
  },
  {
    title: '采纳审批',
    approveState: ['PUB_APPROVING'],
    ideaList: [],
  },
  {
    title: '采纳确认',
    approveState: ['UN_SUBMIT'],
    ideaList: [],
  },
  { title: '已采纳', approveState: ['PUBLISHED'], ideaList: [] },
  { title: '退回', approveState: ['REJECT'], ideaList: [] },
])

onMounted(() => {
  getApproveIdeaList()
})

const getApproveIdeaList = async () => {
  const { approveType } = route.params
  let result = null
  if (approveType === 'approveUser') {
    result = await reqApproveIdeaList()
  } else if (approveType === 'middleApproveUser') {
    result = await middleApproveIdeaList()
  } else if (approveType === 'finalApproveUser') {
    result = await finalApproveIdeaList()
  }
  tabsList[0].ideaList = result!.data.ideas
  for (const idea of result!.data.ideas) {
    const tab = tabsList.find((tab) =>
      tab.approveState.includes(idea.approveState),
    )
    tab && tab.ideaList.push(idea)
  }
}
</script>

<template>
  <Navbar />
  <van-tabs
    v-model:active="active"
    :class="[route.params.approveType === 'approveUser' ? '' : 'no-tabs']"
  >
    <van-tab v-for="(tab, index) in tabsList" :key="index">
      <template #title>
        <div class="tab-title">
          <div>{{ tab.ideaList.length }}</div>
          <div>{{ tab.title }}</div>
        </div>
      </template>
      <IdeaBox
        v-for="(idea, index) in tab.ideaList"
        :key="index"
        :idea="idea"
      />
    </van-tab>
  </van-tabs>
</template>

<style lang="less" scoped>
.van-tabs {
  &.no-tabs {
    :deep(.van-tabs__wrap) {
      height: 0;
    }
  }
  :deep(.van-tabs__wrap) {
    height: auto;
    :deep(.van-tabs__nav) {
      height: auto;
      padding: 0;
    }
    .van-tabs__nav--line {
      padding: 0;
    }
  }
  :deep(.van-tabs__line) {
    bottom: 0;
  }
}
:deep(.tab-title) {
  text-align: center;
  margin: 15px 0;
  font-weight: 600;
  & > div:first-of-type {
    color: #a1742c;
    font-size: 24px;
  }
}
:deep(.van-tab__text--ellipsis) {
  overflow: auto;
  -webkit-line-clamp: initial;
}
</style>
