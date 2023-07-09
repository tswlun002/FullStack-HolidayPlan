import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ListUsers from '../component/ListUsers';
import {RolePermissionContext} from '../context/RolePermissionContext';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@material-ui/core';
import Permissions from '../component/Permissions';
import UsePrivateAxios from '../utils/UseAxiosPrivate'
import {getErrorMessage} from '../utils/Error';
import RegisterAdminForm from './RegisterAdmin';

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
export default function Users() {

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const[roles, setRoles] = React.useReducer((state, action)=>{return{...state,...action}},{listRoles:[],exceptionMessage:""});
  const[permissions, setPermissions] = 
  React.useReducer((state, action)=>{return{...state,...action}},{listPermissions:[],exceptionMessage:""});
  const theme =  useTheme();
  const small = useMediaQuery(theme.breakpoints.down('sm'));
  const usePrivateAxios = UsePrivateAxios();
  //Get all permissions
    React.useEffect(()=>{
          let isMounted = true;
          const controller = new AbortController();
          const API = '/holiday-plan/api/admin/permission/permissions/';
          isMounted && usePrivateAxios.get(API, {signal:controller.signal})
          .then(response => {
              if(response.ok || response.status===200){
                  setPermissions({
                      listPermissions:response.data,
                      exceptionMessage:"Successfully fetched permissions"
                  });
              }
          })
          .catch(err => {

              if(!err?.response.ok){
                  const errorMessage  = getErrorMessage(err);
                  setPermissions({exceptionMessage:errorMessage});
              }
              else{
                  setPermissions({exceptionMessage:"Server Error"});
              }
          });
  	    return ()=>{isMounted=false; controller.abort();}

    },[]);
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
            <Tab sx={{maxWidth:{xs:"3rem", md:"auto"}}} label="Users" {...a11yProps(0)} />
            <Tab  sx={{minWidth:{xs:"5rem", md:"auto"}}} label="Register" {...a11yProps(1)} />
        
          </Tabs>
          <TabPanel value={value} index={0}>
            <ListUsers/>
          </TabPanel>
          <TabPanel value={value} index={1}>
             <RegisterAdminForm/>
          </TabPanel>
        </Box>
       
    </RolePermissionContext.Provider>
  );
}
