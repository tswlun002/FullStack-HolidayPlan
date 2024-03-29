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
          
            dispatchResponse({isRequestError:false,passwordResetSucceful:true,  isLoading:false,isRequestSuccessful:true,
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
export const resetPasswordRequest=(username,dispatchResponse)=>{
   const API = `/holiday-plan/api/authenticate/password-reset-request?email=${username}`;
   dispatchResponse({  isLoading:true});
     axios.get(API)
     .then(response =>
         {
           if(response.ok || response.status===200){
             dispatchResponse({isRequestError:false,passwordResetSucceful:true,  isLoading:false,isRequestSuccessful:true,
             message:response.data.message});

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

export const requestSecuirityChangePassword=({useAxiosPrivate,username='',dispatchResponse=()=>{}})=>{

  const API = `/holiday-plan/api/user/update/password-change-request?username=${username}`;
   dispatchResponse({  isLoading:true});
    useAxiosPrivate.post(API)
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
export const requestSecuirityChangeEmail=({useAxiosPrivate, currentUsername='',userAnswers=[{username:'', answer:'', number:0}],
                                dispatchResponse=()=>{}})=>{
  const API = `/holiday-plan/api/user/update/username-change-request?currentUsername=${currentUsername}`;
   dispatchResponse({  isLoading:true});
    useAxiosPrivate.post(API,{userAnswers:userAnswers})
    .then(response =>
        {
          if(response.ok || response.status===200){
            dispatchResponse({
              isRequestError:false,isEmailUpdateRequestSuccessful:true,  
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

export const changeSecuirity=( useAxiosPrivate,{currentUsername,username, password,currentPassword, OTP},dispatchResponse)=>{
  const API = '/holiday-plan/api/user/update/security';
  dispatchResponse({  isLoading:true});
    useAxiosPrivate.patch(API,{username, newPassword:password, OTP,currentPassword,currentUsername})
    .then(response =>
        {
          if(response.ok || response.status===200){
            dispatchResponse({isRequestError:false,isPasswordOrEmailChangeRequestSuccessful:true,  
              isLoading:false,isRequestSuccessful:true,
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
export const FetchSecuirityQuestions=( useAxiosPrivate,{controller},dispatchResponse=()=>{})=>{
  const API = `/holiday-plan/api/user/security-questions/`;
  dispatchResponse({  isLoading:true});
    useAxiosPrivate.get(API, {signal:controller.signal})
    .then(response =>
        {
          if(response.ok || response.status===200){
            dispatchResponse({isRequestError:false,  isLoading:false,isRequestSuccessful:true, data:response.data});
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

   const API = '/holiday-plan/api/user/update/none-security';
   isMounted&& useAxiosPrivate.patch(API,{currentUsername,firstname,lastname,age,signal:controller.signal})
   .then(response =>
       {
         if(response.ok || response.status===200){
           dispatchRegister({isRequestError:false,isRequestSuccessful:true, message:response.data})

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


export const DeleteUser = (useAxiosPrivate,password,email,dispatchAccount) => {

   const API = `/holiday-plan/api/user/delete/?username=${email}&password=${password}`;
   useAxiosPrivate.delete(API)
   .then(response =>
       {
         if(response.ok || response.status===200){
          dispatchAccount({
            isRequestError:false,
            isRequestSuccessful:true,
            AccountDeleted:true,
             message:"Account deleted successful"
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
              dispatchAccount({isRequestError:true,isRequestSuccessful:false, message:errorMessage})
        }else dispatchAccount({isRequestError:true,isRequestSuccessful:false, message:"Internal server error"})

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
