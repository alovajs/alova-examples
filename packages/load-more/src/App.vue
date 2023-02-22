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
      <n-button type="primary" @click="editItem()">Add item</n-button>
    </n-space>

    <n-data-table
      style="margin-top: 80px"
      v-if="students.length > 0"
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
  </n-space>

  <detail
    v-model:show="detailVisible"
    :id="selectedId"
    @submit="updateList"
  ></detail>
</template>

<script setup>
import { ref, watchEffect, h, nextTick } from "vue";
import { queryStudents, removeStudent } from "./api.js";
import { usePagination } from "@alova/scene-vue";
import { useScroll } from "@vueuse/core";
import Detail from "./Detail.vue";
import {
  NInputGroup,
  NInput,
  NSelect,
  NButton,
  NSpace,
  NDataTable,
} from "naive-ui";
import { useRequest } from "alova";

const studentName = ref("");
const clsName = ref(null);
const detailVisible = ref(false);
const selectedId = ref();
const {
  loading,
  data: students,
  isLastPage,
  page,
  pageSize,
  remove,
  insert,
  refresh,
  reload,
} = usePagination(
  (page, pageSize) =>
    queryStudents(page, pageSize, studentName.value || "", clsName.value || ""),
  {
    watchingStates: [studentName, clsName],
    append: true,
    initialData: [],
    debounce: [500],
  }
);

const editItem = (id) => {
  detailVisible.value = true;
  selectedId.value = id;
};

const { send: removeSend, onSuccess: onRemoveSuccess } = useRequest(
  (id) => removeStudent(id),
  {
    immediate: false,
    silent: true,
  }
);
onRemoveSuccess((_, removeId) => {
  const index = students.value.findIndex((s) => s.id === removeId);
  remove(index);
});
const updateList = (detail) => {
  if (selectedId.value) {
    const refreshPage =
      Math.floor(
        students.value.findIndex(({ id }) => id === selectedId.value) /
          pageSize.value
      ) + 1;
    refresh(refreshPage);
  } else {
    insert(detail);
    nextTick(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
};

const { arrivedState } = useScroll(window);
watchEffect(() => {
  if (arrivedState.bottom && !loading.value && !isLastPage.value) {
    page.value++;
  }
});
</script>

<style>
#app {
  padding: 10px;
}
</style>
