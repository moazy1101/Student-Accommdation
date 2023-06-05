import React from 'react'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import signInPic from '../components/assets/lo.jpg'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import OAuth from '../components/OAuth';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../Firebase'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from 'react-toastify'
import { useEffect } from 'react';

const SignIn = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const { email, password } = formData

const auth = getAuth()
useEffect(() => {
  if(auth.userCredential) {
    navigate('/')
  }
}, [])

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    try{
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      if(userCredential.user) {
        navigate('/')
      }
    } catch{
      toast.error('make sure info is correct')
    }
  }

  return (
    <div className='h-[100vh] overflow-hidden'>
      <Navbar backgroundColor='#222222'/>
      <div className='flex gap-10 relative'>
        <div>
          <img src={signInPic} alt="" 
            className='w-[1400px] max-sm:rounded-full max-lg:absolute -z-10 max-lg:opacity-[0.6] max-sm:top-16'/>
        </div>
        <div className="form container xl:mr-48 ml-22 mt-20">
          <h1 className='text-3xl mb-12 text-center tracking-wide font-bold'>Sign in</h1>
          <form onSubmit={onSubmit} className='flex flex-col gap-6 justify-center items-center'>
            <input 
              type="email" 
              name='email'
              value={email}
              onChange={onChange}
              placeholder='email' 
              className='rounded-3xl w-[70%] lg:w-[80%] xl:w-[70%] focus:ring-0 h-12 p-4'/> 
            <div className='w-[70%] lg:w-[80%] xl:w-[70%] relative'>
              <input 
                type={showPassword ? 'text' : 'password'}
                name='password'
                value={password}
                onChange={onChange}
                placeholder='password' 
                className='rounded-3xl w-full focus:ring-0 h-12 p-4 '/> 
                {showPassword 
                  ? <FaEyeSlash onClick={() => setShowPassword((prevState) => !prevState)} className='absolute right-4 cursor-pointer top-4' /> 
                  : <FaEye onClick={() => setShowPassword((prevState) => !prevState)} className='absolute right-4 cursor-pointer top-4' />}
            </div>
            <button className='main-btn'>Sign In</button>
            <div className='flex before:border-t before:flex-1 before:border-grey-300 w-[70%] mx-auto
                            items-center after:border-t after:flex-1 after:border-grey-300 text-center' >
              <p className='text-center m-4'>Or sign up with</p>
            </div>
            <OAuth />
            <Link to={'/forgot-password'} className="text-sky-600 hover:text-sky-800 transition">Forgot login or password?</Link>  
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignIn