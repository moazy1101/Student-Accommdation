import React from 'react'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import {ImLocation2} from 'react-icons/im'
import { BsTrash } from 'react-icons/bs'
import {BiEdit} from 'react-icons/bi'

const ListingItem = ({listing, id, onDelete, onEdit}) => {
  return (
    <li className='relative rounded-md border border-solid shadow-sm overflow-hidden'>
      <Link to={`/listing/${id}`}>
        <img 
          alt='loading failed' 
          src={listing.imgUrls[0]}
          className=' rounded-t-md w-full object-cover hover:scale-105 transition duration-200 ease-in-out h-[200px]'
          loading='lazy'/>
          <Moment fromNow className='bg-main-color text-white px-2 py-1 rounded-md text-xs absolute top-2 left-2'>
            {listing.timestamp?.toDate()}
          </Moment>
          <p className='font-bold ml-3 mb-2 mt-2'>{listing.title}</p>
          <div className='flex gap-1 items-center text-xs ml-3 mb-2'>
            <ImLocation2 className='text-green-600'/>
            <p>{listing.address}</p>
          </div>
          <div className='flex gap-2 items-center ml-3 mb-2'>
            <p className='font-bold text-lg'>
              {listing.discount
                ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : listing.price
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </p>
            <p>EGP / Month</p>
          </div>
          <div className='flex gap-3 ml-3 mb-2'>
            <div className='flex gap-1 items-center'>
              <p className='text-xs'>{listing.beds}</p>
              <p className='text-xs'>{listing.beds > 1 ? 'Beds' : 'Bed'}</p>
            </div>
            <div className='flex gap-1'>
              <p className='text-xs'>{listing.rooms}</p>
              <p className='text-xs'>{listing.rooms > 1 ? 'Rooms' : 'Room'}</p>
            </div>
          </div>
      </Link>
      {onDelete && (
        <BsTrash
          className='absolute bottom-2 right-2 text-red-600 cursor-pointer'
          onClick={() => onDelete(listing.id)}
        />
      )}
      {onEdit && (
        <BiEdit 
          className='absolute bottom-2 right-8 cursor-pointer'
          onClick={() => onEdit(listing.id)}
        />
      )}
    </li>
  )
}

export default ListingItem