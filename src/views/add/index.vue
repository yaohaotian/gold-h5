<script lang="ts" setup>
import { ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { showSuccessToast } from 'vant'
import { Icon } from '@iconify/vue'
import {
  reqDepartmentList,
  reqAddNewIdea,
  uploadFile,
  reqDingCustomSpaceId,
} from '@/api/sys'
import * as dd from 'dingtalk-jsapi'

import Navbar from '@/components/Navbar.vue'

const router = useRouter()

const spaceId = ref('')

const formData = ref<any>({
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
  getLocation()
  getDepartmentList()
  getDingCustomSpaceId()
})

const getLocation = () => {
  dd.getLocation({
    success: (res: any) => {
      formData.value.longitude = res.longitude
      formData.value.latitude = res.latitude
      formData.value.location = `${res.longitude},${res.latitude}`
    },
    fail() {
      console.log('获取位置失败')
    },
  } as any)
}

const getDingCustomSpaceId = async () => {
  const result = await reqDingCustomSpaceId()
  spaceId.value = result.data
}

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

const asyncBeforeRead: any = (file: File): Promise<File> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { name: fileName } = file
      const res = await uploadFile({ file, fileName })
      file.message = res.data
      resolve(file)
    } catch (error) {
      reject(error)
    }
  })
}

const beforeFileUpload = (file: File) => {
  return new Promise((resolve, reject) => {
    try {
      dd.biz.util.uploadAttachment({
        image: {
          multiple: true,
          compress: false,
          max: 9,
          spaceId: spaceId.value,
        },
        space: { spaceId: spaceId.value, isCopy: 1, max: 9 },
        file: { spaceId: spaceId.value, max: 9 },
        types: ['photo', 'camera', 'file', 'space'], //PC端支持["photo","file","space"]
        onSuccess: function (result) {
          console.log(result)
        },
        onFail: function (err) {},
      })
      resolve(file)
    } catch (error) {
      reject(error)
    }
  })
}

const confirm = async (directSave: boolean) => {
  try {
    await reqAddNewIdea({
      ...formData.value,
      pics: pics.value.map((i: any) => i.file.message),
      files: files.value.map((i: any) => i.file.message),
      submitType: directSave ? 'SUBMIT' : 'TEMP_SAVE',
    })
    showSuccessToast(`${directSave ? '提交' : '暂存'}成功,即将回到首页`)
    setTimeout(() => {
      router.push('/')
    }, 500)
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
          <van-uploader v-model="pics" :before-read="asyncBeforeRead" />
        </template>
      </van-field>
      <van-field name="anonymous" label="匿名发布">
        <template #input>
          <van-switch v-model="anonymous" />
        </template>
      </van-field>
      <van-field name="files" label="附件">
        <template #input>
          <van-uploader
            v-model="files"
            :preview-image="false"
            :before-read="beforeFileUpload"
          >
            <van-button icon="plus" type="primary"> 上传文件 </van-button>
          </van-uploader>
          <div
            v-for="(file, index) in files"
            :key="index"
            class="upload-file-box"
          >
            <span class="file-name">{{ file.file.name }}</span>
            <Icon
              icon="carbon:close-outline"
              width="24"
              height="24"
              @click="files.splice(index, 1)"
            />
          </div>
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
:deep(.van-field__control) {
  display: block;
  .upload-file-box {
    display: flex;
    max-width: 100%;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 5px;
    color: #22a7f2;
    border-radius: 5px;
    border: 2px solid #22a7f2;
    font-weight: bold;
    margin: 5px 0;
    .file-name {
      width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
