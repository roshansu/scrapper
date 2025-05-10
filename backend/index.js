const express = require("express");
const mongoose = require("mongoose");
const Event = require("./models/event");
const cors = require("cors");
const cron = require('node-cron');
const scrapeEvents = require('./scraper');
const User = require("./models/user");
const sendOTP = require("./utils/email");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

  mongoose.connect( process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err)); 

  scrapeEvents()
  cron.schedule('0 */6 * * *', () => {
    console.log('⏰ Running scheduled scrape...');
    scrapeEvents(); 
  });


app.get("/api/events", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

app.post("/api/sendotp", async (req, res) => {
  const { email} = req.body;

  const exist = await User.findOne({ email });
  if(!exist) {
   try{
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      sendOTP(otp, email);
      const newUser = new User({ email, otp });
      await newUser.save();
      res.json({ status: true, msg: "OTP sent" });
   }catch(err){
      console.log(err);
      res.json({ status: false, msg: "Error" });
   }
  }
  else{
    try{
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      sendOTP(otp, email);
      await User.updateOne({ email }, { otp });
      res.json({ status: true, msg: "OTP sent" });
    }
    catch(err){
      console.log(err);
      res.json({ status: false, msg: "Error" });
    }
  }
});

app.post("/api/login", async (req, res) => { 
  const { email, otp } = req.body;
 try{
    const user = await User.findOne({ email});
    console.log(user.otp, otp)
    if(user.otp === otp){

      await User.updateOne({ email }, { isVerified: true }, { otp: "" });
      res.json({ status: true, msg: "Login successful" });
    }
    else{
      await User.updateOne({ email }, { otp: "" });
      res.json({ status: false, msg: "Invalid OTP" });
    }
 }
 catch(err){
    console.log(err);
    res.json({ status: false, msg: "Error" });
  }

})

app.listen(PORT, () => console.log("Server running on port 5000"));
