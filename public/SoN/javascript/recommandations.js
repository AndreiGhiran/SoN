function addTwitterFriend(person_id) {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(response);
        }
    };
    xhttp.open("POST", "https://localhost:3000/index.html", true);
    xhttp.setRequestHeader("Why", "FollowTwitterFriend");
    xhttp.setRequestHeader("friendId", person_id);
    xhttp.send();
}

function showResponseFromTwitter(response) {
    var res = JSON.parse(response);
    const container = document.getElementsByClassName("recommandations")[0];
    for (var i = 0; i < res.length; i = i + 1) {
        var listElement = document.createElement("li");
        var userImage = document.createElement("img");
        if (res[i]["image"] != "")
            userImage.setAttribute("src", res[i]["image"]);
        else
            userImage.setAttribute("src", "..\\images\\image.png");
        userImage.setAttribute("height", "50px");
        userImage.setAttribute("width", "50px");
        userImage.setAttribute("style", "border-radius:50%;");

        var userName = document.createElement("P");
        userName.innerText = res[i]["name"];
        var siteName = document.createElement("P");

        siteName.innerText = res[i]["site"];
        if (res[i]["site"] == "Twitter") {
            siteName.setAttribute("style", "color:#55acee;");
            var addFriendButton = document.createElement("button");
            addFriendButton.setAttribute("type", "button");
            addFriendButton.setAttribute("onclick", "addTwitterFriend(" + res[i]["id_str"] + ");");
            addFriendButton.innerText = "Add";
        }
        if (res[i]["site"] == "Last.fm") {
            siteName.setAttribute("style", "color:#b90000;");
            var addFriendButton = document.createElement("button");
            addFriendButton.setAttribute("type", "button");
            addFriendButton.setAttribute("onclick", "addLastfmFriend(" + res[i]["id_str"] + ");");
            addFriendButton.innerText = "Add";
        }

        listElement.appendChild(siteName);
        listElement.appendChild(document.createElement("hr"));



        listElement.appendChild(userImage);
        listElement.appendChild(document.createElement("hr"));
        listElement.appendChild(userName);
        listElement.appendChild(document.createElement("hr"));
        if (res[i]["screen_name"]) {
            var userScreenName = document.createElement("P");
            userScreenName.innerText = "@" + res[i]["screen_name"];
            userScreenName.setAttribute("style", "color:#66757f;");
            listElement.appendChild(userScreenName);
        }
        listElement.appendChild(document.createElement("hr"));
        listElement.appendChild(addFriendButton);
        listElement.setAttribute("id", res[i]["id_str"]);
        container.appendChild(listElement);
    }
}