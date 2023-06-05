import './App.css';
import Grid from '@mui/material/Unstable_Grid2';
import { Button, CircularProgress, TextField } from '@mui/material';
import { sendCaptcha, submitData } from './api';
import { useCaptcha } from '@alova/scene-react';
import { useCallback, useState } from 'react';
import { useRequest } from 'alova';

function App() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const { loading, onSuccess, countdown, send } = useCaptcha(sendCaptcha, {
    initialCountdown: 20
  });
  onSuccess(({ data }) => {
    setCode(data.code);
  });
  const handleSendCaptcha = useCallback(() => {
    send(phone);
  }, [phone]);

  const { loading: submiting, send: submitSend, onSuccess: onSubmitSuccess } = useRequest(() => submitData(phone, code), {
    immediate: false
  });
  onSubmitSuccess(({ data }) => {
    alert('提交数据为：' + data);
  });

  return (
    <Grid container spacing={3}>
      <Grid xs={12}>
        <TextField
          label="输入手机号"
          value={phone}
          size="small"
          onChange={({ target }) => {
            setPhone(target.value);
          }}></TextField>
        <Button variant="outlined" onClick={handleSendCaptcha} disabled={loading || countdown > 0} size="large">
          {loading ? <CircularProgress size={20} color="inherit" /> 
            : countdown > 0 ? `${countdown}后可重发` : '发送验证码'}
        </Button>
      </Grid>
      <Grid xs={12}>
        <TextField
          label="验证码"
          value={code}
          size="small"
          onChange={({ target }) => {
            setCode(target.value);
          }}></TextField>
      </Grid>
      <Grid xs={12}>
        <Button variant="contained" disabled={submiting} onClick={submitSend}>
          {submiting ? <CircularProgress size={20} color="inherit" /> : '提交数据'}
        </Button>
      </Grid>
    </Grid>
  );
}

export default App
