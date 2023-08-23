import { Grid,TextField,InputAdornment, IconButton,Divider} from "@mui/material"
import { useReducer,useEffect ,useContext, useMemo, useState} from "react";
import { FetchQueries } from "../utils/Query";
import QueryCard from '../component/QueryCard'
import  UseAxiosPrivate from '../utils/UseAxiosPrivate'
import {CreateAuthContext} from '../context/CreateAuthContext'
import { ERROR_COLOR, LOADING_COLOR,SUCCESS_COLOR } from "../utils/Constant";
import CustomerTypography from "../component/CustomerTypography";
import ClearIcon from '@mui/icons-material/Clear';
import FilterAltIcon from '@mui/icons-material/FilterAlt';


const filterQuery=({queryData, searchText})=>{
    
     if(searchText===null || searchText?.trim()==='') return []
    
    return queryData?.filter((query)=>{
       
        return (query.queryStatus?.indexOf(searchText?.toUpperCase())>-1)||
               (query.querySummary?.toLowerCase().indexOf(searchText?.toLowerCase())>-1 )
            ;
    })  

    


}

const UserQuery =  ()=>{
   const useAxiosPrivate = UseAxiosPrivate();
   const{userLoginState} = useContext(CreateAuthContext);
   const[isFilterOpen, setFilterOpen]=useState(false);
   const[searchText, setSearchText]=useState('');
    const [query, dispatchQuery] =  useReducer((state, action)=>{

        switch(action.type){

            case "loading": return{...state,...action}
            case "replace": return {...state, data:[...action.payload],isRequestError:false,isRequestSuccessful:true};
            case "add":return {...state, data:[...state.data,...action.payload],message:action.message,isRequestError:false,isRequestSuccessful:true};
            case "error": return {...state,message:action.message,isRequestError:true,isRequestSuccessful:false}
            default: return {...state}  
    }},{
        
        data:[],
        message:"",
        isRequestError:false,
        isRequestSuccessful:false

    })
    
    const fetchAdminQueries = async(controller)=>{
        const results_1     = await FetchQueries(useAxiosPrivate, controller,true, 'ACTIVE');
        const results_2     = await FetchQueries(useAxiosPrivate, controller,true, 'PROGRESS');

        if(results_1?.type==='replace'||results_2?.type==='replace'){
            dispatchQuery(results_1);
            if(results_2?.type==='replace'){
               dispatchQuery({type:'add', payload:results_2?.payload});
            }
            else dispatchQuery(results_2)

        }
        else {
           dispatchQuery(results_1);
           dispatchQuery(results_2)
        }
    }


    const fetchUserQueries = async(controller)=>{
        const results_1   = await FetchQueries(useAxiosPrivate, controller);
        dispatchQuery(results_1);
        
    }

   

    useEffect(()=>{
       
        let isMounted=true;
        const controller=new AbortController();
        (isMounted&&userLoginState?.roles.find(role=>role.name==="ADMIN"))?fetchAdminQueries(controller):fetchUserQueries(controller);
        
        return  ()=>{
            isMounted=false; controller.abort(); 
            setTimeout(()=>{
                dispatchQuery({type:"loading", isRequestError:false, isRequestSuccessful:false, message:""});
            },5000)
        }
    },[])
   const deleteQueryCard =(index)=>{
        const isRequestError = query.data?.length>0?true:false;
        const newQueryData  = [...query.data?.slice(0, index),...query.data?.slice(index+1)];
        dispatchQuery({type:"replace", payload:newQueryData, isRequestError:isRequestError});

   }
  
   const QueryData = useMemo(()=>{
            return (isFilterOpen&&searchText?.trim()!=='')?
                    filterQuery({queryData:query.data, searchText:searchText}):query.data},
            [query.data,searchText]
    );

    const Cards  = QueryData?.map((data, index)=>{
        return <QueryCard key={data.id} index={index} deleteQueryCard={deleteQueryCard} data={data}/>;
    })
    
    return (
        <Grid container sx={{p:2}}spacing={2}    
        >   
        <Grid item sm={12}>
            <TextField
                sx={{
                   
                    borderRadius:"2rem", width:{md:isFilterOpen?"30%":'6rem', sm:isFilterOpen?'100%':'3rem'},
                    '& .MuiOutlinedInput-root': {'& fieldset': {
                        borderRadius:"2rem",
                    },
                    
                    '&:hover fieldset': {
                        border:"0.8px solid blueviolet",
                
                    
                    },
                    '&.Mui-focused fieldset': {
                        border:"0.8px solid blueviolet",
                    }
                
                }
                 
                }}
                size="small"
                focus={isFilterOpen}
                placeholder={`Filter ${isFilterOpen?'by status, summary':''}`}
                value={searchText}
                InputProps={{
                    startAdornment: (
                        <InputAdornment sx ={{padding:"1rem 0rem", color: (theme) =>theme.palette.grey[350],}} position="start">
                            <FilterAltIcon/>
                        </InputAdornment>
                        ),
                     endAdornment:(
                        isFilterOpen&&<InputAdornment sx ={{padding:"1rem 0rem",m:1}} position="start">
                       
                        {
                            
                            <IconButton 
                                sx={{borderRadius:1, backgroundColor:'transparent'}}
                                onClick={()=>{
                                    setSearchText('');
                                    setFilterOpen(false);
                                }}
                            >
                                 <Divider orientation="vertical" flexItem />
                                 <ClearIcon/>
                            </IconButton>
                        }
                    </InputAdornment>
                    )
                }}
                onClick={()=>{(!isFilterOpen)&&setFilterOpen(true)}}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key !== "Escape") {
                    e.stopPropagation();
                    }
                }}
            
            />
        </Grid>
            <Grid item sm={12}>{
                
                ((query.data.length===0)||query.isRequestError||query.isRequestSuccessful)&&
                    <CustomerTypography 
                        variant="h5" 
                        align="center"
                        sx={{color:query.isRequestError?ERROR_COLOR:(query.data.length===0)?LOADING_COLOR:SUCCESS_COLOR,fontSize:{sm:"0.8rem",md:"1rem"}}}
                    >
                        {(query.data.length===0)&&!(query.isRequestError||query.isRequestSuccessful)?"Loading ...":query.message}
                    </CustomerTypography>
            }
            </Grid>
            <Grid 
              display={{sm:"block",md:"flex", justifyContent:(query.data.length===0)||query.isRequestError?"center":"start",
              alignItems:"start",minHeight:"100vh"
            }}
             
              item  sm={12}>
            {
                Cards
                
            }
            </Grid>

        </Grid>
    )
}

export default  UserQuery;