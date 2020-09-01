const db = wx.cloud.database();
//集合获取
async function dbGet(_collection="",_where={}){
  return await db.collection(_collection).where(_where).get()
}
//集合添加
async function dbAdd(_collection="",_add){
 return await db.collection(_collection).add({data:_add})
}
//删除集合
async function dbRemove(_collection="",_id){
  return await db.collection(_collection).doc(_id).remove()
}
//修改集合
async function dbUpdate(_collection="",_id,_update){
  return await db.collection(_collection).doc(_id).update(_update)
}
export {dbGet,dbAdd,dbRemove,dbUpdate}