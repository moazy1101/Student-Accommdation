import React from "react";
import Navbar from "./Navbar"
import Search from "./Search"
import Chats from "./Chats"
import { AiOutlineHome, AiOutlineStar } from "react-icons/ai";
import { BsPerson } from "react-icons/bs";
import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase";

const Sidebar = () => {
  const navigate=useNavigate();
  return (
    <div className="h-[100vh] overflow-hidden">
      <div className="w-8 absolute left-1  top-[4rem]">
                        <div onClick={()=>navigate("/") } className='flex w-full  justify-center cursor-pointer  my-5 items-center'>
                    <AiOutlineHome  className="font-light text-blue-500 text-2xl"/>
                        </div>
                        <div onClick={()=>navigate("/rent") } className='flex w-full  justify-center cursor-pointer my-5 items-center'>
                    <AiOutlineStar  className="font-light text-blue-500 text-2xl"/>
                        </div>
                        <div onClick={()=>navigate("/profile") } className='flex w-full justify-center cursor-pointer  my-5 items-center'>
                    <BsPerson  className="font-light text-blue-500 text-2xl"/>
                        </div>
                        <div onClick={()=>signOut(auth) } className='flex w-full  justify-center cursor-pointer  my-5 items-center'>
                    <IoLogOutOutline  className="font-light text-red-500 text-2xl"/>
                        </div>
                    </div>
      <div className='overflow-auto rounded-b-lg'>
      <div className="absolute top-[-.01rem] left-[.5rem] py-1 flex justify-center items-center">
                <img src="favicon.ico" class="w-7 mr-3" alt="FlowBite Logo" />
                <span className="font-bold  text-black">Farabi Chat</span>
                </div>
      <Navbar/>
      <Search/>
      <div className='overflow-auto h-[50vh] rounded-b-lg'>
      <Chats/>
      </div>
      </div>
    </div>
  );
};

export default Sidebar;
