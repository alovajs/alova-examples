import { useSnackbar } from "notistack";

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
export const networkStatusStorageKey = 'alova.mockNetwork.status';

// 当前的网络状态
export let currentStatus = netWorkStatuses[0].value;

// 当前的请求模式
export let currentMode = 0;
export const useUpdateHook = () => {
  const { enqueueSnackbar } = useSnackbar();
  return {
    /**
     * 更新当前网络状态
     * @param newStatus 新状态
     */
    updateCurrentStatus: (newStatus: number) => {
      currentStatus = newStatus;
      sessionStorage.setItem(networkStatusStorageKey, newStatus.toString());
      if (newStatus !== 1) {
        enqueueSnackbar(newStatus === 0 ? '糟糕，突然断网了!' : '网络突然有点延迟', {
          variant: newStatus === 0 ? 'error' : 'warning'
        });
      }
    },

    /**
     * 更新模式值
     * @param newMode 更新的模式值
     */
    updateCurrentMode: (newMode: number) => {
      currentMode = newMode;
    }
  }
}

// 静默提交固定参数
export const silentConfig = {
  behavior: () => currentMode === 0 ? 'silent' : 'static',
  retryError: /network error/,
  maxRetryTimes: 5,
  backoff: {
    delay: 2000,
    multiplier: 1.5,
    endQuiver: 0.5
  }
};