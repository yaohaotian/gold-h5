<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import { reqMyIdea } from '@/api/sys'

import type { MyDetail } from '@/types/types'

import Navbar from '@/components/Navbar.vue'
import IdeaBox from '@/components/IdeaBox.vue'

onMounted(() => {
  getMyIdea()
})

const myDetail = ref<MyDetail>()

const active = ref(0)

const tabsList = reactive<any[]>([
  {
    title: '全部',
    approveState: [],
    ideaList: [],
  },
  {
    title: '处理中',
    approveState: ['APPROVING', 'PUB_APPROVING', 'PUB_CONFIRM'],
    ideaList: [],
  },
  {
    title: '采纳',
    approveState: ['PUBLISHED'],
    ideaList: [],
  },
  {
    title: '暂存',
    approveState: ['UN_SUBMIT'],
    ideaList: [],
  },
  { title: '退回', approveState: ['REJECT'], ideaList: [] },
])

const getMyIdea = async () => {
  const result = await reqMyIdea()
  myDetail.value = result.data
  tabsList[0].ideaList = result.data.ideas
  for (const idea of result.data.ideas) {
    const tab = tabsList.find((tab) =>
      tab.approveState.includes(idea.approveState),
    )
    tab && tab.ideaList.push(idea)
  }
}
</script>

<template>
  <div>
    <Navbar title="我的" />
    <div class="top-box">
      <div class="avatar-name">
        <img :src="myDetail?.avatar" class="avatar" />
        <span class="name">{{ myDetail?.nickName }}</span>
      </div>
      <div class="point-box">
        <div class="point">
          <div>{{ myDetail?.points || 0.0 }}</div>
          <div>金点分</div>
        </div>
      </div>
    </div>
    <van-tabs v-model:active="active">
      <van-tab v-for="(tab, index) in tabsList" :key="index" title="标签 1">
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
  </div>
</template>

<style lang="less" scoped>
.top-box {
  height: 150px;
  display: flex;
  background-image: linear-gradient(to bottom, #fff0d4, #e5bf8c);
  .avatar-name {
    display: flex;
    width: 50%;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    .avatar {
      margin-right: 10px;
      width: 50px;
      aspect-ratio: 1 / 1;
      border-radius: 50%;
      border: 3px solid #e5bf8c;
    }
    .name {
      color: #5c3c0a;
      font-weight: bold;
    }
  }
  .point-box {
    width: 50%;
    background-image: url('/imgs/lines.png');
    background-size: 200% 100%;
    background-position-x: -100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .point {
      box-sizing: border-box;
      text-align: center;
      padding-top: 45px;
      height: 80%;
      width: 55%;
      background-image: url('/imgs/grade-bg-img.png');
      background-size: 100% 100%;
      & > div:first-child {
        font-size: 24px;
        font-weight: 600;
        color: #fbf0d1;
      }
      & > div:last-child {
        font-size: 14px;
        color: #fbf0d1;
      }
    }
  }
}
.van-tabs {
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

:deep(.van-tab__text--ellipsis) {
  overflow: auto;
  -webkit-line-clamp: initial;
  .tab-title {
    text-align: center;
    margin: 15px 0;
    font-weight: 600;
    & > div:first-of-type {
      color: #a1742c;
      font-size: 24px;
    }
  }
}
</style>
