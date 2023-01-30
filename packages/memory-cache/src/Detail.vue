<template>
  <n-modal
    :show="show"
    @update:show="emit('update:show', false)"
    preset="dialog"
    title="Student Info"
  >
    <n-spin v-if="loading"></n-spin>
    <n-space v-else vertical>
      <span>Name: {{ detail.name }}</span>
      <span>Class: {{ detail.cls }}</span>
      <span>Age: {{ detail.age }}</span>
      <span>Sex: {{ detail.sex }}</span>
      <n-alert type="info"
        >Now click mask to close, and reopen the modal, it will hit response
        cache, and it will not send request.
      </n-alert>
    </n-space>
  </n-modal>
</template>

<script setup>
import { defineProps, watchEffect, defineEmits } from 'vue';
import { queryStudentDetail } from './api.js';
import { useRequest } from 'alova';
import { NModal, NAlert, NSpin, NSpace } from 'naive-ui';

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
});
const emit = defineEmits(['update:show']);

const {
  loading,
  data: detail,
  send,
} = useRequest((id) => queryStudentDetail(id), {
  immediate: false,
});
watchEffect(() => {
  if (props.show) {
    send(props.id);
  }
});
</script>
