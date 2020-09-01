import {dbGet} from '../../utils/db'
Page({
  data:{
    typeList:[]
  },
  onLoad(){
     //获取菜谱列表
    dbGet('menuType').then(res => {
      this.setData({
        typeList: res.data
      })
    })
  },
  //列表跳转
  typeDetail(e){
    wx.navigateTo({
      url: '../recipelist/recipelist?name=' + e.target.dataset.name+'&id='+e.target.dataset.id
    }).then(res=>{
      wx.showLoading({
        title: '加载',
      })
    })
  }
})