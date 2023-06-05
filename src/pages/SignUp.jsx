import React, { useEffect } from 'react'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import signUpPic from '../components/assets/signup.jpg'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import OAuth from '../components/OAuth';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db } from '../Firebase'
import { serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const SignIn = () => {
  const navigate = useNavigate()
  
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    phone: '00000000000',
    location: 'Unknown',
  })
  const { displayName, email, password, phone } = formData

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
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      updateProfile(auth.currentUser, {
        displayName: displayName,
        phoneNumber: phone
      })
      const formDataCopy = {...formData};
      delete formDataCopy.password;
      formDataCopy.timeStamp = serverTimestamp();
      const defaultProfileUrl = 'https://firebasestorage.googleapis.com/v0/b/farabi-8552f.appspot.com/o/image?alt=media&token=1a020c99-5e50-4a4b-b911-917024d66ddb'
      formDataCopy.profileUrl = auth.currentUser.photoURL ?? defaultProfileUrl
      
      await setDoc(doc(db, 'users', user.uid), formDataCopy)
      await setDoc(doc(db, "userChats", user.uid), {});
      navigate('/')
    } catch (error) {
      toast.error('please make sure your info is correct')
    }
  }

  return (
    <div className='h-[100vh] overflow-hidden'>
      <Navbar backgroundColor='#222222'/>
      <div className='flex gap-10 relative'>
        <div>
          <img src={signUpPic} alt="" 
            className='w-[1400px] max-sm:rounded-full max-lg:absolute -z-10 max-lg:opacity-[0.6] max-sm:top-16'/>
        </div>
        <div className="form container xl:mr-48 ml-22 mt-20">
          <h1 className='text-3xl mb-12 text-center tracking-wide font-bold'>Sign up</h1>
          <form onSubmit={onSubmit} className='flex flex-col gap-6 justify-center items-center'>
          <input 
              type="text" 
              name='displayName'
              value={displayName}
              onChange={onChange}
              placeholder='name' 
              className='rounded-3xl w-[70%] lg:w-[80%] xl:w-[70%] focus:ring-0 h-12 p-4'/> 
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
            <button className='main-btn'>Sign up</button>
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