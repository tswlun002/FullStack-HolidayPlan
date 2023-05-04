import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import {CreateAuthContext} from '../context/CreateAuthContext';
import { green, cyan} from '@mui/material/colors';
export default function UserItem({data,setDataSelectedUser}) {

   const { dispatchLogin } = React.useContext(CreateAuthContext);

   const controller = new AbortController();
  const {firstname,  lastname, age,username, userType, roles}=data;
  const color =  userType==="ADMIN"?green[500]:cyan[500];
  const permissions =[]

  const addToPermission =(permissionList)=>{
    permissionList.forEach((p)=>permissions.push(p))
  }

  roles.forEach((r)=>addToPermission(r.permissions))


   const [expanded, setExpanded] = React.useState(false);

   const handleExpandClick = () => {

            setDataSelectedUser({isUserSelected:true, fullname:`${firstname} ${lastname}`, email:username,userType:userType, permissions:permissions});

   }

  return (
      <>
      <ListItem alignItems="flex-start">
        <ListItemButton  onClick={handleExpandClick} >
            <ListItemAvatar>
              <Avatar  sx={{ bgcolor:color}}><Typography sx={{color:"white", textAlign: "center",fontSize:"0.7rem"}}>{userType}</Typography></Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={`${firstname} ${lastname}`}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                   {username}
                  </Typography>

                </React.Fragment>
              }
            />


         </ListItemButton>
      </ListItem>

      </>
  );
}
