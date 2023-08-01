<template>
  <n-space vertical>
    <n-space>
      <n-button type="primary" @click="editItem()">弹框添加Todo</n-button>
      <n-button type="primary" @click="router.push('/detail')">新页面添加Todo</n-button>
      <n-spin size="small" v-if="removing">移除中...</n-spin>
    </n-space>

    <n-data-table
      :columns="tableColumns"
      :data="todos"
      :loading="loading"
    >
      <template #empty>
        <n-empty description="请先添加一项Todo."></n-empty>
      </template>
    </n-data-table>
  </n-space>
  <detail-modal
    v-model:show="detailVisible"
    :id="selectedId"
  ></detail-modal>
</template>

<script setup>
import { ref, h, onUnmounted } from "vue";
import { queryTodo, removeTodo } from "../../api.js";
import DetailModal from "./DetailModal.vue";
import {
  NButton,
  NSpace,
  NDataTable,
  NEmpty,
  NSpin
} from "naive-ui";
import { useRouter } from "vue-router";
import { useRequest } from "alova";

onUnmounted(() => {
  console.log('unmounted')
})

const router = useRouter();
const tableColumns = [
  {
    title: 'ID',
    key: 'id'
  },
  {
    title: '内容',
    key: 'content',
  },
  {
    title: '时间',
    key: 'time',
    render: row => new Date(row.time).toLocaleTimeString()
  },
  {
    title: '操作',
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
              { default: () => '弹框编辑' }
            ),
            h(
              NButton,
              {
                strong: true,
                tertiary: true,
                size: 'small',
                onClick: () => router.push({
                  name: 'detail',
                  query: {
                    id: row.id
                  }
                }),
              },
              { default: () => '新页面编辑' }
            ),
            h(
              NButton,
              {
                strong: true,
                size: 'small',
                type: 'error',
                onClick: () => removeSend(row.id),
              },
              { default: () => '移除' }
            ),
          ],
        }
      );
    },
  },
];


const {
  loading,
  data: todos
} = useRequest(queryTodo, {
  initialData: []
});


const detailVisible = ref(false);
const selectedId = ref();
const editItem = (id) => {
  detailVisible.value = true;
  selectedId.value = id;
};
const { send: removeSend, loading: removing, onSuccess: onRemoveSuccess } = useRequest(
  (id) => removeTodo(id),
  {
    immediate: false,
  }
);
onRemoveSuccess(({ sendArgs: [removeId], silentMethod }) => {
  todos.value = todos.value.filter(s => s.id !== removeId);
});
</script>
