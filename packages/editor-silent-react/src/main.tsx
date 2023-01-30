import { bootSilentFactory } from '@alova/scene-react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { alovaInst } from './common/api';
import './index.css';

bootSilentFactory({
  alova: alovaInst,
  delay: 0
});
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);