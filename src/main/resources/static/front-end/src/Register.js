import {Link} from 'react-router-dom'
import './Register.css'
import { useNavigate } from "react-router-dom";

const Register =({state ,dispatchRegister, registerUser})=>{
    const navigate = useNavigate();
    return (

        <div className="register">
               <div className="register-container">
                    <h1 className="heading">Register</h1>

                    <form className="register-inputs" autoComplete="off">
                        <label className="firstname-label">Firstname</label>
                        <input type="text" className="firstname-input" placeholder="enter firstname"  value={state.firstname}
                        onChange={(e)=>dispatchRegister({firstname:e.target.value})}></input>
                        <label className="lastname-label">Lastname</label>
                        <input type="text" className="lastname-input" placeholder="enter lastname" value={state.lastname}
                        onChange={(e)=>dispatchRegister({lastname:e.target.value})}></input>
                        <label className="username-label">Username</label>
                        <input type="text" className="username-input" placeholder="enter username" value={state.username} 
                         onChange={(e)=>dispatchRegister({username:e.target.value})}></input>
                        <label className="password-lable">Password</label>
                        <input type="password" autoComplete='new-password' className="password-input" placeholder="password" value={state.password}
                        onChange={(e)=>dispatchRegister({password:e.target.value})}></input>
                        <label className="confirm-password-lable">Confirm-Password</label>
                        <input type="password" autoComplete='new-password' className="password-input" placeholder="confirm password" value={state.password}
                        onChange={(e)=>dispatchRegister({confirmPassword:e.target.value})}></input>
                        <button className="submit-btn" onClick={(e)=>{
                            e.preventDefault(); 
                            if(state.password===state.confirmPassword){
                                registerUser({...state,registered:false},dispatchRegister); 
                                if(state.registered) navigate("/")
                            }
                            {
                                alert("Password don not match")
                            }
                       }}>Register</button>

                    </form>
                    <div className="login-nav">
                        <Link   to="/" className="login-link" >Registered already, click to login </Link>
                    </div>
            </div>

        </div>
    )
}

export default Register;