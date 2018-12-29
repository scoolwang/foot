// 云函数入口文件
const cloud = require('wx-server-sdk')
var request = require('request')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const appid = wxContext.APPID
  const openid = wxContext.OPENID
  const secret = '30bb58edaaa9f9ab979c8e7d121d4bbe'
  const code = event.code
  const url = {
    url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code'
  }
  var pms = new Promise((resove, reject) => {
    request(url, function (err, res, body) {
      console.log('获取openId')
      console.log(res.body)
      if (!err) {
        resove({
          data: res.body
        })
      } else {
        reject({
          errorMsg: '获取失败'
        })
      }
    })
  })
  // const session = JSON.parse(req);
  // const sessionKey = session.session_key;
  // const data = {
  //   openId: openId,
  //   sessionKey: sessionKey
  // }
  return pms
}
