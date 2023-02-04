import { ref, watch } from "vue";

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
export const currentStatus = ref(
  Number(sessionStorage.getItem(networkStatusStorageKey) || netWorkStatuses[0].value)
);
watch(currentStatus, val => {
  sessionStorage.setItem(networkStatusStorageKey, val);
});

export const currentMode = ref(0);

// 静默提交固定参数
export const silentConfig = {
  behavior: () => currentMode.value === 0 ? 'silent' : 'static',
  retryError: /network error/,
  maxRetryTimes: 5,
  backoff: {
    delay: 2000,
    multiplier: 1.5,
    endQuiver: 0.5
  }
}