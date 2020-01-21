
function addTwitterFriend(person_id)
{
    //console.log(person_id);

    xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
                        console.log(this.response);
					}
				};
    xhttp.open("POST", "https://localhost:3000/index.html", true);
    xhttp.setRequestHeader("Why","FollowTwitterFriend");
    xhttp.setRequestHeader("friendId",person_id);
    xhttp.send(); 
}

function searchUsers()
{
    var UserName = document.getElementById("UserName").value;
    var selectorElement =  document.getElementById("listSelect");
    var site = selectorElement.options[selectorElement.selectedIndex].innerText;

    console.log(UserName + "  " + site)

    xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
                        //console.log(this.response)
                        var res = JSON.parse(this.response);
                        const container = document.getElementsByClassName("userList")[0];
                        container.innerHTML = "";
                        for (var i =0 ;i<res.length;i++)
                        {
                            var listElement = document.createElement("li");
                            var img = document.createElement("img");
                            img.setAttribute("src",res[i]["profile_image_url_https"]);
                            img.setAttribute("height","50px");
                            img.setAttribute("width","50px");
                            img.setAttribute("style","border-radius:50%;");

                            var nameel = document.createElement("P");
                            nameel.innerText = res[i]["name"];
                            var scrname = document.createElement("P");
                            scrname.innerText = "@" + res[i]["screen_name"];
                            scrname.setAttribute("style","color:#66757f;")
                            var siteel = document.createElement("P");
                            siteel.innerText = "Twitter";
                            siteel.setAttribute("style","color:#55acee;");
                            
                            var button = document.createElement("button");
                            button.setAttribute("type","button");
                            button.setAttribute("onclick","addTwitterFriend(" + res[i]["id_str"] + ");")
                            button.innerText = "Add";
                            listElement.appendChild(siteel);
                            listElement.appendChild(document.createElement("hr"))
                            listElement.appendChild(img);
                            listElement.appendChild(document.createElement("hr"))
                            listElement.appendChild(nameel);
                            listElement.appendChild(document.createElement("hr"))
                            listElement.appendChild(scrname);
                            listElement.appendChild(document.createElement("hr"))
                            listElement.appendChild(button);
                            listElement.setAttribute("id",res[i]["id_str"]);
                            container.appendChild(listElement);
                        }
					}
				};
    xhttp.open("POST", "https://localhost:3000/index.html", true);
    xhttp.setRequestHeader("Why","SearchUser");
    xhttp.setRequestHeader("SiteToSearch",site);
    xhttp.setRequestHeader("userName",UserName);
    xhttp.send(); 
}