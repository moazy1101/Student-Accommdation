import { Flex, IconButton } from "@chakra-ui/react";
import { useAuth } from "../../hooks/auth";
import {
  FaRegHeart,
  FaHeart,
  FaComment,
  FaRegComment,
  FaTrash,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDeletePost, useToggleLike } from "../../hooks/posts";
import { useComments } from "../../hooks/comments";



export default function Actions({ post }) {
  const { id, likes, uid } = post;
  const { user, isLoading: userLoading } = useAuth();

  const isLiked = likes.includes(user?.uid);
  const config = {
    id,
    isLiked,
    uid: user?.uid,
  };

  const { toggleLike, isLoading: likeLoading } = useToggleLike(config);
  const { deletePost, isLoading: deleteLoading } = useDeletePost(id);
  const { comments, isLoading: commentsLoading } = useComments(id);

  return (
    <Flex className="p-">
      <Flex className="items-center">
        <IconButton
          onClick={toggleLike}
          isLoading={likeLoading || userLoading}
          className="text-lg text-red-600 ml-3 mr-2"
          variant="ghost"
          icon={isLiked ? <FaHeart /> : <FaRegHeart />}
          isRound
        />
        {likes.length}
      </Flex>
      <Flex className="items-center ml-2">
        <IconButton
        className="text-lg text-teal-600 mx-2"
          as={Link}
          to={`/comments/${id}`}
          isLoading={commentsLoading}
          variant="ghost"
          icon={comments?.length === 0 ? <FaRegComment /> : <FaComment />}
          isRound
        />
        {comments?.length}
      </Flex>

      {!userLoading && user.uid === uid && (
        <IconButton
        className="ml-auto text-lg text-red-700 mb-1 mr-2"
          onClick={deletePost}
          isLoading={deleteLoading}
          variant="ghost"
          icon={<FaTrash />}
          isRound
        />
      )}
    </Flex>
  );
}
