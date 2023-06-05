<template>
  <n-space vertical>
    <n-space
      vertical
      :style="{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 100,
        background: 'white',
        padding: '10px',
      }"
    >
      <n-input-group>
        <n-input
          style="width: 40%"
          v-model:value="studentName"
          placeholder="input student name"
          :loading="loading"
        ></n-input>
        <n-select
          placeholder="select class"
          v-model:value="clsName"
          clearable
          :style="{ width: '33%' }"
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
      <n-space>
        <n-button type="primary" @click="editItem()">Add item</n-button>
        <n-button type="primary" @click="reload">reload data</n-button>
      </n-space>
    </n-space>

    <n-data-table
      style="margin-top: 80px"
      :loading="loading"
      :columns="[
        {
          title: 'ID',
          key: 'id',
        },
        {
          title: 'Name',
          key: 'name',
        },
        {
          title: 'Class',
          key: 'cls',
        },
        {
          title: 'Operate',
          key: 'operate',
          render: (row) => {
            return h(
              NSpace,
              {},
              {
                default: () => [
                  h(
                    NButton,
                    {
                      strong: true,
                      tertiary: true,
                      size: 'small',
                      onClick: () => editItem(row.id),
                    },
                    { default: () => 'Edit' }
                  ),
                  h(
                    NButton,
                    {
                      strong: true,
                      size: 'small',
                      type: 'error',
                      onClick: () => removeSend(row.id),
                    },
                    { default: () => 'Remove' }
                  ),
                ],
              }
            );
          },
        },
      ]"
      :data="students"
    >
    </n-data-table>
    <n-space justify="space-between" align="center">
      <n-pagination
        v-model:page="page"
        v-model:page-size="pageSize"
        :page-count="pageCount"
        show-size-picker
        :page-sizes="[10, 20]" />
      <span>Total: {{ total }}</span>
    </n-space>
  </n-space>

  <detail
    v-model:show="detailVisible"
    :id="selectedId"
    @submit="updateList"
  ></detail>
</template>

<script setup>
import { ref, h } from "vue";
import { queryStudents, removeStudent } from "./api.js";
import { usePagination } from "@alova/scene-vue";
import Detail from "./Detail.vue";
import {
  NInputGroup,
  NInput,
  NSelect,
  NButton,
  NSpace,
  NDataTable,
  NPagination,
} from "naive-ui";
import { useRequest } from "alova";

const studentName = ref("");
const clsName = ref(null);
const detailVisible = ref(false);
const selectedId = ref();
const {
  loading,
  data: students,
  page,
  total,
  pageSize,
  pageCount,
  remove,
  insert,
  refresh,
  reload,
} = usePagination(
  (page, pageSize) =>
    queryStudents(page, pageSize, studentName.value || "", clsName.value || ""),
  {
    watchingStates: [studentName, clsName],
    initialData: { total: 0, list: [] },
    debounce: [800],
    total: (res) => res.total,
    data: (res) => res.list,
  }
);

const editItem = (id) => {
  detailVisible.value = true;
  selectedId.value = id;
};

const { send: removeSend, onSuccess: onRemoveSuccess } = useRequest(
  (id) => removeStudent(id),
  {
    immediate: false
  }
);
onRemoveSuccess(({
  sendArgs: [removeId]
}) => {
  const index = students.value.findIndex((s) => s.id === removeId);
  remove(index);
});
const updateList = (detail) => {
  if (selectedId.value) {
    refresh(page.value);
  } else {
    insert(detail, {
      onBefore: () => {
        page.value = 1;
      },
    });
  }
};
</script>

<style>
#app {
  padding: 10px;
}
</style>
