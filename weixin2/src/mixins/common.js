/** 获取用户信息 */
function getUserInfo () {
  return new Promise((resolve, reject) => {
    let info
    wx.getUserInfo({
      success (res) {
        console.log(res)
        info = res.userInfo
        wx.setStorageSync('userInfo', info)
        wx.login({
          success (res) {
            const code = res.code
            wx.cloud.callFunction({
              name: 'getOpenId',
              data: {
                code: code
              },
              success: res => {
                let data = JSON.parse(res.result.data)
                console.log('获取openId', data)
                let openId = data.openid
                wx.setStorageSync('session_key', data.session_key)
                info.openId = openId
                wx.setStorageSync('userInfo', info)
                resolve(info)
              },
              fail: res => {
                let str = JSON.stringify(res)
                reject({
                  error: str
                })
              }
            })
            // wx.request({
            //   url: 'https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code',
            //   _unintercept: true,
            //   data: {
            //     appid: appid,
            //     secret: secret,
            //     js_code: code,
            //     grant_type: 'authorization_code'
            //   },
            //   success (res) {
            //     let openId = res.data.openid
            //     wx.setStorageSync('session_key', res.data.session_key)
            //     console.log('登录成功')
            //     info.openId = openId
            //     console.log(openId)
            //     wx.setStorageSync('userInfo', info)
            //     resolve(info)
            //   },
            //   fail () {
            //     reject({
            //       openId: '获取失败'
            //     })
            //   },
            //   complete (res) {
            //     console.log('登录完成', res)
            //     // loginValid(res)
            //   }
            // })
          },
          fail () {
            reject({
              openId: '获取失败'
            })
          }
        })
      },
      fail (res) {
        console.log('用户信息获取失败', res)
        reject(res)
      }
    })
  })
}
module.exports = {
  getUserInfo
}
