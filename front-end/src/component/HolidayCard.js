import {useState, useEffect} from 'react';
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
import  {FaTrash,FaMapMarkerAlt, FaMinus, FaPlus} from 'react-icons/fa'
import { FormControl,RadioGroup, FormControlLabel,Radio,FormLabel , Grid,Tooltip} from '@mui/material';
import {DeleteHolidayPlan,UpdateHolidayPlan} from '../utils/HolidayPlan';
import  UseAxiosPrivate from '../utils/UseAxiosPrivate';
import RedoIcon from '@mui/icons-material/Redo';
import {NavLink} from 'react-router-dom'



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

     const type = images[index]?.imageType;
     const IMG  = images[index]?.image;
    return `data:${type};base64, ${IMG}`;

}

export default function HolidayCard({data,index,deleteHolidayCard,updateHolidayCard}) {
  
  const priorityLevelRate = [1, 2, 3];
  const [expanded, setExpanded] = useState(false);
  if(Boolean(data.priorityLevel))data.priorityLevel = parseInt(data.priorityLevel);
  const priority_obj = (data.priorityLevel===1) ?priorityLevelRate[0] :(data.priorityLevel===2)
                                    ?priorityLevelRate[1] :(data.priorityLevel===3) ?priorityLevelRate[2]:null
  
  const [experience, setExperience] =useState(priority_obj);

  const useAxiosPrivate = UseAxiosPrivate();

  const [response, setResponse] = useState({iRequestError:false, isResponseSuccess:false,
                                             errorMessage:"",responseMessage:""
                                           });
  //const [isCardDeleted, setCardIsDeleted] = useState(false);
                                        




  const handleExperience = (event)=>{
        setExperience(parseInt(event.target.value));
        UpdateHolidayPlan( useAxiosPrivate,data.id, parseInt(event.target.value),setResponse);
        if(response.isResponseSuccess){
           updateHolidayCard(index);

        }
  }

/**
 * Delete holiday  plan
 * @param {*} event is the delete event
 */

  const handleDelete = async(event)=>{
       const results=await DeleteHolidayPlan(useAxiosPrivate,data.id,setResponse);
        if(results.isResponseSuccess){
           deleteHolidayCard(true);

       }else setResponse(results);

  }


  const PriorityComponent = ()=>{
        return(
        <FormControl sx={{marginRight:"auto"}}>
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
        maxWidth: 345 , padding:{sm:"0rem 1rem",xs:0},
        background: "linear-gradient(to right,rgba(97, 118, 175, 0.5),rgba(17, 170, 132, 0.85),rgba(48, 235, 57, 0.9),rgba(8, 241, 144, 0.6))",
        margin:"10px",    display: "inline-block"

    }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            <FaMapMarkerAlt/>
          </Avatar>
          
        }
        action={
          <Tooltip title="Duplicate Holiday">
          <NavLink 
            to={{
                pathname:"addHolidayPlan",
               
              }}
              state={{holidayPlan:data}}
              exact
          >
            <RedoIcon />
          </NavLink></Tooltip>
        }
    
        title={`${data.location}, ${data.city}`}
        subheader={`${data?.startDate?.substring(0,10)} to ${data?.endDate?.substring(0,10)}`}
      />
      {data.images?.length>0?
        <CardMedia sx={{backgroundSize:"cover",width:{sm:340,xs:330},height:194, backgroundRepeat: 'no-repeat'}} component="img" image={ ImageSlider(data.images)}/>:
        "No images"
      }



      <CardContent spacing={1} sx={{lineHeight:"1rem",display:"flex"}}>
            <Typography paragraph color="text.secondary">
             Event: {data.event}
            </Typography>

                <ExpandMore
                          onClick={handleExpandClick}
                          aria-label="show more"
                          key={data.id}
                          sx={{width:'10% ',justifyContent:"start",alignItems:"start",color:"blue"}}
                        >
                         {!expanded?<FaPlus />:<FaMinus/>}
               </ExpandMore>

        </CardContent>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
                  <Typography paragraph sx={{width:"100%"}}>
                    Description: {data.description}
                  </Typography>

            </CardContent>
        </Collapse>

      <CardActions >
        <Grid container spacing={1} >
          <Grid item sm={10.5} sx={{display:"flex",justifyContent:"center", alignItems:"center", }}>
                <PriorityComponent />
          </Grid>
          <Grid item sm={1.5} sx={{display:"flex",justifyContent:"end", alignItems:"end", minHeight:"1vh"}}>
            <IconButton size='small' variant="outlined" onClick={(e)=>handleDelete(e)} className="btn delete-btn"  style={{color:"red"}}>
              {<FaTrash/>}
            </IconButton>
          </Grid>
        </Grid>

      </CardActions>

    </Card>
  );
}