import { createAlova, cacheMode } from 'alova';
import VueHook from 'alova/vue';
import { createAlovaMockAdapter, defineMock } from '@alova/mock';

// mock data.
const mockData = defineMock({
  '/query-random': () => {
    return Array.from({ length: 5 }).map((_) =>
      (Math.random() * 100).toFixed(0)
    );
  },
});

const alovaInst = createAlova({
  baseURL: 'http://example.com',
  statesHook: VueHook,
  requestAdapter: createAlovaMockAdapter([mockData], { delay: 1500 }),
  responsed: (response) => response.json(),
});

export const queryRandom = () =>
  alovaInst.Get('/query-random', {
    // set cache mode to 'STORAGE_PLACEHOLDER', it means using old data to occupy loading status
    localCache: {
      mode: cacheMode.STORAGE_PLACEHOLDER,
      expire: 10 * 60 * 60,
    },
  });
