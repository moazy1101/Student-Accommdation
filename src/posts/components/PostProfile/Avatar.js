import { Avatar as ChakraAvatar } from "@chakra-ui/react";
// import { PROTECTED } from "lib/routes";
import { Link } from "react-router-dom";

export default function Avatar({ user, size, overrideAvatar = null }) {
  
  return (
    <>
    <ChakraAvatar
      as={Link}
      to={`/PostProfile/${user.uid}`}
      name={user.Username}
      className={`w-${size} h-${size} overflow-hidden rounded-full`}
      size={size}
      src={overrideAvatar || user.photoURL}
      _hover={{ cursor: "pointer", opacity: "0.8" }}
    />
    </>
  );
}
