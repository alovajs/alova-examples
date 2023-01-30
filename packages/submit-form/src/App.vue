<template>
  <n-input-group>
    <n-input
      :style="{ width: '40%' }"
      v-model:value="fruit"
      placeholder="input a fruit"
      :loading="submiting"
    />
    <n-button type="primary" ghost @click="submitFruit" :disabled="submiting"
      >Submit</n-button
    >
  </n-input-group>

  <ul v-if="fruitsList.length > 0">
    <li v-for="item in fruitsList" :key="item">{{ item }}</li>
  </ul>
</template>

<script setup>
import { ref } from 'vue';
import { addFruit } from './api.js';
import { useRequest } from 'alova';
import { NInputGroup, NButton, NInput } from 'naive-ui';

const fruit = ref('');
const fruitsList = ref([]);
const {
  loading: submiting,
  send,
  onSuccess,
} = useRequest(() => addFruit(fruit.value), {
  immediate: false,
});
onSuccess(() => {
  fruitsList.value.push(fruit.value);
  fruit.value = '';
});

const submitFruit = () => {
  if (!fruit.value) {
    alert('Please input a fruit');
    return;
  }
  send();
};
</script>

<style>
#app {
  padding: 10px;
}
</style>
