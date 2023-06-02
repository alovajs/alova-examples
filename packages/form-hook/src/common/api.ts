import { createAlova } from "alova";
import GlobalFetch from 'alova/GlobalFetch';
import ReactHook from "alova/react";
import { createAlovaMockAdapter, defineMock } from "@alova/mock";

// mock data.
const mockData = defineMock({
  "/data": () => {
    return {
      input: "abc",
      select: 2,
      date: '2023-05-16',
      switch: true,
      checkbox: {
          option1: false,
          option2: true,
          option3: true
      }
    };
  },
  "[POST]/data": ({ data }) => data,
  "/tags": ({ query }) => {
    const tags = [
      { label: '海淀区', city: 'bj' },
      { label: '朝阳区', city: 'bj' },
      { label: '西城区', city: 'bj' },
      { label: '大兴区', city: 'bj' },
      { label: '东城区', city: 'bj' },
      { label: '顺义区', city: 'bj' },
      { label: '丰台区', city: 'bj' },
      { label: '昌平区', city: 'bj' },
      { label: '黄浦区', city: 'sh' },
      { label: '徐汇区', city: 'sh' },
      { label: '长宁区', city: 'sh' },
      { label: '静安区', city: 'sh' },
      { label: '普陀区', city: 'sh' },
      { label: '虹口区', city: 'sh' },
      { label: '浦东新区', city: 'sh' },
    ]
    return tags.filter(
      ({ label, city }) => (query.search ? label.indexOf(query.search) >= 0 : true) && (query.city ? city === query.city : true)
    );
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
  responsed: (response) => response.json()
});

export const getData = () =>
  alovaInst.Get<{
    input: string;
    select: number;
    date: string;
    switch: boolean;
    checkbox: {
        option1: boolean;
        option2: boolean;
        option3: boolean
    }
  }>("/data");
export const submitData = (data: any) => alovaInst.Post<string>('/data', data);
export const getCityArea = (params: { search?: string, city?: string }) =>
  alovaInst.Get<{
    label: string;
    city: string;
  }[]>("/tags", {
    params
  });