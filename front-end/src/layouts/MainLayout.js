import { Outlet } from "react-router-dom";
import Header  from '../component/Header'
const MainLayout =()=>{
     return (
      <div className="App">
        <Header/>
        <Outlet/>
      </div>
     )


}
export default MainLayout;