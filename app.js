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
session.githubClientId = fs.readFileSync("../github_clientID.txt");
session.githubClientSecret = fs.readFileSync("../github_client_secret.txt");
session.githubAccessToken = ""
session.githubUsername = ""
session.twitterOauth_verifier = "";
session.twitterOauth_token = "";
session.twitterOauth_token_secret = "";
self = this
session.twitterName = "";
session.twitterUser_id = "";
session.twitterScreen_name = "";
session.lastfmUsername = "";
session.twitterFriendsList = [];
session.lastfmFriendsList = [];
session.githubFriendsList = [];

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
            //console.log(string[2][1])
            if (string[2][1] == "true") {
                session.twitterOauth_token = string[0][1]
                session.twitterOauth_token_secret = string[1][1]
                    //console.log(session.twitterOauth_token, "++++++", session.twitterOauth_token_secret)
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
        session.twitterFriendsList = [];
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
        session.lastfmFriendsList = [];
        res.send("logged out")
        res.end();
    }

    whatToDo = req.header("Why");

    if (whatToDo == "githubIn") {
        res.send(session.githubClientId)
    }

    if (whatToDo == "githubOut") {
        session.githubAccessToken = "";
        res.send("logged out")
    }

    if (whatToDo == "getGithubUsername") {

        let name = session.githubUsername;
        res.send(name)
        res.end();
    }
    console.log(whatToDo)
    if (whatToDo == "getTwitterUsername") {

        let name = session.twitterScreen_name;
        res.send(name)
        res.end();

    }

    if (whatToDo == "Recommend") {

        if ([session.twitterScreen_name, session.lastfmUsername, session.githubUsername].filter(el => el != "").length > 1) {
            let twitterList = (await getTwitterFriends(session.twitterScreen_name))[0];

            let lastfmList = (await getLastfmFriends(session.lastfmUsername))[0];

            let githubList = (await getGithubFriends(session.githubUsername))[0];

            if (JSON.stringify(twitterList) !== JSON.stringify(session.twitterFriendsList) || JSON.stringify(lastfmList) !== JSON.stringify(session.lastfmFriendsList) ||
                JSON.stringify(githubList) !== JSON.stringify(session.githubFriendsList)) {

                session.twitterFriendsList = twitterList;
                session.lastfmFriendsList = lastfmList;
                session.githubFriendsList = githubList;

                let peopleNotInLastFm = (session.twitterFriendsList.concat(session.githubFriendsList)).filter(x => !session.lastfmFriendsList.includes(x));

                let peopleNotInTwitter = (session.lastfmFriendsList.concat(session.githubFriendsList)).filter(x => !session.twitterFriendsList.includes(x));

                let peopleNotInGithub = (session.lastfmFriendsList.concat(session.twitterFriendsList)).filter(x => !session.githubFriendsList.includes(x));

                console.log(peopleNotInGithub)

                let listFoundPeopleNotInLastfm = searchPeopleNotInLastfm(res, peopleNotInLastFm);

                let listFoundPeopleNotInTwitter = searchPeopleNotInTwitter(res, peopleNotInTwitter);

                let listFoundPopleNotInGithub = searchPeopleNotInGithub(res, peopleNotInGithub);

                var final = (await listFoundPeopleNotInLastfm).concat((await listFoundPeopleNotInTwitter)).concat((await listFoundPopleNotInGithub));

                console.log("done with request")
                res.end()
            } else {
                res.write("no changes")
                console.log("done with request")
                res.end()
            }
            //console.log(final, "final")
            //res.send(final);

        } else {
            res.send("Not enough log ins")
            res.end();
        }

    }

    if (whatToDo == "FollowTwitterFriend") {
        //console.log("+" + session.twitterOauth_token)
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


    if (whatToDo == "FollowGithubFriend") {
        //console.log("+" + session.twitterOauth_token)
        if (session.githubAccessToken == "") {
            res.send("not Logged");
            res.end();
        }
        let friendName = req.header("friendName");

        client.put({ url: "https://api.github.com/user/following/" + friendName, headers: { Authorization: "token " + session.githubAccessToken, "User-Agent": "SoN" } }, function(error, response) {
            res.send(response);
            res.end();
        });

    }


    if (whatToDo == "infoForGraph") {
        console.log([session.twitterScreen_name, session.lastfmUsername, session.githubUsername])
        if ([session.twitterScreen_name, session.lastfmUsername, session.githubUsername].filter(el => el != "").length == 0) {
            res.send("not enough login");
            res.end();
        } else {
            let twitterList = (await getTwitterFriends(session.twitterScreen_name));

            let lastfmList = (await getLastfmFriends(session.lastfmUsername));

            let githubList = (await getGithubFriends(session.githubUsername));

            res.send([twitterList, lastfmList, githubList]);
            res.end();
        }

    }

    if (whatToDo == "allOut") {
        session.twitterOauth_verifier = "";
        session.twitterOauth_token = "";
        session.twitterOauth_token_secret = "";
        session.twitterName = "";
        session.twitterUser_id = "";
        session.twitterScreen_name = "";
        session.twitterFriendsList = [];
        session.lastfmUsername = ""
        session.lastfmFriendsList = [];
        session.githubFriendsList = [];
        session.githubAccessToken = "";
        session.githubUsername = "";
        res.send("logged out");
        res.end();
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
                if (JSON.parse(JSON.stringify(response))[0]) {
                    var usersFound = JSON.parse(JSON.stringify(response))
                    var sublist = []
                    usersFound.forEach(element => {
                        let person = {
                            "name": element["name"],
                            "screen_name": element["screen_name"],
                            "image": element["profile_image_url_https"],
                            "site": "Twitter",
                            "id_str": element["id_str"],
                        };
                        sublist.push(person);
                    });
                    res.send(sublist);
                    res.end();
                }
            });
        }
        if (site == "Last.fm") {
            var url = `http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${userName}&api_key=ba2f3e9a0bac03f236b958e0ccd68a0d&format=json`;
            request.get(url, function(error, response, userInfo) {
                if (JSON.parse(userInfo)["user"]) {
                    userInfo = JSON.parse(userInfo)["user"];
                    let person = {
                        "name": userInfo["name"],
                        "url": userInfo["url"],
                        "screen_name": userInfo["realname"],
                        "image": userInfo["image"]["0"]["#text"],
                        "site": "Last.fm",
                        "id_str": userInfo["registered"]["unixtime"],
                    };
                    console.log(person)
                    res.send(person);
                } else {
                    console.log("else");
                    res.send("N");
                }
            });
        }
        if (site == "Github") {
            request.get({ url: "https://api.github.com/search/users?q=" + userName, headers: { "User-Agent": "SoN", } }, function(error, response, body) {
                var users = JSON.parse(body)["items"]
                if (JSON.parse(body)["items"]) {
                    var sublist = []
                    users.forEach(user => {
                        let person = {
                            "name": user["login"],
                            "screen_name": "",
                            "image": user["avatar_url"],
                            "site": "Github",
                            "id_str": user["id"],
                        };
                        sublist.push(person);
                    });
                    res.send(sublist);
                    res.end()
                }

            });
        }
        if (site == "All") {
            var lista = []
            var twitterSearchPromise = new Promise((resolve, reject) => {
                var client = new Twitter({
                    consumer_key: fs.readFileSync("../consumer_key.txt"),
                    consumer_secret: fs.readFileSync("../consumer_secret.txt"),
                    access_token_key: fs.readFileSync("../access_token_key.txt"),
                    access_token_secret: fs.readFileSync("../access_token_secret.txt")
                });

                client.get("https://api.twitter.com/1.1/users/search.json", { q: userName, page: 1, count: 20 }, function(error, response) {
                    var userInfo = JSON.parse(JSON.stringify(response))
                    let personList = [];
                    if (userInfo) {
                        userInfo.forEach(user => {
                            let person = {
                                "name": user["name"],
                                "screen_name": user["screen_name"],
                                "image": user["profile_image_url_https"],
                                "site": "Twitter",
                                "id_str": user["id_str"],
                            };
                            personList.push(person);
                        });
                        resolve(personList)
                    } else {
                        resolve([]);
                    }
                });
            });

            var githubSearchPromise = new Promise((resolve, reject) => {
                request.get({ url: "https://api.github.com/search/users?q=" + userName + "&client_id=" + session.githubClientId + "&client_secret=" + session.githubClientSecret, headers: { "User-Agent": "SoN" } }, function(error, response, body) {
                    let personList = [];
                    if (JSON.parse(body)["items"]) {
                        var users = JSON.parse(body)["items"]
                        users.forEach(user => {
                            let person = {
                                "name": user["login"],
                                "screen_name": "",
                                "image": user["avatar_url"],
                                "site": "Github",
                                "id_str": user["id"],
                            };
                            personList.push(person)
                        });
                        resolve(personList)
                    } else {
                        resolve([])
                    }

                });
            });

            var lastfmSearchPromise = new Promise((resolve, reject) => {
                var url = `http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${userName}&api_key=ba2f3e9a0bac03f236b958e0ccd68a0d&format=json`;
                let personList = [];
                request.get(url, function(error, response, userInfo) {
                    if (JSON.parse(userInfo)["user"]) {
                        userInfo = JSON.parse(userInfo)["user"];
                        console.log(userInfo["name"]);
                        let person = {
                            "name": userInfo["name"],
                            "url": userInfo["url"],
                            "screen_name": userInfo["realname"],
                            "image": userInfo["image"]["0"]["#text"],
                            "site": "Last.fm",
                            "id_str": userInfo["registered"]["unixtime"],
                        };
                        personList.push(person)
                    }
                    // console.log(personList);
                    resolve(personList);
                })
            });

            lista = lista.concat((await twitterSearchPromise)).concat((await githubSearchPromise)).concat((await lastfmSearchPromise))
            res.send(lista)
            res.end();
        }
    }


});


