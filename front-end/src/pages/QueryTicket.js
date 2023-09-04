import './Login.css'
import {Typography,Box,Card,CardContent,CardHeader}  from '@mui/material';
import CssTextField from '../component/CssTextField';
import CustomerTextArea from'../component/CustomerTextArea'
import ColorButton from '../component/ColorButton';
import React,{ useReducer} from 'react';
import UseAxiosPrivate from '../utils/UseAxiosPrivate'
import {SendQuery} from '../utils/Query';
import { ERROR_COLOR, PRIMAR_COLOR, SUCCESS_COLOR } from '../utils/Constant';


const QueryTicket =()=>{
    const useAxiosPrivate = UseAxiosPrivate();
    const initialState = {
              isQueryingError:false,
              isRequestSuccessful:false,
              message:"",
              summary: "",
              description: ""
    }
    const [formState, dispatchForm] = useReducer((state, action)=>{
            return {...state , ...action}},initialState

     );


    const OnSubmit = async(e)=>{
        e.preventDefault();
        
        if(formState.summary.trim() === ""|| formState.description.trim() === ""){
            dispatchForm({isQueryingError:true,isRequestSuccessful:false, message:"Both summary and description are required"});
        }
        else if(!formState.isQueryingError){
            const results= await SendQuery(formState,useAxiosPrivate, dispatchForm )
            
            dispatchForm(results);
            
             
            ClearForm();
        }

        }
        const ClearForm= ()=>{
            setTimeout(()=>{dispatchForm(initialState)},3000)
        }
    
    return (
       <Box display="flex"
            justifyContent="center"
            alignItems="start"
            minHeight="100vh"
       >
           <Card sx={{ maxWidth: 400,display:"block"}}>
           <CardHeader
              title={
                    <Typography align="center"  
                    sx={{fontSize:"2rem",textTransform: "none",fontWeight: 700, 
                        fontFamily: `Poppins, sans-serif`,width:"100%",color:PRIMAR_COLOR
                    }} 
                    variant={"h2"}
                     >
                        Enter Query
                    </Typography>
                }
              subheader={       (formState.isQueryingError||formState.isRequestSuccessful)?formState.message:""}
                                subheaderTypographyProps={{alignItems:"start",fontSize:"0.8rem",color:formState.isRequestSuccessful?
                                SUCCESS_COLOR:formState.isQueryingError&&ERROR_COLOR}
                        }
              
          />
               <CardContent>
                <form className="login-inputs" autoComplete='off'>

                    <CssTextField
                        required
                        helpertext=""
                        id="demo-helper-text-aligned"
                        label="Summary problem"
                        variant="outlined"
                        type="text" className="summary-input" placeholder="Enter Summary problem"
                        value={formState.summary}
                        onChange={(e)=>{

                            dispatchForm({summary:e.target.value,isQueryingError:false})}}

                    />

                    <CustomerTextArea
                        required
                        multiline={true}
                        maxRows="10"
                        minRows="5"
                        helpertext=""
                        id="demo-helper-text-aligned"
                        label="Full description"
                        variant="outlined"
                        color="secondary" type="text" className=" description-input" placeholder="Enter full  description"
                        autoComplete='new-description' value={formState. description}
                        onChange={(e)=>dispatchForm({ description:e.target.value,isQueryingError:false})}
                    />


                    <ColorButton 
                    variant="contained" 
                    style={{marginTop:"25px", color:"white"}}
                    className="submit-btn" 
                    onClick={(e)=>OnSubmit(e)}
                    >
                        Submit Ticket
                    </ColorButton>

                </form>
           </CardContent>

        </Card>
    </Box>

    )
}

export default QueryTicket;