import { createAlova } from 'alova';
import VueHook from 'alova/vue';
import { createAlovaMockAdapter, defineMock } from '@alova/mock';

// mock data.
const mockData = defineMock({
  '/query-festivals': () => {
    return festivals;
  },
});

const alovaInst = createAlova({
  baseURL: 'http://example.com',
  statesHook: VueHook,
  requestAdapter: createAlovaMockAdapter([mockData], { delay: 1500 }),
  responsed: async (response, context) => {
    const res = await response.json();
    const consoleDiv = document.querySelector('#request-console div');

    const elDiv = document.createElement('div');
    elDiv.appendChild(
      document.createTextNode(new Date().toLocaleString() + ' ' + context.url)
    );
    consoleDiv.appendChild(elDiv);
    return res;
  },
});

export const queryFestivals = () => {
  const expireDate = new Date();
  expireDate.setMonth(11, 31);
  expireDate.setHours(23, 59, 59, 999);
  return alovaInst.Get('/query-festivals', {
    // set cache mode to 'STORAGE_RESTORE', It is generally used for data that remains unchanged for a certain period of time
    localCache: {
      mode: 'restore',
      expire: expireDate,
    },
  });
};

const festivals = [
  {
    name: "New Year's Day",
    date: '01-01',
  },
  {
    name: "Valentine's Day",
    date: '02-14',
  },
  {
    name: "Women's Day",
    date: '03-08',
  },
  {
    name: "April Fools' Day",
    date: '04-01',
  },
  {
    name: 'May Day',
    date: '05-01',
  },
  {
    name: 'Dragon Boat Festival',
    date: '05-05',
  },
  {
    name: 'Mid-Autumn Festival',
    date: '08-15',
  },
  {
    name: "Motherland's National Day",
    date: '10-01',
  },
  {
    name: 'Christmas Day',
    date: '12-25',
  },
];
