import { useRef, useState,useReducer } from "react";
import ColorButton from "./ColorButton";
import { Box, Card, CardContent, CardHeader, TextField, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@material-ui/core";
import CancelIcon from '@mui/icons-material/Cancel';
import {IconButton} from "@mui/material";
import UsePrivateAxios from '../utils/UseAxiosPrivate'
import {getErrorMessage} from '../utils/Error';
/**
 Add new permission
*/
export default function AddPermission({ setAddPermissionOpen,setIsNewPermissionAdded}){
    const permissionRef = useRef(null);
    const [error , setError] = useState("");
   const [requestResponse , setResponse] = useReducer((state, action)=>{return {...state,...action}},{isRequestError:false,message:"",isRequestSuccessful:false});

   //Extract name of permission
    const submit = (e)=>{
          e.preventDefault();
          
          if(permissionRef.current===null || permissionRef.current.value.trim()===''){
                setError("Permission name is required");
          }
          else {
                savePermission(permissionRef.current.value);
          }
    }
    const theme = useTheme();
    const small =useMediaQuery(theme.breakpoints.down('sm'));
    const useAxiosPrivate = UsePrivateAxios();

    //save permission
    const savePermission=(name)=>{
	    const API = '/holiday-plan/api/admin/permission/save/';
	    useAxiosPrivate.post(API, {name})
	    .then(response => {
            if(response.ok || response.status===200){
               setIsNewPermissionAdded(true);
              setResponse(
                {
                  isRequestSuccessful:true,isRequestError:false,
                  message:"Successfully add permission"
                }
              );


            }
	    })
	    .catch(err => {
		    if(!err?.response.ok){
		      const errorMessage  = getErrorMessage(err);
		      setResponse({isRequestError:true, isRequestSuccessful:false,message:errorMessage});
		    }
		    else{
		      setResponse({isRequestError:true,isRequestSuccessful:false,message:"Server Error"});
		    } 
	    });
	    
    }
    const customerStyle = {
            width:"100%",
            marginTop:"8px",
            '& label.Mui-focused': {
              color: 'black',
             
            },
            '& .MuiOutlinedInput-root': {
              
              '&:hover fieldset': {
                border:"1px solid transparent",
                borderBottom:'1.5px solid blueviolet',
              },
              '&.Mui-focused fieldset': {
                border:"1px solid transparent",
                borderBottom:'1.5px solid blueviolet',
              },
              '& fieldset': {
                border:"1px solid transparent",
                borderBottom:'1px solid black',
              },
            },
        }
    return (
        <Box 
           display="flex" 
            justifyContent="center"
            alignItems={small?"center":"start"}
            margin="0rem 0rem 0rem 0.5rem" 
            minHeight="50vh"           
        >
            <Card  sx={{ maxWidth: 400,padding:"2rem 0rem" ,display:"block"}}>
                
                <CardHeader
                action={ <IconButton onClick={()=>setAddPermissionOpen(false)}>{<CancelIcon/>}</IconButton>}

                 title="Add Permission"/>
                <CardContent>
                    {  ( Boolean(error) || requestResponse.isRequestSuccessful ||requestResponse.isRequestError) &&
		            <Typography 
		                fontSize ="1rem" align="start"
		                color={requestResponse.isRequestSuccessful?"green":"red"} variant="h4">
		                {(requestResponse.isRequestSuccessful ||requestResponse.isRequestError)?requestResponse.message : error}
		            </Typography>
                   }
                    <form autoComplete='off' >
                        <TextField

                            onChange={()=>{setError(''); setResponse({isRequestError:false, isRequestSuccessful:false,message:""}); setIsNewPermissionAdded(false)}}
                            required
                            helpertext="field permission"
                            id="demo-helper-text-aligned"
                            label="Permission Name"
                            variant="outlined"
                            type="text"
                            placeholder="Enter permission name"
                            inputRef={permissionRef}
                           sx={{...customerStyle}}

                        />

                        <ColorButton 
                        onClick={(e)=>submit(e)}
                        variant="contained" 
                        style={{color:"white", marginTop:10}}>
                            Submit
                        </ColorButton>
                    </form>
                   
                </CardContent>
            </Card>
        </Box>
    )
}
