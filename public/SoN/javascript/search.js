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
        }
    };
    xhttp.open("POST", "https://localhost:3000/index.html", true);
    xhttp.setRequestHeader("Why", "SearchUser");
    xhttp.setRequestHeader("SiteToSearch", site);
    xhttp.setRequestHeader("userName", UserName);
    xhttp.send();
}


function showSearchResponseLast(response) {
    const container = document.getElementsByClassName("userList")[0];
    container.innerHTML = "";
    if(response.length == 1){
        var resp = document.createElement("P");
        resp.innerText = "No user with that username exists on Last.fm!";
        container.appendChild(resp);
    }
    else{
    res= JSON.parse(response)
    var listElement = document.createElement("li");
    var userImage = document.createElement("img");
    if(res["image"] != '')
        userImage.setAttribute("src", res["image"]);
    else
        userImage.setAttribute("src", "..\\images\\image.png");
    userImage.setAttribute("height", "50px");
    userImage.setAttribute("width", "50px");
    userImage.setAttribute("style", "border-radius:50%;");

    var userName = document.createElement("P");
    userName.innerText = res["name"];

    if(res["screen_name"] != "")
    {
        var userScreenName = document.createElement("P");
        userScreenName.innerText = "real name: " + res["screen_name"];
        userScreenName.setAttribute("style", "color:#E4141E;");
    }
    var siteName = document.createElement("P");
    siteName.innerText = "Last.fm";
    siteName.setAttribute("style", "color:#E4141E;");

    listElement.appendChild(siteName);
    listElement.appendChild(document.createElement("hr"));
    listElement.appendChild(userImage);
    listElement.appendChild(document.createElement("hr"));
    listElement.appendChild(userName);
    if(res["screen_name"] != ""){
        listElement.appendChild(document.createElement("hr"));
        listElement.appendChild(userScreenName);
    }

    listElement.setAttribute("id", res["id_str"]);
    add_button = document.createElement("form");
    add_button.setAttribute("action",res["url"]);
    butt = document.createElement("input");
    butt.setAttribute("type","submit");
    butt.setAttribute("value","Add");
    add_button.appendChild(butt);
    listElement.appendChild(add_button);
    container.appendChild(listElement);
    }

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
<<<<<<< Updated upstream
        siteName.innerText = "Twitter";
        siteName.setAttribute("style", "color:#55acee;");
        if (document.cookie.includes("TwitterLogIn=true")) {
            var addFriendButton = document.createElement("button");
            addFriendButton.setAttribute("type", "button");
            addFriendButton.setAttribute("onclick", "addTwitterFriend(" + res[i]["id_str"] + ");");
            addFriendButton.innerText = "Add";
            listElement.appendChild(addFriendButton);
        }


        listElement.appendChild(siteName);
        listElement.appendChild(document.createElement("hr"));
        listElement.appendChild(userImage);
        listElement.appendChild(document.createElement("hr"));
        listElement.appendChild(userName);
        listElement.appendChild(document.createElement("hr"));
        listElement.appendChild(userScreenName);

        listElement.setAttribute("id", res[i]["id_str"]);
        container.appendChild(listElement);
    }
}
=======

        siteName.innerText = person["site"];
        if (person["site"] == "Twitter") {
            siteName.setAttribute("style", "color:#55acee;");
            var addFriendButton = document.createElement("button");
            addFriendButton.setAttribute("type", "button");
            addFriendButton.setAttribute("onclick", "addTwitterFriend(" + person["id_str"] + ");");
            addFriendButton.innerText = "Add";
        }
        if (person["site"] == "Last.fm") {
            siteName.setAttribute("style", "color:#E4141E;");
            add_button = document.createElement("form");
            add_button.setAttribute("action",person["url"]);
            butt = document.createElement("input");
            butt.setAttribute("type","submit");
            butt.setAttribute("value","Add");
            add_button.appendChild(butt);
        }
        if (person["site"] == "Github") {
            siteName.setAttribute("style", "color:#404448;");
            var addFriendButton = document.createElement("button");
            addFriendButton.setAttribute("type", "button");
            addFriendButton.setAttribute("onclick", "addGithubFriend(" + person["name"] + ");");
            addFriendButton.innerText = "Add";
        }

        listElement.appendChild(siteName);
        listElement.appendChild(document.createElement("hr"));



        listElement.appendChild(userImage);
        listElement.appendChild(document.createElement("hr"));
        listElement.appendChild(userName);
        listElement.appendChild(document.createElement("hr"));
        if (person["screen_name"]) {
            var userScreenName = document.createElement("P");
            userScreenName.innerText = "@" + person["screen_name"];
            userScreenName.setAttribute("style", "color:#66757f;");
            listElement.appendChild(userScreenName);
            listElement.appendChild(document.createElement("hr"));
        }
        if (document.cookie.includes(person["site"] + "LogIn=true"))
            listElement.appendChild(addFriendButton);
        if (person["site"] == "Last.fm")
            listElement.appendChild(add_button);
        listElement.setAttribute("id", person["id_str"]);
        container.appendChild(listElement);
    })

}


// function showSearchResponseLast(response) {
//     const container = document.getElementsByClassName("userList")[0];
//     container.innerHTML = "";
//     if (response.length == 1) {
//         var resp = document.createElement("P");
//         resp.innerText = "No user with that username exists on Last.fm!";
//         container.appendChild(resp);
//     } else {
//         res = JSON.parse(response)
//         var listElement = document.createElement("li");
//         var userImage = document.createElement("img");
//         if (res["image"] != '')
//             userImage.setAttribute("src", res["image"]);
//         else
//             userImage.setAttribute("src", "..\\images\\image.png");
//         userImage.setAttribute("height", "50px");
//         userImage.setAttribute("width", "50px");
//         userImage.setAttribute("style", "border-radius:50%;");

//         var userName = document.createElement("P");
//         userName.innerText = res["name"];

//         if (res["screen_name"] != "") {
//             var userScreenName = document.createElement("P");
//             userScreenName.innerText = "real name: " + res["screen_name"];
//             userScreenName.setAttribute("style", "color:#E4141E;");
//         }
//         var siteName = document.createElement("P");
//         siteName.innerText = "Last.fm";
//         siteName.setAttribute("style", "color:#E4141E;");

//         listElement.appendChild(siteName);
//         listElement.appendChild(document.createElement("hr"));
//         listElement.appendChild(userImage);
//         listElement.appendChild(document.createElement("hr"));
//         listElement.appendChild(userName);
//         if (res["screen_name"] != "") {
//             listElement.appendChild(document.createElement("hr"));
//             listElement.appendChild(userScreenName);
//         }

//         listElement.setAttribute("id", res["id_str"]);
//         add_button = document.createElement("form");
//         add_button.setAttribute("action", "window.open(" + res["url"] + ",_blank);");
//         butt = document.createElement("input");
//         butt.setAttribute("type", "submit");
//         butt.setAttribute("value", "Add");
//         add_button.appendChild(butt);
//         if (document.cookie.includes("LastfmLogIn=true"))
//             listElement.appendChild(add_button);
//         container.appendChild(listElement);
//     }

// }
>>>>>>> Stashed changes
