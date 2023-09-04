import {Box, Typography} from '@mui/material'
export default function WelcomeMessage({heading, message}){

            return(
                        <Box display="inline-block" style={{zIndex:1,top: "15%",p:2, left: {sm:"1%",md:"10%"}}} sx={{width: 400,}}>
                                    <Typography  
                                                sx={{color:"White",opacity:"1 !important",fontSize: {md:"2.5rem",sm:"2rem"},textTransform: "none",fontWeight: 700, fontFamily: `Poppins, sans-serif`}}
                                                align="start" variant="title">
                                                            {heading}
                                    </Typography> 
                                    <Typography
                                                 sx={{color:"white",opacity:"1 !important",fontSize: {md:"2rem",sm:"1.5rem"},textTransform: "none",fontWeight: 500,fontFamily: `Poppins, sans-serif`,lineHeight:{md:"1.3",sm:"1"}}}
                                                 align="start" variant="body"> 
                                                  {message}
                                    </Typography> 
                        </Box>
            )
}