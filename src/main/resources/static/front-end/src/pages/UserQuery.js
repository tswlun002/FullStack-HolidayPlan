import { Box,Typography} from "@mui/material"
import { useReducer,useEffect ,useContext, useState} from "react";
import { FetchQueries } from "../utils/Query";
import QueryCard from '../component/QueryCard'
import  UseAxiosPrivate from '../utils/UseAxiosPrivate'
import {CreateAuthContext} from '../context/CreateAuthContext'


const UserQuery =  ()=>{
   console.log("Here on user query");
   const useAxiosPrivate = UseAxiosPrivate();
   const{userLoginState} = useContext(CreateAuthContext);


    const [queryData, dispatchQueryData] =  useReducer((state, action)=>{
        console.log(action);
        switch(action.type){
            case "replace": return {...state, array:[...action.payload],isDataAvailable:action.isDataAvailable};
            case "add":return {...state, array:[...state.array,action.payload],isDataAvailable:true};
            case "error": return {...state, errorMessage:action.errorMessage,isDataAvailable:false}
            default: return {...state}  
    }},{

        array:[],
        errorMessage:"Data is not available",
        isDataAvailable:false

    })



    useEffect(()=>{
        let isMounted=true;
        const controller=new AbortController();
        isMounted && FetchQueries(useAxiosPrivate, userLoginState.userType, dispatchQueryData, controller);
        return  ()=>{isMounted=false; controller.abort();}
    },[])
   const deleteQueryCard =(index)=>{
        const isDataAvailable = queryData.array?.length>0?true:false;
        const newQueryData  = [...queryData.array?.slice(0, index),...queryData.array?.slice(index+1)];
        dispatchQueryData({type:"replace", payload:newQueryData, isDataAvailable:isDataAvailable});

   }
   const updateQueryCard = (index)=>{
         console.log(`**************************** Solved ${index} **************`);
        const isDataAvailable = queryData.array?.length>0?true:false;
        const data  = queryData.array?.slice(index, index+1);
        data.queryStatus="SOLVED";
        let newQueryData  = [data,...queryData.array?.slice(0, index),...queryData.array?.slice(index+1)];
        dispatchQueryData({type:"replace", payload:newQueryData, isDataAvailable:isDataAvailable});
   }
    const Cards  = queryData.array.map((data, index)=>{
        return <QueryCard key={data.id} index={index} deleteQueryCard={deleteQueryCard} updateQueryCard={updateQueryCard}data={data}/>;
    })
    
    return (
        <Box   sx={{display:"flex",
                    justifyContent:"start",
                    alignItems:"start",
                    minHeight:"100vh",
                    flexFlow:"row wrap",
                    padding:"10% 0%"
                    }}
                >
            {!queryData.isDataAvailable?<Typography align="center" sx={{color:"red"}}>{queryData.errorMessage}</Typography>:Cards}

        </Box>
    )
}

export default  UserQuery;