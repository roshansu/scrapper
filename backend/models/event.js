const mongoose = require("mongoose");
const EventSchema = new mongoose.Schema({
  title: String,
  date: String,
  url: String,
  img: String,
});
module.exports = mongoose.model("Event", EventSchema);
