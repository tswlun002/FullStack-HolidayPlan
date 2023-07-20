import { Navigate, useLocation ,Outlet} from "react-router-dom";
import {CreateAuthContext} from '../context/CreateAuthContext';
import {useContext} from 'react'

const AdminLayout =({children})=>{
     const location = useLocation();
     console.log(location)
     
     const{userLoginState} = useContext(CreateAuthContext)
     console.log(userLoginState)
     const roles = userLoginState.roles;
     console.log(roles)
     console.log(userLoginState.isAuthenticated&&roles.find(role=>role.name==="ADMIN"))
    return (userLoginState.isAuthenticated&&roles.find(role=>role.name==='ADMIN'))?
      <Outlet/>:
      <Navigate to={"/"} state={{from:location}} replace="true"/>;



}
export default AdminLayout;
