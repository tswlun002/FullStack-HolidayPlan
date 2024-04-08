import axios from "./Axios"
/**
 * 
 * @param {*} user is the user to be registered
 */
 const getErrorMessage = (response)=>{
      return response.response?.data?.error_message?
      response.response.data.error_message:response.response.data?.message?
      response.response.data.message :response.response.statusText;

 }
export const RegisterUser = ({firstname,lastname,email,password,age,userType},dispatchRegister) => {

   //dispatchRegister({registered:true})
  const username=email.replace('/','-');
   const API = '/holiday-plan/api/authenticate/register';
   dispatchRegister({isLoading:true})
   axios.post(API,{firstname,lastname,username,password,age, usertype:userType})
   .then(response =>
       {
         if(response.ok || response.status===200){
           dispatchRegister({
               registered : true,
               isRegisterError:false,
               isLoading:false
            });
   
         }
       }
   ).catch(err => 
     {
        if(!err?.response.ok){
             let errorMessage =null;
             if(err.response.status===404){

                errorMessage  =getErrorMessage(err)||"Invalid credentials";
               }
               else if(err.response.status===401){
                    errorMessage  =getErrorMessage(err)||"Denied access";
             }
             else{
                   
                   errorMessage  = getErrorMessage(err);
             }
             dispatchRegister({errorMessage:errorMessage,isRegisterError:true,  isLoading:false,registered:false})
        }else dispatchRegister({errorMessage:"Server Error", isRegisterError:true,  isLoading:false,registered:false})
 
     }
   )
}
export const resetPassword=({username,OTP,newPassword,confirmPassword},dispatchResponse)=>{
  const API = `/holiday-plan/api/authenticate/reset-password`;
  dispatchResponse({  isLoading:true});
    axios.post(API,{username,OTP,newPassword,confirmPassword})
    .then(response =>
        {
          if(response.ok || response.status===200){
          
            dispatchResponse({isRequestError:false,isLoading:false,isRequestSuccessful:true,
            message:response.data});

          }

        }
    ).catch(err =>
      {
         if(!err?.response.ok && err.name!=="AbortErr"){
              let errorMessage =null;
              if(err.response.status===404){

                errorMessage  =getErrorMessage(err)||"Invalid credentials";
              }
              else if(err.response.status===401){
                   errorMessage  =getErrorMessage(err)||"Denied access";
              }
              else{

                    errorMessage  = getErrorMessage(err);
              }
              dispatchResponse({isRequestError:true,  isLoading:false,isRequestSuccessful:false, message:errorMessage})
         }else dispatchResponse({isRequestError:true,  isLoading:false,isRequestSuccessful:false, message:"Internal server error"})

      }
    )

}
export const resetPasswordRequest=(username,password,dispatchResponse)=>{
   const API = `/holiday-plan/api/authenticate/password-reset-request`;
   dispatchResponse({  isLoading:true});
    axios.put(API,{username:username,password:password})
     .then(response =>
         {
           if(response.ok || response.status===200){
             dispatchResponse({isRequestError:false,passwordResetRequestSuccessful:true,
              isLoading:false,message:response.data.message});

           }

         }
     ).catch(err =>
       {
          if(!err?.response.ok && err.name!=="AbortErr"){
               let errorMessage =null;
               if(err.response.status===404){

                 errorMessage  =getErrorMessage(err)||"Invalid credentials";
               }
               else if(err.response.status===401){
                    errorMessage  =getErrorMessage(err)||"Denied access";
               }
               else{

                     errorMessage  = getErrorMessage(err);
               }
               dispatchResponse({isRequestError:true, passwordResetRequestSuccessful:false,isLoading:false,message:errorMessage})
          }else dispatchResponse({isRequestError:true,passwordResetRequestSuccessful:false, isLoading:false,message:"Internal server error"})

       }
     )

}

