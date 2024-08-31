import React, { useState } from 'react'
import './Login.css'
import assets from  '../../assets/assets'
import { signup,login,resetPass } from '../../config/Firebase'



const Login = () => {

    const [currentState,setcurrentState]=  useState("Sign up");
  const [username,SetUsername ]= useState ("");
  const[email,SetEmail]= useState ("");
  const[password,SetPassword]= useState ("");
  const  onSubmitHandler = ()=>{
    event.preventDefault();
    if(currentState==="Sign up"){
      signup(username,email,password);
    }
else{
  login(email,password)
}
  }

  return (
    <div className='login'>
        <h1 className='loginhead'><span className='head1'>Quick-</span><span className='head2'>Chat</span></h1>
     
   { /*<img src= {background.png} alt="" className='logo' />*/}
    <form onSubmit={onSubmitHandler} className="login-form">
      <h2> {currentState}</h2>
     {currentState === "Sign up" ? <input    onChange={(e)=>SetUsername(e.target.value)} value={username}  type="text"  placeholder='username' className="form-input"  required/> : null}
      <input  onChange={(e)=>SetEmail(e.target.value)} value={email} type="email"   placeholder='Email address' className="form-input "  required  />
      <input  onChange={(e)=>SetPassword(e.target.value)} value={password} type="password"  placeholder='Password' className="form-input"  required />
      <button type='submit'> { currentState ===  "Sign up"?"Create account" :"Login now     "}</button>
      <div className='login-policy'>
        <input type="checkbox" />
        <p>Agree to the terms of use & privacy policy.</p>
      </div>
      <div className='login_forgot'>
        {
            currentState ===  "Sign up" 
            ?<p className='login-toggle'>   Already have an account <span onClick={( )=> setcurrentState("Login")}> click here </span></p>
            :<p className='login-toggle'>   Create an account <span onClick={( )=> setcurrentState("Sign up")}> click here </span></p>
        }
        {currentState === "Login" ?<p className='login-toggle'>   Forgot Password <span onClick={( )=> resetPass(email)}> reset here</span></p>:null}
        
      </div>
    </form>
      
  </div>
  )
}

export default Login
