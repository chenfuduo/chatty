/**
 * Fuduo Chen
 * CSC 337 Final Project
 * 
 * This file is for index.html
 */

/**
 *functions are listed following
 *
 *	follow
 *	unfollow
 *	addPortrait
 *	displayFileOnDashboard
 *	shareFile
 *	displayEmoji
 *	session
 *	event listenter for textField
 *	Display Text
 */
window.onload = function (){
	//get the session name
	getUsername();
}

//---------------------------logOut---------------------------//

function logOut(){
	var httpRequest = new XMLHttpRequest();
	if (!httpRequest){
		alert("Error!");
		return false;
	}
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE){
			if(httpRequest.status === 200){
				window.location.href = "index.html";
			}
		}
	}
	
var url = "/logOut";
	
	httpRequest.open("GET", url);
	httpRequest.send();
	
}

//===========================logOut===========================//
//
//---------------------------showInfo---------------------------//

//1. if username is yourself, show info.html
//2. if username is others. show personal.html
function showInfo(username){
	
	var httpRequest = new XMLHttpRequest();
	if (!httpRequest){
		alert("Error!");
		return false;
	}
//	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE){
			if(httpRequest.status === 200){
				var response = httpRequest.response;
				if(response == "info.html"){
					window.location.href = response;
				}else{
					var url = response + "?username=" + username;
					window.open(url); 
				}
			}
		}
	}
//	
	var url = "/getUserIdentity/" + username;
	
	httpRequest.open("GET", url);
	httpRequest.send();
}

//===========================showInfo===========================//
//
//---------------------------displayOnDashboard---------------------------//
function displayOnDashboard(filename){
	var httpRequest = new XMLHttpRequest();
	if (!httpRequest){
		alert("Error!");
		return false;
	}
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE){
			if(httpRequest.status === 200){
				document.getElementById("file").innerHTML = "";
			}
		}
	}
	
	var url = "/displayFile/" + filename;
	
	httpRequest.open("GET", url);
	httpRequest.send();
}
//===========================displayOnDashboard===========================//
//
//---------------------------shareFile---------------------------//
//display the files that can share
function shareFile(){
	var httpRequest = new XMLHttpRequest();
	if (!httpRequest){
		alert("Error!");
		return false;
	}
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE){
			if(httpRequest.status === 200){
				var files = JSON.parse(httpRequest.response);
				if (files.length > 0){
					//special part
					document.getElementById("emoji").innerHTML = "";
					//special part ends
					var element = document.getElementById("file");
					var string = "<div style = 'background-color: white;" +
							"overflow-y: auto;max-height: 100px;" +
							"position: absolute;top: 0px;padding: 10px;cursor: pointer;" +
							"border: blue 2px solid;'>";
					if (element.innerHTML == ""){
						for (i in files){
							string += "<div onclick = 'displayOnDashboard(\"" + files[i] + "\")'>" + files[i] + "</div>";
						}
						string += "<a onclick = 'document.getElementById(\"file\").innerHTML = \"\"' style = 'float:right; padding-top: 10px;'>" + "Exit" + "</a>";
						element.innerHTML = string + "</div>";
					}else{
						
					}
				}else{
					alert("you have not uploaded any files yet!");
				}
			}
		}
	}
	
	var url = "/shareFile";
	
	httpRequest.open("GET", url);
	httpRequest.send();
	
}



//===========================shareFile===========================//
//
//---------------------------displayEmoji---------------------------//

function displayEmoji(){
	var httpRequest = new XMLHttpRequest();
	if (!httpRequest){
		alert("Error!");
		return false;
	}
	//14 X 8
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE){
			if(httpRequest.status === 200){
				var emoji = httpRequest.response.split(" ");
				
				var element = document.getElementById("emoji");
				var string = "";
				if (element.innerHTML == ""){
					var string = "<table style = 'border: grey solid 1px;border-spacing:0; border-collapse: collapse;'>";
					var count = 0;
					for (var i = 0; i < 8; i++){//row
						string += "<tr>"
						for (var j = 0; j < 14; j++){//col
							string += "<td id = " + count + " onclick = 'selectEmoji(" + count + ")' style = 'cursor: pointer; border: grey solid 1px;'>" + emoji[count] + "</td>";
							count+=1;
						}
						string += "</tr>"
					}
					string += "</table>"
				}else{
					
				}
			}
			element.innerHTML = string;
			string = "";
		}
	}
	
	var url = "/getEmoji";
	
	httpRequest.open("GET", url);
	httpRequest.send();
}
//select emoji
function selectEmoji(emoji){
	var text = document.getElementById("text");
	text.value += document.getElementById(emoji).innerText;
	document.getElementById("emoji").innerHTML = "";
	//put mouse in textarea;
	text.focus();
}

//===========================displayEmoji===========================//
//
//---------------------------session---------------------------//
//updateSession
function updateSessions(){
	var httpRequest = new XMLHttpRequest();
	if (!httpRequest){
		alert("Error!");
		return false;
	}
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE){
			if(httpRequest.status === 200){
				console.log(httpRequest.response);
				if(httpRequest.response === "session expired!"){
					alert("session expired!")
					window.location = "index.html";
				}
			}
		}
	}
	
	var url = "/getSessions";
	
	httpRequest.open("GET", url);
	httpRequest.send();
}

