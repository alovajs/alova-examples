<template>
  <n-spin :show="loading">
    <n-form
      ref="formRef"
      :model="detail"
      :disabled="!!error"
      :rules="rules">
      <n-form-item label="内容" path="content">
        <n-input
          type="textarea"
          v-model:value="detail.content"
        />
      </n-form-item>
      <n-form-item label="时间" path="time">
        <n-time-picker v-model:value="detail.time" />
      </n-form-item>
      <n-form-item label="说明">
        <span>提交后将调用updateState跨页面更新列表数据并返回</span>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="submitTodo" :loading="submiting" :disabled="!!error">提交</n-button>
      </n-form-item>
    </n-form>
  </n-spin>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { editTodo, todoDetail } from "../../api.js";
import { NSpin, NButton, NInput, NTimePicker, NForm, NFormItem } from "naive-ui";
import { useRoute, useRouter } from "vue-router";
import { setCache, updateState, useRequest } from "alova";

const route = useRoute();
const todoId = route.query.id;
const router = useRouter();

// query todo data
const { loading, data: detail, send, error } = useRequest(
  id => todoDetail(id),
  {
    initialData: {
      content: "new todo",
      time: Date.now(),
    },
    immediate: false
  }
);
watchEffect(() => {
  if (todoId) {
    send(todoId)
  }
});


const { loading: submiting, send: sendTodoEdit, onSuccess: onSubmitSuccess } = useRequest(
  () => editTodo(detail.value.content, detail.value.time, todoId),
  {
    immediate: false
  }
);
onSubmitSuccess(({ data }) => {
  let editingItem = {
    ...detail.value,
    id: data.id
  };

  // 列表页已被销毁，通过更新缓存达到同样的效果
  updateState({
    name: 'todoList',
    filter: (_, index, methods) => index === methods.length - 1
  }, todoList => {
    if (todoId) {
      const index = todoList.findIndex(({ id }) => id.toString() === todoId.toString());
      if (index >= 0) {
        editingItem.id = todoList[index].id;
        todoList.splice(index, 1, editingItem);
      }
    } else {
      todoList.unshift(editingItem);
    }
    return todoList;
  });
  router.back();
})

const formRef = ref();
const submitTodo = () => {
  formRef.value?.validate(async errors => {
    if (errors) {
      return;
    }
    sendTodoEdit();
  })
}

const rules = {
  content: {
    required: true,
    message: 'Please input content',
    trigger: ['blur']
  }
};
</script>
