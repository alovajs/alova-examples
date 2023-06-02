<template>
  <div class="wrapper">
    <retriable-card
      class="card-item"
      id="a"
      title="请求重试2次成功"
      :retry-times="3"
      :retry-delay="1000"
      :err-times="2"></retriable-card>
    <retriable-card
      class="card-item"
      id="b"
      title="请求重试达到最大3次后仍失败"
      :retry-times="3"
      :retry-delay="1000"
      :err-times="10000"></retriable-card>
    <retriable-card
      class="card-item"
      id="c"
      title="重试时间依次递增"
      :retry-times="3"
      :retry-delay="1000"
      :err-times="3"
      :multipler="2"></retriable-card>
    <retriable-card
      class="card-item"
      id="d"
      title="随机增加重试时间"
      :retry-times="3"
      :retry-delay="1000"
      :err-times="3"
      :start-quiver="0.3"
      :end-quiver="0.6"></retriable-card>

    <retriable-card
      class="card-item"
      id="e"
      title="手动停止重试"
      :retry-times="10000"
      :retry-delay="2000"
      :err-times="10000"
      stop-manually></retriable-card>
  </div>
</template>

<script setup lang="ts">
import RetriableCard from './components/RetriableCard.vue';
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-wrap: wrap;
}
.card-item {
  width: calc(33.3% - 40px);
  margin-right: 20px;
  margin-bottom: 20px;
}
</style>
