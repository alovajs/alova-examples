<template>
  <n-spin v-if="loading" size="small"></n-spin>
  <n-h4 v-else>Mouse move to items below, it will prefetch detail data.</n-h4>

  <n-data-table
    :columns="[
      { title: 'Name', key: 'name' },
      {
        title: 'Class',
        key: 'cls',
      },
    ]"
    :data="students"
    :row-props="
      (row) => ({
        onClick: () => handleDetailShow(row.id),
        onMouseenter: () => handleFetchDetail(row.id),
        onMouseleave: () => handleRemoveFetch(row.id),
      })
    "
  ></n-data-table>

  <detail v-model:show="showDetail" :id="viewingId"></detail>
  <div id="request-console">
    <strong>Request Records</strong>
    <div></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { queryStudents, queryStudentDetail } from './api.js';
import { useRequest, useFetcher } from 'alova';
import Detail from './Detail.vue';
import { NSpin, NDataTable, NH4 } from 'naive-ui';

const showDetail = ref(false);
const viewingId = ref(0);
const { loading, data: students } = useRequest(() => queryStudents(), {
  initialData: [],
  immediate: true,
});

const timers = {};
const { fetch } = useFetcher({ force: false }); // close force request
// Prefetch detail data when staying for more than 300 milliseconds
const handleFetchDetail = (id) => {
  timers[id] = setTimeout(() => {
    fetch(queryStudentDetail(id));
  }, 200);
};
const handleRemoveFetch = (id) => {
  if (timers[id]) {
    clearTimeout(timers[id]);
    delete timers[id];
  }
};

const handleDetailShow = (id) => {
  viewingId.value = id;
  showDetail.value = true;
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
  height: 100px;
  overflow: auto;
}
#request-console > div {
  color: #999;
}
</style>
