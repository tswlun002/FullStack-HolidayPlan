import { useRef, useState } from "react";
import CssTextField from  './CssTextField';
import ColorButton from "./ColorButton";
import { Box, Card, CardContent, CardHeader, TextField, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@material-ui/core";
import CancelIcon from '@mui/icons-material/Cancel';
import {IconButton} from "@mui/material";

export default function AddRole({setAddRole, setRole}){
    const roleRef = useRef(null);
    const [error , setError] = useState("");
    const submit = (e)=>{
          e.preventDefault();
          console.log(roleRef.current.value)
          if(roleRef.current===null || roleRef.current.value.trim()===''){
            setError("Role name is required");
          }
          else setRole(roleRef.current);
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
                action={ <IconButton onClick={()=>setAddRole(false)}>{<CancelIcon/>}</IconButton>}

                 title="Add Role"/>
                <CardContent>
                    {Boolean(error)&&<Typography fontSize ="1rem" align="start" color="red" variant="h4">{error}</Typography>}
                    <form autoComplete='off' >
                        <TextField  
                       
                            onChange={()=>setError('')} 
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
                            Submit
                        </ColorButton>
                    </form>
                   
                </CardContent>
            </Card>
        </Box>
    )
}