export const requestSecuirityChangePassword=({useAxiosPrivate,username='',password='',dispatchResponse=()=>{}})=>{

  const API = '/holiday-plan/api/user/update/password-change-request';
   dispatchResponse({  isLoading:true});
    useAxiosPrivate.put(API,{username:username,password:password})
    .then(response =>
        {
          if(response.ok || response.status===200){
            dispatchResponse({
              isRequestError:false,isPasswordUpdateRequestSuccessful:true,  
              isLoading:false,isRequestSuccessful:true,
              message:response.data
            });

          }

        }
    ).catch(err =>
      {
         if(!err?.response.ok && err.name!=="AbortErr"){
              let errorMessage =null;
              if(err.response.status===404){

                errorMessage  =getErrorMessage(err)||"Invalid credentials";
              }
              else if(err.response.status===401){
                   errorMessage  =getErrorMessage(err)||"Denied access";
              }
              else{

                    errorMessage  = getErrorMessage(err);
              }
              dispatchResponse({isRequestError:true, passwordResetSucceful:false,
               isLoading:false,isRequestSuccessful:false, message:errorMessage})
         }else dispatchResponse({isRequestError:true,passwordResetSucceful:false,
          isLoading:false,isRequestSuccessful:false, message:"Internal server error"})

      }
    )

}
export const requestSecuirityChangeEmail=({useAxiosPrivate, username='',newUsername="",
                                dispatchResponse=()=>{}})=>{
   //
  const API = `/holiday-plan/api/user/update/username-change-request?username=${username}&newUsername=${newUsername}`;
    useAxiosPrivate.get(API)
    .then(response =>
        {
          if(response.ok || response.status===200){
            dispatchResponse({
              isRequestError:false,isEmailUpdateRequestSuccessful:true,  
              isLoading:false,isRequestSuccessful:true,
              questions:response.data?.questions,
              email:response.data?.username,
              message:response.data?.message?response.data.message:response.data
            });

          }

        }
    ).catch(err =>
      {
         if(!err?.response.ok && err.name!=="AbortErr"){
              let errorMessage =null;
              if(err.response.status===404){

                errorMessage  =getErrorMessage(err)||"Invalid credentials";
              }
              else if(err.response.status===401){
                   errorMessage  =getErrorMessage(err)||"Denied access";
              }
              else{

                    errorMessage  = getErrorMessage(err);
              }
              dispatchResponse({isRequestError:true, passwordResetSucceful:false,
               isLoading:false,isRequestSuccessful:false, message:errorMessage})
         }else dispatchResponse({isRequestError:true,passwordResetSucceful:false,
          isLoading:false,isRequestSuccessful:false, message:"Internal server error"})

      }
    )

}
export const changeEmail=( useAxiosPrivate,resetUsername={username:"",newUsername:"", answers:Map.arguments(), OTP:""},dispatchResponse)=>{
  const API ='/holiday-plan/api/user/security/change-username';
  dispatchResponse({  isLoading:true});
    useAxiosPrivate.patch(API,resetUsername)
    .then(response =>
        {
          if(response.ok || response.status===200){
            dispatchResponse({isRequestError:false,
              isLoading:false,isRequestSuccessful:true,
              message:response.data?.message,
              securityQuestions:response.data?.questions,
              currentUsername:resetUsername.newUsername,
              isEmailUpdateRequestSuccessful:false
            });
          }
        }
    ).catch(err =>
      {
         if(!err?.response.ok && err.name!=="AbortErr"){
              let errorMessage =null;
              if(err.response.status===404){

                errorMessage  =getErrorMessage(err)||"Invalid credentials";
              }
              else if(err.response.status===401){
                   errorMessage  =getErrorMessage(err)||"Denied access";
              }
              else{

                    errorMessage  = getErrorMessage(err);
              }
              dispatchResponse({isRequestError:true, passwordResetSucceful:false, isLoading:false,isRequestSuccessful:false, message:errorMessage})
         }else dispatchResponse({isRequestError:true,passwordResetSucceful:false,  isLoading:false,isRequestSuccessful:false, message:"Internal server error"})

      }
    )

}
export const changePassword=( useAxiosPrivate,resetPassword={currentUsername:"", newPassword:"", OTP:""},dispatchResponse)=>{
  const API ='/holiday-plan/api/user/security/change-password'
  dispatchResponse({  isLoading:true});
    useAxiosPrivate.patch(API,resetPassword)
    .then(response =>
        {
          if(response.ok || response.status===200){
            dispatchResponse({isRequestError:false,
              isLoading:false,isRequestSuccessful:true,
              message:response.data,
              isPasswordUpdateRequestSuccessful:false
            });

          }
        }
    ).catch(err =>
      {
         if(!err?.response.ok && err.name!=="AbortErr"){
              let errorMessage =null;
              if(err.response.status===404){

                errorMessage  =getErrorMessage(err)||"Invalid credentials";
              }
              else if(err.response.status===401){
                   errorMessage  =getErrorMessage(err)||"Denied access";
              }
              else{

                    errorMessage  = getErrorMessage(err);
              }
              dispatchResponse({isRequestError:true, passwordResetSucceful:false, isLoading:false,isRequestSuccessful:false, message:errorMessage})
         }else dispatchResponse({isRequestError:true,passwordResetSucceful:false,  isLoading:false,isRequestSuccessful:false, message:"Internal server error"})

      }
    )

}
export const ActivateSecuirityQuestions= ( useAxiosPrivate,answers=[{username:'', answer:'', number:0}],
                                          dispatchResponse=()=>{})=>{
    const API = `/holiday-plan/api/user/add-security-questions?username=${answers[0]?.username}`;
    dispatchResponse({  isLoading:true});
    return useAxiosPrivate.post(API,{answers:answers})
    .then(response =>
        {
          return (response.ok || response.status===200)?
           {isRequestError:false,  isLoading:false,isRequestSuccessful:true,...response.data}:{};
          

        }
    ).catch(err =>
      {
         if(!err?.response.ok && err.name!=="AbortErr"){
              let errorMessage =null;
              if(err.response.status===404){

                errorMessage  =getErrorMessage(err)||"Invalid credentials";
              }
              else if(err.response.status===401){
                   errorMessage  =getErrorMessage(err)||"Denied access";
              }
              else{

                    errorMessage  = getErrorMessage(err);
              }
             return{isRequestError:true,  isLoading:false,isRequestSuccessful:false, message:errorMessage}
         }else return({isRequestError:true, isLoading:false,isRequestSuccessful:false, message:"Internal server error"});

      }
    )

}
export const FetchSecuirityQuestions= async( useAxiosPrivate,dispatchResponse=()=>{})=>{
  const API = `/holiday-plan/api/user/security-questions/`;
  dispatchResponse({  isLoading:true});
    useAxiosPrivate.get(API)
    .then(response =>
        {
          if(response.ok || response.status===200){
            dispatchResponse({isRequestError:false,  isLoading:false,isRequestSuccessful:true, securityQuestions:response.data});
          }

        }
    ).catch(err =>
      {
         if(!err?.response.ok && err.name!=="AbortErr"){
              let errorMessage =null;
              if(err.response.status===404){

                errorMessage  =getErrorMessage(err)||"Invalid credentials";
              }
              else if(err.response.status===401){
                   errorMessage  =getErrorMessage(err)||"Denied access";
              }
              else{

                    errorMessage  = getErrorMessage(err);
              }
              dispatchResponse({isRequestError:true,  isLoading:false,isRequestSuccessful:false, message:errorMessage})
         }else dispatchResponse({isRequestError:true, isLoading:false,isRequestSuccessful:false, message:"Internal server error"})

      }
    )

}
export const RegisterAdmin = ({firstname,lastname,email,password, age,registered,userType},useAxiosPrivate, dispatchRegister) => {
    RegisterUser({firstname,lastname,email,password, age,registered,userType},useAxiosPrivate, dispatchRegister);
 }
