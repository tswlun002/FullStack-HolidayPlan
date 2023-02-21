import './App.css';
import Card from './card';
import Header from './Header';
import "./Form.css"
import { useState , useReducer} from "react"
import Form from './Form';
import { useEffect } from 'react';
import {Route, Routes} from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import {RegisterUser, LogInUser} from './User';
import { FetchHolidayPlan,AddHolidayPlan,DeleteHolidayPlan,UpdateHolidayPlan } from './HolidayPlan';

const App=()=>{


const [Data, setData] = useState([]);

//Login registered values
const[userRegister, dispatchRegister] = useReducer((state, action)=>{
  return {...state,...action,
   }
},{firstname:"",lastname:"",username:"",password:"",confirmPassword:"", registered:false})

//Login registered user
const[userLogin, dispatchLogin] = useReducer((state, action)=>{
  return {...state,...action,
        }
        },{username:"",password:"", logedIn:false})

   
//call fetch data on hooks
  useEffect(() =>{
    if(!userRegister.registered ) alert(`${userRegister.username} is not registered`)
    else if (userLogin.logedIn) FetchHolidayPlan(setData)
  },[]
  );


  //Make cards 
  const Cards  = Data.map((data)=> <Card setData={setData} fetchData={FetchHolidayPlan} data={data}
                                     deleteData={DeleteHolidayPlan} updateData={UpdateHolidayPlan}/>);
  
  const AppBody = ()=>{
    return (
      <div className="body">
      <div className="form">
          <Form  data={Data} addData={AddHolidayPlan}  />
        </div>
      <div className="cards">
          {Cards}
        </div>
    </div>
    )
  }
 /**////////////////////////////////////////////////////////////////////APP//////////////////////////////////////////////// */
 return (
  <div className="App">
    <div>
        <Header/>
    </div>
    <Routes>
      <Route path="/" element={<Login state={userLogin} dispatchLogin={dispatchLogin} loginUser={LogInUser}/>}/>
      <Route path="/register" element={<Register state={userRegister} dispatchRegister={dispatchRegister} registerUser={RegisterUser}/>}/>
      <Route path="/home" element={<AppBody/>}/>  
    </Routes>
  </div>
 )
}

export default App;
