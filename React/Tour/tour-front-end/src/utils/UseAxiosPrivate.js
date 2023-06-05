import { AxiosPrivate } from "./Axios";
import { useEffect,useContext } from "react";
import UseRefreshToken from "./RefreshToken";
import { CreateAuthContext } from "../context/CreateAuthContext";

const UseAxiosPrivate = ()=>{
    const{userLoginState} =  useContext(CreateAuthContext);
    const refresh = UseRefreshToken();
    
    useEffect(()=>
        {
            const requestInterceptor = AxiosPrivate.interceptors.request.use(
                config=> {
                    if(!config.headers['Authorization']){
                        config.headers['Authorization'] =`Bearer ${userLoginState.access_token}`;
                    }
                    return config;
                },
                (error)=>Promise.reject(error)
            )
        
            const responseInterceptor = AxiosPrivate.interceptors.response.use(
                response=>response, 
                async (error)=> {
                    console.log(error.config);

                    if(error.config.url==='/holiday-plan/api/holiday/save/'){
                                            error.config.headers['Content-Type']="multipart/form-data";
                                            error.config.headers['Accept']='application/json';
                    }
                    console.log(error.config);

                    const previousRequest  = error?.config
                    if(error?.response?.status===403 && !previousRequest?.sent) {
                        previousRequest.sent = true;
                        const accessToken = await refresh();
                        console.log(accessToken);
                        previousRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                        console.log(previousRequest.headers);
                        console.log(previousRequest);

                        return AxiosPrivate(previousRequest);
                    }
                    console.log(error)
                    return Promise.reject(error);
                }

            )
            return ()=>{
                AxiosPrivate.interceptors.request.eject(requestInterceptor);
                AxiosPrivate.interceptors.response.eject(responseInterceptor);
            }

            }
        ,[userLoginState, refresh]
    );

    return AxiosPrivate;

}
  
export default UseAxiosPrivate;

