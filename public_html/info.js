/**
 * Fuduo Chen
 * CSC 337 Final Project
 * 
 * This file is for info.html
 */

window.onload = function(){
	loadInfo();
//	var uploadPortrait = document.getElementById("FileUpload1");
//	uploadPortrait.onchange = function(){
////		alert(uploadPortrait.value);
//		document.getElementById("portrait").src = uploadPortrait.value;
//	}
}
//
//---------------------------unfollow---------------------------//

function unfollow(username){
	var httpRequest = new XMLHttpRequest();
	if (!httpRequest){
		alert("Error!");
		return false;
	}
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE){
			if(httpRequest.status === 200){				
//				checkFollowing();
				window.location.href="info.html";
			}
		}
	}
	
	var url = "/unfollow/" + username;
	
	httpRequest.open("GET", url);
	httpRequest.send();
}

//===========================unfollow===========================//
//
//---------------------------checkFollowing---------------------------//

function checkFollowing(){
	var followingList = document.getElementById("followingList");
//	followingList.innerHTML = "<div id='followingContent'></div>";
	
	if(followingList.innerHTML == ""){
		var httpRequest = new XMLHttpRequest();
		if (!httpRequest){
			alert("Error!");
			return false;
		}
	//	
		httpRequest.onreadystatechange = () => {
			if(httpRequest.readyState === XMLHttpRequest.DONE){
				if(httpRequest.status === 200){
					var list = JSON.parse(httpRequest.response);
	//				var followingList = document.getElementById("followingList");
					if(list.length == 0){
						alert("No following!");
					}else{
						var string 	= 	"<div id='followingContent'" +
										"style='background-color:#f0ece3;" +
										"		width:100px;" +
										"		height:100px;" +
										"		position: absolute;" +
										"		padding: 10px;" +
										"		border: 5px solid #dfd3c3;" +
										"		margin-left:-130px;" +
										"		margin-top:150px;" +
										"		overflow-y:auto;'>"; 
						for (i in list){
							string += 	"<b onclick = showInfo('" + list[i] + "') style='cursor:pointer;'>" + list[i] + "</b>" +
										"&nbsp;&nbsp;<b onclick = 'unfollow(\"" + list[i] + "\")' style='cursor:pointer;color:red;'>x</b><br>";
						}
						string += "</div>";
						
						followingList.innerHTML = string; 
						string = "";
					}
				}
			}
		}
	//	
		var url = "/checkFollowing";
		
		httpRequest.open("GET", url);
		httpRequest.send();
	}else{
		followingList.innerHTML = "";
	}
	
}
//complement
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

//===========================checkFollowing===========================//
//
//---------------------------changePassword---------------------------//
function changePassword(){
	document.getElementById("password").innerHTML = "<input type='password' id='passwordIn' onchange='restorePassword()'/>";
	document.getElementById("passwordIn").focus();
}

function restorePassword(){
	var password = document.getElementById("passwordIn").value;
	var httpRequest = new XMLHttpRequest();
	if (!httpRequest){
		alert("Error!");
		return false;
	}
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE){
			if(httpRequest.status === 200){
//				alert(httpRequest.response);
				if(httpRequest.response === "same password!"){
					alert("same password!");
				}else{
					alert("password changed!");
				}
			}
		}
	}
	document.getElementById("password").innerHTML = "<button onclick = 'changePassword()'>change password</button>";
	
	var url = "/changePassword";
	var userInfo = {password: password};
	var userInfo_str = JSON.stringify(userInfo);
	var params = "userInfo=" + userInfo_str; 
	httpRequest.open("POST", url, true);
	httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	httpRequest.send(params);
	
}
//===========================changePassword===========================//
//
//---------------------------defaultPortrait---------------------------//
//1.check the gender option
//2.set the image
function defaultPortrait(){
	var select = document.getElementById("genderIn");
	var value = select.options[select.selectedIndex].value;
	var img = ""
	if(value == "Male"){
		img = "/img/male.png";
	}else if(value == "Female"){
		img = "/img/female.png";
	}else{
		img = "/img/questionMark.png";
	}
	document.getElementById("portrait").src = img;
}

//===========================genderSwitch===========================//
//
//---------------------------genderSwitch---------------------------//

function genderSwitch() {
	var portrait = document.getElementById("portrait");
	var temp = portrait.src.split("/");
	var imgName = temp[temp.length-1];
	if(imgName == "male.png" || imgName == "female.png" || imgName == "questionMark.png"){
		var gender = document.getElementById("genderIn");
		var value = gender.options[gender.selectedIndex].value
		if(value === "Male"){
			// Do stuff
			portrait.src = "/img/male.png";
		}
		else if(value === "Female"){
			portrait.src = "/img/female.png";
		}
		else{
			portrait.src = "/img/questionMark.png";
		}
	}

}
//===========================genderSwitch===========================//
//
//---------------------------saveInfo---------------------------//
function saveInfo(){
	var httpRequest = new XMLHttpRequest();
	if (!httpRequest){
		alert("Error!");
		return false;
	}
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE){
			if(httpRequest.status === 200){
				document.location.href = httpRequest.response;
			}
		}
	}
	
	document.getElementById("FileUpload1").setAttribute("onchange","loadFile(event);");
	
	var select = document.getElementById("genderIn");
	var gender = select.options[select.selectedIndex].value;
	
	var age = document.getElementById("ageIn").value;
	var hobby = document.getElementById("hobbyIn").value;
	var intro = document.getElementById("introIn").value;
	
	var src = document.getElementById("portrait").src;
	if(!src.includes("male") && !src.includes("female") && !src.includes("questionMark")){
		document.getElementById('FileUpload2').click();
	}
	
	var portrait = document.getElementById("portrait").src;
	
	var url = "/saveInfo";
	var userInfo = {gender: gender, age: age, hobby: hobby, intro: intro, portrait: portrait};
	var userInfo_str = JSON.stringify(userInfo);
	var params = "userInfo="+userInfo_str;
	httpRequest.open("POST", url, true);
	httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	httpRequest.send(params);
}
//===========================saveInfo===========================//
//---------------------------EditInfo---------------------------//

