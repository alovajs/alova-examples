import { bootSilentFactory } from '@alova/scene-vue';
import { createApp } from 'vue';
import App from './App.vue';
import { alovaInst } from './api';
import router from './router';

createApp(App)
  .use(router)
  .mount('#app');
bootSilentFactory({
  alova: alovaInst,
  delay: 500
});