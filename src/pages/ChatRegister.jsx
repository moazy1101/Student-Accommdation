import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import signUp from '../components/assets/up.jpg'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { RiImageAddFill } from "react-icons/ri";

const ChatRegister = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/chat");
          } catch (err) {
            console.log(err);
            setErr(true);
            setLoading(false);
          }
        });
      });
    } catch (err) {
      setErr(true);
      setLoading(false);
    }
  };

  return (
    <div className='h-[100vh] overflow-hidden'>
      <Navbar backgroundColor='#222222'/>
      <div className='flex gap-10 relative'>
        <div>
          <img src={signUp} alt="" 
            className='w-[1400px] max-sm:rounded-full max-lg:absolute -z-10 max-lg:opacity-[0.6] max-sm:top-16'/>
        </div>
        <div className="form container xl:mr-48 ml-22 mt-20">
          {/* <h1 className='text-3xl mb-12 text-center tracking-wide font-bold'>Sign up</h1> */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-6 justify-center items-center'>
        <label htmlFor="file">
            <div className="w-24 h-24 rounded-full shadow-lg border-1 flex items-center justify-center border-gray-400 cursor-pointer"><RiImageAddFill className="text-3xl text-blue-700"/></div>
          </label>
          <input required type="text" placeholder="display name" className='rounded-3xl w-[70%] lg:w-[80%] xl:w-[70%] focus:ring-0 h-12 p-4'/>
          <input required type="email" placeholder="email" className='rounded-3xl w-[70%] lg:w-[80%] xl:w-[70%] focus:ring-0 h-12 p-4' />
          <div className='w-[70%] lg:w-[80%] xl:w-[70%] relative'>
          <input required placeholder="password" type={showPassword ? 'text' : 'password'}
          className='rounded-3xl w-full focus:ring-0 h-12 p-4 '/> 
                {showPassword 
                  ? <FaEyeSlash onClick={() => setShowPassword((prevState) => !prevState)} className='absolute right-4 cursor-pointer top-4' /> 
                  : <FaEye onClick={() => setShowPassword((prevState) => !prevState)} className='absolute right-4 cursor-pointer top-4' />}
          </div>
          <input required style={{ display: "none" }} type="file" id="file" />
          <button className='main-btn' disabled={loading}>Sign up</button>
          {loading && "Uploading and compressing the image please wait..."}
          {err && <span>Something went wrong</span>}
        </form>
        <p className="text-center py-3">
          You do have an account? <Link to="/Chat/login" className="text-blue-500">Login</Link>
        </p>
      </div>
    </div>
    </div>
  );
};

export default ChatRegister;
