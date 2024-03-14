const mongoose = require("mongoose");
const bulk = require("./data.js");
const Listing = require("../models/listing.js");
const mbxClient = require("@mapbox/mapbox-sdk");
const mbgeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken =
  "pk.eyJ1IjoiZ2F1cmF2MjAiLCJhIjoiY2x0bzc3NTRnMDcxNTJxcWQ4anV5aDNvdyJ9.Piwm1oUPoQvSMoA9aYrHIw";
const baseClient = mbxClient({ accessToken: mapToken });
const geocodingClient = mbgeocoding(baseClient);

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  // await Listing.deleteMany({}); //It will delete data from collection which was added earlier
  let data = bulk.data;
  let finaldata = data.map((obj) => {
    return { ...obj, owner: "65eeccc03fbf9ea143ba1697" };
  });

  finaldata = finaldata.map(async (obj) => {
    let newdata = [];
    for (let fdata of finaldata) {
      let match = await geocodingClient
        .forwardGeocode({
          query: fdata.location,
          limit: 1,
        })
        .send();
      fdata.geometry = match.body.features[0].geometry;
      fdata.category = ["Rooms"];

      newdata.push(fdata);
    }
  });

  await Listing.insertMany(finaldata);
  console.log("Data was initialized.");
};

initDB();
