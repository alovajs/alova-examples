<template>
  <div class="console-wrapper">
    <n-input-group>
      <n-select
        :options="[{
          label: '静默请求模式',
          value: 0
        }, {
          label: '正常请求模式',
          value: 1
        }]"
        v-model:value="currentMode"
        placeholder="选择请求模式"
        style="width: 200px"></n-select>
      <n-select
        :options="netWorkStatuses"
        v-model:value="currentStatus"
        placeholder="选择网络状态"
        style="width: 200px"></n-select>
    </n-input-group>
    <div class="console">
      <div class="title">请求队列</div>
      <div class="queue-wrap">
        <div v-for="(sm, i) in waitingSilentQueue" :key="sm.id" class="method-item">
          <div v-if="!silentRequestError || i > 0" class="status">
            <div :class="['point', i > 0 ? 'waiting' : 'acting']"></div>
            {{ i > 0 ? 'waiting' : 'acting' }}
          </div>
          <div v-else class="status">
            <div class="error-tag">×</div>
            请求错误
          </div>
          <span>[{{ sm.entity.type }}]{{ sm.entity.url }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onSilentSubmitError, onSilentSubmitFail, silentQueueMap } from '@alova/scene-vue';
import { ref, watchPostEffect } from 'vue';
import { useMessage, NSelect, NInputGroup } from 'naive-ui';
import { netWorkStatuses, currentStatus, currentMode } from '../config';

const message = useMessage();
const waitingSilentQueue = ref([]);
const customDefaultQueue = [];
const originalPush = customDefaultQueue.push;
const originalShift = customDefaultQueue.shift;
customDefaultQueue.push = function(...items) {
  waitingSilentQueue.value.push(...items);
  return originalPush.call(this, ...items);
};
customDefaultQueue.shift = function() {
  const silentMethodInstance = originalShift.call(this);
  waitingSilentQueue.value.shift();
  return silentMethodInstance;
};
silentQueueMap.default = customDefaultQueue;

watchPostEffect(() => {
  const currentStatusVal = currentStatus.value;
  if (currentStatusVal !== 1) {
    message.warning(currentStatusVal === 0 ? '糟糕，突然断网了!' : '网络突然有点延迟');
  }
})

onSilentSubmitError(event => {
  console.error(event.error);
  message.error(`请求错误:${event.error}` + (event.retryDelay ? `，${event.retryDelay / 1000}秒后再次发起请求` : ''));
});

// 静默提交，多次重试后失败
const silentRequestError = ref();
onSilentSubmitFail(event => {
  silentRequestError.value = event.error;
  message.error('达到最大重试次数，刷新后再请求');
});

defineExpose({
  setFail: error => {
    silentRequestError.value = error;
    message.error('请求错误，停止队列请求');
  }
});
</script>

<style scoped>
.console-wrapper {
  width: 33%;
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  position: relative;
  z-index: 100;
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