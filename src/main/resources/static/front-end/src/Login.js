import {Link} from 'react-router-dom'
import './Login.css'
const Login =({state ,dispatchLogin, loginUser})=>{
    

    return (

        <div className="login">
               <div className="login-container">
                    <h1 className="heading">Login</h1>
                    <form className="login-inputs" autoComplete='off'>
                        <label className="username-label">Username</label>
                        <input type="text" className="username-input" placeholder="enter username" value={state.userName} 
                        onChange={(e)=>dispatchLogin({username:e.target.value})}></input>
                        <label className="password-lable">Password</label>
                        <input type="password" className="password-input" placeholder="password" autoComplete='new-password' value={state.password}
                        onChange={(e)=>dispatchLogin({password:e.target.value})}></input>
                        <button className="submit-btn" onClick={(e)=>{e.preventDefault(); loginUser(state) ;}}>Log in</button>
                    </form>
                    <div className="register-nav">
                        <Link   to="/register" className="register-link" >Not registered, click to register </Link>
                    </div>
            </div>
            

        </div>
    )
}

export default Login;