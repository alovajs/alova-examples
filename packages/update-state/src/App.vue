<template>
  <n-message-provider placement="bottom-left">
    <div class="wrapper">
      <div class="main">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </div>
  </n-message-provider>
</template>

<script setup>
import { NMessageProvider } from 'naive-ui';
import { RouterView } from 'vue-router';
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