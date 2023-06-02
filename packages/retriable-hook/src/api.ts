import { Arg, createAlova } from 'alova';
import VueHook from 'alova/vue';
import { createAlovaMockAdapter, defineMock } from '@alova/mock';

// mock data
const retriedTimes = {} as Record<string, number>;
const mockData = defineMock({
  '/list': ({ query }) => {
    const { errTimes, id } = query;
    retriedTimes[id] = retriedTimes[id] || 0;
    if (errTimes && errTimes > retriedTimes[id]) {
      retriedTimes[id]++;
      return {
        status: 500,
        statusText: `request error ${retriedTimes[id]} times`
      };
    }
    retriedTimes[id] = 0;
    return ['apple', 'banana', 'orange'];
  },
});

// create a alova instance
const alovaInst = createAlova({
  baseURL: 'http://example.com',
  statesHook: VueHook,
  localCache: null,
  requestAdapter: createAlovaMockAdapter([mockData], { delay: 1500 }),
  responded: (response: Response) => {
    if (response.status !== 200) {
      throw new Error(`[${response.status}]${response.statusText}`);
    }
    return response.json();
  },
});

export const getData = (params: Arg) => alovaInst.Get('/list', { params });
