import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";
import { Box } from "@mui/material";
import {useLocation} from 'react-router-dom'

export default function Footer({appData={}}) {
  const location = useLocation();

  const{data} = appData;
  const {address} = data||{};
  const{socials}=data||{};
  let ADDRESS=address&&Object.entries(address).map(([,value])=>value)||[];
  ADDRESS.shift();
  ADDRESS=ADDRESS&&ADDRESS.join(", ");
  const isAboutPage = location.pathname==='/about';
  return (
   <Box
      component="footer"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        p: 1,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          { (!isAboutPage)&&<Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
             {`${data?.name}, ${data?.about}`}
            </Typography>
          </Grid>}
          { (!isAboutPage)&&<Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: {data?.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: {data?.phone}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {   
                `Address: ${ADDRESS}`
              }
            </Typography>
            
          </Grid>}
          {
            socials&&
            <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Follow Us
            </Typography>
            <Grid container>{
              socials.map((social)=>{
                let results='';
                switch(social.name.toLowerCase()){
                 
                  case 'twitter':{
                    results=<Grid  container spacing={1}  >
                     <Grid item sx={2} >
                        <Link href="https://www.twitter.com/"  color="inherit"><Twitter /></Link>
                      </Grid>
                      <Grid item sx={8}> <Typography variant="body2" color="text.secondary">{social.username}</Typography></Grid>
                    </Grid>
                        break;
                    }

                  case 'facebook':{
                    results=<Grid  container spacing={1} >
                    <Grid item sx={2}>
                      <Link href="https://www.facebook.com/" color="inherit"><Facebook /></Link>
                    </Grid>
                    <Grid item sx={8}> <Typography variant="body2" color="text.secondary">{social.username}</Typography></Grid>
                    </Grid>
                    break;
                  }
            
                  case 'instagram':{
                    results=<Grid  container spacing={1} >
                      <Grid item sx={2}>
                        <Link href="https://www.instagram.com/" color="inherit"><Instagram /></Link>
                      </Grid>
                      <Grid item sx={8}> <Typography variant="body2" color="text.secondary">{social.username}</Typography></Grid>
                    </Grid>
                     break;
                    }
             }
             return results;
            
            })
            }</Grid>
          </Grid>
          }
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" color="text.secondary" align="center">
            {"Copyright © "}
            <Link color="inherit" href="https://localhost:3000/">
              holiday-plan
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}