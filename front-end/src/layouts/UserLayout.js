import {useContext} from 'react'
import {CreateAuthContext} from '../context/CreateAuthContext';
import { Navigate, useLocation ,Outlet} from "react-router-dom";

const UserLayout =({children})=>{
     const location = useLocation();
     console.log(location)
     const{userLoginState} = useContext(CreateAuthContext)
     const roles = userLoginState.roles;
     console.log(userLoginState.isAuthenticated&&roles.find(role=>role.name==="USER"))
    return (userLoginState.isAuthenticated&&roles.find(role=>role.name==='USER'))?<Outlet/>:
          <Navigate to="/" state={{from:location}} replace="true"/>;
          
}
export default UserLayout;