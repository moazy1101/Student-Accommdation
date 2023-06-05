import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = ({backgroundColor}) => {
  const location = useLocation()
  function pathMathRoute(route) {
    if(location.pathname === route) {
      return true
    } else {
      return false
    }
  }

  const [logged, setLogged] = useState(false)
  const auth = getAuth()
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if(user) {
        setLogged(true)
      } else {
        setLogged(false)
      }
    })
  }, [auth])

  return (
    <div style={{backgroundColor}}>
      <div className="container" >
        <nav className='flex items-center justify-between'>
        <div className="logo text-2xl font-bold tracking-wider text-white">
          <Link to={'/'}>
            Farabi  
          </Link> 
        </div>
        <ul className='flex gap-10 py-6 text-gray-300'>
          <li className={`hover:text-white font-semibold tracking-widest ${pathMathRoute('/') && 'text-white'}`}>
            <Link to={'/'}>
              Home
            </Link>
          </li>
          <li className={`hover:text-white font-semibold tracking-widest ${pathMathRoute('/rent') && 'text-white'}`}>
            <Link to={'/rent'}>
              Rent
            </Link>
          </li>
          <li className={`hover:text-white font-semibold tracking-widest ${pathMathRoute('/dashboard') && 'text-white'}`}>
            <Link to={'/dashboard'}>
              post
            </Link>
          </li>
          <li className={`hover:text-white font-semibold tracking-widest 
            ${pathMathRoute('/sign-up') && 'text-white'}
            ${logged ? 'hidden' : ''}`}>
            <Link to={'/sign-up'}>
              Sign up
            </Link>
          </li>
          <li className={`hover:text-white font-semibold tracking-widest 
            ${pathMathRoute('/sign-in') && 'text-white'}
            ${logged ? 'hidden' : ''}`}>
            <Link to={'/sign-in'}>
              Sign in
            </Link>
          </li>
          <li className={`hover:text-white font-semibold tracking-widest 
            ${pathMathRoute('/post') && 'text-white'}
            ${!logged ? 'hidden' : ''}`}>
            <Link to={'/post'}>
                Post
            </Link>
          </li>
          <li className={`hover:text-white font-semibold tracking-widest 
            ${pathMathRoute('/profile') && 'text-white'}
            ${!logged ? 'hidden' : ''}`}>
            <Link to={'/profile'}>
              Profile
            </Link>
          </li>
        </ul>
        </nav>
      </div>
    </div>
  )
}

export default Navbar