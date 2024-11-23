import { ChatIcon } from "@chakra-ui/icons";
import {
  Heading,
  VStack,
  Circle,
  HStack,
  Button,
  TabList,
  Tab,
  Divider,
  Text,
} from "@chakra-ui/react";
import { FriendContext } from "./Home";
import { useContext } from "react";
const Sidebar = () => {
  const { friendList, setFriendList } = useContext(FriendContext);
  return (
    <VStack py={"1.4rem"}>
      <HStack justify={"space-evenly"} w={"100%"}>
        <Heading size={"md"}>Add Friend</Heading>
        <Button>
          <ChatIcon></ChatIcon>
        </Button>
      </HStack>
      <Divider></Divider>
      <VStack as={TabList}>
        {friendList &&
          friendList.map((user) => {
            return (
              <HStack as={Tab} key={user.username}>
                <Circle
                  bg={user.connected ? "green.500" : "red.500"}
                  w="20px"
                  h="20px"
                ></Circle>
                <Text>{user.username}</Text>
              </HStack>
            );
          })}
      </VStack>
    </VStack>
  );
};

export default Sidebar;
