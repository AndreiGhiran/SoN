var express = require('express');
const cors = require('cors');
var Twitter = require('twitter');
const url = require('url');
var session  = require('express-session');
var path = require('path');
var request = require("request");
var fs = require('fs');

var app = express();
app.use(cors());
app.use(session({secret: "secret"}));
oauth_verifier = "";
oauth_token = "";
oauth_token_secret = "";
self = this
name = "" ;
user_id = "";
screen_name ="";

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Authorization, Client-Security-Token,Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "*");
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


app.post('/index.html', function (req, res) {
  //console.log(oauth_token)
  requestedSiteAPI = req.header("Site");
  if(requestedSiteAPI == "Twitter")
  {
    var client = new Twitter({
      consumer_key: fs.readFileSync("../consumer_key.txt"),
      consumer_secret: fs.readFileSync("../consumer_secret.txt"),
      access_token_key: fs.readFileSync("../access_token_key.txt"),
      access_token_secret: fs.readFileSync("../access_token_secret.txt")
    });

    client.post("https://api.twitter.com/oauth/request_token",{oauth_callback: "https://localhost:3000/login.html"},function(error,response){
      var string = response.split("&")
      for(var i=0;i<string.length;i++)
      {
        string[i] = string[i].split("=")
      }
      console.log(string[2][1])
      if(string[2][1] == "true")
      {
          oauth_token = string[0][1]
          oauth_token_secret = string[1][1]
          console.log(oauth_token,"++++++",oauth_token_secret)
      }
      res.send(oauth_token+"&"+oauth_token_secret);
      res.end();
    })
  }


  if(requestedSiteAPI == "TwitterOut")
  {
    oauth_verifier = "";
    oauth_token = "";
    oauth_token_secret = "";
    self = this
    name = "" ;
    user_id = "";
    screen_name ="";
    res.send("done");
    res.end();
  }
  
  whatToDo = req.header("Why");
  if(whatToDo == "TwitterFriends")
  {
    console.log(oauth_token , "   ", oauth_token_secret)
    var client = new Twitter({
      consumer_key: fs.readFileSync("../consumer_key.txt"),
      consumer_secret: fs.readFileSync("../consumer_secret.txt"),
        access_token_key:oauth_token,
        access_token_secret:oauth_token_secret
    });

    client.get("https://api.twitter.com/1.1/account/verify_credentials.json",{},function(error,response){
    if(response["screen_name"])
        name = response["screen_name"]
        if(name)
        {
          client.get("friends/list",{count:200,screen_name:screen_name,skip_status:"true"},function(error,response){
            res.send(response);
          });
        }
        else
        {
          console.log("not logged in");
        }
      });
    
  }
});


app.get('/login.html',function(req,res){
  const query = url.parse(req.url, true).query;
  if(query.oauth_verifier)
  {
      oauth_verifier = query.oauth_verifier
      oauth_token = query.oauth_token
      request.post("https://api.twitter.com/oauth/access_token" + "?oauth_token=" + oauth_token + "&oauth_verifier=" +oauth_verifier, function(error,response,body){
        var string = response.body.split("&")
        console.log(string);
        for(var i=0;i<string.length;i++)
        {
          string[i] = string[i].split("=")
        }
        oauth_token = string[0][1]
        oauth_token_secret = string[1][1]
        user_id = string[2][1]
        screen_name = string[3][1] 
      });
  }
  res.sendFile(path.join(__dirname + '/public/SoN/login.html'));
});

app.use(express.static('public/SoN'))




module.exports = app;



