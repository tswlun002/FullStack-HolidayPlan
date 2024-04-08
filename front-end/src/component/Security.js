import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button ,CardHeader,Typography,IconButton,Chip, } from '@mui/material';
import {CreateAuthContext} from '../context/CreateAuthContext';
import CssTextField from '../component/CssTextField'
import { ProfileContext } from '../context/ProfileContext';
import EditUserItem from '../component/EditUserItem';
import { styled } from '@mui/material/styles';
import { SECONDARY_COLOR ,PRIMAR_COLOR} from '../utils/Constant';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InputAdornment from '@mui/material/InputAdornment';
import EditAttributesIcon from '@mui/icons-material/EditAttributes';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import SecurityQuestions from './SecurityQuestion';
const DeleteButton= styled(Button)({
            '&:hover': {
            border:"1px solid red",
            },
            '&.Mui-focused': {
            border:"1px solid red",
            },
});
       
          
const Security =  ()=>{
            const{userLoginState} = React.useContext(CreateAuthContext);
            const{profile, dispatchProfile, OnSubmitSecurity, deleteAccount,FetchSecurityQuestions} = React.useContext(ProfileContext);
            const showOTP=profile.isPasswordUpdateRequestSuccessful || profile.isEmailUpdateRequestSuccessful||profile.isDeleteAccountRequestSuccessful;
            const answerSecurityQuestions= ((userLoginState.isSecurityEnabled)&&(profile.isEmailUpdateRequestSuccessful||profile.isDeleteAccountRequestSuccessful));
            const addAnswerSecurityQuestions= (!(userLoginState.isSecurityEnabled)&&(profile.isActivateSecurityQuestions));
          
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
                                dataField={"email"}
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
                { showOTP&&
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
                                dataField={"newPassword"}
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
                            onClick={()=>FetchSecurityQuestions()}
                        >
                          Click to activate security question to secure account
                        </Button>
                    }  

                    {                               
                     addAnswerSecurityQuestions&&
                        <SecurityQuestions label='Activate'  submitType={'ACTIVATE_QUESTIONS'}/>
                    }   
                          
                    {
                      answerSecurityQuestions&&
                       <SecurityQuestions label='Submit' submitType={'ANSWER_QUESTIONS'} showSubmitButton={!profile.isDeleteAccountRequestSuccessful}/>
                    }
                    { (userLoginState.isAuthenticated&&userLoginState.roles.find(role=>role.name==='USER')) &&
                    <DeleteButton
                        disabled={profile.isLoading}
                        sx={{ marginTop:"10px", color:"black", borderColor:"white"}}
                        variant="outlined" size="small"
                        onClick={(e)=>deleteAccount(e,profile.isDeleteAccountRequestSuccessful?"Delete":"Request")}
                    >
                      {profile.isLoading?"processing...":"delete  account"}
                    </DeleteButton>}
                  
                </CardContent>            
            </Card>
            )
}

export default Security;