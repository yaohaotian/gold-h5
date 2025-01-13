import request from '@/utils/request'
import * as dd from 'dingtalk-jsapi'
/**
 * 用户登录
 *
 * @param code 免登授权码
 */
export const loginApi = (code: string) => {
  return request.post('/auth/login', { code })
}

// 上传文件
export const uploadFile = (data: any) =>
  request.post('/file/upload', data, true)
// }

// 查询点子
export const reqIdeaList = (params: any) => request.get('/idea', params)

// 新增点子
export const reqAddNewIdea = (data: any) => request.post('/idea', data)

// 点赞点子
export const reqPraiseIdea = (ideaId: any) =>
  request.post('/idea/like', { ideaId })

// 获取点子评论
export const reqIdeaCommentList = (ideaId: any) =>
  request.get(`/idea/comment`, { ideaId })

// 评论点子
export const reqCommentIdea = (data: any) => request.post('/idea/comment', data)

// 得到点子详情
export const reqIdeaDetail = (ideaId: any) => request.get(`/idea/${ideaId}`)

/**
 * 审批点子
 *
 * @param {object} data { ideaId: 0, approve: 'PASS' | 'Reject', message: '' }
 * @returns
 */
export const reqApproveIdea = (data: any) => request.post('/idea/approve', data)

// 板块管理回复点子（拒绝）
export const replyApproveIdea = (data: any) =>
  request.post('/idea/comment/back', data)

// 板块管理采纳点子
export const acceptApproveIdea = (data: any) =>
  request.post('/idea/approve/accept', data)

// 副主任通过
export const acceptMiddleApproveIdea = (data: any) =>
  request.post('/idea/approve/accept_confirm', data)

// 获取关于我的信息
export const reqMyIdea = () => request.get('/idea/my')

// 获取关于板块管理员审批list信息
export const reqApproveIdeaList = () => request.get('/idea/my-approve')

// 获取关于副主任审批list信息
export const middleApproveIdeaList = () =>
  request.get('/idea/my-middle-approve')

// 获取关于终审审批list信息
export const finalApproveIdeaList = () => request.get('/idea/my-final-approve')

// 获取点子审批信息
export const reqIdeaApproval = (ideaId: any) =>
  request.get(`/idea/approve/${ideaId}`)

// 收藏点子
export const reqCollectIdea = (ideaId: any) =>
  request.post('/idea/collect', { ideaId })

// 获取点子收藏列表
export const reqCollectIdeaList = () => request.get('/idea/collect')

// 获取部门标签列表
export const reqDepartmentList = () => request.get('/idea/catalog')

// 获取当前用户的空间列表
export const reqDingSpace = () => request.get('/ding/spaces')

// 获取钉钉自定义空间id
export const reqDingCustomSpaceId = () => request.get('/ding/custom-space')

// 删除点子
export const reqDeleteIdea = (ideaId: any) =>
  request.post(`/idea/delete/${ideaId}`)

// 删除点子评论
export const reqDeleteIdeaComment = (commentId: any) =>
  request.post(`/idea/comment/delete/${commentId}`)
