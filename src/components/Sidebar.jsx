import { getAuth } from 'firebase/auth'
import React from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { CiHeart, CiStar, CiUser } from 'react-icons/ci'
import { BsCardList } from 'react-icons/bs'
import { FaHandshake } from 'react-icons/fa'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'

const Sidebar = () => {
  const l = useLocation()
  function pathMathRoute(route) {
    if(l.pathname === route) {
      return true
    } else {
      return false
    }
  }

  const navigate = useNavigate()
  const auth = getAuth()
  function logOut() {
    auth.signOut()
    navigate('/')
  }

  return (
    <div className={`sidebar overflow-hidden w-[70px] md:w-[30%] lg:w-[20%] border-r `}>
      <h1 className='text-lg font-semibold hidden md:block'>User Profile</h1>
      <ul className='mt-8 text-gray-500 ml-[10px]'>
        <li className={` mb-8  hover:text-black
                      ${pathMathRoute('/profile') && 'text-black border-r-2 border-[#d92228]'}`}>
          <Link to={'/profile'} className='flex gap-4 items-center'>
            <CiUser className='text-2xl' /> <span className='hidden md:block'>Info</span>
          </Link>
        </li>
        <li className={` mb-8  hover:text-black
                      ${pathMathRoute('/profile/create-listing') && 'text-black border-r-2 border-[#d92228]'}`}>
          <Link to={'/profile/create-listing'} className='flex gap-4 items-center'>
            <FaHandshake className='text-2xl' /> <span className='hidden md:block'>Offer for Rent</span>
          </Link>
        </li>
        <li className={` mb-8  hover:text-black
                      ${pathMathRoute('/profile/my-listings') && 'text-black border-r-2 border-[#d92228]'}`}>
          <Link to={'/profile/my-listings'} className='flex gap-4 items-center'>
            <BsCardList className='text-2xl' /> <span className='hidden md:block'>My Listings</span>
          </Link>
        </li>
        <li className={` mb-8  hover:text-black
                      ${pathMathRoute('/profile/favourites') && 'text-black border-r-2 border-[#d92228]'}`}>
          <Link to={'/profile/favourites'} className='flex gap-4 items-center'>
            <CiHeart className='text-2xl' /> <span className='hidden md:block'>Favourites</span>
          </Link>
        </li>
        <li className={` mb-8  hover:text-black
                      ${pathMathRoute('/.') && 'text-black border-r-2 border-[#d92228]'}`}>
          <Link to={'/Posts'} className='flex gap-4 items-center'>
            <CiStar className='text-2xl' /> <span className='hidden md:block'>Posts</span>
          </Link>
        </li>
        <li className='flex gap-4 items-center mb-8 main-color cursor-pointer' onClick={logOut}>
        <AiOutlineLogout className='text-xl' />
          <span className='hidden md:block'>Log out</span>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar