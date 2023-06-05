import * as React from 'react';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { Box,Paper } from '@mui/material';
import  UserItem from "../component/UserItem";
import ListSubheader from '@mui/material/ListSubheader';
import {FetchUsers} from "../utils/User"
import UseAxiosPrivate from '../utils/UseAxiosPrivate'
import { IconButton } from '@material-ui/core';
import Checkbox from '@mui/material/Checkbox';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import {DeleteUser} from '../utils/User';
import AccountButton  from '../component/AccountButton';
import CancelIcon from '@mui/icons-material/Cancel';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import ErrorComponent from '../component/ErrorComponent'


const CheckboxListSecondary = ({data})=>{
      const [checked, setChecked] = React.useState([1]);

      const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
      };

  return (
    <List dense sx={{margin:"0rem 2rem", maxWidth: 400 }}>
      {data.map((value) => {
        const labelId = `checkbox-list-secondary-label-${value.name}`;
        return (
          <ListItem
            key={value.name}
            secondaryAction={
              <Checkbox
                edge="end"
                onChange={handleToggle(value.name)}
                checked={checked.indexOf(value.name) !== -1}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            }
            disablePadding
          >
            <ListItemButton>
              <ListItemText id={labelId} primary={value.name} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}

export default function ListUser() {
  const useAxiosPrivate = UseAxiosPrivate();

   const[users, dispatchUsers] = React.useReducer(
        (state, action)=>{
            return {...state, ...action}
        },
        {
            data:[],isDataAvailable:false,isRequestError:false, errorMessage:"",
        }
   );
   const[userAccount, dispatchUserAccount]  = React.useReducer(
           (state, action)=>{
               return {...state, ...action}
           },
           {
                isRequestError:false, isRequestSucceeded:false,  requestResponseMessage:""
           }
    );
   const[dataSelectedUser, setDataSelectedUser] = React.useReducer(
        (state, action)=>{
            dispatchUserAccount({isRequestError:false, isRequestSucceeded:false,  requestResponseMessage:""});

            return {...state, ...action};
        },
        {
            isUserSelected:false, fullname:"", email:"",userType:"",permissions:[]
        }

    );



   React.useEffect(()=>{
        let isMounted = true;
        const controller = new AbortController();
        isMounted && FetchUsers(useAxiosPrivate, dispatchUsers,controller);
        return ()=>{isMounted=false; controller.abort();}
   },[]);


    const UsersItems  = users.data?.map((data, index)=>{
         return(
             <UserItem key={index} data={data} setDataSelectedUser={setDataSelectedUser}/>
         )
    });

   const onDeleteUser = (e)=>{
          e.preventDefault();
          DeleteUser(useAxiosPrivate,dataSelectedUser.email,dispatchUserAccount)
   }

   const buttonStyle = {marginTop:"auto",minWidth:"10rem",color:"red",width:"fit-content",borderRadius:"0.5rem", backgroundColor:"white"};
   const AccountInfoComponent =  ()=>{

          return <Card
                   sx={{boxShadow: 24,
                       display:"block",
                       backgroundColor:'white'
                    }}
                   padding="1rem"
                   overflow='auto'
                   boxShadow="1rem"
                   borderRadius="2rem"

                   >
                   <CardHeader
                           action={
                             <IconButton  onClick ={()=>setDataSelectedUser({isUserSelected:false})}>
                               {<CancelIcon/>}
                             </IconButton>
                           }
                           title={dataSelectedUser.fullname}
                           subheader={dataSelectedUser.email}

                   />

                   <CardActions disableSpacing  sx={{ display:{xs:"block", md:"flex" } }}>
                      <CheckboxListSecondary data={dataSelectedUser.permissions}/>
                      {dataSelectedUser.permissions.length>0&&<AccountButton  style={buttonStyle}variant="contained" size="small">Delete Permission</AccountButton>}
                      <AccountButton onClick={e=>onDeleteUser(e)}  style={buttonStyle}variant="contained" size="small">Delete User</AccountButton>
                   </CardActions >

              </Card>


   }

 console.log(userAccount);
  return (


         <Paper sx={{
                 display:"flex",
                 justifyContent:"center",
                 alignItems:"center",
                 minHeight:"100vh",
                 backgroundColor:"#dfe0e6",
                 width:"100%",
                }}>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                backgroundColor="#dfe0e6"
                minWidth={400}
                sx={{margin:{ md:"1rem",xs:"1rem"}}}

            >
                <List sx={{ width: '100%',
                            minWidth: 400,
                            bgcolor: 'background.paper',
                            position: 'relative',
                            overflow: 'auto',
                             maxHeight:"80vh",

                            '& ul': { padding: 0 },}}>
                <ListSubheader sx={{backgroundColor:"transparent",}}><Typography sx={{textDecoration:"underline"}}color="primary" align="center" variant="h3">Users</Typography></ListSubheader>
                {users.isDataAvailable?UsersItems:<Typography color="red" align="center" variant="h3">{users.errorMessage }</Typography>}
                </List>

            </Box>

           <Collapse in={dataSelectedUser.isUserSelected} timeout="auto" unmountOnExit  sx={{display:{xs:"none",md:"block"}}}>
              {

                 (userAccount.isRequestSucceeded || userAccount.isRequestError)&&<ErrorComponent errorMessage={userAccount.requestResponseMessage}/>

              }
              {<AccountInfoComponent/>}
           </Collapse>
           <Modal
                 open={dataSelectedUser.isUserSelected}
                onClose={()=>setDataSelectedUser({isUserSelected:false})}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
                sx={{display:{xs:"block",md:"none"}}}
           >
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                  {

                       (userAccount.isRequestSucceeded || userAccount.isRequestError)&&<ErrorComponent errorMessage={userAccount.requestResponseMessage}/>

                   }
                  {<AccountInfoComponent/>}

               </Box>
           </Modal>

       </Paper>


  );
}