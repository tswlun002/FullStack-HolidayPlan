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
import { useNavigate ,NavLink} from "react-router-dom";
import {CreateAuthContext} from '../context/CreateAuthContext';
import {LogoutUser} from '../utils/User';
import UseAxiosPrivate from '../utils/UseAxiosPrivate'

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
    console.log(item)
    let path = (userLoginState?.userType==="USER")?"/home-user":
    (userLoginState?.userType==="ADMIN")?"/home-admin":"/unknown"
    if(userLoginState?.isAuthenticated){
    if(item==="Logout"){
          LogoutUser(useAxiosPrivate, dispatchLogin, navigate)
          window.localStorage.removeItem('access_token');
          dispatchLogin({type:"LOGOUT"})

        }

    }

    setAnchorElUser(null);
  };


  const{userLoginState,dispatchLogin} = React.useContext(CreateAuthContext)
  let path = (userLoginState?.userType==="USER")?"/home-user":
          (userLoginState?.userType==="ADMIN")?"/home-admin":"/unknown"

  const initialSettingsState = [ ['Account',`${path}/profile`],['Logout',`/`]];
  const [settings, setSettings] = React.useState(initialSettingsState);
  const [pages, setPages] = React.useState([[]]);
  const [settingAndPages, setSettingAndPages] = React.useState([[]]);

  const userHeader = `${userLoginState.firstname} ${userLoginState.lastname} `;
  const userMenu=()=> {

     if(userLoginState.userType==='ADMIN'){

        setPages(()=>[
                        ['Home',path],['Register Admin',`${path}/register-admin`],["Users",`${path}/users` ]
        ]);
         setSettingAndPages(()=>[initialSettingsState[0],['Home',path],['Register Admin',`${path}/register-admin`],["Users",`${path}/users` ], initialSettingsState[1]]);
     }
     else if(userLoginState.userType==='USER'){
        setPages(()=> [
                              ['Home',path],['Query',`${path}/query`],['My Queries',`${path}/user-queries`]
        ]);
        setSettingAndPages(()=>[initialSettingsState[0],  ['Home',path],['Query',`${path}/query`],['My Queries',`${path}/user-queries`], initialSettingsState[1]]);
     }
     else setPages([[]]);

  }
  React.useEffect(()=>{ setSettings(initialSettingsState);userMenu(); },[userLoginState?.userType])

  const linkStyle =(page,isActive=false, isPending=false)=>{
     return{textDecoration:"none",
             my: 1,display: 'block' ,
             padding:"0rem 3rem",

              color:isActive?"orange":isPending?"green":"white",

          }
  }
    const menuItemStyle =(page,isActive=false, isPending=false)=>{
       return{textDecoration:"none",
               my: 1,display: 'block' ,
               padding:"0.5rem",

                color:isActive?"orange":isPending?"green":"black",

            }
    }
  console.log(settingAndPages)

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography sx={{padding:"2rem 0rem"}}>{`${userHeader} ${userLoginState.isAuthenticated?"'s":""} Holiday Plans`}</Typography>

          <Box sx={{ flexGrow: 1, display:"block"}}>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}

              sx={{
                display: { xs: 'block', md: 'none' },
                color:"black",
                marginTop:"50px",

              }}
               open={Boolean(anchorElUser)}
               onClose={handleCloseUserMenu}
            >
              {

               settingAndPages.map((arr) => (
                    <MenuItem className="item-tittle" sx={{color:"black",display:"block", width:"100%"}}key={arr[0]} onClick={()=>handleCloseUserMenu(arr[0])}>
                          <NavLink
                              to={arr[1]}
                              key={arr[0]}

                              end={arr[0]==="Home"}
                              style={({isPending, isActive})=>{console.log(isActive) ;console.log(isPending);return menuItemStyle(arr[0],isActive,isPending)}}
                              >
                             {arr[0]}
                        </NavLink>
                    </MenuItem>
                  ))}
            </Menu>
          </Box>
         
          <Box  justifyContent="end" alignItems="center" sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>

            {pages.map((arr) => (
              <NavLink
                to={arr[1]}
                key={arr[0]}
                end={arr[0]==="Home"}
                style={({isPending, isActive})=>{console.log(isActive) ;console.log(isPending);return linkStyle(arr[0],isActive,isPending)}
                      }
              >
                {arr[0]}
              </NavLink>
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
              sx={{ flexGrow: 1, marginTop:"50px", display: { xs: 'none', md: 'flex' } }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
             {  settings.map((arr) =>(<MenuItem key={arr[0]} sx={{width:"100%"}}value ={arr[0]} onClick={()=>handleCloseUserMenu(arr[0])}>
                  <NavLink
                      to={arr[1]}
                      key={arr[0]}

                      end={arr[0]==="Home"}
                      style={({isPending, isActive})=>{console.log(isActive) ;console.log(isPending);return menuItemStyle(arr[0],isActive,isPending)}}
                      >
                     {arr[0]}
                </NavLink>
                </MenuItem>
                ))

             }

            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;