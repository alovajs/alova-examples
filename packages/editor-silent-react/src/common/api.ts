import { createAlova } from "alova";
import GlobalFetch from 'alova/GlobalFetch';
import ReactHook from "alova/react";
import { createAlovaMockAdapter, defineMock } from "@alova/mock";
import { currentStatus } from "./config";

export interface Note {
  id: number;
  content: string;
  updateTime: string;
}

const storageKey = 'alova.silent.mock.notes';
const allNotes = JSON.parse(sessionStorage.getItem(storageKey) || '[{"id":1,"content":"example note","updateTime":"2022-12-31 00:00:00"}]') as Note[];
const updateStorage = () => {
  sessionStorage.setItem(storageKey, JSON.stringify(allNotes));
}


// 网络状态模拟
const mockNetwork = async () => {
  const statusVal = currentStatus;
  if (statusVal === 0) {
    throw new Error('network error');
  } else if (statusVal === 2) {
    await new Promise(resolve => {
      setTimeout(resolve, 6000);
    });
  }
}

// mock data.
const mockData = defineMock({
  "/note": () => {
    return [...allNotes].reverse();
  },
  "/note/{id}": async ({ params }) => {
    await mockNetwork();
    return allNotes.find(({ id }) => params.id === id.toString()) || null;
  },
  "[POST]/note": async ({ data }) => {
    await mockNetwork();
    const { id, content } = data as unknown as Note;
    const updateTime = new Date().toISOString();
    const foundNote = allNotes.find((s) => s.id.toString() === id?.toString());
    let newId = null;
    if (foundNote) {
      foundNote.content = content;
      foundNote.updateTime = updateTime;
    } else {
      const lastId = allNotes[allNotes.length - 1]?.id || 0;
      newId = lastId + 1;
      allNotes.push({ id: newId, content, updateTime });
    }
    updateStorage();
    return { id: newId };
  },
  "[DELETE]/note": async ({ data }) => {
    await mockNetwork();
    const index = allNotes.findIndex((s) => s.id.toString() === data.id.toString());
    allNotes.splice(index, 1);
    updateStorage();
    return true;
  }
});

const mockRequestAdapter = createAlovaMockAdapter([mockData], {
  delay: 1200,
  httpAdapter: GlobalFetch()
});
export const alovaInst = createAlova({
  baseURL: "http://example.com",
  statesHook: ReactHook,
  requestAdapter: mockRequestAdapter,
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

export const queryNotes = () =>
  alovaInst.Get<Note[]>("/note", {
    localCache: {
      mode: 'placeholder',
      expire: Infinity
    }
  });
export const noteDetail = (id: number | string) => alovaInst.Get<Note>(`/note/${id}`);
export const editNote = (content: string, id?: string | number) => alovaInst.Post<{ id: number | null }>("/note", { content, id }, {
  name: id ? ('methodEditNote' + id) : undefined
});
export const removeNote = (id: number) => alovaInst.Delete<boolean>("/note", { id });