const express = require("express");
const { getUsers, getUser, deleteUser } = require("../controllers/user");
const User = require("../models/User");
const advancedResult = require("../middleware/advancedResult");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(advancedResult(User), authorize("admin", "super admin"), getUsers);

router
  .route("/:id")
  .get(authorize("admin", "super admin"), getUser)
  .delete(protect, authorize("admin", "user", "super admin"), deleteUser);

module.exports = router;