function editInfo(){
//	alert("here!");
	var gender = document.getElementById("gender");
	var age = document.getElementById("age");
	var hobby = document.getElementById("hobby");
	var intro = document.getElementById("intro");
	var introOut = document.getElementById("introOut");
	
	var button = document.getElementById("edit");
	
	var genderString = "<select class=\"info\" id = \"genderIn\" style = \"width:50px\">";
	if(gender.innerText == "Male"){
		genderString += "<option value=\"Not preferred\">Not preferred</option>" +
						"<option value=\"Male\" selected=\"selected\">Male</option>" +
						"<option value=\"Female\">Female</option>";
	}else if(gender.innerText == "Female"){
		genderString += "<option value=\"Not preferred\">Not preferred</option>" +
						"<option value=\"Male\">Male</option>" +
						"<option value=\"Female\" selected=\"selected\">Female</option>";
	}else{
		genderString += "<option value=\"Not preferred\" selected=\"selected\">Not preferred</option>" +
						"<option value=\"Male\">Male</option>" +
						"<option value=\"Female\">Female</option>";
	}
	gender.innerHTML =  genderString + "</select>";
	age.innerHTML = "<input id = \"ageIn\" type = 'number' value = " + age.innerText + " style = 'width: 50px;' />";
	hobby.innerHTML = "<input id = \"hobbyIn\" type = 'text' value = " + hobby.innerText + " style = 'width: 50px;' />";
	introOut.innerHTML = "<textarea id = \"introIn\" type = 'text' style = 'width:252px; height:100px;padding:4px; margin: 20px;'>" + intro.innerText + "</textarea>";
	
	button.innerHTML =	"<button onclick=\"defaultPortrait()\" style = \"margin-left:120px;display:inline;\">default portrait</button>" +
						"<button onclick=\"saveInfo()\" style = \"margin-left:10px;\">save</button>";
	
	var gender = document.getElementById('genderIn');
	gender.addEventListener("change", genderSwitch);
//	document.getElementById("FileUpload").action = "";
	document.getElementById("FileUpload1").setAttribute("onchange","loadFileTemp(event);");
//	.onchange = "loadFileTemp(event)";
}

//===========================EditInfo===========================//
//
//---------------------------loadPortrait---------------------------//
function loadFile(event) {
  var output = document.getElementById('portrait');
  output.src = URL.createObjectURL(event.target.files[0]); //get the file
  output.onload = function() {
    URL.revokeObjectURL(output.src) // free memory
  }
  document.getElementById('FileUpload2').click();
};

function loadFileTemp(event) {
	  var output = document.getElementById('portrait');
	  output.src = URL.createObjectURL(event.target.files[0]); //get the file
	  output.onload = function() {
	    URL.revokeObjectURL(output.src) // free memory
	  }
	};
//===========================loadPortrait===========================//
//
//---------------------------loadInfo---------------------------//
function loadInfo(){
	//load portrait
	var httpRequest = new XMLHttpRequest();
	if (!httpRequest){
		alert("Error!");
		return false;
	}
//	
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
				if (following.length == 1){
					document.getElementById("following").innerHTML = 	"<span onclick = showInfo('" + response.following[0] + "') style='cursor:pointer;'>"+ response.following[0] + "</span>&nbsp;&nbsp;<b onclick = 'unfollow(\"" + response.following[0] + "\")' style='cursor:pointer;color:red;'>x</b>";
				}else if(following.length > 1){
					document.getElementById("following").innerHTML = 	response.following[0] + 
																		" <b onclick='checkFollowing()' style='cursor:pointer;'>more</b>";
				}else{
					document.getElementById("following").innerHTML = "No following";
				}
				//set follower
				document.getElementById("follower").innerHTML = response.follower.length;
			}
		}
	}
//	
	var url = "/loadSelfInfo";
	
	httpRequest.open("GET", url);
	httpRequest.send();
}
//===========================loadInfo===========================//
//
//---------------------------addPortrait---------------------------//

//add portrait to user
//1. add portrait to info.html		DONE
//2. add portrait image file name to database
//3. upload portrait image file
function addPortrait(){
	document.getElementById("FileUpload1").click();
}

//===========================addPortrait===========================//
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

var interval = setInterval(updateSessions, 1000);
//===========================session===========================//