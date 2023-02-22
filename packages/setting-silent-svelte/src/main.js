import { bootSilentFactory } from '@alova/scene-svelte';
import { alovaInst } from './api';
import './app.css'
import App from './App.svelte'
import 'svelte-material-ui/bare.css';

bootSilentFactory({
  alova: alovaInst,
  delay: 500
});

const app = new App({
  target: document.getElementById('app'),
});

export default app;