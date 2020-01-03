const url = require('url');
const http = require('http');

const app = http.createServer((request, response) => {


    // username needs to be parced from the url, you can use the default username "rj" for a lot of friends
    const query = url.parse(request.url, true).query;
    username = query.username;

    const url_r = "http://ws.audioscrobbler.com/2.0/?method=user.getfriends&limit=100&user=" + username + "&api_key=19123fc1a09e36afb6f240a38a64a2b3&format=json";
    http.get(url_r, res => {
        res.setEncoding("utf8");
        let body = "";
        res.on("data", data => {
            body += data;
        });
        res.on("end", () => {
            body = JSON.parse(body);
            console.log(body);
            var count = body.friends["@attr"].total;
            console.log(count);
            let friends = [];
            for (var i = 0; i < count; i++) {
                console.log(i);
                friends.push(body.friends.user[i].name);
            }
            console.log(friends)
            response.writeHead(200, { "Content-Type": "text/html" });
            response.write("<ul>Friends");
            for (var i = 0; i < count; i++)
                response.write(`<li>${friends[i]}</li>`);
            response.write("</ul>");
            response.end();
        });
    });

});

app.listen(3000);