import * as React from 'react';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import  UserItem from "../component/UserItem"
import ListSubheader from '@mui/material/ListSubheader';
import {FetchUsers} from "../utils/User"
import UsePrivateAxios from '../utils/UseAxiosPrivate'

export default function ListUser() {
  const usePrivateAxios = UsePrivateAxios();
   const[users, dispatchUsers] = React.useReducer((state, action)=>{
        return {...state, ...action}
   },{
    data:[],
    isDataAvailable:false,isRequestError:false, errorMessage:"",
   })


   React.useEffect(()=>{

        let isMounted = true;
        const controller = new AbortController();
        isMounted && FetchUsers(usePrivateAxios, dispatchUsers,controller);
        return ()=>{isMounted=false; controller.abort();}
   },[])


    const UsersItems  = users.data?.map((data, index)=>{
         return(
             <UserItem key={index} data={data}/>
         )
    })
  return (
    <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        backgroundColor="#dfe0e6"
        marginTop="2rem"


    >
        <List sx={{ width: '100%',
                    maxWidth: 550,
                    bgcolor: 'background.paper',
                    position: 'relative',
                    overflow: 'auto',
                     maxHeight:"80vh",

                    '& ul': { padding: 0 },}}>
        <ListSubheader sx={{backgroundColor:"transparent",}}><Typography sx={{textDecoration:"underline"}}color="primary" align="center" variant="h3">Users</Typography></ListSubheader>
        {users.isDataAvailable?UsersItems:<Typography color="red" align="center" variant="h3">{users.errorMessage }</Typography>}
        </List>

    </Box>
  );
}