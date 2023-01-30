import { createAlova } from 'alova';
import VueHook from 'alova/vue';
import { createAlovaMockAdapter, defineMock } from '@alova/mock';

// mock data.
const mockData = defineMock({
  '/query-students': ({ query }) => {
    const { studentName, clsName } = query;
    return allStudents.filter(
      ({ name, cls }) =>
        (studentName
          ? name.toLocaleLowerCase().indexOf(studentName.toLocaleLowerCase()) >=
            0
          : true) && (clsName ? clsName === cls : true)
    );
  },
});

const alovaInst = createAlova({
  baseURL: 'http://example.com',
  statesHook: VueHook,
  requestAdapter: createAlovaMockAdapter([mockData], { delay: 1500 }),
  responsed: (response) => response.json(),
});

export const queryStudents = (studentName, clsName) =>
  alovaInst.Get('/query-students', {
    params: { studentName, clsName },
  });

const allStudents = [
  {
    name: 'August',
    cls: 'class 1',
  },
  {
    name: 'Marshall',
    cls: 'class 3',
  },
  {
    name: 'Maxwell',
    cls: 'class 1',
  },
  {
    name: 'Kevin',
    cls: 'class 1',
  },
  {
    name: 'Julian',
    cls: 'class 2',
  },
  {
    name: 'Maxwell',
    cls: 'class 2',
  },
  {
    name: 'August',
    cls: 'class 1',
  },
  {
    name: 'Maxwell',
    cls: 'class 3',
  },
  {
    name: 'Marshall',
    cls: 'class 1',
  },
  {
    name: 'William',
    cls: 'class 1',
  },
];
