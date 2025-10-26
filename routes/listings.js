const express = require("express");
const routes = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");

const listingController = require("../controller/listings");

const multer = require("multer");
const { storage } = require("../coludConfig");
const upload = multer({ storage });

routes
  .route("/")
  .get(listingController.index) // index route
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.create)
  ); // new listing create

// new route -> render new form to create new listing
routes.get("/new", isLoggedIn, listingController.new);

routes
  .route("/:id")
  .get(wrapAsync(listingController.show)) // show route
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.update)
  ) // update route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.delete)); // delete route

routes.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit)); // render edit page

// Index route
// routes.get("/", listingController.index);

// create route -> to create new listing in db
// routes.post("/", validateListing, wrapAsync(listingController.create));

// show route -> to show details of a particular listing
// routes.get("/:id", wrapAsync(listingController.show));

// edit route -> to render edit form

// update route -> to update particular listing in db
// routes.put(
//   "/:id",
//   validateListing,
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.update)
// );

// delete route -> to delete particular listing from db
// routes.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.delete));

module.exports = routes;
