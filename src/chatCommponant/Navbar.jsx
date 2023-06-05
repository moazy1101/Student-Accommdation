import { useContext } from "react"
// import { IoCaretBack } from "react-icons/io5"
// import { useNavigate } from "react-router"
import { AuthContext } from "../components/hooks/AuthContext"
const Navbar=()=>{
    const {currentUser} = useContext(AuthContext)
    // const navigate=useNavigate();
    return(
        <div>
            <div className="flextext-black justify-between rounded-tl-2xl">
                <div className="flex items-center justify-start border-b  border-white border:w-[90%] border:m-auto">
                <div className="absolute top-[-.01rem] left-[.5rem] py-1 flex justify-center items-center">
                <img src="favicon.ico" class="w-7 mr-3" alt="FlowBite Logo" />
                <span className="font-bold  text-black">Farabi Chat</span>
                </div>
                </div>
                <img src={currentUser.photoURL} alt=""  className="rounded-full w-24 h-24 m-auto my-2"/>
                    <p className="text-blod text-black text-2xl text-center">{currentUser?.displayName}</p>
            </div>
        </div>
    )
}
export default Navbar