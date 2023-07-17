import { Box, Card, CardActions, CardContent, CardHeader, useMediaQuery } from "@mui/material";
import SelectHasSearch from "./SeleteHasSearch";
import { useReducer, useState,useContext } from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import {IconButton} from "@mui/material";
import ColorButton from '../component/ColorButton';
import { useTheme } from "@material-ui/core";
import SelectedItems from "./SelectedItems";
import { RolePermissionContext } from '../context/RolePermissionContext';
import UsePrivateAxios from '../utils/UseAxiosPrivate'
import {getErrorMessage} from '../utils/Error';

export default function AddPermissionToRole({setAddPermission, roles, setNewPermissionAddedToRole}){
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

   const addPermissionsToRole = async (permissionList)=>{
        let  results ={isRequestSuccessful:false};
        if(roles.length===0 || permissionList.length===0){
            results.message="No role or permissions are selected.";
            results.isRequestError=true;


        }else{

            for(let role of roles){

                let lastPermission=null;
                let PermToAdd=[];
                for(let permissionToAdd of permissionList){
                    results= await addPermissionToRoleApi(role.name, permissionToAdd.name);
                    lastPermission = permissionToAdd;
                    if(results.isRequestError){
                        break;
                    }else PermToAdd.push(permissionToAdd);
                }
                if(results.isRequestError){
                    results.message= `${results.message}. permission:${lastPermission.name} to role:${role.name}`;
                    break;
                }


           }
        }
        if(results.isRequestSuccessful){
              setNewPermissionAddedToRole(true) ;
       }
       setResponse(results);
   }

  // Delete permission by name
   const addPermissionToRoleApi  = (roleName, permissionName)=>{

        const API = `/holiday-plan/api/admin/role/add/permission/role/?roleName=${roleName}&permissionName=${permissionName}`;
        const newRequestResponse ={isRequestSuccessful:false,isRequestError:false,message:""};

        return useAxiosPrivate.patch(API)
        .then(response => {

            if(response.ok || response.status===200){
                newRequestResponse.isRequestSuccessful=true;
                newRequestResponse.isRequestError=false;
                newRequestResponse.message="Successfully added permission to role"
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
                
                <CardActions> <ColorButton onClick={()=> setOpen(true)}  sx={{padding:"0rem 0.5rem"}} variant="contained">Add</ColorButton></CardActions>
            
            </Card>
            {open&&<SelectedItems 
                    fieldName="name"
                    heading ={"Add Permissions to Role" }
                    SelectedItems={selectedPermissions}
                    setSelectedItems={addPermissionsToRole}
                    
                    openListSelectedItems={open}
                    setOpenListSelectedItems={setOpen}
                
            />
            }
            
        </Box>
    )
}
