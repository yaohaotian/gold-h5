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
  pics: any[]
  files: any[]
}

export interface IdeaDetail {
  id: number
  subject: string
  catalog: string
  detail: string
  longitude: number
  latitude: number
  location: string
  showLocation: string
  creator: string
  creatorAvatar: string
  creatorName: string
  createTime: string
  modifyTime: string
  approveState: string
  commentCount: number
  likeCount: number
  collectCount: number
  liked: boolean
  collected: boolean
  acceptMessage: string
  acceptCreator: string
  acceptCreatorName: string
  acceptCreatorAvatar: string
  acceptCreateTime: string
  anonymous: boolean
  isPublic: number
  comment?: any[]
  pics: any[]
  files: any[]
}

export interface MyDetail {
  nickName: string
  avatar: string
  totalCount: number
  unSubmitCount: number
  approvingCount: number
  confirmingCount: number
  publishedCount: number
  rejectCount: number
  points: number
  ideas: Idea[]
}
