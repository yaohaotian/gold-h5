<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
const router = useRouter()

const route = useRoute()
const routeName = route.name

const { approveUser, middleApproveUser, finalApproveUser } = JSON.parse(
  localStorage.getItem('IdeaUser') ?? '{}',
)

defineProps({
  title: {
    Type: String,
    default: '标题',
  },
})
onMounted(() => {})

const goMy = () => {
  router.push({ name: 'My' })
}

const goHome = () => {
  router.push({ name: 'Home' })
}

const goApprove = (approveType: string) => {
  router.push({ name: 'ApproveList', params: { approveType } })
}
const goCollect = () => {
  router.push({ name: 'Collect' })
}
</script>

<template>
  <van-nav-bar :title="title">
    <template #left>
      <span v-if="routeName === 'Home'">
        <Icon
          v-if="approveUser"
          icon="icon-park-twotone:seal"
          width="20"
          height="20"
          @click="goApprove('approveUser')"
        />
        <Icon
          v-if="middleApproveUser"
          icon="icon-park-twotone:seal"
          width="20"
          height="20"
          @click="goApprove('middleApproveUser')"
        />
        <Icon
          v-if="finalApproveUser"
          icon="icon-park-twotone:seal"
          width="20"
          height="20"
          @click="goApprove('finalApproveUser')"
        />
      </span>
      <Icon
        v-else
        class="back"
        icon="simple-line-icons:arrow-left"
        width="24"
        height="24"
        @click="router.back"
      />
      <Icon
        v-if="routeName !== 'Home'"
        icon="fa6-solid:house"
        width="24"
        height="24"
        @click="goHome"
      />
    </template>
    <template #right>
      <Icon
        v-if="routeName === 'Home'"
        icon="icon-park-outline:people"
        width="20"
        height="20"
        @click="goMy"
      />
      <Icon
        v-if="routeName === 'My'"
        icon="mdi:heart"
        width="20"
        height="20"
        @click="goCollect"
      />
    </template>
  </van-nav-bar>
</template>

<style scoped>
.back {
  margin-right: 15px;
}
</style>
