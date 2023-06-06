
export const FetchHolidayPlan = (useAxiosPrivate, setData,controller) => {


      const API= '/holiday-plan/api/holiday/holidays/';
       useAxiosPrivate.get(API, {signal:controller.signal})
       .then(response =>
           {
             if(response.ok || response.status===200){
               console.log("Ok");
               console.log(response.data)
              setData({
                    type:"replace",
                   payload:response.data,
                   isResponseSuccess:true,
                   isDataAvailable:true
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
                   errorMessage  =err.response.data.message;
                 }
                 else{
                       console.log("Not ok");
                       errorMessage  = err.response.statusText;
                 }
                 setData({type: "error", errorMessage: errorMessage})

            }

            else setData({type: "error", errorMessage: err.response.data.statusText});


         }
       )

}

//Add new holiday plan
export const AddHolidayPlan = (useAxiosPrivate, Images,setData)=> {

    const API = '/holiday-plan/api/holiday/save/';
     console.log(Images)

     useAxiosPrivate.post(API,Images,{headers:{Accept:'multipart/form-data','Content-Type':'multipart/form-data'}})
    .then(response =>
       {
         if(response.ok || response.status===200){
           console.log("Ok");
           console.log(response.data)
           setData({
               isDataCorrect:false,
               errorMessage:"Successfully added holiday"
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
               errorMessage  =err.response.data.message;
             }
             else{
                   console.log("Not ok");
                   errorMessage  = err.response.statusText;
             }
             setData({isDataCorrect:false, errorMessage: errorMessage})


        }
        else setData({isDataCorrect:false,  errorMessage: err.response.data.statusText});

     }
   )
   //
}

 //delete  data
 export const DeleteHolidayPlan = (useAxiosPrivate,holidayPlanId,setResponse)=> {
      
      const API = `/holiday-plan/api/holiday/delete/holiday-plan/${holidayPlanId}`;
    useAxiosPrivate.delete(API)
    .then(response =>
            {
              if(response.ok || response.status===200){
                console.log("Ok");
                console.log(response.data)
                setResponse({
                    isResponseSuccess:true,
                    responseMessage:"Successfully updated holiday"
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
                errorMessage  =err.response.data.message;
              }
              else{
                    console.log("Not ok");
                    errorMessage  = err.response.statusText;
              }
              setResponse({iRequestError:true, errorMessage: errorMessage})


         }

         else setResponse({iRequestError:true,  errorMessage: err.response.data.statusText});


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
                 console.log("Ok");
                 console.log(response.data)
                 setResponse({
                     isResponseSuccess:true,
                     responseMessage:"Successfully updated holiday"
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
                 errorMessage  =err.response.data.message;
               }
               else{
                     console.log("Not ok");
                     errorMessage  = err.response.statusText;
               }
               setResponse({iRequestError:true, errorMessage: errorMessage})


          }

          else setResponse({iRequestError:true,  errorMessage: err.response.data.statusText});


       }
     )


}