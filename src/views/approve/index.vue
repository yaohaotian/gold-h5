<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Detail from '@/views/detail/index.vue'
import { showConfirmDialog, showToast } from 'vant'
import { fmtTime } from '@/utils'

import {
  replyApproveIdea,
  acceptApproveIdea,
  reqIdeaApproval,
  reqApproveIdea,
  acceptMiddleApproveIdea,
} from '@/api/sys'

enum Opinion {
  SUBMIT = '已提交',
  ACCEPT_SUBMIT = '采纳通过',
  ACCEPT_CONFIRM = '采纳确认',
  PASS = '已通过',
}

const route = useRoute()

const router = useRouter()

const detailRef = ref()

const recoverShow = ref(false)

const adoptShow = ref(false)

const returnShow = ref(false)

const formData = ref({
  approve: null,
  content: '',
  detail: '',
  isPublic: true,
  message: '',
})

onMounted(async () => {
  await getDetail()
  getIdeaApproval()
})

const detail = ref()

const ideaApprovalList = ref<any[]>([])

const getDetail = () =>
  new Promise((resolve) => {
    resolve(detail.value)
  })

const getIdeaApproval = async () => {
  const result = await reqIdeaApproval(route.params.id)
  ideaApprovalList.value = result.data
}

const recoverConfirm = async () => {
  try {
    await replyApproveIdea({
      ideaId: route.params.id,
      content: formData.value.content,
    })
    showToast('回复成功')
    detailRef.value.getIdeaCommentList()
  } catch (error) {
    showToast('回复失败')
  }
}

const adoptConfirm = async () => {
  try {
    await acceptApproveIdea({
      ...formData.value,
      ideaId: route.params.id,
      isPublic: formData.value.isPublic ? 1 : 0,
    })
    showToast('采纳点子成功，即将回到首页')
    setTimeout(() => {
      router.replace({ name: 'Home' })
    }, 1000)
  } catch (error) {
    showToast('采纳点子失败')
  }
}

// 退回点子
const returnConfirm = async () => {
  try {
    console.log({
      ideaId: route.params.id,
      approve: 'REJECT',
      message: formData.value.message,
    })
    await reqApproveIdea({
      ideaId: route.params.id,
      approve: 'REJECT',
      message: formData.value.message,
    })
    showToast('退回成功,即将返回首页')
    setTimeout(() => {
      router.replace({ name: 'Home' })
    }, 500)
  } catch (error) {}
}

// 采纳点子
const adoptOpen = () => {
  formData.value.detail = detail.value.detail
}

const pass = () => {
  showConfirmDialog({
    title: '审批通过',
    message: '通过后所有人可见，确定通过吗',
  }).then(async () => {
    const ideaId = route.params.id
    detail.value.approveState === 'PUB_APPROVING'
      ? await acceptMiddleApproveIdea({ ideaId, isPublic: 1 })
      : await reqApproveIdea({ ideaId, approve: 'PASS' })
    showToast('审批通过成功,即将返回首页')
    setTimeout(() => {
      router.replace({ name: 'Home' })
    }, 500)
  })
}

const close = () => {
  formData.value = {
    approve: null,
    content: '',
    detail: '',
    isPublic: true,
    message: '',
  }
}

const opinionToText = (opinion: keyof typeof Opinion) => {
  return Opinion[opinion]
}
</script>

<template>
  <Detail ref="detailRef" v-model="detail" />
  <van-steps direction="vertical" :active="ideaApprovalList.length - 1">
    <van-step v-for="(a, index) in ideaApprovalList" :key="index">
      <div class="content-box">
        <img class="avatar" :src="a.approveUserAvatar" />
        <div class="box">
          <div class="name-opinion">
            <span class="name">{{ a.approveUser }}</span>
            <span class="opinion">{{ opinionToText(a.approveType) }}</span>
          </div>
          <div v-if="a.message" class="content">意见: {{ a.message }}</div>
          <div>{{ fmtTime(a.approveTime) }}</div>
          <div />
        </div>
      </div>
    </van-step>
  </van-steps>

  <div class="recover-btn" style="margin: 16px">
    <div v-if="detail?.approveState === 'APPROVING'">
      <van-button round block native-type="submit" @click="recoverShow = true">
        回复
      </van-button>
      <van-button
        round
        block
        type="primary"
        native-type="submit"
        @click="adoptShow = true"
      >
        采纳
      </van-button>
    </div>

    <div
      v-else-if="
        detail?.approveState === 'PUB_APPROVING' ||
        detail?.approveState === 'PUB_CONFIRM'
      "
    >
      <van-button round block native-type="submit" @click="returnShow = true">
        退回
      </van-button>
      <van-button round block type="primary" native-type="submit" @click="pass">
        审批通过
      </van-button>
    </div>
  </div>
  <van-dialog
    v-model:show="recoverShow"
    title="回复内容"
    show-cancel-button
    @confirm="recoverConfirm"
    @close="close"
  >
    <van-form>
      <van-cell-group inset>
        <van-field
          v-model="formData.content"
          rows="3"
          autosize
          label="回复内容"
          type="textarea"
          placeholder="请输入"
        />
      </van-cell-group>
    </van-form>
  </van-dialog>

  <van-dialog
    v-model:show="adoptShow"
    title="采纳意见"
    show-cancel-button
    @open="adoptOpen"
    @confirm="adoptConfirm"
    @close="close"
  >
    <van-form>
      <van-cell-group inset>
        <van-field
          v-model="formData.detail"
          rows="3"
          autosize
          label="点子内容"
          type="textarea"
          placeholder="请修改点子内容"
        />
        <van-field
          v-model="formData.message"
          rows="3"
          autosize
          label="采纳意见"
          type="textarea"
          placeholder="请输入采纳意见"
        />
        <van-field name="switch" label="是否公开">
          <template #input>
            <van-switch v-model="formData.isPublic" />
          </template>
        </van-field>
      </van-cell-group>
    </van-form>
  </van-dialog>

  <van-dialog
    v-model:show="returnShow"
    title="退回原因"
    show-cancel-button
    @confirm="returnConfirm"
    @close="close"
  >
    <van-form>
      <van-cell-group inset>
        <van-field
          v-model="formData.message"
          rows="3"
          autosize
          label="退回原因"
          type="textarea"
          placeholder="请输入退回原因"
        />
      </van-cell-group>
    </van-form>
  </van-dialog>
</template>

<style lang="less" scoped>
.recover,
.comment {
  background-color: #fff;
  border-left: 5px solid #1677ff;
  display: flex;
  padding: 10px;
  margin-bottom: 10px;
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
.van-steps {
  .content-box {
    display: flex;
    .avatar {
      height: 30px;
      aspect-ratio: 1 / 1;
      border-radius: 50%;
      margin: 0 20px;
      flex-grow: 0;
    }
    .box {
      flex-grow: 1;
      border: 1px solid #8d8d8d;
      box-shadow: 0 0 5px #ccc;
      padding: 5px;
      border-radius: 5px;
      .name-opinion {
        display: flex;
        justify-content: space-between;
        .name {
          font-weight: 600;
        }
        .opinion {
          color: #4ec23d;
        }
      }
      .content {
        padding: 10px;
        margin: 10px 0;
        background-color: #f4f5f7;
      }
    }
  }
}

.recover-btn {
  position: fixed;
  box-sizing: content-box;
  /* position: fixed; */
  bottom: 0;
  left: 0;
  z-index: 0;
  width: calc(100% - 40px);
  .van-button {
    width: 45%;
  }
  & > div {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
}
</style>
