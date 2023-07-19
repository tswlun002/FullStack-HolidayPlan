
import {  useReducer, useState,useEffect} from "react"
import {  Box,Card,CardContent,CardHeader,Button} from '@mui/material';
import UseAxiosPrivate from '../utils/UseAxiosPrivate'
import EditUserItem from './EditUserItem'
import {useParams} from "react-router-dom";
import {getErrorMessage} from '../utils/Error';
import CssTextField from './CssTextField';
import {UpdateUser} from '../utils/User';

const EditUserForm=()=>{
    const{username} = useParams();
    const useAxiosPrivate  =UseAxiosPrivate();
    const [dateType, setDateType]= useState("text");
    const[user, setUser] = useReducer((state,action)=>{return{...state, ...action}},{firstname:"",lastname:"",age:"",username:""});
    //Login isRequestSucceeded values
    const[register, dispatchRegister] = useReducer((state, action)=>{
        return {...state,...action}
        },
        { 
            firstname:"",lastname:"",email:"",currentUsername:username,currentPassword:"",age:"", isRequestSucceeded:false,
            isEditError:false, errorMessage:"",   requestResponseMessage:"",
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
            console.log(response)
            if(response.ok || response.status===302){
                    console.log(response.data)
                isMounted&& setUser(response.data)
 
            }
            
            if(!response?.response.ok && response.name!=="AbortErr"){
                let errorMessage  =null;
                if(response.response.status===404){
                    errorMessage  ="Invalid credentials";
                }
                else if(response.response.status===401){
                        errorMessage  ="Denied access";
                }
                else{
                        console.log(response.response.statusText);
                        errorMessage  = getErrorMessage(response);
                }
                dispatchRegister({message:errorMessage,isEditError:true})
            }else dispatchRegister({message:"Server Error",isEditError:true})

            
            
        }
        getUser();

        return ()=>{isMounted=false; controller.abort();}
    },[]);
    

    

    const isValid =()=>{
 
       return (register.firstname.trim() !== "" || register.lastname.trim() !== "" ||
            register.email.trim() !== "" ||  register.currentPassword.trim() !== "" );
    }
    

    const ClearForm= ()=>{
        setTimeout(()=>{
            dispatchRegister(
              {
                firstname:"",lastname:"",email:"",currentPassword:"",age:'', isRequestSucceeded:false,

  
              }
            )
        },200)
    }
    const OnSubmit = (e)=>{
        e.preventDefault(); 
         console.log(register)
         if(register.currentPassword.trim()===""){
            dispatchRegister({errorMessage:"password is required", isLoginError:true});
         }
        else if(isValid()){
            UpdateUser(useAxiosPrivate,register,dispatchRegister);
            if(register.isRequestSucceeded){
                ClearForm();
            }
        
        }else {
            dispatchRegister({errorMessage:"No field was updated, need update atleast one field", isLoginError:true});

        }
    }


    return (

        <Box display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            backgroundColor="#dfe0e6"

              >
              <Card sx={{ maxWidth: 400,display:"block"}}>
                     <CardHeader
                        title={<h2>Account</h2>}
                        titleTypographyProps={{align:"center",color:"rgb(143, 88, 175)",align:"center"}}
                        subheader={(register.isLoginError ||register.isEditError)?register.errorMessage:
                                    register.isRequestSucceeded?register.requestResponseMessage:""
                        }
                        subheaderTypographyProps={{align:"start" ,color:register.isEditError?"red":"green"}}
                    />
                    <CardContent>
                    <form className="register-inputs" autoComplete="off">
                       

                        <EditUserItem
                            IsEditFieldOpen={register.openFirstname}
                            field={"openFirstname"}
                            setIsEditFieldOpen={dispatchRegister}
                            editIconProps={{color:'#4169e1',}}
                            componentLabel={user.firstname}
                                    
                            focus
                            variant="outlined"
                            helpertext=""id="demo-helper-text-aligned"
                            label="Firstname"
                            type="text" 
                            className="firstname-input" 
                            placeholder="enter firstname"
                            value={register.firstname}
                            onChange={(e)=>dispatchRegister({firstname:e.target.value,isLoginError:false,isRequestSucceeded:false})}
                        />
                        <EditUserItem
                            IsEditFieldOpen={register.openLastname}
                            field={"openLastname"}
                            setIsEditFieldOpen={dispatchRegister}
                            editIconProps={{color:'#4169e1',}}
                            componentLabel={user.lastname}
                                    
                            focus
                            variant="outlined"
                            helpertext="" id="demo-helper-text-aligned"label="Lastname" color="secondary"
                            type="text" className="lastname-input" placeholder="enter lastname" value={register.lastname}
                            onChange={(e)=>dispatchRegister({lastname:e.target.value ,isLoginError:false,isRequestSucceeded:false})}
                        />

                        <EditUserItem
                            IsEditFieldOpen={register.opeUsername}
                            field={"opeUsername"}
                            setIsEditFieldOpen={dispatchRegister}
                            editIconProps={{color:'#4169e1',}}
                            componentLabel={user.username}
                                    
                            focus
                            variant="outlined"
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="Email"
                            type="text" className="email-input" placeholder="enter email" value={register.email}
                            onChange={(e)=>dispatchRegister({email:e.target.value,isLoginError:false,isRequestSucceeded:false })}
                         />
                       <EditUserItem
                            IsEditFieldOpen={register.openAge}
                            field={"openAge"}
                            setIsEditFieldOpen={dispatchRegister}
                            editIconProps={{color:'#4169e1',}}
                            componentLabel={user.age}
                                    
                            focus
                            variant="outlined"
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="Date of Birth"
                            onClick={()=>setDateType("date")}
                            onBlur={()=>{setDateType("text");}}
                            type={dateType} className="age-input" placeholder="enter date of birth" value={register.age}
                            onChange={(e)=>dispatchRegister({age:e.target.value,isLoginError:false,isRequestSucceeded:false})}
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
                            onChange={(e)=>dispatchRegister({currentPassword:e.target.value, isLoginError:false, isRequestSucceeded:false})}
                        />

                            <Button 
                                color="secondary" 
                                variant="outlined" 
                                style={{marginTop:"15px"}}
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