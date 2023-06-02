import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import {
  FormControlLabel,
  MenuItem,
  Switch,
  FormControl,
  FormGroup,
  FormLabel,
  Checkbox,
  Button,
  Typography,
  TextField,
  CardContent,
  CardActions,
  FormHelperText,
  Backdrop,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useForm } from '@alova/scene-react';
import { getData, submitData } from '../common/api';
import { format, parseISO } from 'date-fns';
import { useRequest } from 'alova';
import LoadingButton from '@mui/lab/LoadingButton';

/**
 * 带草稿功能的表单提交
 */
export default function StoreFormCard() {
  const options = [
    {
      value: 1,
      name: 'option1',
      label: '选项1',
    },
    {
      value: 2,
      name: 'option2',
      label: '选项2',
    },
    {
      value: 3,
      name: 'option3',
      label: '选项3',
    }
  ];


  const { form, send, updateForm, reset, onSuccess, loading: submiting }= useForm(
    form => submitData({
      ...form,
      date: form.date ? format(form.date, 'yyyy-MM-dd hh:mm:ss') : null
    }), {
    initialForm: {
      input: '',
      select: '' as string | number,
      date: null as Date | null,
      switch: false,
      checkbox: {
        option1: false,
        option2: false,
        option3: false
      }
    },
    resetAfterSubmit: true
  });
  onSuccess(({ data }) => {
    alert('提交成功; 提交数据为：' + JSON.stringify(data))
  });

  const { loading, onSuccess: onDataSuccess } = useRequest(getData);
  onDataSuccess(({ data }) => {
    updateForm({
      ...data,
      date: data.date ? parseISO(data.date) : null
    });
  })

  return (
    <Card sx={{ minWidth: 275 }} style={{ position: 'relative' }}>
      <Backdrop style={{ position: 'absolute' }} open={loading}>
        <CircularProgress />
      </Backdrop>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          编辑表单数据
        </Typography>
        
        <Grid container rowSpacing={2}>
          <Grid xs={12}>
            <TextField 
              label="输入"
              variant="outlined"
              value={form.input}
              onChange={({ target }) => updateForm({ input: target.value })}
              fullWidth />
          </Grid>
          <Grid xs={12}>
            <TextField
              select
              label="请选择"
              variant="outlined"
              value={form.select}
              onChange={({ target }) => updateForm({ select: target.value })}
              fullWidth>
              {options.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid xs={12}>
            <DatePicker label="日期" value={form.date} onChange={value => updateForm({ date: value })} />
          </Grid>
          <Grid xs={12}>
            <FormControlLabel
              required
              control={
                <Switch checked={form.switch} onChange={({ target }) => updateForm({ switch: target.checked })} />
              }
              label="开关" />
          </Grid>
          <Grid xs={12}>
            <FormControl component="fieldset" variant="standard">
              <FormLabel component="legend">多选</FormLabel>
              <FormGroup>
                {options.map(option => (
                  <FormControlLabel
                    key={option.name}
                    control={
                      <Checkbox checked={form.checkbox[option.name as keyof typeof form.checkbox]} onChange={({ target }) => {
                        updateForm({
                          checkbox: {
                            ...form.checkbox,
                            [option.name]: target.checked
                          }
                        })
                      }} name="" />
                    }
                    label={option.label}
                  />
                ))}
              </FormGroup>
              <FormHelperText>Be careful</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <LoadingButton size="small" variant="contained" loading={submiting} onClick={() => {
          send()
        }}>提交</LoadingButton>
        <Button size="small" variant="outlined" onClick={reset}>重置</Button>
      </CardActions>
    </Card>
  );
}