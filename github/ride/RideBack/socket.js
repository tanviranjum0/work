"use strict";

const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const { getRedisClient } = require("./config/redis");
const userModel = require("./models/user.model");
const rideModel = require("./models/ride.model");
const captainModel = require("./models/captain.model");
const blacklistTokenModel = require("./models/blacklistToken.model");
const logger = require("./utils/logger");

let io;
let pubSubClients = [];

function getHandshakeToken(socket) {
  // Handshake-only: a cookie fallback here would let any site that can read the user's
  // SameSite=None refresh-era cookie open an authenticated socket cross-site.
  const supplied = socket.handshake.auth?.token;
  return typeof supplied === "string" && supplied.length <= 8192 ? supplied : null;
}

async function initializeSocket(server, allowedOrigins) {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingInterval: 25_000,
    pingTimeout: 20_000,
    maxHttpBufferSize: 100_000,
  });
  const redisClient = getRedisClient();
  if (redisClient?.isOpen) {
    const pubClient = redisClient.duplicate();
    const subClient = redisClient.duplicate();
    pubSubClients = [pubClient, subClient];
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
  }

  io.use(async (socket, next) => {
    try {
      const token = getHandshakeToken(socket);
      if (!token) return next(new Error("Authentication required."));
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ["HS256"],
        issuer: process.env.JWT_ISSUER || "rideback-api",
        audience: process.env.JWT_AUDIENCE || "rideback-client",
      });
      if (
        typeof decoded === "string" ||
        !decoded?.id ||
        decoded.purpose !== "access" ||
        !["user", "captain"].includes(decoded.userType) ||
        (await blacklistTokenModel.exists({ token }))
      ) {
        return next(new Error("Invalid credentials."));
      }
      const Model = decoded.userType === "user" ? userModel : captainModel;
      const account = await Model.findById(decoded.id).select("_id +tokenVersion").lean();
      if (!account || (decoded.version || 0) !== (account.tokenVersion || 0)) {
        return next(new Error("Invalid credentials."));
      }
      socket.data.userId = account._id.toString();
      socket.data.userType = decoded.userType;
      return next();
    } catch {
      return next(new Error("Invalid credentials."));
    }
  });

  io.on("connection", (socket) => {
    const { userId, userType } = socket.data;
    const Model = userType === "user" ? userModel : captainModel;
    let messageWindowStartedAt = Date.now();
    let messageCount = 0;
    let lastLocationUpdateAt = 0;
    // Join the account room immediately so disconnectUser() can reach this socket even
    // if the client never emits "join" (e.g. a logout right after connecting).
    socket.join(`${userType}:${userId}`);
    Model.findByIdAndUpdate(userId, { $set: { socketId: socket.id } }).catch((error) => {
      logger.error("Failed to record socket connection", { name: error.name });
      socket.disconnect(true);
    });

    socket.on("join", () => {
      Promise.resolve(socket.join(`${userType}:${userId}`)).catch((error) => {
        logger.error("Socket room join failed", { name: error.name });
      });
    });

    socket.on("update-location-captain", async (data) => {
      if (userType !== "captain") return socket.emit("error", { message: "Forbidden." });
      if (Date.now() - lastLocationUpdateAt < 1000) {
        return socket.emit("error", { message: "Location updates are limited to one per second." });
      }
      lastLocationUpdateAt = Date.now();
      const latitude = data?.location?.ltd;
      const longitude = data?.location?.lng;
      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        return socket.emit("error", { message: "Invalid location data." });
      }
      try {
        await captainModel.findByIdAndUpdate(
          userId,
          { $set: { location: { type: "Point", coordinates: [longitude, latitude] } } },
          { runValidators: true },
        );
      } catch (error) {
        logger.error("Driver location update failed", { name: error.name });
        socket.emit("error", { message: "Unable to update location." });
      }
    });

    socket.on("join-room", async (rideId) => {
      if (typeof rideId !== "string" || !/^[a-f\d]{24}$/i.test(rideId)) {
        return socket.emit("error", { message: "Invalid ride." });
      }
      try {
        const ride = await rideModel.findById(rideId).select("user captain").lean();
        const participantId = userType === "user" ? ride?.user : ride?.captain;
        if (!participantId || participantId.toString() !== userId) {
          return socket.emit("error", { message: "Forbidden." });
        }
        await socket.join(rideId);
      } catch (error) {
        logger.error("Socket ride-room authorization failed", { name: error.name });
        socket.emit("error", { message: "Unable to join ride." });
      }
    });

    socket.on("message", async (data) => {
      const now = Date.now();
      if (now - messageWindowStartedAt >= 60_000) {
        messageWindowStartedAt = now;
        messageCount = 0;
      }
      if (++messageCount > 30) {
        return socket.emit("error", { message: "Message rate limit exceeded." });
      }
      const rideId = data?.rideId;
      const msg = typeof data?.msg === "string" ? data.msg.trim() : "";
      if (!/^[a-f\d]{24}$/i.test(rideId || "") || msg.length < 1 || msg.length > 1000) {
        return socket.emit("error", { message: "Invalid message." });
      }
      try {
        const ride = await rideModel.findById(rideId).select("user captain messages");
        const participant = userType === "user" ? ride?.user : ride?.captain;
        if (!ride || participant?.toString() !== userId) {
          return socket.emit("error", { message: "Forbidden." });
        }
        const payload = {
          msg,
          by: userType,
          time: moment().tz("Asia/Kolkata").format("hh:mm A"),
          date: moment().tz("Asia/Kolkata").format("MMM DD"),
          timestamp: new Date(),
        };
        ride.messages.push(payload);
        if (ride.messages.length > 500) {
          ride.messages.splice(0, ride.messages.length - 500);
        }
        await ride.save();
        socket.to(rideId).emit("receiveMessage", payload);
      } catch (error) {
        logger.error("Socket message persistence failed", { name: error.name });
        socket.emit("error", { message: "Unable to send message." });
      }
    });

    socket.on("disconnect", () => {
      Model.findOneAndUpdate(
        { _id: userId, socketId: socket.id },
        { $unset: { socketId: 1 } },
      ).catch((error) => {
        logger.error("Failed to clear socket connection", { name: error.name });
      });
    });
  });
}

function sendMessageToSocketId(socketId, messageObject) {
  if (io && socketId && messageObject?.event) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  }
}

// Forces out any live sockets for an account (logout, password reset). Works across
// instances via the Socket.IO Redis adapter; relies on the account-room join above.
function disconnectUser(userType, userId) {
  if (io && userType && userId) {
    io.in(`${userType}:${userId}`).disconnectSockets(true);
  }
}

function closeSocket() {
  const current = io;
  io = undefined;
  const closeIo = current
    ? new Promise((resolve) => current.close(resolve))
    : Promise.resolve();
  return closeIo.then(async () => {
    await Promise.all(pubSubClients.map((client) => client.quit()));
    pubSubClients = [];
  });
}

module.exports = { initializeSocket, sendMessageToSocketId, disconnectUser, closeSocket };
