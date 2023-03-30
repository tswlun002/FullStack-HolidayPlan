import "./card.css"
import  {FaTrash,FaMapMarkerAlt} from 'react-icons/fa'
import { IconButton } from '@material-ui/core'
import {useState} from "react"
import { FormControl,RadioGroup, FormControlLabel,Radio,FormLabel, Paper } from '@mui/material';
import { FetchHolidayPlan,DeleteHolidayPlan,UpdateHolidayPlan } from '../utils/HolidayPlan';


const priorityLevelRate = [1, 2, 3];
const priorityLevelColor = ["green", "yellow", "orange","bisque"];



export default function({data,setData}){

    const[showDescr, setDesc] = useState(true)
    const showDescription = (prevState) => setDesc(!prevState)

    const stylePictureBackground = (data.pictureLink!==null && data.pictureLink!==undefined) ?{backgroundColor:"white"}:{backgroundColor:"bisque"}
    
    const icon = showDescr?"hide description":"show description"
    
    const [experience, setExperience] = (data.priorityLevel===1) ?useState(priorityLevelRate[0]) :(data.priorityLevel===2)
                                        ?useState(priorityLevelRate[1]) :(data.priorityLevel===3) ?useState(priorityLevelRate[2]):useState(null)

    const handleExperience = (event)=>{
        setExperience(parseInt(event.target.value))
        UpdateHolidayPlan(data.id, parseInt(event.target.value),setData);
    }

    const cardBackgroundColor =  ()=> experience===priorityLevelRate[2]?{backgroundColor:priorityLevelColor[2]}:
                                     experience===priorityLevelRate[1]?{backgroundColor:priorityLevelColor[1]}:
                                     experience===priorityLevelRate[0]?{backgroundColor:priorityLevelColor[0]}:
                                     {backgroundColor:priorityLevelColor[3]}
                    
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



    return (
       

            <Paper className="card" style={cardBackgroundColor()}>

               <div className="image-description">

                    <div className="card-image">
                        <img  style={stylePictureBackground}src={data.pictureLink} />
                    </div>
                    <div className="card-description">

                        <div className="location">
                            <IconButton variant="outlined"  style={{color: "black"}} 
                            className="btn email" size="medium">{<FaMapMarkerAlt/>}<p className="location-name">{data.location}</p></IconButton>
                        
                    
                        </div>
                            <h1 >{data.city}</h1>
                        <div className="dates">
                            <p >{data.startDate}</p>
                            <p > &nbsp;</p>
                            <p >{data.endDate}</p>
                        </div>

                        <p > Event:{data.event}</p>

                        <IconButton  className="btn more"variant="outlined" color="primary" style={{textAlign: "start"}}
                        onClick={()=>showDescription(showDescr)} size="small" >{icon}</IconButton>
                        {showDescr&&<p>{data.description}</p>}
                    </div>
                </div>


                <div className="card-actions">
                    <PriorityComponent className="priority-component"/>
                    <IconButton  variant="outlined"  onClick={(e)=>DeleteHolidayPlan(data.id,setData)}
                            className="btn delete-btn" size="small" style={{color:"red"}}>{<FaTrash/>}</IconButton>

                    </div>
            </Paper>
    

    )
}