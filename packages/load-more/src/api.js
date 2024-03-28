import { createAlova } from "alova";
import VueHook from "alova/vue";
import { createAlovaMockAdapter, defineMock } from "@alova/mock";

// mock data.
const mockData = defineMock({
  "/query-students": ({ query }) => {
    let { page = 1, pageSize = 10, studentName, clsName } = query;
    page = Number(page);
    pageSize = Number(pageSize);
    const start = (page - 1) * pageSize;
    return allStudents
      .slice()
      .reverse()
      .filter(
        ({ name, cls }) =>
          (studentName
            ? name
                .toLocaleLowerCase()
                .indexOf(studentName.toLocaleLowerCase()) >= 0
            : true) && (clsName ? clsName === cls : true)
      )
      .slice(start, start + pageSize);
  },
  "/student/{id}": ({ params }) =>
    allStudents.find(({ id }) => params.id === id.toString()) || null,
  "[POST]/student": ({ data }) => {
    const { id, name, cls } = data;
    const index = allStudents.findIndex((s) => s.id === id);
    if (index >= 0) {
      allStudents.splice(index, 1, { id, name, cls });
      return true;
    } else {
      const newId = allStudents[allStudents.length - 1].id + 1;
      allStudents.push({
        id: newId,
        name,
        cls
      });
      return newId;
    }
  },
  "[DELETE]/student": ({ data }) => {
    const index = allStudents.findIndex((s) => s.id === data.id);
    allStudents.splice(index, 1);
    return true;
  }
});

const alovaInst = createAlova({
  baseURL: "http://example.com",
  statesHook: VueHook,
  requestAdapter: createAlovaMockAdapter([mockData], { delay: 1500 }),
  responsed: (response) => response.json()
});

export const queryStudents = (page, pageSize, studentName, clsName) =>
  alovaInst.Get("/query-students", {
    params: { page, pageSize, studentName, clsName }
  });
export const queryStudentDetail = (id) => alovaInst.Get(`/student/${id}`);
export const editStudent = (name, cls, id) =>
  alovaInst.Post("/student", {
    id,
    name,
    cls
  });
export const removeStudent = (id) => alovaInst.Delete("/student", { id });

const allStudents = Array.from({ length: 3 })
  .map((_) => [
    {
      name: "August",
      cls: "class 1"
    },
    {
      name: "Marshall",
      cls: "class 3"
    },
    {
      name: "Maxwell",
      cls: "class 1"
    },
    {
      name: "Kevin",
      cls: "class 1"
    },
    {
      name: "Julian",
      cls: "class 2"
    },
    {
      name: "Maxwell",
      cls: "class 2"
    },
    {
      name: "August",
      cls: "class 1"
    },
    {
      name: "Maxwell",
      cls: "class 3"
    },
    {
      name: "Marshall",
      cls: "class 1"
    },
    {
      name: "William",
      cls: "class 1"
    },
    {
      name: "jason",
      cls: "class 2"
    },
  ])
  .flat()
  .map((item, i) => ({
    id: i + 1,
    ...item
  }));
