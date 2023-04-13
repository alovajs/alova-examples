import { createAlova } from 'alova';
import VueHook from 'alova/vue';
import { createAlovaMockAdapter, defineMock } from '@alova/mock';
import { addImage2Cache, getImageFromCache } from './db';

// mock data
const mockData = defineMock({
  '/image/{fileName}': ({ params }) => {
    const xhr  = new XMLHttpRequest();
    xhr.open('get', `/${params.fileName}`, true);
    xhr.responseType = 'blob';
    return new Promise(resolve => {
      xhr.send();
      xhr.onload = function() {
        resolve(xhr.response);
      };
    })
  },
});

// create a alova instance
const alovaInst = createAlova({
  baseURL: 'http://example.com',
  statesHook: VueHook,
  requestAdapter: createAlovaMockAdapter([mockData], {
    delay: 1500,
    onMockResponse(data) {
      return {
        response: data,
        headers: {}
      };
    }
  }),
  responded: ({ body }) => body
});

export const image = fileName => alovaInst.Get(`/image/${fileName}`, {
  async localCache() {
    const cache = await getImageFromCache(fileName);
    return cache && cache.data;
  },
  async transformData(imgBlob) {
    // 将blob异步转换为base64
    const reader = new FileReader();
    reader.readAsDataURL(imgBlob);
    const base64Img = await new Promise(resolve => {
      reader.onload = ({ target }) => {
        resolve(target.result);
      }
    });

    // 缓存image数据到IndexedDB中
    await addImage2Cache(fileName, base64Img);
    return base64Img;
  }
});
