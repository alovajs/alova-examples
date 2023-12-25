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
          clearable
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
                      onClick: () => editItem(row),
                    },
                    { default: () => 'Edit' }
                  ),
                  h(
                    NButton,
                    {
                      strong: true,
                      size: 'small',
                      type: 'error',
                      onClick: () => removeSend(row),
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
    :id="selectedItem.id"
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
    data: r => r,
    debounce: [500],
  }
);

const editItem = (row) => {
  detailVisible.value = true;
  selectedItem.value = row;
};

const { send: removeSend, onSuccess: onRemoveSuccess } = useRequest(
  ({ id }) => removeStudent(id),
  {
    immediate: false
  }
);
onRemoveSuccess(({
  sendArgs: [row]
}) => {
  remove(row);
});

const selectedItem = ref({});
const updateList = (detail) => {
  if (selectedItem.value) {
    refresh(selectedItem.value);
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
