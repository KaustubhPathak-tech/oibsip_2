//jshint esversion: 6
const dotenv = require("dotenv");
const express = require("express");

const nodemailer = require("nodemailer");
const { google } = require("googleapis");

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

app.post("/", async function posting(req, res) {
  const fname = req.body.first;
  const sub = req.body.subject;
  const e_mail = req.body.mail;
  // const lname = req.body.message;
  try {
    //mailoptions
    const mailoption1 = {
      from: "<kaustubhpathak9@gmail.com>",
      to: e_mail,
      subject: "Thanks from Kaustubh Pathak ",
      text: "Hello from Kaustubh",
      html: `<p> <b>This is Kaustubh Pathak</b> </p><p>Thank you for reach out to me. I'll contact you soon! </p><br/> <p>Have a nice day !</p>`,
    };
    const recieved={
      from:e_mail,
      to:"<kaustubhpathak9@gmail.com>",
      subject:"New User Contacted",
      text:`Hello from ${fname} `,
      html:`<p>Namste Kaustubh, This is ${fname} </p> <br> message: <p> ${sub} </p> `,
    }
    await transporter.sendMail(mailoption1);
    await transporter.sendMail(recieved);
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
      response.on("data", function (data) {});
    });

    request.write(jsonData);
    request.end();
    // res.json({
    //   status: "PENDING",
    //   message: "Verification otp email sent",
    //   data: { e_mail },
    // });
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
