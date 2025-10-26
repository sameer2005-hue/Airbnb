const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.newReview = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Review Added");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  // pulls remove the reviewId from the reviews in the listings
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  // now remove the review document from the reviews
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}`);
};
