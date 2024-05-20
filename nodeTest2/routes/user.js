const express = require("express");
const {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateNewUser,
} = require("../controllers/allUser");
// const handleGetUserById = require("../controllers/getUserById");

const router = express.Router();
router
  .route("/:id")
  .get(handleGetUserById)
  .patch(handleUpdateUserById)
  .delete(handleDeleteUserById);
router.route("/").get(handleGetAllUsers).post(handleCreateNewUser);
module.exports = router;
