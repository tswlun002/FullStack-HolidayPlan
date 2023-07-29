import "./HolidayPlanForm.css"
import {Typography,FormControl,RadioGroup, FormControlLabel,Radio,FormLabel,Box,Card,CardContent,
CardHeader,Stack}  from '@mui/material';
import CssTextField from '../component/CssTextField';
import ColorButton from '../component/ColorButton';
import { useReducer, useState} from "react"
import {AddHolidayPlan} from '../utils/HolidayPlan';
import UseAxiosPrivate from '../utils/UseAxiosPrivate'
import CustomerTypography from '../component/CustomerTypography'
import ApploadFile from '../component/ApploadFile'
import { ERROR_COLOR, PRIMAR_COLOR, SUCCESS_COLOR } from "../utils/Constant";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {NavLink} from 'react-router-dom'

const HolidayPlanForm =()=>{
      const  useAxiosPrivate=UseAxiosPrivate();
      const [imagePreview , setImagePreview] =useState([]);

       const [dateType1, setDateType1]= useState("text");
      const [dateType, setDateType]= useState("text");



  //Get HolidayPlan data from Form
  const[HolidayPlanData, DispatchHolidayPlanData] = useReducer((state, action)=>{
    return {...state,...action}
  },
    {  location:"",city: "",startDate: "",endDate:"",event:"",description:"",pictureLink:"",
       priorityLevel:"",isDataCorrect:true,errorMessage:""}
    )
  const[Files, setFiles]=useState([])
  //Extract data from form data and store data to Data state
  const StoreData = ()=>{
         const {startDate, location, endDate, event, city, description, priorityLevel}=HolidayPlanData;
         const fd = new FormData();
         fd.append("holiday",new Blob([JSON.stringify({startDate, location, endDate, event, city, description, priorityLevel}, {'Content-Type':'application/json'})]));
         Files.forEach(file=>fd.append("images",file));
        console.log(fd)
      AddHolidayPlan(useAxiosPrivate,fd, DispatchHolidayPlanData)
  }


  
   const isEmpty= (elementInputData)=>elementInputData.trim()==="";

   const setImages = (fileData)=>{
        const list =[];
        const list1=[];
        fileData.forEach(file=>{
             list.push(URL.createObjectURL(file));
             list1.push(file);
        });
        setImagePreview(list);
        console.log(list1);
        setFiles(list1);
   };

   const OnSubmit= (e)=>{
        e.preventDefault();
        const isDataValid  = ()=>{
           return !( isEmpty(HolidayPlanData.location) && isEmpty(HolidayPlanData.city) &&
            isEmpty(HolidayPlanData.startDate) && isEmpty(HolidayPlanData.endDate)&&
            isEmpty(HolidayPlanData.description) &&( Files.length===null || isEmpty(HolidayPlanData.pictureLink))&&
            isEmpty(HolidayPlanData.priorityLevel))
        }

        if(isDataValid()){

           const store = async ()=>{
                await StoreData()
           }

            store()
         
          
        }else{

             console.log(HolidayPlanData)

             DispatchHolidayPlanData({isDataCorrect:false, errorMessage:"All data is required"})
        }

   }

  return (
      <Box display="flex"
          justifyContent="center"
          alignItems="start"
          minHeight="100vh"
            >
            <Card sx={{ maxWidth: 400,display:"block"}}>
            <CardHeader 
              title={<Stack direction="row" spacing='10%'alignItems="center" justifyContent="flex-start">
                        <NavLink
                            to=".."
                            relative="path"
                            
                        >
                            <ArrowBackIcon/>  
                        </NavLink> 
                        <CustomerTypography align="center" color={PRIMAR_COLOR}><h2>Add Plan</h2></CustomerTypography>
                      </Stack>
              }
              titleTypographyProps={{color:PRIMAR_COLOR,align:"center"}}
              subheader={!HolidayPlanData.isDataCorrect &&HolidayPlanData.errorMessage}
              subheaderTypographyProps={{align:"start" ,color:!HolidayPlanData.isDataCorrect?ERROR_COLOR:SUCCESS_COLOR}}
              action={<CustomerTypography onClick={()=>{ setTimeout(()=>{
                 DispatchHolidayPlanData(
                   {
                     location: "",
                     city: "",
                     startDate: "",
                     endDate: "",
                     description: "",
                     event: "",
                     images: [],
                     pictureLink:"",
                     priorityLevel: "",
   
                   }
                 ); setImagePreview([])
   
              },2000);}}sx={{align:"end"}}>Clear form </CustomerTypography>}
            />
                <CardContent>
                    
                    <form className="holiday-plan-form">
                         
                            
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
                          <ApploadFile setImages={setImages} margin="1rem 0rem" maxWidth={"100%"} />
                        
                         <Box display="flex"
                          justifyContent="center"
                          alignItems="center">
                              {
                              imagePreview.map((image, index)=>
                                <img style={{maxWidth:"25%", margin:"0rem 0.3rem"}}key={index} src={image}/>
                              )

                              }
                         </Box>
                        <PriorityLevelComponent HolidayPlanData={HolidayPlanData}DispatchHolidayPlanData={DispatchHolidayPlanData}/>
                        <ColorButton style={{marginTop:"15px",width:"100%"}} type="submit" onClick={(e)=>OnSubmit(e)}
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