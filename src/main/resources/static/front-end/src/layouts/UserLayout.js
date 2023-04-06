import { Navigate,Outlet } from "react-router-dom";
import {useContext} from 'react'
import {CreateAuthContext} from '../context/CreateAuthContext';
const UserLayout =({children})=>{
     const{userLoginState} = useContext(CreateAuthContext)
          return <><Outlet/></>;


}
export default UserLayout;