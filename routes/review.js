const express = require("express");
const routes = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

const reviewController = require("../controller/review");

// review route
routes.post(
  "/",
  validateReview,
  isLoggedIn,
  wrapAsync(reviewController.newReview)
);

// review delete route
routes.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = routes;
