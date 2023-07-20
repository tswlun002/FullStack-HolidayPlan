import { useNavigate, useLocation ,Outlet} from "react-router-dom";
import {CreateAuthContext} from '../context/CreateAuthContext';
import {useContext} from 'react'

const AdminLayout =({children})=>{
     const location = useLocation();
     console.log(location)

     const{userLoginState} = useContext(CreateAuthContext)
     console.log(userLoginState)
    return (userLoginState.roles.find(role=>role.name==='ADMIN'))?
      <Outlet/>:
      <useNavigate to={location} state={{from:location}} replace="true"/>;



}
export default AdminLayout;
