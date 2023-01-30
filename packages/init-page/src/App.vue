<template>
  <n-spin v-if="loading" size="small" />
  <span v-else-if="error">{{ error.message }}</span>
  <div v-else>
    <n-tag
      type="success"
      v-for="item in data"
      :key="item"
      :style="{ marginRight: '10px' }"
    >
      {{ item }}
    </n-tag>
  </div>
</template>

<script setup>
import { getData } from './api.js';
import { useRequest } from 'alova';
import { NTag, NSpin } from 'naive-ui';

const { data, loading, error } = useRequest(getData, {
  initialData: [],
});
</script>

<style>
#app {
  padding: 10px;
}
</style>
