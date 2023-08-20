import './Register.css'
import {  useReducer,  useState} from "react"
import { Link } from "react-router-dom";
import { Typography,Box,Card,CardContent,CardActions ,CardHeader} from '@mui/material';
import background from '../images/2.jpg'
import CssTextField from '../component/CssTextField';
import ColorButton from '../component/ColorButton';
import {RegisterUser } from '../utils/User';
import { ERROR_COLOR, PRIMAR_COLOR, SUCCESS_COLOR } from '../utils/Constant';



const Register =()=>{
    const [dateType, setDateType]= useState("text");
    const INIT_STATE ={firstname:"",lastname:"",email:"",password:"",confirmPassword:"",userType:"USER",age:"",
     registered:false, isRegisterError:false, errorMessage: ''}
    //Login registered values
    const[register, dispatchRegister] = useReducer((state, action)=>{
        return {...state,...action }
    },INIT_STATE)



    const isValid =()=>{

       return register.firstname.trim() !== "" && register.lastname.trim() !== "" && 
       register.email.trim()!== "" && register.password.trim()!== "" &&
       register.confirmPassword.trim() !== "" && register.userType.trim()!== "";
    }

    const OnSubmit = (e)=>{
        e.preventDefault(); 
        
        if(isValid()){
            if(register.password===register.confirmPassword){
                RegisterUser(register,dispatchRegister);
            
            }else
            {
                dispatchRegister({errorMessage:"Password don not match", isRegisterError:true,registered:false});
            }
        }else {
            dispatchRegister({errorMessage:"All fields with * are required", isRegisterError:true,registered:false});

        }
    }
    
  


    return (

        <Box display="flex"
            justifyContent="center"
            alignItems="start"
            minHeight="100vh"
            backgroundColor="#dfe0e6"
            style={{backgroundImage:`url(${background})`,backgroundRepeat: 'no-repeat'}}
            sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? theme.palette.grey[200]
                    : theme.palette.grey[800],
                    p:2,
                    backgroundSize: "cover"
              }}
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
                                    Register
                                </Typography>
                            }
                        subheader={ register.isRegisterError?register.errorMessage:register.registered&&'Successful registered'}
                        subheaderTypographyProps={{alignItems:"start",fontSize:"0.8rem",color:register.isRegisterError?ERROR_COLOR:SUCCESS_COLOR}}
                        
                    />
                    <CardContent>
                    
                    <form className="register-inputs" autoComplete="off">
                        <CssTextField 
                            
                            required
                            variant="outlined"
                            helpertext=""id="demo-helper-text-aligned"label="Firstname"
                            type="text" className="firstname-input" placeholder="enter firstname"
                             value={register.firstname}
                            onChange={(e)=>dispatchRegister({firstname:e.target.value,isRegisterError:false,registered:false})}/>
                        <CssTextField 
                            required
                            variant="outlined"
                            helpertext="" id="demo-helper-text-aligned"label="Lastname" color="secondary"
                         type="text" className="lastname-input" placeholder="enter lastname" value={register.lastname}
                        onChange={(e)=>dispatchRegister({lastname:e.target.value ,isRegisterError:false,registered:false})}></CssTextField>
                        
                        <CssTextField 
                           required
                            variant="outlined"
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="Email"
                        type="text" className="email-input" placeholder="enter email" value={register.email} 
                         onChange={(e)=>dispatchRegister({email:e.target.value,isRegisterError:false,registered:false })}></CssTextField>
                       <CssTextField
                          required
                          variant="outlined"
                          helpertext=""
                          id="demo-helper-text-aligned"
                          label="Date of Birth"
                          onClick={()=>setDateType("date")}
                          onBlur={()=>{setDateType("text");}}
                          type={dateType} className="age-input" placeholder="enter date of birth" value={register.age}
                          onChange={(e)=>dispatchRegister({age:e.target.value,isRegisterError:false,registered:false})}
                       />

                        <CssTextField 
                            required
                            variant="outlined"
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="password"
                            color="secondary" 
                        type="password" autoComplete='new-password' className="password-input" placeholder="password" value={register.password}
                        onChange={(e)=>dispatchRegister({password:e.target.value, isRegisterError:false,registered:false})}></CssTextField>
                
                        <CssTextField 
                             required
                            variant="outlined"
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="confirm-password"
                            color="secondary"
                            type="password" autoComplete='new-password' className="password-input" placeholder="confirm password" value={register.confirmPassword}
                            onChange={(e)=>dispatchRegister({confirmPassword:e.target.value, isRegisterError:false,registered:false})}
                        />

                        <ColorButton variant='contained' style={{marginTop:"15px",color:"white"}} className="submit-btn" onClick={(e)=>{OnSubmit(e)}}>Submit</ColorButton>

                    </form>
                    </CardContent>

                     <CardActions sx={{display:"flex", justifyContent:"center",}}>

                            <div className="login-nav">
                                <Link   to="/" className="login-link" >Registered already, click to login </Link>
                            </div>
                    </CardActions>
              </Card>
        </Box>
    )
}
export default Register;
