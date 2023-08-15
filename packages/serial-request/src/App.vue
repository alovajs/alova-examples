<template>
  <n-button @click="send" :loading="loading">start to serial request</n-button>
  <span v-if="error">{{ error.message }}</span>
  <div v-else>{{ data }}</div>
</template>

<script setup>
import { getFruits, submitFruits } from './api.js';
import { useSerialRequest } from '@alova/scene-vue';
import { NButton } from 'naive-ui';

const { data, loading, error, send } = useSerialRequest([
  getFruits(),
  fruits => submitFruits(fruits)
], {
  immediate: false
});
</script>

<style>
#app {
  padding: 10px;
}
</style>
