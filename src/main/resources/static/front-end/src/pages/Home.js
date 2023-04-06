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
                     <Typography align="center"><h2 style={{color:"white"}}>{errorMessage}</h2></Typography>
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
         case "error": return {...state, errorMessage:action.errorMessage,isDataAvailable:false}
         default: return {...state} ;
      } 
    },
    
    {
      array:[],
      errorMessage:"Data is not available",
      isDataAvailable:false
    }
  )


  //call fetch data on hooks
  useEffect(() =>{
      FetchHolidayPlan(useAxiosPrivate, setData)
  },[]);


  //Make cards
  const Cards  = Data.array.map((data)=>{
      if(data !==null){
        return <Card setData={setData} data={data} />
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
      <Button className="add-new-holiday"variant="contained"  
      style={ButtonPosition}
      onClick={()=>navigate("/home-user/addHolidayPlan")} size="small" >{<AddIcon/>}Add HolidayPlan</Button>)
  }

export default Home;