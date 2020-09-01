var db = wx.cloud.database();
Page({
  data: {
    list: [],
    valueArr: []
  },
  onLoad(e) {
    if (e.id) {
      db.collection("menu").where({
        typeId: e.id
      }).get().then(res => {
        wx.hideLoading()
        this.load(res)
      })
    } else if(e.hot){
      db.collection('menu').orderBy("views", "desc").limit(9).get().then(res => {
        this.load(res)
        this.setData({
          list: res.data
        })
      })
    } 
    else {
      //正则查询
      db.collection("menu").where({
        menuName: db.RegExp({
          regexp: e.name,
          options: 'i',
        })
      }).get().then(res => {
        wx.hideLoading()
        this.load(res)
      })
    }
    wx.setNavigationBarTitle({
      title: e.name,
    })
  },
  //加载评价与列表
  load(res) {
    var arr = res.data.map(item => {
      return Math.floor(item.views / 10)
    })
    this.setData({
      list: res.data,
      valueArr: arr
    })
  },
  urlDetail(e) {
    wx.navigateTo({
      url: '../recipeDetail/recipeDetail?id=' + e.target.id,
    })
  }
})