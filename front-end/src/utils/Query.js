import { getErrorMessage } from "./Error";

export const SendQuery = async({summary,description},useAxiosPrivate)=>{

   const API = '/holiday-plan/api/user-query/query/save/';
   const querySummary = summary;
   const queryDescription =description;
   return useAxiosPrivate.post(API,{querySummary,queryDescription})                      
   .then(response =>
       {  
        
         if(response.ok || response.status===200){
           return{
               isRequestSuccessful:true,
               message:"Query  sent successfully."
               , isQueryingError:false
            };

         }
       }
   ).catch(err =>
     {
       
        if(!err?.response.ok){
             let errorMessage =null;
             if(err.response.status===404){
               
               errorMessage  ="Invalid credentials";
             }
             else if(err.response.status===401){
                  errorMessage  ="Denied access";
             }
             else{
                  
                   errorMessage  = getErrorMessage(err);
             }
             return {message:errorMessage, isQueryingError:true, isRequestSuccessful:true};
        }
        else return{message:"Internal server error", isQueryingError:true, isRequestSuccessful:true};

     }
   )
}
export const FetchQueries = async(useAxiosPrivate, controller,isAdmin=false,status='ACTIVE')=>{
   const OK_RESPONSES =[200,302, 201]
  const API = isAdmin? `/holiday-plan/api/user-query/query/status/?queryStatus=${status}`:
                          '/holiday-plan/api/user-query/query/user/logged-in/'
  
  return useAxiosPrivate.get(API, {signal:controller.signal})
  .then(response =>
      {
        if(response.ok || OK_RESPONSES.includes(response.status)){
          
        return({
            type:"replace",
            payload:response.data,
            message:"Fetched successful."
          });

        }
      }
  ).catch(err =>
    {
     
       if(!err?.response.ok && err.name!=="AbortErr"){
            let errorMessage =null;
            if(err.response.status===404){
            
              errorMessage  =getErrorMessage(err);
            }
            else if(err.response.status===401){
                 errorMessage  ="Denied access";
            }
            else{
                 
              errorMessage  = getErrorMessage(err);
            }
            return({type:"error",message:errorMessage})

       }
       else return({type:"error",message:"Internal server error"});
    }
  )

}


export const SendQueryResponse = ({username, response,queryStatus, queryId, useAxiosPrivate})=>{
    const API ='/holiday-plan/api/user-query/query/update/';
    const editResponse = {isResponseError : false,requestResponse:"",isResponseSuccess:false}

return useAxiosPrivate.patch(API,{username,queryId,response, queryStatus})
    .then(response =>
      {
        if(response.ok || response.status===200){
          editResponse.isResponseError=false;
          editResponse.isResponseSuccess =true;
          editResponse.requestResponse="Updated successfully";

        }
        return editResponse;
      }
    ).catch(err =>
    {
        editResponse.isResponseError=true;
        editResponse.isResponseSuccess =false;
       if(!err?.response.ok){
            if(err.response.status===404){
              
              editResponse.requestResponse="Invalid credentials";
            }
            else if(err.response.status===401){
                 editResponse.requestResponse="Denied access";
            }
            else{
                 
                  editResponse.requestResponse=getErrorMessage(err);
            }
       }
       else editResponse.requestResponse="Internal server error";

       return editResponse;

    })
    }
export const DeleteQuery= (useAxiosPrivate,queryId, dispatchQuery)=>{

  const API = `/holiday-plan/api/user-query/query/delete/${queryId}`;
  useAxiosPrivate.delete(API)
  .then(response =>
      {
        if(response.ok || response.status===200){
          
         

          dispatchQuery({
                  isResponseError : false,
                  response:"Query deleted  successfully",
                  isResponseSuccess:true
           });

        }
      }
  ).catch(err =>
    {
       
     
       if(!err?.response.ok){
            let errorMessage =null;
            if(err.response.status===404){
              
              errorMessage  ="Invalid credentials";
            }
            else if(err.response.status===401){
                 errorMessage  ="Denied access";
            }
            else{
                 
                  errorMessage  = getErrorMessage(err);
            }
             dispatchQuery({errorMessage:errorMessage,  isResponseError:true})

            }
            else dispatchQuery({errorMessage:"Internal server error",isResponseError:true})

    }
  )
}