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




function Header() {

  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
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

  const userHeader = `${userLoginState.firstname} ${userLoginState.lastname} `;
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

  const linkStyle =(page,isActive=false, isPending=false)=>{
     return{textDecoration:"none",
             my: 1,display: 'block' ,
             padding:"0rem 3rem",

              color:isActive?"orange":isPending?"green":"white",

          }
  }
    const menuItemtyle =(page,isActive=false, isPending=false)=>{
       return{textDecoration:"none",
               my: 1,display: 'block' ,
               padding:"0.5rem",

                color:isActive?"orange":isPending?"green":"black",

            }
    }
  const[open, setOpen ]= React.useState(false);
  const handleClickNested = () => {  
    setOpen(!open);
  }

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

               settingAndPages.map((item) => (
                    <MenuItem className="item-tittle" sx={{color:"black",display:"block", width:"100%"}}key={item.name} 
                    onClick={()=>handleCloseUserMenu(item.name)}>
                    {
                        <NavLink
                            to={item.link}
                            key={item.name}
                            end={item.name==="Home"}
                            style={({isPending, isActive})=> menuItemtyle(item.name,isActive,isPending)}
                            >
                          {item.name}
                        </NavLink>
                    }
                      
                    </MenuItem>
                  ))}
            </Menu>
          </Box>
         
          <Box  justifyContent="end" alignItem="center" sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>

            {pages.map((item) => (
              <NavLink
                to={item.link}
                key={item.name}
                end={item.name==="Home"}
                style={({isPending, isActive})=>linkStyle(item.name,isActive,isPending)}

              >
                {item.name}
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
             {  settings.map((item) =>(<MenuItem key={item.name} sx={{width:"100%"}}value ={item.name} onClick={()=>handleCloseUserMenu(item.name)}>
                  <NavLink
                      to={item.link}
                      key={item.name}
                      end={item.name==="Home"}
                      style={({isPending, isActive})=>menuItemtyle(item.name,isActive,isPending)}
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
