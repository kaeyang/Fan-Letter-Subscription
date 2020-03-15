//node modules//
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
//Allows us to use local static files like CSS and Images//
app.use(express.static("public"));
//Allows us to use bodyParser//
app.use(bodyParser.urlencoded({
  extended: true
}));

//This GET Request would render our homepage//
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

//POST Request when the user has inout information//
app.post("/", function(req, res) {
  const first = req.body.firstName;
  const last = req.body.lastName;
  const mail = req.body.email;

  //JS data Object//
  const data = {
    members: [{
      email_address: mail,
      status: "subscribed",
      merge_fields: {
        FNAME: first,
        LNAME: last,
      }
    }]
  };

  //JS Object to JSON//
  const dataJSON = JSON.stringify(data);

  //HTTPS REQUEST POST//
  const url = "https://usX.api.mailchimp.com/3.0/lists/list_id";
  const options = {
    method: "POST",
    auth: "kevin1:my_API_key"
  };

  const request = https.request(url, options, function(response) {

    //Success or Failure//
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    };

    res.on(data, function(data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(dataJSON);
  request.end();
});

//Failure Path//
app.post("/failure", function(req, res){
 res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Deported");
});

//API_key and list_id have been put in as placeholders for security reasons//
