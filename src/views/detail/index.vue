<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'

import type { IdeaDetail } from '@/types/types'

import { reqIdeaDetail, reqPraiseIdea, reqCollectIdea } from '@/api/sys'
import { fmtTime } from '@/utils'

import Navbar from '@/components/Navbar.vue'
import NameTime from '@/components/NameTime.vue'
import Divider from '@/components/Divider.vue'

const detail = ref<IdeaDetail>()

const params = useRoute().params
const getIdeaDetail = async () => {
  const result = await reqIdeaDetail(params.id)
  detail.value = result.data
}

const getCommentIdea = async () => {}

const like = async () => {
  const result = await reqPraiseIdea(params.id)
  if (result.data) {
    detail.value!.liked = true
    detail.value!.likeCount++
  } else {
    detail.value!.liked = false
    detail.value!.likeCount--
  }
}

const collect = async () => {
  const result = await reqCollectIdea(params.id)
  if (result.data) {
    detail.value!.collected = true
    detail.value!.collectCount++
  } else {
    detail.value!.collected = false
    detail.value!.collectCount--
  }
}

onMounted(() => {
  getIdeaDetail()
  getCommentIdea()
})
</script>

<template>
  <navbar title="详情" />
  <div class="detail">
    <h5>
      <span>{{ detail?.subject }}</span>
    </h5>
    <nameTime
      class="name-time"
      :creator-avatar="detail?.creatorAvatar"
      :creator-name="detail?.creatorName"
      :create-time="detail?.createTime"
    />
    <p class="detail-content">
      {{ detail?.detail }}
    </p>
  </div>

  <div class="file-box">
    <div v-for="(file, index) in detail?.files" :key="index" class="file">
      <Icon icon="line-md:file-filled" width="24" height="24" />
      <span>{{ JSON.parse(file.path).fileName }}</span>
    </div>
  </div>
  <div class="img-box">
    <div v-for="(pic, index) in detail?.pics" :key="index">
      <img :src="pic.path" />
    </div>
  </div>
  <Divider />
  <div v-if="detail?.approveState === 'PUBLISHED'" class="detail-footer">
    <div class="like-favorite">
      <Icon
        icon="mdi:like"
        width="20"
        height="20"
        :color="detail.liked ? 'red' : '#ccc'"
        @click="like"
      />
      <span>{{ detail?.likeCount }}</span>
      <Icon
        icon="mdi:heart"
        width="20"
        height="20"
        :color="detail.collected ? 'red' : '#ccc'"
        @click="collect"
      />
      <span>{{ detail?.collectCount }}</span>
    </div>
  </div>
  <div v-if="detail?.acceptCreatorAvatar" class="recover">
    <img class="avatar" :src="detail?.acceptCreatorAvatar" />
    <div>
      <div class="name">
        {{ detail?.acceptCreatorName }}
      </div>
      <p class="content">
        {{ detail?.acceptMessage }}
      </p>
      <div class="time">
        {{ fmtTime(detail?.acceptCreateTime) }}
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.detail {
  padding: 0 20px;
  .name-time {
    margin: 15px 0;
  }
  .detail-content {
    font-size: 14px;
    line-height: 1.5;
  }
}
.nut-divider {
  margin: 0;
}
.detail-footer {
  padding: 10px 0;
  .like-favorite {
    display: flex;
    justify-content: right;
    align-items: center;
    span {
      margin: 0 10px;
    }
    & > span:first-of-type {
      margin-right: 20px;
    }
  }
}

.file-box {
  .file {
    font-size: 14px;
    display: flex;
    align-items: center;
    margin: 15px 20px;
    color: #4d75f2;
    background-color: #e9f2fe;
    padding: 5px;
    border-radius: 5px;
  }
}

.img-box {
  text-align: center;
  img {
    max-height: 300px;
  }
}

.recover {
  display: flex;
  padding: 10px;
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .name {
    font-weight: 600;
  }
  .content {
    margin: 10px 0;
  }
  .time {
    color: #ccc;
  }
}
</style>
