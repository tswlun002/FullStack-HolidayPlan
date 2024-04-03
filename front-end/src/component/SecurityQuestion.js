import * as React from 'react';
import Card from '@mui/material/Card';
import {CardHeader,Typography,IconButton, } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import {CreateAuthContext} from '../context/CreateAuthContext';
import UseAxiosPrivate from '../utils/UseAxiosPrivate'
import CssTextField from '../component/CssTextField'
import { ProfileContext } from '../context/ProfileContext';
import {FetchSecuirityQuestions} 
   from '../utils/User';
import { styled } from '@mui/material/styles';
import { SECONDARY_COLOR ,PRIMAR_COLOR, SUCCESS_COLOR, ERROR_COLOR} from '../utils/Constant';
import CloseIcon from '@mui/icons-material/Close';
const EditButton= styled(LoadingButton)({
  '&:hover': {
  border:`1px solid ${SECONDARY_COLOR}`,
  },
  '&.Mui-focused': {
  border:`1px solid ${SECONDARY_COLOR}`,
  },
});
const SecurityQuestions=({submitType,label="Submit"})=>{
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
                  variant={"subtitle2"}
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
                   <EditButton
                      color="secondary" 
                      variant="outlined" 
                      style={{marginTop:"15px"}}
                      onClick={(e)=>{OnSubmitSecurityQuestions(e,submitType)}}>
                      {label}
                  </EditButton>
                }
          </form>
          </Card>
        )
      }
      export default SecurityQuestions;