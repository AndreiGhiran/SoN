function addTwitterFriend(person_id) { // console.log(person_id);

    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.response);
        }
    };
    xhttp.open("POST", "https://localhost:3000/index.html", true);
    xhttp.setRequestHeader("Why", "FollowTwitterFriend");
    xhttp.setRequestHeader("friendId", person_id);
    xhttp.send();
}

function searchUsers() {
    var UserName = document.getElementById("UserName").value;
    var selectorElement = document.getElementById("listSelect");
    var site = selectorElement.options[selectorElement.selectedIndex].innerText;

    console.log(UserName + "  " + site);

    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) { // console.log(this.response)
            if (site == "Twitter") {
                showSearchResponse(this.response);
            }
            if (site == "Last.fm") {
                showSearchResponseLast(this.response);
            }
            if (site == "Github") {
                showSearchResponseGithub(this.response);
            }
        }
    };
    xhttp.open("POST", "https://localhost:3000/index.html", true);
    xhttp.setRequestHeader("Why", "SearchUser");
    xhttp.setRequestHeader("SiteToSearch", site);
    xhttp.setRequestHeader("userName", UserName);
    xhttp.send();
}

function showSearchResponseGithub(response) {
    const container = document.getElementsByClassName("userList")[0];
    container.innerHTML = "";
    var res = JSON.parse(response);
    res.forEach(user => {
        var listElement = document.createElement("li");
        var userImage = document.createElement("img");
        userImage.setAttribute("src", user["avatar_url"]);
        userImage.setAttribute("height", "50px");
        userImage.setAttribute("width", "50px");
        userImage.setAttribute("style", "border-radius:50%;");

        var userName = document.createElement("P");
        userName.innerText = user["login"];
        var siteName = document.createElement("P");
        siteName.innerText = "Github";
        siteName.setAttribute("style", "color:#404448;");

        listElement.appendChild(siteName);
        listElement.appendChild(document.createElement("hr"));
        listElement.appendChild(userImage);
        listElement.appendChild(document.createElement("hr"));
        listElement.appendChild(userName);

        listElement.setAttribute("id", user["id"]);
        container.appendChild(listElement);
        if (document.cookie.includes("GithubLogIn=true")) {
            listElement.appendChild(document.createElement("hr"));
            var addFriendButton = document.createElement("button");
            addFriendButton.setAttribute("type", "button");
            addFriendButton.setAttribute("onclick", "addGithubFriend(" + user["login"] + ");");
            addFriendButton.innerText = "Add";
            listElement.appendChild(addFriendButton);
        }



    });
}


function showSearchResponseLast(response) {
    const container = document.getElementsByClassName("userList")[0];
    container.innerHTML = "";
    var resp = document.createElement("P");
    resp.innerText = response;
    container.appendChild(resp);
}

function showSearchResponse(response) {
    var res = JSON.parse(response);
    const container = document.getElementsByClassName("userList")[0];
    container.innerHTML = "";
    for (var i = 0; i < res.length; i = i + 1) {
        var listElement = document.createElement("li");
        var userImage = document.createElement("img");
        userImage.setAttribute("src", res[i]["profile_image_url_https"]);
        userImage.setAttribute("height", "50px");
        userImage.setAttribute("width", "50px");
        userImage.setAttribute("style", "border-radius:50%;");

        var userName = document.createElement("P");
        userName.innerText = res[i]["name"];
        var userScreenName = document.createElement("P");
        userScreenName.innerText = "@" + res[i]["screen_name"];
        userScreenName.setAttribute("style", "color:#66757f;");
        var siteName = document.createElement("P");
        siteName.innerText = "Twitter";
        siteName.setAttribute("style", "color:#55acee;");

        listElement.appendChild(siteName);
        listElement.appendChild(document.createElement("hr"));
        listElement.appendChild(userImage);
        listElement.appendChild(document.createElement("hr"));
        listElement.appendChild(userName);
        listElement.appendChild(document.createElement("hr"));
        listElement.appendChild(userScreenName);

        listElement.setAttribute("id", res[i]["id_str"]);
        container.appendChild(listElement);

        if (document.cookie.includes("TwitterLogIn=true")) {
            var addFriendButton = document.createElement("button");
            addFriendButton.setAttribute("type", "button");
            addFriendButton.setAttribute("onclick", "addTwitterFriend(" + res[i]["id_str"] + ");");
            addFriendButton.innerText = "Add";
            listElement.appendChild(addFriendButton);
        }



    }
}