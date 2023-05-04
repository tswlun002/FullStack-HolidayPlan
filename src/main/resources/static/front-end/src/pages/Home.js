import { Box } from '@mui/system';
import { makeStyles } from  "@mui/styles"
import Card from '../component/HolidayCard';
import {  useReducer, useEffect, useContext} from "react"
import { Button } from '@material-ui/core'
import AddIcon from '@mui/icons-material/Add';
import {useNavigate} from 'react-router-dom';
import { FetchHolidayPlan} from '../utils/HolidayPlan';
import {CreateAuthContext} from '../context/CreateAuthContext';
import UsePrivateAxios from '../utils/UseAxiosPrivate'
import Typography from '@mui/material/Typography';
import ColorButton from '../component/ColorButton';

const useStyles = makeStyles({
  containerBox0:{
      margin:"8px",
      padding:"8px",
      display:"flex",
      flexFlow:"row wrap",
      alignContent:"flex-start",
      
  },
}
); 

function HomeContent({isDataAvailable,Cards, errorMessage}) {
  const classes = useStyles(); // ✅ This is safe because it is called inside ThemeProvider


  return <div>{!isDataAvailable?
                     <Typography align="center"><h2 style={{color:"red"}}>{`${errorMessage}, use the button below  to add HolidayPlan`}</h2></Typography>
                     :<Box className={classes.containerBox0}>
                           {isDataAvailable && Cards}
                       </Box>

  } </div>
}

const Home = ()=>{
    const useAxiosPrivate = UsePrivateAxios();
    const{userLoginState} = useContext(CreateAuthContext)

    const [Data, setData] = useReducer((state,action)=>{
        console.log(action);
        switch(action.type){
         case "replace": return {...state, array:[...action.payload],isDataAvailable:true};
         case "add":return {...state, array:[...state.array,action.payload],isDataAvailable:true};
         case "error": return {...state, errorMessage:action.errorMessage,isDataAvailable:false};
         case "dataChange": return {...state, isDataUpdated:true};
         case "deleteHoliday": return {...state, array:[...action.payload],isDataAvailable:action.payload.isDataAvailable};
         
         default: return {...state} ;
      } 
    },
    
    {
      array:[],
      errorMessage:"Data is not available",
      isDataAvailable:false,
      isDataUpdated:false,
    }
  )

  const deleteHolidayCard = (index)=>{
        const isDataAvailable = Data.array?.length>0?true:false;
        const data  = [...Data.array?.slice(0, index), ...Data.array?.slice(index+1)];
        setData({type:"deleteHoliday", payload:data, isDataAvailable:isDataAvailable});

  }

  const updateHolidayCard = (index)=>{
      setData({type:"dataChange"});
  }




  //call fetch data on hooks
  useEffect(() =>{
    let isMounted = true;
    const controller = new AbortController();
    isMounted && FetchHolidayPlan(useAxiosPrivate, setData,controller);
    return ()=>{isMounted=false; controller.abort();}
  },[]);


  //Make cards
  const Cards  = Data.array.map((data,index)=>{
      if(data !==null){
        return <Card  updateHolidayCard={updateHolidayCard} index={index}
                key={data.id} deleteHolidayCard={deleteHolidayCard} data={data} />
    }

  } );

  
  return (
    
    <div className="body">
        <AddMoreHolidayPlan isDataAvailable={Data.isDataAvailable}  className="add-holiday-btn"/>
        <HomeContent isDataAvailable={Data.isDataAvailable}  errorMessage={Data.errorMessage} Cards={Cards}/>
  </div>
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