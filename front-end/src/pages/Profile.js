import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardHeader, Box,Stack, } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import {Avatar} from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import {CreateAuthContext} from '../context/CreateAuthContext';
import UseAxiosPrivate from '../utils/UseAxiosPrivate'
import CustomerTypography from '../component/CustomerTypography';
import { ProfileContext } from '../context/ProfileContext';
import {UpdateUser,DeleteUser,RequestDeleteUserAccount,changePassword,changeEmail,
      requestSecuirityChangeEmail, requestSecuirityChangePassword,
      ActivateSecuirityQuestions, User} from '../utils/User';
import EditUserItem from '../component/EditUserItem';
import { styled } from '@mui/material/styles';
import { SECONDARY_COLOR ,PRIMAR_COLOR, SUCCESS_COLOR, ERROR_COLOR} from '../utils/Constant';

import Security from '../component/Security';
import { extractFromLocalStorage, setToLocalStorage } from '../utils/LocalStorage';
const EditButton= styled(LoadingButton)({
  '&:hover': {
  border:`1px solid ${SECONDARY_COLOR}`,
  },
  '&.Mui-focused': {
  border:`1px solid ${SECONDARY_COLOR}`,
  },
});




const Profile =  ()=> {
      const useAxiosPrivate = UseAxiosPrivate();
      const{userLoginState,dispatchLogin} = React.useContext(CreateAuthContext);
      const INITI_STATE = { 
                            firstname:"",lastname:"",email:"",currentUsername:userLoginState.username,newPassword:"",
                            currentPassword:"",confirmNewPassword:"", edited:false,isLoading:false,
                            isRequestError:false, age:"",message: "",isRequestSuccessful:false,
                            isPasswordUpdateRequestSuccessful:extractFromLocalStorage("isPasswordUpdateRequestSuccessful")||false,
                            isEmailUpdateRequestSuccessful:extractFromLocalStorage("isEmailUpdateRequestSuccessful")||false
                            ,openFirstname:false,openLastname:false,
                            openAge:false,opeUsername:false,
                            openNewPassword:false,
                            AccountDeleted:false,OTP:'',passwordVisible:false,
                            newPasswordVisible:false,confirmPasswordVisible:false,
                            isActivateSecurityQuestions:false,questions:{},
                            isPersonalDetailsChange:extractFromLocalStorage("isPersonalDetailsChange")||false,
                            isDeleteAccountRequestSuccessful:extractFromLocalStorage("isDeleteAccountRequestSuccessful")||false
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
            const results = await User(useAxiosPrivate,controller,userLoginState.username);
            isMounted&&dispatchLogin({type:"UPDATE_DETAILS",...results});
          }
          getUser();
          

        return ()=>{
          isMounted=false; 
          controller.abort();
        }

     },[])
      
      
      const dependences=[profile.isPersonalDetailsChange,profile.currentUsername]
      React.useEffect(()=>{
                setToLocalStorage("isPasswordUpdateRequestSuccessful",profile.isPasswordUpdateRequestSuccessful);
                setToLocalStorage("isEmailUpdateRequestSuccessful",profile.isEmailUpdateRequestSuccessful);
                if(profile.isRequestSuccessful && (!profile.isPasswordUpdateRequestSuccessful)){
                   dispatchLogin({
                      type:"UPDATE_DETAILS",
                      firstname:profile.firstname||userLoginState.firstname,
                      lastname:profile.lastname||userLoginState.lastname,
                      age:profile.age||userLoginState.age,
                      username:profile.currentUsername||userLoginState.username,
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
                  dispatchProfile({isRequestError:true, message:"new password and confirmed password must be equal",
                  isRequestSuccessful:false});
    
               }
              
               else if(!isUpdateSecurityFields()){
                  dispatchProfile({isRequestError:true, message:"At least one editable field  is required for update.", isRequestSuccessful:false});
               }else{


                changePassword( useAxiosPrivate,{currentUsername:profile.currentUsername,
                                 newPassword:profile.newPassword,OTP:parseInt(profile.OTP)},dispatchProfile)
                  
               }

            }
            else{
                  if(type==='change-email'){
                      
                      if(checkIsSecurityQuestionsValid()){

                        const answers = securityQuestions.data?.map(({number})=>{
                    
                          return{username:profile.username,answer:profile[`question${number}`], number:number};
                        });
                        requestSecuirityChangeEmail({ useAxiosPrivate,username:userLoginState.username,
                                                      newUsername:profile.email,
                                                    dispatchResponse:dispatchProfile});
                    }
                    else {
                      
                        dispatchSecurityQuestions({message:"All the security questions must be answered",isRequestError:true, isRequestSuccessful:false})
                      
                    }
                  }
                  if(type==='change-password') {
                        requestSecuirityChangePassword({
                        useAxiosPrivate,
                        username:userLoginState.username,
                        password:profile.newPassword,
                        dispatchResponse:dispatchProfile
                     });
                  }
          
            
            }
              
        }
       
       

     /**
     * Save security answers of security questions
     * @param {*} e  save security answer event
     */
     const OnSubmitSecurityQuestions =async(e,submitType)=>{
      e.preventDefault();
     

      if(checkIsSecurityQuestionsValid()){

          if(submitType==="ACTIVATE_QUESTIONS"){
               const answers = securityQuestions.data?.map(({number})=>{
                     return{username:userLoginState.username,answer:profile[`question${number}`], number:number};
                 });
              const results=await ActivateSecuirityQuestions(useAxiosPrivate,answers,dispatchSecurityQuestions);
              if(results.isRequestSuccessful){
                 dispatchLogin({type:"UPDATE_DETAILS",isSecurityEnabled:true})

              }else{
                dispatchSecurityQuestions(results);
              }
          }else if(submitType==="ANSWER_QUESTIONS"){
                 const answers = {}
                 profile.questions?.forEach(({question, number})=>{
                       answers[question]=profile[`question${number}`];
                  });
                 changeEmail(useAxiosPrivate,{username:profile.currentUsername,newUsername:profile.email,answers:answers,OTP:profile.OTP},dispatchProfile);
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
      

       /**
        * Deletes the profile of the  
        * @param {*} e  submit event of the delete button
        */
        const deleteAccount =async(e,status)=>{
          const DELETE_ACCOUNT_STATUS=["Request","Delete"]
          e.preventDefault();
          if(status===DELETE_ACCOUNT_STATUS[0]){
             RequestDeleteUserAccount(useAxiosPrivate, userLoginState.username,dispatchProfile);
          }
          else if(status===DELETE_ACCOUNT_STATUS[1]){
            if(profile.OTP.trim() === ""){

              dispatchProfile({isRequestError:true, message:"OTP is required, it was sent to your email.",
              isRequestSuccessful:false});
              
            }
            else{
               const answers = securityQuestions.data?.map(({number})=>{
                     return{username:userLoginState.username,answer:profile[`question${number}`], number:number};
                });
              DeleteUser(useAxiosPrivate,deleteAccount={username:userLoginState.username,OTP:profile.OTP,answers:answers},
                dispatchProfile,dispatchLogin);

            }

          }
         
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
                              dataField={"firstname"}
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
                              onChange={(e)=> dispatchProfile({firstname:e.target.value,isRequestSuccessful:false,isRequestError:false,isPersonalDetailsChange:false})}
                          />
                          <EditUserItem
                              IsEditFieldOpen={profile.openLastname}
                              field={"openLastname"}
                              dataField={"lastname"}
                              setIsEditFieldOpen={ dispatchProfile}
                              editIconProps={{color:SECONDARY_COLOR,}}
                              componentLabel={"Lastname"}                                   
                              componentValue={userLoginState.lastname}
                              editable={true}
                              variant="outlined"
                              helpertext=""
                               id="lastname"label="Lastname" color="secondary"
                              type="text" className="lastname-input" placeholder="enter lastname" value={profile.lastname}
                              onChange={(e)=> dispatchProfile({lastname:e.target.value ,isRequestSuccessful:false,isRequestError:false,isPersonalDetailsChange:false})}
                          />

                        
                          <EditUserItem
                              IsEditFieldOpen={profile.openAge}
                              field={"openAge"}
                              dataField={"age"}
                              setIsEditFieldOpen={ dispatchProfile}
                              editIconProps={{color:SECONDARY_COLOR,}}
                              componentLabel={"Date of Birth"}                
                              componentValue={
                                    userLoginState.age
                              }
                              variant="outlined"
                              helpertext=""
                              editable={true}
                              id="age"
                              label="Date of Birth"
                              onClick={()=>setDateType("date")}
                              onBlur={()=>{setDateType("text");}}
                              type={dateType} className="age-input" placeholder="enter date of birth" value={profile.age}
                              onChange={(e)=> dispatchProfile({age:e.target.value,isRequestSuccessful:false,isRequestError:false,isPersonalDetailsChange:false})}
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
