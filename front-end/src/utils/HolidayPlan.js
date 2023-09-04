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
             setData({type: "error", message:getErrorMessage(err)})

            }
            else setData({type: "error", message: 'Internal server error'});


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
             setData({iRequestError:true, isResponseSuccess:false, message:getErrorMessage(err)})

        }
        else setData({iRequestError:true, isResponseSuccess:false, message:'Internal server error'});


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
                isRequestSuccessful:true,
               isRequestError:false,
               errorMessage:"Successfully added holiday"
            });

         }
       }

   ).catch(err =>
     {
       
        if(!err?.response.ok){
             setData({isRequestSuccessful:false,isRequestError:true, errorMessage: getErrorMessage(err)});
        }
        else setData({isRequestSuccessful:false, isRequestError:true,  errorMessage: 'internal server error'});

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
              results.iRequestError=true;
              results.message=getErrorMessage(err);
              
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
            setResponse({iRequestError:true, message: getErrorMessage(err)})

          }
          else setResponse({iRequestError:true,  message:'Internal server error'});


       }
     )


}