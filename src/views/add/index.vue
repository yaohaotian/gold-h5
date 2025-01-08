<script lang="ts" setup>
import { ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { showSuccessToast } from 'vant'
import { reqDepartmentList, reqAddNewIdea } from '@/api/sys'

import Navbar from '@/components/Navbar.vue'

const router = useRouter()

const formData = ref({
  subject: '',
  catalog: '',
  detail: '',
  longitude: '',
  latitude: '',
  location: '',
  anonymous: '',
  pics: [],
  files: [],
})

const { subject, catalog, detail, anonymous, pics, files } = toRefs(
  formData.value,
)

const showPicker = ref(false)

const departmentList = ref<any[]>([])

onMounted(() => {
  getDepartmentList()
})

const getDepartmentList = async () => {
  const result = await reqDepartmentList()
  departmentList.value = result.data.map((i: any) => ({
    text: i.name,
    value: i.name,
  }))
}

const onConfirm = ({ selectedOptions }: any) => {
  catalog.value = selectedOptions[0]?.text
  showPicker.value = false
}

const confirm = async (directSave: boolean) => {
  try {
    await reqAddNewIdea({
      ...formData.value,
      submitType: directSave ? 'SUBMIT' : 'TEMP_SAVE',
    })
    showSuccessToast('保存成功,即将回到首页')
    setTimeout(() => {
      router.push('/')
    }, 1000)
  } catch (error) {}
}

const onFailed = (errorInfo: any) => {
  console.log('failed', errorInfo)
}
</script>

<template>
  <Navbar title="新增点子" />
  <van-form @failed="onFailed">
    <van-cell-group inset>
      <van-field
        v-model="catalog"
        is-link
        readonly
        name="picker"
        label="点子类型"
        placeholder="请选择点子类型"
        @click="showPicker = true"
      />
      <van-field
        v-model="subject"
        autosize
        label="标题"
        maxlength="140"
        placeholder="请输入标题"
      />
      <!-- 通过 validator 返回错误提示 -->
      <van-field
        v-model="detail"
        rows="4"
        autosize
        label="描述"
        type="textarea"
        maxlength="140"
        placeholder="请输入描述"
        show-word-limit
      />
      <van-field name="pics" label="图片">
        <template #input>
          <van-uploader v-model="pics" />
        </template>
      </van-field>
      <van-field name="anonymous" label="匿名发布">
        <template #input>
          <van-switch v-model="anonymous" />
        </template>
      </van-field>
      <van-field name="files" label="附件">
        <template #input>
          <van-uploader v-model="files">
            <van-button icon="plus" type="primary"> 上传文件 </van-button>
          </van-uploader>
        </template>
      </van-field>
      <!-- 通过 validator 进行异步函数校验 -->
    </van-cell-group>
    <van-popup v-model:show="showPicker" destroy-on-close position="bottom">
      <van-picker
        :columns="departmentList"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
    <div class="submit-btn" style="margin: 16px">
      <van-button round block native-type="submit" @click="confirm(false)">
        暂存
      </van-button>
      <van-button
        round
        block
        type="primary"
        native-type="submit"
        @click="confirm(true)"
      >
        提交
      </van-button>
    </div>
  </van-form>
</template>

<style lang="less" scoped>
.submit-btn {
  display: flex;
  justify-content: space-between;
  box-sizing: content-box;
  /* position: fixed; */
  bottom: 0;
  left: 0;
  z-index: 9999;
  width: calc(100% - 40px);
  .van-button {
    width: 45%;
  }
}
</style>
