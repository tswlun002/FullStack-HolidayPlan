import { useRef ,useReducer} from "react";
import ColorButton from "./ColorButton";
import { Box, Card, CardContent, CardHeader, TextField, useMediaQuery } from "@mui/material";
import { useTheme } from "@material-ui/core";
import CancelIcon from '@mui/icons-material/Cancel';
import {IconButton} from "@mui/material";
import UsePrivateAxios from '../utils/UseAxiosPrivate'
import {getErrorMessage} from '../utils/Error';


export default function AddRole({setAddRoleOpen, setIsRoleAdded}){
    const roleRef = useRef(null);
    const usePrivateAxios =UsePrivateAxios();
    const [requestResponse , setResponse] = useReducer(
        (state, action)=>{return {...state,...action}},{isRequestError:false,message:"",submitting:false,isRequestSuccessful:false}
    );
    const submit = (e)=>{

          e.preventDefault();

          if(roleRef.current===null || roleRef.current.value.trim()===''){
                setResponse({isRequestError:true,submitting:false,message:"Role name is require",isRequestSuccessful:false});
          }else{
              setResponse({submitting:true});
             //else setIsRoleAdded(roleRef.current);
             const API='/holiday-plan/api/admin/role/save/';
             usePrivateAxios.post(API,{name:roleRef.current.value})
             .then(response=>{
                   if(response.ok || response.status===200){
                           setResponse({isRequestError:false,submitting:false,message:"Role added successful",isRequestSuccessful:true});
                           setIsRoleAdded(true);
                   }
             })
             .catch(err=>{
                    if(!err?.response.ok){
                           const errorMessage  = getErrorMessage(err);
                           setResponse({isRequestError:true,submitting:false,message:errorMessage,isRequestSuccessful:false});
                    }
                    else{
                           setResponse({isRequestError:true,submitting:false,message:"Server error",isRequestSuccessful:false});
                    }
             });
          }
    }


    const theme = useTheme();
    const small =useMediaQuery(theme.breakpoints.down('sm'));
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
            <Card  sx={{ maxWidth: 400, midWidth:350,padding:"2rem 0rem" ,display:"block"}}>
                
                <CardHeader
                action={ <IconButton onClick={()=>setAddRoleOpen(false)}>{<CancelIcon/>}</IconButton>}

                 title="Add Role"
                 subheader={requestResponse.message||""}
                 subheaderTypographyProps={{align:"start" ,color:requestResponse.isRequestError?"red":"green"}}

                 />
                <CardContent>
                        <TextField  
                       
                            onChange={()=>{
                                 setIsRoleAdded(false);
                                setResponse({isRequestError:false,message:"",submitting:false,isRequestSuccessful:false});
                              }
                            }
                            required
                            helpertext="field role"
                            id="demo-helper-text-aligned"
                            label="Role Name"
                            variant="outlined"
                            type="text"
                            placeholder="Enter role name"
                            inputRef={roleRef}
                           sx={{...customerStyle}}
                            
                        />
                     
                        <ColorButton 
                        onClick={(e)=>submit(e)}
                        variant="contained" 
                        style={{color:"white", marginTop:10}}>
                            {requestResponse.submitting?"Submitting...":"Submit"}
                        </ColorButton>

                   
                </CardContent>
            </Card>
        </Box>
    )
}