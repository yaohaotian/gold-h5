<script setup lang="ts">
import { onMounted } from 'vue'

import { isMobile, watchResize } from '@bassist/utils'
import { useStylesStore } from '@/stores/departStyle'

const userStore = useStylesStore()
const route = useRoute()
const key = computed(() => `${String(route.name || route.path)}-${new Date()}`)

onMounted(() => {
  userStore.updateStyles()
})

watchResize(() => {
  document.body.className = `platform-${isMobile() ? 'mobile' : 'desktop'}`
})
</script>

<template>
  <router-view :key="key" />
</template>
