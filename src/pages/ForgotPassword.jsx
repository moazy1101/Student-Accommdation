import React from 'react'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import forgotPic from '../components/assets/forgot.jpg'
import OAuth from '../components/OAuth';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from 'react-toastify';

const SignUp = () => {
  const [email, setEmail] = useState('')
  function onChange(e) {
    setEmail(e.target.value)
  }

  async function onSubmit(e) {
    e.preventDefault()
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email)
      toast.success('Check your inbox')
    } catch (error) {
      toast.error('Make sure the email is correct')
    }
  }

  return (
    <div className='h-[100vh] overflow-hidden'>
      <Navbar backgroundColor='#222222'/>
      <div className='flex gap-10 relative justify-center'>
        <div>
          <img src={forgotPic} alt="" 
            className='w-[1400px] max-sm:rounded-full max-lg:absolute -z-10 max-lg:opacity-[0.6] max-sm:top-16'/>
        </div>
        <div className="form container xl:mr-48 ml-22 mt-36">
          <h1 className='text-3xl mb-12 text-center tracking-wide font-bold'>Forgot Password ?</h1>
          <form onSubmit={onSubmit} className='flex flex-col gap-6 justify-center items-center'>
            <input 
              type="email" 
              name='email'
              value={email}
              onChange={onChange}
              placeholder='email' 
              className='rounded-3xl w-[70%] lg:w-[80%] xl:w-[70%] focus:ring-0 h-12 p-4'/> 
            <button className='main-btn px-6'>Send reset Password</button>
            <div className='flex before:border-t before:flex-1 before:border-grey-300 w-[70%] mx-auto
                            items-center after:border-t after:flex-1 after:border-grey-300 text-center' >
              <p className='text-center m-4'>Or sign up with</p>
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp