<script lang="ts" setup>
import { fmtTime } from '@/utils'
defineProps({
  creatorAvatar: {
    type: String,
  },
  creatorName: {},
  createTime: {},
})
</script>

<template>
  <div class="name-time">
    <img class="avatar" :src="creatorAvatar" />
    <span class="name">{{ creatorName }}</span>
    <span class="line">|</span>
    <span>{{ fmtTime(createTime) }}</span>
  </div>
</template>

<style lang="less" scoped>
.name-time {
  color: #b8babf;
  font-size: 12px;
  display: flex;
  align-items: center;
  .avatar {
    width: 20px;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    margin-right: 5px;
  }
  .line {
    margin: 0 5px;
  }
}
</style>
