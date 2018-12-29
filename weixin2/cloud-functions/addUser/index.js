// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const {OPENID} = cloud.getWXContext()
    let user = await db.collection('user').where({
      openId: OPENID
    }).get()
    user = user.data
    console.log(user)
    console.log('新增用户id' + OPENID)
    if (user.length > 0) {
      return {
        state: 200
      }
    } else {
      return await db.collection('user').add({
        data: {
          img: event.img,
          nick: event.nick,
          openId: OPENID,
          account: '-1',
          pwd: '-1'
        }
      })
    }
  } catch (e) {
    console.log(e)
  }
}
