import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button ,CardHeader, Box,Stack,Typography,IconButton,Chip, } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import {Avatar} from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import {CreateAuthContext} from '../context/CreateAuthContext';
import UseAxiosPrivate from '../utils/UseAxiosPrivate'
import CssTextField from '../component/CssTextField'
import CustomerTypography from '../component/CustomerTypography';
import { ProfileContext } from '../context/ProfileContext';
import {UpdateUser,DeleteUser,changeSecuirity,
   requestSecuirityChangeEmail, requestSecuirityChangePassword,
   ActivateSecuirityQuestions,FetchSecuirityQuestions, User} 
   from '../utils/User';
import EditUserItem from '../component/EditUserItem';
import { styled } from '@mui/material/styles';
import { SECONDARY_COLOR ,PRIMAR_COLOR, SUCCESS_COLOR, ERROR_COLOR} from '../utils/Constant';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InputAdornment from '@mui/material/InputAdornment';
import EditAttributesIcon from '@mui/icons-material/EditAttributes';
import ColorButton from '../component/ColorButton';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CloseIcon from '@mui/icons-material/Close';
const DeleteButton= styled(Button)({
  '&:hover': {
  border:"1px solid red",
  },
  '&.Mui-focused': {
  border:"1px solid red",
  },
});
const EditButton= styled(LoadingButton)({
  '&:hover': {
  border:`1px solid ${SECONDARY_COLOR}`,
  },
  '&.Mui-focused': {
  border:`1px solid ${SECONDARY_COLOR}`,
  },
});

