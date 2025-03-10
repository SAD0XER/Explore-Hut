const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../middlewares/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middlewares/middleware.js");
const reviewController = require("../controllers/review.js");

// Add Review Route: /listings/:id/reviews - To add review in respective listing.
router.post("/", validateReview, isLoggedIn, wrapAsync(reviewController.addReview));

// Delete Review Route: /listings/:id/reviews/:reviewsId
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;
