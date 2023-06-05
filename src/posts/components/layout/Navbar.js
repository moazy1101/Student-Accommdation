// import { Button, Flex, Link } from "@chakra-ui/react";
// import { DASHBOARD, PROFILE , USERS} from "../../lib/routes";
// import { Link as RouterLink } from "react-router-dom";
// import { useLogout } from "../../hooks/auth";
// import { useContext } from "react";
// import { AuthContext } from "../../../components/hooks/AuthContext";

// export default function Navbar() {
//   const { logout, isLoading } = useLogout();
//   const {currentUser} = useContext(AuthContext);
//   return (
//     <Flex
//       shadow="sm"
//       pos="fixed"
//       width="full"
//       borderTop="6px solid"
//       borderTopColor="teal.400"
//       height="16"
//       zIndex="3"
//       justify="center"
//       bg="white"
//     >

//       <Flex px="4" w="full" align="center" maxW="1200px">
//         <Link className="px-10" color="teal" as={RouterLink} to={DASHBOARD} fontWeight="bold">
//           Home
//         </Link>
//         <Link className="px-10" color="teal" as={RouterLink} to={USERS} fontWeight="bold">
//         USERS
//         </Link>
//         <Link className="px-10" color="teal" as={RouterLink} to={`/PostProfile/${currentUser.uid}`}fontWeight="bold">
//         PROFILE
//         </Link>
//         <Button
//           ml="auto"
//           colorScheme="teal"
//           size="sm"
//           onClick={logout}
//           isLoading={isLoading}
//         >
//           Logout
//         </Button>
//       </Flex>
//     </Flex>
//   );
// }
