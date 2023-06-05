import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import ListingItem from "../components/ListingItem";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { db } from "../Firebase";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import noItems from '../components/assets/empty.jpg'

const MyListings = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false)

  useEffect(() => {
    if (!auth.currentUser.emailVerified) {
      navigate("/profile");
    }
    async function fetchUserListings() {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      if(listings.length === 0) {
        setEmpty(true)
      }
    }
    fetchUserListings();
    if (fetchUserListings) {
      setLoading(false);
    }
  }, [auth.currentUser.uid]);

  async function onDelete(itemID) {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await deleteDoc(doc(db, "listings", itemID));
      const updatedItems = listings.filter((item) => item.id !== itemID);
      setListings(updatedItems);
      toast.success("Item was deleted successfully");
    }
  }
  function onEdit(itemID) {
    navigate(`/profile/edit-listing/${itemID}`);
  }

  return (
    <>
      <Navbar backgroundColor="#222222" />
      <div className="my-listings pt-14 pb-10">
        <div className="container flex gap-12">
          <Sidebar />
          {!empty ? (
            <>
              <div className="flex-1">
                <ul className=" w-full grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                  {listings.map((listing) => {
                    return (
                      <ListingItem
                        key={listing.id}
                        id={listing.id}
                        listing={listing.data}
                        onDelete={() => onDelete(listing.id)}
                        onEdit={() => onEdit(listing.id)}
                      />
                    );
                  })}
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto text-xl font-bold">
                You haven't uploaded any listing yet
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

export default MyListings;
