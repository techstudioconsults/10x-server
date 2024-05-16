const express = require("express");
const router = express.Router();

const {
  getWishListItems,
  addItemToWishList,
  removeItemFromWishList,
} = require("../controllers/wishList");

const methodNotAllowed = require("../utils/methodNotAllowed");

router.route("/").get(getWishListItems).all(methodNotAllowed);
router.route("/add/:id").post(addItemToWishList).all(methodNotAllowed);
router
  .route("/remove/:id")
  .delete(removeItemFromWishList)
  .all(methodNotAllowed);

module.exports = router;
