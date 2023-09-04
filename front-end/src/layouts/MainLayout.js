import { Outlet } from "react-router-dom";
import Header  from '../component/Header'
import Footer from "../component/Footer";
import { useTheme } from '@material-ui/core';
const MainLayout =({appData})=>{
  const theme =  useTheme();
     return (
      <div className="App">
        <Header appData={appData}className="app-bar"/>
        <Outlet/>
        <Footer appData={appData}/>
      </div>
     )


}
export default MainLayout;