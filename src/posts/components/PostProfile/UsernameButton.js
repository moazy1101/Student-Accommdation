import { Button } from "@chakra-ui/react";
// import { PROTECTED } from "../../lib/routes";
import { Link } from "react-router-dom";

export default function UsernameButton({ user }) {
  return (
    <Button
      as={Link}
      to={`/PostProfile/${user.uid}`}
      colorScheme="teal"
      variant="link"
    >
      {user.name}
    </Button>
  );
}
