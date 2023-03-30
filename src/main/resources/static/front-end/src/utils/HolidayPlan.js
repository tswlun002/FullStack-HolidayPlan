
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

            }
            else console.log(err)

         }
       )
}

//Add new holiday plan
export const AddHolidayPlan = (HolidayPlanData,setData,access_token)=> {
    
    //setData({data:HolidayPlanData})

    const API = '/holiday-plan/api/holiday/save/';
    const request = {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${access_token}`},
      body:JSON.stringify(HolidayPlanData)
    }
    fetch(API, request)
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
         setData({type:"add", data:authenticationData})
     })
    .catch((err) => {err.message?alert(err.message):err.statusText?
         alert(err.statusText):alert.error("unknown error")}
   );
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