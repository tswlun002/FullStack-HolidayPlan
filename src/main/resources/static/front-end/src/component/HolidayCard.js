import {useState,useContext, useEffect} from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import  {FaTrash,FaMapMarkerAlt} from 'react-icons/fa'
import { FormControl,RadioGroup, FormControlLabel,Radio,FormLabel } from '@mui/material';
import {DeleteHolidayPlan,UpdateHolidayPlan} from '../utils/HolidayPlan';
import {CreateAuthContext} from '../context/CreateAuthContext';
import  UseAxiosPrivate from '../utils/UseAxiosPrivate';


const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
    })(({ theme, expand }) => ({
      transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
}));
function ImageSlider(images) {
// Create state variables for the index and image array
    const [index, setIndex] = useState(0);

    // Use useEffect to increment the index and update the image every 5 seconds
    useEffect(() => {
    const intervalId = setInterval(() => {
    setIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(intervalId);
    }, []);

     const type = images[index].imageType;
     const IMG  = images[index].image;
    return `data:${type};base64, ${IMG}`;

}

export default function HolidayCard({data,index,deleteHolidayCard,updateHolidayCard}) {
  const{userLoginState} = useContext(CreateAuthContext);
  const priorityLevelRate = [1, 2, 3];
  const priorityLevelColor = ["green", "yellow", "orange","bisque"];

  const [expanded, setExpanded] = useState(false);

  const priority_obj = (data.priorityLevel===1) ?priorityLevelRate[0] :(data.priorityLevel===2)
                                    ?priorityLevelRate[1] :(data.priorityLevel===3) ?priorityLevelRate[2]:null
  
  const [experience, setExperience] =useState(priority_obj);

  const useAxiosPrivate = UseAxiosPrivate();

  const [response, setResponse] = useState({iRequestError:false, isResponseSuccess:false,
                                             errorMessage:"",responseMessage:""
                                           })




  const handleExperience = (event)=>{
        setExperience(parseInt(event.target.value));
        UpdateHolidayPlan( useAxiosPrivate,data.id, parseInt(event.target.value),setResponse);
        if(response.isResponseSuccess){
           updateHolidayCard(index);

        }else alert("Failed to update");
  }

  const handleDelete = (event)=>{
        DeleteHolidayPlan(useAxiosPrivate,data.id,setResponse);
        if(response.isResponseSuccess){
           deleteHolidayCard(index);

       }else alert("Failed to delete");

  }



  const cardBackgroundColor =  ()=> experience===priorityLevelRate[2]?{backgroundColor:priorityLevelColor[2]}:
  experience===priorityLevelRate[1]?{backgroundColor:priorityLevelColor[1]}:
  experience===priorityLevelRate[0]?{backgroundColor:priorityLevelColor[0]}:{backgroundColor:priorityLevelColor[3]}

  const PriorityComponent = ()=>{
        return(
        <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group">priorityLevel</FormLabel>
            <RadioGroup  className='radio-group'
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                onChange={(event)=>{handleExperience(event)}}
                value={experience}
                >
                <div className='radio-group'style={{display:"flex"}}>
                    <FormControlLabel value={priorityLevelRate[0]}  control={<Radio  />} label="1" />
                    <FormControlLabel value={priorityLevelRate[1]}  control={<Radio  />} label="2" />
                    <FormControlLabel value={priorityLevelRate[2]}  control={<Radio  />} label="3" />
                </div>
            </RadioGroup>
        </FormControl>)
  }




  const handleExpandClick = () => {
    setExpanded(!expanded);
  };




  return (
    <Card sx={
    {
        maxWidth: 345 , padding:"0rem 1rem",
        background: "linear-gradient(to right,rgba(97, 118, 175, 0.5),rgba(17, 170, 132, 0.85),rgba(48, 235, 57, 0.9),rgba(8, 241, 144, 0.6))",
        margin:"10px",    display: "inline-block"

    }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            <FaMapMarkerAlt/>
          </Avatar>
        }
    
        title={data.location}
        subheader={`${data.city} from ${data.startDate.substring(0,10)} to ${data.endDate.substring(0,10)}`}
      />
      <CardMedia component="img" height="194" src={ ImageSlider(data.images)}/>



      <CardContent>
        <Typography variant="body2" color="text.secondary">
         Event: {data.event}
        </Typography>
      </CardContent>
      <CardActions spacing={2} sx={{display:"flex"}}>
        <PriorityComponent />
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
          key={data.id}
        >
          <ExpandMoreIcon/>
        </ExpandMore>

      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>
            Description: {data.description}
          </Typography>

        </CardContent>
        <CardActions>
            <IconButton sx={{marginRight:"auto",
                marginLeft:"auto"}} variant="outlined"
                onClick={(e)=>handleDelete(e)}
                className="btn delete-btn" size="small" style={{color:"red"}}>{<FaTrash/>}
            </IconButton>
        </CardActions>

      </Collapse>
    </Card>
  );
}