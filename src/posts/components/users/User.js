import { Button, Code, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
// import { PROTECTED } from "../../lib/routes";
import Avatar from "../../components/PostProfile/Avatar";

export default function User({ user }) {
  const { uid, name} = user;
// console.log(displayName)
// console.log(uid)
  return (
    <VStack
      bg="gray.100"
      shadow="sm"
      rounded="md"
      textAlign="center"
      p="4"
      spacing="3"
    >
      <Avatar user={user} size="32"/>
      <Code className="text-xl font-bold ">{name}</Code>
      <Link>
        <Button
          as={Link}
        to={`/PostProfile/${uid}`}
          size="sm"
          variant="link"
          colorScheme="teal"
        >
          View Profile
        </Button>
      </Link>
    </VStack>
  );
}
