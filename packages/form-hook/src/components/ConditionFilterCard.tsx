import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import {
  MenuItem,
  Button,
  Typography,
  TextField,
  CardContent,
  Chip,
  Backdrop,
  CircularProgress
} from '@mui/material';
import { useForm } from '@alova/scene-react';
import { getCityArea } from '../common/api';
import { useRef } from 'react';

/**
 * 条件筛选数据
 */
export default function StoreFormCard() {
  const cityOptions = [
    {
      value: 'bj',
      label: '北京',
    },
    {
      value: 'sh',
      label: '上海',
    }
  ];

  const { form, send, updateForm, reset, loading, data: areaList }= useForm(getCityArea, {
    initialForm: {
      search: '',
      city: ''
    },
    initialData: [],
    immediate: true,
    store: true
  });
  const sendHandler = useRef(send);
  sendHandler.current = send; // 每次更新send函数，保证在setTimeout中可以获得最新的send函数

  return (
    <Card sx={{ minWidth: 275 }} style={{ position: 'relative' }}>
      <Backdrop style={{ position: 'absolute' }} open={loading}>
        <CircularProgress />
      </Backdrop>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          条件筛选非分页数据（分页数据建议使用usePagination管理）
        </Typography>

        <Grid container columnSpacing={2} rowSpacing={2}>
          <Grid xs={4}>
            <TextField
              size="small"
              label="按区域名搜索"
              variant="outlined"
              value={form.search}
              onChange={({ target }) => updateForm({ search: target.value })}
              fullWidth />
          </Grid>
          <Grid xs={4}>
            <TextField
              select
              size="small"
              label="请选择城市"
              variant="outlined"
              value={form.city}
              onChange={({ target }) => updateForm({ city: target.value })}
              fullWidth>
              {cityOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid xs={2}>
            <Button variant="contained" onClick={send}>搜索</Button>
          </Grid>
          <Grid xs={2}>
            <Button variant="outlined" onClick={() => {
              reset();
              setTimeout(() => sendHandler.current(), 20);
            }}>重置</Button>
          </Grid>
          <Grid xs={12}>
            {areaList.map(({ label }) => <Chip 
              key={label}
              style={{
                marginRight: '10px',
                marginBottom: '10px'
              }}
              variant="outlined"
              color="primary"
              label={label} />)}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}