import { Outlet } from "react-router-dom";
import Header  from '../component/Header'
const MainLayout =()=>{
     return (
      <div className="App">
        <Header className="app-bar"/>
        <div style={{marginTop:"6rem"}} className="app-body">
          <Outlet/>
        </div>
      </div>
     )


}
export default MainLayout;