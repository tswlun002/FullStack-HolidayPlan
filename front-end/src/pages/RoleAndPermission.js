import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import RoleTable from '../component/RoleTable';
import {RolePermissionContext} from '../context/RolePermissionContext';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@material-ui/core';
import Permissions from '../component/Permissions';
import { getAllPermissions } from '../utils/PermissionApi';
import  {getAllRoles} from '../utils/RoleApi';
import UsePrivateAxios from '../utils/UseAxiosPrivate'
import {getErrorMessage} from '../utils/Error';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,color:"black", 
  };
}
export default function RoleAndPermission() {

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const[roles, setRoles] = React.useReducer((state, action)=>{return{...state,...action}},{listRoles:[],exceptionMessage:""});
  const[permissions, setPermissions] = 
  React.useReducer((state, action)=>{return{...state,...action}},{listPermissions:[],exceptionMessage:""});
  const theme =  useTheme();
  const small = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <RolePermissionContext.Provider value={{roles, setRoles, permissions ,setPermissions}}>
     
        <Box
          display={small?'block':'flex'}
          padding="8rem 0.5rem"
          sx={{ flexGrow: 1, bgcolor: '#dfe0e6', 
          minHeight: "100vh", width:{sm:"100%",md:"auto"} }}
        >
          <Tabs
            orientation={small?"horizontal":"vertical"}
            variant={small?"none":"scrollable"}
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: 'divider', }}
          >
            <Tab sx={{maxWidth:{xs:"3rem", md:"auto"}}} label="Roles" {...a11yProps(0)} />
            <Tab  sx={{minWidth:{xs:"5rem", md:"auto"}}} label="Permissions" {...a11yProps(1)} />
        
          </Tabs>
          <TabPanel value={value} index={0}>
            <RoleTable/>
          </TabPanel>
          <TabPanel value={value} index={1}>
             <Permissions />
          </TabPanel>
        </Box>
       
    </RolePermissionContext.Provider>
  );
}
