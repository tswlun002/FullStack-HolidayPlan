import "./HolidayPlanForm.css"
import {FormControl,RadioGroup, FormControlLabel,Radio,FormLabel,Box,Card,CardContent,
CardHeader,Stack, Chip}  from '@mui/material';
import CssTextField from '../component/CssTextField';
import ColorButton from '../component/ColorButton';
import { useReducer, useState} from "react"
import {AddHolidayPlan} from '../utils/HolidayPlan';
import UseAxiosPrivate from '../utils/UseAxiosPrivate'
import CustomerTypography from '../component/CustomerTypography'
import ApploadFile from '../component/ApploadFile'
import { ERROR_COLOR, PRIMAR_COLOR, SUCCESS_COLOR } from "../utils/Constant";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {NavLink,useLocation} from 'react-router-dom'
import ClearIcon from '@mui/icons-material/Clear';


export function getFileFromBase64(string64, fileName,type) {
  const trimmedString = string64.replace('dataimage/jpegbase64', '');
  const imageContent = atob(trimmedString);
  const buffer = new ArrayBuffer(imageContent.length);
  const view = new Uint8Array(buffer);

  for (let n = 0; n < imageContent.length; n++) {
    view[n] = imageContent.charCodeAt(n);
  }

  const blob = new Blob([buffer], { type });
  return new File([blob], fileName, { lastModified: new Date().getTime(), type });
}


const HolidayPlanForm =()=>{
      const location = useLocation();
      const holidayPlanData = location.state?.holidayPlan
      const  useAxiosPrivate=UseAxiosPrivate();
      const images = holidayPlanData?.images?.map((img,index)=>{
        // `data:${img.imageType};base64, ${img.image}`
        return getFileFromBase64(img.image,index,img.imageType);
      });
      const [imagePreview , setImagePreview] =useState(images?.map(file=>URL.createObjectURL(file))||[]);
       const [dateType1, setDateType1]= useState("text");
      const [dateType, setDateType]= useState("text");



  //Get HolidayPlan data from Form
  const[HolidayPlanData, DispatchHolidayPlanData] = useReducer((state, action)=>{
    return {...state,...action}
  },
    {   
        location:holidayPlanData?.location||'',city:holidayPlanData?.city||'',
        startDate: holidayPlanData?.startDate?.substring(0,10)||"",
        endDate:holidayPlanData?.endDate?.substring(0,10)||"",
        event:holidayPlanData?.event||"", description:holidayPlanData?.description||"",
        pictureLink:"",
       priorityLevel:holidayPlanData?.priorityLevel||"",
       isRequestError:false, isRequestSuccessful:false,errorMessage:""}
    )
  const[Files, setFiles]=useState( images||[])
  
  //Extract data from form data and store data to Data state
  const StoreData = ()=>{
         const {startDate, location, endDate, event, city, description, priorityLevel}=HolidayPlanData;
         const fd = new FormData();
         fd.append("holiday",new Blob([JSON.stringify({startDate, location, endDate, event, city, description, priorityLevel},
           {'Content-Type':'application/json'})]));
         Files.forEach(file=>{
       
          fd.append("images",file);
        });
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
        setFiles(list1);
   };

   const OnSubmit= (e)=>{
        e.preventDefault();
        const isDataValid  = ()=>{
           return !( 
            isEmpty(HolidayPlanData.location)||
            isEmpty(HolidayPlanData.city) ||
            isEmpty(HolidayPlanData.startDate)||
            isEmpty(HolidayPlanData.endDate)||
            isEmpty(HolidayPlanData.description) || 
            (Files.length===0 && imagePreview?.length===0)||
            isEmpty(HolidayPlanData.priorityLevel?.toString())
          )
        }

        if(isDataValid()){

           const store =()=>{
                StoreData()
           }

            store()
         
          
        }else{

             DispatchHolidayPlanData({isRequestError:true,isRequestSuccessful:false, errorMessage:"All data fields are required"})
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

              subheader={(HolidayPlanData.isRequestError || HolidayPlanData.isRequestSuccessful)&&HolidayPlanData.errorMessage}
              subheaderTypographyProps={{align:"start" ,color:HolidayPlanData.isRequestError?ERROR_COLOR:HolidayPlanData.isRequestSuccessful&&SUCCESS_COLOR}}
              action={
                  <Chip
                    onClick={()=>{ setTimeout(()=>{
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
                        isRequestSuccessful:false
                        ,isRequestError:false
      
                      }
                    ); setImagePreview([])
   
              },500);}}

              icon={<ClearIcon/>}
              label="Clear"
              >
            
                Clear form 
             
              </Chip>
            }
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
                            onChange={(e)=>DispatchHolidayPlanData({isRequestError:false,isRequestSuccessful:false, location:e.currentTarget.value})}

                          />

                        <CssTextField
                            required
                            id="demo-helper-text-aligned"
                            label="City"
                            variant="outlined"
                            name="city"
                            type="text"placeholder="Enter city " className="city" min={3}
                            onChange={(e)=>DispatchHolidayPlanData({isRequestError:false,isRequestSuccessful:false,city:e.currentTarget.value}) }
                            value={HolidayPlanData.city}
                            />

                        <CssTextField
                              required
                            id="demo-helper-text-aligned"
                            label="Start Date"
                            variant="outlined"
                            name="startDate"
                             onClick={()=>setDateType1("date")}
                             onBlur={()=>{setDateType1("text"); }}
                            type={dateType1}   className="start-date"min={10}
                            onChange={event=>DispatchHolidayPlanData({isRequestError:false,isRequestSuccessful:false,startDate:event.currentTarget.value}) }
                            value={HolidayPlanData.startDate}

                            />

                        <CssTextField
                          required
                          id="demo-helper-text-aligned"
                          label="End Date"
                          variant="outlined"
                          name="endDate"
                           onClick={()=>setDateType("date")}
                           onBlur={()=>{setDateType("text"); }}
                           type={dateType}  className="end-date"min={10}
                          onChange={event=>DispatchHolidayPlanData({isRequestError:false,isRequestSuccessful:false,endDate:event.currentTarget.value}) }
                          value={HolidayPlanData.endDate}
                          />

                        <CssTextField

                            required
                            id="demo-helper-text-aligned"
                            label="Event"
                            variant="outlined"
                            type="text" name="event" placeholder="Enter event" className="event"min={5}
                            onChange={(e)=>DispatchHolidayPlanData({isRequestError:false,isRequestSuccessful:false,event:e.currentTarget.value}) }
                            value={HolidayPlanData.event}
                          />

                        <CssTextField
                            required
                            multiline
                            id="demo-helper-text-aligned"
                            label="description"
                            variant="outlined"
                            type="text" name="description" placeholder="Enter description" className="description"min={3}
                            onChange={(e)=>DispatchHolidayPlanData({isRequestError:false,isRequestSuccessful:false,description:e.currentTarget.value}) }
                            value={HolidayPlanData.description}
                          />
                          <ApploadFile setImages={setImages} margin="1rem 0rem" maxWidth={"100%"} />
                        
                         <Box display="flex"
                          justifyContent="center"
                          alignItems="center">
                              {
                              imagePreview.map((image, index)=>
                                <img style={{maxWidth:'25%',width:100,height:50, margin:"0rem 0.3rem"}}key={index} src={image} alt="Location image(s) preview"/>
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
              onChange={(e)=>DispatchHolidayPlanData({priorityLevel:e.target.value,isRequestError:false,isRequestSuccessful:false,})}
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