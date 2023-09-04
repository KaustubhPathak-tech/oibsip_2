//jshint esversion: 6
const dotenv = require("dotenv");
const express = require("express");
const em = require('./em'); // Import the data module

const nodemailer=require("nodemailer");
const {google}=require("googleapis")


dotenv.config();
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { log } = require("console");
const app = express();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;


const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const accessToken = oAuth2Client.getAccessToken();
const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    type: "OAuth2",
    user: "kaustubhpathak9@gmail.com",
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN,
    accessToken: accessToken,
  },
});



// app.use(express.static("public"));
app.use(express.static(__dirname + "/public/"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});




app.post("/", function posting(req, res) {
  const fname = req.body.first;
  const sub = req.body.subject;
  const e_mail = req.body.mail;
  // const lname = req.body.message;

  em.setEmail(e_mail);
 
  // console.log(email);
  const data = {
    members: [
      {
        email_address: e_mail,
        status: "subscribed",
        merge_fields: { FNAME: fname, LNAME: sub },
      },
    ],
  };
  const jsonData = JSON.stringify(data);
  const url = process.env.URL;
  const options = {
    method: "POST",
    auth: process.env.AUTH,
  };
  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      
    });

    
  });

  request.write(jsonData);
  request.end();
  
});
console.log(em.getEmail());
app.post("/sendmail", async function sendVerificationEmail(req, res) {
  console.log("Mail sending initiated !");
  var email = em.getEmail();
  console.log(email);
  try {
    //mailoptions
    const mailoptions = {
      from: "<kaustubhpathak9@gmail.com>",
      to:email,
      subject: "Verify Your Account",
      text: "Hello from Kaustubh",
      html: `<p>Enter <b>This is Kaustubh Pathak</b> in the website to verify your email address and complete signup!</p><p>This code <b>expires in 1 hour</b>.</p><br/><p><a href="https://stack-over-flow-clone-2023.vercel.app/" style="text-decoration:"none">&copy; Stack Over Flow Clone 2023</a></p>`,
    };
    await transporter.sendMail(mailoptions);
    res.json({
      status: "PENDING",
      message: "Verification otp email sent",
      data: { userId: _id, email },
    });
  } catch (error) {
    res.status(500).send("Enter valid Email");
  }
});




app.post("/failure", function (req, res) {
  res.redirect("/");
});
app.listen(process.env.PORT || 3000, function () {
  console.log("server is running on port : 3000");
});
