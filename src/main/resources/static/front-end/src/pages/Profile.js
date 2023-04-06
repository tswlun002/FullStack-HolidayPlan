import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button ,CardActions, Box,Stack} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import {CreateAuthContext} from '../context/CreateAuthContext';
import { useNavigate } from "react-router-dom";
import  {FaEnvelope} from 'react-icons/fa'
import { IconButton } from '@material-ui/core'
import UseAxiosPrivate from '../utils/UseAxiosPrivate'
import { styled } from '@mui/material/styles';

const DeleteAccountButton = styled(Button)({
  '&:hover': {
    border:"1px solid red",
  },
  '&.Mui-focused': {
    border:"1px solid red",
  },


  });

const Profile = ()=> {
 const useAxiosPrivate = UseAxiosPrivate();
 const{userLoginState,dispatchLogin} = React.useContext(CreateAuthContext)

  return (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <Card sx={{ maxWidth: 400,padding:"2rem 0rem" ,display:"block"}}>
       <CardContent>
         <Stack
           direction="row"
            justifyContent="center"
            alignItems="center"
            direction="row"
            spacing={2}>
                <Avatar
                sx={{ bgcolor:deepOrange[500]}}
                >
                    {
                     userLoginState.firstname && userLoginState.lastname  &&
                    `${userLoginState.userType}`
                    }
                </Avatar>
         </Stack>

          <Typography gutterBottom variant="h5" component="div" align="center">
            <h2>{`${userLoginState.firstname} ${userLoginState.lastname}` }</h2>
            <IconButton
                variant="outlined"
                style={{color: "orangered"}}
                className="btn email" size="medium">
                 {<FaEnvelope/>}
              <h3>{ userLoginState.username}</h3>
           </IconButton>
          </Typography>

        </CardContent>

      <CardActions>
        <Button variant="outlined" size="small" color="primary">
          Edit
        </Button>
          <DeleteAccountButton variant="outlined" size="small">
                  delete  account
          </DeleteAccountButton>
      </CardActions>

    </Card>
  </Box>
  );
}
export default  Profile;