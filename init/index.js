const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");

async function main() {
  await mongoose.connect("mongodb://localhost:27017/Redbus");
}

main()
  .then(() => console.log("connected successfully"))
  .catch((err) => console.log(err));

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "68fa4acbef79df534cc735e0",
    geometry: { type: "Point", coordinates: [0, 0] }, // Default geometry
  }));
  await Listing.insertMany(initData.data);
};

initDB();
