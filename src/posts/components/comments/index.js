import { Box } from "@chakra-ui/react";
import Post from "../../components/post";
import { usePost } from "../../hooks/posts";
import { useParams } from "react-router-dom";
import NewComment from "./NewComment";
import CommentList from "./CommentList";

export default function Comments() {
  const { id } = useParams();
  const { post, isLoading } = usePost(id);

  if (isLoading) return "Loading...";

  return (
    <Box className="pt-16"  align="center">
      <Post post={post} />
      <NewComment post={post} />
      <CommentList post={post} />
    </Box>
  );
}
