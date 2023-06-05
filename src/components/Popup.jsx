import React from 'react'
import popup from '../utils/popup.jpg'

const Popup = ({confDelete, closePop}) => {
  return (
    <>
      <div className="bg-black bg-opacity-50 flex items-center justify-center fixed left-0 right-0 bottom-0 top-0 z-40">
        <div className='w-[500px] h-[300px] bg-white z-50 rounded-lg text-center flex flex-col items-center justify-center'>
          <img src={popup} alt=""  className='w-[180px]'/>
          <h1 className='mb-4'>Are you Sure you want to delete this item?</h1>
          <div className='flex justify-center items center gap-8'>
            <button 
              className='delete text-sm rounded-3xl w-[80px] h-[40px] hover:drop-shadow-md transition transition-100 border text-center hover:bg-[#d92228] hover:text-white'
              >
              Yes
            </button>
            <button 
              className='close-pop text-sm rounded-3xl w-[80px] h-[40px] hover:drop-shadow-md transition transition-100 border text-center hover:bg-[#d92228] hover:text-white'
              >
              No
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Popup