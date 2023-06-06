import {  Link } from "react-router-dom";
import './Login.css'
import {Paper,Typography,Box,Card,CardContent}  from '@mui/material';
import CssTextField from '../component/CssTextField';
import CustomerTextArea from'../component/CustomerTextArea'
import ColorButton from '../component/ColorButton';
import React,{ useReducer} from 'react';
import {CreateAuthContext} from '../context/CreateAuthContext';
import UseAxiosPrivate from '../utils/UseAxiosPrivate'
import {SendQuery} from '../utils/Query';


const QueryTicket =()=>{
    const useAxiosPrivate = UseAxiosPrivate();
    const { dispatchLogin } = React.useContext(CreateAuthContext);
    const initialState = {
              isQueryingError:false,
              isRequestSuccessful:false,
              querySentStatus:"",
              errorMessage:"",
              summary: "",
              description: ""
    }
    const [formState, dispatchForm] = useReducer((state, action)=>{
            return {...state , ...action}},initialState

     );


    const OnSubmit = (e)=>{
        e.preventDefault();
        if(formState.summary.trim() === ""|| formState.description.trim() === ""){
            dispatchForm({isQueryingError:true, errorMessage:"Both summary and description are required"});
        }
        else if(!formState.isQueryingError){
        console.log(formState)
            SendQuery(formState,useAxiosPrivate, dispatchForm )
            ClearForm();
        }

        }
        const ClearForm= ()=>{
            setTimeout(()=>{
                dispatchForm(initialState)
        })
        }
       React.useEffect(()=>{
             if(formState.isRequestSuccessful){
                dispatchForm({querySentStatus:"Query sent successfully"});
             }
       },[formState.isRequestSuccessful])
    return (
       <Box display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
       >
           <Card sx={{ maxWidth: 400,padding:"2rem 0rem" ,display:"block"}}>
               <CardContent>
                <h1 className="heading">Enter Query</h1>
                <form className="login-inputs" autoComplete='off'>
                    {
                        formState.isQueryingError ?
                        <Typography align="center"sx={{color:"red"}}>
                            {formState.errorMessage}
                        </Typography>
                        :formState.isRequestSuccessful&&
                        <Typography align="center"sx={{color:"green"}}>
                            {formState.querySentStatus}
                        </Typography>



                    }

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

                            ></CssTextField>

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
                        onChange={(e)=>dispatchForm({ description:e.target.value,isQueryingError:false})}></CustomerTextArea>


                    <ColorButton variant="contained" style={{marginTop:"25px", color:"white"}}
                    className="submit-btn" onClick={(e)=>OnSubmit(e)}>Submit Ticket</ColorButton>

                </form>
           </CardContent>

        </Card>
    </Box>

    )
}

export default QueryTicket;