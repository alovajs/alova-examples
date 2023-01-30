<template>
  <n-spin v-if="loading && randomNumbers.length <= 0" />
  <span v-else-if="error">{{ error.message }}</span>

  <n-space vertical v-else>
    <n-space>
      <n-tag v-for="num in randomNumbers" :key="num">{{ num }}</n-tag>
    </n-space>

    <n-alert title="Tips" type="info" v-if="!loading">
      <div>
        <span class="link" @click="reloadPage">Reload page</span>
        <span>, you can see the old data instead of 'Loading...'</span>
      </div>
      <div>
        <span class="link" @click="invalidateOldData"
          >Invalidate the data of placeholder</span
        >
        <span> and reload page, you can see 'Loading...' again.</span>
      </div>
    </n-alert>
  </n-space>
</template>

<script setup>
import { ref } from 'vue';
import { queryRandom } from './api.js';
import { useRequest, invalidateCache } from 'alova';
import { NSpin, NTag, NSpace, NAlert } from 'naive-ui';

const methodOfQueryRandom = queryRandom();
const {
  loading,
  error,
  data: randomNumbers,
} = useRequest(methodOfQueryRandom, {
  initialData: [],
});
const reloadPage = () => {
  location.reload();
};
const invalidateOldData = () => {
  invalidateCache(methodOfQueryRandom);
  reloadPage();
};
</script>

<style>
#app {
  padding: 10px;
}
</style>
