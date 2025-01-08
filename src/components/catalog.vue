<script lang="ts" setup>
import { useStylesStore } from '@/stores/departStyle'

const stylesStore = useStylesStore()

defineProps({
  name: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <span class="catalog" :style="stylesStore.getStyle(name)">
    {{ name }}
  </span>
</template>

<style scoped>
.catalog {
  display: inline-block;
  font-size: 14px;
  padding: 4px;
  font-weight: bold;
  border-radius: 5px;
}
</style>
