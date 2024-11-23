import { VStack, TabPanel, Text, TabPanels } from "@chakra-ui/react";
import { FriendContext } from "./Home";
import { useContext } from "react";
const Chat = () => {
  const { friendList } = useContext(FriendContext);
  return (
    <div>
      {friendList.length > 0 ? (
        <VStack>
          <TabPanels>
            <TabPanel>Tab 1 Content</TabPanel>
            <TabPanel>Tab 2 Content</TabPanel>
            <TabPanel>Tab 3 Content</TabPanel>
          </TabPanels>
        </VStack>
      ) : (
        <VStack justify="center" pt="5rem" w="100%" fontSize="lg">
          <TabPanel>
            <Text>No Friend. Click add friend to start chatting</Text>
          </TabPanel>
        </VStack>
      )}
    </div>
  );
};

export default Chat;
