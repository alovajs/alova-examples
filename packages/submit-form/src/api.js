import { createAlova } from 'alova';
import VueHook from 'alova/vue';
import { createAlovaMockAdapter, defineMock } from '@alova/mock';

// mock data.
const mockData = defineMock({
  '[POST]/add-fruit': {
    success: true,
  },
});

const alovaInst = createAlova({
  baseURL: 'http://example.com',
  statesHook: VueHook,
  requestAdapter: createAlovaMockAdapter([mockData], { delay: 1500 }),
  responsed: (response) => response.json(),
});

export const addFruit = (fruit) =>
  alovaInst.Post('/add-fruit', { item: fruit });
