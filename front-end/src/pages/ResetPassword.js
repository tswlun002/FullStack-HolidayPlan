import './Register.css'
import {  useReducer} from "react"
import { Link } from "react-router-dom";
import { Typography,Box,Card,CardContent,CardActions ,CardHeader} from '@mui/material';
import background from '../images/2.jpg'
import CssTextField from '../component/CssTextField';
import ColorButton from '../component/ColorButton';
import {resetPassword } from '../utils/User';
import { ERROR_COLOR, PRIMAR_COLOR, SUCCESS_COLOR } from '../utils/Constant';
import UseAxiosPrivate from '../utils/UseAxiosPrivate';

const ResetPassword =()=>{

    const INIT_STATE ={email:"", isRequestSuccessful:false,   isLoading:false,isRequestError:false, message: ''}
    const[passwordReset, dispatchPasswordReset] = useReducer((state, action)=>{
        return {...state,...action }
    },INIT_STATE)
    const  useAxiosPrivate=UseAxiosPrivate();


    const isValid =()=>{

       return  passwordReset.email.trim()!== "" 
    }

    const OnSubmit = (e)=>{
        e.preventDefault(); 
        
        if(isValid()){
             resetPassword(passwordReset.email,useAxiosPrivate,dispatchPasswordReset);
            
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
                        type="text" className="email-input" placeholder="enter email" value={passwordReset.email} 
                         onChange={(e)=>dispatchPasswordReset({email:e.target.value,  isLoading:false,isRequestError:false,isRequestSuccessful:false })}></CssTextField>
                       
            

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

