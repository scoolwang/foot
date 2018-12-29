/** 获取用户信息 */
function getUserInfo () {
  return new Promise((resolve, reject) => {
    let info = wx.getStorageSync('userInfo')
    if (!info) {
      wx.getUserInfo({
        success (res) {
          console.log(res)
          info = res.userInfo
          wx.setStorageSync('userInfo', info)
          wx.login({
            success (res) {
              const code = res.code
              const appid = 'wxe37b540617a53b3a'
              const secret = '30bb58edaaa9f9ab979c8e7d121d4bbe'
              wx.request({
                url: 'https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code',
                _unintercept: true,
                data: {
                  appid: appid,
                  secret: secret,
                  js_code: code,
                  grant_type: 'authorization_code'
                },
                success (res) {
                  let openId = res.data.openid
                  wx.setStorageSync('session_key', res.data.session_key)
                  console.log('登录成功')
                  info.openId = openId
                  console.log(openId)
                  wx.setStorageSync('userInfo', info)
                  resolve(info)
                },
                complete (res) {
                  console.log('登录完成', res)
                  // loginValid(res)
                }
              })
            }
          })
        },
        fail (res) {
          console.log('用户信息获取失败', res)
          reject(res)
        }
      })
    } else {
      resolve(info)
    }
  })
}
module.exports = {
  getUserInfo
}
