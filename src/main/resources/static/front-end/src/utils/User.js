import axios from "./Axios"
/**
 * 
 * @param {*} user is the user to be registered
 */
 const getErrorMessage = (response)=>{
      return response.response.data?.error_message?
      response.response.data.error_message:response.response.data?.message?
      response.response.data.message :response.response.statusText;

 }
export const RegisterUser = ({firstname,lastname,email,password,age, registered,userType},dispatchRegister) => {

   //dispatchRegister({registered:true})
  const username=email.replace('/','-');
   const API = '/holiday-plan/api/authenticate/user/save/';
   axios.post(API,{firstname,lastname,username,password,age, usertype:userType})
   .then(response =>
       {
         if(response.ok || response.status===200){
           console.log("Ok");
           console.log(response.data)
 
           dispatchRegister({
               registered : true,
            });
   
         }
       }
   ).catch(err => 
     {
        console.log(err);
       console.log("Not ok");
        if(!err?.response.ok){
             let errorMessage =null;
             if(err.response.status===404){
               console.log("Not ok ,********");
               errorMessage  ="Invalid credentials";
             }
             else if(err.response.status===401){
                  errorMessage  ="Denied access";
             }
             else{
                   console.log(err.response.statusText);
                   errorMessage  = getErrorMessage(err);
             }
             dispatchRegister({errorMessage:errorMessage,
                             isLoginError:true})
        }else dispatchRegister({errorMessage:"Server Error",
        isLoginError:true})
 
     }
   )
}

