import './App.css';
import Home from './pages/Home';
import MainLayout from './layouts/MainLayout.js';
import {  useReducer} from "react"
import HolidayPlanForm from './pages/HolidayPlanForm';
import  React,{ useEffect} from 'react';
import {Route, Routes,useNavigate, useLocation} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import {CreateAuthContext} from './context/CreateAuthContext';
import Profile from './pages/Profile';
import {jwtDecode} from 'jwt-decode';
import MissingPage from './pages/MissingPage';
import UserQuery from './pages/UserQuery';
import QueryTicket from './pages/QueryTicket';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import RoleAndPermission from './pages/RoleAndPermission';
import Users from './pages/Users';
import EditUserForm from './component/EditUserForm';
import About from './pages/About';
import FetchAppData from "./utils/AppInfoApi";
import ResetPassword from './pages/ResetPassword';

const initialState = {
  isAuthenticated: false,
  access_token: null,
  firstname: "",
  lastname: "",
  age:"",
  username: "",
  userType: "",
  isSecurityEnabled:false,
  roles:[],
  permissions:[]
  
};

const App=()=>{
    const navigate = useNavigate();
    const INITIAL_STATE ={data:{},isRequestError:false,isRequestSuccessful:false};
    const[appData, dispatchAppData] = useReducer((state,action)=>{return{state,...action}},INITIAL_STATE);
    useEffect(()=>{
      let isMounted = true;
       const controller = new AbortController();
       isMounted&&FetchAppData(dispatchAppData,controller);
       return ()=>{isMounted=false; controller.abort();}
    },[])
    const reducer = (state, action) => {
      switch (action.type) {
        case "LOGIN":
           let user = initialState;
           try{
              user =jwtDecode(action.payload?.access_token).user;
           }catch(e){
           }
          return {
            ...state,
            isAuthenticated: true,
            access_token: action.payload.access_token,
            firstname: user.firstname,
            lastname: user.lastname,
            age:user.age,
            isSecurityEnabled:false,
            username:user.username,
            userType: user.userType,
            roles:user.roles
          };
        case "UPDATE_TOKEN":

            return {...state, access_token:action?.payload?.access_token}
        case "UPDATE_DETAILS":
          return {...state, ...action};
    
        case "LOGOUT":
           window.localStorage.removeItem('access_token');
           window.localStorage.clear()
          navigate('/')
          return {
            ...state,
            ...initialState
          };
    
        default:
          return state;
      }
    }
    //Login registered user
    const[userLoginState, dispatchLogin] = useReducer(reducer,JSON.parse(window.localStorage.getItem("loginState"))||initialState)


    const currentLocation  =useLocation();
    let Path = window.localStorage.setItem("currentPath", currentLocation.pathname||"/");
    useEffect(()=>{

      if(userLoginState.isAuthenticated){
        window.localStorage.setItem("loginState",JSON.stringify(userLoginState));
      }
      Path = window.localStorage.getItem("currentPath");
      if(Path==='/' && userLoginState.isAuthenticated)Path = userLoginState.roles.find(role=>role.name==="USER")?
                "/home-user":userLoginState.roles.find(role=>role.name==="ADMIN")&&"/home-admin"
      
      navigate(Path);
    }, [userLoginState])

    return (
    <CreateAuthContext.Provider value={{userLoginState, dispatchLogin, appData}}>
      <Routes>
        <Route path="/" element={<MainLayout appData={appData}/>}>  
          <Route index   element={<Login/>}/>
          <Route path="password-reset-request" element={<ResetPassword/>}/>
          <Route path="register" element={<Register />}/>
          <Route path="about" element={<About appData={appData}/>}/>

          <Route path='home-user' element={<UserLayout/>}>  
             <Route index element={<Home/>}/>
             <Route path="addHolidayPlan" element={<HolidayPlanForm/>}/>
             <Route path="profile" element={<Profile/>}/>
             <Route path="query" element={<QueryTicket/>}/>
             <Route path="user-queries" element={<UserQuery/>}/>
          </Route>

          <Route path="home-admin" element={<AdminLayout/>}>
            <Route index element={<UserQuery/>}/>
            <Route path="roles-permissions" element={<RoleAndPermission/>}/>
            <Route path="roles-permissions/:barRoleActions" element={<RoleAndPermission/>}/>
            <Route path="profile" element={<Profile/>}/>
            <Route path="users" element={<Users/>}/>
            <Route path="users/:username" element={<EditUserForm/>}/>
          </Route>
          <Route path="*" element={<MissingPage/>}/>

        </Route>

      </Routes>
   </CreateAuthContext.Provider>
   )
}


export default App;
