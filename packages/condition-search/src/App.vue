<template>
  <n-input-group>
    <n-input
      :style="{ width: '40%' }"
      v-model:value="studentName"
      clearable
      placeholder="input student name"
    ></n-input>
    <n-select
      placeholder="select class"
      v-model:value="clsName"
      :style="{ width: '33%' }"
      clearable
      :options="[
        {
          label: 'class 1',
          value: 'class 1',
        },
        {
          label: 'class 2',
          value: 'class 2',
        },
        {
          label: 'class 3',
          value: 'class 3',
        },
      ]"
    />
  </n-input-group>

  <n-data-table
    :loading="loading"
    :style="{ marginTop: '10px' }"
    :columns="[
      {
        title: 'Name',
        key: 'name',
        width: 10,
      },
      {
        title: 'Class',
        key: 'cls',
        width: 100,
      },
    ]"
    :data="students"
  ></n-data-table>
</template>

<script setup>
import { ref } from 'vue';
import { queryStudents } from './api.js';
import { useWatcher } from 'alova';
import { NSpin, NInputGroup, NSelect, NInput, NDataTable } from 'naive-ui';

const studentName = ref('');
const clsName = ref(null);
const { loading, data: students } = useWatcher(
  () => queryStudents(studentName.value || '', clsName.value || ''),
  [studentName, clsName],
  {
    initialData: [],
    debounce: [500],
    immediate: true,
  }
);
</script>

<style>
#app {
  padding: 10px;
}
</style>
