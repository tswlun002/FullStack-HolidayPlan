import './Register.css'
import {  useReducer, useEffect} from "react"
import { useNavigate, Link } from "react-router-dom";
import { FormControl,RadioGroup, FormControlLabel,Radio,FormLabel, Paper } from '@mui/material';
import CssTextField from './CssTextField';
import ColorButton from './ColorButton';
import {RegisterUser,RegisterAdmin } from '../utils/User';



const Register =()=>{
    const navigate = useNavigate();

    //Login registered values
    const[register, dispatchRegister] = useReducer((state, action)=>{
        return {...state,...action,
        }
    },{firstname:"",lastname:"",email:"",password:"",confirmPassword:"",userType:"",age:"", registered:false,
    responseStatus:0})

    //Clear form when registered successfully and navigate to login page
    useEffect(() =>{
        if(register.registered){ClearForm();navigate("/")}
    },[register.registered]
    );

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
         console.log(register)
        if(register.password===register.confirmPassword){
            if(register.userType==="USER")RegisterUser(register,dispatchRegister);
            else if(register.UserType==="ADMIN") RegisterAdmin(register,dispatchRegister)
            
           
        }else
        {
            alert("Password don not match")
        }
    }


    return (

        <div className="register">
               <Paper className="register-container">
                    <h1 className="heading">Register</h1>
                    <form className="register-inputs" autoComplete="off">
                    <div className="user-type">  <UserTypes userRegister={register} dispatchRegister={dispatchRegister}/></div>
                       
                        <CssTextField 
                            
                            required
                            variant="outlined"
                            helpertext=""id="demo-helper-text-aligned"label="Firstname"
                            type="text" className="firstname-input" placeholder="enter firstname"  value={register.firstname}
                            onChange={(e)=>dispatchRegister({firstname:e.target.value})}/>
                        <CssTextField 
                            required
                            variant="outlined"
                            helpertext="" id="demo-helper-text-aligned"label="Lastname" color="secondary"
                         type="text" className="lastname-input" placeholder="enter lastname" value={register.lastname}
                        onChange={(e)=>dispatchRegister({lastname:e.target.value})}></CssTextField>
                        
                        <CssTextField 
                           required
                            variant="outlined"
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="Email"
                        type="text" className="email-input" placeholder="enter email" value={register.email} 
                         onChange={(e)=>dispatchRegister({email:e.target.value})}></CssTextField>
                       <CssTextField
                         required
                          variant="outlined"
                          helpertext=""
                          id="demo-helper-text-aligned"
                          label="Age"
                          type="number" className="age-input" placeholder="enter age" value={register.age}
                           onChange={(e)=>dispatchRegister({age:e.target.value})}
                       />

                        <CssTextField 
                            required
                            variant="outlined"
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="password"
                            color="secondary" 
                        type="password" autoComplete='new-password' className="password-input" placeholder="password" value={register.password}
                        onChange={(e)=>dispatchRegister({password:e.target.value})}></CssTextField>
                
                        <CssTextField 
                             required
                            variant="outlined"
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="confirm-password"
                            color="secondary"
                            type="password" autoComplete='new-password' className="password-input" placeholder="confirm password" value={register.confirmPassword}
                            onChange={(e)=>dispatchRegister({confirmPassword:e.target.value})}
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
                    <FormControlLabel value="USER"  color="#0000" control={<Radio />} label="User" />
                    <FormControlLabel value="ADMIN" control={<Radio />} label="Admin" />
                </div>
            </RadioGroup>
    </FormControl>
    )

}
export default Register;