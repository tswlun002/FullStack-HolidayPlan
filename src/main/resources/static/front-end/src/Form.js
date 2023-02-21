import "./Form.css"
import { Button } from '@material-ui/core'
import { useState } from "react"

const Form =(props)=>{
  
  const [mallName, setName] = useState('')
  const [location, setLocation] = useState('')
  const [startdate, setStartDate] = useState('')
  const [enddate, setEndDate] = useState('')
  const [description, setDescription] = useState('')
  const [event, setEvent] = useState('')
  const[priorityLevel, setPriorityLevel] = useState(props.data.priorityLevel)

  const [pictureLink, setImage] = useState('')

  const form=
      
       <main>

           <form className="form" onSubmit={(event)=>event.reset()}>
               <fieldset className="inputs">
                 <input type="text" name="name" placeholder="Enter location Name" className="name"  min={3}
                 onInput={event=>setName(event.currentTarget.value) }value={mallName}/>

                 <input type="text" name="location" placeholder="Enter Town " className="location" min={3} 
                 onInput={event=>setLocation(event.currentTarget.value)} value={location}/>

                 <input type="text" name="startdate" placeholder="start date" className="start-date"min={10} 
                 onInput={event=>setStartDate(event.currentTarget.value)} value={startdate}/>

                 <input type="text" name="enddate" placeholder="end date" className="end-date"min={10}
                 onInput={event=>setEndDate(event.currentTarget.value)} value={enddate}/>

                 <input type="text" name="event" placeholder="Enter event" className="event"min={5} 
                 onInput={event=>setEvent(event.currentTarget.value)} value={event}/>
                 
                 <input type="text" name="description" placeholder="Enter description" className="description"min={3} 
                 onInput={event=>setDescription(event.currentTarget.value)} value={description}/>

                 <input type="text" name="pictureLink" placeholder="Enter pictureLink mall" className="pictureLink"min={4}
                 onInput={event=>  setImage(event.currentTarget.value)} value={pictureLink}/>
                 <input type="number" name="priorityLevel" placeholder="Enter priorityLevel" className="priorityLevel"max={3} min={1} 
                 onInput={event=>  setPriorityLevel(parseInt(event.currentTarget.value))} value={priorityLevel}/>
                
                 <Button className="btn btn-primary" onClick={(event)=>{event.preventDefault(); StoreData()}}>Save</Button>
               </fieldset>
           </form>
       </main>
    

      //Extract data from form data and store data to Data state
      const StoreData = ()=>{
           const newData = {pictureLink:pictureLink, city:mallName,location:location, 
               description:description,startDate:startdate, endDate:enddate,event:event, priorityLevel:priorityLevel}
           if(mallName.length>0 && location.length>0 && description.length>0 && startdate.length>0
             && enddate.length>0 &&pictureLink.length>0 && event.length>0 && 0<priorityLevel<4){
              props.addData(newData);
              setName('')
              setLocation('')
              setDescription('')
              setStartDate('')
              setEndDate('')
              setImage('')
              setEvent('')
           }else alert("All fields are required");

      }
      
      return form;
   
}
export default Form;