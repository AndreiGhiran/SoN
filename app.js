var express = require('express');
const cors = require('cors');
var Twitter = require('twitter');
const url = require('url');
var session = require('express-session');
var path = require('path');
var request = require("request");
var fs = require('fs');

var app = express();
app.use(cors());
app.use(session({ secret: "secret" }));
session.twitterOauth_verifier = "";
session.twitterOauth_token = "";
session.twitterOauth_token_secret = "";
self = this
session.twitterName = "";
session.twitterUser_id = "";
session.twitterScreen_name = "";
session.lastfmUsername = "";

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Client-Security-Token,Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "*");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}


app.post('/index.html', async function(req, res) {
    //console.log(oauth_token)
    requestedSiteAPI = req.header("Site");

    if (requestedSiteAPI == "Twitter") {
        var client = new Twitter({
            consumer_key: fs.readFileSync("../consumer_key.txt"),
            consumer_secret: fs.readFileSync("../consumer_secret.txt"),
            access_token_key: fs.readFileSync("../access_token_key.txt"),
            access_token_secret: fs.readFileSync("../access_token_secret.txt")
        });

        client.post("https://api.twitter.com/oauth/request_token", { oauth_callback: "https://localhost:3000/login.html" }, function(error, response) {
            var string = response.split("&")
            for (var i = 0; i < string.length; i++) {
                string[i] = string[i].split("=")
            }
            console.log(string[2][1])
            if (string[2][1] == "true") {
                session.twitterOauth_token = string[0][1]
                session.twitterOauth_token_secret = string[1][1]
                console.log(session.twitterOauth_token, "++++++", session.twitterOauth_token_secret)
            }
            res.send(session.twitterOauth_token + "&" + session.twitterOauth_token_secret);
            res.end();
        })

    }


    if (requestedSiteAPI == "TwitterOut") {
        session.twitterOauth_verifier = "";
        session.twitterOauth_token = "";
        session.twitterOauth_token_secret = "";
        self = this
        session.twitterName = "";
        session.twitterUser_id = "";
        session.twitterScreen_name = "";
        res.send("done");
        res.end();

    }


    if (requestedSiteAPI == "lastfmIn") {
        session.lastfmUsername = req.header("Username");
        res.send(session.lastfmUsername)
        res.end();
    }

    if (requestedSiteAPI == "lastfmOut") {
        session.lastfmUsername = ""
        res.send("logged out")
        res.end();
    }

    whatToDo = req.header("Why");
    console.log(whatToDo)
    if (whatToDo == "getTwitterUsername") {

        let name = session.twitterScreen_name;
        res.send(name)
        res.end();

    }

    if (whatToDo == "Recommend") {
        var twitterPromise = new Promise((resolve, reject) => {
            if (session.twitterScreen_name) {
                let lista = [];
                var client = new Twitter({
                    consumer_key: fs.readFileSync("../consumer_key.txt"),
                    consumer_secret: fs.readFileSync("../consumer_secret.txt"),
                    access_token_key: session.twitterOauth_token,
                    access_token_secret: session.twitterOauth_token_secret
                });

                client.get("https://api.twitter.com/1.1/account/verify_credentials.json", {}, function(error, response) {
                    if (response["screen_name"])
                        session.twitterName = response["screen_name"]
                    if (session.twitterName) {
                        client.get("friends/list", { count: 200, screen_name: session.twitterScreen_name, skip_status: "true" }, function(error, response) {
                            var aux = JSON.parse(JSON.stringify(response))["users"]
                            aux.forEach(element => {
                                let person = {
                                    "name": element["screen_name"],
                                };
                                lista.push(person);
                                resolve(lista);
                            });
                        });
                    } else {
                        resolve([]);
                    }

                });

            } else {
                resolve([]);
            }
        });
        var lastfmPromise = new Promise((resolve, reject) => {
            let lista = [];
            if (session.lastfmUsername) {
                request.get("https://ws.audioscrobbler.com/2.0/?method=user.getfriends&limit=100&user=" + session.lastfmUsername + "&api_key=ba2f3e9a0bac03f236b958e0ccd68a0d&format=json", function(error, response, body) {
                    if (JSON.parse(body)["friends"]) {
                        var aux = JSON.parse(body)["friends"]["user"]
                        aux.forEach(element => {
                            let person = {
                                "name": element["name"],
                            };
                            lista.push(person);

                        });
                        resolve(lista)
                    } else {
                        resolve([
                            [{ "name": "" }]
                        ]);
                    }

                });
            } else {
                resolve([])
            }
        });
        let twitterList = (await twitterPromise);
        let lastfmList = (await lastfmPromise);

        let inTwitterNotInRest = twitterList.filter(x => !lastfmList.includes(x))

        let finalLastfmPromise = new Promise(async(resolve, reject) => {
            var lista = [];
            if (session.lastfmUsername) {
                await asyncForEach(inTwitterNotInRest, async element => {
                    var prom = new Promise((resolve, reject) => {
                        request.get("https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=" + element["name"] + "&api_key=ba2f3e9a0bac03f236b958e0ccd68a0d&format=json", function(error, response, body) {
                            var aux = JSON.parse(body)["user"]
                            if (aux) {
                                let person = {
                                    "name": aux["name"],
                                    "screen_name": "",
                                    "image": aux["image"]["0"]["#text"],
                                    "site": "Last.fm",
                                    "id_str": aux["registered"]["unixtime"],
                                };
                                resolve(person);
                            } else {
                                resolve(null);
                            }
                        });
                    });
                    let el = (await prom);
                    if (el != null)
                        lista.push(el)
                });
                resolve(lista)


            } else {
                resolve([])
            }
        });



        let inLastfmNotInRest = lastfmList.filter(x => !twitterList.includes(x))
        let finalTwitterPromise = new Promise(async(resolve, reject) => {
            var lista = [];
            var client = new Twitter({
                consumer_key: fs.readFileSync("../consumer_key.txt"),
                consumer_secret: fs.readFileSync("../consumer_secret.txt"),
                access_token_key: session.twitterOauth_token,
                access_token_secret: session.twitterOauth_token_secret
            });
            if (session.twitterScreen_name && inLastfmNotInRest.length > 0) {
                await asyncForEach(inLastfmNotInRest, async element => {
                    console.log(element["name"])
                    var prom = new Promise((resolve, reject) => {
                        client.get("https://api.twitter.com/1.1/users/search.json", { q: element["name"], page: 1, count: 3 }, function(error, response) {
                            //console.log(JSON.parse(JSON.stringify(response)))
                            if (JSON.parse(JSON.stringify(response))[0]) {
                                var aux = JSON.parse(JSON.stringify(response))
                                var sublist = []
                                aux.forEach(element => {
                                    let person = {
                                        "name": element["name"],
                                        "screen_name": element["screen_name"],
                                        "image": element["profile_image_url_https"],
                                        "site": "Twitter",
                                        "id_str": element["id_str"],
                                    };
                                    sublist.push(person);
                                });
                                resolve(sublist);
                            } else {
                                resolve([]);
                            }

                        });
                    });
                    let el = (await prom);
                    if (el != [])
                        el.forEach(subel => {
                            lista.push(subel)
                        });

                });
                console.log(lista)
                resolve(lista)


            } else {
                resolve([])
            }
        });

        var final = (await finalLastfmPromise).concat((await finalTwitterPromise))
            //console.log(final, "final")
        res.send(final);
        res.end()

    }

    //   lastfm
    //   let person = {
    //     "name": element["name"],
    //     "screen_name": "",
    //     "image": element["image"]["0"]["#text"],
    //     "site": "Last.fm",
    //     "id_str": element["registered"]["unixtime"],
    // };

    //   twitter
    //   let person = {
    //     "name": element["name"],
    //     "screen_name": element["screen_name"],
    //     "image": element["profile_image_url_https"],
    //     "site": "Twitter",
    //     "id_str": element["id_str"],
    // };

    if (whatToDo == "FollowTwitterFriend") {
        console.log("+" + session.twitterOauth_token)
        if (session.twitterOauth_token == "" || session.twitterOauth_token_secret == "") {
            res.send("not Logged");
            res.end();
            return;
        }
        let friendId = req.header("friendId");
        var client = new Twitter({
            consumer_key: fs.readFileSync("../consumer_key.txt"),
            consumer_secret: fs.readFileSync("../consumer_secret.txt"),
            access_token_key: session.twitterOauth_token,
            access_token_secret: session.twitterOauth_token_secret
        });

        client.post("https://api.twitter.com/1.1/friendships/create.json" + "?user_id= " + friendId + "&follow=true", {}, function(error, response) {
            res.send(response);
            res.end();
        });

    }


    if (whatToDo == "SearchUser") {
        var site = req.header("SiteToSearch");
        var userName = req.header("userName");

        if (site == "Twitter") {
            var client = new Twitter({
                consumer_key: fs.readFileSync("../consumer_key.txt"),
                consumer_secret: fs.readFileSync("../consumer_secret.txt"),
                access_token_key: fs.readFileSync("../access_token_key.txt"),
                access_token_secret: fs.readFileSync("../access_token_secret.txt")
            });

            client.get("https://api.twitter.com/1.1/users/search.json", { q: userName, page: 1, count: 20 }, function(error, response) {
                res.send(response);
                res.end();
            });
        }
        if (site == "Last.fm") {
            res.send("Last.fm does not support user searching")
        }
    }


});


app.get('/login.html', function(req, res) {
    const query = url.parse(req.url, true).query;
    if (query.oauth_verifier) {
        oauth_verifier = query.oauth_verifier
        oauth_token = query.oauth_token
        request.post("https://api.twitter.com/oauth/access_token" + "?oauth_token=" + oauth_token + "&oauth_verifier=" + oauth_verifier, function(error, response, body) {
            var string = response.body.split("&")
            console.log(string);
            for (var i = 0; i < string.length; i++) {
                string[i] = string[i].split("=")
            }
            session.twitterOauth_token = string[0][1]
            session.twitterOauth_token_secret = string[1][1]
            session.twitterUser_id = string[2][1]
            session.twitterScreen_name = string[3][1]

        });
    }
    res.sendFile(path.join(__dirname + '/public/SoN/login.html'));
});

app.use(express.static('public/SoN'))


module.exports = app;