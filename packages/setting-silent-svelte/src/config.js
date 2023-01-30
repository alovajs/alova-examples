import { writable } from 'svelte/store';

function createWritable(val) {
  const { subscribe, update, set } = writable(val);
  return {
    subscribe,
    update,
    set,
    value: () => {
      /** @type {typeof val} */
      let vl
      subscribe(v => {
        vl = v;
      })
      return vl;
    }
  }
}

export const netWorkStatuses = [{
  label: '正常网络',
  value: 1
}, {
  label: '断网',
  value: 0
}, {
  label: '不稳定网络',
  value: 2
}];
const networkStatusStorageKey = 'alova.mockNetwork.status';
export const currentStatus = createWritable(
  Number(sessionStorage.getItem(networkStatusStorageKey) || netWorkStatuses[0].value)
);
currentStatus.subscribe(val => {
  sessionStorage.setItem(networkStatusStorageKey, val.toString());
});

export const currentMode = createWritable(0);

// 静默提交固定参数
export const silentConfig = {
  behavior: () => currentMode.value() === 0 ? 'silent' : 'static',
  retryError: /network error/,
  maxRetryTimes: 5,
  backoff: {
    delay: 2000,
    multiplier: 1.5,
    endQuiver: 0.5
  }
}