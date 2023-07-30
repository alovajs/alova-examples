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
  FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useForm } from '@alova/scene-react';
import { submitData } from '../common/api';
import { format } from 'date-fns';
import LoadingButton from '@mui/lab/LoadingButton';
import { useCallback, useState } from 'react';

const initialForm = {
  input: '',
  select: '' as string | number,
  date: null as Date | null,
  switch: false,
  checkbox: {
    option1: false,
    option2: false,
    option3: false
  }
};
/**
 * 多表单提交
 */
export default function MultiFormCard() {
  const formComponents = [<FormOne />, <FormTwo />, <FormThree />];
  const [currentStep, setCurrentStep] = useState(0);
  const addCurreentStep = useCallback(() => {
    setCurrentStep(v => v + 1);
  }, [currentStep]);
  const subCurreentStep = useCallback(() => {
    setCurrentStep(v => v - 1);
  }, [currentStep]);

  const { send, onSuccess, loading: submiting, form }= useForm(
    form => submitData({
      ...form,
      date: form.date ? format(form.date, 'yyyy-MM-dd hh:mm:ss') : null
    }), {
    id: 'multi-form-id',
    initialForm,
    resetAfterSubmiting: true
  });
  onSuccess(({ data }) => {
    alert('提交成功; 提交数据为：' + JSON.stringify(data))
  });

  return (
    <Card sx={{ minWidth: 275 }} style={{ position: 'relative' }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          多步骤表单（多个组件内的表单共享表单数据，统一提交）
        </Typography>

        <Grid container rowSpacing={2}>
          {formComponents[currentStep]}
        </Grid>
      </CardContent>
      <CardActions>
        { currentStep > 0 && currentStep < formComponents.length ? <Button size="small" variant="outlined" onClick={subCurreentStep}>上一步</Button> : null }
        {
          currentStep < formComponents.length - 1 ? <Button size="small" onClick={addCurreentStep} variant="contained">下一步</Button> 
            : <LoadingButton size="small" variant="contained" loading={submiting} onClick={() => {
              send()
            }}>提交</LoadingButton>
        }
      </CardActions>
    </Card>
  );
}

function FormOne() {
  // 通过获得id为multi-form-id的共享数据
  const { form, updateForm }= useForm<typeof initialForm>('multi-form-id');
  return <>
    <Grid xs={12}>
      <TextField
        label="输入"
        variant="outlined"
        value={form.input}
        onChange={({ target }) => updateForm({ input: target.value })}
        fullWidth />
    </Grid>
  </>;
}

function FormTwo() {
  // 通过获得id为multi-form-id的共享数据
  const { form, updateForm }= useForm('multi-form-id');
  return <>
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
  </>;
}

function FormThree() {
  // 通过获得id为multi-form-id的共享数据
  const { form, updateForm }= useForm('multi-form-id');
  return (
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
  );
}

var options = [
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