import { useRef, useState,useReducer } from "react";
import ColorButton from "./ColorButton";
import { Box, Card, CardContent, CardHeader, TextField, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@material-ui/core";
import CancelIcon from '@mui/icons-material/Cancel';
import {IconButton} from "@mui/material";
import UsePrivateAxios from '../utils/UseAxiosPrivate'
import {getErrorMessage} from '../utils/Error';

export default function AddPermission({setAddPermission, setPermission}){
    const permissionRef = useRef(null);
    const [error , setError] = useState("");
   const [reuqestResponse , setResponse] = useReducer((state, action)=>{return {...state,...action}},{isRequestError:false,message:"",isRequestSuccessful:false});
    const submit = (e)=>{
          e.preventDefault();
          console.log(permissionRef.current.value)
          if(permissionRef.current===null || permissionRef.current.value.trim()===''){
            setError("Permission name is required");
          }
          else {
                 savePermission(permissionRef.current.value);
          	setPermission(permissionRef.current);
          }
    }
    const theme = useTheme();
    const small =useMediaQuery(theme.breakpoints.down('sm'));
    const useAxiosPrivate = UsePrivateAxios();
    const savePermission=(name)=>{
	    const API = '/holiday-plan/api/admin/permission/save/';
	    useAxiosPrivate.post(API, {name})
	    .then(response => {
            if(response.ok || response.status===200){
              setResponse(
                {
                  isRequestSuccessful:true,isRequestError:false,
                  message:"Succefully add permission"
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
              '& fieldset': {
                borderColor: 'green',
              },
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
                action={ <IconButton onClick={()=>setAddPermission(false)}>{<CancelIcon/>}</IconButton>}

                 title="Add Permission"/>
                <CardContent>
                    {  ( Boolean(error) || reuqestResponse.isRequestSuccessful ||reuqestResponse.isRequestError) &&
		            <Typography 
		                fontSize ="1rem" align="start"
		                color={reuqestResponse.isRequestSuccessful?"green":"red"} variant="h4">
		                {(reuqestResponse.isRequestSuccessful ||reuqestResponse.isRequestError)?reuqestResponse.message : error}
		            </Typography>
                   }
                    <form autoComplete='off' >
                        <TextField  
                       
                            onChange={()=>setError('')} 
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
