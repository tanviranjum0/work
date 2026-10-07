"use strict";

const { Queue, Worker } = require("bullmq");
const IORedis = require("ioredis");
const { getAddressCoordinate, getCaptainsInTheRadius } = require("./map.service");
const { sendMail } = require("./mail.service");
const rideModel = require("../models/ride.model");
const { sendToAccount } = require("../socket");
const { expireStaleRequests, REQUEST_TTL_MS, distanceKm } = require("./ride.service");
const logger = require("../utils/logger");

const QUEUE_NAME = "rideback-background";
let queue;
let worker;
let queueConnection;
let workerConnection;

// Offer schedule: nearby drivers first, then a wider net while the rider waits.
const DISPATCH_RADII_KM = [4, 8, 15];
const DISPATCH_RETRY_MS = 30 * 1000;

async function dispatchRide(rideId, attempt = 0) {
  const ride = await rideModel.findById(rideId).populate("user", "fullname rating");
  if (!ride || ride.status !== "pending") return;

  const origin = ride.pickupCoordinates?.ltd != null
    ? ride.pickupCoordinates
    : await getAddressCoordinate(ride.pickup);
  const radius = DISPATCH_RADII_KM[Math.min(attempt, DISPATCH_RADII_KM.length - 1)];
  const drivers = await getCaptainsInTheRadius(origin.ltd, origin.lng, radius, ride.vehicle);

  // Riders aren't contactable until a captain accepts (POST /ride/confirm returns their
  // phone then), so the broadcast omits it.
  const expiresAt = new Date(ride.createdAt.getTime() + REQUEST_TTL_MS);
  for (const driver of drivers) {
    const here = driver.location?.coordinates?.length === 2
      ? { ltd: driver.location.coordinates[1], lng: driver.location.coordinates[0] }
      : null;
    sendToAccount("captain", driver._id, "new-ride", {
      _id: ride._id,
      pickup: ride.pickup,
      destination: ride.destination,
      pickupCoordinates: ride.pickupCoordinates,
      destinationCoordinates: ride.destinationCoordinates,
      fare: ride.fare,
      vehicle: ride.vehicle,
      distance: ride.distance,
      duration: ride.duration,
      status: ride.status,
      expiresAt,
      pickupDistanceKm: here ? Math.round(distanceKm(here, origin) * 10) / 10 : undefined,
      user: { fullname: ride.user?.fullname, rating: ride.user?.rating },
    });
  }

  if (attempt < DISPATCH_RADII_KM.length - 1) {
    setTimeout(() => {
      dispatchRide(rideId, attempt + 1).catch((error) =>
        logger.warn("Ride re-dispatch failed", { rideId: String(rideId), name: error.name }),
      );
    }, DISPATCH_RETRY_MS).unref();
  }
  if (attempt === 0) scheduleExpiry(ride);
}

// If nobody accepts, close the request and tell the rider rather than leaving it pending.
function scheduleExpiry(ride) {
  const wait = Math.max(0, ride.createdAt.getTime() + REQUEST_TTL_MS - Date.now()) + 1000;
  setTimeout(async () => {
    try {
      const expired = await expireStaleRequests({ _id: ride._id });
      if (expired.length) {
        sendToAccount("user", ride.user._id, "ride-cancelled", {
          rideId: ride._id,
          cancelledBy: "system",
          reason: "no_drivers",
        });
      }
    } catch (error) {
      logger.warn("Ride expiry failed", { rideId: String(ride._id), name: error.name });
    }
  }, wait).unref();
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
