import React from "react";
import Navbar from "../components/Navbar";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { db } from "../Firebase";
import { useState } from "react";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css/bundle";
import {
  AiFillCamera,
  AiOutlineHeart,
  AiOutlineCopy,
  AiOutlineWifi,
  AiFillHeart,
  AiOutlineMail,
  AiFillDelete,
} from "react-icons/ai";
import { IoLocationOutline, IoBedOutline, IoMan, IoWoman, IoLogoNoSmoking } from "react-icons/io5";
import {
  MdMeetingRoom,
  MdOutlineBathtub,
  MdBalcony,
  MdBathtub,
} from "react-icons/md";
import noPets from '../components/assets/no-animals.png'
import { RxRulerSquare } from "react-icons/rx";
import { GiCat, GiChickenOven, GiComputerFan, GiWashingMachine } from "react-icons/gi";
import { BiFridge } from "react-icons/bi";
import { SlScreenDesktop } from "react-icons/sl";
import { getAuth } from "firebase/auth";
import { FaCouch, FaSmoking } from "react-icons/fa";
import { CiCalendarDate } from "react-icons/ci";
import Moment from "react-moment";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../components/hooks/AuthContext";
import L from 'leaflet'
import { useContext } from "react";

const Listing = () => {
  const auth = getAuth();
  const params = useParams();
  const [listing, setListing] = useState({});
  const [loading, setLoading] = useState(true);
  const [linkCopied, setLinkCopied] = useState(false);
  const [listingLiked, setListingLiked] = useState(false);
  const [comment, setComment] = useState('')
  const [fetchedComments, setFetchedComments] = useState([])
  const [commentOwner, setCommentOwner] = useState(null)
  const [landLordData, setLandLordData] = useState({})
  const[pointsOfInterest, setPointsOfInterest] = useState([])
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  SwiperCore.use([Autoplay, Navigation, Pagination]);

  useEffect(() => {
    async function fetchListing() {
      setLoading(true);
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
      setLoading(false)
    }
    fetchListing();
  }, [listing.listingId, params.listingId]);
  
  useEffect(() => {
      try {
        var requestOptions = {
          method: 'GET',
        };
        
        fetch(`https://api.geoapify.com/v2/places?categories=commercial.chemist,commercial.supermarket,building.sport,catering.restaurant,public_transport.subway.entrance&filter=circle:${listing.geolocation.lng && listing.geolocation?.lng },${listing.geolocation.lat && listing.geolocation?.lat},2000&limit=100&apiKey=f3ed1f47e1284bf59e7601c2e91d37a0`, requestOptions)
          .then(response => response.json())
          .then(result => setPointsOfInterest(result))
          .catch(error => console.log('error', error));
      } catch (error) {
        
      }
    },[listing.geolocation?.lat, listing.geolocation?.lng])

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((authObj) => {
      unsub();
      if (authObj) {
        async function checkLike() {
          const likesRef = collection(db, "likes");
          const q = query(
            likesRef,
            where("userRef", "==", auth.currentUser?.uid),
            where("listingId", "==", params.listingId)
          );
          const querySnap = await getDocs(q);
          let like;
          querySnap.forEach((doc) => {
            return (like = {
              id: doc.id,
              data: doc.data(),
            });
          });
          if (like) {
            setListingLiked(true);
          }
        }
        checkLike();
      } else {
        // not logged in
      }
    });

    //comment section
    try {
      async function fetchLandLordData() {
        if(listing.userRef) {
          const docRef = doc(db, "users", listing.userRef);
          const docSnap = await getDoc(docRef);
          let data;
          data = docSnap.data()
          setLandLordData(data)
        }
      }
      fetchLandLordData()
    } catch (error) {
      console.log(error)
    }

    async function fetchComments() {
      try {
        const docRef = collection(db, 'comments')
        const q = query(
          docRef,
          where("listingId", "==", params.listingId),
          orderBy("timestamp", "desc")
        );
        const docSnap = await getDocs(q)
        let comments = []
        docSnap.forEach((doc) => {
          return comments.push({
            id: doc.id,
            data: doc.data()
          });
        });
        setFetchedComments(comments)
        
      } catch (error) {
        console.log(error)
      }
    }
    fetchComments()
  }, [auth, listing.userRef, listingLiked, params.listingId]);

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
  }

  async function addLike() {
    try {
      const docRef = await addDoc(collection(db, "likes"), {
        listingId: params.listingId,
        userRef: auth.currentUser.uid,
        timestamp: serverTimestamp(),
      });
      setListingLiked(true);
    } catch (err) {
      console.log(err);
    }
  }
  async function removeLike() {
    try {
      const likesRef = collection(db, "likes");
      const q = query(
        likesRef,
        where("userRef", "==", auth.currentUser?.uid),
        where("listingId", "==", params.listingId)
      );
      const querySnap = await getDocs(q);
      let like;
      querySnap.forEach((doc) => {
        return (like = {
          id: doc.id,
          data: doc.data(),
        });
      });
      await deleteDoc(doc(db, "likes", like.id));
      setListingLiked(false);
    } catch (err) {
      console.log("err");
    }
  }

  function featIcon(feat) {
    if (feat === "Wifi") {
      return <AiOutlineWifi />;
    }
    if (feat === "Balcony") {
      return <MdBalcony />;
    }
    if (feat === "Oven") {
      return <GiChickenOven />;
    }
    if (feat === "Fridge") {
      return <BiFridge />;
    }
    if (feat === "Tv") {
      return <SlScreenDesktop />;
    }
    if (feat === "Private Bath") {
      return <MdOutlineBathtub />;
    }
    if (feat === "Wash Machine") {
      return <GiWashingMachine />;
    }
    if (feat === "Air Conditioner") {
      return <GiComputerFan />;
    }
  }

  function onChangeComment(e) {
    setComment(e.target.value)
  }

  async function addComment() {
    try {
      if(comment.trim().length > 0) {
        const data =  {
          comment: comment,
          listingId: params.listingId,
          userRef: auth.currentUser.uid,
          timestamp: serverTimestamp(),
        }
        const docRef = await addDoc(collection(db, "comments"), data);
        setComment('')
        data.timestamp = 'now'
        setFetchedComments(prevState => [{data: data}, ...prevState])
      } else {
        toast.error('please enter a valid comment')
      }
    } catch (err) {
      console.log(err);
    }
  }
  
  function capitalizeName(name) {
    if (name) {
      let arr = name?.split(" ");
      for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substr(1);
      }
      return arr.join(" ");
    }
  }

  async function commentOwnerInfo(c) {
    const commentOwner = doc(db, 'users', c?.userRef)
    const ownerSnap = await getDoc(commentOwner)
    let u;
    if(ownerSnap.exists()) {
      u = ownerSnap.data()
      setCommentOwner(u)
    }
  }

  async function deleteComment(commentID) {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await deleteDoc(doc(db, "comments", commentID));
      const updatedItems = fetchedComments.filter((comment) => comment.id !== commentID);
      setFetchedComments(updatedItems);
    }
  }

  if (loading) {
    return <Spinner />;
  }

    
  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > landLordData.uid
        ? currentUser.uid + landLordData.uid
        : landLordData.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
  
      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
  
        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: landLordData.uid,
            displayName: landLordData.displayName,
            photoURL: landLordData.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
  
        await updateDoc(doc(db, "userChats", landLordData.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {
      toast.error('please make sure your info is correct')
    }
    navigate("/chat")
  
    setLandLordData(null);
    // setUsername("")
  };
  return (
    <>
      <Navbar backgroundColor="#222222" />
      <div className="container relative pb-10">
        <Swiper
          slidesPerView={1}
          navigation
          pagination={{ type: "progressbar" }}
          effect="fade"
          modules={[EffectFade]}
          autoplay={{ delay: 3000 }}
        >
          {listing.imgUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <div
                className="relative w-full overflow-hidden h-[500px]"
                style={{
                  background: `url(${listing.imgUrls[index]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className=" rounded-xl first-letter:images flex items-center gap-1 absolute top-[450px] left-[40px] z-10 bg-black bg-opacity-50 w-14 text-white h-8 justify-center">
          {listing.imgUrls.length} <AiFillCamera />
        </div>
        <div
          className="bg-white hover:bg-gray-100 transition w-12 h-12 rounded-full absolute shadow-md cursor-pointer top-[474px] right-[46px] z-10 flex items-center justify-center text-lg"
          onClick={() => {
            copyLink();
            setLinkCopied(true);
            setTimeout(() => {
              setLinkCopied(false);
            }, 2000);
          }}
        >
          <AiOutlineCopy />
        </div>
        <div
          className="bg-white hover:bg-gray-100 transition duration-300 w-12 h-12 rounded-full absolute shadow-md cursor-pointer top-[474px] right-[108px] z-10 flex items-center justify-center text-lg"
          onClick={listingLiked ? removeLike : addLike}
        >
          {listingLiked ? (
            <AiFillHeart className="text-red-600" />
          ) : (
            <AiOutlineHeart />
          )}
        </div>
        {linkCopied && (
          <>
            <div
              className="w-0 h-0 absolute top-[458px] right-[61px] z-10
                          border-l-[8px] border-l-transparent
                          border-t-[8px] border-t-white
                          border-r-[8px] border-r-transparent
              "
            ></div>
            <p className="absolute top-[435px] right-[49px] z-10 bg-white rounded-md text-xs px-2 py-1 ">
              Link Copied
            </p>
          </>
        )}
        <div className="cont flex flex-col md:flex-row mt-10 gap-8 flex-wrap lg:flex-nowrap items-center">
          <div className="info w-full flex-col lg:flex-row">
            <p className="text-xs">Presented by: </p>
            <p className="text-xs font-bold uppercase">{listing.userName}</p>
            <div className="flex items-center gap-6">
              <span className="my-3 block w-auto pb-2 border-b border-slate-800 font-bold">
                {listing.title}
              </span>
              <span>/</span>
              <div className="flex items-center gap-2 ">
                <p className="text-lg">
                  {listing.discount
                    ? listing.discountedPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : listing.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </p>
                <span className="text-xs">EGP / Month</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 mb-6">
              <IoLocationOutline />
              {listing.address}
            </div>
            <div className="flex gap-20 mb-6 flex-wrap">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <span>
                    <IoBedOutline className="text-2xl" />
                  </span>
                  <p>
                    {listing.beds} {listing.beds > 1 ? "Beds" : "Bed"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span>
                    <MdMeetingRoom className="text-2xl" />
                  </span>
                  <p>
                    {listing.rooms} {listing.beds > 1 ? "Rooms" : "Room"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <span>
                    <MdOutlineBathtub className="text-2xl" />
                  </span>
                  <p>
                    {listing.baths} {listing.baths > 1 ? "Baths" : "Bath"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span>
                    <FaCouch className="text-2xl" />
                  </span>
                  <p>{listing.furnished > 1 ? "Furnished" : "Not Furnished"}</p>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <span>
                    <RxRulerSquare className="text-2xl" />
                  </span>
                  <p>{listing.size} Meters</p>
                </div>
                <div className="flex items-center gap-2">
                  <span>
                    <CiCalendarDate className="text-2xl" />
                  </span>
                  <p>
                    <Moment fromNow>{listing.timestamp?.toDate()}</Moment>
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-sm font-bold mb-3">Detailed Information</h2>
              <p className="leading-6 text-zinc-700">{listing.description}</p>
            </div>
            <div className="features">
              <h2 className="text-sm font-bold mb-3 mt-4">Features</h2>
              <div className="flex items-center gap-4 flex-wrap">
                {listing.addedFeatures.map((feat, index) => (
                  <div className="flex gap-2 items-center" key={index}>
                    <p className="main-color text-lg">{featIcon(feat)}</p>
                    <p key={index}>{feat}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="preferences mt-6">
              <h2 className="text-sm font-bold mb-3">Conditions</h2>
              <div className="flex gap-6 flex-wrap">
                <div>
                  {listing.gender === 'male' ? 
                  (
                    <div className="flex items-center gap-1">
                      <IoMan className="main-color text-xl"/>
                      <p>Gender Required: Male</p>
                    </div>   
                  )
                  :
                  (
                    <div className="flex items-center gap-1">
                      <IoWoman className="main-color text-xl"/>
                      <p>Gender Required: Female</p>
                    </div>  
                  )}
                </div>
                <div>
                  {listing.smoking === false ? 
                  (
                    <div className="flex items-center gap-1">
                      <IoLogoNoSmoking className="main-color text-xl"/>
                      <p>No Smoking</p>
                    </div>  
                  )
                  :
                  (
                    <div className="flex items-center gap-1">
                      <FaSmoking className="main-color text-xl"/>
                      <p>Smoking is allowed</p>
                    </div>  
                  )}
                </div>
                <div>
                  {listing.pets === false ? 
                  (
                    <div className="flex items-center gap-1">
                      <img src={noPets} alt="" className="w-[25px]"/>
                      <p>No pets</p>
                    </div>  
                  )
                  :
                  (
                    <div className="flex items-center gap-1">
                      <GiCat className="main-color text-xl"/>
                      <p>Pets Friendly</p>
                    </div>  
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="map w-full h-[400px] md-h-[800px] overflow-x-hidden flex-col lg:flex-row border border-gray-300 rounded-md p-2">
            <MapContainer
              center={[listing.geolocation.lat, listing.geolocation.lng]}
              zoom={13}
              scrollWheelZoom={false}
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer
                attribution="<a contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[listing.geolocation.lat, listing.geolocation.lng]}
              >
                <Popup>
                  The Location
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
        <div className="container mt-14">
          <h1 className="text-lg mb-2 font-bold">Explore Marketplaces, Sport centers, and Lifestyle around The Area</h1>
          <div className="map w-full h-[500px]">
            <MapContainer
              center={[listing.geolocation.lat, listing.geolocation.lng]}
              zoom={14}
              scrollWheelZoom={false}
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer
                attribution="<a contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[listing.geolocation.lat, listing.geolocation.lng]}
              >
                <Popup>
                  The Location
                </Popup>
              </Marker>
              {(pointsOfInterest.features || []).map((m, i) => {
                const gymIcon = new L.Icon({
                  iconUrl: require(`../components/assets/${m?.properties?.categories?.includes('sport') ? 'gym1' : m?.properties?.categories?.includes('commercial.supermarket') ? 'supermarket' : m?.properties?.categories?.includes('commercial.chemist') ? 'doctor' : m?.properties?.categories?.includes("public_transport.subway.entrance") ? 'train' : 'restaurant'}.png`),
                  iconSize: [35, 35]
                })
                return (
                    <Marker key={i}
                      position={[m?.geometry?.coordinates[1], m?.geometry?.coordinates[0]]}
                      icon={gymIcon}
                    >
                      <Popup>
                        <p className="font-bold text-sm">{m?.properties?.name}</p>
                        <p>{m?.properties?.formatted}</p>
                      </Popup>
                    </Marker>
                )
              })}
          </MapContainer>
        </div>
        </div>
        <div className="comment-section mt-14 flex gap-8 items-start border-t border-[#dddddd] pt-6 flex-wrap">
          <div className="comment px-2 w-[50%] max-lg:w-[100%]">
            <h1 className="mb-4 font-bold">{fetchedComments.length} Comments</h1>
            <div className="flex items-start gap-4">
              {auth.currentUser && 
              <>
                <img src={auth.currentUser.photoURL} alt="" className="w-[50px] rounded-full" />
              </>}
              <textarea 
                name="comment"
                placeholder="what are your thoughts on this listing?"
                className="w-[100%] h-[120px] focus:ring-0 text-sm rounded-md"
                value={comment}
                onChange={onChangeComment}
                required >
              </textarea>
            </div>
            <button 
              className="border bg-white rounded-full text-sm p-2 px-3 hover:bg-gray-100 float-right mt-6 font-semibold"
              onClick={addComment}>
              Post a Comment
            </button>
            <div className="border-t mt-[100px] pt-6 ">
              {fetchedComments.map((comment, i) => {
                commentOwnerInfo(comment?.data)
                return (
                  <div  key={i}>
                    <div className="flex gap-5 items-center mb-10 relative comment-single">
                      <img src={commentOwner?.photoURL} alt="" className="w-[50px] rounded-full "/>
                    <div>
                      <p className="font-semibold">
                        {capitalizeName(commentOwner?.name)}
                        <span className="ml-1"> . </span>
                        <span className="text-[10px] text-gray-600 font-normal ml-1">
                          {comment.data.timestamp !== 'now' 
                          ? <Moment fromNow>{comment.data.timestamp?.toDate()}</Moment>
                          : 'now'}
                        </span>
                      </p>
                      <div className="flex items-center">
                        <p className="text-sm">{comment.data.comment}</p>
                      </div>
                    </div>
                    {auth.currentUser.uid === comment?.data?.userRef
                    &&
                    <span 
                      className="absolute top-4 right-0 del-btn hidden transition-all transition-300 cursor-pointer"
                      onClick={() => deleteComment(comment?.id)}>
                        <AiFillDelete className="text-gray-400"/>
                      </span>}
                  </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="owner flex items-center flex-col gap-2 max-lg:w-[100%] flex-1 px-2 py-6">
            <div className="uppercase text-gray-400 text-xs font-bold">
              Owner
            </div>
            <div className="flex gap-2 items-center ">
              <div className="border-blue-600 p-1 border rounded-full">
                <img src={landLordData.photoURL} alt="" className="w-[45px] rounded-full "/>
              </div>
              <div>
                <p className="font-semibold">{capitalizeName(landLordData?.displayName)}</p>
                <div className="flex items-center">
                  <IoLocationOutline className="text-gray-500 text-xs"/>
                  <p className="text-xs text-gray-600">{landLordData.location}</p>
                </div>
              </div>
            </div>
            <button onClick={handleSelect} className="main-btn my-2 block"><AiOutlineMail className="mr-2"/> Message</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Listing;
