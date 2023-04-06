import axios from "./Axios"
/**
 * 
 * @param {*} user is the user to be registered
 */
export const RegisterUser = ({firstname,lastname,email,password, registered,userType},dispatchRegister) => {

   //dispatchRegister({registered:true})
   const username = email; 
   const API = '/holiday-plan/api/authenticate/user/save/';
   axios.post(API,{firstname,lastname,username,password, userType})
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
                   errorMessage  = err.response?.statusText;
             }
             dispatchRegister({errorMessage:errorMessage,
                             isLoginError:true})
        }else dispatchRegister({errorMessage:"Server Error",
        isLoginError:true})
 
     }
   )
}

export const RegisterAdmin = ({firstname,lastname,email,password, registered,userType}, dispatchRegister) => {
  const username=email;
  console.log(JSON.stringify({firstname,lastname,username,password, userType}));
  ///dispatchRegister({registered:true})

   const API = '/holiday-plan/api/user/admin/save';
   axios.post(API,{firstname,lastname,username,password, userType})
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
                   console.log("Not ok");
                   errorMessage  = err.response?.statusText;
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
  dispatchLogin({
    type:"LOGIN",      
    payload:{}
   });

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
                  errorMessage  = err.response.data?.error_message;
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
                    errorMessage  = err.response.data?.error_message;
              }
             /* setError({errorMessage:errorMessage,
                              isLoginError:true})*/
             alert(errorMessage)
         }

      }
    )
  }


export const LogoutUser = (refresh_token,dispatchUserInformation) => {
  console.log(refresh_token)
  const API= '/holiday-plan/api/logout/';
  const request = {
    method:'GET',
    headers:{ 'Content-Type': 'application/json;charset=UTF-8','Authorization':`Bearer ${refresh_token}`},
  }
    fetch(API,request)
    .then((res) => {
      console.log(res);
      if(res.ok){
        console.log("Ok");
        return res.json();

      }else if(!res.ok){
        console.log("Not ok");
         throw res;
      }

    })
    .then((authenticationData)=>{
      console.log(authenticationData);
       dispatchUserInformation({
        payload:{username:"", firstname:"", lastname:""}
       });

    })
    .catch((err) => {err.message?alert(err.message):err.statusText?
    alert(err.statusText):alert.error("unknown error")});
   }