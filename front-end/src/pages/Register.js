import './Register.css'
import {  useReducer, useEffect, useState} from "react"
import { useNavigate, Link } from "react-router-dom";
import { FormControl,RadioGroup, FormControlLabel,Radio,FormLabel, Typography,Box,Card,CardContent,CardActions } from '@mui/material';

import CssTextField from '../component/CssTextField';
import ColorButton from '../component/ColorButton';
import {RegisterUser } from '../utils/User';



const Register =()=>{
    const navigate = useNavigate();
    const [dateType, setDateType]= useState("text");

    //Login registered values
    const[register, dispatchRegister] = useReducer((state, action)=>{
        return {...state,...action,
        }
    },{firstname:"",lastname:"",email:"",password:"",confirmPassword:"",userType:"USER",age:"", registered:false,
    isLoginError:false, errorMessage: null})



    const isValid =()=>{

       return register.firstname.trim() !== "" && register.lastname.trim() !== "" && register.email.trim()!== "" && register.password.trim()!== "" &&
       register.confirmPassword.trim() !== "" && register.userType.trim()!== "";
    }
    

    const ClearForm= ()=>{
        setTimeout(()=>{
            dispatchRegister(
              {
                firstname:"",lastname:"",email:"",password:"",confirmPassword:"",age:'', registered:false
  
              }
            )
        },200)
    }
    
  
    const OnSubmit = (e)=>{
        e.preventDefault(); 
        
        if(isValid()){
            if(register.password===register.confirmPassword){
                RegisterUser(register,dispatchRegister);
            
            }else
            {
                dispatchRegister({errorMessage:"Password don not match", isLoginError:true});
            }
        }else {
            dispatchRegister({errorMessage:"All fields with * are required", isLoginError:true});

        }
    }
    
  


    return (

        <Box display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            backgroundColor="#dfe0e6"

              >
              <Card sx={{ maxWidth: 400, margin:"7rem 0rem",display:"block"}}>
                    <CardContent>
                     <h2 className="heading">Register</h2>
                    <form className="register-inputs" autoComplete="off">
                    {
                            register.isLoginError?
                            <Typography align="center"sx={{color:"red"}}>
                            {register.errorMessage}
                            </Typography>
                            :register.registered&& <Typography align="center"sx={{color:"green"}}>Successful registered</Typography>
                            	
                            
                        }
                        <CssTextField 
                            
                            required
                            variant="outlined"
                            helpertext=""id="demo-helper-text-aligned"label="Firstname"
                            type="text" className="firstname-input" placeholder="enter firstname"
                             value={register.firstname}
                            onChange={(e)=>dispatchRegister({firstname:e.target.value,isLoginError:false})}/>
                        <CssTextField 
                            required
                            variant="outlined"
                            helpertext="" id="demo-helper-text-aligned"label="Lastname" color="secondary"
                         type="text" className="lastname-input" placeholder="enter lastname" value={register.lastname}
                        onChange={(e)=>dispatchRegister({lastname:e.target.value ,isLoginError:false})}></CssTextField>
                        
                        <CssTextField 
                           required
                            variant="outlined"
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="Email"
                        type="text" className="email-input" placeholder="enter email" value={register.email} 
                         onChange={(e)=>dispatchRegister({email:e.target.value,isLoginError:false })}></CssTextField>
                       <CssTextField
                          required
                          variant="outlined"
                          helpertext=""
                          id="demo-helper-text-aligned"
                          label="Date of Birth"
                          onClick={()=>setDateType("date")}
                          onBlur={()=>{setDateType("text"); console.log("abort")}}
                          type={dateType} className="age-input" placeholder="enter date of birth" value={register.age}
                          onChange={(e)=>dispatchRegister({age:e.target.value,isLoginError:false})}
                       />

                        <CssTextField 
                            required
                            variant="outlined"
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="password"
                            color="secondary" 
                        type="password" autoComplete='new-password' className="password-input" placeholder="password" value={register.password}
                        onChange={(e)=>dispatchRegister({password:e.target.value, isLoginError:false})}></CssTextField>
                
                        <CssTextField 
                             required
                            variant="outlined"
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="confirm-password"
                            color="secondary"
                            type="password" autoComplete='new-password' className="password-input" placeholder="confirm password" value={register.confirmPassword}
                            onChange={(e)=>dispatchRegister({confirmPassword:e.target.value, isLoginError:false})}
                        />

                        <ColorButton variant='contained' style={{marginTop:"15px",color:"white"}} className="submit-btn" onClick={(e)=>{OnSubmit(e)}}>Register</ColorButton>

                    </form>
                    </CardContent>

                     <CardActions>

                            <div className="login-nav">
                                <Link   to="/" className="login-link" >Registered already, click to login </Link>
                            </div>
                    </CardActions>
              </Card>
        </Box>
    )
}
export default Register;
