<script lang="ts" setup>
defineProps({
  margin: {
    type: String,
    default: '10',
  },
})
</script>

<template>
  <div class="divider" />
</template>

<style lang="less" scoped>
.divider {
  width: 100%;
  height: 1px;
  margin: 10px 0;
  background-color: #e6e6e6;
}
</style>
