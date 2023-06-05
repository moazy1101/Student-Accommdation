import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../Firebase";
import { AuthContext } from "../components/hooks/AuthContext";
import { BiSearch } from "react-icons/bi";
import { toast } from 'react-toastify';
const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {
      toast.error('please make sure your info is correct')
    }

    setUser(null);
    setUsername("")
  };
  return (
    <div className="rounded-md border-b">
      <div className="overflow-hidden py-4 flex justify-center relative mb-1">
        <input
        className=" rounded-md w-full mx-2"
          type="text"
          placeholder="Search..."
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <BiSearch onClick={handleSearch} className='absolute right-6 text-gray-400 cursor-pointer top-7'/>
      </div>
      {err &&( <span className="font-bold text-red-500">User not found!</span>)}
      
      {user && (
        <div className="flex cursor-pointer items-center justify-start p-2 shadow-lg rounded-sm mb-1 mx-2 h-14  overflow-hidden" onClick={handleSelect}>
        <img className="rounded-full w-12 h-12 mx-3" src={user.photoURL}   alt="" />
          <p className="font-bold pt-2">{user.displayName}</p>
      </div>
      )}
    </div>
  );
};

export default Search;
