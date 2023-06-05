import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Rent from "./pages/Rent";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateListing from "./pages/CreateListing";
import MyListings from "./pages/MyListings";
import EditListing from "./pages/EditListing";
import Listing from "./pages/Listing";
import Favourites from "./pages/Favourites";
import SearchPage from "./pages/SearchPage";
import AllListings from "./pages/AllListings";
import ChatPage from "./pages/Chat";
import ChatLogin from "./pages/ChatLogin";
import ChatRegister from "./pages/ChatRegister";
import { useContext } from "react";
import { AuthContext } from "./components/hooks/AuthContext";
// import Posts from "./pages/posts";
// import { ChakraProvider } from "@chakra-ui/react";
// import { RouterProvider } from "react-router-dom";
// import { router } from "./posts/lib/routes";
import Posts from "./pages/posts";
import Layout from "./posts/components/layout";
import Dashboard from "./posts/components/dashboard";
import Comments from "./posts/components/comments";
import PostProfile from "./posts/components/PostProfile";
import Users from "./posts/components/users";


function App() {
  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/chat/login" />;
    }

    return children
  };
  return (
    <>
    {/* <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider> */}
      <Router>
        <Routes>
        <Route path="/chat">
          <Route
            index
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<ChatLogin />} />
          <Route path="register" element={<ChatRegister />} />
        </Route>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path={"/post"} element={<Posts />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/search/:searchKey" element={<SearchPage />} />
          <Route path={"/profile"} element={<PrivateRoute />}>
            <Route path={"/profile"} element={<Profile />} />
            <Route path="/profile/create-listing" element={<CreateListing />} />
            <Route path="/profile/my-listings" element={<MyListings />} />
            <Route path="/profile/favourites" element={<Favourites />} />
            {/* <Route path="/profile/posts" element={<Dashboard />} /> */}
            <Route
              path="/profile/edit-listing/:listingId"
              element={<EditListing />}
            />
          </Route>


          <Route path={"/"} element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/PostProfile/:id" element={<PostProfile />} />
            <Route path="/comments/:id" element={<Comments />} />
          </Route>
          <Route path="/listing/:listingId" element={<Listing />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/all-listings" element={<AllListings />} />
        </Routes>
      </Router>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
