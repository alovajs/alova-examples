<template>
  <n-spin v-if="loading" size="small" />
  <n-h2 v-else>Please click the item below to view detail.</n-h2>

  <n-data-table
    v-if="students.length > 0"
    :columns="[
      {
        title: 'Name',
        key: 'name',
      },
      {
        title: 'Class',
        key: 'cls',
      },
    ]"
    :data="students"
    :row-props="
      (row) => ({
        style: {
          cursor: 'pointer',
        },
        onClick: () => {
          handleDetailShow(row.id);
        },
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
import { queryStudents } from './api.js';
import { useRequest } from 'alova';
import Detail from './Detail.vue';
import { NH2, NSpin, NDataTable } from 'naive-ui';

const showDetail = ref(false);
const viewingId = ref(0);
const { loading, data: students } = useRequest(() => queryStudents(), {
  initialData: [],
  immediate: true,
});

const handleDetailShow = (id) => {
  console.log(showDetail.value);
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
}
#request-console > div {
  color: #999;
}
</style>
