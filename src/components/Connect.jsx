import {AiOutlineMail} from "react-icons/ai";
import { BsTelephone, BsWhatsapp } from "react-icons/bs";
import { IoMdChatbubbles} from "react-icons/io";

const Connect=()=>{
    return(

        <>
   <div className="container my-6">
        <div className="text-center py-7 m-10">
            <h2 className="font-medium text-4xl">Get in Touch</h2>
            <p className="font-light text-xl">If you have any queries, feel free to contact us</p>
        
        </div>
    <div class="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div class="md:flex md:justify-center">
        <div class="w-[90%] m-auto  text-center grid lg:grid-cols-4 md:grid-cols-3 gap-8 sm:grid-cols-2">
        
                    <div className="bg-white p-4 text-center rounded-lg shadow-md shadow-gray-400">
                  <BsTelephone className="text-4xl mt-2 mb-4 font-bold m-auto  text-rose-600"/>
                  <p>+20 102973497</p>
                    </div>
                    <div className="bg-white text-center py-4 rounded-lg shadow-md shadow-gray-400">
                  <AiOutlineMail className="text-4xl mt-2 mb-4 font-bold m-auto text-rose-600"/>
                  <p>Email us</p>
                    </div>
                    <div className="bg-white text-center py-4 rounded-lg shadow-md shadow-gray-400">
                  <BsWhatsapp className="text-4xl mt-2 mb-4 font-bold m-auto text-rose-600"/>
                  <p>chat on whatsapp</p>
                    </div>
                    <div className="bg-white text-center py-4 rounded-lg shadow-md shadow-gray-400">
                  <IoMdChatbubbles className="text-4xl mt-2 mb-4 font-bold m-auto text-rose-600"/>
                  <p>chat on website</p>
                    </div>
            </div>
        </div>
    </div>
    </div>
    </>
        )
}

export default Connect;