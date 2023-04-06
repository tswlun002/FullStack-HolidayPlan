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
import {LogoutUser} from '../utils/User';


/***
 1,2, 3, 5, 6, 7, 9
**/

function Header() {
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
    let path = (userLoginState?.userType==="USER")?"/home-user":
    (userLoginState?.userType==="ADMIN")?"/home-admin":"/unknown"
    if(item==="Home"){
       navigate(path)
    }
    else if(item==="Account")navigate(`${path}/profile`)
    else if(item==='Register Admin') navigate(`${path}/register-admin`)
    else if(item==='Query') navigate(`${path}/query`)

    else if(item==="Logout"){
      dispatchLogin({
        type:"LOGOUT",  
       });
      LogoutUser(dispatchLogin.access_token)
      navigate("/")
    }

    setAnchorElUser(null);
  };
  // console.log( userLoginState.isAuthenticated)
  const{userLoginState,dispatchLogin} = React.useContext(CreateAuthContext)

  const pages = [ `${userLoginState.firstname} ${userLoginState.lastname} Holiday Plans`];
  const initialSettingsState = [ 'Account', 'Home','Logout'];
  const [settings, setSettings] = React.useState(initialSettingsState);
  console.log(`Is user an admin ${userLoginState?.userType==='ADMIN'}`)
  
  const userMenu=()=> {
     if(userLoginState.userType==='ADMIN')setSettings((state)=>[...state,'Register Admin']);
     else if(userLoginState.userType==='USER')setSettings((state)=> [...state,'Query']);
  }
  React.useEffect(()=>{ setSettings(initialSettingsState);userMenu(); },[userLoginState?.userType])

  console.log(settings);


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
                color:"white"
              }}
            >
              {pages.map((page) => (
                <MenuItem className="item-tittle" sx={{color:"white"}}key={page} onClick={e=>handleCloseNavMenu(e)}>
                  <Typography textAlign="center" sx={{color:"white"}}>"Lunga"</Typography>
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
                         userLoginState.firstname!==null && userLoginState.lastname!==null  &&
                        `${userLoginState.firstname.substring(0,1)}${userLoginState.lastname.substring(0,1)}`
                        }
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '50px' }}
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
            {
                userLoginState.isAuthenticated && settings.map((setting) =>(
                                           <MenuItem key={setting} sx={{width:"100%"}}value ={setting} onClick={()=>handleCloseUserMenu(setting)}>
                                             <Typography textAlign="center">{setting}</Typography>
                                           </MenuItem>
                                         )

                )
            }
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;