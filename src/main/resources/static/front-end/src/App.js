import './App.css';
import Home from './component/Home';
import Header from './component/Header';
import {  useReducer} from "react"
import HolidayPlanForm from './component/HolidayPlanForm';
import  React,{ useEffect} from 'react';
import {Route, Routes,useNavigate} from 'react-router-dom';
import Login from './component/Login';
import Register from './component/Register';
import {CreateAuthContext} from './context/CreateAuthContext';
import Profile from './component/Profile';
const initialState = {
  isAuthenticated: false,
  access_token: null,
  refresh_token: null,
  
};
const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      const{access_token, refresh_token} = action.payload;
      console.log(access_token)
      console.log(refresh_token)
      return {
        ...state,
        isAuthenticated: true,
        access_token: action.payload.access_token,
        refresh_token: action.payload.refresh_token
      };
    case "LOGOUT":
      
      return {
        ...state,
        isAuthenticated: false,
        access_token: null,
        refresh_token: null,
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
    if(userLoginState.isAuthenticated) navigate("/home");
    else navigate("/");
  },[userLoginState.isAuthenticated]
  );





 return (
  <CreateAuthContext.Provider value={{userLoginState, dispatchLogin}}>
    <div className="App">
      <Header/>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/addHolidayPlan" element={<HolidayPlanForm/>}/>
        <Route path="/home" element={<Home/>}/>  
        <Route path="/profile" element={<Profile/>}/>  

      </Routes>
    </div>
  </CreateAuthContext.Provider>
 )
}


export default App;
