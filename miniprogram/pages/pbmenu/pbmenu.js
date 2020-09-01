import {
  dbGet,
  dbAdd
} from '../../utils/db'
import {
  imgUpload
} from '../../utils/imgUploading'
const app = getApp();
Page({
  data: {
    imgList: [],
    typeList: []
  },
  onLoad() {
    //获取分类菜谱
    dbGet('menuType').then(res => {
      this.setData({
        typeList: res.data
      })
    })
  },
  //图片显示
  bindselect(e) {
    var imgList = e.detail.tempFilePaths.map(item => {
      return {
        "url": item
      }
    })
    this.setData({
      imgList
    })
  },
  //发布
  async fbcd(e) {
    var addtime = new Date().getTime();
    var {
      menuName,
      desc,
      typeId
    } = e.detail.value;
    var {
      nickName,
      avatarUrl
    } = app.globalData.userInfo
    var fileIdsArr = this.data.imgList.map(item => {
      return item.url
    })
    var imgs = await imgUpload(fileIdsArr);
    var fileIds = imgs.map(item => {
      return item.fileID
    })
    var menuAdd = {
      menuName,
      fileIds,
      desc,
      addtime,
      nickName,
      avatarUrl,
      follows: 0,
      views: 0,
      typeId
    }
    //数据库添加
    dbAdd('menu', menuAdd).then(res => {
      wx.showToast({
        title: '添加成功',
        mask:true
      }).then(res=>{
        wx.switchTab({
          url: '../index/index',
        });
      });
    })
  }
})