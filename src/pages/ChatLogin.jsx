import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase";
import logInPic from '../components/assets/login.webp'
import Navbar from "../components/Navbar";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ChatOAuth from "../components/ChatOAuth";

const ChatLogin = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/chat")
    } catch (err) {
      setErr(true);
    }
  };
  return (
    <div className='h-[100vh] overflow-hidden'>
    <Navbar backgroundColor='#222222'/>
    <div className='flex gap-10 relative'>
      <div>
        <img src={logInPic} alt="" 
          className='w-[1400px] max-sm:rounded-full max-lg:absolute -z-10 max-lg:opacity-[0.6] max-sm:top-16'/>
      </div>
      <div className="form container xl:mr-48 ml-22 mt-20">
        <h1 className='text-3xl mb-12 text-center tracking-wide font-bold'>Sign in</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6 justify-center items-center'>
          <input type="email" placeholder="email" 
          className='rounded-3xl w-[70%] lg:w-[80%] xl:w-[70%] focus:ring-0 h-12 p-4'/>
          <div className='w-[70%] lg:w-[80%] xl:w-[70%] relative'>
          <input type={showPassword ? 'text' : 'password'}
           placeholder="password" 
           className='rounded-3xl w-full focus:ring-0 h-12 p-4 '
           />
           {showPassword 
           ? <FaEyeSlash onClick={() => setShowPassword((prevState) => !prevState)} className='absolute right-4 cursor-pointer top-4' /> 
            : <FaEye onClick={() => setShowPassword((prevState) => !prevState)} className='absolute right-4 cursor-pointer top-4' />}
          </div>
          <button className='main-btn'>Sign in</button>
          {err && <span>Something went wrong</span>}
        <p>You don't have an account? <Link to="/Chat/register">Register</Link></p>
        <div><ChatOAuth /></div>
        </form>
      </div>
    </div>
    </div>
    
  );
};

export default ChatLogin;
