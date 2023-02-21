import { bootSilentFactory } from '@alova/scene-react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { alovaInst } from './common/api';
import './index.css';

bootSilentFactory({
  alova: alovaInst,
  delay: 300,

  // 设置编辑笔记请求等待5000毫秒
  requestWait: silentMethod => {
    const { type, url, data } = silentMethod.entity;
    if (type === 'POST' && url === '/note' && (data as any).id) {
      return 5000;
    }
  }
});
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);