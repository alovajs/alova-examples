<template>
  <div class="container">
    <h1>Please select a image</h1>
    <div class="img-wrapper">
      <div v-for="img in imageList" :key="img" class="img-item" @click="showImage(img)">
        {{ img }}
      </div>
    </div>

    <div class="img-preview">
      <n-spin v-if="loading" size="small" />
      <span v-else-if="error">{{ error.message }}</span>
      <img :src="data" v-else />
    </div>
  </div>
</template>

<script setup>
import { image } from './api.js';
import { useRequest } from 'alova';
import { NSpin } from 'naive-ui';

const imageList = [
  '1.jpg',
  '2.jpg'
];
const { data, loading, error, send: showImage } = useRequest(fileName => image(fileName), {
  immediate: false
});
</script>

<style>
#app {
  padding: 10px;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.img-wrapper {
  display: flex;
}
.img-item {
  background: #f5f5f5;
  border-radius: 4px;
  padding: 20px;
  font-size: 24px;
  cursor: pointer;
  margin: 0 10px;
}

.img-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  margin-top: 20px;
}
.img-preview img {
  width: 100%;
}
</style>
