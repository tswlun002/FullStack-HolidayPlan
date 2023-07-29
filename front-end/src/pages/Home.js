import { Box, InputAdornment,TextField,Stack } from '@mui/material';
import { makeStyles } from  "@mui/styles"
import Card from '../component/HolidayCard';
import {  useReducer, useEffect, useContext, useState} from "react"
import AddIcon from '@mui/icons-material/Add';
import {useNavigate} from 'react-router-dom';
import { FetchHolidayPlan} from '../utils/HolidayPlan';
import {CreateAuthContext} from '../context/CreateAuthContext';
import UsePrivateAxios from '../utils/UseAxiosPrivate'
import ColorButton from '../component/ColorButton';
import { ERROR_COLOR, LOADING_COLOR, SECONDARY_HEADER_COLOR } from '../utils/Constant';
import CustomerTypography from '../component/CustomerTypography';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterList from '../component/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import Divider from '@mui/material/Divider';




const useStyles = makeStyles({
  containerBox0:{
      margin:"8px",
      padding:"8px",
      display:"flex",
      flexFlow:"row wrap",
      alignItems:"start",
      
  },
}
); 
const Home = ()=>{
    const useAxiosPrivate = UsePrivateAxios();
    const{userLoginState} = useContext(CreateAuthContext)
    const [cards, dispatchCards] = useReducer((state,action)=>{
        console.log(action);
        switch(action.type){
         case "replace": return {...state, data:action.payload,iRequestError:false, isResponseSuccess:true};
         case "add":return {...state, data:[...state.data,action.payload],iRequestError:false, isResponseSuccess:true};
         case "error": return {...state, message:action.message,iRequestError:true, isResponseSuccess:false};
         case "dataChange": return {...state, iRequestError:false, isResponseSuccess:true};
         case "deleteHoliday": return {...state, data:[...action.payload],iRequestError:false, isResponseSuccess:true};
         
         default: return {...state} ;
      } 
    },
    
    {
      data:[],
      message:"Data is not available",
      iRequestError:false, isResponseSuccess:false
    }
  )

  const deleteHolidayCard = (index)=>{
        const isDataAvailable = cards.data.length>0?true:false;
        const data  = [...cards.data.slice(0, index), ...cards.data.slice(index+1)];
        dispatchCards({type:"deleteHoliday", payload:data, isDataAvailable:isDataAvailable});

  }

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


  //Make cards
  const CardsComponents  = cards.data.map((data,index)=>{
      if(data !==null){
        return <Card  updateHolidayCard={updateHolidayCard} index={index}
                key={data.id} deleteHolidayCard={deleteHolidayCard} data={data} />
    }

  } );
  console.log(cards);
  console.log(((cards.data.length===0) && !(cards.iRequestError||cards.isResponseSuccess) || cards.iRequestError));
  /*const useStyles = makeStyles({
    containerBox0:{
        margin:"8px",
        padding:"8px",
        display:"flex",
        flexFlow:"row wrap",
        alignItems:"start",
        justifyContent:(cards.data.length===0)||cards.isRequestError?"center":"start",
        
    },
  }
  ); */
  const classes = useStyles(); // ✅ This is safe because it is called inside ThemeProvider
  
  const [openFilter , setOpenFilter] = useState(false);
  
  const FILTERS = [{name:'city', label:"city"},{name:"location",label:'location'},{name:"startDate",label:'start date'},{name:"endDate",label:'end date'},{name:'event',label:"event"},{name:'priorityLevel',label:"priority"}]
   const getFilterField = (filter)=>{
          return [... new Set(cards.data.map((holiday)=>{ 

            if(filter==="startDate"||filter==="endDate"){
             
              return holiday[filter]&&JSON.stringify(holiday[filter]).substring(1,11)
            }
            else return holiday[filter]
          
          }))].map((field)=>{return {[filter]:field}});
   }

   console.log(getFilterField("location"));
  return (
    
    <>
        <AddMoreHolidayPlan isDataAvailable={cards.isResponseSuccess}  className="add-holiday-btn"/>
        {((cards.data.length===0) && !(cards.iRequestError||cards.isResponseSuccess) || cards.iRequestError)&&
          <CustomerTypography sx={{color:cards.iRequestError?ERROR_COLOR:LOADING_COLOR}}variant="h5" fontSize="0.8rem">
            {cards.iRequestError?cards.message:"Loading ..."}
          </CustomerTypography>
        }
   
    <Box  
           justifyContent={(cards.data.length===0)||cards.isRequestError?"center":"start"}
            className={classes.containerBox0}>


          <InputAdornment  position="start">
          {!openFilter&& <FilterAltIcon  sx={{color:SECONDARY_HEADER_COLOR, padding:"1rem 0rem"}}onClick={()=>setOpenFilter(()=>!openFilter)}/>
          }
        </InputAdornment>
          {
              openFilter&&<Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 0.5, sm: 1, md: 2 }}
              sx={{width:"100%"}}
              useFlexGap flexWrap="wrap"
              divider={<Divider orientation="vertical" flexItem />}
             >
              <FilterListIcon sx={{padding:"1.3rem 0rem"}}/>     
              {FILTERS.map((filter)=><FilterList label={filter.label} name={filter.name}Options={getFilterField(filter.name)} selectOption={()=>{}}/>)}
              <ClearIcon  sx={{color:SECONDARY_HEADER_COLOR, padding:"1.3rem 0rem"}}onClick={()=>setOpenFilter(()=>!openFilter)}/>
  
          </Stack>
        }
        {cards.isResponseSuccess&&CardsComponents}
      </Box>
    
  </>
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