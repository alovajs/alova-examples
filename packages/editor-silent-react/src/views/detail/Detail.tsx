import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useLocation } from 'react-router-dom';
import { equals, getSilentMethod, isVData, onSilentSubmitSuccess, useSQRequest } from '@alova/scene-react';
import { editNote, Note, noteDetail, queryNotes } from '../../common/api';
import { useCallback, useEffect } from 'react';
import { silentConfig } from '../../common/config';
import { queryCache, setCache } from 'alova';
import { Box, CircularProgress } from '@mui/material';

const methodNoteList = queryNotes();
const Detail = () => {
  const { search } = useLocation();
  const urlParams = new URLSearchParams(search);
  let currentId = urlParams.get('id') || 0;
  currentId = isVData(currentId) || !currentId ? currentId : Number(currentId);
  useEffect(() => {
    // 每次请求前先设置缓存，达到共享缓存的目的
    const storageNoteList = queryCache(queryNotes());
    if (storageNoteList) {
      const noteItem = storageNoteList.find(noteItem => equals(noteItem.id, currentId));
      noteItem && setCache(noteDetail(currentId), noteItem);
    }

    // 当新增时，currentId为虚拟数据，通过监听静默提交来更正此id
    return onSilentSubmitSuccess(({ vDataResponse }) => {
      if (vDataResponse[currentId]) {
        currentId = vDataResponse[currentId];
        history.replaceState(null, '', '?id=' + currentId);
      }
    });
  }, []);

  // 请求数据
  const { data: detail, update } = useSQRequest(() => noteDetail(currentId), {
    behavior: 'static',
    initialData: {
      content: ''
    },
  });

  // 提交编辑的笔记数据
  const { loading: editing, send: submitNote, onSuccess, onBeforePushQueue } = useSQRequest((content: string) => editNote(content, currentId), {
    ...silentConfig,
    immediate: false,
  });

  onBeforePushQueue(event => {
    // 每次替换指定id的旧method，减少请求次数
    const prevSumbmitMethod = getSilentMethod('methodEditNote' + currentId);
    if (event.silentMethod && prevSumbmitMethod) {
      prevSumbmitMethod.replace(event.silentMethod);
      return false;
    }
  });
  onSuccess(({
    silentMethod,
    sendArgs: [content]
  }) => {
    let editingItem: Note | undefined = undefined;
    // 步骤1：手动更新列表数据
    setCache(methodNoteList, noteList => {
      if (!noteList || !currentId) {
        return;
      }

      editingItem = noteList.find(noteItem => equals(noteItem.id, currentId));
      if (editingItem) {
        editingItem.content = content;
        editingItem.updateTime = new Date().toISOString();
      }
      return noteList;
    });

    // 步骤2：将静默数据存入reviewData中，以便在网络恢复刷新后获取断网时，手动补充到最新记录
    if (silentMethod && editingItem) {
      silentMethod.reviewData = {
        operate: 'edit',
        data: editingItem
      };
      silentMethod.setUpdateState(methodNoteList);
      silentMethod.save();
    }
  });

  const contentChanged = useCallback((val: string) => {
    submitNote(val);
    update({
      data: {
        ...detail,
        content: val,
      }
    });
  }, []);

  return (
    <Box>
      <ReactQuill theme="snow" value={detail.content} onChange={contentChanged} />
      { editing ? <Box sx={{ display: 'flex', alignItems: 'center' }} mt={2}>
        <CircularProgress size={16} />
      </Box> : null }
    </Box>
  )
};

export default Detail;