export const FetchUsers = (useAxiosPrivate,dispatchUsers,controller) => {


   const API = '/holiday-plan/api/admin/user/users/';
   useAxiosPrivate.get(API, {signal:controller.signal})
   .then(response =>
       {
         if(response.ok || response.status===200){
           
           

         dispatchUsers({
               data:response.data,
               isDataAvailable : true,
               isRequestError:false
            });

         }


       }
   ).catch(err =>
     {
        
       
        if(!err?.response.ok && err.name!=="AbortErr"){
             let errorMessage =null;
             if(err.response.status===404){

               errorMessage  =getErrorMessage(err)||"Invalid credentials";
             }
             else if(err.response.status===401){
                  errorMessage  =getErrorMessage(err)||"Denied access";
             }
             else{
                   
                   errorMessage  = getErrorMessage(err);
             }
             dispatchUsers({errorMessage:errorMessage,
                                isDataAvailable : false,
                                isRequestError:true})
        }else dispatchUsers({errorMessage:"Server Error",
                                isDataAvailable : false,
                                isRequestError:true})

     }
   )

}



export const UpdateUser = (useAxiosPrivate,{firstname,lastname,age,currentUsername},dispatchRegister) => {

   //dispatchRegister({registered:true})
   let isMounted = true;
   const controller = new AbortController();

   const API = `/holiday-plan/api/user/update/none-security?firstname=${firstname}&lastname=${lastname}&age=${age}&currentUsername=${currentUsername}`;
   isMounted&& useAxiosPrivate.patch(API,{signal:controller.signal})
   .then(response =>
       {
         if(response.ok || response.status===200){
           dispatchRegister({isRequestError:false,isRequestSuccessful:true, message:response.data,isPersonalDetailsChange:true})

         }
         return ()=>{isMounted=false; controller.abort()}

       }
   ).catch(err =>
     {
        
        if(!err?.response.ok){
             let errorMessage =null;
             if(err.response.status===404){
              errorMessage  =getErrorMessage(err)||"Invalid credentials";
             }
             else if(err.response.status===401){
                  errorMessage  =getErrorMessage(err)||"Denied access";
             }
             else{
                  
                   errorMessage  = getErrorMessage(err);
             }
             dispatchRegister({isRequestError:true,isRequestSuccessful:false, message:errorMessage})
        }else dispatchRegister({isRequestError:true,isRequestSuccessful:false, message:"Internal server error"})

     }
   )
}


