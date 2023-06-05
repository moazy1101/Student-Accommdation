import { Box, Text } from "@chakra-ui/react";
import Post from "./index";

export default function PostsList({ posts }) {
  return (
    <Box className="px-4" align="center">
      {posts?.length === 0 ? (
        <Text className="text-center text-xl">
          No posts yet... Feeling a little lonely here.
        </Text>
      ) : (
        posts?.map((post) => <Post key={post.id} post={post} />)
      )}
    </Box>
  );
}
