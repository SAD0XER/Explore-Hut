const Listing = require("../models/listing.js");

// Index Route Callback to see all Listings.
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({}); //To extract all listing data from database.
    res.render("listings/index.ejs", { listings: allListings }); //Passing all listings to index.ejs with key name as `listings`.
};

// New Form to Create new Listings.
module.exports.newListingForm = (req, res) => {
    res.render("listings/new.ejs");
};

// Show Listing Details.
module.exports.showListingDetails = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    // Handling case if listing does not found.
    if (!listing) {
        req.flash("error", "Requested list does not exist!");
        res.redirect("/");
    }
    res.render("listings/show.ejs", { listing });
};

// Create and Save new Listing in DB.
module.exports.saveNewListing = async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    const { path: url, filename } = req.file;
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing Added!");
    res.redirect("/");
};

// New Form to Edit Listing.
module.exports.editListingForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    // Handling case if editing list does not found.
    if (!listing) {
        req.flash("error", "Requested editing list does not exist!");
        res.redirect("/");
    }

    let previewImage = listing.image.url.replace("/upload", "/upload/c_auto,h_200,w_400");
    res.render("listings/edit.ejs", { listing, previewImage });
};

// Update Edited Listing data in DB.
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    // Checking if file exist or not.
    if (req.file) {
        const { path: url, filename } = req.file;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/${id}`);
};

// Delete Listing.
module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect(`/`);
};

// Filter Listing by Category.
module.exports.filterListing = async (req, res) => {
    const { category } = req.query;
    const filteredListing = await Listing.find({ category });
    res.render("listings/index.ejs", { listings: filteredListing });
};

// Search Route using search box.
module.exports.searchListing = async (req, res) => {
    const { location } = req.query;
    const searchedListing = await Listing.find({
        location: { $regex: location, $options: "i" }
    });

    // Handling if searched listings not found.
    if (searchedListing.length === 0) {
        req.flash("error", "Searched Listing Not Available");
        res.redirect("/");
    }

    res.render("listings/index.ejs", { listings: searchedListing });
};