import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardHeader, 
Collapse, IconButton, List, ListItem, ListItemButton, ListItemIcon,
ListItemText, ListSubheader, Modal, Typography, useMediaQuery } from "@mui/material";
import SelectHasSearch from "./SeleteHasSearch";
import { useContext, useReducer, useState, useEffect} from "react";
import ColorButton from '../component/ColorButton';
import { useTheme } from "@material-ui/core";
import AddPermission from "./AddPermission";
import SelectedItems from "./SelectedItems";
import { RolePermissionContext } from '../context/RolePermissionContext';
import UsePrivateAxios from '../utils/UseAxiosPrivate'
import {getErrorMessage} from '../utils/Error';


export default function Permissions(){
    const {permissions,setPermissions} =  useContext(RolePermissionContext);
    const [rolePermissions, setRolePermission] = useReducer(
        (state, action)=>{
           return {...state, ...action}
        },
        {
            permissionToadd:[]
        }
    );
    const theme = useTheme();
    const small =useMediaQuery(theme.breakpoints.down('sm'));
    const [isAddPermissionOpen, setAddPermissionOpen] =  useState(false);
    const [isNewPermissionAdded, setIsNewPermissionAdded] =  useState(false);
    const [isPermissionDelete, setIsPermissionDelete] =  useState(false);

    const [deletePermission, setDeletePermission] =  useState(false)
    const [selectedPermissions, setSelectedPermissions] = useState([])

    const [requestResponse , setResponse] = useReducer(
        (state, action)=>{return {...state,...action}},
        {isRequestError:false,message:"",isRequestSuccessful:false}
    );

    const useAxiosPrivate = UsePrivateAxios();


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                  Fetch all permissions from server
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(()=>{
        let isMounted = true;
        const controller = new AbortController();
        const API = '/holiday-plan/api/admin/permission/permissions/';
        isMounted && useAxiosPrivate.get(API, {signal:controller.signal})
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

  },[isNewPermissionAdded]);


  // Delete permissions 
   const deletePermissions = async (permissionList)=>{

        let  results =null
        let lastPermission=null;
        for(let permissionToDelete of permissionList){
            results= await deletePermissionApi(permissionToDelete.name);
            lastPermission = permissionToDelete;
            if(results.isRequestError){
                break;
            }
        }
        if(results.isRequestError){
            results.message=`Failed to delete permission: ${lastPermission.name}`;
        }
        if(results.isRequestSuccessful){

        }
        alert(JSON.stringify(results));
        setResponse(results);
   }

  // Delete permission by name
   const deletePermissionApi  = (permissionName)=>{
    
        const API = `/holiday-plan/api/admin/permission/delete/name/?permissionName=${permissionName}`;
        const newRequestResponse ={isRequestSuccessful:false,isRequestError:false,message:""};

        return useAxiosPrivate.delete(API)
        .then(response => {

            if(response.ok || response.status===200){
                newRequestResponse.isRequestSuccessful=true;
                newRequestResponse.isRequestError=false;
                newRequestResponse.message="Successfully delete permission"
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
        permissions.listPermissions.length ===0?
        <Typography align="center" variant="h4" color="red" font-size="1rem">{permissions.exceptionMessage}</Typography>
        :
        <Box 
           display="flex" 
            justifyContent="start"
            alignItems="center"
            margin="0rem 0rem 0rem 0.5rem" 
            minHeight="50vh"           
        >    
            {
                (requestResponse.isRequestError || requestResponse.isRequestSuccessful)&&
                <Typography 
                align="center" variant="h4" color={requestResponse.isRequestError?"red":"green"} 
                font-size="1rem"
                >
                {requestResponse.message}
                </Typography>
            }
            <Card sx={{ maxWidth: 400,padding:"0.1rem 0rem" ,display:"block"}}>
                <CardHeader
                    title="Permissions"
                    sx={{boxShadow:"inherit"}}
                />
                <CardContent sx={{padding:"0rem 0.5rem"}}>
                    <SelectHasSearch allOptions={permissions.listPermissions} setSelectedPermissions={setSelectedPermissions} />
                </CardContent>
                
                <CardActions> 
                    <ColorButton 
                        onClick={()=>setAddPermissionOpen(true)}
                        sx={{padding:"0rem 0.5rem"}} 
                        variant="contained">
                            Add
                    </ColorButton>
                    <ColorButton 
                            onClick={()=>setDeletePermission(true)}
                            sx={{padding:"0rem 0.5rem"}} variant="contained"
                            >
                                Delete
                    </ColorButton>

               </CardActions>
            
            </Card>
            <Collapse in={isAddPermissionOpen} timeout="auto" unmountOnExit  sx={{display:{xs:"none",md:"block"}}}>
                <AddPermission
                     setAddPermission={setAddPermissionOpen}
                    setIsNewPermissionAdded={setIsNewPermissionAdded}
                />
            </Collapse>
            <Modal
                open ={isAddPermissionOpen}
                onClose={()=>setAddPermissionOpen(false)}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
                sx={{display:{xs:"flex",md:"none"},justifyContent:'center',alignItems:'center' }}
            >
              <AddPermission setIsNewPermissionAdded={setIsNewPermissionAdded}  setAddPermissionOpen={setAddPermissionOpen}/>
            </Modal>
            {
              deletePermission&&<SelectedItems 
                    heading ={"Permissions to delete" }
                    SelectedItems={selectedPermissions}
                    setSelectedItems={deletePermissions}
                    openListSelectedItems={deletePermission}
                    setOpenListSelectedItems={setDeletePermission}
                   
                
                />
            }
        </Box>
    )
}
