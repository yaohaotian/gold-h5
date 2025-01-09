<script lang="ts" setup>
import type { Idea } from '@/types/types'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

import NameTime from '@/components/NameTime.vue'
import Divider from '@/components/Divider.vue'
import catalog from '@/components/catalog.vue'

enum Status {
  APPROVING = '待审批',
  PUBLISHED = '采纳',
  UN_SUBMIT = '暂存',
  REJECT = '退回',
  PUB_APPROVING = '采纳审批',
  PUB_CONFIRM = '采纳确认',
}

const props = defineProps<{ idea: Idea }>()

const router = useRouter()

const goDetail = () => {
  router.push({
    name: 'Detail',
    params: {
      id: props.idea.id,
    },
  })
}

const statusToText = (approveState: keyof typeof Status) => {
  return Status[approveState]
}
</script>

<template>
  <div class="message-box" @click="goDetail">
    <div class="first-line">
      <catalog :name="idea.catalog" />
      <div class="subject">
        {{ idea.subject }}
      </div>
    </div>
    <p class="detail">
      {{ idea.detail }}
    </p>
    <div class="img-box">
      <img v-for="(item, index) in idea.pics" :key="index" :src="item.path" />
    </div>
    <Divider />
    <div>
      <div class="btm-line">
        <NameTime
          :creator-avatar="idea.creatorAvatar"
          :creator-name="idea.creatorName"
          :create-time="idea.createTime"
        />
        <div class="like-favorite">
          <Icon icon="mdi:like" width="12" height="12" />
          <span>{{ idea.likeCount }}</span>
          <Icon icon="mdi:heart" width="12" height="12" />
          <span>{{ idea.collectCount }}</span>
        </div>
      </div>
    </div>
    <div :class="['ideaStatus-box', idea.approveState!.toLowerCase()]">
      {{ statusToText(idea.approveState) }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.nut-divider {
  margin: 15px 0;
}
.message-box {
  position: relative;
  padding: 20px 15px 15px 15px;
  box-shadow: 0 0 10px #ccc;
  margin-bottom: 15px;
  .first-line {
    display: flex;
    align-items: center;
    .subject {
      font-weight: 600;
      margin-left: 10px;
    }
  }
  .detail {
    font-size: 14px;
    line-height: 1.5;
    color: #8d8d8d;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .btm-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .name {
      margin-left: 10px;
    }
    .like-favorite {
      color: #8d8d8d;
      display: flex;
      align-items: center;
      span {
        margin: 0 5px;
      }
    }
  }
  .img-box {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    img {
      width: calc(33.3% - 20px);
      border-radius: 15px;
      aspect-ratio: 1 / 1; /* 宽高比为 1:1 */
      object-fit: cover; /* 保证图片不会变形，按比例裁剪 */
    }
  }
}
.ideaStatus-box {
  position: absolute;
  right: 0;
  top: 0;
  color: white;
  font-size: 14px;
  padding: 3px;
  border-bottom-left-radius: 5px;
  &.pub_approving {
    background-color: #ffae35;
  }
  &.approving {
    background-color: #4b99bd;
  }
  &.un_submit {
    background-color: #ffae35;
  }
  &.published {
    background-color: #6bd054;
  }
  &.reject {
    background-color: #ff7a5a;
  }
  &.pub_confirm {
    background-color: #ffae35;
  }
}
</style>