app.get('/login.html', function(req, res) {
    const query = url.parse(req.url, true).query;
    if (query.code) {
        var code = query.code;
        request.post("https://github.com/login/oauth/access_token?client_id=" + session.githubClientId + "&client_secret=" + session.githubClientSecret + "&code=" + code, function(error, response, body) {
            if (body.includes("access_token=")) {
                let access_token = body.split("&")[0].split("=")[1]
                session.githubAccessToken = access_token;
                request.get({ url: "https://api.github.com/user", headers: { Authorization: "token " + session.githubAccessToken, "User-Agent": "SoN" } }, function(error, response, body) {
                    let user = JSON.parse(body);
                    session.githubUsername = user["login"];
                });
            }
        });
    }

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



async function getTwitterFriends(name) {
    var twitterPromise = new Promise((resolve, reject) => {
        if (name) {
            let lista = [];
            let listaImg = [];
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
                    client.get("friends/list", { count: 200, screen_name: name, skip_status: "true" }, function(error, response) {
                        if (JSON.parse(JSON.stringify(response))["users"]) {
                            var usersFound = JSON.parse(JSON.stringify(response))["users"]
                            usersFound.forEach(element => {
                                let person = {
                                    "name": element["screen_name"],
                                };
                                lista.push(person);
                                listaImg.push({ "img": element["profile_image_url_https"] })

                            });
                            resolve([lista, listaImg]);
                        } else
                            resolve[[], []]

                    });
                } else {
                    resolve([
                        [],
                        []
                    ]);
                }

            });

        } else {
            resolve([
                [],
                []
            ]);
        }
    });

    let twitterList = (await twitterPromise);
    return twitterList;
}



