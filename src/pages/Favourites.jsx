import { getAuth } from "firebase/auth";
import {
  collection,
  documentId,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { db } from "../Firebase";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
import noItems from '../components/assets/empty.jpg'
import CiHeart from 'react-icons/ci'
import axios from "axios"

const Favourites = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [likedListings, setLikedListings] = useState([]);
  const [empty, setEmpty] = useState(false)

  useEffect(() => {
    if (!auth.currentUser.emailVerified) {
      navigate("/profile");
    }
    async function fetchFavs() {
      const likesRef = collection(db, "likes");
      const likesQuery = query(
        likesRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const likesSnap = await getDocs(likesQuery);
      let likesIds = [];
      likesSnap.forEach((doc) => {
        return likesIds.push(doc.data().listingId);
      });
      if(likesIds.length === 0) {
        setEmpty(true)
      }
      if(likesIds.length > 0) {
        const listingQuery = query(
          collection(db, "listings"),
          where(documentId(), "in", [...likesIds])
        );
        const listingSnap = await getDocs(listingQuery);
        let liked = [];
        listingSnap.forEach((doc) => {
          return liked.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setLikedListings(liked);
        if(liked.length === 0) {
          setEmpty(true)
        }
      }
    }
    fetchFavs();
    if (fetchFavs) {
      setLoading(false);
    }
  }, [auth.currentUser.emailVerified, auth.currentUser.uid, navigate]);

  const [response, setResponse] = useState(null);

  const fetchloc = async () => {
		try {
			const res = await axios.get(`https://trueway-geocoding.p.rapidapi.com/Geocode`, {
				headers: {
          'X-RapidAPI-Key': process.env.REACT_APP_GEO_API_KEY,
          'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com'
        },
				params: {address: 'maadi', language: 'en'},
			});
			setResponse(res.data);
		} catch (err) {
			console.log(err);
		}
  }
  
  useEffect(() => {
    fetchloc()
  }, [])

  console.log(response)


  if (loading) {
    return <Spinner />;
  }



  return (
    <>
      <Navbar backgroundColor="#222222" />
      <div className="favs pt-14 pb-10">
        <div className="container flex gap-12">
          <Sidebar />
          {!empty ? (
            <>
              <div className="flex-1">
                <ul className=" w-full grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                  {likedListings.map((listing) => {
                    return (
                      <ListingItem
                        key={listing.id}
                        id={listing.id}
                        listing={listing.data}
                      />
                    );
                  })}
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto text-xl font-bold text-center">
                You haven't saved any listing
                <img
                  src={noItems} 
                  alt=""
                  className="w-[350px] mt-6"/>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Favourites;
