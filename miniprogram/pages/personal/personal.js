const app = getApp();
const db = wx.cloud.database();
import {
  dbGet,
  dbRemove
} from '../../utils/db'
Page({
  data: {
    userInfo: null,
    num: 0,
    openId: null,
    typeList: [],
    recipeList: [],
    guanzhuList: [],
    pageSize: 6,
    page: 0
  },
  onLoad() {
    if (app.globalData.userInfo) {
      wx.setStorageSync('userInfo', app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      app.userInfoReadyCallback = res => {
        wx.setStorageSync('userInfo', res)
        this.setData({
          userInfo: res
        })
      }
    }
    var {
      page,
      pageSize
    } = this.data
    this.getRecipeList(wx.getStorageSync('openid'), page, pageSize);
  },
  onShow() {
    this.getGuanzhu();
  },
  onReachBottom() {
    if (this.data.num == 0) {
      this.data.page += 1;
      var {
        page,
        pageSize
      } = this.data;
      this.getRecipeList(wx.getStorageSync('openid'), page, pageSize);
    }
  },
  //获取自己发布菜单
  getRecipeList(openid, page, pageSize) {
    wx.showLoading({
      title: '加载中',
    })
    db.collection("menu").where({
      "_openid": openid
    }).skip(page * pageSize).limit(pageSize).get().then(res => {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      this.setData({
        recipeList: this.data.recipeList.concat(res.data)
      })
    })
  },
  //获取关注列表
  async getGuanzhu() {
    var arr = [];
    dbGet('follow', {
      "_openid": wx.getStorageSync('openid')
    }).then(res => {
      var arr2 = res.data;
      arr2.forEach(item => {
        var getData = dbGet('menu', {
          "_id": item.menuId
        })
        arr.push(getData)
      })
      Promise.all(arr).then(res => {
        var arr = res.map(item => {
          return item.data[0]
        })
        this.setData({
          guanzhuList: arr
        })
      })
    })
  },
  //获取用户信息
  getUser(e) {
    wx.setStorageSync('userInfo', e.detail.userInfo)
    this.setData({
      userInfo: e.detail.userInfo
    })
  },
  //页面选项卡内容
  change(e) {
    this.setData({
      num: e.target.id
    })
  },
  //菜单添加
  pbmenu() {
    wx.navigateTo({
      url: '../pbmenu/pbmenu',
    })
  },
  //管理员分类添加
  fbcpfl() {
    if (app.globalData.userId.openId == "orxje4tDpw-Lf1C9VoxRaRruuTiQ") {
      wx.navigateTo({
        url: '../pbmenutype/pbmenutype',
      })
    }
  },
  //删除
  delCdlb(e) {
    wx.showModal({
      title: '是否确认删除',
      success: res => {
        if (res.confirm) {
          var arr = this.data.recipeList.filter(item => {
            return item['_id'] == e.currentTarget.dataset.id
          })
          wx.cloud.deleteFile({
            fileList: arr[0].fileIds
          })
          dbRemove("menu", e.currentTarget.dataset.id)
          //删除图片
          this.data.recipeList.splice(e.currentTarget.dataset.index, 1)
          //删除关注
          db.collection('follow').where({
            'menuId': e.currentTarget.dataset.id
          }).remove()
          this.getGuanzhu();
          this.setData({
            recipeList: this.data.recipeList
          })
        }
      }
    })
  },
  //跳转
  skip(e) {
    wx.navigateTo({
      url: '../recipeDetail/recipeDetail?id=' + e.target.id,
    }).then(res => {
      wx.showLoading({
        title: '加载中',
      })
    })
  }
})