async function getLastfmFriends(name) {
    var lastfmPromise = new Promise((resolve, reject) => {
        let lista = [];
        let listaImg = [];
        if (name) {
            request.get("https://ws.audioscrobbler.com/2.0/?method=user.getfriends&limit=100&user=" + name + "&api_key=ba2f3e9a0bac03f236b958e0ccd68a0d&format=json", function(error, response, body) {
                if (JSON.parse(body)["friends"]) {
                    var usersFound = JSON.parse(body)["friends"]["user"]
                    usersFound.forEach(element => {
                        let person = {
                            "name": element["name"],
                        };
                        lista.push(person);
                        listaImg.push({ "img": element["image"]["0"]["#text"] })
                    });
                    resolve([lista, listaImg]);
                } else {
                    resolve([
                        [],
                        []
                    ]);
                }

            });
        } else {
            resolve([
                [],
                []
            ]);
        }
    });

    let lastfmList = (await lastfmPromise);
    return lastfmList;
}



async function searchPeopleNotInLastfm(res, peopleNotInLastfm) {
    let finalLastfmPromise = new Promise(async(resolve, reject) => {
        var lista = [];
        if (session.lastfmUsername && peopleNotInLastfm.length > 0) {
            await asyncForEach(peopleNotInLastfm, async element => {
                var prom = new Promise((resolve, reject) => {
                    request.get("https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=" + element["name"] + "&api_key=ba2f3e9a0bac03f236b958e0ccd68a0d&format=json", function(error, response, body) {
                        var userInfo = JSON.parse(body)["user"]
                        if (userInfo) {
                            let person = {
                                "name": userInfo["name"],
                                "screen_name": "",
                                "image": userInfo["image"]["0"]["#text"],
                                "site": "Last.fm",
                                "id_str": userInfo["registered"]["unixtime"],
                            };
                            res.write(JSON.stringify(person))
                            resolve(person);
                        } else {
                            resolve(null);
                        }
                    });
                });
                let awaitingVariable = (await prom);
                if (awaitingVariable != null)
                    lista.push(awaitingVariable)
            });
            resolve(lista)


        } else {
            resolve([])
        }
    });

    let listaCompleta = (await finalLastfmPromise);
    return listaCompleta;
}



