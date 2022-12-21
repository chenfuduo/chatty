/**
 * Fuduo Chen
 * CSC 337 Final Project
 * 
 * This file is for personal.html
 */

window.onload = function(){
	loadInfo();
	checkFollow();
}
//---------------------------checkFollow---------------------------//

function checkFollow(){
	var httpRequest = new XMLHttpRequest();
	if (!httpRequest){
		alert("Error!");
		return false;
	}
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE){
			if(httpRequest.status === 200){
				if(httpRequest.response == "followed"){
					var element = document.getElementById("followButton");
					element.value = "Unfollow";
					element.setAttribute("onclick","unfollow()");
				}
			}
		}
	}
	var params = new URLSearchParams(window.location.search);
	var username = params.get("username");
	var url = "/checkFollow/" + username;
	
	httpRequest.open("GET", url);
	httpRequest.send();
}

//===========================checkFollow===========================//
//
//---------------------------unfollow---------------------------//

function unfollow(){
	var httpRequest = new XMLHttpRequest();
	if (!httpRequest){
		alert("Error!");
		return false;
	}
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE){
			if(httpRequest.status === 200){
				var element = document.getElementById("followButton");
				element.value = "Follow";
				element.setAttribute("onclick","follow()");
				window.location.reload();
			}
		}
	}
	var params = new URLSearchParams(window.location.search);
	var username = params.get("username");
	var url = "/unfollow/" + username;
	
	httpRequest.open("GET", url);
	httpRequest.send();
}

//===========================unfollow===========================//
//
//---------------------------follow---------------------------//

function follow(){
	var httpRequest = new XMLHttpRequest();
	if (!httpRequest){
		alert("Error!");
		return false;
	}
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE){
			if(httpRequest.status === 200){
				var element = document.getElementById("followButton");
				element.value = "Unfollow";
				element.setAttribute("onclick","unfollow()");
				window.location.reload();
			}
		}
	}
	var params = new URLSearchParams(window.location.search);
	var username = params.get("username");
	var url = "/follow/" + username;
	
	httpRequest.open("GET", url);
	httpRequest.send();
}

//===========================follow===========================//
//
//---------------------------loadInfo---------------------------//
function loadInfo(){
	//load portrait
	var httpRequest = new XMLHttpRequest();
	if (!httpRequest){
		alert("Error!");
		return false;
	}
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE){
			if(httpRequest.status === 200){
				var response = JSON.parse(httpRequest.response);
				//set portrait
				var portrait = document.getElementById("portrait");
				portrait.src = response.portrait;
				//set username
				document.getElementById("username").innerHTML = response.username;
				//set gender
				document.getElementById("gender").innerHTML = response.gender;
				//set age
				document.getElementById("age").innerHTML = response.age;
				//set hobby
				document.getElementById("hobby").innerHTML = response.hobby;
				//set introduction
				document.getElementById("intro").innerHTML = response.intro;
				//set following
				var following = response.following;
				if (following.length > 0){
					document.getElementById("following").innerHTML = response.following[0];
				}else{
					document.getElementById("following").innerHTML = "No current following";
				}
				//set follower
				document.getElementById("follower").innerHTML = response.follower.length;
			}
		}
	}
//	
	var params = new URLSearchParams(window.location.search);
	var username = params.get("username");
	var url = "/loadUserInfo/" + username;
	
	httpRequest.open("GET", url);
	httpRequest.send();
}
//===========================loadInfo===========================//