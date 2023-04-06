import {  Link } from "react-router-dom";
import './Login.css'
import {Paper,Typography}  from '@mui/material';
import CssTextField from '../component/CssTextField';
import CustomerTextArea from'../component/CustomerTextArea'
import ColorButton from '../component/ColorButton';
import { LogInUser} from '../utils/User';
import React,{ useReducer} from 'react';
import {CreateAuthContext} from '../context/CreateAuthContext';
import UseAxiosPrivate from '../utils/UseAxiosPrivate'


const QueryTicket =()=>{
    const useAxiosPrivate = UseAxiosPrivate();
    const { dispatchLogin } = React.useContext(CreateAuthContext);

    const [formState, dispatchForm] = useReducer((state, action)=>{

            return {...state , ...action}},

            {   summary: "",
                description: ""
            }

        );
    const[error, setError] = useReducer((state, action)=>{
        return {...state , ...action}
    }, {
         isTicketError:false,
         errorMessage: null
        }
    )

    const OnSubmit = (e)=>{
        e.preventDefault();
        if(formState.summary.trim() === ""|| formState.description.trim() === ""){
            setError({isTicketError:true, errorMessage:"Both summary and description are required"});
        }
        else if(!error.isTicketError){
            LogInUser(formState,dispatchLogin,setError,useAxiosPrivate);
            ClearForm();
        }

    }
    const ClearForm= ()=>{
        setTimeout(()=>{
            dispatchForm(
            {
               summary:"",description:"",

            }
            )
    })
}
    return (

        <div className="login">
               <Paper className="login-container">
                    <h1 className="heading">Please Enter Query</h1>
                    <form className="login-inputs" autoComplete='off'>
                        {
                            error.isTicketError &&
                            <Typography align="center"sx={{color:"red"}}>
                            {error.errorMessage}
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
                                setError({isLoginError:false,message:null})
                                dispatchForm({summary:e.target.value})}}></CssTextField>

                        <CustomerTextArea
                            required
                            multiline="true"
                            maxRows="10"
                            minRows="5"
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="Full description"
                            variant="outlined"
                            color="secondary" type="text" className=" description-input" placeholder="Enter full  description"
                            autoComplete='new-description' value={formState. description}
                        onChange={(e)=>dispatchForm({ description:e.target.value})}></CustomerTextArea>


                        <ColorButton variant="contained" style={{marginTop:"25px", color:"white"}}
                        className="submit-btn" onClick={(e)=>OnSubmit(e)}>Submit Ticket</ColorButton>


                    </form>

                    <div className="login-nav">
                        <Link   to="/home-user" className="login-link" >Problem solved? click to home </Link>
                    </div>
            </Paper>

        </div>
    )
}

export default QueryTicket;