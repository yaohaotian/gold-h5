<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'

import type { IdeaDetail } from '@/types/types'

import {
  reqIdeaDetail,
  reqPraiseIdea,
  reqCollectIdea,
  reqIdeaCommentList,
} from '@/api/sys'
import { fmtTime } from '@/utils'

import Navbar from '@/components/Navbar.vue'
import NameTime from '@/components/NameTime.vue'
import Divider from '@/components/Divider.vue'
import catalog from '@/components/catalog.vue'

const params = useRoute().params

const detail = ref<IdeaDetail>()

const recoverShow = ref(false)

const adoptShow = ref(false)

const formData = ref({
  approve: null,
  content: '',
  detail: '',
  isPublic: 1,
  message: '',
})

onMounted(() => {
  getIdeaDetail()
})
const getIdeaDetail = async () => {
  const result = await reqIdeaDetail(params.id)
  detail.value = result.data
  getIdeaCommentList()
}

const getIdeaCommentList = async () => {
  const result = await reqIdeaCommentList(params.id)
  detail.value!.comment = result.data
}

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
</script>

<template>
  <navbar title="详情" />
  <div class="detail">
    <h4>
      <catalog :name="detail?.catalog" />
      <span>{{ detail?.subject }}</span>
    </h4>
    <nameTime
      class="name-time"
      :creator-avatar="detail?.creatorAvatar"
      :creator-name="detail?.creatorName"
      :create-time="detail?.createTime"
    />
    <p class="detail-content">
      {{ detail?.detail }}
    </p>
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

  <div v-for="(i, index) in detail?.comment" :key="index" class="comment">
    <img class="avatar" :src="i?.commentUserAvatar" />
    <div>
      <div class="name">
        {{ i?.commentNickName }}
      </div>
      <p class="content">
        {{ i?.content }}
      </p>
      <div class="time">
        {{ fmtTime(i?.commentTime) }}
      </div>
    </div>
  </div>

  <div class="recover-btn" style="margin: 16px">
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

  <van-dialog v-model:show="recoverShow" title="回复内容" show-cancel-button>
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

  <van-dialog v-model:show="adoptShow" title="采纳意见" show-cancel-button>
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
</template>

<style lang="less" scoped>
.detail {
  h4 {
    padding-top: 20px;
    margin-top: 0;
  }
  padding: 0 20px;
  background-color: #fff;
  margin-bottom: 10px;
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

.recover-btn {
  position: fixed;
  display: flex;
  justify-content: space-between;
  box-sizing: content-box;
  /* position: fixed; */
  bottom: 0;
  left: 0;
  z-index: 0;
  width: calc(100% - 40px);
  .van-button {
    width: 45%;
  }
}
</style>
