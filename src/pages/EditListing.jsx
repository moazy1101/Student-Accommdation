import React from "react";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { BsFillCloudArrowUpFill } from "react-icons/bs";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import {
  collection,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { doc, addDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { useEffect } from "react";
import NumberInput from "../components/NumberInput";
import { useNavigate, useParams } from "react-router";
import axios from "axios";

const EditListing = () => {
  const auth = getAuth();
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const featuresList = [
    "Wifi",
    "Tv",
    "Balcony",
    "Private Bath",
    "Oven",
    "Wash Machine",
    "Fridge",
    "Air Conditioner",
  ];
  const [listing, setListing] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    beds: 1,
    baths: 1,
    rooms: 1,
    size: 10,
    furnished: false,
    address: "",
    description: "",
    price: 50,
    gender: 'male',
    addedFeatures: [],
    smoking: false,
    pets: false,
    images: [],
  });
  const {
    title,
    beds,
    baths,
    rooms,
    size,
    furnished,
    address,
    description,
    price,
    gender,
    addedFeatures,
    smoking,
    pets,
    images,
  } = formData;

  function checkedOrNot(feat) {
    if (addedFeatures.includes(feat)) {
      return true;
    }
  }

  useEffect(() => {
    if (!auth.currentUser.emailVerified) {
      navigate("/profile");
    }
    if (listing.userRef) {
      if (listing && listing.userRef !== auth.currentUser.uid) {
        toast.error("You can't edit this listing");
        navigate("/");
      }
    }
  }, [auth.currentUser.uid, listing, navigate]);

  useEffect(() => {
    setLoading(true);
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setFormData({ ...docSnap.data()});
        setLoading(false);
      } else {
        navigate("/");
      }
    }
    fetchListing();
  }, [navigate, params.listingId]);

  function onChange(e) {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: boolean ?? e.target.value,
      }));
    }
    if (e.target.name === "features") {
      let copy = { ...formData };
      if (e.target.checked) {
        copy.addedFeatures.push(e.target.value);
      } else {
        copy.addedFeatures = copy.addedFeatures.filter(
          (el) => el !== e.target.value
        );
      }
      setFormData(copy);
    }
  }

  const getErrors = (values) => {
    const errors = {};
    if (!values.title) {
      errors.title = "Title is required";
    }
    if (!values.address) {
      errors.address = "Please enter a valid address";
    }
    if (!values.description) {
      errors.description = "please enter detailed description";
    }
    if (!values.price || values.price < 50) {
      errors.price = "The minimum price is 50";
    }
    if (!values.images.length) {
      errors.images = "Please upload at least one image";
    }
    return errors;
  };

  async function onSubmit(e) {
    e.preventDefault();
    setFormErrors(getErrors(formData));
    setIsSubmit(true);
  }

  async function submit() {
    setLoading(true);
    if (images.length > 6) {
      setLoading(false);
      toast.error("You cannot upload more than 6 images");
      return;
    }
    let geolocation = {};
    let location;
    let area;
    try {
      const res = await axios.get(
        `https://trueway-geocoding.p.rapidapi.com/Geocode`,
        {
          headers: {
            "X-RapidAPI-Key": process.env.REACT_APP_GEO_API_KEY,
            "X-RapidAPI-Host": "trueway-geocoding.p.rapidapi.com",
          },
          params: { address: `${address}`, language: "en" },
        }
      );
      const data = res.data;
      if (data.results.length === 0) {
        setLoading(false);
        toast.error("please enter a correct address");
        return;
      } else {
        geolocation.lat = data.results[0]?.location.lat ?? 0;
        geolocation.lng = data.results[0]?.location.lng ?? 0;
        area = data.results[0]?.area.toLowerCase()
      }
    } catch (err) {
      setLoading(false);
      toast.error(err);
      return;
    }
    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage,"listing/" + fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            // eslint-disable-next-line default-case
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }
    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Failed to upload images");
      return;
    });
    const formDataCopy = {
      ...formData,
      geolocation,
      area,
      imgUrls,
      userRef: auth.currentUser.uid,
      timestamp: serverTimestamp(),
    };
    delete formDataCopy.images;
    const docRef = doc(db, "listings", params.listingId);
    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    navigate(`/listing/${docRef.id}`);
    toast.success("List has been edited successfully");
  }

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      submit();
    }
  }, [formErrors, isSubmit]);

  if (loading) {
    return <Spinner />;
  }
  return (
    <>
      <Navbar backgroundColor="#222222" />
      <div>
        <div className="container flex pt-14 gap-6 lg:gap-20">
          <Sidebar />
          <div className="create-listing mx-auto">
            <h1 className="text-3xl mb-12 text-center tracking-wide font-bold">
              Edit Listing
            </h1>
            <form onSubmit={onSubmit}>
              <div className="flex justify-center items-center gap-4 flex-wrap w-full">
                <div className="field flex flex-col max-xl:w-full">
                  <h4 className="ml-2 mb-2 text-sm">Title</h4>
                  <input
                    type="text"
                    name="title"
                    value={title}
                    placeholder="Title"
                    onChange={onChange}
                    className="rounded-3xl xl:w-[350px] focus:ring-0 h-12 p-4 text-sm max-xl:w-full"
                    required
                  />
                  <p className="text-xs text-red-600 mb-2">
                    {formErrors.title}
                  </p>
                </div>
                <div className="field flex flex-col my-4 max-xl:w-full">
                  <h4 className="ml-2 mb-2 text-sm">Address</h4>
                  <input
                    type="text"
                    name="address"
                    value={address}
                    placeholder="Address"
                    onChange={onChange}
                    className="rounded-3xl w-[350px] focus:ring-0 h-12 p-4 text-sm max-xl:w-full"
                    required
                  />
                  <p className="text-xs text-red-600 mb-2">
                    {formErrors.address}
                  </p>
                </div>
              </div>
              <div className="border p-4 w-full mb-4">
                <div className="flex flex-wrap md:flex-row gap-16 max-lg:gap-8 justify-center">
                  <div className="my-4">
                    <h4 className="ml-2 mb-2 text-sm">Beds</h4>
                    <NumberInput
                      name="beds"
                      type="number"
                      value={beds}
                      onChange={onChange}
                    />
                  </div>
                  <div className="my-4">
                    <h4 className="ml-2 mb-2 text-sm">Baths</h4>
                    <NumberInput
                      name="baths"
                      type="number"
                      value={baths}
                      onChange={onChange}
                    />
                  </div>
                  <div className="my-4">
                    <h4 className="ml-2 mb-2 text-sm">Rooms</h4>
                    <NumberInput
                      name="rooms"
                      type="number"
                      value={rooms}
                      onChange={onChange}
                    />
                  </div>
                  <div className="max-lg:mb-8 sm:my-4 max-sm:mb-4">
                    <h4 className="ml-2 mb-2 text-sm">Size in meters</h4>
                    <NumberInput
                      name="size"
                      type="number"
                      value={size}
                      onChange={onChange}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-6 flex-wrap justify-center">
                  <div className="">
                    <h4 className="ml-2 mb-2 text-sm">Furnished</h4>
                    <div className="flex gap-2">
                      <button
                        className={` text-sm rounded-3xl w-[80px] h-[40px] hover:drop-shadow-md transition transition-100 
                      ${
                        furnished
                          ? "bg-main-color text-white main-btn-hover hover:bg-[#bb2025]"
                          : "border border-gray"
                      }`}
                        type="button"
                        name="furnished"
                        value={true}
                        onClick={onChange}
                      >
                        Yes
                      </button>
                      <button
                        className={` text-sm rounded-3xl w-[80px] h-[40px] hover:drop-shadow-md transition transition-100
                      ${
                        !furnished
                          ? "bg-main-color text-white hover:bg-[#bb2025]"
                          : "border border-gray"
                      }`}
                        type="button"
                        name="furnished"
                        value={false}
                        onClick={onChange}
                      >
                        No
                      </button>
                    </div>
                  </div>
                  <div className="mt-1">
                    <h4 className="ml-2 mb-2 text-sm">Price</h4>
                    <div className="flex items-center gap-2">
                      <NumberInput
                        name="price"
                        type="number"
                        value={price}
                        onChange={onChange}
                      />
                      <p className="text-sm">EGP / Month</p>
                    </div>
                    <p className="text-xs text-red-600 mb-2 mt-2">
                      {formErrors.price}
                    </p>
                  </div>
                  <div>
                    <h4 className="ml-2 mb-2 text-sm">Required Gender</h4>
                    <select 
                      className="border-1 rounded-full text-sm focus:ring-0 border-slate-300 h-[42px]" 
                      name="gender" 
                      id="" 
                      onChange={onChange}
                      defaultValue={gender}
                      required>
                      <option className="text-sm" value="male">Male</option>
                      <option className="text-sm" value="female">Female</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="field flex flex-col w-full">
                <h4 className="ml-2 mb-2 text-sm">Description</h4>
                <textarea
                  name="description"
                  value={description}
                  placeholder="Description"
                  onChange={onChange}
                  className="rounded-3xl min-h-[150px] focus:ring-0 h-12 p-4 text-sm mb-4 w-full"
                  required
                />
                <p className="text-xs text-red-600 mb-2">
                  {formErrors.description}
                </p>
              </div>
              <div className="mt-6">
                <h4 className="ml-2 text-sm mb-2">Features</h4>
                <div className="border w-full flex justify-center mb-4">
                  <div className="mt-6">
                    <h4 className="ml-2 text-sm mb-2">Features</h4>
                    <div className="flex flex-wrap w-[300px] lg:w-[450px] mb-6">
                      {[...featuresList].map((feature, i) => (
                        <div key={i} className="w-[40%] md:w-[30%] ml-2">
                          <input
                            className="focus:ring-0"
                            name="features"
                            type="checkbox"
                            value={feature}
                            onChange={onChange}
                            checked={addedFeatures.includes(feature) && true}
                          />
                          <span className="text-sm ml-2">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full border p-6">
                <h4 className="ml-2 text-sm mb-6">Preferences</h4>
                <div className="flex gap-4 justify-center max-md:flex-col items-center">
                <div className="">
                    <h4 className="ml-2 mb-2 text-sm">Do you allow pets?</h4>
                    <div className="flex gap-2">
                      <button
                        className={` text-sm rounded-3xl w-[80px] h-[40px] hover:drop-shadow-md transition transition-100 
                      ${
                        pets
                          ? "bg-main-color text-white main-btn-hover hover:bg-[#bb2025]"
                          : "border border-gray"
                      }`}
                        type="button"
                        name="pets"
                        value={true}
                        onClick={onChange}
                      >
                        Yes
                      </button>
                      <button
                        className={` text-sm rounded-3xl w-[80px] h-[40px] hover:drop-shadow-md transition transition-100
                      ${
                        !pets
                          ? "bg-main-color text-white hover:bg-[#bb2025]"
                          : "border border-gray"
                      }`}
                        type="button"
                        name="pets"
                        value={false}
                        onClick={onChange}
                      >
                        No
                      </button>
                    </div>
                  </div>
                  <div className="">
                    <h4 className="ml-2 mb-2 text-sm">Do you allow smoking?</h4>
                    <div className="flex gap-2">
                      <button
                        className={` text-sm rounded-3xl w-[80px] h-[40px] hover:drop-shadow-md transition transition-100 
                      ${
                        smoking
                          ? "bg-main-color text-white main-btn-hover hover:bg-[#bb2025]"
                          : "border border-gray"
                      }`}
                        type="button"
                        name="smoking"
                        value={true}
                        onClick={onChange}
                      >
                        Yes
                      </button>
                      <button
                        className={` text-sm rounded-3xl w-[80px] h-[40px] hover:drop-shadow-md transition transition-100
                      ${
                        !smoking
                          ? "bg-main-color text-white hover:bg-[#bb2025]"
                          : "border border-gray"
                      }`}
                        type="button"
                        name="smoking"
                        value={false}
                        onClick={onChange}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div> 
              </div>
              <div className="w-full">
                <h4 className="ml-2 text-sm">Images</h4>
                <p className="text-xs ml-2 mb-2">
                  The first will be cover(max 6)
                </p>
                <p className="text-xs ml-2 mb-2 text-red-600">
                  please upload the images again
                </p>
                <div
                  className="uploader w-full rounded-3xl min-h-[150px] flex items-center justify-center gap-2
                  cursor-pointer relative flex-wrap p-2 
                  border-dashed border-[#d92228] border-2 mb-4"
                  onClick={() => document.querySelector(".image-field").click()}
                >
                  <input
                    type="file"
                    name="images"
                    onChange={onChange}
                    className="image-field opacity-0 absolute"
                    accept=".jpg, .png, .jpeg"
                    multiple
                    required
                  />
                  {images ? (
                    [...images].map((el, i) => {
                      return (
                        <div
                          className="text-xs bg-gray-300 rounded-md p-2"
                          key={i}
                        >
                          {el.name}
                        </div>
                      );
                    })
                  ) : (
                    <BsFillCloudArrowUpFill className="main-color text-5xl" />
                  )}
                </div>
                <p className="text-xs text-red-600 mb-2">{formErrors.images}</p>
              </div>
              <button className="main-btn mx-auto my-8" type="submit">
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditListing;
