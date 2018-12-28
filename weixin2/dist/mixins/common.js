'use strict';

/** 获取用户信息 */
function getUserInfo() {
  return new Promise(function (resolve, reject) {
    var info = wx.getStorageSync('userInfo');
    if (!info) {
      wx.getUserInfo({
        success: function success(res) {
          console.log(res);
          info = res.userInfo;
          wx.setStorageSync('userInfo', info);
          resolve(info);
        },
        fail: function fail(res) {
          console.log('用户信息获取失败', res);
          reject(res);
        }
      });
    } else {
      resolve(info);
    }
  });
}
module.exports = {
  getUserInfo: getUserInfo
};