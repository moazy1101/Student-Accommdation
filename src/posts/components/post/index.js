import { Box, Text } from "@chakra-ui/react";
import Header from "./Header";
import Actions from "./Actions";

export default function Post({ post }) {
  const { text } = post;

  return (
    <Box className="p-2 max-w-[650px] text-left pb-3">
      <Box className="border-2 border-[#edf2f7] rounded-md" >
        <Header post={post} />

        <Box className="p-2 min-h-[100px]">
          <Text className="break-words py-2 text-[1.03rem] font-light">
            {text}
          </Text>
        </Box>

        <Actions post={post} />
      </Box>
    </Box>
  );
}
