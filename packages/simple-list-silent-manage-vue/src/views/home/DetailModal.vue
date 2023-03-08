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
        <n-form-item>
          <n-button type="primary" @click="submitTodo" :loading="submiting" :disabled="!!error">提交</n-button>
        </n-form-item>
      </n-form>
    </n-spin>
  </n-modal>
</template>

<script setup>
import { defineProps, watchEffect, defineEmits, ref } from "vue";
import { useSQRequest, updateStateEffect, filterSilentMethods, equals } from "@alova/scene-vue";
import { editTodo, todoDetail } from "../../api.js";
import { NSpin, NButton, NModal, NInput, NTimePicker, NForm, NFormItem } from "naive-ui";
import { silentConfig } from '../../config';

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
const { loading, data: detail, error, send } = useSQRequest(
  todoDetail,
  {
    behavior: 'static',
    initialData: {
      content: "new todo",
      time: Date.now(),
    },
    immediate: false,
    vDataCaptured: () => {
      const targetSM = filterSilentMethods('edit' + props.id).pop();
      if (targetSM?.reviewData) {
        return { ...targetSM.reviewData.data };
      }
    },
  }
);
watchEffect(() => {
  error.value = undefined;
  if (props.show && props.id) {
    send(props.id);
  }
});

const { loading: submiting, send: sendTodoEdit, onSuccess: onSubmitSuccess } = useSQRequest(
  () => editTodo(detail.value.content, detail.value.time, props.id),
  {
    ...silentConfig,
    immediate: false,
    silentDefaultResponse: () => {
      return {
        id: '--'
      }
    }
  }
);
onSubmitSuccess(({ data, silentMethod }) => {
  const editingItem = {
    ...detail.value,
    id: props.id || data.id
  };

  if (silentMethod) {
    // 设置名称，以便后续查询
    silentMethod.entity.setName('edit' + editingItem.id);
    silentMethod.reviewData = {
      operate: props.id ? 'edit' : 'add',
      data: editingItem
    };
    silentMethod.save();
  }

  updateStateEffect({
    name: 'todoList',
    filter: (_, index, methods) => index === methods.length - 1
  }, todoList => {
    if (props.id) {
      const index = todoList.findIndex(({ id }) => equals(id, props.id));
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
