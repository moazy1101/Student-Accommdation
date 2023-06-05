import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import Avatar from "../../components/PostProfile/Avatar";
import UsernameButton from "../../components/PostProfile/UsernameButton";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "../../hooks/auth";
import { useDeleteComment } from "../../hooks/comments";
import { useUser } from "../../hooks/users";
import { FaTrash } from "react-icons/fa";

export default function Comment({ comment }) {
  const { text, uid, date, id } = comment;
  const { user, isLoading: userLoading } = useUser(uid);
  const { user: authUser, isLoading: authLoading } = useAuth();
  const { deleteComment, isLoading: deleteLoading } = useDeleteComment(id);

  if (userLoading) return "Loading...";

  return (
    <Box className="px-4 py-3 max-w-[650px] mx-auto text-left]">
      <Flex pb="2">
        <Avatar user={user} size="12"/>
        <Box className="flex-1 ml-4">
          <Flex className="border-b border-teal-300 pb-2">
            <Box className="text-left">
              <UsernameButton className="bg-red-500"  user={user} />
              <Text className="text-xs text-gray-500"  >
                {formatDistanceToNow(date)} ago
              </Text>
            </Box>
            {!authLoading && authUser.id === uid && (
              <IconButton
              className="text-sm ml-auto text-red-500 " 
                icon={<FaTrash />}
                variant="ghost"
                isRound
                onClick={deleteComment}
                isLoading={deleteLoading}
              />
            )}
          </Flex>
          <Box className="pt-2 text-sm">
            <Text className="text-left ml-3" >{text}</Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
