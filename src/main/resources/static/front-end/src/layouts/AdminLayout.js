import { useNavigate, useLocation ,Outlet} from "react-router-dom";
import {CreateAuthContext} from '../context/CreateAuthContext';
import {useContext} from 'react'

const AdminLayout =({children})=>{
     const location = useLocation();

     const{userLoginState} = useContext(CreateAuthContext)
    return (userLoginState.userType==='ADMIN')?
      <Outlet/>:
      <useNavigate to="/" state={{from:location}} replace="true"/>;



}
export default AdminLayout;