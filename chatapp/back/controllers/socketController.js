const redisClient = require("../redis");

module.exports.authorizeUser = (socket, next) => {
  if (!socket.request.session || !socket.request.session.user) {
    console.log("Bad Request");
    return next(new Error("Unauthorized"));
  } else {
    socket.user = { ...socket.request.session.user };
    redisClient.hset(
      `userid ${socket.user.username}`,
      "userid",
      socket.user.userid
    );
    next();
  }
};

module.exports.initializeUser = async (socket) => {
  socket.user = { ...socket.request.session.user };
  await redisClient.hset(
    `userid: ${socket.user.username}`,
    "userid",
    socket.user.userid
  );
  const friendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );
  socket.emit("friends", friendList);
  console.log(friendList);
  console.log(
    "userid",
    socket.user.userid,
    "/ username:",
    socket.user.username
  );
};
module.exports.addFriend = async (socket, friendName, cb) => {
  if (friendName === socket.user.username) {
    cb({ done: false, errorMgs: "Cannot add self" });
  }
  const friendUserID = await redisClient.hget(
    `userid: ${friendName}`,
    "userid"
  );
  // const friendList=["Steve","tom"]
  const currentFriendList = await redisClient.lrange(
    `friends: ${socket.user.username}`,
    0,
    -1
  );
  if (!friendUserID) {
    cb({ done: false, errorMgs: "User doesn't exist" });
    return;
  }
  if (currentFriendList && currentFriendList.indexOf(friendName) != -1) {
    cb({ done: false, errorMgs: "Friend already exist" });
  }
  await redisClient.lpush(`friends: ${socket.user.username}`, friendName);
  cb({ done: true });
  // cb({ done: true, errorMgs: "NO valid" });
  // console.log(friendUserID);
};
