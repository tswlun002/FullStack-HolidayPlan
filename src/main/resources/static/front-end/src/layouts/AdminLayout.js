import { Navigate} from "react-router-dom";
import { Outlet } from "react-router-dom";

import {CreateAuthContext} from '../context/CreateAuthContext';
import {useContext} from 'react'

const AdminLayout =({children})=>{
    console.log("************************* On Admin layout *****************")
    console.log(children)
     const{userLoginState} = useContext(CreateAuthContext)
   //  if(!(userLoginState.isAuthenticated && userLoginState.userType==='ADMIN')) return <Navigate  to='/'/>;
     return <><Outlet/></>;

}
export default AdminLayout;