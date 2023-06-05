import React from 'react'

const NumberInput = ({name, value, onChange, type}) => {
  return (
    <>
      <div>
      <input 
        className='text-center h-[40px] w-[90px] rounded-3xl focus:outline-none focus:ring-gray-400 border-gray-300'
        value={value} 
        onChange={onChange} 
        name={name} 
        type={type}
        min={0}
        required />
    </div>
    </>
  )
}

export default NumberInput