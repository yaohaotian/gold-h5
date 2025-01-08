<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
const router = useRouter()

const route = useRoute()
const routeName = route.name

defineProps({
  title: {
    Type: String,
    default: '标题',
  },
})

const goMy = () => {
  router.push({ name: 'My' })
}
</script>

<template>
  <van-nav-bar
    :title="title"
    :left-arrow="routeName !== 'home'"
    @click-left="router.back"
  >
    <template #right>
      <Icon
        v-if="routeName === 'home'"
        icon="icon-park-outline:people"
        width="20"
        height="20"
        @click="goMy"
      />
    </template>
  </van-nav-bar>
</template>

<style scoped></style>
