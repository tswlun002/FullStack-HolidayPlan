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
export const RegisterUser = ({firstname,lastname,email,password,age,userType},dispatchRegister) => {

   //dispatchRegister({registered:true})
  const username=email.replace('/','-');
   const API = '/holiday-plan/api/authenticate/register';
   axios.post(API,{firstname,lastname,username,password,age, usertype:userType})
   .then(response =>
       {
         if(response.ok || response.status===200){
           dispatchRegister({
               registered : true,
               isRegisterError:false,
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
             dispatchRegister({errorMessage:errorMessage,isRegisterError:true,registered:false})
        }else dispatchRegister({errorMessage:"Server Error", isRegisterError:true,registered:false})
 
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



export const UpdateUser = (useAxiosPrivate,{firstname,lastname,currentUsername,email,newPassword,age,currentPassword},dispatchRegister) => {

   //dispatchRegister({registered:true})
   let isMounted = true;
   const controller = new AbortController();
  const username=email.replace('/','-');
   const API = '/holiday-plan/api/user/update/';
   isMounted&& useAxiosPrivate.patch(API,{firstname,lastname,currentUsername,username,age,newPassword,currentPassword,signal:controller.signal})
   .then(response =>
       {
         if(response.ok || response.status===200){
           dispatchRegister({isRequestError:false,isRequestSuccessful:true, message:"Account successfully updated,logout and in to see changes."})

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
