
export const FetchHolidayPlan = (useAxiosPrivate, setData) => {
      console.log(setData);
      console.log(useAxiosPrivate)
      const API= '/holiday-plan/api/holiday/holidays/';
      useAxiosPrivate.get(API)
       .then(response =>
           {
             if(response.ok || response.status===200){
               console.log("Ok");
               console.log(response.data)
               setData({
                    type:"replace",
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
export const AddHolidayPlan = (useAxiosPrivate, HolidayPlanData,setData)=> {

    const API = '/holiday-plan/api/holiday/save/';
     useAxiosPrivate.post(API, HolidayPlanData)
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
}

 //delete  data
 export const DeleteHolidayPlan = (HolidayPlanId,setData)=> {
      
      const API = 'http://localhost:8080/home/holiday-plan/delete-holiday-plan/'+HolidayPlanId;
      const request = {
        method:'DELETE',
        headers:{'Content-Type':'application/json'},
      }
      fetch(API, request)
      .then((res) =>{
        if(res.status===200){
          FetchHolidayPlan(setData)
      }})
    .catch((err) => {alert(err.message)});


} 

//update  data
export const UpdateHolidayPlan = (HolidayPlanId, priority,setData)=> {
  
    const API = `http://localhost:8080/home/update-holiday-plan/${HolidayPlanId}/${priority}`;
    const request = {
      method:'PATCH',
      headers:{'Content-Type':'application/json'},
    }
    fetch(API, request)
    .then((res) =>{
        if(res.status===200){
            FetchHolidayPlan(setData)
        }
        if(!res.ok){
            alert(JSON.stringify({message:res.message}))
        }

   })
  .catch((err) => {alert(err.message)});}      