<script>
import { onSilentSubmitError, onSilentSubmitFail, silentQueueMap } from '@alova/scene-svelte';
import { netWorkStatuses, currentStatus, currentMode } from '../config';
import Select, { Option } from '@smui/select';
import Snackbar, { Label } from '@smui/snackbar';

const modeOptions = [{
  label: '静默请求模式',
  value: 0
}, {
  label: '正常请求模式',
  value: 1
}];

let waitingSilentQueue = [];
const customDefaultQueue = [];
const originalPush = customDefaultQueue.push;
const originalShift = customDefaultQueue.shift;
customDefaultQueue.push = function(...items) {
  waitingSilentQueue.push(...items);
  waitingSilentQueue = [...waitingSilentQueue];
  return originalPush.call(this, ...items);
};
customDefaultQueue.shift = function() {
  const silentMethodInstance = originalShift.call(this);
  waitingSilentQueue.shift();
  waitingSilentQueue = [...waitingSilentQueue];
  return silentMethodInstance;
};
silentQueueMap.default = customDefaultQueue;

let snackbar;
currentStatus.subscribe(val => {
  if (val !== 1 && snackbar) {
    snackbar.open();
  }
});

let errorSnackbar;
let errorContent = '';
const openErrorSnackbar = () => {
  if (errorSnackbar.isOpen()) {
    errorSnackbar.close();
  }
  errorSnackbar.open();
}

onSilentSubmitError(event => {
  console.error(event.error);
  errorContent = `请求错误:${event.error}` + (event.retryDelay ? `，${event.retryDelay / 1000}秒后再次发起请求` : '');
  openErrorSnackbar();
});

// 静默提交，多次重试后失败
let silentRequestError = undefined;
onSilentSubmitFail(event => {
  silentRequestError = event.error;
  errorContent = '达到最大重试次数，但你仍然可以正常操作';
  openErrorSnackbar();
});
</script>


<Snackbar bind:this={snackbar}>
  <Label>{$currentStatus === 0 ? '糟糕，突然断网了!' : '网络突然有点延迟'}</Label>
</Snackbar>

<Snackbar bind:this={errorSnackbar}>
  <Label>{errorContent}</Label>
</Snackbar>

<div class="console-wrapper">
  <div class="select-wrap">
    <Select bind:value={$currentMode} label="选择请求模式" style="width: 200px">
      {#each modeOptions as option}
        <Option value={option.value}>{option.label}</Option>
      {/each}
    </Select>
    <Select bind:value={$currentStatus} label="选择网络状态">
      {#each netWorkStatuses as option}
        <Option value={option.value}>{option.label}</Option>
      {/each}
    </Select>
  </div>
  <div class="console">
    <div class="title">请求队列</div>
    <div class="queue-wrap">
      {#each waitingSilentQueue as sm, i}
        <div class="method-item">
          {#if !silentRequestError || i > 0}
            <div class="status">
              <div class={`point ${i > 0 ? 'waiting' : 'acting'}`}></div>
              { i > 0 ? 'waiting' : 'acting' }
            </div>
          {:else}
            <div class="status">
              <div class="error-tag">×</div>
              请求错误
            </div>
          {/if}
          <span>[{ sm.entity.type }]{ sm.entity.url }</span>
        </div>
      {/each}
    </div>
  </div>
</div>

<style scoped>
.console-wrapper {
  width: 33%;
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  position: relative;
  z-index: 100;
}
.select-wrap {
  display: flex;
}
.console {
  margin-top: 8px;
  border: solid 1px #ddd;
  background: #f5f5f5;
  border-radius: 6px;
  padding: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.console .title {
  font-weight: bolder;
  font-size: 16px;
}
.console .method-item {
  border: solid 1px #ddd;
  border-radius: 4px;
  background: white;
  padding: 10px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.method-item .status {
  display: flex;
  align-items: center;
}
.status .point {
  width: 6px;
  height: 6px;
  border-radius: 10px;
  margin-right: 6px;
}
.status .point.waiting {
  background: #f5dc29;
}
.status .point.acting {
  background: #3adb3f;
}
.error-tag {
  color: #ff0000;
  margin-right: 6px;
}
</style>