"use strict";

// Single place that decides which account fields the client may see after auth.
function serializeUser(user) {
  return {
    _id: user._id,
    fullname: user.fullname,
    email: user.email,
    phone: user.phone,
    emailVerified: user.emailVerified,
    twoFactorEnabled: Boolean(user.twoFactor?.enabled),
    rating: user.rating,
    savedPlaces: user.savedPlaces || [],
    emergencyContacts: user.emergencyContacts || [],
  };
}

function serializeCaptain(captain) {
  return {
    _id: captain._id,
    fullname: captain.fullname,
    email: captain.email,
    phone: captain.phone,
    vehicle: captain.vehicle,
    status: captain.status,
    emailVerified: captain.emailVerified,
    twoFactorEnabled: Boolean(captain.twoFactor?.enabled),
    rating: captain.rating,
  };
}

module.exports = { serializeUser, serializeCaptain };
