import { Box,Typography} from "@mui/material"
import { useReducer,useEffect ,useContext, useState} from "react";
import { FetchQueries } from "../utils/Query";
import QueryCard from '../component/QueryCard'
import  UseAxiosPrivate from '../utils/UseAxiosPrivate'
import {CreateAuthContext} from '../context/CreateAuthContext'
import { ERROR_COLOR, LOADING_COLOR, SECONDARY_COLOR, SUCCESS_COLOR } from "../utils/Constant";


const UserQuery =  ()=>{
   console.log("Here on user query");
   const useAxiosPrivate = UseAxiosPrivate();
   const{userLoginState} = useContext(CreateAuthContext);


    const [query, dispatchQuery] =  useReducer((state, action)=>{
        console.log(action);

        switch(action.type){
            case "loading": return{...state,...action}
            case "replace": return {...state, data:[...action.payload],isRequestError:false,isRequestSuccessful:true};
            case "add":return {...state, data:[...state.data,action.payload],isRequestError:false,isRequestSuccessful:true};
            case "error": return {...state,message:action.message,isRequestError:true,isRequestSuccessful:false}
            default: return {...state}  
    }},{
        
        data:[],
        message:"",
        isRequestError:false,
        isRequestSuccessful:false

    })



    useEffect(()=>{
       
        let isMounted=true;
        const controller=new AbortController();
        isMounted && FetchQueries(useAxiosPrivate, userLoginState.roles, dispatchQuery, controller);
        return  ()=>{
            isMounted=false; controller.abort(); 
            
        }
    },[])
   const deleteQueryCard =(index)=>{
        const isRequestError = query.data?.length>0?true:false;
        const newQueryData  = [...query.data?.slice(0, index),...query.data?.slice(index+1)];
        dispatchQuery({type:"replace", payload:newQueryData, isRequestError:isRequestError});

   }
   const updateQueryCard = (index)=>{
        const isRequestError = query.data?.length>0?true:false;
        const data  = query.data?.slice(index, index+1);
        data.queryStatus="SOLVED";
        let newQueryData  = [data,...query.data?.slice(0, index),...query.data?.slice(index+1)];
        dispatchQuery({type:"replace", payload:newQueryData, isRequestError:isRequestError});
   }
    const Cards  = query.data.map((data, index)=>{
        return <QueryCard key={data.id} index={index} deleteQueryCard={deleteQueryCard} updateQueryCard={updateQueryCard}data={data}/>;
    })
    
    return (
        <Box   sx={{display:"flex",
                    justifyContent:(query.data.length===0)||query.isRequestError?"center":"start",
                    alignItems:"start",
                    minHeight:"100vh",
                    flexFlow:"row wrap",
                    padding:"5% 0%"
                    }}
                >
            {
                
                ((query.data.length===0)||query.isRequestError||query.isRequestSuccessful)&&
                    <Typography 
                        variant="h5" 
                        align="center"
                        sx={{color:query.isRequestError?ERROR_COLOR:(query.data.length==0)?LOADING_COLOR:SUCCESS_COLOR}}
                    >
                        {(query.data.length===0)&&!(query.isRequestError||query.isRequestSuccessful)?"Loading ...":query.message}
                    </Typography>
            }
            {
                Cards
                
            }

        </Box>
    )
}

export default  UserQuery;