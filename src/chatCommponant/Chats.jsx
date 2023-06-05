// import avatar from "../utils/avatar.jpg"

import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/hooks/AuthContext";
import { ChatContext } from "../components/hooks/ChatContext";
import { db } from "../Firebase";

const Chats=()=>{
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });
        return () => {
          unsub();
        };
      };

      currentUser.uid && getChats();
  }, [currentUser.uid]);
  
  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };
    return(
        <div className="py-1 w-full"> 

{Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
        <div
          className="flex items-center cursor-pointer   px-2 py-8 hover:bg-slate-500 hover:text-white hover:rounded-md mx-2  rounded-sm my-1 h-14  overflow-hidden"
          key={chat[0]}
          onClick={() => handleSelect(chat[1].userInfo)}
        >
          <img className="rounded-full w-12 h-12 mx-3" src={chat[1].userInfo.photoURL} alt="" />
            {/* {console.log(chat[1].userInfo.photoURL)} */}
          <div className="pl-2">
            <span className="font-bold ">{chat[1].userInfo.displayName}</span>
            <p className="font-light text-gray-700">{chat[1].lastMessage?.text}</p>
          </div>
        </div>
      ))}
        </div>
    )
}
export default Chats







