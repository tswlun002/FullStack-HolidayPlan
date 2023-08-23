import {getErrorMessage} from './Error'
import axios from './Axios'
export default function FetchAppData(dispatchAppData,controller){
            const API = `/holiday-plan/api/app-details/?name=LT HOLIDAY-PLAN`;
            axios.get(API, {signal:controller.signal})
            .then(response =>
                {  
                  
                  if(response.ok || response.status===200){
                        dispatchAppData({data:response.data,isRequestSuccessful:true,isRequestError:false });
         
                  }
         
                }
            ).catch(err =>
              {
                 if(!err?.response.ok && err.name!=="AbortErr"){
                      let errorMessage =null;
                      if(err.response.status===404){
                       
                        errorMessage  ="Invalid credentials";
                      }
                      else if(err.response.status===401){
                           errorMessage  ="Denied access";
                      }
                      else{
                            
                            errorMessage  = getErrorMessage(err);
                      }
                      dispatchAppData({errorMessage:errorMessage, isRequestSuccessful : false,isRequestError:true})
                 }else dispatchAppData({errorMessage:"Server Error",  isRequestSuccessful : false,isRequestError:true})
         
              }
            )

}