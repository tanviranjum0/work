import { useEffect, useContext } from "react";
import { AccountContext } from "../../AccountContext";
import socket from "../../socket";
const UseSocketSetup = (setFriendList) => {
  const { setUser } = useContext(AccountContext);
  useEffect(() => {
    socket.connect();
    socket.on("friends", (friendList) => {
      setFriendList(friendList);
    });
    socket.on("connect_error", (message) => {
      console.log("Received message:", message);
      setUser({ loggedIn: false });
      return () => socket.off("connect_error");
    });
  }, [setUser]);
};
export default UseSocketSetup;
