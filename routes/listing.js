const express = require("express");
const router = express.Router();
const wrapAsync = require("../middlewares/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middlewares/middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer"); // pkg to parse 'multipart/form-data', used to uploading files.
const { storage } = require("../config/cloudConfig.js");
const upload = multer({ storage }); // creates destination folder to store uploaded files.

// Search Route using search box.
router.get("/search", wrapAsync(listingController.searchListing));

// Filter Route using Category.
router.get("/filter", wrapAsync(listingController.filterListing));

// New Listing Form Route: /new - To create a new listing.
router.get("/new", isLoggedIn, listingController.newListingForm);

// New form Route: /listings/:id/edit - To edit listing.
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListingForm));

router
    .route("/")
    .get(wrapAsync(listingController.index)) // Index Route: "/" - To see all Listings.
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.saveNewListing),
    ); // Create Route: "/" - To create a new listing in DB.

router
    .route("/:id")
    .get(wrapAsync(listingController.showListingDetails)) // Show Route: "/:id" - To see a single list.
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing),
    ) // Update Route: "/:id" - To update data in DB.
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing)); // Delete Route: "/:id" - To delete listing from DB.
module.exports = router;
