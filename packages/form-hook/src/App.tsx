import './App.css';
import StoreFormCard from './components/StoreFormCard';
import EditFormCard from './components/EditFormCard';
import MultiFormCard from './components/MultiFormCard';
import ConditionFilterCard from './components/ConditionFilterCard';
import Grid from '@mui/material/Unstable_Grid2';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container rowSpacing={2} columnSpacing={2}>
        <Grid xs={6}>
          <StoreFormCard></StoreFormCard>
        </Grid>
        <Grid xs={6}>
          <EditFormCard></EditFormCard>
        </Grid>
        <Grid xs={6}>
          <MultiFormCard></MultiFormCard>
        </Grid>
        <Grid xs={6}>
          <ConditionFilterCard></ConditionFilterCard>
        </Grid>
      </Grid>
    </LocalizationProvider>
  )
}

export default App
