
import {  useReducer, useState} from "react"
import {  Typography,Box,Card,CardContent,CardHeader } from '@mui/material';
import CssTextField from './CssTextField';
import ColorButton from './ColorButton';
import {RegisterAdmin } from '../utils/User';
import UseAxiosPrivate from '../utils/UseAxiosPrivate'




const RegisterAdminForm =()=>{

      const useAxiosPrivate  =UseAxiosPrivate();
      const [dateType, setDateType]= useState("text");
    //Login registered values
    const[register, dispatchRegister] = useReducer((state, action)=>{
        return {...state,...action,
        }
    },{firstname:"",lastname:"",email:"",password:"",confirmPassword:"",userType:"ADMIN",age:"", registered:false,
    isLoginError:false, errorMessage: null,  requestResponseMessage:""})

    const isValid =()=>{
 
       return (register.firstname.trim() !== "" && register.lastname.trim() !== "" && register.email.trim() !== "" && register.password.trim()!=="" &&
       register.confirmPassword.trim() !== "" && register.userType.trim() !== "");
    }
    

    const ClearForm= ()=>{
        setTimeout(()=>{
            dispatchRegister(
              {
                firstname:"",lastname:"",email:"",password:"",confirmPassword:"",userType:"",age:'', registered:false,

  
              }
            )
        },200)
    }
    const OnSubmit = (e)=>{
        e.preventDefault(); 
         console.log(register)
        if(isValid()){
            if(register.password===register.confirmPassword){

                RegisterAdmin(register,useAxiosPrivate,dispatchRegister);
                if(register.registered)ClearForm();

            }else
            {
                dispatchRegister({errorMessage:"Password don not match", isLoginError:true});
            }
        }else {
            dispatchRegister({errorMessage:"All fields with * are required ", isLoginError:true});

        }
    }


    return (

        <Box display="flex"
            justifyContent="start"
            alignItems="start"
            minHeight="100vh"
            backgroundColor="#dfe0e6"

              >
              <Card sx={{ maxWidth: 400,display:"block"}}>
                     <CardHeader
                        title={<h2>Add user</h2>}
                        titleTypographyProps={{align:"center",color:"rgb(143, 88, 175)",align:"center"}}
                        subheader={register.isLoginError?register.errorMessage:register.registered?register.requestResponseMessage:""}
                        subheaderTypographyProps={{align:"start" ,color:register.isLoginError?"red":"green"}}
                    />
                    <CardContent>
                    <form className="register-inputs" autoComplete="off">
                        <CssTextField
                            
                            required
                            variant="outlined"
                            helpertext=""id="demo-helper-text-aligned"label="Firstname"
                            type="text" className="firstname-input" placeholder="enter firstname"
                             value={register.firstname}
                            onChange={(e)=>dispatchRegister({firstname:e.target.value,isLoginError:false,registered:false})}
                        />
                        <CssTextField
                            required
                            variant="outlined"
                            helpertext="" id="demo-helper-text-aligned"label="Lastname" color="secondary"
                            type="text" className="lastname-input" placeholder="enter lastname" value={register.lastname}
                            onChange={(e)=>dispatchRegister({lastname:e.target.value ,isLoginError:false,registered:false})}
                        />

                        <CssTextField
                           required
                            variant="outlined"
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="Email"
                            type="text" className="email-input" placeholder="enter email" value={register.email}
                            onChange={(e)=>dispatchRegister({email:e.target.value,isLoginError:false,registered:false })}
                         />
                       <CssTextField
                          required
                          variant="outlined"
                          helpertext=""
                          id="demo-helper-text-aligned"
                          label="Date of Birth"
                          onClick={()=>setDateType("date")}
                          onBlur={()=>{setDateType("text");}}
                          type={dateType} className="age-input" placeholder="enter date of birth" value={register.age}
                          onChange={(e)=>dispatchRegister({age:e.target.value,isLoginError:false,registered:false})}
                       />

                        <CssTextField
                            required
                            variant="outlined"
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="password"
                            color="secondary"
                            type="password" autoComplete='new-password' className="password-input" placeholder="password" value={register.password}
                            onChange={(e)=>dispatchRegister({password:e.target.value, isLoginError:false, registered:false})}
                        />

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


              </Card>
        </Box>
    )
}

export default RegisterAdminForm;