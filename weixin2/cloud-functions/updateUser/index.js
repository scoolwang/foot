const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  const {OPENID} = cloud.getWXContext()
  try {
    let result = ''
    const col = db.collection('user')
    const isExit = await col.where({
      openId: OPENID
    }).get()
    // return isExit
    console.log(isExit)
    if (isExit.data.length > 0) {
      return await col.where({
        openId: OPENID
      }).update({
        data: {
          nick: event.nick,
          img: event.img
        }
      })
    } else {
      return {
        errorMsg: 1
      }
    }
  } catch (e) {
    console.error(e)
  }
}
