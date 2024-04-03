import { CreateAuthContext } from "../context/CreateAuthContext";
import {useContext} from 'react'
import axios from './Axios'
const UseRefreshToken = ()=>{
   // const{ dispatchLogin} = useContext(CreateAuthContext);


    const refresh = async() =>{

        const response = await  axios.get(
            '/holiday-plan/api/authenticate/accessToken/refresh/',
            {
                withCredentials:true,

            }
        );
        return response.data?.tokens;
    }

    return refresh;
}

export default UseRefreshToken;
