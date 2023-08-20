import { Outlet } from "react-router-dom";
import Header  from '../component/Header'
import Footer from "../component/Footer";
import {useMediaQuery} from '@mui/material';
import { useTheme } from '@material-ui/core';

const MainLayout =({appData})=>{
  const theme =  useTheme();
  const tabletLaptop = useMediaQuery(theme.breakpoints.down('900'));
  const phone = useMediaQuery(theme.breakpoints.down('600'));
  
     return (
      <div className="App">
        <Header appData={appData}className="app-bar"/>
        <div style={{marginTop:phone?'3.5rem':tabletLaptop?'4.5rem':"5.5rem"}} className="app-body">
          <Outlet/>
        </div>
        <Footer appData={appData}/>
      </div>
     )


}
export default MainLayout;