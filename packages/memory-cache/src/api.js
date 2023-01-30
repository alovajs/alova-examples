import { createAlova } from 'alova';
import VueHook from 'alova/vue';
import { createAlovaMockAdapter, defineMock } from '@alova/mock';

// mock data.
const mockData = defineMock({
  '/query-students': [
    {
      id: 1,
      name: 'August',
      cls: 'class 1',
    },
  ],
  '/student/{id}': {
    id: 1,
    name: 'August',
    cls: 'class 1',
    age: 15,
    sex: 'man',
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

export const queryStudents = (studentName, clsName) =>
  alovaInst.Get('/query-students', {
    params: { studentName, clsName },
  });
export const queryStudentDetail = (id) =>
  alovaInst.Get(`/student/${id}`, {
    // set the timestamp of memery cache
    localCache: 10 * 60 * 60,
  });
