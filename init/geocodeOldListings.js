if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const mongoose = require("mongoose");
const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

async function geocodeOldListings() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/Redbus");

    console.log("Connected to database. Starting geocoding for old listings...");

    // Find listings with default [0,0] coordinates
    const listingsWithoutGeometry = await Listing.find({
      "geometry.coordinates": [0, 0]
    });

    console.log(`Found ${listingsWithoutGeometry.length} listings without geometry.`);

    for (const listing of listingsWithoutGeometry) {
      try {
        console.log(`Geocoding listing: ${listing.title} at ${listing.location}`);

        // Geocode the location
        const response = await geocodingClient
          .forwardGeocode({
            query: listing.location,
            limit: 1,
          })
          .send();

        if (response.body.features.length > 0) {
          const geometry = response.body.features[0].geometry;

          // Update the listing with geometry
          await Listing.findByIdAndUpdate(listing._id, { geometry });

          console.log(`Updated listing ${listing.title} with geometry: ${geometry.coordinates}`);
        } else {
          console.log(`No geocoding results for listing ${listing.title} at ${listing.location}`);
        }
      } catch (error) {
        console.error(`Error geocoding listing ${listing.title}:`, error.message);
      }
    }

    console.log("Geocoding process completed.");
  } catch (error) {
    console.error("Error in geocoding script:", error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

// Run the function
geocodeOldListings();
