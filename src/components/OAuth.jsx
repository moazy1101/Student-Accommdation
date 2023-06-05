import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { serverTimestamp, setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { toast } from 'react-toastify';


const OAuth = () => {
  const navigate = useNavigate()

  async function onGoogleClick(){
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider)
      const user = result.user;
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)
      if(!docSnap.exists()){
        await setDoc(docRef, {
          displayName: user.displayName,
          email: user.email,
          location: 'unknown',
          uid:user.uid,
          phone: '00000000',
          timestamp: serverTimestamp(),
          date: Date.now(),
        })
      }
      await setDoc(doc(db, "userChats", user.uid), {});
    navigate('/')
    } catch (error) {
      toast.error('you are already signed up')
    }
  }

  return (
    <span onClick={onGoogleClick} className='cursor-pointer text-center border border-grey-300 
                      flex w-[60px] h-[60px] rounded-xl mx-auto justify-center items-center
                      hover:bg-gray-100 transition ease-in-out mt-2'>
      <FcGoogle className='mx-auto text-4xl' />
    </span>
)
}

export default OAuth