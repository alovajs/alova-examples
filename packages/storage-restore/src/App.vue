<template>
  <n-spin v-if="loading && festivals.length <= 0" size="small"></n-spin>
  <span v-else-if="error">{{ error.message }}</span>

  <n-space v-else vertical>
    <n-h2>Festivals of This year</n-h2>
    <n-space>
      <n-tag v-for="fes in festivals" :key="fes.name" type="info">
        [{{ fes.date }}] {{ fes.name }}
      </n-tag>
    </n-space>
    <n-alert type="info" v-if="!loading">
      <div>
        <span class="link" @click="reloadPage">Reload page</span>
        <span
          >, you don't need to rerequest festival data until next year.</span
        >
      </div>
      <div>
        <span class="link" @click="invalidateOldData"
          >Invalidate the persitent data</span
        >
        <span> and reload page, you can see 'Loading...' again.</span>
      </div>
    </n-alert>
  </n-space>

  <div id="request-console">
    <strong>Request Records</strong>
    <div></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { queryFestivals } from './api.js';
import { useRequest, invalidateCache } from 'alova';
import { NSpin, NTag, NAlert, NSpace, NH2 } from 'naive-ui';

const methodOfQueryFestivals = queryFestivals();
const {
  loading,
  error,
  data: festivals,
} = useRequest(methodOfQueryFestivals, {
  initialData: [],
});
const reloadPage = () => {
  location.reload();
};
const invalidateOldData = () => {
  invalidateCache(methodOfQueryFestivals);
  reloadPage();
};
</script>

<style>
#app {
  padding: 10px;
}
#request-console {
  width: 90%;
  padding: 10px;
  box-sizing: border-box;
  box-shadow: 1px 1px 20px #ddd;
  position: fixed;
  left: 5%;
  bottom: 10px;
  z-index: 100;
  background: white;
}
#request-console > div {
  color: #999;
}
</style>
