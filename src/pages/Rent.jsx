import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import secondBackground from '../components/assets/sechome1.jpg'
import Header from '../components/Header'
import ListingItem from '../components/ListingItem'
import { db } from '../Firebase'

const Rent = () => {
  const [loading, setLoading] = useState(true)
  const [newestListings, setNewestListings] = useState([])
  const [petFriendlyListings, setPetFriendlyListings] = useState([])
  const [noSmokingListings, setNoSmokingListings] = useState([])

  useEffect(() => {
    async function fetchNewestListings() {
      const docRef = collection(db, 'listings')
      const q = query(docRef, orderBy("timestamp", "desc"), limit(4));
      const docSnap = await getDocs(q) 
      let newestListings = [];
      docSnap.forEach((doc) => {
        return newestListings.push({
          id: doc.id,
          data: doc.data()
        })
      })
      setNewestListings(newestListings)
    }
    fetchNewestListings()

    async function fetchPetFriendly() {
      const docRef = collection(db, 'listings')
      const q = query(docRef, where('pets', '==', true), orderBy("timestamp", "desc"), limit(4));
      const docSnap = await getDocs(q) 
      let petFriendly = [];
      docSnap.forEach((doc) => {
        return petFriendly.push({
          id: doc.id,
          data: doc.data()
        })
      })
      setPetFriendlyListings(petFriendly)
    }
    fetchPetFriendly()

    async function fetchNoSmoking() {
      const docRef = collection(db, 'listings')
      const q = query(docRef, where('smoking', '==', false), orderBy("timestamp", "desc"), limit(4));
      const docSnap = await getDocs(q) 
      let noSmoking = [];
      docSnap.forEach((doc) => {
        return noSmoking.push({
          id: doc.id,
          data: doc.data()
        })
      })
      setNoSmokingListings(noSmoking)
    }
    fetchNoSmoking()
    setLoading(false)
  }, [])

  return (
    <>
      <Header headerImage={secondBackground} />
      <div className="container pb-6">
        <div className="newest">
          <h1 className='mt-14 font-bold text-xl'>Newest Listings</h1>
          <p className='mb-6 text-blue-600'>
            <Link
              to={'/all-listings'}>
              View all listings
            </Link>
          </p>
          <ul className='w-full grid sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center'>
            {newestListings.map((listing) => {
                return (
                  <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
                )
            })}
          </ul>
        </div>
        <div className="pet-friendly">
          <h1 className='mt-14 font-bold text-xl'>Pet Friendly</h1>
          <p className='mb-6 text-blue-600'>
            <Link
              to={'/all-listings'}>
              View all Pet-Friendly rentals
            </Link>
          </p>
          <ul className='w-full grid sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center'>
            {petFriendlyListings.map((listing) => {
                return (
                  <ListingItem
                    key={listing.id}
                    id={listing.id}
                    listing={listing.data}
                />
                )
            })}
          </ul>
        </div>
        <div className="pet-friendly">
          <h1 className='mt-14 font-bold text-xl'>No Smoking</h1>
          <p className='mb-6 text-blue-600'>
            <Link
              to={'/all-listings'}>
              View all No-Smoking rentals
            </Link>
          </p>
          <ul className='w-full grid sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center'>
            {noSmokingListings.map((listing) => {
                return (
                  <ListingItem
                    key={listing.id}
                    id={listing.id}
                    listing={listing.data}
                />
                )
            })}
          </ul>
        </div>
      </div>
    </>
  )
}

export default Rent