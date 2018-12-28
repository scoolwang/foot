const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  const {OPENID} = cloud.getWXContext()
  try {
    let result = ''
    const col = db.collection('step')
    const isExit = await col.where({
      openId: OPENID,
      time: event.time
    }).get()
    // return isExit
    console.log(isExit)
    if (isExit.data.length > 0) {
      return await col.where({
        openId: OPENID,
        time: event.time
      }).update({
        data: {
          step: event.step
        }
      })
    } else {
      return await col.add({
        data: {
          openId: OPENID,
          time: event.time,
          step: event.step
        }
      })
    }
  } catch (e) {
    console.error(e)
  }
}
