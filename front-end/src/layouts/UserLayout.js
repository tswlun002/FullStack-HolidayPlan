import {useContext} from 'react'
import {CreateAuthContext} from '../context/CreateAuthContext';
import { useNavigate, useLocation ,Outlet} from "react-router-dom";

const UserLayout =({children})=>{
     const location = useLocation();
     const{userLoginState} = useContext(CreateAuthContext)
          return (userLoginState.roles.find(role=>role.name==="USER"))?
            <Outlet/>:
            <useNavigate to="/" state={{from:location}} replace="true"/>;
          
}
export default UserLayout;