export const User = async(useAxiosPrivate,controller,username) => {

  const API = `/holiday-plan/api/user/${username}`;
   const response = await useAxiosPrivate.get(API, {signal:controller.signal,  validateStatus: function (status) {
      // if this function returns true, exception is not thrown, so
      // in simplest case just return true to handle status checks externally.
      return true;
  }})
  try{
      return (response.ok || response.status===302)?
      {isRequestError:false,isRequestSuccessful:true, isLoading:false, ...response.data}:{}
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
          return({message:message,isRequestError:true,isRequestSuccessful:false})
      }else return({message:"Server Error",isRequestError:true,isRequestSuccessful:false})
  }

    
  
}
export const RequestDeleteUserAccount = async(useAxiosPrivate,username,dispatchResponse)=>{

  const API = `/holiday-plan/api/user/request-to-delete/${username}`;
  dispatchResponse({  isLoading:true});
   useAxiosPrivate.post(API)
   .then(response =>
       {
         if(response.ok || response.status===200){
           dispatchResponse({
             isRequestError:false,
             isLoading:false,isRequestSuccessful:false,
             isDeleteAccountRequestSuccessful:true,
              email:response.data?.username,
              securityQuestions:response.data?.questions,
              message:response.data?.message
           });
         }
       }
   ).catch(err =>
     {
        if(!err?.response.ok && err.name!=="AbortErr"){
             let errorMessage =null;
             if(err.response.status===404){

               errorMessage  =getErrorMessage(err)||"Invalid credentials";
             }
             else if(err.response.status===401){
                  errorMessage  =getErrorMessage(err)||"Denied access";
             }
             else{

                   errorMessage  = getErrorMessage(err);
             }
             dispatchResponse({isRequestError:true, isRequestSuccessful:false, isDeleteAccountRequestSuccessful:false, isLoading:false, message:errorMessage})
        }else dispatchResponse({isRequestError:true,isRequestSuccessful:false, isDeleteAccountRequestSuccessful:false,isLoading:false, message:"Internal server error"})

     }
   )

}

