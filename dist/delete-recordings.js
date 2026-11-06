// SPDX-License-Identifier: Apache-2.0
export const selectedRecordings=(records,ids)=>records.filter(record=>ids.has(record.id));

// One IndexedDB transaction: an error leaves every persistent recording intact.
// Selection for deletion is separate from selection for acoustic comparison.
export function deleteStoredRecordings(database,records){
  const stored=records.filter(record=>!record.demo);
  if(!stored.length)return Promise.resolve();
  if(!database)return stored.every(record=>record.unsaved)?Promise.resolve():Promise.reject(Error('本地数据库不可用，未删除录音'));
  return new Promise((resolve,reject)=>{
    const tx=database.transaction('recordings','readwrite'),store=tx.objectStore('recordings');
    tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error||Error('批量删除失败'));tx.onabort=()=>reject(tx.error||Error('批量删除已取消'));
    try{for(const record of stored)store.delete(record.id);}catch(error){tx.abort();reject(error);}
  });
}
