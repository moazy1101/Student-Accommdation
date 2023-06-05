import { Box, Button, Flex, Input } from "@chakra-ui/react";
import Avatar from "../../components/PostProfile/Avatar";
// import { useAuth } from "../../hooks/auth";
import { useAddComment } from "../../hooks/comments";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { AuthContext } from "../../../components/hooks/AuthContext";

export default function NewComment({ post }) {
  const { id: postID } = post;
  const { currentUser, isLoading: authLoading } = useContext(AuthContext);
  const { register, handleSubmit, reset } = useForm();
  const { addComment, isLoading: commentLoading } = useAddComment({
    postID,
    uid: currentUser?.uid,
  });

  function handleAddComment(data) {
    addComment(data.text);
    reset();
  }

  if (authLoading) return "Loading...";

  return (
    <Box className="max-w-[650px] mx-auto py-6">
      <Flex className="p-4">
        <Avatar user={currentUser} size="12"/>
        <Box flex="1" ml="4">
          <form onSubmit={handleSubmit(handleAddComment)}>
            <Box className="border-b pt-1 ">
              <Input
              className="w-[580px] hover:border-none pl-2 pt-2" 
                variant="flushed"
                placeholder="Write comment..."
                autoComplete="off"
                {...register("text", { required: true })}
              />
            <div className="border-b-2 pt-1"></div>
            </Box>
            <Flex className="pt-2" >
              <Button
              className="text-white bg-[#49b7b5] hover:bg-[#319795] py-3 px-2 mt-1 rounded-md text-xs ml-auto"
                isLoading={commentLoading || authLoading}
                type="submit"
              >
                Add Comment
              </Button>
            </Flex>
          </form>
        </Box>
      </Flex>
    </Box>
  );
}
