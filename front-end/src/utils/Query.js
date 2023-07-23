import { getErrorMessage } from "./Error";

export const SendQuery = ({summary,description},useAxiosPrivate, dispatchQuery)=>{

   const API = '/holiday-plan/api/user-query/query/save/';
   console.log({summary,description})
   const querySummary = summary;
   const queryDescription =description;
   useAxiosPrivate.post(API,{querySummary,queryDescription})                      
   .then(response =>
       {
          console.log(response.data)
         if(response.ok || response.status===200){
           console.log("Ok");
           console.log(response.data)

           dispatchQuery({
               isRequestSuccessful:true,
               querySentStatus:"Query  sent successfully."
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
             dispatchQuery({errorMessage:errorMessage,
                             isQueryingError:true, querySent:false})
        }
        else dispatchQuery({errorMessage:"Internal server error",
                                          isQueryingError:true, querySent:false})

     }
   )
}
export const FetchQueries = (useAxiosPrivate, roles, dispatchQuery, controller)=>{
   const OK_RESPONSES =[200,302, 201]
  const API = roles.find(role=>role.name==="ADMIN")? "/holiday-plan/api/user-query/query/status/?queryStatus=ACTIVE":
                          '/holiday-plan/api/user-query/query/user/logged-in/'

  useAxiosPrivate.get(API, {signal:controller.signal})
  .then(response =>
      {
        if(response.ok || OK_RESPONSES.includes(response.status)){
          console.log("Ok");
          console.log(response.data)

         dispatchQuery({
            type:"replace",
            payload:response.data,
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
            dispatchQuery({type:"error",message:errorMessage})

       }
       else dispatchQuery({type:"error",message:"Internal server error"});
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
          console.log("Ok");
          console.log(response.data)
          editResponse.isResponseError=false;
          editResponse.isResponseSuccess =true;
          editResponse.requestResponse="Updated successfully";

        }
        return editResponse;
      }
    ).catch(err =>
    {
        console.log(err);
        console.log("Not ok");
        editResponse.isResponseError=true;
        editResponse.isResponseSuccess =false;
       if(!err?.response.ok){
            let errorMessage =null;
            if(err.response.status===404){
              console.log("Not ok ,********");
              editResponse.requestResponse="Invalid credentials";
            }
            else if(err.response.status===401){
                 editResponse.requestResponse="Denied access";
            }
            else{
                  console.log("Not ok");
                  editResponse.requestResponse=err.response?.statusText;
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
          console.log("Ok");
          console.log(response.data)

          dispatchQuery({
                  isResponseError : false,
                  response:"Query deleted  successfully",
                  isResponseSuccess:true
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
             dispatchQuery({errorMessage:errorMessage,  isResponseError:true})

            }
            else dispatchQuery({errorMessage:"Internal server error",isResponseError:true})

    }
  )
}