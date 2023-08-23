import {  Link } from "react-router-dom";
import './Login.css'
import {Typography,Box,Card,CardContent,CardActions, CardHeader,Paper,Grid}  from '@mui/material';
import CssTextField from '../component/CssTextField';
import ColorButton from '../component/ColorButton';
import { LogInUser} from '../utils/User';
import React,{ useReducer} from 'react';
import {CreateAuthContext} from '../context/CreateAuthContext';
import UseAxiosPrivate from '../utils/UseAxiosPrivate'
import background from '../images/2.jpg'
import WelcomeMessage from "../component/WelcomeMessage";
import {  ERROR_COLOR, PRIMAR_COLOR } from "../utils/Constant";
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@material-ui/core';



const Login =()=>{
    const {dispatchLogin, appData } = React.useContext(CreateAuthContext);
    const theme =  useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('916'));
    const useAxiosPrivate = UseAxiosPrivate();
    const INITI_STATE = {   email: "",password: "", isLoginError:false,message: '', isLoginSuccessful:false,data:{}}
    const APP_NAME = appData?.data?.name||""
    const HEADING ="OH!"
    const MESSAGE =`THE PLACES YOU'LL GO ... book them  here, at ${APP_NAME}`
    const [formState, dispatchForm] = useReducer((state, action)=>{return {...state , ...action}}, INITI_STATE);
   
    const OnSubmit = async(e)=>{
        e.preventDefault(); 
        if(formState.email.trim() === ""|| formState.password.trim() === ""){
            dispatchForm({isLoginError:true, message:"Both password and email are required",isLoginSuccessful:false});
        }
        else if(!formState.isLoginError){
            let data = await LogInUser(formState,useAxiosPrivate);
            if(data.isLoginSuccessful){
                dispatchLogin(data)
            }else dispatchForm(data);
            ClearForm();
        }

    }
    const ClearForm= ()=>{
        setTimeout(()=>{
            dispatchForm(INITI_STATE );
       },3000)
    }  
    return (
        <Paper  
            style={{backgroundImage:`url(${background})`,backgroundRepeat: 'no-repeat'}}
            sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? theme.palette.grey[200]
                    : theme.palette.grey[800],
                    p:2
                    ,
                    backgroundSize: "cover",
                    
              }}
            
        >
       <Grid container spacing={isSmall?1:0}>
            <Grid item  sm={isSmall?12:5}>
                <WelcomeMessage  heading={HEADING} message={MESSAGE}/>
            </Grid>
            <Grid item  sm={isSmall?12:7}>
                <Box       
                            minHeight={isSmall?0:"100vh"}
                            
                            sx={{width:"100%", alignItems:isSmall?"start":"center",justifyContent:isSmall?"center":"start", display:"flex"} }

                    >   
                        <Card sx={{ maxWidth: 400 ,display:"block",}}>
                        <CardHeader
                                title={
                                        <Typography align="center"  
                                        sx={{fontSize:"2rem",textTransform: "none",fontWeight: 700, 
                                            fontFamily: `Poppins, sans-serif`,width:"100%",color:PRIMAR_COLOR
                                        }} 
                                        variant={"h2"}
                                        >
                                            Login
                                        </Typography>
                                    }
                                subheader={ formState.isLoginError&&formState.message}
                                subheaderTypographyProps={{alignItems:"start",fontSize:"0.8rem",color:ERROR_COLOR}}
                                
                            />
                            <CardContent>
            
                            <form className="login-inputs" autoComplete='off'>
                            

                                <CssTextField 
                                    required
                                    helpertext=""
                                    id="demo-helper-text-aligned"
                                    label="Email"
                                    variant="outlined"
                                    type="email" className="email-input" placeholder="Enter email"
                                    value={formState.email} 
                                    onChange={(e)=>{
                                    
                                        dispatchForm({email:e.target.value,isLoginError:false,message:'',isLoginSuccessful:false})}}></CssTextField>
                            
                                <CssTextField 
                                    required
                                    helpertext=""
                                    id="demo-helper-text-aligned"
                                    label="password"
                                    variant="outlined"
                                    color="secondary" type="password" className="password-input" placeholder="password" 
                                    autoComplete='new-password' value={formState.password}
                                onChange={(e)=>{
                                    
                                    dispatchForm({password:e.target.value,isLoginError:false,message:'',isLoginSuccessful:false})
                                }}></CssTextField>


                                <ColorButton variant="contained" style={{marginTop:"30px", color:"white"}}
                                className="submit-btn" onClick={(e)=>OnSubmit(e)}>Login</ColorButton>


                            </form>
                        </CardContent>
                        <CardActions sx={{display:"flex", justifyContent:"center",}}>
                            <div className="login-nav">
                                <Link   to="/register" className="login-link" >Not registered?, click to register </Link>
                            </div>
                        </CardActions>
                        </Card>
                </Box>
            </Grid>
        </Grid>
    </Paper>
    )
}

export default Login;