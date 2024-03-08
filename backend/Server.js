const express = require("express");
const forceHttps = require("express-force-https");
const mongoose = require("mongoose");
const http = require("http");
const dotenv = require("dotenv");
const sgMail = require("@sendgrid/mail");
const connectDB = require("./config/db");

const app = express();
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
app.use(forceHttps);
app.use(express.json());

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

// Other routes...

app.post("/send-email", async (req, res) => {
  try {
    const { userData } = req.body;
    let emailBody = "";
    for (const userId in userData) {
      const user = userData[userId];
      emailBody += `User ID: ${userId}\n`;
      emailBody += `Name: ${user.name}\n`;
      emailBody += `Phone Number: ${user.phoneNumber}\n`;
      emailBody += `Email: ${user.email}\n`;
      emailBody += `Hobbies: ${user.hobbies}\n\n`;
    }

    const msg = {
      to: "pk4pushpak@gmail.com",
      from: "officialpjain@gmail.com",
      subject: "Sending with SendGrid is Fun",
      text: emailBody,
    };

    await sgMail.send(msg);
    res.status(200).send({ messageId: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

const port = process.env.PORT || 5000;
http.createServer(app).listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
