
import {  useReducer, useState,useEffect} from "react"
import {  Box,Card,CardContent,CardHeader,Button,styled} from '@mui/material';
import UseAxiosPrivate from '../utils/UseAxiosPrivate'
import EditUserItem from './EditUserItem'
import {useParams} from "react-router-dom";
import {getErrorMessage} from '../utils/Error';
import CssTextField from './CssTextField';
import {UpdateUser} from '../utils/User';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {NavLink} from 'react-router-dom'
import CustomerTypography from "./CustomerTypography";
import { ERROR_COLOR, PRIMAR_COLOR, SUCCESS_COLOR } from "../utils/Constant";

const EditUserForm=()=>{
    const{username} = useParams();
    const useAxiosPrivate  =UseAxiosPrivate();
    const [dateType, setDateType]= useState("text");
    const[user, setUser] = useReducer((state,action)=>{return{...state, ...action}},{firstname:"",lastname:"",age:"",username:""});
    //Login isRequestSuccessful values
    const[register, dispatchRegister] = useReducer((state, action)=>{
        return {...state,...action}
        },
        { 
            firstname:"",lastname:"",email:"",currentUsername:username,currentPassword:"",
            isRequestError:false, age:"",message: "",isRequestSuccessful:false,
            openFirstname:false,openLastname:false,openAge:false,opeUsername:false
        }
    );
    useEffect(()=>{
        let isMounted = true;
        const controller = new AbortController();
        const API = `/holiday-plan/api/admin/user/${username}`;
        const getUser =async()=>{
            const response = await useAxiosPrivate.get(API, {signal:controller.signal,  validateStatus: function (status) {
                // if this function returns true, exception is not thrown, so
                // in simplest case just return true to handle status checks externally.
                return true;
            }})
            try{
                if(response.ok || response.status===302){
                    setUser(response.data)
    
                }
            }catch(err){
                
                if(!err?.response.ok && err.name!=="AbortErr"){
                    let message  =null;
                    if(err.response.status===404){
                        message  ="Invalid credentials";
                    }
                    else if(err.response.status===401){
                            message  ="Denied access";
                    }
                    else{
                            message  = getErrorMessage(err);
                    }
                    dispatchRegister({message:message,isRequestError:true,isRequestSuccessful:false})
                }else dispatchRegister({message:"Server Error",isRequestError:true,isRequestSuccessful:false})
            }
            
           

            
            
        }
        isMounted&&getUser();

        return ()=>{
            isMounted=false; controller.abort();
            setTimeout(()=>{dispatchRegister({firstname:"",lastname:"",email:"",
            currentUsername:username,currentPassword:"",age:"", isRequestSuccessful:false,
            isRequestError:false, message:""})},5000);
        }
    },[]);
    

    

    const isValid =()=>{
 
       return (register.firstname.trim() !== "" || register.lastname.trim() !== "" ||
            register.email.trim() !== "" ||  register.currentPassword.trim() !== "" );
    }
    

    const ClearForm= ()=>{
        setTimeout(()=>{
            dispatchRegister(
              {
                firstname:"",lastname:"",email:"",currentPassword:"",age:'', isRequestSuccessful:false,isRequestError:false
              }
            )
        },200)
    }
    const OnSubmit = (e)=>{
        e.preventDefault(); 
         if(register.currentPassword.trim()===""){
            dispatchRegister({message:"password is required", isRequestError:true,isRequestSuccessful:false});
         }
        else if(isValid()){
            UpdateUser(useAxiosPrivate,register,dispatchRegister);
            if(register.isRequestSuccessful){
                ClearForm();
            }
        
        }else {
            dispatchRegister({message:"No field was updated, need update atleast one field", isRequestError:true,isRequestSuccessful:false});

        }
    }
    const StyledCardHeader = styled(CardHeader)({
        '.MuiCardHeader-action':{
            '&:hover': {
                 color:"blue",
                },
                '&.Mui-focused': {
                  color:"blue",
                },
        }
    }) ;

    return (

        <Box display="flex"
            justifyContent="center"
            alignItems="start"
            minHeight="100vh"
            backgroundColor="#dfe0e6"

              >
              <Card sx={{ maxWidth: 400,display:"block"}}>
                     <StyledCardHeader
                        title={<Stack direction="row" spacing='10%'alignItems="center" justifyContent="flex-start">
                            <NavLink
                                to=".."
                                relative="path"
                                
                            >
                                <ArrowBackIcon/>  
                            </NavLink> 
                            <CustomerTypography  variant="h4" align="center" color={PRIMAR_COLOR}>Account</CustomerTypography>
                        </Stack>
                        }
                        
                        
                        subheader={(register.isRequestError ||register.isRequestSuccessful)?register.message:""
                        }
                        subheaderTypographyProps={{alignItems:"center" ,color:register.isRequestError?ERROR_COLOR:SUCCESS_COLOR}}
                    />
                    <CardContent>
                    <form className="register-inputs" autoComplete="off">
                       

                        <EditUserItem
                            IsEditFieldOpen={register.openFirstname}
                            field={"openFirstname"}
                            setIsEditFieldOpen={dispatchRegister}
                            editIconProps={{color:'#4169e1',}}
                            componentValue={user.firstname}
                            componentLabel={"Firstname"}
                            focus
                            variant="outlined"
                            helpertext=""id="demo-helper-text-aligned"
                            label="Firstname"
                            type="text" 
                            className="firstname-input" 
                            placeholder="enter firstname"
                            value={register.firstname}
                            onChange={(e)=>dispatchRegister({firstname:e.target.value,isRequestError:false,isRequestSuccessful:false})}
                        />
                        <EditUserItem
                            IsEditFieldOpen={register.openLastname}
                            field={"openLastname"}
                            setIsEditFieldOpen={dispatchRegister}
                            editIconProps={{color:'#4169e1',}}
                            componentLabel={"Lastname"}
                            componentValue={user.lastname}
                                    
                            focus
                            variant="outlined"
                            helpertext="" id="demo-helper-text-aligned"label="Lastname" color="secondary"
                            type="text" className="lastname-input" placeholder="enter lastname" value={register.lastname}
                            onChange={(e)=>dispatchRegister({lastname:e.target.value ,isRequestError:false,isRequestSuccessful:false})}
                        />

                        <EditUserItem
                            IsEditFieldOpen={register.opeUsername}
                            field={"opeUsername"}
                            setIsEditFieldOpen={dispatchRegister}
                            editIconProps={{color:'#4169e1',}}
                           componentValue={user.username}
                           componentLabel={"Email"}
                                    
                            focus
                            variant="outlined"
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="Email"
                            type="text" className="email-input" placeholder="enter email" value={register.email}
                            onChange={(e)=>dispatchRegister({email:e.target.value,isRequestError:false,isRequestSuccessful:false })}
                         />
                       <EditUserItem
                            IsEditFieldOpen={register.openAge}
                            field={"openAge"}
                            setIsEditFieldOpen={dispatchRegister}
                            editIconProps={{color:'#4169e1',}}
                            componentValue={user.age}
                            componentLabel={"Date of birth"}
                                    
                            focus
                            variant="outlined"
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="Date of Birth"
                            onClick={()=>setDateType("date")}
                            onBlur={()=>{setDateType("text");}}
                            type={dateType} className="age-input" placeholder="enter date of birth" value={register.age}
                            onChange={(e)=>dispatchRegister({age:e.target.value,isRequestError:false,isRequestSuccessful:false})}
                       />
                       <CssTextField
                            required
                            variant="outlined"
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="Admin password"
                            color="secondary"
                            type="password" 
                            autoComplete='new-password' 
                            className="currentPassword-input" 
                            placeholder="current password" 
                            value={register.currentPassword}
                            onChange={(e)=>dispatchRegister({currentPassword:e.target.value, isRequestError:false, isRequestSuccessful:false})}
                        />

                            <Button 
                                color="secondary" 
                                variant="outlined" 
                                style={{marginTop:"15px",color:"black"}}
                                onClick={(e)=>OnSubmit(e)}>
                                    Update
                            </Button>

                    </form>
                    </CardContent>


              </Card>
        </Box>
    )
}

export default EditUserForm;