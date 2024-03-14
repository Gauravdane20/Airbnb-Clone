const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.postNewReview = async (req, res) => {
  // console.log(req.params.body);
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  listing.reviews.push(newReview); //reviews:- array reviews from listing.js

  await newReview.save();
  await listing.save();
  req.flash("success", "New Review Created!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //reviews: is an array in lisiting.js
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
