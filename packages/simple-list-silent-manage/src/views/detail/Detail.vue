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
      <n-form-item>
        <n-button type="primary" @click="submitTodo" :loading="submiting" :disabled="!!error">提交</n-button>
      </n-form-item>
    </n-form>
  </n-spin>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { useSQRequest, updateStateEffect, silentQueueMap, stringifyVData, filterSilentMethods } from "@alova/scene-vue";
import { editTodo, todoDetail } from "../../api.js";
import { NSpin, NButton, NInput, NTimePicker, NForm, NFormItem } from "naive-ui";
import { silentConfig } from '../../config';
import { useRoute, useRouter } from "vue-router";
import { setCacheData } from "alova";

const route = useRoute();
let todoId = Number(route.query.id || 0);
const router = useRouter();

// query todo data
const { loading, data: detail, send, error, onError } = useSQRequest(
  id => todoDetail(id),
  {
    behavior: 'static',
    initialData: {
      content: "new todo",
      time: Date.now(),
    },
    immediate: false,
    vDataCaptured: () => {
      const targetSM = filterSilentMethods('edit' + stringifyVData(todoId)).pop();
      console.log(targetSM);
      if (targetSM?.reviewData) {
        return { ...targetSM.reviewData.data };
      }
    },
  }
);
onError(({ error }) => {
  console.error(error)
});
watchEffect(() => {
  if (todoId) {
    send(todoId)
  }
});


const { loading: submiting, send: sendTodoEdit, onSuccess: onSubmitSuccess } = useSQRequest(
  () => editTodo(detail.value.content, detail.value.time, todoId),
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
  let editingItem = {
    ...detail.value,
    id: data.id
  };

  let matchedMethod = undefined;
  setCacheData({
    name: 'todoList',
    filter: (methodItem, index, methods) => {
      if (index === methods.length - 1) {
        matchedMethod = methodItem;
        return true;
      }
    }
  }, todoList => {
    if (todoId) {
      const index = todoList.findIndex(({ id }) => stringifyVData(id) === todoId);
      if (index >= 0) {
        editingItem.id = todoList[index].id;
        todoList.splice(index, 1, editingItem);
      }
    } else {
      todoList.unshift(editingItem);
    }
    return todoList;
  });

  // 将回写数据保存到silentMethod中，它将会一同持久化
  if (silentMethod) {
    // 设置名称，以便后续查询
    silentMethod.entity.setName('edit' + stringifyVData(editingItem.id));
    silentMethod.reviewData = {
      operate: todoId ? 'edit' : 'add',
      data: editingItem
    };
    silentMethod.targetRefMethod = matchedMethod;
    silentMethod.updateStates = ['data'];
    silentMethod.save();
  }
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
