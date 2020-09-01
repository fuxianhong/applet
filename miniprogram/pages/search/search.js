const db = wx.cloud.database();
Page({
  data: {
    value: "",
    hotBot: [],
    myRecord: []
  },
  onLoad() {
    db.collection('menu').orderBy("views", "desc").limit(9).get().then(res => {
      this.setData({
        hotBot: res.data
      })
    })
    this.setData({
      myRecord: wx.getStorageSync('myRecord')
    })
  },
  search() {
    //用户搜索记录缓存
    if (wx.getStorageSync('myRecord')) {
      let arr = wx.getStorageSync('myRecord');
      let index = arr.indexOf(this.data.value);
      if (index != '-1' ) {
        arr.splice(index, 1)
      }else if(arr.lenth > 10){
        arr.splice(8, 1)
      }
      arr.unshift(this.data.value);
      wx.setStorageSync('myRecord', arr);
      this.setData({
        myRecord: arr
      })
    } else {
      let arr = [];
      arr.push(this.data.value);
      wx.setStorageSync('myRecord', arr);
    }
    wx.navigateTo({
      url: '../recipelist/recipelist?name=' + this.data.value,
    }).then(res=>{
      wx.showLoading({
        title: '加载中',
      })
    })
  },
  Skip(e) {
    wx.navigateTo({
      url: '../recipelist/recipelist?name=' + e.target.dataset.name
    }).then(res=>{
      wx.showLoading({
        title: '加载中',
      })
    })
  }
})