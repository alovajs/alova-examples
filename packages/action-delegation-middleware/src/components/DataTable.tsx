import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { actionDelegationMiddleware, usePagination } from '@alova/scene-react';
import { queryStudents } from '../api';
import { useState } from 'react';
import { Backdrop, CircularProgress, MenuItem, Pagination, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

export default function DataTable() {
  const [studentName, setStudentName] = useState('');
  const [clsName, setClsName] = useState('');
  const {
    loading,
    data: students,
    page: [page, setPage],
    pageCount,
  } = usePagination(
    (page, pageSize) =>
      queryStudents(page, pageSize, studentName, clsName),
    {
      watchingStates: [studentName, clsName],
      initialPageSize: 5,
      initialData: { total: 0, list: [] },
      debounce: [800],
      total: (res) => res.total,
      data: (res) => res.list,
      middleware: actionDelegationMiddleware('dataTable')
    }
  );

  return <div style={{ position: 'relative' }}>
    <Backdrop
      style={{ position: 'absolute' }}
      open={loading}>
      <CircularProgress color="inherit" />
    </Backdrop>

    <Grid container spacing={2}>
      <Grid xs={12}>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          分页表格组件
        </Typography>
      </Grid>
      <Grid xs={6}>
        <TextField 
          label="filter student"
          variant="outlined"
          value={studentName}
          onChange={({ target }) => setStudentName(target.value)}
          fullWidth />
      </Grid>
      <Grid xs={6}>
        <TextField 
          select
          label="filter student"
          variant="outlined"
          value={clsName}
          onChange={({ target }) => setClsName(target.value)}
          fullWidth>
          {[
              {
                label: 'class 1',
                value: 'class 1',
              },
              {
                label: 'class 2',
                value: 'class 2',
              },
              {
                label: 'class 3',
                value: 'class 3',
              },
            ].map(({ label, value }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid xs={12}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Class</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map(row => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.cls}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid xs={12}>
        <Pagination
          count={pageCount}
          color="primary"
          showFirstButton
          showLastButton
          page={page}
          onChange={(_, page) => {
            setPage(page)
          }} />
      </Grid>
    </Grid>
  </div>;
}