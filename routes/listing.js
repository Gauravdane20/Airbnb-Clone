const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../contollers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.get("/filter", wrapAsync(listingController.filter));

//index, create route
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

//2.New Route  (To Add New Listing)
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show,update, delete route
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//3.Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;

//==========Sample Data Inserting======

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa.",S
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa.",
//     counntry: "India.",
//   });
//   await sampleListing.save();
//   console.log("Sample was Saved");
//   res.send("Successfull testing.");
// });
