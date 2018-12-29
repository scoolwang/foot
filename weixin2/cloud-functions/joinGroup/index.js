// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 加入队伍
exports.main = async (event, context) => {
  try {
    const result = ''
    const col = db.collection('group').where({
      _id: event.id
    })
    const {OPENID} = cloud.getWXContext()
    let group =  await col.get()
    group = group.data
    console.log(group)
    console.log(OPENID)
    if (group.length <= 0) {
      return await new Promise((resolve, reject) => {
        resolve({
          errorMsg: '小组不存在'
        })
      })
    }
    group = group[0]
    let openIds = group.openIds
    console.log(openIds)
    if (openIds.indexOf(OPENID) > -1) {
      return await new Promise((resolve, reject) => {
        resolve({
          errorMsg: '已加入该小组'
        })
      })
    }

    if (openIds.length > 3) {
      return await new Promise((resolve, reject) => {
        resolve({
          errorMsg: '小组已满员'
        })
      })
    }
    openIds.push(OPENID)
    return await col.where({
      _id: event.id
    }).update({
      data: {
        openIds: openIds
      }
    })
  } catch (e) {
    console.error(e)
  }
}
