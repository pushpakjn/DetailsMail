const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("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")
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
dotenv.config();
// MongoDB connection
connectDB();

// Define User Schema
const userSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  email: String,
  hobbies: String,
});

const User = mongoose.model("User", userSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.post("/users", async (req, res) => {
  try {
    const { name, phoneNumber, email, hobbies } = req.body;
    const user = new User({ name, phoneNumber, email, hobbies });
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});
app.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
    console.log("User found:", user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});
app.delete("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});
app.put("/user/:id", async (req, res) => {
  try {
    const { name, phoneNumber, email, hobbies } = req.body;
    console.log(req.body);
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.name = name;
    user.phoneNumber = phoneNumber;
    user.email = email;
    user.hobbies = hobbies;
    await user.save();
    res.json(user);
    console.log("User updated successfully:", user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/send-email", async (req, res) => {
  try {
    const { userData } = req.body;
    console.log("Send mail backend");
    let emailBody = '';
    for (const userId in userData) {
      const user = userData[userId];
      emailBody += `User ID: ${userId}\n`;
      emailBody += `Name: ${user.name}\n`;
      emailBody += `Phone Number: ${user.phoneNumber}\n`;
      emailBody += `Email: ${user.email}\n`;
      emailBody += `Hobbies: ${user.hobbies}\n\n`;
    }

    const msg = {
      to: 'info@redpositive.in', // Change to your recipient
      from: 'officialpjain@gmail.com', // Change to your verified sender
      subject: 'Sending with SendGrid is Fun',
      text: emailBody,
      
    }
    const msg1 = await sgMail.send(msg);
    res.status(200).send({ messageId: "Working" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
