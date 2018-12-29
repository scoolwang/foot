const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  const {OPENID} = cloud.getWXContext()
  try {
    return await db.collection('user').where({
      account: event.account
    })
      .update({
        data: {
          openId: OPENID,
          img: event.img,
          nick: event.nick
        }
      })
  } catch (e) {
    console.error(e)
  }
}
