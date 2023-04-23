import { CreateAuthContext } from "../context/CreateAuthContext";
import {useContext} from 'react'
import axios from './Axios'
const UseRefreshToken = ()=>{
    const{ dispatchLogin} = useContext(CreateAuthContext);


    const refresh = async() =>{

        const response = await  axios.get(
            '/holiday-plan/api/authenticate/refresh/',
            {
                withCredentials:true,



            }
        );

        console.log(response)

         dispatchLogin(
            {

                type:"UPDATE_TOKEN",
                payload:response.data?.tokens

            }
        )


        return response.data?.tokens?.access_token;

    }

    return refresh;



}

export default UseRefreshToken;