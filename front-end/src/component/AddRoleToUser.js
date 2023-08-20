import { Box, Card, CardActions, CardContent, CardHeader } from "@mui/material";
import SelectHasSearch from "./SeleteHasSearch";
import { useReducer, useState, useEffect } from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import {IconButton} from "@mui/material";
import ColorButton from '../component/ColorButton';
import SelectedItems from "./SelectedItems";
import UsePrivateAxios from '../utils/UseAxiosPrivate'
import {getErrorMessage} from '../utils/Error';

export default function AddRoleToUser({setAddRole, users=[],setNewRoleAddedToUser}){

            const useAxiosPrivate = UsePrivateAxios();

            const [roles, setRoles] =  useState([]);
            const [requestResponse , setResponse] = useReducer(
                        (state, action)=>{return {...state,...action}},
                        {isRequestError:false,message:"",isRequestSuccessful:false}
            );
            const [selected, Setselected] = useState([]);

            const setselected =(item)=>{
                        Setselected(item);
                        setResponse({isRequestError:false,message:"",isRequestSuccessful:false});
            }
            const [open, setOpen] = useState(false);
            /////////////////////////////////////////////////////////////////
            //           FETCH ROLES
            ///////////////////////////////////////////////////////////////
            useEffect(()=>{
            let isMounted = true;
            const controller = new AbortController();
            const API = '/holiday-plan/api/admin/role/roles/';
            isMounted && useAxiosPrivate.get(API, {signal:controller.signal})
            .then(response => {
                        if(response.ok || response.status===200){
                                   
                                    setRoles(response.data);

                        }
            })
            .catch(err => {
                        
                        if(!err?.response.ok){
                        const errorMessage  = getErrorMessage(err);
                                    setResponse({message:errorMessage,isRequestError:true,isRequestSuccessful:false});
                        }
                        else{
                                    setResponse({message:"Server error",isRequestError:true,isRequestSuccessful:false});
                        }
            });
            return ()=>{isMounted=false; controller.abort();}

            },[]);

   const additemsToRole = async (roleList)=>{
        let  results ={isRequestSuccessful:false};
        if(users.length===0 || roleList.length===0){
            results.message="No user or items are selected.";
            results.isRequestError=true;


        }else{

            for(let user of users){

                let lastitem=null;
                let roleToAdd=[];
                for(let role of roleList){
                    results= await addRoleToUserApi(user.username, role.name);
                    lastitem = role;
                    if(results.isRequestError){
                        break;
                    }else roleToAdd.push(role);
                }
                if(results.isRequestError){
                    results.message= `${results.message}. item:${lastitem.name} to user:${user.username}`;
                    break;
                }


           }
        }
        if(results.isRequestSuccessful){
              setNewRoleAddedToUser(true) ;
       }
       setResponse(results);
   }

  // Add role to user 
   const addRoleToUserApi  = (username, roleName)=>{

        const API = `/holiday-plan/api/admin/user/add/role/?username=${username}&roleName=${roleName}`;
        const newRequestResponse ={isRequestSuccessful:false,isRequestError:false,message:""};

        return useAxiosPrivate.patch(API)
        .then(response => {

            if(response.ok || response.status===200){
                newRequestResponse.isRequestSuccessful=true;
                newRequestResponse.isRequestError=false;
                newRequestResponse.message="Successfully added item to user"
           }
          return newRequestResponse;
        })
        .catch(err => {
            if(!err?.response.ok){
                const errorMessage  = getErrorMessage(err);
                newRequestResponse.isRequestSuccessful=false;
                newRequestResponse.isRequestError=true;
                newRequestResponse.message=errorMessage;
            }
            else{
                newRequestResponse.isRequestSuccessful=false;
                newRequestResponse.isRequestError=true;
                newRequestResponse.message="Server Error";
           }
           return newRequestResponse;
        });

   }

           
    return (
        <Box 
           display="flex" 
            justifyContent="center"
            alignItems="center"
            margin="0rem 0rem 0rem 0.5rem" 
            minHeight="50vh"           
        >
            <Card sx={{ maxWidth: 400,padding:"0.1rem 0rem" ,display:"block"}}>
                <CardHeader
                    sx={{boxShadow:"inherit"}}
                    action={ <IconButton onClick={()=>setAddRole(false)}>{<CancelIcon/>}</IconButton>}
                    title="Add Role(s)"
                    subheader={requestResponse.message||""}
                    subheaderTypographyProps={{align:"start" ,color:requestResponse.isRequestError?"red":"green"}}
                />
                <CardContent sx={{padding:"0rem 0.5rem"}}>
                    <SelectHasSearch
                         allOptions = {roles}
                         setSeletedOptions={setselected} 
                         fieldName="name"
                    />
                </CardContent>
                
                <CardActions> <ColorButton onClick={()=> setOpen(true)}  sx={{padding:"0rem 0.5rem"}} variant="contained">Add</ColorButton></CardActions>
            
            </Card>
            {open&&<SelectedItems 
                    heading ={"Add items to Role" }
                    fieldName="name"
                    SelectedItems={selected}
                    setSelectedItems={additemsToRole}
                    openListSelectedItems={open}
                    setOpenListSelectedItems={setOpen}
                
            />
            }
            
        </Box>
    )
}
