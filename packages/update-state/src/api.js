import { createAlova } from "alova";
import VueHook from "alova/vue";
import { createAlovaMockAdapter, defineMock } from "@alova/mock";

const storageKey = 'aloval.silent.mock.todos';
const allTodos = JSON.parse(sessionStorage.getItem(storageKey) || '[]');
const updateStorage = () => {
  sessionStorage.setItem(storageKey, JSON.stringify(allTodos));
}

// mock data.
const mockData = defineMock({
  "/query-todo": ({ query }) => {
    let { keyword = '' } = query;
    return allTodos
    .filter(
      ({ content }) =>
        keyword
          ? content
              .toLowerCase()
              .indexOf(content.toLowerCase()) >= 0
          : true
    ).reverse();
  },
  "/todo/{id}": ({ params }) => allTodos.find(({ id }) => params.id === id.toString()) || null,
  "[POST]/todo": ({ data }) => {
    const { id, content, time } = data;
    const index = allTodos.findIndex((s) => s.id == id);
    let newId = null;
    if (index >= 0) {
      allTodos.splice(index, 1, { id, content, time });
    } else {
      const lastId = Number(allTodos[allTodos.length - 1]?.id || 0);
      newId = lastId + 1;
      allTodos.push({ id: newId, content, time });
    }
    updateStorage();
    return { id: newId };
  },
  "[DELETE]/todo": ({ data }) => {
    const index = allTodos.findIndex((s) => s.id === data.id);
    allTodos.splice(index, 1);
    updateStorage();
    return true;
  }
});

export const alovaInst = createAlova({
  baseURL: "http://example.com",
  statesHook: VueHook,
  requestAdapter: createAlovaMockAdapter([mockData], { delay: 500 }),
  storageAdapter: {
    get(key) {
      const data = sessionStorage.getItem(key)
      return data ? JSON.parse(data) : data;
    },
    set(key, value) {
      sessionStorage.setItem(key, JSON.stringify(value))
    },
    remove(key) {
      sessionStorage.removeItem(key);
    }
  },
  responsed: (response) => response.json()
});

export const queryTodo = keyword =>
  alovaInst.Get("/query-todo", {
    name: 'todoList',
    params: { keyword }
  });
export const todoDetail = (id) => alovaInst.Get(`/todo/` + id);
export const editTodo = (content, time, id) =>
  alovaInst.Post("/todo", {
    id,
    content,
    time
  });
export const removeTodo = (id) => alovaInst.Delete("/todo", { id });