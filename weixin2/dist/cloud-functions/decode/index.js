// 云函数入口文件
const cloud = require('wx-server-sdk')
var crypto = require('crypto')

function WXBizDataCrypt(appId, sessionKey) {
  this.appId = appId
  this.sessionKey = sessionKey
}

WXBizDataCrypt.prototype.decryptData = function (encryptedData, iv) {
  // base64 decode
  var sessionKey = new Buffer(this.sessionKey, 'base64')
  encryptedData = new Buffer(encryptedData, 'base64')
  iv = new Buffer(iv, 'base64')

  try {
     // 解密
    var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true)
    var decoded = decipher.update(encryptedData, 'binary', 'utf8')
    decoded += decipher.final('utf8')

    decoded = JSON.parse(decoded)

  } catch (err) {
    throw new Error('Illegal Buffer')
  }

  if (decoded.watermark.appid !== this.appId) {
    throw new Error('Illegal Buffer')
  }

  return decoded
}

cloud.init()
exports.main = async (event, context) => new Promise((resolve, reject) => {
  const {OPENID, APPID} = cloud.getWXContext()
  var wd = new WXBizDataCrypt(APPID, event.c)
  var list = wd.decryptData(event.a, event.b)
  // 在 3 秒后返回结果给调用方（小程序 / 其他云函数）
  setTimeout(() => {
    resolve(list)
  }, 500)
})
