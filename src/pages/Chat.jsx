import { BsChatRightQuoteFill, BsFillChatQuoteFill } from "react-icons/bs"
import Chat from "../chatCommponant/Chat"
import Sidebar from "../chatCommponant/Sidebar"



const ChatPage=()=>{
    return(
        <>
<div className="bg-[#f3f3f3] h-[100vh] overflow-hidden">
        <div  className="h-[100%] bg-white ml-12 mt-10 flex items-center justify-center shadow-lg"> 
            <div className="w-[25%] h-[100%] bg-[#fcfcfc]  border-r rounded-tl-md border-gray-400 chat-sidebar ">
                <Sidebar/>
            </div>
            <div  className="w-[75%] h-[100%] relative">
                <div className="chat-caption z-10 absolute h-[100%] w-[100%] top-0 bottom-0 left-0 right-0 bg-[#f9f9f9] flex items-center justify-center">
                {/* <img src="chatLock.jpg" alt="chatLock" /> */}
                <div className="text-center mb-36 text-gray-400">
                <BsFillChatQuoteFill className="text-6xl mx-auto my-6"/>
                    <h3 className="font-mono">Farabi Chat</h3>
                    <p className="capitalize font-mono">tab on any user to shart the chating </p>
                </div>
                </div>
                <Chat/>
            </div>
        </div>
</div>
        </>
    )
}
export default ChatPage