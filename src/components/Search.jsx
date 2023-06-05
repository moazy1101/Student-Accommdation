import React, { useState } from 'react'
import { useNavigate } from 'react-router'

const Search = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  function onChange(e) {
    setSearch(e.target.value)
  }
  console.log(search)
  function onSubmit(e) {
    e.preventDefault()
    navigate(`/search/${search}`)
  }

  return (
    <div>
      <form 
        className='text-center mt-8 flex items-center justify-center text-gray'
        onSubmit={onSubmit}>
        <input 
          style={{color: 'gray'}}
          value={search}
          type="text" 
          name="search" 
          id="" 
          className='w-[50%] lg:w-[40%] p-4 h-12 rounded-3xl rounded-r-none text-gray focus:ring-0 border-0'
          placeholder='search by location...'
          onChange={onChange}
          required
        />
        <button 
          className='bg-main-color text-center flex justify-center rounded-l-none items-center p-4 h-12 rounded-3xl'
        >
          Search
        </button>
      </form>
    </div>
  )
}

export default Search