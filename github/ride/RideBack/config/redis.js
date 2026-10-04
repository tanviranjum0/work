"use strict";

const { createClient } = require("redis");
const logger = require("../utils/logger");

let client;
let ready;
let markReady;

function getRedisClient() {
  if (!client && process.env.REDIS_URL) {
  client = createClient({ url: process.env.REDIS_URL });
  client.on("error", (error) => {
    logger.error("Redis client error", { name: error.name });
  });
  }
  return client;
}

// Resolves once connectRedis() has opened the shared client. Rate-limit stores are
// built at import time, before startup connects Redis; their first commands wait here
// instead of failing with ClientClosedError, which the store would otherwise cache.
function whenRedisReady() {
  if (!ready) ready = new Promise((resolve) => { markReady = resolve; });
  return ready;
}

async function connectRedis() {
  const redisClient = getRedisClient();
  if (!redisClient) {
    if (process.env.ENVIRONMENT === "production") {
      throw new Error("REDIS_URL must be configured in production.");
    }
    return null;
  }
  await redisClient.connect();
  whenRedisReady();
  markReady(redisClient);
  logger.info("Redis connected");
  return redisClient;
}

async function disconnectRedis() {
  if (client?.isOpen) await client.quit();
  client = undefined;
  ready = undefined;
}

module.exports = { connectRedis, disconnectRedis, getRedisClient, whenRedisReady };
