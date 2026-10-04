"use strict";

const RefreshSession = require("../models/refreshSession.model");
const { disconnectUser } = require("../socket");

async function applyPasswordReset(Model, userType, payload, password) {
  const expectedVersion = payload.version || 0;
  const versionMatch = expectedVersion === 0
    ? { $or: [{ tokenVersion: 0 }, { tokenVersion: { $exists: false } }] }
    : { tokenVersion: expectedVersion };
  const account = await Model.findOneAndUpdate(
    { _id: payload.id, ...versionMatch },
    {
      $set: { password: await Model.hashPassword(password) },
      $inc: { tokenVersion: 1 },
    },
    { new: true, runValidators: true },
  ).select("_id");

  if (!account) return false;
  await RefreshSession.deleteMany({ userId: account._id, userType });
  disconnectUser(userType, account._id);
  return true;
}

module.exports = { applyPasswordReset };
