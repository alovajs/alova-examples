<template>
  <n-modal
    :show="show"
    @update:show="emit('update:show', false)"
    preset="dialog"
    :title="id ? 'Edit Todo' : 'Add Todo'"
  >
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
          <span>提交后将调用updateState跨组件更新外部列表数据</span>
        </n-form-item>
        <n-form-item>
          <n-button type="primary" @click="submitTodo" :loading="submiting" :disabled="!!error">提交</n-button>
        </n-form-item>
      </n-form>
    </n-spin>
  </n-modal>
</template>

<script setup>
import { defineProps, watchEffect, defineEmits, ref } from "vue";
import { editTodo, todoDetail } from "../../api.js";
import { NSpin, NButton, NModal, NInput, NTimePicker, NForm, NFormItem } from "naive-ui";
import { updateState, useRequest } from "alova";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  id: {
    type: [Number, Object],
  }
});
const emit = defineEmits(["update:show"]);

// query todo data
const { loading, data: detail, error, send } = useRequest(
  todoDetail,
  {
    initialData: {
      content: "new todo",
      time: Date.now(),
    },
    immediate: false
  }
);
watchEffect(() => {
  error.value = undefined;
  if (props.show && props.id) {
    send(props.id);
  }
});

const { loading: submiting, send: sendTodoEdit, onSuccess: onSubmitSuccess } = useRequest(
  () => editTodo(detail.value.content, detail.value.time, props.id),
  {
    immediate: false
  }
);
onSubmitSuccess(({ data }) => {
  const editingItem = {
    ...detail.value,
    id: props.id || data.id
  };

  updateState({
    name: 'todoList',
    filter: (_, index, methods) => index === methods.length - 1
  }, todoList => {
    if (props.id) {
      const index = todoList.findIndex(({ id }) => id.toString() === props.id.toString());
      if (index >= 0) {
        todoList.splice(index, 1, editingItem);
      }
    } else {
      todoList.unshift(editingItem);
    }
    return todoList;
  });
  emit("update:show", false);
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
