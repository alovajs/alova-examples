import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import { useState } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';
import { useRequest } from 'alova';
import { getMenus } from '../api';
import { actionDelegationMiddleware } from '@alova/scene-react';

interface DataItem {
  label: string;
  children?: DataItem[]
}
export default function SideMenu() {
  const { loading, data: menus } = useRequest(getMenus, {
    initialData: [],
    middleware: actionDelegationMiddleware('sideMenu')
  });

  return <div style={{ position: 'relative' }}>
    <Backdrop
      style={{ position: 'absolute', zIndex: 1000 }}
      open={loading}>
      <CircularProgress color="inherit" />
    </Backdrop>
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          侧边栏组件
        </ListSubheader>
      }
    >
      {menus.map(item => <MenuItem data={item} key={item.label}></MenuItem>)}
    </List>
  </div>;
}

function MenuItem ({ data }: { data: DataItem }) {
  const [open, setOpen] = useState(true);
  const handleClick = () => {
    setOpen(!open);
  };

  return <>
    <ListItemButton onClick={handleClick}>
      <ListItemIcon>
        <InboxIcon />
      </ListItemIcon>
      <ListItemText primary={data.label} />
      {data.children && data.children.length > 0 
        ? open ? <ExpandLess /> : <ExpandMore /> 
        : null}
    </ListItemButton>
    {data.children && data.children.length > 0 ? <Collapse in={open} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        {data.children.map(({ label }) => <ListItemButton key={label} sx={{ pl: 4 }}>
          <ListItemIcon>
            <StarBorder />
          </ListItemIcon>
          <ListItemText primary={label} />
        </ListItemButton>)}
      </List>
    </Collapse> : null}
  </>;
}