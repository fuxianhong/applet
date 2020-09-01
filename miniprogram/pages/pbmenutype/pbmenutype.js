import {
  dbGet,
  dbAdd,
  dbRemove,
  dbUpdate
} from '../../utils/db'
Page({
  data: {
    list: [],
    add: false,
    alter: false,
    valueAdd: "",
    valueAlter: "",
    upId: ''
  },
  onLoad() {
    this.get()
  },
  onShow(condition) {
    this.get();
    this.setData({
      valueAdd:'',
      valueAlter:''
    })
    if (condition) {
      this.setData({
        alter: false
      })
    }
  },
  get() {
    dbGet('menuType').then(res => {
      this.setData({
        list: res.data
      })
    })
  },
  //添加显示
  fladd() {
    this.setData({
      add: true,
      alter: false
    })
  },
  //修改显示
  flalter(e) {
    this.setData({
      add: false,
      alter: true,
      upId: e.target.id
    })
    dbGet('menuType', {
      "_id": e.target.id
    }).then(res => {
      this.setData({
        inputAlter: res.data[0].typeName
      })
    })
  },
  //删除
  flremove(e) {
    wx.showModal({
      title: '是否确认删除',
      success: res => {
        if (res.confirm) {
          dbRemove('menuType', e.target.id).then(res => {
            this.toast(true, '删除')
            //页面更新
            this.onShow(true);
          }, err => {
            this.toast(false, '删除')
          })
        }
      }
    })
  },
  //添加input框值
  inputAdd(e) {
    this.setData({
      valueAdd: e.detail.value,
    })
  },
  //添加
  typeAdd() {
    var obj = {
      typeName: this.data.valueAdd,
      addtime: new Date().getTime()
    }
    if (this.data.valueAdd) {
      dbAdd('menuType', obj).then(res => {
        this.toast(true, '添加')
        //页面更新
        this.onShow();
      }, err => {
        this.toast(false, '添加')
      })
    }
  },
  //修改input框值
  inputAlter(e) {
    this.setData({
      valueAlter: e.detail.value
    })
  },
  //修改
  typeAlter() {
    dbUpdate('menuType', this.data.upId,{data:{"typeName": this.data.valueAlter}}).then(res => {
      this.toast(true, '修改')
      //页面更新 
      this.onShow(true);
    }, err => {
      this.toast(false, '修改')
    })
  },
  toast(condition, name) {
    if (condition) {
      return wx.showToast({
        title: name + '成功',
      })
    } else {
      return wx.showToast({
        title: name + '失败',
        icon: none
      })
    }
  }
})