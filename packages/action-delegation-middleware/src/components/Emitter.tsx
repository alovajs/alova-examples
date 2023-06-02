import { accessAction } from "@alova/scene-react";
import { Button, Paper, TextField, Typography } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import { useCallback, useState } from "react";

const wrapperStyle = {
  padding: '20px'
};

function Child2() {
  const [suffix, setSuffix] = useState('');
  const handleRefreshSideMenu = useCallback(() => {
    accessAction('sideMenu', ({ send }) => send(suffix));
  }, ['suffix']);
  const handleRemoveItem = useCallback(() => {
    accessAction('dataTable', ({ remove }) => {
      remove(1);
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
          <Button variant="outlined" onClick={handleRemoveItem}>移除一条表格数据</Button>
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