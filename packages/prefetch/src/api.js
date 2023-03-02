import { createAlova } from 'alova';
import VueHook from 'alova/vue';
import { createAlovaMockAdapter, defineMock } from '@alova/mock';

// mock data.
const mockData = defineMock({
  '/query-students': () => allStudents,
  '/student/{id}': ({ params }) =>
    allStudents.find(({ id }) => params.id === id.toString()) || null,
});

const alovaInst = createAlova({
  baseURL: 'http://example.com',
  statesHook: VueHook,
  requestAdapter: createAlovaMockAdapter([mockData], { delay: 1000 }),
  responsed: async (response, context) => {
    const res = await response.json();
    const consoleDiv = document.querySelector('#request-console div');

    const elDiv = document.createElement('div');
    elDiv.appendChild(
      document.createTextNode(new Date().toLocaleString() + ' ' + context.url)
    );
    consoleDiv.appendChild(elDiv);
    elDiv.scrollIntoView(false);
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

const allStudents = [
  {
    id: 1,
    name: 'August',
    cls: 'class 1',
    age: 14,
    sex: 'male',
  },
  {
    id: 2,
    name: 'Marshall',
    cls: 'class 3',
    age: 13,
    sex: 'male',
  },
  {
    id: 3,
    name: 'Maxwell',
    cls: 'class 1',
    age: 15,
    sex: 'female',
  },
  {
    id: 4,
    name: 'Kevin',
    cls: 'class 1',
    age: 15,
    sex: 'male',
  },
  {
    id: 5,
    name: 'Julian',
    cls: 'class 2',
    age: 12,
    sex: 'female',
  },
  {
    id: 6,
    name: 'Maxwell',
    cls: 'class 2',
    age: 17,
    sex: 'female',
  },
  {
    id: 7,
    name: 'August',
    cls: 'class 1',
    age: 15,
    sex: 'male',
  },
  {
    id: 8,
    name: 'Maxwell',
    cls: 'class 3',
    age: 14,
    sex: 'female',
  },
  {
    id: 9,
    name: 'Marshall',
    cls: 'class 1',
    age: 12,
    sex: 'male',
  },
  {
    id: 10,
    name: 'William',
    cls: 'class 1',
    age: 16,
    sex: 'male',
  },
];
