import {useContext} from 'react'
import {CreateAuthContext} from '../context/CreateAuthContext';
import { Navigate, useLocation ,Outlet} from "react-router-dom";

const UserLayout =({children})=>{
     const location = useLocation();
     const{userLoginState} = useContext(CreateAuthContext)
    return (userLoginState.isAuthenticated&&userLoginState.roles.find(role=>role.name==='USER'))?<Outlet/>:
          <Navigate to="/" state={{from:location}} replace="true"/>;
          
}
export default UserLayout;