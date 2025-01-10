import * as dd from 'dingtalk-jsapi'
import { loginApi } from '@/api/sys'

export const requestLogin = () => {
  return new Promise((resolve, reject) => {
    dd.getAuthCode({
      corpId: 'dingbb84806e22b02664a1320dcb25e91351',
      clientId: 'ding44qiejdpfeezamy1',
      onSuccess: async function (res: any) {
        try {
          const result = await loginApi(res.code)
          await saveInfo(result.data)
          resolve(result)
        } catch (e) {
          console.log(e)
          reject(e)
        }
      },
      onFail: function (err: any) {
        dd.alert({
          title: '登录提示',
          content: '当前用户验证失败，' + JSON.stringify(err),
          buttonText: '确定',
        })
        reject()
      },
    })
  })
}

const saveInfo = (userInfo: any) => {
  return new Promise((resolve, reject) => {
    const { token: IdeaToken, ...IdeaUser } = userInfo
    localStorage.setItem('IdeaToken', IdeaToken)
    localStorage.setItem('IdeaUser', JSON.stringify(IdeaUser))
    resolve(userInfo)
  })
}
