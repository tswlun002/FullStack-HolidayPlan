import { Box, InputAdornment,Stack,FormControlLabel,Grid} from '@mui/material';
import { makeStyles} from  "@mui/styles"
import Card from '../component/HolidayCard';
import {  useReducer, useEffect, useContext, useState,useMemo} from "react"
import AddIcon from '@mui/icons-material/Add';
import {useNavigate} from 'react-router-dom';
import { FetchHolidayPlan, FilterHolidayPlan} from '../utils/HolidayPlan';
import {CreateAuthContext} from '../context/CreateAuthContext';
import UsePrivateAxios from '../utils/UseAxiosPrivate'
import ColorButton from '../component/ColorButton';
import { ERROR_COLOR, LOADING_COLOR, SECONDARY_HEADER_COLOR } from '../utils/Constant';
import CustomerTypography from '../component/CustomerTypography';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterList from '../component/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import Divider from '@mui/material/Divider';
import {Switch, IconButton} from '@mui/material';



const useStyles = makeStyles({
  containerBox0:{
      margin:"8px", padding:"8px", display:"flex",
      flexFlow:"row wrap", alignItems:"start",
      
  },
}
); 
const Home = ()=>{
    
    const useAxiosPrivate = UsePrivateAxios();
    const{userLoginState} = useContext(CreateAuthContext)
    const CARDS_INIT_STATE={data:[],  message:"", iRequestError:false, isResponseSuccess:false}
    const [cards, dispatchCards] = useReducer((state,action)=>{
        switch(action.type){
         case "replace": return {...state, data:action.payload,iRequestError:false, isResponseSuccess:true};
         case "add":return {...state, data:[...state.data,action.payload],iRequestError:false, isResponseSuccess:true};
         case "error": return {...state, message:action.message,iRequestError:true, isResponseSuccess:false};
         case "dataChange": return {...state, iRequestError:false, isResponseSuccess:true};
         case "deleteHoliday": return {...state, data:[...action.payload],iRequestError:false, isResponseSuccess:true};
         
         default: return {...state} ;
      } 
    },
    CARDS_INIT_STATE
  )
  const FILTER_INIT_STATE={data:[],city:[], location:[],startDate:[],endDate:[], event:[],priorityLevel:[], message:"Data is not available",iRequestError:false, isResponseSuccess:false}
  const[filterIsChecked, setFilterIsChecked] = useState(false);
  const[filterObject, setFilterObject] = useReducer((state, action)=>{return {...state, ...action}},FILTER_INIT_STATE);

  const deleteHolidayCard = (index)=>{
        const isDataAvailable = cards.data?.length>0?true:false;
        const data  = [...cards.data.slice(0, index), ...cards.data.slice(index+1)];
        dispatchCards({type:"deleteHoliday", payload:data, isDataAvailable:isDataAvailable});

  }
   
  //update cards
  const updateHolidayCard = (index)=>{
      dispatchCards({type:"dataChange"});
  }

  //call fetch data on hooks
  useEffect(() =>{
    let isMounted = true;
    const controller = new AbortController();
    
    isMounted && FetchHolidayPlan(useAxiosPrivate, dispatchCards,controller);
    
    return ()=>{isMounted=false; controller.abort();}
  },[]);

  //Memorize data 
  const displayedCards = useMemo(
    () => {return filterIsChecked?filterObject.data:cards.data},
    [filterIsChecked,cards,filterObject]
  );

  //Make cards
  const CardsComponents  = displayedCards.map((data,index)=>{
      return(data !==null)?
      <Card  updateHolidayCard={updateHolidayCard} index={index}
                key={data.id} deleteHolidayCard={deleteHolidayCard} data={data} />
      :[]

  } );

  const classes = useStyles(); // ✅ This is safe because it is called inside ThemeProvider
  
  const [openFilter , setOpenFilter] = useState(false);
  
  const FILTERS = [{name:'city', label:"city"},{name:"location",label:'location'},{name:"startDate",label:'start date'},{name:"endDate",label:'end date'},{name:'event',label:"event"},{name:'priorityLevel',label:"priority"}]
   const getFilterField = (filter)=>{
          return [...new Set(displayedCards.map((holiday)=>{ 

            if(filter==="startDate"||filter==="endDate"){
             
              return holiday[filter]&&JSON.stringify(holiday[filter]).substring(1,11)
            }
            else return holiday[filter]
          
          }))].map((field)=>{return {[filter]:field}});
   }
   

   const filter= ()=>{
      setFilterIsChecked(()=>!filterIsChecked);
      setFilterObject({data:[]});
   }  

  //call filter data 
  useEffect(() =>{
      let isMounted = true;
      const controller = new AbortController();
      if(filterIsChecked){
          isMounted &&FilterHolidayPlan(useAxiosPrivate,userLoginState.username ,filterObject,setFilterObject,controller);
      
      }
    return ()=>{isMounted=false; controller.abort();}
  },[filterIsChecked,filterObject.city,filterObject.location,filterObject.startDate,filterObject.endDate,filterObject.event,filterObject.priorityLevel]);
  

  //clears filters
  const clearFilter=()=>{
        setOpenFilter(()=>!openFilter);
        setFilterIsChecked(false);
        setFilterObject(FILTER_INIT_STATE);
  }
  
  //Creates filter component
  const Filters =FILTERS.map((filter,index)=>{
     return <Grid item sx={{display:'flex', justifyContent:'start',alignItems:"start",minHeight:'5vh'}}>
      <FilterList 
              filtered={filterIsChecked} 
              key={index} label={filter.label}
               name={filter.name}Options={getFilterField(filter.name)}
                selectOption={setFilterObject}
    /></Grid>
  })
  
  return (
    
    <Grid  spacing={1} sx={{p:2}}>
        <Grid item sm={12}><AddMoreHolidayPlan isDataAvailable={cards.isResponseSuccess}  className="add-holiday-btn"/></Grid>
        
           {  
           cards.isResponseSuccess&&
               <Grid container item spacing={0} sx={{display:"flex", justifyContent:"start", alignItems:"start",minHeight:"1vh"}} position="start">
                  {
                    !openFilter&& 
                    <Grid item>
                        <IconButton 
                          sx={{justifyContent:"center",borderRadius:1,width:"3rem",
                          fontSize:"1rem", alignItems:"center", maxWidth:"100%"}} 
                          arial-label="filter"
                          onClick={()=>setOpenFilter(()=>!openFilter)}>
                            
                            <FilterAltIcon  sx={{color:SECONDARY_HEADER_COLOR, }}/>{openFilter?"":"Filter"}
                        </IconButton>
                    </Grid>
                  }
                  
                
                
                  {
                    openFilter&&
                    <Grid container item>
                      <Grid item >
                        <ClearIcon  sx={{color:SECONDARY_HEADER_COLOR, padding:"1.3rem 0rem"}}onClick={clearFilter}/>
                        <Divider orientation="vertical"  variant="middle" flexItem />

                      </Grid>
                      {Filters}

                      <Grid item>
                          <Divider orientation="vertical"  variant="middle" flexItem />
                          <FormControlLabel  sx={{width:"2.5rem"}} control={<Switch   checked={filterIsChecked} onChange={filter}
                          inputProps={{ 'aria-label': 'controlled' }}/>} label="Filter" />
                      </Grid>
                    </Grid>


                     
                    
                  }
          </Grid>
          
          }
          
         
    <Grid item sm={12}>
       {
            ( ((cards.data.length===0) && !(cards.iRequestError||cards.isResponseSuccess) ) || cards.iRequestError )&&
            <CustomerTypography sx={{color:cards.iRequestError?ERROR_COLOR:LOADING_COLOR,fontSize:{sm:"0.8rem",md:"1rem"}}}variant="h5" >
              {cards.iRequestError?cards.message:"Loading ..."}
            </CustomerTypography>
          }
    </Grid>
    <Grid item sm={12}
          className={classes.containerBox0}
          sx={{minHeight:{md:"100vh",sm:0}, 
          justifyContent:(cards.data.length===0)||cards.isRequestError?"center":"start",
           display:{xs:"block",sm:"flex"}}}
      >   
          {cards.isResponseSuccess&&CardsComponents}
    </Grid>  
  </Grid>
  
  )

}

const AddMoreHolidayPlan = ({isDataAvailable}) => {

     const navigate = useNavigate();
     const ButtonPosition= isDataAvailable?
    {bottom: "5%", right: "3%",}:{ bottom: "20%", right: "50%"};

    return (
      <ColorButton className="add-new-holiday"variant="contained"
      style={ { ...ButtonPosition, maxWidth:"11rem",
                    color: "white",   zIndex:1,position:"fixed",
                    boxShadow: "inset 0 0 16px rgba(0, 0, 0, 0.5)" ,
                    cursor: "pointer"}}

      onClick={()=>navigate("/home-user/addHolidayPlan")} size="small" >{<AddIcon/>}Add HolidayPlan</ColorButton>)
  }

export default Home;