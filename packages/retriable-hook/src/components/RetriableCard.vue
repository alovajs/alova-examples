<template>
  <n-card :title="title" hoverable :segmented="{
      content: true,
      footer: 'soft'
    }">
    <n-space>
      <n-button type="primary" size="large" :loading="loading" @click="handleSend">{{ loading ? '请求中...' : '发送请求' }}</n-button>
      <n-button v-if="stopManually && loading" size="large" @click="stop">手动停止重试</n-button>
    </n-space>

    <n-alert class="alert" title="错误信息" type="error" v-if="error">
      {{ error.message }}
    </n-alert>
    <n-alert class="alert" title="正在重试..." type="warning" v-if="retryMsg">
      {{ retryMsg }}
    </n-alert>
    <n-alert class="alert" title="请求成功" type="success" v-else-if="data">
      响应数据为：{{ data }}
    </n-alert>
  </n-card>
</template>

<script setup lang="ts">
import { useRetriableRequest } from '@alova/scene-vue';
import { NCard, NButton, NAlert, NSpace } from 'naive-ui';
import { ref } from 'vue';
import { getData } from '../api';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  retryTimes: {
    type: Number,
    required: true
  },
  retryDelay: {
    type: Number,
    required: true
  },
  multipler: {
    type: Number,
    default: 1
  },
  startQuiver: {
    type: Number,
    default: 0
  },
  endQuiver: {
    type: Number,
    default: 0
  },
  errTimes: {
    type: Number,
    default: 0
  },
  stopManually: {
    type: Boolean,
    default: false
  }
})

const {
  data,
  loading,
  error,
  onError,
  onRetry,
  onFail,
  onSuccess,
  send,
  stop
} = useRetriableRequest(() => getData({
  id: props.id,
  errTimes: props.errTimes,
}), {
  immediate: false,
  retry: props.retryTimes,
  backoff: {
    delay: props.retryDelay,
    multiplier: props.multipler,
    startQuiver: props.startQuiver,
    endQuiver: props.endQuiver
  }
});
const retryMsg = ref('');
onError(() => {
  retryMsg.value = '等待下一次重试';
});
onRetry(ev => {
  retryMsg.value = `第${ev.retryTimes}次重试中... 已延迟${ev.retryDelay / 1000}秒`;
});
onFail(ev => {
  if (ev.error.message.indexOf('manually') >= 0) {
    retryMsg.value = '已手动停止重试';
    return;
  }
  retryMsg.value = `已到达最大${ev.retryTimes}重试，重试请求失败`;
});
onSuccess(() => {
  retryMsg.value = '';
});

const handleSend = () => {
  send().catch(() => {});
}
</script>

<style scoped>
.alert {
  margin-top: 12px;
}
</style>