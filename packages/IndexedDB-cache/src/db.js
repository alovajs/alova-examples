
const dbVersion = 1;
let dbInstance;
const request = window.indexedDB.open('MyTestDatabase', dbVersion);
request.onupgradeneeded = ({ target }) => {  
  console.log('upgradene');
  dbInstance = target.result;
  const imgStore = dbInstance.createObjectStore('images', {
    autoIncrement: true
  });
  imgStore.createIndex('fileName', 'fileName', {
    unique: true
  });
};
request.onerror = () => {
  throw new Error('Database open fail');
};
request.onsuccess = ({ target }) => {
  dbInstance = target.result;
};

// 新增数据到IndexedDB
export const addImage2Cache = async (fileName, data) => {
  const tx = dbInstance.transaction(['images'], 'readwrite');
  const request = tx.objectStore('images').add({
    fileName,
    data
  });
  return new Promise((resolve, reject) => {
    request.onerror = () => {
      reject('data add fail');
    };
    request.onsuccess = ({ result }) => {
       resolve(result);
    };
  });
}

// 根据fileName获取文件数据
export const getImageFromCache = async fileName => {
  const tx = dbInstance.transaction(['images']);
  const request = tx.objectStore('images').index('fileName').get(fileName);
  return new Promise((resolve, reject) => {
    request.onerror = () => {
      reject('data add fail');
    };
    request.onsuccess = ({ target }) => {
       resolve(target.result);
    };
  });
}