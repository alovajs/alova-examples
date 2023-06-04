import { accessAction } from "@alova/scene-react";
import { Button, Paper, TextField, Typography } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import { useRequest } from "alova";
import { useCallback, useRef, useState } from "react";
import { removeStudent } from "../api";

const wrapperStyle = {
  padding: '20px'
};

function Child2() {
  const [suffix, setSuffix] = useState('');
  const handleRefreshSideMenu = useCallback(() => {
    accessAction('sideMenu', ({ send }) => send(suffix));
  }, [suffix]);

  const { loading: removing, send: removeSend } = useRequest(removeStudent, {
    immediate: false
  });

  // const { loading: refreshing, send: refreshSend } = useRequest(removeStudent, {
  //   immediate: false
  // });

  const handleRemoveItem = useCallback(() => {
    accessAction('dataTable', async ({ remove, getState }) => {
      await removeSend(getState('data')[0].id);
      remove(0);
    });
  }, []);
  const handleRefresh = useCallback(() => {
    accessAction('dataTable', async ({ refresh, getState }) => {
      refresh(getState('page'));
    });
  }, []);
  const handleReload = useCallback(() => {
    accessAction('dataTable', async ({ reload }) => {
      reload();
    });
  }, []);

  return (
    <Paper variant="outlined" style={wrapperStyle}>
      <Typography variant="h6" gutterBottom>子组件2</Typography>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <Typography gutterBottom color="primary">
            使用操作函数代理中间件（ActionDelegationMiddleware），在任意组件中触发指定的请求刷新数据，不需要使用全局状态
          </Typography>
        </Grid>
        <Grid xs={6}>
          <TextField
            label="菜单后缀参数"
            value={suffix}
            size="small"
            onChange={({ target }) => {
              setSuffix(target.value);
            }}></TextField>
          <Button variant="outlined" onClick={handleRefreshSideMenu}>刷新侧边栏</Button>
        </Grid>

        <Grid xs={2}>
          <Button variant="outlined" onClick={handleRemoveItem} disabled={removing}>移除一条表格数据</Button>
        </Grid>
        <Grid xs={2}>
          <Button variant="outlined" onClick={handleRefresh}>刷新表格当前页</Button>
        </Grid>
        <Grid xs={2}>
          <Button variant="outlined" onClick={handleReload}>重载表格</Button>
        </Grid>
      </Grid>
    </Paper>
  )
}

function Child1() {
  return (
    <Paper variant="outlined" style={wrapperStyle}>
      <Typography variant="h6" gutterBottom>子组件1</Typography>
      <Child2></Child2>
    </Paper>
  )
}

export default function Root() {
  return (
    <Paper variant="outlined" style={wrapperStyle}>
      <Typography variant="h6" gutterBottom>根组件</Typography>
      <Child1></Child1>
    </Paper>
  );
}