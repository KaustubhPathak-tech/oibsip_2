//jshint esversion: 6
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const fname = req.body.first;
  const sub = req.body.subject;
  const e_mail = req.body.mail;
  // const lname = req.body.message;

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
      console.log(res.statusCode);
      console.log(data);
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});
app.listen(process.env.PORT || 3000, function () {
  console.log("server is running on port : 3000");
});



