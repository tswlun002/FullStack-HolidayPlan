import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button ,CardHeader, Box,Stack} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import {CreateAuthContext} from '../context/CreateAuthContext';
import UseAxiosPrivate from '../utils/UseAxiosPrivate'
import CssTextField from '../component/CssTextField'
import CustomerTypography from '../component/CustomerTypography'
import {UpdateUser,DeleteUser} from '../utils/User';
import AccountButton from '../component/AccountButton';
import EditUserItem from '../component/EditUserItem'
import { styled } from '@mui/material/styles';
import { SECONDARY_COLOR ,PRIMAR_COLOR} from '../utils/Constant';
const DeleteButton= styled(Button)({
  '&:hover': {
  border:"1px solid red",
  },
  '&.Mui-focused': {
  border:"1px solid red",
  },
});
const EditButton= styled(Button)({
  '&:hover': {
  border:`1px solid ${SECONDARY_COLOR}`,
  },
  '&.Mui-focused': {
  border:`1px solid ${SECONDARY_COLOR}`,
  },
});
const Profile = ()=> {
      const useAxiosPrivate = UseAxiosPrivate();

      const{userLoginState} = React.useContext(CreateAuthContext)

      const[profile, dispatchProfile] = React.useReducer((state, action)=>{
              return {...state,...action}

          },
          {
            firstname:"",lastname:"",email:"",currentUsername:userLoginState.username,newPassword:"",
            currentPassword:"",confirmNewPassword:"", edited:false,
            isEditError:false, age:"",errorMessage: "",isRequestSucceeded:false, requestResponseMessage:""
            ,openFirstname:false,openLastname:false,openAge:false,opeUsername:false,openNewPassword:false
          }
      );


      const [dateType, setDateType]= React.useState("text");

       
       const OnSubmit =(e)=>{
           e.preventDefault();
           if(!(profile.confirmNewPassword.trim()===profile.newPassword.trim())){
              dispatchProfile({isEditError:true, errorMessage:"new password a and confim password must be equal"});

           }
           else if(profile.email.trim() === ""&& profile.newPassword.trim() === "" &&  profile.firstname.trim() === ""&&
             profile.lastname.trim() === "" &&profile.currentPassword.trim() === ""&&profile.age.trim() === "" 
             ){

               dispatchProfile({isEditError:true, errorMessage:"At least one field  is required"});
           }else{

              if(profile.currentPassword.trim()!==''){
                    UpdateUser(useAxiosPrivate ,profile, dispatchProfile);
              }
              else{
                    dispatchProfile({isEditError:true, errorMessage:"Current password is required"});
              }
           }

             if(profile.edited){
                        ClearForm();

                  }else if(profile.isEditError){
                        dispatchProfile({currentPassword:"", edited:false});
                  }


       }

        const[userAccount, dispatchUserAccount]  = React.useReducer((state, action)=>{return {state, ...action}}, {isDeleted:false,
                                                                                  errorMessage: "",
                                                                                  isRequestSucceeded:false,
                                                                                  requestResponseMessage:""})

        const deleteAccount =(e)=>{
            e.preventDefault();
           DeleteUser(useAxiosPrivate,userLoginState.email,dispatchUserAccount);
        }
        const ClearForm= ()=>{
          setTimeout(()=>{
              dispatchProfile({firstname:"",lastname:"",email:"",newPassword:"",
              currentPassword:"",confirmNewPassword:"", edited:false, age:"",
              openFirstname:false,openLastname:false,openAge:false,opeUsername:false,openNewPassword:false,
              isEditError:false, errorMessage:""})
          },200)
        }



      return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Card sx={{ maxWidth: 400,display:"block"}}>
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
              titleTypographyProps={{align:"center",color:PRIMAR_COLOR,align:"center"}}
              subheader={(profile.isLoginError ||profile.isEditError)?profile.errorMessage:
                          profile.isRequestSucceeded?profile.requestResponseMessage:""
              }
              subheaderTypographyProps={{align:"start" ,color:profile.isLoginError?"red":"green"}}
              
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
                            focus
                            variant="outlined"
                            helpertext=""id="demo-helper-text-aligned"
                            label="Firstname"
                            type="text" 
                            className="firstname-input" 
                            placeholder="enter firstname"
                            value={profile.firstname}
                            onChange={(e)=> dispatchProfile({firstname:e.target.value,isLoginError:false,isRequestSucceeded:false})}
                        />
                        <EditUserItem
                            IsEditFieldOpen={profile.openLastname}
                            field={"openLastname"}
                            setIsEditFieldOpen={ dispatchProfile}
                            editIconProps={{color:SECONDARY_COLOR,}}
                            componentLabel={"Lastname"}                                   
                            componentValue={userLoginState.lastname}
                            focus
                            variant="outlined"
                            helpertext="" id="demo-helper-text-aligned"label="Lastname" color="secondary"
                            type="text" className="lastname-input" placeholder="enter lastname" value={profile.lastname}
                            onChange={(e)=> dispatchProfile({lastname:e.target.value ,isLoginError:false,isRequestSucceeded:false})}
                        />

                        <EditUserItem
                            IsEditFieldOpen={profile.opeUsername}
                            field={"opeUsername"}
                            setIsEditFieldOpen={ dispatchProfile}
                            editIconProps={{color:SECONDARY_COLOR,}}
                            componentLabel={"Email"}
                                    
                            componentValue={userLoginState.username}
                            focus
                            variant="outlined"
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="Email"
                            type="text" className="email-input" placeholder="enter email" value={profile.email}
                            onChange={(e)=> dispatchProfile({email:e.target.value,isLoginError:false,isRequestSucceeded:false })}
                          />
                        <EditUserItem
                            IsEditFieldOpen={profile.openAge}
                            field={"openAge"}
                            setIsEditFieldOpen={ dispatchProfile}
                            editIconProps={{color:SECONDARY_COLOR,}}
                            componentLabel={"Date of Birth"}                
                            componentValue={userLoginState.age&&(new Date(parseInt(userLoginState.age))).
                              toLocaleDateString('en-CA', {year: 'numeric', month: '2-digit', day: '2-digit'})}
                            focus
                            variant="outlined"
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="Date of Birth"
                            onClick={()=>setDateType("date")}
                            onBlur={()=>{setDateType("text");}}
                            type={dateType} className="age-input" placeholder="enter date of birth" value={profile.age}
                            onChange={(e)=> dispatchProfile({age:e.target.value,isLoginError:false,isRequestSucceeded:false})}
                        />
                        <EditUserItem
                            IsEditFieldOpen={profile.openNewPassword}
                            field={"openNewPassword"}
                            setIsEditFieldOpen={ dispatchProfile}
                            editIconProps={{color:SECONDARY_COLOR,}}
                            componentLabel={"Password"}
                            componentValue={"******"}
                            variant="outlined"
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="New-password"
                            color="secondary"
                            type="password" autoComplete='new-password' className="new-password-input"
                            placeholder="Enter new password" value={profile.newPassword}
                            onChange={(e)=>dispatchProfile({newPassword:e.target.value, isEditError:false})}
                        />
                        {profile.openNewPassword&&<CssTextField
                            required
                            variant="outlined"
                            id="demo-helper-text-aligned"
                            label="Confirm-new-password"
                            color="secondary"
                            type="password" autoComplete='new-password' className="confirm-new-password-input" 
                            placeholder="Confirm new password" value={profile.confirmNewPassword}
                            onChange={(e)=>dispatchProfile({confirmNewPassword:e.target.value, isEditError:false})}
                        />}
                        <CssTextField
                            required
                            variant="outlined"
                            helpertext=""
                            id="demo-helper-text-aligned"
                            label="Current password"
                            color="secondary"
                            type="password" 
                            autoComplete='new-password' 
                            className="currentPassword-input" 
                            placeholder="current password" 
                            value={profile.currentPassword}
                            onChange={(e)=> dispatchProfile({currentPassword:e.target.value, isLoginError:false, isRequestSucceeded:false})}
                        />

                <EditButton  color="secondary" variant="outlined" style={{marginTop:"15px"}}
                                      onClick={(e)=>OnSubmit(e)}>Update</EditButton>
              <DeleteButton
                   sx={{ marginTop:"10px", color:"black", borderColor:"white"}}
                   variant="outlined" size="small"
                   onClick={(e)=>deleteAccount(e)}
              >
                                    delete  account
              </DeleteButton>
        </form>
        </CardContent>
        </Card>
      </Box>
      );
}
export default  Profile;
