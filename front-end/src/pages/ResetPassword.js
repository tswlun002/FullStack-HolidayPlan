import './Register.css'
import {  useReducer} from "react"
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


const   REQUEST_TYPE=["REQUEST-PASSWORD-CHANGE","CHANGE-PASSWORD"]
const ResetPassword =()=>{
    
    const INIT_STATE ={ email:"", isRequestSuccessful:false,password:"",OTP:"",confirmPassword:"",passwordResetRequestSuccessful:false,
                        isLoading:false,isRequestError:false, message: '',newPasswordVisible:false,confirmPasswordVisible:false,
                       }
    const[passwordReset, dispatchPasswordReset] = useReducer((state, action)=>{
        return {...state,...action }
    },INIT_STATE)


    const OnSubmit = (e,requestType)=>{
        e.preventDefault();
        if(requestType===REQUEST_TYPE[1]){
             if(passwordReset.password===passwordReset.confirmPassword){
               if(passwordReset.OTP.trim()===''){dispatchPasswordReset({message:"OTP is required",isLoading:false,isRequestError:true,registered:false})}
               else resetPassword(
                {username:passwordReset.email,OTP:parseInt(passwordReset.OTP),newPassword:passwordReset.password,confirmPassword:passwordReset.confirmPassword},
                dispatchPasswordReset
               )
            }
            else
            {
                dispatchPasswordReset({message:"Password don not match", isLoading:false,isRegisterError:true,registered:false});
            }
        }
        else{

            if(passwordReset.password.trim()==='' && passwordReset.email.trim()===''){
                 console.log((passwordReset.password.trim()===''&& passwordReset.email.trim()===''))
                 dispatchPasswordReset({isRequestError:true,isLoading:false,register:false,message:"Both email and new password are required"});
            }
            else if(passwordReset.password.trim()===''){
                dispatchPasswordReset({isRequestError:true,isLoading:false,register:false, message:"New password is required"});
            }
            else if(passwordReset.email.trim()===''){
                dispatchPasswordReset({isRequestError:true,isLoading:false,register:false, message:"Email is required"});
            }
            else{
                  resetPasswordRequest(passwordReset.email,passwordReset.password,dispatchPasswordReset);
            }

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
                                passwordReset.message:(passwordReset.isRequestSuccessful||passwordReset.passwordResetRequestSuccessful)
                                &&passwordReset.message}
                            subheaderTypographyProps={{alignItems:"start",fontSize:"0.8rem",
                               color:passwordReset.isRequestError?ERROR_COLOR:SUCCESS_COLOR}}
                        
                    />
                    <CardContent>
                    
                    <form className="register-inputs" autoComplete="off">
                        <CssTextField 
                           required
                           disabled={passwordReset.passwordResetRequestSuccessful}
                            variant="outlined"
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="Email"
                            type="email" className="email-input"
                            placeholder="enter email" value={passwordReset.email} 
                           onChange={(e)=>dispatchPasswordReset({email:e.target.value,  isLoading:false,isRequestError:false,isRequestSuccessful:false })}
                         />
                         {passwordReset.passwordResetRequestSuccessful&&<CssTextField
                           required
                            variant="outlined"
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="OTP"
                            type="text" className="opt-input"
                             placeholder="enter OTP code" value={passwordReset.OTP} 
                           onChange={(e)=>dispatchPasswordReset({OTP:e.target.value,  isLoading:false,isRequestError:false,isRequestSuccessful:false })}
                         />}
                            {<CssTextField
                            required
                            disabled={passwordReset.passwordResetRequestSuccessful}
                            variant="outlined"
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="New password"
                            color="secondary" 
                            type={passwordReset.newPasswordVisible?"text":"password"} 
                            autoComplete='new-password' className="password-input" placeholder="new password" value={passwordReset.password}
                            onChange={(e)=>dispatchPasswordReset({password:e.target.value,   isLoading:false,isRegisterError:false,registered:false,isRequestSuccessful:false })}
                            
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
                       { passwordReset.passwordResetRequestSuccessful&&<CssTextField
                            required
                            variant="outlined"
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="Confirm password"
                            color="secondary"
                            type={passwordReset.confirmPasswordVisible?"text":"password"} 
                            autoComplete='new-password' className="password-input" placeholder="confirm password" value={passwordReset.confirmPassword}
                            onChange={(e)=>dispatchPasswordReset({confirmPassword:e.target.value,   isLoading:false,isRegisterError:false,registered:false,isRequestSuccessful:false })}
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
                                    style={{marginTop:"20px",color:"white"}}
                                     className="submit-btn"
                                    onClick={(e)=>{
                                        OnSubmit(e,passwordReset.passwordResetRequestSuccessful?REQUEST_TYPE[1]:REQUEST_TYPE[0] )}
                                     }
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

