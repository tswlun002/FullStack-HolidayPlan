import { getErrorMessage } from "./Error";

export const FetchHolidayPlan = (useAxiosPrivate, setData,controller) => {


      const API= '/holiday-plan/api/holiday/holidays/';
       useAxiosPrivate.get(API, {signal:controller.signal})
       .then(response =>
           {
             if(response.ok || response.status===200){
              
              setData({
                    type:"replace",
                   payload:response.data,
                   message:"successful",
                   iRequestError:false, isResponseSuccess:true
                });

             }

           }
       ).catch(err =>
         {
            if(!err?.response.ok){
                 let errorMessage =null;
                 if(err.response.status===404){
                   errorMessage  =err.response.data.message;
                 }
                 else{
                       errorMessage  = err.response.statusText;
                 }
                 setData({type: "error", message:errorMessage})

            }

            else setData({type: "error", message: err.response.data.statusText});


         }
       )

}
export const FilterHolidayPlan = (useAxiosPrivate,username,filter, setData,controller) => {
  let{startDate, endDate} =filter;
  startDate = startDate&&startDate.map((date)=>date.replaceAll('-','/'));
  endDate = endDate&&endDate.map((date)=>date.replaceAll('-','/'));
  const API= `/holiday-plan/api/holiday/filtered-holiday-plans/?username=${username}&city=${filter.city||[]}&location=${filter.location||[]}&end=${endDate||[]}&start=${startDate}&event=${filter.event||[]}&priorityLevel=${filter.priorityLevel||[]}`;
   useAxiosPrivate.get(API,{signal:controller.signal})
   .then(response =>
       {
         if(response.ok || response.status===200){
          setData({
               data:response.data,
               message:"successful",
               iRequestError:false, isResponseSuccess:true
            });

         }

       }
   ).catch(err =>
     {
        if(!err?.response.ok){
             let errorMessage =null;
             if(err.response.status===404){

               errorMessage  =err.response.data.message;
             }
             else{
                  
                   errorMessage  = err.response.statusText;
             }
             setData({iRequestError:true, isResponseSuccess:false, message:errorMessage})

        }

        else setData({iRequestError:true, isResponseSuccess:false, message: err.response.data.statusText});


     }
   )

}


//Add new holiday plan
export const AddHolidayPlan = (useAxiosPrivate, Images,setData)=> {

    const API = '/holiday-plan/api/holiday/save/';

     useAxiosPrivate.post(API,Images,{headers:{Accept:'multipart/form-data','Content-Type':'multipart/form-data'}})
    .then(response =>
       {
         if(response.ok || response.status===200){
           setData({
               isDataCorrect:false,
               errorMessage:"Successfully added holiday"
            });

         }
       }

   ).catch(err =>
     {
       
        if(!err?.response.ok){
             let errorMessage =null;
             if(err.response.status===404){
               errorMessage  =getErrorMessage(err);
             }
             else{
                   errorMessage  = getErrorMessage(err);
             }
             setData({isDataCorrect:false, errorMessage: errorMessage})


        }
        else setData({isDataCorrect:false,  errorMessage: err.response.data.statusText});

     }
   )
   //
}

 //delete  data
 export const DeleteHolidayPlan = (useAxiosPrivate,holidayPlanId)=> {
    const API = `/holiday-plan/api/holiday/delete/holiday-plan/${holidayPlanId}`;
   return useAxiosPrivate.delete(API)
    .then(response =>
            {  
              const results ={iRequestError:false, isResponseSuccess:false,message:"",responseMessage:""}
              
              if(response.ok || response.status===200){
                results.message="Successful"
                results.isResponseSuccess=true;
                
              }
              return results;
        }
    ).catch(err =>
      {
        const results ={iRequestError:false, isResponseSuccess:false,message:"",responseMessage:""}

         if(!err?.response.ok){
              let errorMessage =null;
              if(err.response.status===404){
                errorMessage  =getErrorMessage(err);
              }
              else{
                    errorMessage  = getErrorMessage(err);
              }
              results.iRequestError=true;
              results.message=errorMessage;
              
         }

         else {
          results.iRequestError=true;
          results.message="Internal server error";
        }
        return  results;

      }
    )


} 

//update  data
export const UpdateHolidayPlan = (useAxiosPrivate,holidayPlanId, priority,setResponse)=> {
  
    const API = `/holiday-plan/api/holiday/update/holiday-plan/?holidayPlanId=${holidayPlanId}&level=${priority}`;
     useAxiosPrivate.patch(API)
     .then(response =>
             {
               if(response.ok || response.status===200){
                 setResponse({
                  message:"updated ",
                  iRequestError:false, isResponseSuccess:true
                  });

               }
         }
     ).catch(err =>
       {
          if(!err?.response.ok){
               let errorMessage =null;
               if(err.response.status===404){
                 errorMessage  =getErrorMessage(err);
               }
               else{
                     errorMessage  = getErrorMessage(err);
               }
               setResponse({iRequestError:true, message: errorMessage})


          }

          else setResponse({iRequestError:true,  message: err.response.data.statusText});


       }
     )


}