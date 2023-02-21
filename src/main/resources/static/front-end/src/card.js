import "./card.css"
import  {FaTrash,FaMapMarkerAlt} from 'react-icons/fa'
import { IconButton } from '@material-ui/core'
import {useState} from "react"

const priorityLevelRate = [1, 2, 3];
const priorityLevelColor = ["green", "yellow", "orange","bisque"];



export default function({data,setData, deleteHolidayPlaData, updateHolidayPlanData}){
    const[showDescr, setDesc] = useState(true)
    const showDescription = (prevState) => setDesc(!prevState)

    const stylePictureBackground = (data.pictureLink.length===0) ?{backgroundColor:"white"}:{backgroundColor:"bisque"}
    
    const icon = showDescr?"hide description":"show description"
    
    const [experiece, setExperience] = (data.priorityLevel===1) ?useState(priorityLevelRate[0]) :(data.priorityLevel===2) 
                                        ?useState(priorityLevelRate[1]) :useState(priorityLevelRate[2])

    const handleExperience = (event)=>{
        setExperience(parseInt(event.target.value))
        updateHolidayPlanData(data.id, parseInt(event.target.value),setData);
    }

    const cardBackgroundColor =  ()=> experiece===priorityLevelRate[2]?{backgroundColor:priorityLevelColor[2]}:
                                     experiece===priorityLevelRate[1]?{backgroundColor:priorityLevelColor[1]}:
                                     experiece===priorityLevelRate[0]?{backgroundColor:priorityLevelColor[0]}:
                                     {backgroundColor:priorityLevelColor[3]}
                    

    return (
        <section className="container">

            <div className="card" style={cardBackgroundColor()}   key={data.id}>

               <div className="image-description">

                    <div className="card-image">
                        <img style={stylePictureBackground}src={data.pictureLink} />
                    </div>
                    <div className="card-description">

                        <div className="location">
                            <IconButton variant="outlined" color="primary"
                            className="btn email" size="large">{<FaMapMarkerAlt/>}</IconButton>
                        <p>{data.location}</p>
                    
                        </div>
                            <h1>{data.city}</h1>
                        <div className="dates">
                            <p>{data.startDate}</p>
                            <p> &nbsp;</p>
                            <p>{data.endDate}</p>
                        </div>

                        <p>Event:{data.event}</p>

                        <IconButton className="btn more"variant="outlined" color="primary" 
                        onClick={()=>showDescription(showDescr)} size="small" >{icon}</IconButton>
                        {showDescr&&<p>{data.description}</p>}
                    </div>
                </div>


                <div className="card-actions">

                    <fieldset className="rate-visit">
                            <legend>Priority Levels</legend>
                            <input type="radio" checked={experiece===priorityLevelRate[0]}  onChange={(event)=>{handleExperience(event)}} 
                            id="very-exciting" name={data.pictureLink} value={priorityLevelRate[0]} className="very-exciting" />
                            <label fohtmlForr="very-exciting">First</label>

                            <input type="radio" checked={experiece===priorityLevelRate[1]}  onChange={(event)=>{handleExperience(event)}} 
                                id="exciting" name={data.pictureLink} value={priorityLevelRate[1]} className="exciting" />
                            <label htmlFor="exciting">Second</label>

                            <input type="radio" checked={experiece===priorityLevelRate[2]} onChange={(event)=>{handleExperience(event)}} 
                                id="not-exciting" name={data.pictureLink} value={priorityLevelRate[2]} className="not-exciting" />
                            <label htmlFor="not-exciting">Third</label>

                        
                    </fieldset> 

                    <IconButton variant="outlined"  onClick={(e)=>deleteHolidayPlaData(data.id,setData)}
                            className="btn delete-btn" size="small" style={{color:"red"}}>{<FaTrash/>}</IconButton>

                    </div>
            </div>
        </section>

    )
}

