import {
  dbGet,
  dbUpdate,
  dbAdd,
  dbRemove
} from '../../utils/db'
var db = wx.cloud.database()
var app = getApp();
Page({
  data: {
    detail: null,
    guanzhu: false,
    id: "",
    collectNum: 0,
    userInfo: null
  },
  onLoad(e) {
    //获取登录情况
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    //详情获取
    dbGet('menu', {
      "_id": e.id
    }).then(res => {
      wx.hideLoading()
      wx.setNavigationBarTitle({
        title: res.data[0].menuName,
      })
      var obj = res.data[0];
      obj.views = obj.views + 1
      this.setData({
        detail: obj,
        id: e.id,
      })
      //浏览修改
      dbUpdate('menu', e.id, {
        data: {
          "views": res.data[0].views
        }
      })
    })
    //是否收藏与收藏人数
    dbGet('follow', {
      "menuId": e.id
    }).then(res => {
      this.setData({
        collectNum: res.data.length
      })
      var whether = res.data.some(item => item['_openid'] == wx.getStorageSync('openid'));
      if (this.data.userInfo) {
        if (whether) {
          if (this.data.userInfo) {
            this.setData({
              guanzhu: true
            })
          }
        }
      }
    })
  },
  //关注点击
  guanzhu() {
    if (this.data.userInfo) {
      //点击关注状态变换
      this.setData({
        guanzhu: !this.data.guanzhu
      })
      var time = new Date().getTime();
      //通过guanzhu的值判断对其操作
      if (this.data.guanzhu) {
        dbAdd('follow', {
          menuId: this.data.id,
          addtime: time
        }).then(res => {
          wx.showToast({
            title: '关注成功',
            mask: true
          })
          this.addReduce(1)
        })
      } else {
        dbGet('follow', {
          "_openid": wx.getStorageSync('openid')
        }).then(res => {
          db.collection('follow').where({menuId:this.data.id}).remove();
        })
        this.addReduce(-1)
      }
    } else {
      wx.switchTab({
        url: '../personal/personal',
      }).then(res => {
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        })
      })
    }
  },
  addReduce(num) {
    this.setData({
      collectNum: Number(this.data.collectNum) + Number(num)
    })
  }
})