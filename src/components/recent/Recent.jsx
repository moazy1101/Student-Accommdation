import React from "react"
import Heading from "../common/Heading"
import "./recent.css"
import RecentCard from "./RecentCard"

const Recent = () => {
  return (
    <>
      <section className='py-3'>
        <div className='text-center'>
          <h2 className="font-semibold text-4xl mt-5 ">Trending Properties</h2>
          {/* <div class=" py-3 relative flex items-center h-20 justify-center title">
                    <h2 class="absolute">Trending Properties</h2>
                    <h3 class="absolute">Trending Properties</h3>
          </div> */}
          <RecentCard className="h-[70vh]" />
        </div>
      </section>
    </>
  )
}

export default Recent
