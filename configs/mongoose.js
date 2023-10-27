// create a connection between server and DB
const mongoose = require("mongoose");

const URI = process.env.MONGODB_URI || "mongodb://127.0.0.1/habitTracker";
console.log("Mongodb is connected :: Habit Tracker");
mongoose.connect(URI);

const db = mongoose.connection;

db.on("error", console.log.bind(console, "Error at connecting to mongodb"));

db.once("open", function () {
  console.log("Mongodb is connected :: Habit Tracker");
});

module.exports = db;
