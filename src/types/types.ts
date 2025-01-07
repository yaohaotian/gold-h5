export interface Idea {
  id?: number
  subject?: string
  catalog?: string
  detail?: string
  longitude?: number
  latitude?: number
  location?: string
  showLocation?: string
  creator?: string
  creatorAvatar?: string
  creatorName?: string
  createTime?: string
  modifyTime?: null
  approveState?: string
  commentCount?: number
  likeCount?: number
  collectCount?: number
  acceptMessage?: string
  acceptCreator?: string
  acceptCreateTime?: string
  anonymous?: boolean
  isPublic?: number
  // pics: [
  //   {
  //     id: 23
  //     ideaId: 26
  //     attachType: 'PIC'
  //     name: null
  //     path: 'https://zdwp.oss-cn-hangzhou.aliyuncs.com/upload/idea/0ce9f73a42c446ae9901b77859337441.image'
  //     createTime: '2025-01-06T08:35:00.888465Z'
  //   },
  // ]
  // files: []
}
