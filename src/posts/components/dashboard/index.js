import { Box} from "@chakra-ui/react";
import { useAddPost, usePosts } from "../../hooks/posts";
import PostsLists from "../../components/post/PostsList";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { useContext } from "react";
import { AuthContext } from "../../../components/hooks/AuthContext";

function NewPost() {
  const { register, handleSubmit, reset } = useForm();
  const { addPost, isLoading: addingPost } = useAddPost();
  const { currentUser, isLoading: authLoading } = useContext(AuthContext);

  function handleAddPost(data) {
    addPost({
      uid: currentUser.uid,
      text: data.text,
    });
    reset();
  }

  return (
    <Box className="max-w-[600px] mx-auto py-10 container">
      <form onSubmit={handleSubmit(handleAddPost)}>
        <div className="flex justify-between items-center">
          <h2 className="text-lg">New Post</h2>
          <button
            className="bg-[#319795] hover:bg-teal-700 px-4 py-2 rounded-md font-semibold text-white"
            type="submit"
            isLoading={authLoading || addingPost}
            loadingText="Loading"
          >
            Post
          </button>
        </div>
        <textarea
          as={TextareaAutosize}
          className="mt-5 row-span-3 w-[100%]"
          placeholder="Create a new post..."
          {...register("text", { required: true })}
        />
      </form>
    </Box>
  );
}

export default function Dashboard() {
  // const { currentUser } = useContext(AuthContext);
  const { posts, isLoading } = usePosts();

  if (isLoading) return "Loading posts...";

  return (
    <>
      <NewPost />
      <PostsLists posts={posts} />
    </>
  );
}
