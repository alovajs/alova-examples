import './App.css';
import SideMenu from './components/SideMenu';
import Grid from '@mui/material/Unstable_Grid2';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import Emitter from './components/Emitter';
import DataTable from './components/DataTable';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container spacing={3}>
        <Grid xs={3}>
          <SideMenu></SideMenu>
        </Grid>
        <Grid xs={9}>
          <DataTable></DataTable>
        </Grid>
        <Grid xs={12}>
          <Emitter></Emitter>
        </Grid>
      </Grid>
    </LocalizationProvider>
  )
}

export default App
