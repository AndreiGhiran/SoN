window.onload = function() {
    if (window.location.href.includes("oauth_verifier") && cookies.includes("TwitterLogIn=true")) {
        window.open("https://localhost:3000/login.html", "_self")
    }
    if (cookies.includes("TwitterLogIn=true") && cookies.includes("twitterUsername=;")) {
        getTwitterUsername();
    }
    this.console.log(this.document.cookie + "+++");
};

function getTwitterUsername() {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.cookie = "twitterUsername=" + this.response;
        }
    };
    xhttp.open("POST", "https://localhost:3000/index.html", true);
    xhttp.setRequestHeader("Why", "getTwitterUsername");
    xhttp.send();
}

function TwitterLogIn() {

    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.response);
            var res = this.response.split("&");
            document.cookie = "TwitterLogIn=true";
            window.open("https://api.twitter.com/oauth/authenticate" + "?oauth_token=" + res[0], "_self");
        }
    };
    xhttp.open("POST", "https://localhost:3000/index.html", true);
    xhttp.setRequestHeader("Site", "Twitter");
    xhttp.send();
}

function TwitterLogOut() {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.cookie = "TwitterLogIn=false";
            document.cookie = "twitterUsername=";
            window.open("https://localhost:3000/login.html", "_self");
        }
    };
    xhttp.open("POST", "https://localhost:3000/index.html", true);
    xhttp.setRequestHeader("Site", "TwitterOut");
    xhttp.send();
}

function lastfmIn() {
    var lastfmUsername = document.getElementById("lastfmUsername").value;

    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.cookie = "lastfmLogged=true";
            document.cookie = "lastfmUsername=" + this.response;
            location.reload(true);
        }
    };
    xhttp.open("POST", "https://localhost:3000/index.html", true);
    xhttp.setRequestHeader("Site", "lastfmIn");
    xhttp.setRequestHeader("Username", lastfmUsername);
    xhttp.send();
}

function lastfmOut() {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.cookie = "lastfmLogged=false";
            location.reload(true);
        }
    };
    xhttp.open("POST", "https://localhost:3000/index.html", true);
    xhttp.setRequestHeader("Site", "lastfmOut");
    xhttp.send();
}