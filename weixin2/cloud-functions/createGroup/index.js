// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  const {OPENID} = cloud.getWXContext()
  try {
    let result = ''
    const col = db.collection('group')
    let group = await col.where({
      name: event.name
    }).get()
    group = group.data
    if (group.length > 0) {
      return await new Promise((resolve, reject) => {
        resolve({
          errorMsg: '组名已存在～'
        })
      })
    }
    console.log('创建小组: ' + OPENID)
    return await col.add({
      data: {
        creator: OPENID,
        openIds: [OPENID],
        name: event.name
      }
    })
  } catch (e) {
    console.error(e)
  }
}