async function searchPeopleNotInTwitter(res, peopleNotInTwitter) {
    let finalTwitterPromise = new Promise(async(resolve, reject) => {
        var lista = [];
        var client = new Twitter({
            consumer_key: fs.readFileSync("../consumer_key.txt"),
            consumer_secret: fs.readFileSync("../consumer_secret.txt"),
            access_token_key: session.twitterOauth_token,
            access_token_secret: session.twitterOauth_token_secret
        });
        if (session.twitterScreen_name && peopleNotInTwitter.length > 0) {
            await asyncForEach(peopleNotInTwitter, async element => {
                //console.log(element["name"])
                var prom = new Promise((resolve, reject) => {
                    client.get("https://api.twitter.com/1.1/users/search.json", { q: element["name"], page: 1, count: 5 }, function(error, response) {
                        //console.log(JSON.parse(JSON.stringify(response)))
                        if (JSON.parse(JSON.stringify(response))[0]) {
                            var usersFound = JSON.parse(JSON.stringify(response))
                            var sublist = []
                            usersFound.forEach(element => {
                                let person = {
                                    "name": element["name"],
                                    "screen_name": element["screen_name"],
                                    "image": element["profile_image_url_https"],
                                    "site": "Twitter",
                                    "id_str": element["id_str"],
                                };
                                res.write(JSON.stringify(person))
                                sublist.push(person);
                            });
                            resolve(sublist);
                        } else {
                            resolve([]);
                        }

                    });
                });
                let awaitingVariable = (await prom);
                if (awaitingVariable != [])
                    awaitingVariable.forEach(subel => {
                        lista.push(subel)
                    });

            });
            //console.log(lista)
            resolve(lista)


        } else {
            resolve([])
        }
    });


    let listaCompleta = (await finalTwitterPromise);
    return listaCompleta;
}


async function getGithubFriends(name) {
    var githubPromise = new Promise((resolve, reject) => {
        let lista = [];
        let listaImg = [];
        if (name) {
            request.get({ url: "https://api.github.com/user/following" + "?client_id=" + session.githubClientId + "&client_secret=" + session.githubClientSecret, headers: { Authorization: "token " + session.githubAccessToken, "User-Agent": "SoN" } }, function(error, response, body) {

                if (JSON.parse(body)) {
                    var usersFound = JSON.parse(body)
                    usersFound.forEach(element => {
                        let person = {
                            "name": element["login"],
                        };
                        lista.push(person);
                        listaImg.push({ "img": element["avatar_url"] })

                    });
                    resolve([lista, listaImg]);
                } else {
                    resolve([
                        [],
                        []
                    ]);
                }

            });
        } else {
            resolve([
                [],
                []
            ]);
        }
    });

    let githubList = (await githubPromise);
    return githubList;
}



async function searchPeopleNotInGithub(res, peopleNotInGithub) {
    let finalGithubPromise = new Promise(async(resolve, reject) => {
        var lista = [];
        if (session.githubUsername && peopleNotInGithub.length > 0) {
            await asyncForEach(peopleNotInGithub, async element => {
                var prom = new Promise((resolve, reject) => {
                    request.get({ url: "https://api.github.com/search/users?q=" + element["name"] + "&client_id=" + session.githubClientId + "&client_secret=" + session.githubClientSecret, headers: { "User-Agent": "SoN", } }, function(error, response, body) {
                        var users = JSON.parse(body)["items"]
                        if (JSON.parse(body)["items"]) {
                            var sublist = []
                            users.forEach(user => {
                                let person = {
                                    "name": user["login"],
                                    "screen_name": "",
                                    "image": user["avatar_url"],
                                    "site": "Github",
                                    "id_str": user["id"],
                                };
                                res.write(JSON.stringify(person))
                                sublist.push(person);
                            });
                            resolve(sublist);
                        } else {
                            resolve(null);
                        }

                    });

                });
                let awaitingVariable = (await prom);
                if (awaitingVariable != null)
                    lista.push(awaitingVariable)
            });
            resolve(lista)


        } else {
            resolve([])
        }
    });

    let listaCompleta = (await finalGithubPromise);
    return listaCompleta;
}


app.use(express.static('public/SoN'))


module.exports = app;