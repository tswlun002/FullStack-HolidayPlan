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
import UseAxiosPrivate from '../utils/UseAxiosPrivate'



/***
 1,2, 3, 5, 6, 7, 9
**/

function Header() {
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const  useAxiosPrivate=UseAxiosPrivate();
  const [isLoggedOut, setIsLoggedOut] = React.useState(false);
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
    if(userLoginState?.isAuthenticated){
        if(item==="Home"){
           navigate(path)
        }
        else if(item==="Account")navigate(`${path}/profile`)
        else if(item==='Register Admin') navigate(`${path}/register-admin`)
        else if(item==='Query Ticket') navigate(`${path}/query`)
        else if(item==='Queries') navigate(`${path}/user-queries`)
        else if(item==='Users') navigate(`${path}/users`)

        else if(item==="Logout"){
          LogoutUser(useAxiosPrivate, dispatchLogin, navigate)
          window.localStorage.removeItem('access_token');
          dispatchLogin({type:"LOGOUT"})

        }

    }

    setAnchorElUser(null);
  };


  const{userLoginState,dispatchLogin} = React.useContext(CreateAuthContext)

  const pages = [ `${userLoginState.firstname} ${userLoginState.lastname} Holiday Plans`];
  const initialSettingsState = [ 'Account', 'Home'];
  const [settings, setSettings] = React.useState(initialSettingsState);

  
  const userMenu=()=> {
     if(userLoginState.userType==='ADMIN')setSettings((state)=>[...state,'Register Admin',"Users",'Logout']);
     else if(userLoginState.userType==='USER')setSettings((state)=> [...state,'Query Ticket','Queries','Logout']);
  }
  React.useEffect(()=>{ setSettings(initialSettingsState);userMenu(); },[userLoginState?.userType])




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

            {  <Tooltip title="Open settings">
             <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar sx={{backgroundColor:"orange"}}>{
                             (userLoginState.firstname!==null && userLoginState.lastname!==null)?
                            `${userLoginState.firstname.substring(0,1)}${userLoginState.lastname.substring(0,1)}`:"OFF"
                            }
                    </Avatar>
                  </IconButton>
               </Tooltip>
              }

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
             {  settings.map((setting) =>(<MenuItem key={setting} sx={{width:"100%"}}value ={setting} onClick={()=>handleCloseUserMenu(setting)}>
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