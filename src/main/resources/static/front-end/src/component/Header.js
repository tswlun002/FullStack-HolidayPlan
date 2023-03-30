import "./Header.css"
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from "react-router-dom";
import {CreateAuthContext} from '../context/CreateAuthContext';
import {UserInformation,LogoutUser} from '../utils/User';
import UseAxiosPrivate from '../utils/UseAxiosPrivate'
const pages = ['My Holiday Plans'];
const settings = [ 'Account', 'Home', 'Logout'];




function ResponsiveAppBar() {
   const useAxiosPrivate = UseAxiosPrivate();
  const{userLoginState,dispatchLogin} = React.useContext(CreateAuthContext)

  const [userState, dispatchUserInformation] = React.useReducer(
   (state, action)=> {
       return {...state, ...action.payload}
   },
   {
       username:null,
       firstname:null,
       lastname:null,
   }

)
  React.useEffect(()=>{
       if(userLoginState.isAuthenticated)
       UserInformation(userLoginState.access_token,dispatchUserInformation,useAxiosPrivate);
  },[userLoginState])

  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (item) => {
    console.warn(item)
    if(item==="Home")navigate("/home")
    else if(item==="Account")navigate("/profile")
    else if(item==="Logout"){
      dispatchLogin({
        type:"LOGOUT",  
       });
      LogoutUser(dispatchLogin.refresh_token, dispatchUserInformation)
      navigate("/")
    }

    setAnchorElUser(null);
  };
  // console.log( userLoginState.isAuthenticated)
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={e=>handleCloseNavMenu(e)}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
         
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar>{
                         userState.firstname!==null && userState.lastname!==null  &&
                        `${userState.firstname.substring(0,1)}${userState.lastname.substring(0,1)}`
                        }
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
            {  userLoginState.isAuthenticated && settings.map((setting) => (
                <MenuItem key={setting} value ={setting} onClick={()=>handleCloseUserMenu(setting)}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;