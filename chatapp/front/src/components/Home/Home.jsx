import { Grid, GridItem, Tabs } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import { createContext, useState } from "react";

export const FriendContext = createContext();
const Home = () => {
  const [friendList, setFriendList] = useState([
    { username: "John doe", connected: false },
    { username: "Steven", connected: true },
  ]);
  return (
    <FriendContext.Provider value={{ friendList, setFriendList }}>
      <Grid as={Tabs} templateColumns="repeat(10, 1fr)" h={"100vh"}>
        <GridItem colSpan="3" borderRight={"1px solid gray"}>
          <Sidebar />
        </GridItem>
        <GridItem colSpan="7">
          <Chat></Chat>
        </GridItem>
      </Grid>
    </FriendContext.Provider>
  );
};

export default Home;
