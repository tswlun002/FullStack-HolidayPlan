import * as React from 'react';
import ListItem from '@mui/material/ListItem';
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
  const {firstname,  lastname, age,username, roles, permissions}=data;
  const color =  roles.find(role=>role.name==="ADMIN")?green[500]:cyan[500];
  const Permissions =permissions;

  const addToPermission =(permissionList)=>{
    permissionList.forEach((p)=>
      {
          if(!Permissions.find(p1=>p1===p)) Permissions.push(p);
     })
    
  }

  roles.forEach((r)=>addToPermission(r.permissions))


   const handleExpandClick = () => {

            setDataSelectedUser({isUserSelected:true, fullname:`${firstname} ${lastname}`, email:username, permissions:Permissions});

   }

  return (
      <>
      <ListItem alignItems="flex-start">
        <ListItemButton  onClick={handleExpandClick} >
            <ListItemAvatar>
              <Avatar  sx={{ bgcolor:color}}><Typography sx={{color:"white", textAlign: "center",fontSize:"0.7rem"}}>{roles[0]?.name}</Typography></Avatar>
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
