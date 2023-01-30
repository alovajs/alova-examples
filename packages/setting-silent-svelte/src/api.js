import { createAlova } from "alova";
import SvelteHook from "alova/svelte";
import { createAlovaMockAdapter, defineMock } from "@alova/mock";
import { currentStatus } from "./config";

const storageKey = 'aloval.silent.mock.settings';
const dataSettings = JSON.parse(sessionStorage.getItem(storageKey) || `{
  "textContent":""
}`);
const updateStorage = () => {
  sessionStorage.setItem(storageKey, JSON.stringify(dataSettings));
}


// 网络状态模拟
const mockNetwork = async () => {
  const statusVal = currentStatus.value();
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
  "/settings": dataSettings,
  "[POST]/settings": async ({ data }) => {
    await mockNetwork()
    let { name, value } = data;
    dataSettings[name] = value;
    updateStorage();
    return true;
  }
});

export const alovaInst = createAlova({
  baseURL: "http://example.com",
  statesHook: SvelteHook,
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

export const getSettings = () => alovaInst.Get("/settings", {
  localCache: {
    mode: 'placeholder',
    expire: Infinity
  }
});
export const updateSetting = (name, value) => alovaInst.Post('/settings', { name, value });