export const FetchUsers = (useAxiosPrivate,dispatchUsers) => {

   const API = '/holiday-plan/api/admin/user/users/';
   useAxiosPrivate.get(API)
   .then(response =>
       {
         if(response.ok || response.status===200){
           console.log("Ok");
           console.log(response.data)

           dispatchUsers({
               data:response.data,
               isDataAvailable : true,
               isRequestError:false
            });

         }
       }
   ).catch(err =>
     {
        console.log(err);
       console.log("Not ok");
        if(!err?.response.ok){
             let errorMessage =null;
             if(err.response.status===404){
               console.log("Not ok ,********");
               errorMessage  ="Invalid credentials";
             }
             else if(err.response.status===401){
                  errorMessage  ="Denied access";
             }
             else{
                   console.log(err.response.statusText);
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



export const UpdateUser = (useAxiosPrivate,{firstname,lastname,email,newPassword,currentPassword, edited},dispatchRegister) => {

   //dispatchRegister({registered:true})
  const username=email.replace('/','-');
   const API = '/holiday-plan/api/user/update/user/';
   useAxiosPrivate.patch(API,{firstname,lastname,username,newPassword,currentPassword})
   .then(response =>
       {
         if(response.ok || response.status===200){
           console.log("Ok");
           console.log(response.data)

           dispatchRegister({
               edited : response.data.message,
               isEditError:false,
                errorMessage: "",
                isRequestSucceeded:true,
                requestResponseMessage:"Profile updated successful"
            });

         }
       }
   ).catch(err =>
     {
        console.log(err);
       console.log("Not ok");
        if(!err?.response.ok){
             let errorMessage =null;
             if(err.response.status===404){
               console.log("Not ok ,********");
               errorMessage  ="Invalid credentials";
             }
             else if(err.response.status===401){
                  errorMessage  ="Denied access";
             }
             else{
                   console.log(err.response.statusText);
                   errorMessage  = getErrorMessage(err);
             }
             dispatchRegister({errorMessage:errorMessage,
                             isEditError:true, edited:false,
                             isRequestSucceeded:false,
                             requestResponseMessage:""})
        }else dispatchRegister({errorMessage:"Server Error",
                                isEditError:true, edited:false,
                                 isRequestSucceeded:false,
                                 requestResponseMessage:""
        })

     }
   )
}

export const RegisterAdmin = ({firstname,lastname,email,password, age,registered,userType},useAxiosPrivate, dispatchRegister) => {
  const username=email.replace('/','-');
  console.log(JSON.stringify({firstname,lastname,username,password,age, userType}));
  ///dispatchRegister({registered:true})

   const API = '/holiday-plan/api/admin/user/save/';
   useAxiosPrivate.post(API,{firstname,lastname,username,password, usertype:userType})
   .then(response =>
       {
         if(response.ok || response.status===200){
           console.log("Ok");
           console.log(response.data)
 
           dispatchRegister({
               registered : true,
               requestResponseMessage:"Employee is added successfully."
            });
   
         }
       }
   ).catch(err => 
     {
        console.log(err);
       console.log("Not ok");
        if(!err?.response.ok){
             let errorMessage =null;
             if(err.response.status===404){
               console.log("Not ok ,********");
               errorMessage  ="Invalid credentials";
             }
             else if(err.response.status===401){
                  errorMessage  ="Denied access";
             }
             else{
                   console.log("Not ok");
                   errorMessage  = getErrorMessage(err);
             }
             dispatchRegister({errorMessage:errorMessage,
                             isLoginError:true})
        }
        else dispatchRegister({errorMessage:"Server Error",
          isLoginError:true})
 
     }
   )
}

/**
 * 
 * @param {*} user  to login 
 * @param {*} setLogin  is the function to set the login status of the user
 */
export const LogInUser = ({email, password},dispatchLogin,setError
  ) => {
  console.log(email, password);
   let isMounted = true;
   const controller = new AbortController();
  const API= `/holiday-plan/api/authenticate/user/login/?password=${password}&username=${email}`;

  axios.post(API)
  .then(response =>
      {
        if(response.ok || response.status===200){
          console.log("Ok");
          console.log(response.data)

          dispatchLogin({
            type:"LOGIN",      
            payload:response.data
           });
  
        }
      }
  ).catch(err => 
    {
       console.log(err);
      console.log("Not ok");
       if(!err?.response.ok){
            let errorMessage =null;
            if(err.response.status===404){
              console.log("Not ok ,********");
              errorMessage  ="Invalid credentials";
            }
            else if(err.response.status===401){
                 errorMessage  ="Denied access";
            }
            else{
                  console.log("Not ok");
                  errorMessage  = getErrorMessage(err);
                 console.log(err.response.statusText)

            }
            setError({errorMessage:errorMessage,
                            isLoginError:true})
       }

    }
  )
}






export const UserInformation = (refresh_token,dispatchUserInformation,useAxiosPrivate) => {
  console.log(refresh_token)
  const API= '/holiday-plan/api/user/my-details/';
    useAxiosPrivate.get(API)
    .then(response =>
        {
          if(response.ok || response.status===200){
            console.log("Ok");
            console.log(response.data)
            dispatchUserInformation({
                payload:response.data
             });

          }
        }
    ).catch(err =>
      {
         console.log(err);
        console.log("Not ok");
         if(!err?.response.ok){
              let errorMessage =null;
              if(err.response.status===404){
                console.log("Not ok ,********");
                errorMessage  ="Invalid credentials";
              }
              else if(err.response.status===401){
                   errorMessage  ="Denied access";
              }
              else{
                    console.log("Not ok");
                    errorMessage  = getErrorMessage(err);
              }

             alert(errorMessage)
         }

      }
    )
  }


export const LogoutUser = (useAxiosPrivate,dispatchLogin, navigate) => {
  const API= '/holiday-plan/api/logout/';
    useAxiosPrivate.get(API)
        .then(response =>
            {
              if(response.ok || response.status===200){
                console.log("Ok");
                console.log(response.data)
                // setIsLoggedOut(true);
                dispatchLogin({
                                 type:"LOGOUT",
                                });
                               navigate("/")

              }
            }
        ).catch(err =>
          {


            console.log(err);
            console.log("Not ok");
             if(!err?.response.ok){
                  let errorMessage =null;
                  if(err.response.status===404){
                    console.log("Not ok ,********");
                    errorMessage  ="Invalid credentials";
                  }
                  else if(err.response.status===401){
                       errorMessage  ="Denied access";
                  }
                  else{
                        console.log("Not ok");
                        errorMessage  = getErrorMessage(err)
                  }
                 /* setError({errorMessage:errorMessage,
                                  isLoginError:true})*/
                 alert(errorMessage)
             }

          }
        )
   }