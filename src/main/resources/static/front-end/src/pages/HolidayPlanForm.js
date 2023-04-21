import "./HolidayPlanForm.css"
import {Paper,Typography,FormControl,RadioGroup, FormControlLabel,Radio,FormLabel,Box,Card,CardContent,CardActions}  from '@mui/material';
import CssTextField from '../component/CssTextField';
import ColorButton from '../component/ColorButton';
import { useReducer, useContext, useState} from "react"
import {CreateAuthContext} from '../context/CreateAuthContext';
import {AddHolidayPlan} from '../utils/HolidayPlan';
import UseAxiosPrivate from '../utils/UseAxiosPrivate'
import CustomerTypography from '../component/CustomerTypography'




const HolidayPlanForm =()=>{
      const { dispatchLogin } = useContext(CreateAuthContext);
      const  useAxiosPrivate=UseAxiosPrivate();

       const [dateType1, setDateType1]= useState("text");
      const [dateType, setDateType]= useState("text");



  //Get HolidayPlan data from Form
  const[HolidayPlanData, DispatchHolidayPlanData] = useReducer((state, action)=>{
    return {...state,...action,}
  },
    {  location:"",city: "",startDate: "",endDate:"",event:"",description:"",pictureLink:"",
       priorityLevel:"",isDataCorrect:true,errorMessage:""}
    )

  //Extract data from form data and store data to Data state
  const StoreData = ()=>{
      AddHolidayPlan(useAxiosPrivate,HolidayPlanData, DispatchHolidayPlanData)
  }

  
   const isEmpty= (elementInputData)=>elementInputData.trim()==="";



   const OnSubmit= (e)=>{
        e.preventDefault();
        const isDataValid  = ()=>{
           return !( isEmpty(HolidayPlanData.location) && isEmpty(HolidayPlanData.city) &&
            isEmpty(HolidayPlanData.startDate) && isEmpty(HolidayPlanData.endDate)&&
            isEmpty(HolidayPlanData.description) &&isEmpty(HolidayPlanData.pictureLink)&&
            isEmpty(HolidayPlanData.priorityLevel))
        }

        if(isDataValid()){

           const store = async ()=>{
                await StoreData()
           }

            store()
           if(HolidayPlanData.isDataCorrect)
           setTimeout(()=>{
              DispatchHolidayPlanData(
                {
                  location: "",
                  city: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                  event: "",
                  pictureLink: "",
                  priorityLevel: "",

                }
              )

           },2000);
        }else{

             console.log(HolidayPlanData)
             DispatchHolidayPlanData({isDataCorrect:false, errorMessage:"All data is required"})
        }

   }

  return (
      <Box display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
            >
            <Card sx={{ maxWidth: 400,display:"block"}}>
                <CardContent>
                    <CustomerTypography sx={{alignText:"centre"}} className="heading">Add Holiday</CustomerTypography>
                    <form className="holiday-plan-form">
                         {
                            !HolidayPlanData.isDataCorrect &&
                            <Typography align="center"sx={{color:"red"}}>
                            {HolidayPlanData.errorMessage}
                            </Typography>
                         }
                        <CssTextField
                        required
                            id="demo-helper-text-aligned"
                            label="Location"
                            variant="outlined"
                            name="location"
                            type="text"  placeholder="Enter location name" className="location-input"
                            value={HolidayPlanData.location}
                            onChange={(e)=>DispatchHolidayPlanData({isDataCorrect:true, location:e.currentTarget.value})}

                          />

                        <CssTextField
                            required
                            id="demo-helper-text-aligned"
                            label="City"
                            variant="outlined"
                            name="city"
                            type="text"placeholder="Enter city " className="city" min={3}
                            onChange={(e)=>DispatchHolidayPlanData({isDataCorrect:true,city:e.currentTarget.value}) }
                            value={HolidayPlanData.city}
                            />

                        <CssTextField
                              required


                            id="demo-helper-text-aligned"
                            label="Start Date"
                            variant="outlined"
                            name="startDate"
                             onClick={()=>setDateType1("date")}
                             onBlur={()=>{setDateType1("text"); console.log("abort")}}
                            type={dateType1}   className="start-date"min={10}
                            onChange={event=>DispatchHolidayPlanData({isDataCorrect:true,startDate:event.currentTarget.value}) }
                            value={HolidayPlanData.startDate}

                            />

                        <CssTextField

                          required

                          id="demo-helper-text-aligned"
                          label="End Date"
                          variant="outlined"
                          name="endDate"

                           onClick={()=>setDateType("date")}
                           onBlur={()=>{setDateType("text"); console.log("abort")}}
                           type={dateType}  className="end-date"min={10}
                          onChange={event=>DispatchHolidayPlanData({isDataCorrect:true,endDate:event.currentTarget.value}) }
                          value={HolidayPlanData.endDate}
                          />

                        <CssTextField

                            required

                            id="demo-helper-text-aligned"
                            label="Event"
                            variant="outlined"

                            type="text" name="event" placeholder="Enter event" className="event"min={5}
                            onChange={(e)=>DispatchHolidayPlanData({isDataCorrect:true,event:e.currentTarget.value}) }
                            value={HolidayPlanData.event}
                          />

                        <CssTextField

                            required
                            id="demo-helper-text-aligned"
                            label="description"
                            variant="outlined"

                            type="text" name="description" placeholder="Enter description" className="description"min={3}
                            onChange={(e)=>DispatchHolidayPlanData({isDataCorrect:true,description:e.currentTarget.value}) }
                            value={HolidayPlanData.description}
                          />


                        <CssTextField
                            required

                            id="demo-helper-text-aligned"
                            label="Link Picture"
                            variant="outlined"

                            type="text" name="pictureLink" placeholder="Enter pictureLink mall" className="pictureLink"min={4}
                            onChange={(e)=>DispatchHolidayPlanData({isDataCorrect:true,pictureLink:e.currentTarget.value}) }
                            value={HolidayPlanData.pictureLink}
                          />

                        <PriorityLevelComponent HolidayPlanData={HolidayPlanData}DispatchHolidayPlanData={DispatchHolidayPlanData}/>
                        <ColorButton style={{marginTop:"15px"}} type="submit" onClick={(e)=>OnSubmit(e)}
                        className="btn btn-primary" >Save</ColorButton>

                    </form>

                 </CardContent>
          </Card>
       </Box>
    
  )
    

      
      
     
   
}

const PriorityLevelComponent = ({HolidayPlanData, DispatchHolidayPlanData})=>{
  return(
      <FormControl required>
          <FormLabel id="demo-controlled-radio-buttons-group" style={{marginTop:"10px"}}>Priority</FormLabel>
          <RadioGroup  className='radio-group'
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              onChange={(e)=>DispatchHolidayPlanData({priorityLevel:e.target.value})}
              value={HolidayPlanData.priorityLevel}
          >
              <div className='radio-group'style={{display:"flex"}}>
                  <FormControlLabel value="1" control={<Radio />} label="1" />
                  <FormControlLabel value="2" control={<Radio />} label="2" />
                  <FormControlLabel value="3" control={<Radio />} label="3" />
              </div>
          </RadioGroup>
  </FormControl>
  )

}
export default HolidayPlanForm;