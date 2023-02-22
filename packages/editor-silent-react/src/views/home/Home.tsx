import { equals, filterSilentMethods, updateStateEffect, useSQRequest } from "@alova/scene-react";
import { Button, Card, CardActions, CardContent, Typography, Grid, IconButton, CardActionArea } from "@mui/material";
import { editNote, queryNotes, removeNote } from "../../common/api";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import styles from './home.module.css';
import { silentConfig } from "../../common/config";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const methodQueryNotes = queryNotes();

  // 获取笔记列表请求定义
  const { data: noteList, loading, send: refreshNoteList, onSuccess } = useSQRequest(() => methodQueryNotes, {
    initialData: [],
    force: isForce => !!isForce
  });

  onSuccess(({ data: noteListRaw }) => {
    // 步骤3：将未提交的数据手动补充到列表，以便即使数据未提交也能展示最新状态
    const defaultSmAry = filterSilentMethods();
    if (defaultSmAry.length <= 0) {
      return;
    }

    defaultSmAry.forEach(smItem => {
      if (!smItem.reviewData) {
        return;
      }
      const { operate, data } = smItem.reviewData;
      const index = noteListRaw.findIndex(({ id }) => equals(id, data.id));
      if ((operate === 'edit' || operate === 'remove') && index >= 0) {
        operate === 'edit' ? noteListRaw.splice(index, 1, data) : noteListRaw.splice(index, 1);
      } else if (operate === 'add' && index < 0) {
        // 在重新请求并命中缓存时将会有已添加的未提交项，这些需要过滤
        noteListRaw.unshift(data);
      }
    });
    updateStateEffect(methodQueryNotes, () => noteListRaw);
  });


  // 移除笔记请求定义
  const { loading: removing, onSuccess: onRemoveSuccess, send: removeSend } = useSQRequest(id => removeNote(id), {
    immediate: false,
    ...silentConfig
  });
  onRemoveSuccess(({
    silentMethod,
    sendArgs: [removedId]
  }) => {
    // 步骤1：手动更新列表数据
    updateStateEffect(methodQueryNotes, noteList => {
      const index = noteList.findIndex(({ id }) => id === removedId);
      if (index >= 0) {
        noteList.splice(index, 1);
      }
      return noteList;
    });

    // 步骤2：将静默数据存入reviewData中，以便在网络恢复刷新后获取断网时，手动补充到最新记录
    if (silentMethod) {
      silentMethod.reviewData = {
        operate: 'remove',
        data: {
          id: removedId
        }
      };
      silentMethod.save();
    }
  });

  // 新建笔记请求定义
  const { loading: adding, send: createNote, onSuccess: onCreateSuccess } = useSQRequest(() => editNote(''), {
    ...silentConfig,
    immediate: false,
    silentDefaultResponse() {
      return {
        id: undefined
      };
    },
  });
  onCreateSuccess(({ data, silentMethod }) => {
    const newId = data.id;
    if (newId === null) {
      return;
    }

    const newItem = {
      id: newId,
      content: '',
      updateTime: new Date().toISOString()
    };
    // 步骤1：手动更新列表数据
    updateStateEffect(methodQueryNotes, noteList => {
      noteList.unshift(newItem);
      return noteList;
    });

    // 步骤2：将静默数据存入reviewData中，以便在网络恢复刷新后获取断网时，手动补充到最新记录
    if (silentMethod) {
      // 开辟一个新的队列
      silentMethod.reviewData = {
        operate: 'add',
        data: newItem
      };
      silentMethod.save();
    }
    navigate('/detail?id=' + newId);
  });


  const navigate = useNavigate();
  const noteListViews = noteList.map(({ id, content, updateTime }) => <Grid item key={id + ''}>
    <Card>
      <CardActionArea onClick={() => navigate('/detail?id=' + id)}>
        <CardContent>
          <Typography color="text.secondary" gutterBottom>
            {updateTime}
          </Typography>
          <div className={styles.previewContent} dangerouslySetInnerHTML={{ __html: content }}></div>
        </CardContent>
      </CardActionArea>
      <CardActions>
      <IconButton className={removing ? styles.loading : ''} disabled={removing} onClick={() => removeSend(id)}>
        <DeleteForeverIcon />
      </IconButton>
      </CardActions>
    </Card>
  </Grid>);

  return (
    <Grid direction="column" container spacing={2}>
      <Grid item container spacing={2} direction="row" justifyContent="space-between">
        <Grid item>
        <Typography variant="h6">Note List</Typography>
        </Grid>
        <Grid item>
          <Button color="primary" className={loading ? styles.loading : ''} disabled={loading} onClick={() => refreshNoteList(true)}>
            <AutorenewIcon />
          </Button>
          <Button disabled={adding} color="primary" variant="contained" onClick={() => createNote()}>
            <AddCircleOutlineIcon />
          </Button>
        </Grid>
      </Grid>
      { noteList.length > 0 ? noteListViews : <Grid item>
        <div className={styles.empty}>
          <Inventory2Icon color="disabled" sx={{ fontSize: 64 }}></Inventory2Icon>
          <Typography variant="h6" color="text.disabled">Empty</Typography>
        </div>
      </Grid> }
    </Grid>
  )
};

export default Home;