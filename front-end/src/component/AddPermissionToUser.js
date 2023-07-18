import { Box, Card, CardActions, CardContent, CardHeader} from "@mui/material";
import SelectHasSearch from "./SeleteHasSearch";
import { useReducer, useState,useContext } from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import {IconButton} from "@mui/material";
import ColorButton from '../component/ColorButton';
import SelectedItems from "./SelectedItems";
import { RolePermissionContext } from '../context/RolePermissionContext';
import UsePrivateAxios from '../utils/UseAxiosPrivate'
import {getErrorMessage} from '../utils/Error';

export default function AddPermissionToUser({setAddPermission,  users, setNewPermissionAddedToUser}){
    const {permissions} =  useContext(RolePermissionContext);
    const useAxiosPrivate = UsePrivateAxios();
    const [requestResponse , setResponse] = useReducer(
        (state, action)=>{return {...state,...action}},
        {isRequestError:false,message:"",isRequestSuccessful:false}
    );
    const [selectedPermissions, SetSelectedPermissions] = useState([]);

    const setSelectedPermissions =(permission)=>{
            SetSelectedPermissions(permission);
            setResponse({isRequestError:false,message:"",isRequestSuccessful:false});
    }
    const [open, setOpen] = useState(false);

  // add permissions to role

   const addPermissionsToUser = async (permissionList)=>{
        let  results ={isRequestSuccessful:false};
        if(users.length===0 || permissionList.length===0){
            results.message="No user or permissions are selected.";
            results.isRequestError=true;


        }else{

            for(let user of users){

                let lastPermission=null;
                let PermToAdd=[];
                for(let permissionToAdd of permissionList){
                    results= await addPermissionToUserApi(user.username, permissionToAdd.name);
                    lastPermission = permissionToAdd;
                    if(results.isRequestError){
                        break;
                    }else PermToAdd.push(permissionToAdd);
                }
                if(results.isRequestError){
                    results.message= `${results.message}. permission:${lastPermission.name} to user:${user.username}`;
                    break;
                }


           }
        }
        if(results.isRequestSuccessful){
              setNewPermissionAddedToUser(true) ;
       }
       setResponse(results);
   }

  // Delete permission by name
   const addPermissionToUserApi  = (username, permissionName)=>{

        const API = `/holiday-plan/api/admin/user/add/permission/?username=${username}&permissionName=${permissionName}`;
        const newRequestResponse ={isRequestSuccessful:false,isRequestError:false,message:""};

        return useAxiosPrivate.patch(API)
        .then(response => {

            if(response.ok || response.status===200){
                newRequestResponse.isRequestSuccessful=true;
                newRequestResponse.isRequestError=false;
                newRequestResponse.message="Successfully added permission to user"
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
                    action={ <IconButton onClick={()=>setAddPermission(false)}>{<CancelIcon/>}</IconButton>}
                    title="Add Permission"
                    subheader={requestResponse.message||""}
                    subheaderTypographyProps={{align:"start" ,color:requestResponse.isRequestError?"red":"green"}}
                />
                <CardContent sx={{padding:"0rem 0.5rem"}}>
                    <SelectHasSearch
                         allOptions = {permissions.listPermissions}
                         setSeletedOptions={setSelectedPermissions} 
                        fieldName="name"
                    />
                </CardContent>
                
                <CardActions> 
                    <ColorButton onClick={()=> setOpen(true)}  sx={{padding:"0rem 0.5rem"}} variant="contained">Add</ColorButton>
                </CardActions>
            
            </Card>
            {open&&<SelectedItems 
                    fieldName="name"
                    heading ={"Add permissions to user" }
                    SelectedItems={selectedPermissions}
                    setSelectedItems={addPermissionsToUser}
                    openListSelectedItems={open}
                    setOpenListSelectedItems={setOpen}
                
            />
            }
            
        </Box>
    )
}