//var interval = setInterval(updateSessions, 1000);
//===========================session===========================//
//
//---------------------------event listenter for textField---------------------------//
var keyPressed = {};
var input = document.getElementById("text");
input.addEventListener("keyup", function(event) {
	console.log("key: " + event.key);
	keyPressed[event.key] = true; 
	if(keyPressed["Enter"] && keyPressed["Shift"]){
		console.log("here");
		input.innerText += "&#10;";
	}else if (event.keyCode === 13) {
		console.log("there");
		var text = document.getElementById("text");
		if(text.value.startsWith("\n")){
			console.log("in n");
			text.value = "";
		}else if(text.value == ""){
			console.log("in \"\"");
			text.value = "";
		}else{
			console.log("in else");
			updateText();
		}
    }
});

input.addEventListener("keyup", function(event){
	delete keyPressed[event.key];
//	console.log(JSON.stringify(keyPressed));
});

//===========================event listenter for textField===========================//

function getUsername(){
	var httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE){
			if(httpRequest.status === 200){
				var currentUser = httpRequest.response;
				var element = document.getElementById("name");
				element.innerText = currentUser;
			}
		}
	}
	
	httpRequest.open("GET", "/getCurrent", true);
	httpRequest.send();
}

//
//---------------------------Display Image---------------------------//
function displayImg(){
	var httpRequest = new XMLHttpRequest();
	if (!httpRequest){
		alert("Error!");
		return false;
	}
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE){
			if(httpRequest.status === 200){
				var list = JSON.parse(httpRequest.response);
				//test only
//				var name = "123";
//				var img = list[name];
				for(var name in list){
					var img = list[name];
					var elements = document.getElementsByClassName(name);
					for(i in elements){
						elements[i].src = img;
					}
				}
			}
		}
	}
	let url = "/displayImg";
	httpRequest.open("GET", url);
	httpRequest.send();
}
//===========================Display Image===========================//
//
//---------------------------Display Text---------------------------//
//download text and display
function displayText(){
	console.log("dispay A");
	var httpRequest = new XMLHttpRequest();
	if (!httpRequest){
		alert("Error!");
		return false;
	}

	console.log("dispay B");
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE){
			console.log("dispay C");
			if(httpRequest.status === 200){
				console.log("dispay D");

				var history = document.getElementById("history");
				var response = httpRequest.response;
				
				history.innerHTML = response;
				displayImg();
			}
		}
	}
	let url = "/chats";
	httpRequest.open("GET", url);
	httpRequest.send();
	
	
	
}



//upload text to server
function updateText(){
	var name = document.getElementById("name").innerText;
	var text = document.getElementById("text").value;
	if(text != ""){
		console.log("update A");
		if(name !== "" && text !== ""){
			console.log("update B");
			var httpRequest = new XMLHttpRequest();
			if (!httpRequest){
				alert("Error!");
				return false;
			}
			
			httpRequest.onreadystatechange = () => {
				console.log("httpRequest.readyState: " + httpRequest.readyState);
				if(httpRequest.readyState === XMLHttpRequest.DONE){
					console.log("httpRequest.status: " + httpRequest.status);
					if(httpRequest.status === 200){
						console.log("update C");
						document.getElementById("text").value = "";
						console.log("update text");
						displayText();
						autoScroll();
					}
				}
			}
			var url = "/chats/post/" + name + "/" + encodeURIComponent(text);
			console.log("url: " + url);
			
			httpRequest.open("GET", url, true);
			httpRequest.send();
		}
	}
}
//var interval = setInterval(displayText, 1000);


//===========================Display Text===========================//
//
//---------------------------Auto-scroll Text---------------------------//
function displayTextNoScroll(){
	var httpRequest = new XMLHttpRequest();
	if (!httpRequest){
		alert("Error!");
		return false;
	}
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE){
			if(httpRequest.status === 200){
				var history = document.getElementById("history");
				var response = httpRequest.response;
				
				history.innerHTML = response;
				
				if(element.innerText !== response){
					displayText();
				}
				
			}
		}
	}
	let url = "/autoScroll";
	httpRequest.open("GET", url);
	httpRequest.send();
	
}

function autoScroll(){
	var httpRequest = new XMLHttpRequest();
	if (!httpRequest){
		alert("Error!");
		return false;
	}
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE){
			if(httpRequest.status === 200){
//				console.log("httpResponse: " + httpRequest.response);
				var response = httpRequest.response;
				var element = document.getElementById("chatNums");
				if(element.innerText !== response){
					displayText();
					element.innerText = response 
					updateSessions();
					var history = document.getElementById("history");
					history.scrollTop = history.scrollHeight;
				}
			}
		}
	}
	
	var url = "/autoScroll";
	
	httpRequest.open("GET", url);
	httpRequest.send();
}
var intervalScroll = setInterval(autoScroll, 1000);
//var intervalSession = false;
function switchScrollTyple(){
	var scroll = document.getElementById("scroll");
	if(scroll.value == "start auto scroll"){
		intervalScroll = setInterval(autoScroll, 1000);
		scroll.value = "stop auto scroll";
	}else{
		clearInterval(intervalScroll);
		intervalSession = setInterval(updateSessions, 1000);
		scroll.value = "start auto scroll";
	} 
}

//===========================Auto-scroll Text===========================//
//
//---------------------------addStyleSheet---------------------------//

function addStyleSheet(sheetName) {
    document.getElementById('cssFile').href = sheetName;
    var mode = document.getElementById("mode");
    if(mode.innerText == "Night Mode"){
	    mode.setAttribute("onclick","addStyleSheet('style.css');");
	    mode.innerText = "Day Mode";
    }else{
	    mode.setAttribute("onclick","addStyleSheet('night.css');");
	    mode.innerText = "Night Mode";
    }
    
//	"<a href=\"#\" class=\"themeButton\" id=\"themeA\" onclick=\"addStyleSheet(\'themeB.css\')\">Day Mode</a>"
}

//===========================addStyleSheet===========================//