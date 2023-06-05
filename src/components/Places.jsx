// import alex from "../components/assets/location/alex.jpeg"
// import { place } from "../components/Data"
// const Places=()=>{
//     return(

//         <>
//    <div className="container my-6">
//         
//     <div class="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
//         <div class="md:flex md:justify-center">
//         <div class="">
        
//                 <div className="bg-white flex items-center justify-center relative rounded-md shadow-sm shadow-gray-400">
//                   <img className="w-full" src={alex} alt="alex" />
//                   
//                     </div>
                    
//             </div>
//         </div>
//     </div>
//     </div>
//     </>
//         )
// }

// export default Places;




// import React, { useState } from "react"
import { Link } from "react-router-dom"
import { location } from "../components/Data"
import { useNavigate } from "react-router"
import { BsArrowRightShort } from "react-icons/bs"

const Place = () => {
  const navigate = useNavigate()
  return (
    <>
      <section className='container my-6'>
      <div className="text-center  m-10">
            <h2 className="font-medium text-4xl">Discover unique places in popular areas</h2>
            <p className="font-light text-xl">Book places in major cities and universities across the globe 
            </p>
        </div>
        <div className='mx-auto w-full max-w-screen-xl  py-3 lg:py-8'>
<div className='mx-6   mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4  xl:grid-cols-6 sm:grid-cols-2 gap-4'>
            {location.map((item, index) => (
              <div
              onClick={()=>{navigate(`/search/${item.value.toLocaleLowerCase()}`)}}
              className='lg:h-40 flex items-center justify-center relative rounded-lg shadow-sm shadow-gray-400' key={index}>
                <img className="w-full lg:h-full rounded-md"  src={item.cover} alt='' />
                <p className="absolute cover h-full w-full flex items-center font-bold rounded-lg justify-center text-white ">{item.name}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button 
              className="bg-white p-5  flex items-center justify-center shadow-sm h-[50px] w-52 border mt-10 mx-auto text-black text-center font-light  hover:shadow-lg"
            //   onClick={fetchMoreListings}
            >
              <Link
              className="flex items-center justify-between"
              to={'/all-listings'}>
              View All Cities <BsArrowRightShort className="text-gray-400 mx-4 text-2xl "/>
            </Link>
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default Place

