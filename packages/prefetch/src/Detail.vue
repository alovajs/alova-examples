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
    </n-space>
  </n-modal>
</template>

<script setup>
import { defineProps, watchEffect, defineEmits } from 'vue';
import { queryStudentDetail } from './api.js';
import { useRequest } from 'alova';
import { NModal, NSpace, NSpin } from 'naive-ui';

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
  initialData: {},
  immediate: false,
});
watchEffect(() => {
  if (props.show) {
    send(props.id);
  }
});
</script>
