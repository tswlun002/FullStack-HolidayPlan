import './App.css';
import Home from './pages/Home';
import MainLayout from './layouts/MainLayout.js';
import {  useReducer} from "react"
import HolidayPlanForm from './pages/HolidayPlanForm';
import  React,{ useEffect} from 'react';
import {Route, Routes,useNavigate,useRoutes} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterAdminForm from './pages/RegisterAdmin';
import {CreateAuthContext} from './context/CreateAuthContext';
import Profile from './pages/Profile';
import jwtDecode from 'jwt-decode';
import MissingPage from './pages/MissingPage'
import UserQuery from './pages/UserQuery'
import QueryTicket from './pages/QueryTicket'

import AdminLayout from './layouts/AdminLayout'
import UserLayout from './layouts/UserLayout'

const initialState = {
  isAuthenticated: false,
  access_token: null,
  firstname: "",
  lastname: "",
  age:"",
  username: "",
  userType: ""
  
};
const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
       let user = initialState;
       try{
          user =jwtDecode(action.payload?.access_token).user;
          console.log(user);
       }catch(e){
         console.error(e);
       }
      return {
        ...state,
        isAuthenticated: true,
        access_token: action.payload.access_token,
        firstname: user.firstname,
        lastname: user.lastname,
        age:user.age,
        username:user.username,
        userType: user.userType
      };
    case "LOGOUT":
      
      return {
        ...state,
        isAuthenticated: false,
        access_token: null,
        firstname: "",
        lastname: "",
        age:"",
        username: "",
        userType: ""
      };
    default:
      return state;
  }
}
const App=()=>{
  const navigate = useNavigate();

//Login registered user
const[userLoginState, dispatchLogin] = useReducer(reducer, initialState)

//call fetch data on hooks
 useEffect(() =>{

     console.log(userLoginState.isAuthenticated)
     if(userLoginState?.userType==="USER")navigate("/home-user");
     else if(userLoginState?.userType==="ADMIN")navigate("/home-admin");
     else navigate("/");

  },[userLoginState]
  );





 return (
  <CreateAuthContext.Provider value={{userLoginState, dispatchLogin}}>
      <Routes>
        <Route path="/" element={<MainLayout/>}>  
          <Route index   element={<Login/>}/>
          <Route path="register" element={<Register />}/>

          <Route path='home-user' element={<UserLayout/>}>  
             <Route index element={<Home/>}/>
             <Route path="addHolidayPlan" element={<HolidayPlanForm/>}/>
             <Route path="profile" element={<Profile/>}/>
             <Route path="query" element={<QueryTicket/>}/>
          </Route>

          <Route path="home-admin" element={<AdminLayout/>}>
            <Route index element={<UserQuery/>}/>
            <Route path="register-admin" element={<RegisterAdminForm/>}/>
            <Route path="profile" element={<Profile/>}/>
          </Route>

          <Route path="*" element={<MissingPage/>}/>

        </Route>

      </Routes>
  </CreateAuthContext.Provider>
 )
}


export default App;
