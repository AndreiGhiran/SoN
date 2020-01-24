
function TwitterLogIn()
{
    
    xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
                        console.log(this.response)
                        var res = this.response.split("&");
                        document.cookie = "TwitterLogIn=true";
                        window.open("https://api.twitter.com/oauth/authenticate" + "?oauth_token=" + res[0],"_self");
					}
				};
    xhttp.open("POST", "https://localhost:3000/index.html", true);
    xhttp.setRequestHeader("Site","Twitter");
    xhttp.send(); 
}


function TwitterLogOut()
{
    xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
                        document.cookie = "TwitterLogIn=false";
                        var res = this.response.split("&");
						window.open("https://api.twitter.com/oauth/authenticate" + "?oauth_token=" + res[0],"_self");
                        location.reload(true);
					}
				};
    xhttp.open("POST", "https://localhost:3000/index.html", true);
    xhttp.setRequestHeader("Site","TwitterOut");
    xhttp.send(); 
}