const SecurityQuestions=()=>{
      const{userLoginState} = React.useContext(CreateAuthContext);
      const useAxiosPrivate = UseAxiosPrivate();
      const{profile, dispatchProfile,securityQuestions,
          dispatchSecurityQuestions,OnSubmitSecurityQuestions} = React.useContext(ProfileContext);

      React.useEffect(()=>{
        let isMounted = true;
        const controller = new AbortController();
        isMounted&&FetchSecuirityQuestions(useAxiosPrivate,{controller},dispatchSecurityQuestions);
        
        return ()=>{
          isMounted=false; 
          controller.abort();
        }

      },[])

  return(
    <Card sx={{boxShadow:"none", }}>
    <CardHeader
            title={<Typography align="center"  
            sx={{fontSize:"1.5rem",textTransform: "none",fontWeight: 700, 
                fontFamily: `Poppins, sans-serif`,width:"100%",color:PRIMAR_COLOR
            }} 
            variant={"h2"}
            >
                Security Quetions
            </Typography>
              }
           titleTypographyProps={{color:PRIMAR_COLOR,align:"center"}}
  
          action={<IconButton size='small' onClick={()=>dispatchProfile({isActivateSecurityQuestions:false})}><CloseIcon/></IconButton>}
          subheader={(securityQuestions.isRequestSuccessful ||securityQuestions.isRequestError)?securityQuestions.message:""}
          subheaderTypographyProps={{alignItems:"center" ,color:securityQuestions.isRequestSuccessful?SUCCESS_COLOR:ERROR_COLOR}}
          
      />
    <form className="register-inputs" autoComplete="off">
        {securityQuestions.data?.map(({question, number})=>{
          const field =  [`question${number}`]  ;  
          const value = profile[field];
          if(value===null||value===undefined)profile[field]='';
          
           return <CssTextField 
                  required
                  variant="outlined"
                  helpertext=""
                  id={number}
                  label={question}
                  type="text" 
                  placeholder="enter answer" 
                  value={value} 
                  onChange={(e)=> dispatchProfile({
                    [field]:e.target.value
                 })}
                
            />

        })}
         
     
          { (!userLoginState.enabledSecurityQuestions)&&
             <ColorButton
                type='submit'
                variant='contained' 
                style={{marginTop:"15px",color:"white"}}
                className="submit-btn" 
                onClick={(e)=>{OnSubmitSecurityQuestions(e)}}>
                  Activate
            </ColorButton>
          }
    </form>
    </Card>
  )
}
const Security =  ()=>{
  const{userLoginState} = React.useContext(CreateAuthContext);
  const{profile, dispatchProfile, OnSubmitSecurity, deleteAccount} = React.useContext(ProfileContext);

  return(
    <Card sx={{maxWidth: 700,width:400,display:"block", boxShadow:"none"}}>
         <CardHeader
            title={<Typography align="center"  
                sx={{fontSize:"1.5rem",textTransform: "none",fontWeight: 700, 
                    fontFamily: `Poppins, sans-serif`,width:"100%",color:PRIMAR_COLOR
                }} 
                variant={"h2"}
                >
                    Security
                </Typography>
                  }
            titleTypographyProps={{color:PRIMAR_COLOR,align:"center"}}
      
        
        />
     <CardContent>            
         
         
        <EditUserItem
                      IsEditFieldOpen={profile?.opeUsername}
                      field={"opeUsername"}
                      setIsEditFieldOpen={ dispatchProfile}
                      editIconProps={{color:SECONDARY_COLOR,}}
                      componentLabel={"Email"}
                      componentValue={userLoginState.username}
                      editable={true}
                      focus
                      variant="outlined"
                      helpertext=""
                      id="demo-helper-text-aligned1"
                      label="New Email"
                      type="email" className="email-input" placeholder="enter new email" value={profile?.email}
                      onChange={(e)=> dispatchProfile({email:e.target.value,isRequestSuccessful:false,
                        isLoading:false ,isRequestError:false})}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment   sx={{padding:"0.1rem",}} position="end">
                             <Chip
                                sx={{ cursor:'pointer'}}
                                onClick={e=>OnSubmitSecurity(e,{type:'change-email'})}
                               className='save-email'
                              icon={<EditAttributesIcon  style={{ color:profile.isPasswordUpdateRequestSuccessful?"green":"black"}}/>}
                              label="Save"
                          
                          />
                          </InputAdornment>
                        )
                      }}
                    />
      { (profile.isPasswordUpdateRequestSuccessful || profile.isEmailUpdateRequestSuccessful)&&
              <CssTextField
              required
              variant="outlined"
              helpertext=""
              id="demo-helper-text-aligned4"
              label="OTP"
              color="secondary"
              type="text" 
              focus
              autoComplete='new-otp' 
              className="otp-input" 
              placeholder="Enter OTP code" 
              value={profile.OTP}
              onChange={(e)=> dispatchProfile({OTP:e.target.value, isRequestSuccessful:false,
                isLoading:false, isRequestError:false})}
              
          />}
          <EditUserItem
                      IsEditFieldOpen={profile['openNewPassword']}
                      field={"openNewPassword"}
                      setIsEditFieldOpen={ dispatchProfile}
                      editIconProps={{color:SECONDARY_COLOR,}}
                      componentLabel={"Password"}
                      componentValue={"******"}
                      variant="outlined"
                      helpertext=""
                      editable={true}
                      id="demo-helper-text-aligned2"
                      label="New password"
                      color="secondary"
                      type={profile.newPasswordVisible?"text":"password"}
                      autoComplete='new-password' className="new-password-input"
                      placeholder="Enter new password" value={profile.newPassword}
                      onChange={(e)=>dispatchProfile({newPassword:e.target.value, 
                        isRequestError:false,isLoading:false,isRequestSuccessful:false})}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment   sx={{padding:"0.1rem"}} position="end">
                           
                            <IconButton
                                sx={{width:"1rem" , p:"1rem",borderRadius:0,borderRight:(theme) => `1px solid ${theme.palette.divider}`}}
                                onClick={()=>dispatchProfile({newPasswordVisible:!profile.newPasswordVisible})}
                              >
                             {profile.newPasswordVisible?<VisibilityIcon style={{marginRight:1}}/>:<VisibilityOffIcon style={{marginRight:1}}/>}
                            </IconButton>
                          
                            <Chip
                               sx={{marginLeft:1, cursor:'pointer'}}
                              className='save-email'
                              onClick={e=>OnSubmitSecurity(e,{type:'change-password'})}
                              icon={<EditAttributesIcon style={{ color:profile.isPasswordUpdateRequestSuccessful?"green":"black"}}/>}
                              label="Save"
                            />
                              
                          </InputAdornment>
                        )
                      }}
                  />
                  {(profile.isPasswordUpdateRequestSuccessful)&&<CssTextField
                      required
                      variant="outlined"
                      id="demo-helper-text-aligned3"
                      label="Confirm-new-password"
                      color="secondary"
                     type={profile.confirmPasswordVisible?"text":"password"}
                      autoComplete='new-password' className="confirm-new-password-input"
                      placeholder="Confirm new password" value={profile.confirmNewPassword}
                      onChange={(e)=>dispatchProfile({confirmNewPassword:e.target.value, 
                        isRequestError:false,isLoading:false,isRequestSuccessful:false})}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment   sx={{padding:"0.1rem",}} position="end">
                              <Chip
                                  sx={{cursor:'pointer'}}
                                  className='save-password'
                                  icon={<EditAttributesIcon/>}
                                  label="Save"
                                  onClick={e=>OnSubmitSecurity(e,{type:'change-password'})}
                          
                          />
                          </InputAdornment>
                        )
                      }}
                  />}
          {
           (!(userLoginState.isSecurityEnabled) && !(profile.isActivateSecurityQuestions))&&
              <Button 
                  
                  size="small"
                  sx={{border:"none", fontSize:"0.7rem", color:"orange"}} 
                  endIcon={<PriorityHighIcon style={{color:"orange"}}/>}
                  onClick={()=>dispatchProfile({isActivateSecurityQuestions:true})}
              >
                Click to activate security question to secure account
              </Button>
          }     
                
          {
          ( ((userLoginState.isSecurityEnabled)&&(profile.isEmailUpdateRequestSuccessful)) 
                                            ||
          (!(userLoginState.isSecurityEnabled)&&(profile.isActivateSecurityQuestions)))&&
            <SecurityQuestions/>
          }
          
          { (userLoginState.isAuthenticated&&userLoginState.roles.find(role=>role.name==='USER'))&&
          <DeleteButton
              disabled={profile.isLoading}
              sx={{ marginTop:"10px", color:"black", borderColor:"white"}}
              variant="outlined" size="small"
              onClick={(e)=>deleteAccount(e)}
          >
            {"delete  account"}
          </DeleteButton>}
        
      </CardContent>            
  </Card>
  )
}


