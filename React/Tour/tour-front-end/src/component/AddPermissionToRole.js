import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardHeader, List, ListItem, ListItemText, Modal, useMediaQuery } from "@mui/material";
import SelectHasSearch from "./SeleteHasSearch";
import { useReducer, useState,useContext } from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import {IconButton} from "@mui/material";
import ColorButton from '../component/ColorButton';
import { useTheme } from "@material-ui/core";
import SelectedItems from "./SelectedItems";
import { RolePermissionContext } from '../context/RolePermissionContext';

export default function AddPermissionToRole({setAddPermission}){
    const {permissions} =  useContext(RolePermissionContext);
    const [rolePermissions, setRolePermission] = useReducer(
        (state, action)=>{
           return {...state, ...action}
        },{
            permissionToadd:[],
    
        }
        )
    const theme = useTheme();
    const small =useMediaQuery(theme.breakpoints.down('sm'));
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [open, setOpen] = useState(false);
           
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
                />
                <CardContent sx={{padding:"0rem 0.5rem"}}>
                    <SelectHasSearch
                         allOptions = {permissions.listPermissions}
                         setSelectedPermissions={setSelectedPermissions} />
                </CardContent>
                
                <CardActions> <ColorButton onClick={()=> setOpen(true)}  sx={{padding:"0rem 0.5rem"}} variant="contained">Add</ColorButton></CardActions>
            
            </Card>
            {open&&<SelectedItems 
                    heading ={"Add Permissions to Role" }
                    SelectedItems={selectedPermissions}
                    setSelectedItems={setSelectedPermissions}
                    openListSelectedItems={open}
                    setOpenListSelectedItems={setOpen}
                
            />
            }
            
        </Box>
    )
}
