import {BsCameraVideoFill, BsPerson} from 'react-icons/bs'
import {IoMdCall, IoMdPersonAdd} from 'react-icons/io'
import {FiMoreHorizontal} from 'react-icons/fi'
import Messages from './messages'
import Input from './Input'
import React, { useContext } from "react";
import { ChatContext } from '../components/hooks/ChatContext'
import { signOut } from 'firebase/auth'
import { auth } from '../Firebase'
import { IoLogOutOutline } from 'react-icons/io5'
import { AiOutlineHome, AiOutlineStar } from 'react-icons/ai'
import { useState } from 'react'
import { useNavigate } from 'react-router'

const Chat=()=>{
    const [toggle , setToggle] = useState(true)
    const { data } = useContext(ChatContext);
    const navigate=useNavigate();

    return(
        <div className='h-[100%] overflow-hidden relative z-0 message'>
        <div className="relative h-16 border-b"> 
            <div className=" rounded-tr-lg px-3">
                <div className='flex items-center justify-start'>
            <img className=" rounded-full w-12 h-12 mx-2 mb-2 my-2" src={data.user?.photoURL?data.user?.photoURL:"134914.png"}  alt="" />
                <span className='text-black font-blod'>{data.user?.displayName}</span>
                </div>
                <div className="chatIcon text-2xl text-black flex absolute top-4 right-1 px-1">
                    <BsCameraVideoFill className='px-1'/>
                    <a href={`tel:${data.user?.phone}`}><IoMdCall className='px-1'/></a>
                    <FiMoreHorizontal onClick={() => setToggle(!toggle)}  className='px-1 cursor-pointer'/>
                </div>
            </div>
            <div className={`content ${toggle?"hidden":""} bg-white rounded-l-md rounded-br-md py-1 w-32 absolute shadow-md top-12 right-5`}>
                        <div onClick={()=>navigate("/") } className='flex w-full  justify-center cursor-pointer  my-3 items-center'>
                    <AiOutlineHome  className="font-light text-blue-500 text-2xl"/>
                            <p className='text-black font-light px-1'>home</p>
                        </div>
                        <div onClick={()=>navigate("/rent") } className='flex w-full  justify-center cursor-pointer my-3 items-center'>
                    <AiOutlineStar  className="font-light text-blue-500 text-2xl"/>
                            <p className='text-black font-light px-2'>rent</p>
                        </div>
                        <div onClick={()=>navigate("/profile") } className='flex w-full justify-center cursor-pointer  my-3 items-center'>
                    <BsPerson  className="font-light text-blue-500 text-2xl"/>
                            <p className='text-black font-light px-1'>profile</p>
                        </div>
                        <div onClick={()=>signOut(auth) } className='flex w-full  justify-center cursor-pointer  my-3 items-center'>
                    <IoLogOutOutline  className="font-light text-red-500 text-2xl"/>
                            <p className='text-black font-light px-1'>Logout</p>
                        </div>
                    </div>
        </div>
        <div className='messages-container overflow-auto'>
            <Messages/>
        </div>
            <div className="absolute bottom-10 w-full ">
        <Input/>
            </div>
            
        </div>
    )
}
export default Chat
