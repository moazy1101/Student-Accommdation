import {
  collection,
  DocumentSnapshot,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import { db } from "../Firebase";
import notFound from "../components/assets/notfound.jpg";
import noData from "../components/assets/404.jpg";
import ListingItem from "../components/ListingItem";
import { toast } from "react-toastify";
import NumberInput from "../components/NumberInput";

const SearchPage = () => {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [searchResult, setSearchResult] = useState([]);
  const [empty, setEmpty] = useState(false);
  const [lastListing, setLastListing] = useState(null);
  const [searchLength, setSearchLength] = useState(null);
  const [filteredSearch, setFilteredSearch] = useState([]);
  const [filtered, setFiltered] = useState(false);
  const [filterLength, setFilterLength] = useState(null)
  const [searchFilters, setSearchFilters] = useState({
    location: "",
    minPrice: 0,
    maxPrice: 100000,
    maxBeds: 10,
    maxRooms: 10,
    pets: false,
    smoking: false,
    gender: "male",
  });

  const {
    location,
    minPrice,
    maxPrice,
    maxBeds,
    maxRooms,
    pets,
    smoking,
    gender,
  } = searchFilters;

  useEffect(() => {
    try {
      async function fetchData() {
        const listingsRef = collection(db, "listings");
        const qu = query(
          listingsRef,
          where("area", "==", params.searchKey.toLocaleLowerCase()),
          orderBy("timestamp", "desc")
        );
        const fullSnap = await getDocs(qu);
        setSearchLength(fullSnap.docs.length);
        const q = query(
          listingsRef,
          where("area", "==", params.searchKey.toLocaleLowerCase()),
          orderBy("timestamp", "desc"),
          limit(6)
        );
        const querySnap = await getDocs(q);
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastListing(lastVisible);
        let result = [];
        querySnap.forEach((doc) => {
          return result.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setSearchResult(result);
        if (result.length === 0) {
          setEmpty(true);
        }
      }
      fetchData();
      if (fetchData) {
        setLoading(false);
      }
    } catch (error) {
      toast.error("some thing went wrong");
    }
  }, [params.searchKey]);

  async function fetchMoreListings() {
    try {
      const docRef = collection(db, "listings");
      const q = query(
        docRef,
        where("area", "==", params.searchKey.toLocaleLowerCase()),
        orderBy("timestamp", "desc"),
        startAfter(lastListing),
        limit(6)
      );
      const docSnap = await getDocs(q);
      const lastVisible = docSnap.docs[docSnap.docs.length - 1];
      setLastListing(lastVisible);
      let result = [];
      docSnap.forEach((doc) => {
        return result.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setSearchResult((prevState) => [...prevState, ...result]);
    } catch (error) {
      toast.error("there are no more listings");
    }
  }

  function onChange(e) {
    if (e.target.type === "number") {
      setSearchFilters((prevState) => ({
        ...prevState,
        [e.target.name]: +e.target.value,
      }));
    } else {
      setSearchFilters((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
    if (e.target.name === "pets" || e.target.name === "smoking") {
      if (e.target.checked) {
        setSearchFilters((prevState) => ({
          ...prevState,
          [e.target.name]: true,
        }));
      } else {
        setSearchFilters((prevState) => ({
          ...prevState,
          [e.target.name]: false,
        }));
      }
    }
  }

  console.log(searchFilters);

  async function filter(e) {
    e.preventDefault()
    setFiltered(true);
    setLoading(true);
    try {
      console.log(minPrice);
      const docRef = collection(db, "listings");
      const docSnap = await getDocs(docRef);
      const lastVisible = docSnap.docs[docSnap.docs.length - 1];
      setLastListing(lastVisible);
      let result = [];
      docSnap.forEach((doc) => {
        return result.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      const f = result.filter((el) => 
          el.data.area === location &&
          el.data.price >= minPrice &&
          el.data.price <= maxPrice &&
          el.data.beds <= maxBeds &&
          el.data.rooms <= maxRooms &&
          el.data.gender === gender &&
          el.data.pets === pets &&
          el.data.smoking === smoking
      )
      setFilterLength(f.length)
      setFilteredSearch(f);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  console.log(filteredSearch);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <Navbar backgroundColor="#222222" />
      {empty && (
        <>
          <div className="flex items-center gap-8 pr-34">
            <div
              className="w-[50%] max-lg:w-full"
              style={{
                background: `url(${notFound})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                height: "calc(100vh - 72px)",
                backgroundPosition: "center",
              }}
            ></div>
            <div className="text-3xl font-bold w-[40%] max-lg:hidden">
              There is no record for this location!!
              <span className="text-sm block">
                Make sure the location is right or use another keyword
              </span>
            </div>
          </div>
        </>
      )}
      {!empty && (
        <>
          <div className="container py-8">
            <div className="border p-4">
              <div className="text-xl">
                Student Accommodation in{" "}
                <span className="font-bold">
                  {location === "" ? params.searchKey : location}
                </span>
              </div>
              <p className="text-sm mt-4 mb-8">
                Found{" "}
                <span className="bg-gray-100 px-2 mx-2 py-1">
                  {filtered ? filterLength : searchLength}
                </span>{" "}
                Places
              </p>
            </div>
            <div className="flex gap-12 mt-6 items-start">
              <div className="filters w-[25%] border p-3">
                <h1 className="font-bold text-lg">Filters</h1>
                <span className="text-red-600 text-xs">{!filtered && '(No filters Applied)'}</span>
                <form 
                  className="mt-4"
                  onSubmit={filter}>
                  <div>
                    <div className="mb-4">
                      <label className="font-bold uppercase text-xs ml-2">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={location}
                        onChange={onChange}
                        className="rounded-3xl w-full focus:ring-0 h-12 p-4 text-sm"
                        required
                      />
                    </div>
                    <label className="font-bold uppercase text-xs ml-2">
                      Price / Egp
                    </label>
                    <div className="flex gap-2 mt-2">
                      <div>
                        <h6 className="text-xs ml-2">from</h6>
                        <NumberInput
                          name="minPrice"
                          type="number"
                          value={minPrice}
                          onChange={onChange}
                        />
                      </div>
                      <div>
                        <h6 className="text-xs ml-2">To</h6>
                        <NumberInput
                          name="maxPrice"
                          type="number"
                          value={maxPrice}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-6">
                      <div>
                        <h6 className="text-xs ml-2 font-bold">Max Beds</h6>
                        <NumberInput
                          name="maxBeds"
                          type="number"
                          value={maxBeds}
                          onChange={onChange}
                        />
                      </div>
                      <div>
                        <h6 className="text-xs ml-2 font-bold">Max Rooms</h6>
                        <NumberInput
                          name="maxRooms"
                          type="number"
                          value={maxRooms}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                    <div className="mt-6 ">
                      <h4 className="ml-2 mb-2 text-xs">Gender</h4>
                      <select
                        className="border-1 rounded-full text-sm focus:ring-0 border-slate-300 h-[42px] px-[35px]"
                        name="gender"
                        id=""
                        onChange={onChange}
                        defaultValue={gender}
                        required
                      >
                        <option className="text-sm" value="male">
                          Male
                        </option>
                        <option className="text-sm" value="female">
                          Female
                        </option>
                      </select>
                    </div>
                    <div className="mt-6">
                      <h6 className="text-xs font-bold uppercase mb-2">
                        Preferences
                      </h6>
                      <div className="flex gap-2">
                        <div>
                          <input
                            className="focus:ring-0"
                            name="pets"
                            type="checkbox"
                            value={pets}
                            onChange={onChange}
                            checked={pets}
                          />
                          <span className="ml-2 text-xs">Pets</span>
                        </div>
                        <div>
                          <input
                            className="focus:ring-0"
                            name="smoking"
                            type="checkbox"
                            value={smoking}
                            onChange={onChange}
                            checked={smoking}
                          />
                          <span className="ml-2 text-xs">Smoking</span>
                        </div>
                      </div>
                    </div>
                    <button
                      className="main-btn mt-6 w-[80px] mx-auto cursor-pointer"
                    >
                      Filter
                    </button>
                  </div>
                </form>
              </div>
              {!filtered ? (
                <>
                  <ul className=" w-full grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center flex-1">
                    {searchResult.map((result) => {
                      return (
                        <ListingItem
                          key={result.id}
                          id={result.id}
                          listing={result.data}
                        />
                      );
                    })}
                  </ul>
                </>
              ) : filteredSearch.length ? (
                <>
                  <ul className=" w-full grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center flex-1">
                    {filteredSearch.map((result) => {
                      return (
                        <ListingItem
                          key={result.id}
                          id={result.id}
                          listing={result.data}
                        />
                      );
                    })}
                  </ul>
                </>
              ) : (
                <>
                  <div className="text-center">
                  <h1 className="text-lg font-bold">Sorry Couldn't find what you are looking For...</h1>
                  <img src={noData} alt='' className="w-[60%] mx-auto"/>
                  </div>
                </>
              )}
            </div>
            <div className="text-center">
              <button className="w-[150px] h-[50px] border my-10 mx-auto text-center rounded-full hover:shadow-sm">
                Show More...
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SearchPage;
