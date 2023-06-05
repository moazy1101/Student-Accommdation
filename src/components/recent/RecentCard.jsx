
// export default RecentCard
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import ListingItem from "../../components/ListingItem";
// import Navbar from "../../../../components/Navbar";
// import NumberInput from "../components/NumberInput";
import Spinner from "../../components/Spinner";
import { db } from "../../Firebase";
import { Link } from "react-router-dom";

const RecentCard = () => {
  const [loading, setLoading] = useState(true);
  const [newestListings, setNewestListings] = useState([]);
  const [lastListing, setLastListing] = useState(null);
  

  useEffect(() => {
    try {
      async function fetchNewestListings() {
        const docRef = collection(db, "listings");
        const q = query(docRef, orderBy("timestamp", "desc"), limit(9));
        const docSnap = await getDocs(q);
        const lastVisible = docSnap.docs[docSnap.docs.length - 1];
        setLastListing(lastVisible);
        let newestListings = [];
        docSnap.forEach((doc) => {
          return newestListings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setNewestListings(newestListings);
      }
      fetchNewestListings();
      setLoading(false);
    } catch (error) {
      toast.error("something went wrong");
    }
  }, []);

  async function fetchMoreListings() {
    try {
      const docRef = collection(db, "listings");
      const q = query(
        docRef,
        orderBy("timestamp", "desc"),
        startAfter(lastListing),
        limit(6)
      );
      const docSnap = await getDocs(q);
      const lastVisible = docSnap.docs[docSnap.docs.length - 1];
      setLastListing(lastVisible);
      let newestListings = [];
      docSnap.forEach((doc) => {
        return newestListings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setNewestListings((prevState) => [...prevState, ...newestListings]);
    } catch (error) {
      toast.error("some thing went wrong");
    }
  }



  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      {/* <Navbar backgroundColor="#222222" /> */}
      <div className="container pb-8 h-auto pt-10">
        {/* <h1 className="font-bold text-xl mb-6">Newest Listings</h1> */}
        <div className="lists">
          <ul className="w-full grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center flex-1">
            {newestListings.map((listing) => {
              return (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              );
            })}
          </ul>
          <div className="text-center">
            <button 
              className="bg-white p-5 flex items-center justify-center shadow-sm h-[50px] border mt-10 mx-auto text-black text-center font-light rounded-full hover:shadow-lg"
              onClick={fetchMoreListings}
            >
              <Link
              to={'/all-listings'}>
              Show More...
            </Link>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecentCard;
