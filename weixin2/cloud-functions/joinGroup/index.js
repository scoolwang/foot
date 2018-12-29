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
    let allGroup = await db.collection('group').get()
    const {OPENID} = cloud.getWXContext()
    let group =  await col.get()
    group = group.data
    allGroup = allGroup.data
    console.log(allGroup)
    for (let item of allGroup) {
      console.log(item)
      let itemIds = item.openIds
      if (itemIds.indexOf(OPENID) > -1 && itemIds.length === 1) {
        await db.collection('group').where({
          _id: item._id
        }).remove()
      }
    }
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
