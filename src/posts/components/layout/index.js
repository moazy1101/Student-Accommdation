import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth";
// import Navbar from "../../components/layout/Navbar";
import Navbar from "../../../components/Navbar"
import Sidebar from "../../components/layout/Sidebar";
import { Box, Flex } from "@chakra-ui/react";

export default function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && pathname.startsWith("/protected") && !user) {
      navigate("/sign-in");
    }
  }, [pathname, user, isLoading]);

  if (isLoading) return "Loading auth user...";

  return (
    <>
      <Navbar backgroundColor='#222222' />
      <Flex className="gap-16 pt-10 pb-8 w-full">
        <Sidebar />
        <Box className="max-md:w-full m-auto max-lg:w-[70%]">
          <Outlet />
        </Box>
      </Flex>
    </>
  );
}
