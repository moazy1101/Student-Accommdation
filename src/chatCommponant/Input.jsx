import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useContext, useState } from "react";
import { IoMdSend} from "react-icons/io"
import { IoAttachSharp} from "react-icons/io5"
import { RiImageAddFill} from "react-icons/ri"
import { AuthContext } from "../components/hooks/AuthContext";
import { ChatContext } from "../components/hooks/ChatContext";
import { db, storage } from "../Firebase";
import { v4 as uuid } from "uuid";

const Input=()=>{
const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  // const [send, setSend] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          //TODO:Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
    setText("");
    setImg(null);
  };
  const handleKey = (e) => {
    e.code === "Enter" && handleSend();
  };
    return(
        <div>
      <input
      className="h-12 w-full border-none"
      onKeyDown={handleKey}
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="  absolute flex bottom-1 right-3 text-2xl">
                <IoAttachSharp className="mx-1 mt-1"/>
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
        <RiImageAddFill className="mx-1 mt-1"/>
        </label>
        <button disabled={!text && !img && currentUser} onClick={handleSend}><IoMdSend className="mx-1 text-white bg-blue-600 p-2 text-4xl rounded-full"/></button>
      </div>
    </div>
    )
}
export default Input
