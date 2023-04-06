import './Register.css'
import {  useReducer, useEffect} from "react"
import { useNavigate, Link } from "react-router-dom";
import { FormControl,RadioGroup, FormControlLabel,Radio,FormLabel, Paper, Typography } from '@mui/material';
import CssTextField from '../component/CssTextField';
import ColorButton from '../component/ColorButton';
import {RegisterUser } from '../utils/User';



const Register =()=>{
    const navigate = useNavigate();

    //Login registered values
    const[register, dispatchRegister] = useReducer((state, action)=>{
        return {...state,...action,
        }
    },{firstname:"",lastname:"",email:"",password:"",confirmPassword:"",userType:"",age:"", registered:false,
    isLoginError:false, errorMessage: null})

    //Clear form when registered successfully and navigate to login page
    useEffect(() =>{
        if(register.registered){ClearForm();navigate("/")}
    },[register.registered]
    );

    const isValid =()=>{

       return register.firstname.trim() !== "" && register.lastname.trim() !== "" && register.email.trim()!== "" && register.password.trim()!== "" &&
       register.confirmPassword.trim() !== "" && register.userType.trim()!== "";
    }
    

    const ClearForm= ()=>{
        setTimeout(()=>{
            dispatchRegister(
              {
                firstname:"",lastname:"",email:"",password:"",confirmPassword:"",userType:"",age:'', registered:false
  
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

        <div className="register">
               <Paper className="register-container">
                    <h1 className="heading">Register</h1>
                    <form className="register-inputs" autoComplete="off">
                    <div className="user-type">  <UserTypes userRegister={register} dispatchRegister={dispatchRegister}/></div>
                    {
                            register.isLoginError &&
                            <Typography align="center"sx={{color:"red"}}>
                            {register.errorMessage}
                            </Typography>
                        }
                        <CssTextField 
                            
                            required
                            variant="outlined"
                            helpertext=""id="demo-helper-text-aligned"label="Firstname"
                            type="text" className="firstname-input" placeholder="enter firstname"  value={register.firstname}
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
                          label="Age"
                          type="number" className="age-input" placeholder="enter age" value={register.age}
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
                    <div className="login-nav">
                        <Link   to="/" className="login-link" >Registered already, click to login </Link>
                    </div>
            </Paper>

        </div>
    )
}


const UserTypes = ({userRegister ,dispatchRegister})=>{
    return(
        <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group"></FormLabel>
            <RadioGroup  className='radio-group'
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                onChange={(e)=>dispatchRegister({userType:e.target.value.toUpperCase()})}
                value={userRegister.userType}
              
            >
                <div className='radio-group'style={{display:"flex"}}>
                    <FormControlLabel value="USER" control={<Radio />} label="User" />
                </div>
            </RadioGroup>
    </FormControl>
    )

}
export default Register;