import { Box, Flex, Text } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "../../hooks/users";
import Avatar from "../PostProfile/Avatar";
import UsernameButton from "../PostProfile/UsernameButton";



export default function Header({ post }) {
  const { uid, date } = post;
  const { user, isLoading } = useUser(uid);

  if (isLoading) return "Loading...";

  return (
    <Flex
    className="items-center rounded-t-md border-b-2 border-[#b2f5ea] p-3 bg-[#f7fafc]"
    >
      <Avatar user={user} size="12"/>

      <Box className="ml-2">
        <UsernameButton user={user} />
        <Text className="text-sm text-gray-400">
          {formatDistanceToNow(date)} ago
        </Text>
      </Box>
    </Flex>
  );
}
