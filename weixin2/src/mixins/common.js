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
          resolve(info)
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
