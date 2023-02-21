
export const FetchHolidayPlan = (setData) => {
    const API= 'http://localhost:8080/home/all-holiday-plans';

          fetch(API)
          .then((res) => {
            if(res.status===200){
              res.json().then((data) =>setData(data))
            }else if(!res.ok){
              setData([])
              res.json().then((data) =>console.log(JSON.stringify(data.message)));
            }
          
          })
          .catch((err) => {alert(err.message)});
}

//Add new holiday plan
export const AddHolidayPlan = (newHolidayPlan,setData)=> {
    console.log(JSON.stringify(newHolidayPlan))
    const API = 'http://localhost:8080/home/add-holiday-plan';
    const request = {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(newHolidayPlan)
    }
    fetch(API, request)
    .then((res) =>{
      if(res.status===200){
       FetchHolidayPlan(setData)
    }})
  .catch((err) => {alert(err.message)});

}

 //delete  data
 export const DeleteHolidayPlan = (HolidayPlanId,setData)=> {
  
      const API = 'http://localhost:8080/home/delete-holiday-plan/'+HolidayPlanId;
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