import { silentQueueMap } from "@alova/scene-react";
import { SilentMethod } from "@alova/scene-react/typings/general";
import { useEffect, useState } from "react";

/**
 * 获取改造的等待队列
 * @param queueName 队列名称
 * @returns 队列
 */
export default (queueName: string) => {
  const [waitingSilentQueue, setWaitingSilentQueue] = useState([] as SilentMethod[]);
  useEffect(() => {
    // 修改队列为可监听的队列
    const customQueue = [] as SilentMethod[];
    const originalPush = customQueue.push;
    const originalShift = customQueue.shift;
    customQueue.push = function(...items: SilentMethod[]) {
      waitingSilentQueue.push(...items);
      setWaitingSilentQueue([...waitingSilentQueue]);
      return originalPush.call(this, ...items);
    };
    customQueue.shift = function() {
      const silentMethodInstance = originalShift.call(this);
      waitingSilentQueue.shift();
      setWaitingSilentQueue([...waitingSilentQueue]);
      return silentMethodInstance;
    };
    silentQueueMap[queueName] = customQueue;
  }, []);
  return {
    queue: waitingSilentQueue,
    queueName
  };
}