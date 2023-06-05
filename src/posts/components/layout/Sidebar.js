import { Box, Button, Code, Stack } from "@chakra-ui/react";
// import { useAuth } from "../../hooks/auth";
// import { USERS } from "../../lib/routes";
import { Link } from "react-router-dom";
import Avatar from "../../components/PostProfile/Avatar";
import { useContext } from "react";
import { AuthContext } from "../../../components/hooks/AuthContext";

function ActiveUser() {
  const { currentUser , isLoading} = useContext(AuthContext);

  if (isLoading) return "Loading...";

  return (
    <Stack className="gap-5 my-8" align="center" >
      <Avatar user={currentUser} size="32"/>
      <Code>{currentUser.displayName}</Code>
      <Button
      className="bg-[#49b7b5] w-[85%] rounded-md py-3 px-2 text-white"
        as={Link}
        to={`/PostProfile/${currentUser.uid}`}
      >
        Edit Profile
      </Button>
    </Stack>
  );
}

export default function Sidebar() {
  return (
    <Box
    className="px-6 w-[100%] max-md:hidden h-[100vh] max-w-[300px] border-r-2 border-r-teal-100"
     
      position="sticky"
      top="16"
      // display={{ base: "none", md: "block" }}
    >
      <ActiveUser />
      <Box align="center">
        <Box as="ul" borderBottom="2px solid" borderColor="teal.200" />
        <Button
          variant="outline"
          colorScheme="teal"
          as={Link}
          to="/users"
          mt="4"
          size="sm"
        >
          ALL USERS
        </Button>
      </Box>
    </Box>
  );
}
