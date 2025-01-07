<script lang="ts" setup>
defineProps({
  title: {
    Type: String,
    default: '标题',
  },
})
</script>

<template>
  <van-nav-bar :title="title" left-arrow />
</template>

<style scoped></style>
