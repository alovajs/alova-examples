import { createAlovaMockAdapter, defineMock } from "@alova/mock";
import GlobalFetch from "alova/GlobalFetch";

// mock data.
const mockData = defineMock({
  "/menus": ({ query }) => {
    return menus(query.suffix || '*');
  },
  "[POST]/menus": ({ data }) => data,
  "/students": ({ query }) => {
    let { page = 1, pageSize = 10, studentName, clsName } = query;
    page = Number(page);
    pageSize = Number(pageSize);
    const start = (page - 1) * pageSize;
    const filteredStudents = allStudents
      .slice()
      .reverse()
      .filter(
        ({ name, cls }) =>
          (studentName
            ? name
                .toLocaleLowerCase()
                .indexOf(studentName.toLocaleLowerCase()) >= 0
            : true) && (clsName ? clsName === cls : true)
      );

    return {
      total: filteredStudents.length,
      list: filteredStudents.slice(start, start + pageSize)
    };
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
      allStudents.push({ id: newId, name, cls });
      return newId;
    }
  },
  "[DELETE]/student": ({ data }) => {
    const index = allStudents.findIndex((s) => s.id === data.id);
    allStudents.splice(index, 1);
    return true;
  }
});

export const mockRequestAdapter = createAlovaMockAdapter([mockData], {
  delay: 1200,
  httpAdapter: GlobalFetch()
});


function menus(suffix: string) {
  return [
    {
      label: 'menu1-' + suffix,
      children: [
        {
          label: 'menu1-sub1-' + suffix
        },
        {
          label: 'menu1-sub2-' + suffix
        },
      ]
    },
    {
      label: 'menu2-' + suffix,
      children: [
        {
          label: 'menu2-sub1-' + suffix
        },
        {
          label: 'menu2-sub2-' + suffix
        },
        {
          label: 'menu2-sub3-' + suffix
        },
      ]
    },
    {
      label: 'menu3-' + suffix
    },
  ];
}
const allStudents = [
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
    name: "Maxwell",
    cls: "class 3"
  },
  {
    name: "Marshall",
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
    name: "Kevin",
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
    name: "Kevin",
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
    name: "Kevin",
    cls: "class 1"
  },
  {
    name: "Julian",
    cls: "class 2"
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
    name: "Julian",
    cls: "class 2"
  },
  {
    name: "Kevin",
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
    name: "Kevin",
    cls: "class 1"
  }
].map((item, i) => ({
  id: i + 1,
  ...item
}));