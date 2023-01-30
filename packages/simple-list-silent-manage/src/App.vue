<template>
  <n-message-provider placement="bottom-left">
    <div class="wrapper">
      <div class="main">
        <router-view></router-view>
      </div>
      <queue-console ref="refConsole"></queue-console>
    </div>
  </n-message-provider>
</template>

<script setup>
import { NMessageProvider } from 'naive-ui';
import { RouterView } from 'vue-router';
import QueueConsole from './views/QueueConsole.vue';
</script>

<style>
#app {
  padding: 10px;
}
.wrapper {
  display: flex;
  flex-direction: row;
}
.main {
  flex: 1;
}
</style>