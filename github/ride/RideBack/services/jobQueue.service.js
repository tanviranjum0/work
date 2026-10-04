"use strict";

const { Queue, Worker } = require("bullmq");
const IORedis = require("ioredis");
const { getAddressCoordinate, getCaptainsInTheRadius } = require("./map.service");
const { sendMail } = require("./mail.service");
const rideModel = require("../models/ride.model");
const { sendMessageToSocketId } = require("../socket");
const logger = require("../utils/logger");

const QUEUE_NAME = "rideback-background";
let queue;
let worker;
let queueConnection;
let workerConnection;

async function dispatchRide(rideId) {
  const ride = await rideModel.findById(rideId).populate("user", "fullname");
  if (!ride || ride.status !== "pending") return;

  const coordinates = await getAddressCoordinate(ride.pickup);
  const drivers = await getCaptainsInTheRadius(
    coordinates.ltd,
    coordinates.lng,
    4,
    ride.vehicle,
  );
  // Riders aren't contactable until a captain accepts (POST /ride/confirm returns their
  // phone and socketId then), so the broadcast omits both.
  const offer = {
    _id: ride._id,
    pickup: ride.pickup,
    destination: ride.destination,
    fare: ride.fare,
    vehicle: ride.vehicle,
    distance: ride.distance,
    duration: ride.duration,
    status: ride.status,
    user: { fullname: ride.user?.fullname },
  };
  for (const driver of drivers) {
    if (driver.socketId) {
      sendMessageToSocketId(driver.socketId, { event: "new-ride", data: offer });
    }
  }
}

async function processJob(job) {
  if (job.name === "ride-dispatch") {
    return dispatchRide(job.data.rideId);
  }
  if (job.name === "email-delivery") {
    return sendMail(job.data.to, job.data.subject, job.data.html);
  }
  throw new Error(`Unsupported background job: ${job.name}`);
}

async function startJobQueue() {
  if (!process.env.REDIS_URL) return false;
  queueConnection = new IORedis(process.env.REDIS_URL, { maxRetriesPerRequest: null });
  workerConnection = new IORedis(process.env.REDIS_URL, { maxRetriesPerRequest: null });
  for (const connection of [queueConnection, workerConnection]) {
    connection.on("error", (error) => {
      logger.error("Background queue Redis error", { name: error.name });
    });
  }
  queue = new Queue(QUEUE_NAME, { connection: queueConnection });
  worker = new Worker(QUEUE_NAME, processJob, {
    connection: workerConnection,
    concurrency: Number(process.env.BACKGROUND_JOB_CONCURRENCY) || 10,
  });
  worker.on("failed", (job, error) => {
    logger.error("Background job failed", {
      jobName: job?.name,
      jobId: job?.id,
      errorName: error.name,
    });
  });
  worker.on("error", (error) => {
    logger.error("Background worker error", { errorName: error.name });
  });
  await Promise.all([queue.waitUntilReady(), worker.waitUntilReady()]);
  return true;
}

function jobOptions() {
  return {
    attempts: 4,
    backoff: { type: "exponential", delay: 1000 },
    removeOnComplete: true,
    removeOnFail: true,
  };
}

async function enqueueRideDispatch(rideId) {
  if (!queue) return false;
  await queue.add("ride-dispatch", { rideId: rideId.toString() }, {
    ...jobOptions(),
    jobId: `ride-dispatch-${rideId}`,
  });
  return true;
}

async function enqueueEmail(email) {
  if (!queue) return false;
  await queue.add("email-delivery", email, jobOptions());
  return true;
}

async function closeJobQueue() {
  await worker?.close();
  await queue?.close();
  await Promise.all([
    queueConnection?.quit(),
    workerConnection?.quit(),
  ]);
  worker = undefined;
  queue = undefined;
  queueConnection = undefined;
  workerConnection = undefined;
}

module.exports = {
  startJobQueue,
  enqueueRideDispatch,
  enqueueEmail,
  dispatchRide,
  closeJobQueue,
};
