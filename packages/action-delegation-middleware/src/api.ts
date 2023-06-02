import { createAlova } from "alova";
import ReactHook from "alova/react";
import { mockRequestAdapter } from "./assets/mock";

interface MenuItem {
  label: string;
  children?: MenuItem[]
}

export const alovaInst = createAlova({
  baseURL: "http://example.com",
  statesHook: ReactHook,
  requestAdapter: mockRequestAdapter,
  responsed: (response) => response.json()
});

export const getMenus = (suffix?: string) =>
  alovaInst.Get<MenuItem[]>("/menus", {
    params: { suffix }
  });
export const submitData = (data: any) => alovaInst.Post<string>('/data', data);

export const queryStudents = (page: number, pageSize: number, studentName?: string, clsName?: string) =>
  alovaInst.Get<{ total: number, list: { id: number, name: string, cls: string }[] }>("/students", {
    params: { page, pageSize, studentName, clsName }
  });
export const queryStudentDetail = (id: number) => alovaInst.Get(`/student/${id}`);
export const editStudent = (name: string, cls: string, id: number) =>
  alovaInst.Post("/student", {
    id,
    name,
    cls
  });
export const removeStudent = (id: number) => alovaInst.Delete("/student", { id });