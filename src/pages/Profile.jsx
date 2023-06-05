import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import {  AiOutlineMail } from "react-icons/ai";
import { FaCloudUploadAlt} from "react-icons/fa";
import { useState } from "react";
import {
  getAuth,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";

import verify from "../components/assets/verify.jpg";
import sucess from "../components/assets/successfull.jpg";
import inbox from "../components/assets/email.gif";
import { toast } from "react-toastify";
import { db } from "../Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import { useEffect } from "react";
import Spinner from "../components/Spinner";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";


const Profile = () => {
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [changeDetail, setChangeDetail] = useState(false);
  const [user, setUser] = useState({});
  const [linkSent, setlinkSent] = useState(false);
  const [profileP, setProfileP] = useState(null)
  const [url, setUrl] = useState(null)
  const auth = getAuth();

  useEffect(() => {
    async function getUserData() {
      const ref = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(ref);
      let u;
      if (docSnap.exists()) {
        u = docSnap.data();
        setUser(u);
        setFormData(u)
      }
    }
    getUserData();
  }, [auth.currentUser.uid]);

  console.log(user)
  console.log(auth.currentUser)

  function changeProfileP(e) {
    if(e.target.files[0]) {
      setProfileP(e.target.files[0])
    }
  }
  function uploadProfileP() {
    const storage = getStorage();
    const date = new Date().getTime()
    const imageRef = ref(storage,`users/${ user.displayName + date}`)
    setLoading(true)
    const userRef = doc(db, 'users', auth.currentUser.uid)
    uploadBytes(imageRef, profileP)
      .then(() => {
        getDownloadURL(imageRef)
          .then((url) => {
            setUrl(url);
            updateDoc(userRef, {
              ...user,
              photoURL: url
            });
            updateProfile(auth.currentUser, {
              photoURL: url
            }).then(() => {
              setLoading(false)
              toast.success('Profile pic updated')
            }).catch((error) => {
              toast.error('error while uploading')
            });
          })
          .catch((error) => {
            toast.error('error while uploading')
          });
        setProfileP(null);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  console.log(user.profileUrl)
  
  console.log(profileP)

  const { name, email, location, phone } = formData;
  function onChange(e) {
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  }

  function capitalizeName(name) {
    if (name !== null) {
      let arr = name.split(" ");
      for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substr(1);
      }
      return arr.join(" ");
    }
  }

  function validate(values) {
    const errors = {};
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!values.name) {
      errors.name = "Please enter your name";
    }
    if (!values.email) {
      errors.email = "please enter a valid email";
    } else if (!regex.test(email)) {
      errors.email = "please enter a valid email";
    }
    return errors;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setFormErrors(validate(formData));
  }

  async function submit() {
    try {
      // update auth
      await updateProfile(auth.currentUser, {
        displayName: name,
      });
      // update firestore
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, {
        name: name,
        phone: phone,
        location: location,
      });
      toast.success("updated successfully");
    } catch (error) {
      toast.success("something went wrong");
    }
  }

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      submit();
    }
  }, [formErrors]);

  async function sendVerification() {
    try {
      setLoading(true);
      await sendEmailVerification(auth.currentUser);
      toast.success("Link was sent successfully");
      setlinkSent(true);
      setLoading(false);
    } catch (error) {
      toast.error("Some thing went wrong");
    }
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <Navbar backgroundColor="#222222" />
      {auth.currentUser.emailVerified ? (
        <>
          <div className="profile">
            <div className="container flex pt-14 gap-20 max-md:gap-10 justify-center">
              <Sidebar />
              <div className="info flex-1">
              <div className="flex justify-between">
                <div className="user mb-8 flex items-center gap-6 ml-10 max-sm:ml-0 flex-col md:flex-row">
                  <div className="flex flex-col items-center">
                    <img
                      alt="avatar"
                      src={url ? url : auth.currentUser.photoURL ? auth.currentUser.photoURL : user.profileUrl}
                      className="w-[120px] h-[120px] rounded-full mb-3"
                    />
                    {profileP === null ?
                    <>
                      <label className="custom-file-upload text-xs text-blue-700 cursor-pointer">
                      <input 
                        type="file"
                        className="hidden"
                        name="profileP"
                        accept=".jpg, .png, .jpeg" 
                        onChange={changeProfileP}
                        />
                      Replace <FaCloudUploadAlt className="inline-block text-sm ml-1" />
                    </label>
                    </> 
                    :
                    <p 
                      className="custom-file-upload text-xs text-blue-700 cursor-pointer"
                      onClick={uploadProfileP}>
                        Submit
                      </p>}
                  </div>
                  <div className="name text-center">
                    <h1 className="text-lg">
                      {capitalizeName(auth.currentUser.displayName)}
                    </h1>
                    <span className="text-gray-500 text-xs">
                      {auth.currentUser.email}
                    </span>
                  </div>
                  
                  {/* <div className="name text-center">
                    <p className="text-lg">
                    Joined: {format(user.date, "MMMM YYY")}
                    </p>
                  </div> */}
                </div>
                  <button onClick={()=>navigate("/chat")}  className="main-btn my-2 block"><AiOutlineMail className="mr-2"/> Message</button>
                </div>
                <form
                  className="flex gap-12 flex-wrap justify-center flex-col md:flex-row items-center"
                  onSubmit={onSubmit}
                >
                  <div className="field flex flex-col">
                    <h4 className="ml-2 mb-2 text-sm">Name</h4>
                    <input
                      type="text"
                      name="name"
                      value={name}
                      placeholder="name"
                      onChange={onChange}
                      className={`${changeDetail ? 'bg-black' : ''} rounded-3xl w-[300px] lg:w-[300px] xl:w-[350px] focus:ring-0 h-12 p-4 text-sm bg-[#fcfcfc]`}
                      disabled={!changeDetail}
                      required
                    />
                    <p className="text-xs mt-2 ml-2 text-red-600">
                      {formErrors.name}
                    </p>
                  </div>
                  <div className="field flex flex-col">
                    <h4 className="ml-2 mb-2 text-sm">Email</h4>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      placeholder="email"
                      onChange={onChange}
                      className="rounded-3xl w-[300px] lg:w-[300px] xl:w-[350px] focus:ring-0 h-12 p-4 text-sm bg-[#fcfcfc]"
                      // disabled={!changeDetail}
                      disabled
                      required
                    />
                    <p className="text-xs mt-2 ml-2 text-red-600">
                      {formErrors.email}
                    </p>
                  </div>
                  <div className="field flex flex-col">
                    <h4 className="ml-2 text-sm mb-2">Location</h4>
                    <input
                      type="text"
                      name="location"
                      value={location}
                      placeholder="enter location"
                      onChange={onChange}
                      className="rounded-3xl w-[300px] lg:w-[300px] xl:w-[350px] focus:ring-0 h-12 p-4 text-sm bg-[#fcfcfc]"
                      minLength="3"
                      disabled={!changeDetail}
                      required
                    />
                  </div>
                  <div className="field flex flex-col">
                    <h4 className="ml-2 text-sm mb-2">Phone</h4>
                    <input
                      type="text"
                      name="phone"
                      value={phone}
                      placeholder="enter phone number"
                      onChange={onChange}
                      className="rounded-3xl w-[300px] lg:w-[300px] xl:w-[350px] focus:ring-0 h-12 p-4 text-sm bg-[#fcfcfc]"
                      minLength="6"
                      disabled={!changeDetail}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="main-btn cursor-pointer mx-auto mt-8 mb-8 block w-[150px]"
                    onClick={() => {
                      setChangeDetail((prevState) => !prevState);
                      changeDetail && setIsSubmit(true);
                    }}
                  >
                    {changeDetail ? "Apply" : "Edit"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex gap-10 relative items-center">
            <div>
              <img
                src={linkSent ? sucess : verify}
                alt=""
                className="w-[1300px] max-sm:rounded-full max-lg:absolute -z-10 max-lg:opacity-[0.6] max-sm:top-16"
              />
            </div>
            <div className="container text-center xl:mr-48 ml-22 max-lg:mt-32">
              {!linkSent && (
                <p className="font-bold text-lg text-red-500 mb-6">
                  Your email is not verified!!
                </p>
              )}
              <p className="font-bold text-lg mb-6">
                Click this button to and we will send you a verification link
              </p>
              {linkSent ? (
                <>
                  <p className="font-bold text-green-600">
                    Link was sent successfully! check your inbox please
                  </p>
                  <img src={inbox} className="mx-auto mt-6" alt="" />
                </>
              ) : (
                <button
                  className="main-btn w-[200px] mx-auto"
                  onClick={sendVerification}
                >
                  Send verification link
                  <AiOutlineMail className="text-white ml-2" />
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