export const DeleteUser = async(useAxiosPrivate,DeleteUserAccount={username:"",answers:Map.arguments(), OTP:""},dispatchResponse,dispatchLogin)=>{
   const API = `/holiday-plan/api/user/delete`;
   dispatchResponse({  isLoading:true});
    useAxiosPrivate.patch(API,DeleteUserAccount)
    .then(response =>
        {
          if(response.ok || response.status===200){
            dispatchResponse({isRequestError:false,
              isLoading:false,isRequestSuccessful:true,
              message:response.data,
              currentUsername:DeleteUserAccount.username,
              isDeleteAccountRequestSuccessful:false
            });
            setTimeout(()=>dispatchLogin({type:"LOGOUT"}),5000);
          }
        }
    ).catch(err =>
      {
         if(!err?.response.ok && err.name!=="AbortErr"){
              let errorMessage =null;
              if(err.response.status===404){

                errorMessage  =getErrorMessage(err)||"Invalid credentials";
              }
              else if(err.response.status===401){
                   errorMessage  =getErrorMessage(err)||"Denied access";
              }
              else{

                    errorMessage  = getErrorMessage(err);
              }
              dispatchResponse({isRequestError:true, isRequestSuccessful:false, isLoading:false, message:errorMessage})
         }else dispatchResponse({isRequestError:true,isRequestSuccessful:false,  isLoading:false, message:"Internal server error"})

      }
    )

}

/**
 * 
 * @param {*} user  to login 
 * @param {*} setLogin  is the function to set the login status of the user
 */
export const LogInUser = ({email, password},controller) => {

  const API= `/holiday-plan/api/authenticate/user/login/?password=${password}&username=${email}`;

  return axios.post(API, {signal:controller.signal})
  .then(response =>
      { 
        let data ={isLoginError:false, message: "", isLoginSuccessful:false,}
        if(response.ok || response.status===200){

          data={
            type:"LOGIN",      
            payload:response.data,
            isLoginSuccessful:true,
            isLoginError:false, message: ""
           };
  
        }
        return data;

      }
  ).catch(err => 
    {
       
      
       if(!err?.response.ok){
            let errorMessage =null;
            if(err.response.status===404){
             
             errorMessage  =getErrorMessage(err)||"Invalid credentials";
            }
            else if(err.response.status===401){
                 errorMessage  =getErrorMessage(err)||"Denied access";
            }
            else{
                  
                  errorMessage  = getErrorMessage(err);


            }
            return {message:errorMessage,isLoginSuccessful:false,
              isLoginError:true}
       }
       return {isLoginError:false, message: getErrorMessage(err), isLoginSuccessful:false,}

    }
  )
}


export const LogoutUser = (useAxiosPrivate,dispatchLogin) => {

  const API= '/holiday-plan/api/logout/';
    useAxiosPrivate.get(API)
        .then(response =>
            {
              if(response.ok || response.status===200){
                dispatchLogin({
                    type:"LOGOUT",
                });
              }

            }
        ).catch(err =>
          {
             if(!err?.response.ok){
                  let errorMessage =null;
                  if(err.response.status===404){

                    errorMessage  =getErrorMessage(err)||"Invalid credentials";
                   }
                   else if(err.response.status===401){
                        errorMessage  =getErrorMessage(err)||"Denied access";
                  }
                  else{

                        errorMessage  = getErrorMessage(err)
                  }
               
             }

          }
        )
   }
