async function imgUpload(tempFilePaths) {
  var arr = []
  tempFilePaths.forEach(item => {
    var time = new Date().getTime()
    var extName = item.slice(item.lastIndexOf('.'))
    var promise = wx.cloud.uploadFile({
      cloudPath: 'menuImg/' + time + extName,
      filePath: item,
    })
    arr.push(promise)
  })
  return await Promise.all(arr)
}
export {
  imgUpload
}