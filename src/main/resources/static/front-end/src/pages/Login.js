import {  Link } from "react-router-dom";
import './Login.css'
import {Paper,Typography}  from '@mui/material';
import CssTextField from '../component/CssTextField';
import ColorButton from '../component/ColorButton';
import { LogInUser} from '../utils/User';
import React,{ useReducer} from 'react';
import {CreateAuthContext} from '../context/CreateAuthContext';
import UseAxiosPrivate from '../utils/UseAxiosPrivate'


const Login =()=>{
    const useAxiosPrivate = UseAxiosPrivate();
    const { dispatchLogin } = React.useContext(CreateAuthContext);
    
    const [formState, dispatchForm] = useReducer((state, action)=>{
            
            return {...state , ...action}}, 
               
            {   email: "",
                password: ""
            }
            
        );
    const[error, setError] = useReducer((state, action)=>{
        return {...state , ...action}
    }, {
         isLoginError:false,
         errorMessage: null
        }
    )
  
    const OnSubmit = (e)=>{
        e.preventDefault(); 
        if(formState.email.trim() === ""|| formState.password.trim() === ""){
            setError({isLoginError:true, errorMessage:"Both password and email are required"});
        }
        else if(!error.isLoginError){
            LogInUser(formState,dispatchLogin,setError,useAxiosPrivate);
            ClearForm();
        }

    }
    const ClearForm= ()=>{
        setTimeout(()=>{
            dispatchForm(
            {
               email:"",password:"",

            }
            )
    })
}
    return (

        <div className="login">
               <Paper className="login-container">
                    <h1 className="heading">Login</h1>
                    <form className="login-inputs" autoComplete='off'>
                        {
                            error.isLoginError &&
                            <Typography align="center"sx={{color:"red"}}>
                            {error.errorMessage}
                            </Typography>
                        }

                        <CssTextField 
                            required
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="Email"
                            variant="outlined"
                            type="mail" className="email-input" placeholder="Enter email" 
                            value={formState.email} 
                            onChange={(e)=>{
                                setError({isLoginError:false,message:null})
                                dispatchForm({email:e.target.value})}}></CssTextField>
                    
                        <CssTextField 
                            required
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="password"
                            variant="outlined"
                            color="secondary" type="password" className="password-input" placeholder="password" 
                            autoComplete='new-password' value={formState.password}
                        onChange={(e)=>dispatchForm({password:e.target.value})}></CssTextField>


                        <ColorButton variant="contained" style={{marginTop:"15px", color:"white"}}
                        className="submit-btn" onClick={(e)=>OnSubmit(e)}>Login</ColorButton>


                    </form>

                    <div className="login-nav">
                        <Link   to="/register" className="login-link" >Not registered?, click to register </Link>
                    </div>
            </Paper>
            

        </div>
    )
}

export default Login;