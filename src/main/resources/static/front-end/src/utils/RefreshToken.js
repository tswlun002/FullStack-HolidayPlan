import { CreateAuthContext } from "../context/CreateAuthContext";
import {useContext} from 'react'
import axios from './Axios'
const UseRefreshToken = ()=>{
    const{ dispatchLogin} = useContext(CreateAuthContext);
    const refresh = async() =>{
        const response = await axios.get(
            '/holiday-plan/api/authenticate/refresh/',
            {
                withCredentials:true,
            }
        );
        dispatchLogin(
            {
                type:"LOGIN",
                payload:response
            }
        )


        return response.access_token;

    }
    return refresh;
}

export default UseRefreshToken;