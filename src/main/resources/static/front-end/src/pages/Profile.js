import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button ,CardActions, Box,Stack} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import {CreateAuthContext} from '../context/CreateAuthContext';
import  {FaEnvelope} from 'react-icons/fa'
import { IconButton } from '@material-ui/core'
import UseAxiosPrivate from '../utils/UseAxiosPrivate'
import { styled } from '@mui/material/styles';
import CssTextField from '../component/CssTextField'
import CustomerTypography from '../component/CustomerTypography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import ColorButton from '../component/ColorButton';
import {UpdateUser} from '../utils/User';


    const AccountButton = styled(Button)({
      '&:hover': {
        border:"1px solid red",
      },
      '&.Mui-focused': {
        border:"1px solid red",
      },


    });


   const ExpandMore = styled((props) => {
      const { expand, ...other } = props;
      return <IconButton {...other} />;
        })(({ theme, expand }) => ({
          transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
          marginLeft: 'auto',
          transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
          }),
   }));


  const Profile = ()=> {
      const useAxiosPrivate = UseAxiosPrivate();

      const{userLoginState,dispatchLogin} = React.useContext(CreateAuthContext)

      const[profile, dispatchProfile] = React.useReducer((state, action)=>{
              return {...state,...action,
              }
          },{firstname:"",lastname:"",email:"",newPassword:"",currentPassword:"", edited:false,
          isEditError:false, errorMessage: "",isRequestSucceeded:false, requestResponseMessage:""})

      const [expanded, setExpanded] = React.useState({showInfo:true,showEdit:false});

       const handleExpandClick = () => {
          setExpanded({showInfo:!expanded.showInfo,showEdit:!expanded.showEdit});
       }

       const OnSubmit =(e)=>{
           e.preventDefault();
           if(profile.email.trim() === ""&& profile.newPassword.trim() === "" &&  profile.firstname.trim() === ""&&
             profile.lastname.trim() === "" &&profile.currentPassword.trim() === ""){
               dispatchProfile({isEditError:true, errorMessage:"At least one field  is required"});
           }else{

              if(profile.currentPassword.trim()!==''){
                UpdateUser(useAxiosPrivate ,profile, dispatchProfile);
              }
              else{
                    dispatchProfile({isEditError:true, errorMessage:"Current password is required"});
              }

              if(profile.edited){
                 dispatchProfile({firstname:"",lastname:"",email:"",newPassword:"",currentPassword:"", edited:false,
                                             isEditError:false, errorMessage: null})
              }
              else if(profile.isEditError){
                  dispatchProfile({currentPassword:"", edited:false})

              }
           }
         const ClearForm= ()=>{
               setTimeout(()=>{
                   dispatchProfile(
                     {
                       firstname:"",lastname:"",email:"",newPassword:"",currentPassword:"",requestResponseMessage:""

                     }
                   )
               },200)
           }
       }



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
                flowdirection="row"
                spacing={2}>
                    <Avatar
                    sx={{ bgcolor:deepOrange[500]}}
                    >
                     <CustomerTypography sx={{ textAlign: "center",fontSize:"0.7rem"}}>   {
                         userLoginState.firstname && userLoginState.lastname  &&
                        `${userLoginState.userType}`
                        }
                     </CustomerTypography>
                    </Avatar>
             </Stack>
           <Collapse in={expanded.showInfo} timeout="auto" unmountOnExit>
              <CustomerTypography gutterBottom variant="h5" component="div" align="center">
                <h2>{`${userLoginState.firstname} ${userLoginState.lastname}` }</h2>
                <IconButton
                    variant="outlined"
                    style={{color: "orangered"}}
                    className="btn email" size="medium">
                     {<FaEnvelope/>}
                  <h3 style={{paddingLeft:"1rem"}}>{ userLoginState.username}</h3>
               </IconButton>
              </CustomerTypography>
             </Collapse>
            </CardContent>

          <CardActions sx={{ padding:"0rem 2rem"}}>
            <>
            { expanded.showEdit?"Hidde":"Edit"}
            <ExpandMore
             expand={expanded}
             onClick={handleExpandClick}
             aria-expanded={expanded}
             aria-label="Edit"

             key={userLoginState.username}
           >
            {
               <ExpandMoreIcon/>
            }
            </ExpandMore>
           </>

          </CardActions>
          <CardActions sx={{ padding:"0rem 2rem", display:"block",
                             direction:"column",
                              justifyContent:"center",
                              alignItems:"center"}}>


          <Collapse in={expanded.showEdit} timeout="auto" unmountOnExit>
            {
              profile.isEditError?
              <CustomerTypography sx={{color:"red"}}>
                    {profile.errorMessage}
              </CustomerTypography>
              : profile.isRequestSucceeded&&<CustomerTypography sx={{color:"green"}}>
                  {profile.requestResponseMessage}
               </CustomerTypography>
            }

            <CssTextField

                variant="outlined"
                helpertext=""id="demo-helper-text-aligned"label="Firstname"
                type="text" className="firstname-input" placeholder="enter firstname"  value={profile.firstname}
                onChange={(e)=>dispatchProfile({firstname:e.target.value,isEditError:false})}/>
            <CssTextField

                variant="outlined"
                helpertext="" id="demo-helper-text-aligned"label="Lastname" color="secondary"
             type="text" className="lastname-input" placeholder="enter lastname" value={profile.lastname}
            onChange={(e)=>dispatchProfile({lastname:e.target.value ,isEditError:false})}></CssTextField>

            <CssTextField

                variant="outlined"
                helpertext=""
                id="demo-helper-text-aligned"
                label="Email"
            type="email" className="email-input" placeholder="enter email" value={profile.email}
             onChange={(e)=>dispatchProfile({email:e.target.value,isEditError:false })}></CssTextField>

            <CssTextField

                variant="outlined"
                helpertext=""
                id="demo-helper-text-aligned"
                label="New-password"
                color="secondary"
            type="password" autoComplete='new-password' className="new-password-input" placeholder="Enter new password" value={profile.newPassword}
            onChange={(e)=>dispatchProfile({newPassword:e.target.value, isEditError:false})}></CssTextField>

             <CssTextField
                required
                variant="outlined"
                helpertext=""
                id="demo-helper-text-aligned"
                label="Confirm-password"
                color="secondary"
                type="password" autoComplete='new-password' className="current-password-input" placeholder="Enter current password"
                value={profile.currentPassword}
              onChange={(e)=>dispatchProfile({currentPassword:e.target.value, isEditError:false})}></CssTextField>

              <Button color="secondary" variant="outlined" style={{marginTop:"15px"}}
                                    onClick={(e)=>OnSubmit(e)}>Update</Button>
            <AccountButton  sx={{ marginTop:"10px"}}variant="outlined" size="small">
                                  delete  account
             </AccountButton>
            </Collapse>
          </CardActions>


        </Card>
      </Box>
      );
}
export default  Profile;