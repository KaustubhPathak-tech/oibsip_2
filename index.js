//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const fname = req.body.first;
  const e_mail = req.body.mail;
  const sub=req.body.subject;
  const lname = req.body.message;
  
  const data = {
    members: [
      {
        email_address: e_mail,
        status: "subscribed",
        merge_fields: { FNAME: fname, LNAME:sub, ADDRESS: lname },
      },
    ],
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us8.api.mailchimp.com/3.0/lists/84c59b071b";
  const options = {
    method: "POST",
    auth: "kaustubh:5679755d1dded537ab3d10e1ac6ec30c-us8",
  };
  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(res.statusCode);
    });
  });

  request.write(jsonData);
  request.end();
});


app.post("/failure",function(req,res){
    res.redirect("/");
})
app.listen(process.env.PORT||3000, function () {
  console.log("server is running on port : 3000");
});

//api key
// b474a8d7276aad0bc31ff93588fc6511-us8

// list id
// 84c59b071b
