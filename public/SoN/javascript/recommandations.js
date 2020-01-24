function addTwitterFriend(person_id)
{
    //console.log(person_id);

    xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
                        console.log(response);
					}
				};
    xhttp.open("POST", "https://localhost:3000/index.html", true);
    xhttp.setRequestHeader("Why","FollowTwitterFriend");
    xhttp.setRequestHeader("friendId",person_id);
    xhttp.send(); 
}