const Profile =  ()=> {
      const useAxiosPrivate = UseAxiosPrivate();
      const{userLoginState,dispatchLogin} = React.useContext(CreateAuthContext);
      const INITI_STATE = { 
                            firstname:"",lastname:"",email:"",currentUsername:userLoginState.username,newPassword:"",
                            currentPassword:"",confirmNewPassword:"", edited:false,isLoading:false,
                            isRequestError:false, age:"",message: "",isRequestSuccessful:false,
                            isPasswordUpdateRequestSuccessful:JSON.parse(window.localStorage.getItem(
                            "isPasswordUpdateRequestSuccessful"))||false,
                            isEmailUpdateRequestSuccessful:JSON.parse(window.localStorage.getItem(
                              "isEmailUpdateRequestSuccessful"))||false
                            ,openFirstname:false,openLastname:false,
                            openAge:false,opeUsername:false,
                            openNewPassword:false,
                            AccountDeleted:false,OTP:'',passwordVisible:false,
                            newPasswordVisible:false,confirmPasswordVisible:false,
                            isActivateSecurityQuestions:false,                            
       }
      const[profile, dispatchProfile] = React.useReducer((state, action)=>{
              return {...state,...action}

          },
          INITI_STATE
      );
      const[securityQuestions, dispatchSecurityQuestions] = React.useReducer((state, action)=>{return{state,...action}},
      {isRequestError:false,message:'',  isLoading:false,isRequestSuccessful:false, data:[]})

     React.useEffect(()=>{

        let isMounted = true;
        const controller = new AbortController();
          const getUser= async()=>{
            const results = await  User(useAxiosPrivate,controller,userLoginState.username);
            isMounted&&dispatchLogin({type:"UPDATE_DETAILS",...results});
          }
          getUser();
          

        return ()=>{
          isMounted=false; 
          controller.abort();
        }

     },[])
      
      
      const dependences=[profile.isPasswordUpdateRequestSuccessful,profile.isEmailUpdateRequestSuccessful,
                         profile.firstname, profile.lastname, profile.age,profile.currentUsername]
      React.useEffect(()=>{
                window.localStorage.setItem("isPasswordUpdateRequestSuccessful",
                JSON.stringify(profile.isPasswordUpdateRequestSuccessful));
                window.localStorage.setItem("isEmailUpdateRequestSuccessful",
                JSON.stringify(profile.isEmailUpdateRequestSuccessful));

                if(profile.isRequestSuccessful){
                   dispatchLogin({
                      type:"UPDATE_DETAILS",
                      firstname:profile.firstname,
                      lastname:profile.lastname,
                      age:profile.age,
                      username:profile.username,
                  })
                 
                }


       }, dependences);


      const [dateType, setDateType]= React.useState("text");
        
      const isInvalid =()=>{
        return (
          profile.email.trim() === ""&& profile.newPassword.trim() === "" && profile.confirmNewPassword === ""&&
          profile.firstname.trim() === ""&&profile.lastname.trim() === "" && 
          profile.age.trim() === ""&&profile.OTP !== ""
         )

      }
      const checkIsSecurityQuestionsValid = ()=> securityQuestions.data?.every(({number})=>{
        const value =  profile[`question${number}`];
        return !(value===undefined || value===null|| value?.trim() ==='');
      })

      const isUpdateNoneSecurityFields =()=>{
          return (profile.firstname?.trim() !== ""|| profile.lastname?.trim() !== ""  ||profile.age?.trim() !== "" )
        
        }
        const isUpdateSecurityFields =()=>{
          return (profile.email?.trim() !== ""||(profile.newPassword?.trim() !== "" 
          &&profile.confirmNewPassword !== ""&&profile.OTP !== "")
        )
        }
        

        const OnSubmitSecurity =(e,{type})=>{
            console.log(profile)
            e.preventDefault();
            if(isInvalid()){
              dispatchProfile({isRequestError:true, message:"At least one field  is required", isRequestSuccessful:false});
            }
            if(profile.isPasswordUpdateRequestSuccessful ||profile.isEmailUpdateRequestSuccessful){
                if(!(profile.confirmNewPassword.trim()===profile.newPassword.trim())){
                  dispatchProfile({isRequestError:true, message:"new password a and confim password must be equal",
                  isRequestSuccessful:false});
    
               }
              
               else if(!isUpdateSecurityFields()){
                  dispatchProfile({isRequestError:true, message:"At least one editable field  is required", isRequestSuccessful:false});
               }else{


                changeSecuirity( useAxiosPrivate,{currentUsername:userLoginState.username,username:profile.username,
                                 password:profile.currentPassword,OTP:parseInt(profile.OTP)},dispatchProfile)
                  
               }

            }
            else{
                  if(type==='change-email'){
                      
                      if(checkIsSecurityQuestionsValid()){

                        const answers = securityQuestions.data?.map(({number})=>{
                    
                          return{username:profile.username,answer:profile[`question${number}`], number:number};
                        });
                        requestSecuirityChangeEmail({ useAxiosPrivate,currentUsername:userLoginState.username,
                           userAnswers:answers, dispatchResponse:dispatchProfile ,});
                    }
                    else {
                      
                        dispatchSecurityQuestions({message:"All security questions must be answered",isRequestError:true, isRequestSuccessful:false})
                      
                    }
                  }
                  if(type==='change-password') {
                    requestSecuirityChangePassword({ useAxiosPrivate,username:userLoginState.username, dispatchResponse:dispatchProfile });
                  }
          
            
            }
              
        }
       
       

      /**
         * Save security answers of security questions
         * @param {*} e  save security answer event
         */
     const OnSubmitSecurityQuestions =async(e)=>{
      e.preventDefault();
     

      if(checkIsSecurityQuestionsValid()){
            const answers = securityQuestions.data?.map(({number})=>{
                        
              return{username:userLoginState.username,answer:profile[`question${number}`], number:number};
          });
         
          const results=await ActivateSecuirityQuestions(useAxiosPrivate,answers,dispatchSecurityQuestions);
          if(results.isRequestSuccessful){
             dispatchLogin({type:"UPDATE_DETAILS",isSecurityEnabled:true})
             
          }else{
            dispatchSecurityQuestions(results);
          }
      }
      else{
        dispatchSecurityQuestions({message:"All security questions must be answered",isRequestError:true, isRequestSuccessful:false})
      }

    }
        /**
         * Saves edited user field(s) that are not used as security
         * @param {*} e  save edit field event
         */
        const OnSubmitNoneSecurity=(e)=>{
          e.preventDefault();
          //we will finish this tomorrow
          const answers = securityQuestions.data?.map(({number})=>{
                      
            return{username:userLoginState.username,answer:profile[`question${number}`], number:number};
          })
          if(isInvalid()){
               dispatchProfile({isRequestError:true, message:"At least one field  is required",isRequestSuccessful:false});
           }
           else if(!isUpdateNoneSecurityFields()){
                dispatchProfile({isRequestError:true, message:"At least one editable field  is required",isRequestSuccessful:false});
           }
           else{
                UpdateUser(useAxiosPrivate ,profile, dispatchProfile);
              if(profile.edited){
                          ClearForm();

                }else if(profile.isRequestError){
                      dispatchProfile({ edited:false});
                }
            }


        }
      


        const deleteAccount =(e)=>{
          e.preventDefault();
          if(profile.currentPassword.trim() === ""){

               dispatchProfile({isRequestError:true, message:"Current password of user is required.",
               isRequestSuccessful:false});
               return;
          }
           
           DeleteUser(useAxiosPrivate,profile.currentPassword, userLoginState.username,dispatchProfile);
        }
        const ClearForm= ()=>{
          setTimeout(()=>{
              dispatchProfile({firstname:"",lastname:"",email:"",newPassword:"",
              currentPassword:"",confirmNewPassword:"", edited:false, age:"",
              openFirstname:false,openLastname:false,openAge:false,opeUsername:false,openNewPassword:false,
              isRequestError:false, message:""})
          },200)
        }
        React.useEffect(()=>{
            setTimeout(()=>{
              if(profile.AccountDeleted){
                window.localStorage.removeItem('access_token');
                dispatchLogin({type:"LOGOUT"})
                window.localStorage.clear()
                 
      
             }}, 5000);
        
        },[profile.AccountDeleted])
      


      return (

      <ProfileContext.Provider value={{profile, dispatchProfile,securityQuestions, dispatchSecurityQuestions,
         deleteAccount,OnSubmitSecurity,OnSubmitSecurityQuestions}}>
     <Box
     
      sx={{   
        display:{sm:'block', md:"flex"} ,backgroundColor:'#ffffff',
        justifyContent:"center", alignItems:"start",minHeight:"70vh",
          
      }}
     >
          <Card sx={{ maxWidth: 600,display:"block",boxShadow:"none", }}>
          <CardHeader
                title={<Stack
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                          flowdirection="row"
                          spacing={2}>
                              <Avatar
                              sx={{ bgcolor:deepOrange[500]}}
                              >
                                <CustomerTypography sx={{ textAlign: "center",fontSize:"0.7rem"}}>   {
                                    userLoginState.firstname && userLoginState.lastname  &&
                                  `${userLoginState.roles[0].name}`
                                  }
                                </CustomerTypography>
                              </Avatar>
                      </Stack>
                      }
                titleTypographyProps={{color:PRIMAR_COLOR,align:"center"}}
                subheader={(profile.isRequestSuccessful ||profile.isRequestError)?profile.message:""}
                subheaderTypographyProps={{alignItems:"center" ,color:profile.isRequestSuccessful?SUCCESS_COLOR:ERROR_COLOR}}
                
            />
            <CardContent>            
              <form className="register-inputs" autoComplete="off">
                <EditUserItem
                              IsEditFieldOpen={profile.openFirstname}
                              field={"openFirstname"}
                              setIsEditFieldOpen={ dispatchProfile}
                              editIconProps={{color:SECONDARY_COLOR,}}
                              componentLabel={"Firstname"}
                              componentValue={userLoginState.firstname}
                             
                              editable={true}
                              variant="outlined"
                              helpertext=""id="firstname"
                              label="Firstname"
                              type="text" 
                              className="firstname-input" 
                              placeholder="enter firstname"
                              value={profile.firstname}
                              onChange={(e)=> dispatchProfile({firstname:e.target.value,isRequestSuccessful:false,isRequestError:false})}
                          />
                          <EditUserItem
                              IsEditFieldOpen={profile.openLastname}
                              field={"openLastname"}
                              setIsEditFieldOpen={ dispatchProfile}
                              editIconProps={{color:SECONDARY_COLOR,}}
                              componentLabel={"Lastname"}                                   
                              componentValue={userLoginState.lastname}
                              editable={true}
                              variant="outlined"
                              helpertext=""
                               id="lastname"label="Lastname" color="secondary"
                              type="text" className="lastname-input" placeholder="enter lastname" value={profile.lastname}
                              onChange={(e)=> dispatchProfile({lastname:e.target.value ,isRequestSuccessful:false,isRequestError:false})}
                          />

                        
                          <EditUserItem
                              IsEditFieldOpen={profile.openAge}
                              field={"openAge"}
                              setIsEditFieldOpen={ dispatchProfile}
                              editIconProps={{color:SECONDARY_COLOR,}}
                              componentLabel={"Date of Birth"}                
                              componentValue={userLoginState.age&&(new Date(parseInt(userLoginState.age))).toLocaleDateString('en-CA', 
                              {year: 'numeric', month: '2-digit', day: '2-digit'})}
                              variant="outlined"
                              helpertext=""
                              editable={true}
                              id="age"
                              label="Date of Birth"
                              onClick={()=>setDateType("date")}
                              onBlur={()=>{setDateType("text");}}
                              type={dateType} className="age-input" placeholder="enter date of birth" value={profile.age}
                              onChange={(e)=> dispatchProfile({age:e.target.value,isRequestSuccessful:false,isRequestError:false})}
                          />
                  <EditButton  color="secondary" variant="outlined" style={{marginTop:"15px"}}
                                        onClick={(e)=>OnSubmitNoneSecurity(e)}>
                                          Update
                  </EditButton>
                
          </form>
          </CardContent>
          </Card>

          <Security />
      </Box>  
      </ProfileContext.Provider>
      );
}
export default  Profile;
