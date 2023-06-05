import React from "react"

const Heading = ({ title, subtitle }) => {
  return (
    <>
      <div className='heading'>
        <h1 className="font-bold mt-4 text-2xl mb-2">{title}</h1>
        <p className="w-[60%] m-auto">{subtitle}</p>
      </div>
    </>
  )
}

export default Heading
