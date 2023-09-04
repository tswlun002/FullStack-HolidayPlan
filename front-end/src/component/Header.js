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
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate ,NavLink} from "react-router-dom";
import {CreateAuthContext} from '../context/CreateAuthContext';
import {LogoutUser} from '../utils/User';
import UseAxiosPrivate from '../utils/UseAxiosPrivate'
import {useMediaQuery} from '@mui/material';
import { useTheme } from '@material-ui/core';
function Header({appData}) {
  const{data}=appData;
  const theme =  useTheme();
  const tabletLaptop = useMediaQuery(theme.breakpoints.down('1053'));
  const phoneTablet = useMediaQuery(theme.breakpoints.down('900'));
  const navigate = useNavigate();
  const [anchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const  useAxiosPrivate=UseAxiosPrivate();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };


  const handleCloseUserMenu = (item) => {

    if(userLoginState?.isAuthenticated){
    if(item==="Logout"){
          LogoutUser(useAxiosPrivate, dispatchLogin, navigate)
          window.localStorage.removeItem('access_token');
          dispatchLogin({type:"LOGOUT"})
          window.localStorage.clear()

    }

    }
    if(item !=="Roles-Permissions")setAnchorElUser(null);
  };


  const{userLoginState,dispatchLogin} = React.useContext(CreateAuthContext)
  let path = (userLoginState?.roles.find(element=>element.name==="USER"))?"/home-user":
          (userLoginState?.roles.find(element=>element.name==="ADMIN"))?"/home-admin":"/unknown"

  const initialSettingsState = [
    {name:'Account',link:`${path}/profile`, isNested:false},
    {name:'Logout',link:`/`, isNested:false}
  ];
  const [settings, setSettings] = React.useState(initialSettingsState);
  const [pages, setPages] = React.useState([]);
  const [settingAndPages, setSettingAndPages] = React.useState([]);

  const userHeader = `${userLoginState.firstname} ${userLoginState.lastname}`;
  const userMenu=()=> {

     if(userLoginState.roles.find(element=>element.name==='ADMIN')){

        setPages(()=>[
                        {name:'Home',link:path,isNested:false},
                      
                        {name:'Roles-Permissions',link:`${path}/roles-permissions`,isNested:false},
                        {name:"Users",link:`${path}/users` ,isNested:false}
        ]);
         setSettingAndPages(()=>[
          initialSettingsState[0],
          {name:'Home',link:path, isNested:false},
          {
          name:'Roles-Permissions', link:`${path}/roles-permissions`,isNested:true,
          },
          {name:"Users",link:`${path}/users` ,isNested:false}, 
          initialSettingsState[1]]);
     }
     else if(userLoginState.roles.find(element=>element.name==='USER')){
        setPages(()=> [
          {name:'Home',link:path,isNested:false},
          {name:'Query',link:`${path}/query`,isNested:false},
          {name:'My Queries',link:`${path}/user-queries`,isNested:false}
        ]);
        setSettingAndPages(()=>[initialSettingsState[0],  
        {name:'Home',link:path,isNested:false},
        {name:'Query',link:`${path}/query`,isNested:false},
        {name:'My Queries',link:`${path}/user-queries`,isNested:false}, 
        initialSettingsState[1]
      ]);
     }
     else{
            setPages([[]]);
            setSettings([[]]);
     }

  }
  React.useEffect(()=>{ setSettings(initialSettingsState);userMenu(); },[userLoginState?.roles])

  const linkStyle =(isActive=false, isPending=false)=>{
     return{textDecoration:"none",
             my: 1,display: 'block' ,
             padding:tabletLaptop?"0rem 1rem":"0rem 3rem",

              color:isActive?"orange":isPending?"green":"white",

          }
  }
    const menuItemtyle =(isActive=false, isPending=false)=>{
       return{textDecoration:"none",
               my: 1,display: 'block' ,
               padding:"0.5rem",

                color:isActive?"orange":isPending?"green":"black",

            }
    }
  const ABOUT = <NavLink      
                              to={'about'}
                              key={'about'}
                              end={'about'==="Home"}
                              style={({isPending, isActive})=>{
                                    return{textDecoration:"none",
                                        my: 1,display: 'block' ,
                                        padding:"0rem 5rem",
                        
                                        color:isActive?"orange":isPending?"green":phoneTablet?"black":"white",
                        
                                        }
                                  }
                            }
                              >
                            {'About'}
                </NavLink>
   const LOGO=  <NavLink      
     to={userLoginState.isAuthenticated?'.':'/'}
     key={'logo'}
     end={'home'==="Home"}
     >
        <img style={{maxWidth:"30%", maxHeight:"100%"}}src={`${data?.logoFormat||''},${data?.logo||''}`} alt="" loading="lazy"/>

</NavLink>

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar sx={{justifyContent:"start"}} disableGutters>
          {LOGO}
          <Typography 
              sx={{padding:{md:"2rem 0rem",sm:"1.5rem 0rem"},
              fontSize: "1.3rem",
              textTransform: "none",fontWeight: 700, 
              fontFamily: `Poppins, sans-serif`
                                      
             }}
             align="start" variant="title"
            >{`${userHeader&&userHeader.trim()} ${userLoginState.isAuthenticated?"'s":""} ${userLoginState.isAuthenticated?`Holiday Plans`:data?.name||''}`}</Typography>

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

               settingAndPages.map((item) => (
                    <MenuItem className="item-tittle" sx={{color:"black",display:"block", width:"100%"}}key={item.name} 
                    onClick={()=>handleCloseUserMenu(item.name)}>
                    {
                        <NavLink
                            to={item.link}
                            key={item.name}
                            end={item.name==="Home"}
                            style={({isPending, isActive})=> menuItemtyle(isActive,isPending)}
                            >
                          {item.name}
                        </NavLink>
                    }
                      
                    </MenuItem>
                  ))}
                {(!userLoginState.isAuthenticated)&&
                <MenuItem className="item-tittle" sx={{color:"black",display:"block", width:"100%"}}key={'about'}>
                       {ABOUT}
                 </MenuItem>}
            </Menu>
          </Box>
         
          <Box  justifyContent="end" alignItems="center" sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>

            {pages.map((item) => (
              <NavLink
                to={item.link}
                key={item.name}
                end={item.name==="Home"}
                style={({isPending, isActive})=>linkStyle(isActive,isPending)}

              >
                {item.name}
              </NavLink>
            ))}
            {(!userLoginState.isAuthenticated)&&ABOUT}
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
             {  settings.map((item) =>(<MenuItem key={item.name} sx={{width:"100%"}}value ={item.name} onClick={()=>handleCloseUserMenu(item.name)}>
                  <NavLink
                      to={item.link}
                      key={item.name}
                      end={item.name==="Home"}
                      style={({isPending, isActive})=>menuItemtyle(isActive,isPending)}
                  >
                     {item.name}
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
