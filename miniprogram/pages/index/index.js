import {
  dbGet
} from '../../utils/db'
const db = wx.cloud.database();
Page({
  data: {
    list: [],
    page: 0,
    pageSize: 6
  },
  onLoad() {
    var {
      page,
      pageSize
    } = this.data
    this.getList(page, pageSize)
  },
  //上拉刷新
  onPullDownRefresh(){
    this.data.page = 0;
    var {page,pageSize} = this.data;
    wx.showLoading({
      title: '加载中',
    })
    db.collection("menu").skip(page * pageSize).limit(pageSize).get().then(res => {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      this.setData({
        list: res.data
      })
    })
  },
  //下拉刷新
  onReachBottom() {
    this.data.page +=1
    var {
      page,
      pageSize
    } = this.data
    this.getList(page, pageSize)
  },
  getList(page, pageSize) {
    wx.showLoading({
      title: '加载中',
    })
    db.collection("menu").skip(page * pageSize).limit(pageSize).get().then(res => {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      this.setData({
        list: this.data.list.concat(res.data) 
      })
    })
  },
  urlDetail(e) {
    wx.showLoading()
    wx.navigateTo({
      url: '../recipeDetail/recipeDetail?id=' + e.target.id,
    })
  },
  urlSearch() {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  hotBot(){
    wx.navigateTo({
      url: '../recipelist/recipelist?hot=true',
    })
  }
})