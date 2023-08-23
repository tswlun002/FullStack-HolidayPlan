import
 {Paper,Grid,Card,CardHeader,CardContent,Typography,IconButton,Avatar} 
 from '@mui/material'
import aboutImage from '../images/3.jpg'
import { PRIMAR_COLOR,} from '../utils/Constant';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@material-ui/core';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import  {FaMapMarkerAlt} from 'react-icons/fa'
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';


const ContactButton=({message,label, Icon,isSmall})=>{
     return (<IconButton sx={{borderRadius:0}}aria-label={label} size="large">
          <Avatar sx={{m:1,backgroundColor:'orange',p:isSmall?0.5:1}}><Icon/></Avatar>
              <Typography   
                sx={{opacity:"1 !important",fontSize:"1rem",
                textTransform: "none",fontWeight: 500, fontFamily: `Poppins, sans-serif`,lineHeight:"2.5rem"}}
                align="start" 
                  variant={"h6"}
                > {message}
              </Typography>
          </IconButton>)
}
export default function About({appData}){
            const {data} =appData;
            const{address}=data||{};
            let ADDRESS=address&&Object.entries(address).map(([,value])=>value)||[];
            ADDRESS.shift();
            ADDRESS=ADDRESS&&ADDRESS.join(", ");
            const theme =  useTheme();
            const small = useMediaQuery(theme.breakpoints.down('1025'));
            return(<Paper
                sx={{ 
                  flexGrow: 1,
                  backgroundColor: (theme) =>
                              theme.palette.mode === 'dark' ? '#1A2027' : '#fff',backgroundSize:"cover"
                }}
             >

    
                <Grid container spacing={0}>
                    {small&&<Grid item sm={small?12:8}     
                    >  
                       <ImageListItem >
                          <img src={aboutImage} style={{backgroundRepeat: 'no-repeat',size:"cover", width:"100%",height:"100%"}} alt={"About us image"}/>
                          <ImageListItemBar
                                sx={{width:"100%"}}
                                title={
                                  <Typography align="center"  
                                  sx={{fontSize:small?'1.5rem':"2rem",textTransform: "none",fontWeight: 700, 
                                      fontFamily: `Poppins, sans-serif`,width:"100%",color:PRIMAR_COLOR
                                  }} 
                                  variant={"h2"}
                                  >
                                       {`Why ${data.name} ?`}
                                  </Typography>
                              }
                              position="bottom"
                                
                          />
                      </ImageListItem>
                    </Grid>}

                      <Grid sx={{display:"flex",minHeight:small?0:"50vh", alignItems:"center",justifyContent:"center"}} item sm={small?12:5}>
                          <Card sx={{boxShadow:"none"}}>
                              <CardHeader
                                title={
                                  <Typography align="center"  
                                  sx={{fontSize:"2rem",textTransform: "none",fontWeight: 700, 
                                      fontFamily: `Poppins, sans-serif`,width:"100%",color:PRIMAR_COLOR
                                  }} 
                                  variant={"h2"}
                                  >
                                      {small?'':`Why ${data.name} ?`}
                                  </Typography>
                                    }
                              
                              />
                                
                              <CardContent>
                                  <Typography   
                                sx={{opacity:"1 !important",fontSize:"1rem",
                                textTransform: "none",fontWeight: 500, fontFamily: `Poppins, sans-serif`,lineHeight:small?'2':"2.5rem"}}
                                align="start" 
                                variant={"body"}
                                > {`${data.name}, ${data.about}`}
                                </Typography>
                              </CardContent>
                            </Card>
                        </Grid>
                        {
                              (!small)&&
                              <Grid item sm={small?12:7}     
                              >
                                <img src={aboutImage} style={{backgroundRepeat: 'no-repeat',size:"cover", width:"100%",height:"100%"}} alt={"About us image"}/>
                              </Grid>
                        }
                        <Grid container sx={{display:"flex", p:2,alignItems:"center",justifyContent:"start", minHeight:"30vh"}} item sm={12}>
                            
                            <Typography align="center"  
                              sx={{fontSize:small?'1.5rem':"2rem",textTransform: "none",fontWeight: 700, 
                                  fontFamily: `Poppins, sans-serif`,width:"100%",color:PRIMAR_COLOR
                              }} 
                              variant={"h2"}
                              >
                                  {`Contact us`}
                            </Typography>
                             
                            <Grid item sx={{display:"block"}}>
                                 <ContactButton  isSmall={small}message={data.phone} label={'telephone'} Icon={LocalPhoneIcon}/>
                              </Grid>
                              <Grid item sx={{display:"block"}}>
                                  <ContactButton isSmall={small} message={data.email} label={'telephone'} Icon={EmailIcon}/>
                              </Grid>
                              <Grid item sx={{display:"block"}}>
                                <ContactButton  isSmall={small} message={ADDRESS} label={'telephone'} Icon={FaMapMarkerAlt}/>
                              </Grid>
                            </Grid>
                            
                      
                </Grid>
            
            </Paper>)
}