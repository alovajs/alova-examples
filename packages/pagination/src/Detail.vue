<template>
  <n-modal
    :show="show"
    @update:show="emit('update:show', false)"
    preset="dialog"
    :title="id ? 'Edit Student' : 'Add Student'"
  >
    <n-spin v-if="loading"></n-spin>
    <n-space vertical align="stretch" v-else>
      <div :style="{ display: 'flex', alignItems: 'center' }">
        <label>Name</label>
        <n-input
          v-model:value="detail.name"
          :style="{ width: '100%', flex: 1, marginLeft: '6px' }"
        />
      </div>
      <div :style="{ display: 'flex', alignItems: 'center' }">
        <label>Class</label>
        <n-select
          :style="{ width: '100%', flex: 1, marginLeft: '6px' }"
          v-model:value="detail.cls"
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
      </div>
      <n-button type="primary" @click="submitStudent" :loading="submiting"
        >Submit</n-button
      >
    </n-space>
  </n-modal>
</template>

<script setup>
import { defineProps, watchEffect, defineEmits, ref } from "vue";
import { useRequest, updateState } from "alova";
import { queryStudentDetail, editStudent } from "./api.js";
import { NSpin, NButton, NSpace, NModal, NInput, NSelect } from "naive-ui";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  id: {
    type: Number,
  },
});
const emit = defineEmits(["update:show", "submit"]);

// query student data
const { loading, data: detail, send } = useRequest(
  (id) => queryStudentDetail(id),
  {
    initialData: {
      name: "newName",
      cls: "class 1",
    },
    immediate: false,
  }
);
watchEffect(() => {
  if (props.show && props.id) {
    send(props.id);
  }
});

const { loading: submiting, send: sendStudentAdd } = useRequest(
  () => editStudent(detail.value.name, detail.value.cls, props.id),
  {
    immediate: false,
  }
);

const submitStudent = async () => {
  if (!detail.value.name) {
    alert("Please input student name");
    return;
  }
  const newId = await sendStudentAdd();
  emit("submit", {
    id: newId,
    ...detail.value,
  });
  emit("update:show", false);
};

const consoleListDataUpdateRecord2Panel = (content) => {
  const consoleDiv = document.querySelector("#request-console div");
  const elDiv = document.createElement("div");
  elDiv.appendChild(document.createTextNode(content));
  consoleDiv.appendChild(elDiv);
  elDiv.scrollIntoView(false);
};
</script>
