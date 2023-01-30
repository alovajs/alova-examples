import { useSQRequest } from "@alova/scene-react";
import { Button, Card, CardActions, CardContent, Typography, Grid, IconButton, CardActionArea } from "@mui/material";
import { queryNotes, removeNote } from "../../common/api";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import styles from './home.module.css';
import { invalidateCache } from "alova";
import { silentConfig } from "../../common/config";
import { useNavigate } from "react-router-dom";

const Home = () => {
  // 获取笔记列表请求定义
  const { data: noteList, loading, send } = useSQRequest(queryNotes, {
    initialData: []
  });

  // 移除笔记请求定义
  const { loading: removing, onSuccess: onRemoveSuccess, send: removeSend } = useSQRequest(id => removeNote(id), {
    immediate: false,
    ...silentConfig
  });
  onRemoveSuccess(({
    sendArgs: [removedId]
  }) => {
    const index = noteList.findIndex(({ id }) => id === removedId);
    if (index >= 0) {
      noteList.splice(index, 1);
    }
  });


  const navigate = useNavigate();
  const noteListViews = noteList.map(({ id, content, updateTime }) => <Grid item key={id}>
    <Card>
      <CardActionArea onClick={() => navigate('/detail?id=' + id)}>
        <CardContent>
          <Typography color="text.secondary" gutterBottom>
            {updateTime}
          </Typography>
          <Typography variant="body1">
            {content}
          </Typography>
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
      <Grid item container spacing={2} direction="row" justifyContent="flex-end">
        <Grid item>
          <Button color="primary" className={loading ? styles.loading : ''} disabled={loading} onClick={() => {
            invalidateCache('noteList');
            send();
          }}>
            <AutorenewIcon />
          </Button>
        </Grid>
        <Grid item>
          <Button color="primary" variant="contained">
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