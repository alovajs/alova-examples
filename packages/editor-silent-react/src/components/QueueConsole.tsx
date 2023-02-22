import { onSilentSubmitError, onSilentSubmitFail, silentQueueMap } from '@alova/scene-react';
import { netWorkStatuses, currentStatus, currentMode, useUpdateHook, networkStatusStorageKey } from '../common/config';
import { SilentMethod } from '@alova/scene-react/typings/general';
import { useCallback, useEffect, useState } from 'react';
import styles from './queueConsole.module.css';
import clsx from 'clsx';
import { Select, MenuItem } from '@mui/material';
import { useSnackbar } from 'notistack';
import useWaitingSilentQueue from './useWaitingSilentQueue';

/**
 * 请求队列组件
 * @returns 请求队列展示视图
 */
export default function QueueConsole() {
  const { enqueueSnackbar } = useSnackbar();
  const { updateCurrentMode, updateCurrentStatus } = useUpdateHook();
  const defaultWaitingSilentQueue = useWaitingSilentQueue('default');

  // 静默提交，多次重试后失败
  const [silentRequestError, setSilentRequestError] = useState('');
  useEffect(() => {
    const storagedStatus = sessionStorage.getItem(networkStatusStorageKey);
    if (storagedStatus) {
      updateCurrentStatus(Number(storagedStatus));
    }
    onSilentSubmitError(event => {
      console.error(event.error);
      enqueueSnackbar(`请求错误:${event.error}` + (event.retryDelay ? `，${event.retryDelay / 1000}秒后再次发起请求` : ''), {
        variant: 'error'
      });
    });
    onSilentSubmitFail(event => {
      setSilentRequestError(event.error);
      enqueueSnackbar('达到最大重试次数，但你仍然可以正常操作', {
        variant: 'error'
      });
    });
  }, []);
  

  // 用于强制刷新
  const [, updateEmptyState] = useState({});
  const forceUpdate = useCallback(() => updateEmptyState({}), []);
  return (
    <div className={styles['console-wrapper']}>
      <div className={styles['input-group']}>
        <Select
          value={currentMode}
          placeholder="选择请求模式"
          style={{ width: '200px' }}
          onChange={({ target }) => {
            updateCurrentMode(target.value as number)
            forceUpdate();
          }}>
            <MenuItem value={0}>静默请求模式</MenuItem>
            <MenuItem value={1}>正常请求模式</MenuItem>
        </Select>
        <Select
          value={currentStatus}
          placeholder="选择网络状态"
          style={{ width: '200px' }}
          onChange={({ target }) => {
            updateCurrentStatus(target.value as number);
            forceUpdate();
          }}>
          { netWorkStatuses.map(({ label, value }) => <MenuItem key={value} value={value}>{label}</MenuItem>) }
        </Select>
      </div>
      <div className={styles.console}>
        {
          [defaultWaitingSilentQueue].map(({ queue, queueName }) => <div key={queueName} className={styles.queue}>
            <div className={styles.title}>[{queueName}]请求队列</div>
            <div className={styles['queue-wrap']}>
              {
                queue.map((sm, i) => <div key={sm.id} className={styles['method-item']}>
                  { !silentRequestError || i > 0 ? <div className={styles.status}>
                    <div className={clsx(styles.point, i > 0 ? styles.waiting : styles.acting)}></div>
                    { i > 0 ? 'waiting' : 'acting' }
                  </div>
                  : 
                  <div className={styles.status}>
                    <div className={styles['error-tag']}>×</div>
                    请求错误
                  </div> }
                  <span>[{ sm.entity.type }]{ sm.entity.url }</span>
                </div>)
              }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}