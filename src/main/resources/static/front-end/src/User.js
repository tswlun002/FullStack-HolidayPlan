/**
 * 
 * @param {*} user is the user to be registered
 */
export const RegisterUser = ({firstname,lastname,username,password, registered}, dispatchRegister) => {
     
  console.log(JSON.stringify({firstname,lastname,username,password}));
  dispatchRegister({registered:true})

   const API = 'http://localhost:8080/home/add-holiday-plan';
    const request = {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({firstname,lastname,username,password})
    }
    fetch(API, request)
    .then((res) =>{
      if(res.status===200){
       alert(`${{firstname,lastname,username,password}} is succefully registered`)
    }})
  .catch((err) => {alert(err.message)});

  if(registered){


  }
}

/**
 * 
 * @param {*} user  to login 
 * @param {*} setLogin  is the function to set the login status of the user
 */
export const LogInUser = ({userName, password, logedIn},dispatchLogin) => {
  dispatchLogin({logedIn:true});

    
    const API= `http://localhost:8080/home/user-login/${userName}/${password}`;
           console.log(JSON.stringify({userName, password}));
          fetch(API)
          .then((res) => {
            if(res.status===200){

              res.json().then((logedIn) =>{

                  if(logedIn){
                      dispatchLogin({logedIn:true});
                  }else{
                       alert(`User ${userName} with password ${password} not logged in`)
                  }

                }
              
              )

            }else if(!res.ok){

              res.json().then((data) =>console.log(JSON.stringify(data.message)));
            }
          
          })
          .catch((err) => {alert(err.message)});
}