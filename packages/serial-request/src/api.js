import { createAlova } from 'alova';
import VueHook from 'alova/vue';
import { createAlovaMockAdapter, defineMock } from '@alova/mock';

// mock data
const mockData = defineMock({
  '/get-fruits': ['apple', 'banana', 'orange'],
  '[POST]/submit-fruits': ({ data }) => {
    return `${data.list.length} data has been submited.`
  }
});

// create a alova instance
const alovaInst = createAlova({
  baseURL: 'http://example.com',
  statesHook: VueHook,
  requestAdapter: createAlovaMockAdapter([mockData], { delay: 1500 }),
  responsed: (response) => response.json(),
});

export const getFruits = () => alovaInst.Get('/get-fruits');
export const submitFruits = list => alovaInst.Post('/submit-fruits', { list });