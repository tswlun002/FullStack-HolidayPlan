import './Register.css'
import {  useReducer,useEffect} from "react"
import { Link } from "react-router-dom";
import { Typography,Box,Card,CardContent,CardActions ,CardHeader,IconButton} from '@mui/material';
import background from '../images/2.jpg'
import CssTextField from '../component/CssTextField';
import ColorButton from '../component/ColorButton';
import {resetPassword, resetPasswordRequest } from '../utils/User';
import { ERROR_COLOR, PRIMAR_COLOR, SUCCESS_COLOR } from '../utils/Constant';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';



const ResetPassword =()=>{
    
    const INIT_STATE ={email:"", isRequestSuccessful:false,password:"",OTP:"",confirmPassword:"",
                        passwordResetSucceful:JSON.parse(window.localStorage.getItem("passwordResetSucceful"))||false,
                        isLoading:false,isRequestError:false, message: '',newPasswordVisible:false,confirmPasswordVisible:false}
    const[passwordReset, dispatchPasswordReset] = useReducer((state, action)=>{
        return {...state,...action }
    },INIT_STATE)
   

    useEffect(()=>{
          window.localStorage.setItem("passwordResetSucceful",JSON.stringify(passwordReset.passwordResetSucceful));
       
      }, [passwordReset.passwordResetSucceful]);

    const isValid =()=>{

       return  passwordReset.passwordResetSucceful? passwordReset.email.trim()!== "" && passwordReset.password.trim()!== "" &&
               passwordReset.confirmPassword.trim() !== "" && (passwordReset.OTP&&passwordReset.OTP.toString() !=='')
               : passwordReset.email.trim()!== "" ;
    }

    const OnSubmit = (e)=>{
        e.preventDefault(); 
        
        if(isValid()){
             
             if(passwordReset.password===passwordReset.confirmPassword){
               passwordReset.passwordResetSucceful? 
               resetPassword(
                {username:passwordReset.email,OTP:parseInt(passwordReset.OTP),newPassword:passwordReset.password,confirmPassword:passwordReset.confirmPassword},
                dispatchPasswordReset
               ):
               resetPasswordRequest(passwordReset.email,dispatchPasswordReset);
            
            }else
            {
                dispatchPasswordReset({message:"Password don not match", isLoading:false,isRegisterError:true,registered:false});
            }
            
        }else {
            dispatchPasswordReset({message:"Email is required",
             isLoading:false,isRequestError:true,isRequestSuccessful:false});

        }
    }
    
    
    return (

        <Box display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            backgroundColor="#dfe0e6"
            style={{backgroundImage:`url(${background})`,backgroundRepeat: 'no-repeat'}}
            sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? theme.palette.grey[200]
                    : theme.palette.grey[800],
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
                                    Reset Password
                                </Typography>
                            }
                            subheader={ passwordReset.isRequestError?
                                passwordReset.message:passwordReset.isRequestSuccessful&&passwordReset.message}
                            subheaderTypographyProps={{alignItems:"start",fontSize:"0.8rem",
                               color:passwordReset.isRequestError?ERROR_COLOR:SUCCESS_COLOR}}
                        
                    />
                    <CardContent>
                    
                    <form className="register-inputs" autoComplete="off">
                        <CssTextField 
                           required
                            variant="outlined"
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="Email"
                            type="email" className="email-input"
                            placeholder="enter email" value={passwordReset.email} 
                           onChange={(e)=>dispatchPasswordReset({email:e.target.value,  isLoading:false,isRequestError:false,isRequestSuccessful:false })}
                         />
                         {passwordReset.passwordResetSucceful&&<CssTextField 
                           required
                            variant="outlined"
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="OTP"
                            type="text" className="opt-input"
                             placeholder="enter OTP code" value={passwordReset.OTP} 
                           onChange={(e)=>dispatchPasswordReset({OTP:e.target.value,  isLoading:false,isRequestError:false,isRequestSuccessful:false })}
                         />}
                            {passwordReset.passwordResetSucceful&& <CssTextField 
                            required
                            variant="outlined"
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="password"
                            color="secondary" 
                            type={passwordReset.newPasswordVisible?"text":"password"} 
                            autoComplete='new-password' className="password-input" placeholder="password" value={passwordReset.password}
                            onChange={(e)=>dispatchPasswordReset({password:e.target.value,   isLoading:false,isRegisterError:false,registered:false})}
                            
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment
                                    sx={{padding:"0.1rem",}} position="end">
                                    <IconButton                                      
                                        onClick={()=>dispatchPasswordReset({ newPasswordVisible:!passwordReset.newPasswordVisible})} 
                                    >
                                       {passwordReset.newPasswordVisible?<VisibilityIcon/>:<VisibilityOffIcon/>}
                                    </IconButton>

                                   
                                  </InputAdornment>
                                )
                              }}
                            />}
                  
                
                       { passwordReset.passwordResetSucceful&&<CssTextField 
                            required
                            variant="outlined"
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="confirm-password"
                            color="secondary"
                            type={passwordReset.confirmPasswordVisible?"text":"password"} 
                            autoComplete='new-password' className="password-input" placeholder="confirm password" value={passwordReset.confirmPassword}
                            onChange={(e)=>dispatchPasswordReset({confirmPassword:e.target.value,   isLoading:false,isRegisterError:false,registered:false})}
                            InputProps={{
                                endAdornment: (
                                  <InputAdornment   sx={{padding:"0.1rem",}} position="end">
                                    <IconButton 
                                      onClick={()=>dispatchPasswordReset({confirmPasswordVisible:!passwordReset.confirmPasswordVisible})} 
                                   >
                                    {passwordReset.confirmPasswordVisible?<VisibilityIcon/>:<VisibilityOffIcon/>}
                                    </IconButton>
                                  </InputAdornment>
                                )
                              }}
                        />}

                       
                       
            

                        <ColorButton variant='contained'
                                    style={{marginTop:"20px",color:"white"}} className="submit-btn"
                                    onClick={(e)=>{OnSubmit(e)}}
                                    >
                                    {(passwordReset.isLoading)?
                                     "Resetting...":"Reset Password"}
                       </ColorButton>

                    </form>
                    </CardContent>

                     <CardActions sx={{display:"flex", justifyContent:"center",}}>

                            <div className="login-nav">
                                <Link   to="/" className="login-link" >click to login </Link>
                            </div>
                    </CardActions>
              </Card>
        </Box>
    )
}
export default ResetPassword;

