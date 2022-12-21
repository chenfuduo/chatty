/**
 * Fuduo Chen
 * CSC 337 Final Project
 * 
 * This file is for start.html
 */

window.onload = function(){
	
	var httpRequest = new XMLHttpRequest();
	if (!httpRequest){
		alert("Error!");
		return false;
	}
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE){
			if(httpRequest.status === 200){
				if(httpRequest.response === "exist"){
					window.location.href = "/main.html";
				}else{
					
				}
			}
		}
	}
	var url = "/checkInitialSession";
	httpRequest.open("GET", url);
	httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	httpRequest.send();
}
//---------------------------evenListenerForLogin---------------------------//

if(window.location.href.includes("index.html")){
	document.getElementById("usernameLogin").addEventListener("keyup", function(event){
		if(event.key === "Enter"){
			login();
		}
	})
	
	document.getElementById("passwordLogin").addEventListener("keyup", function(event){
		if(event.key === "Enter"){
			login();
		}
	})
}
//===========================evenListenerForLogin===========================//
//
//---------------------------registration---------------------------//
function register(){

	//upload portrait
	document.getElementById('FileUpload2').click();
	
	var httpRequest = new XMLHttpRequest();
	if (!httpRequest){
		alert("Error!");
		return false;
	}
	
	httpRequest.onreadystatechange = () => {
		if(httpRequest.readyState === XMLHttpRequest.DONE){
			if(httpRequest.status === 200){
				if(httpRequest.response === "username taken!"){
                    alert(httpRequest.response);
                    document.getElementById("username").select();
                    document.getElementById("password").value = "";
				} else {
                    alert("Registration success!");
                    var url = "/index.html";
                    window.location = url;
				}
			}
		}
	}
	var portrait = "";
	var portraitA = document.getElementById("FileUpload1").value.split("\\");
	var filename = portraitA[portraitA.length-1];
	if (filename == ""){
		 var temp = document.getElementById("portrait").src.split("/");
		 filename = temp[temp.length-1];
	}
	var portrait = "/img/" + filename;
	
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;

//	var gender = document.getElementById('gender').value;
	//get gender
	var select = document.getElementById("gender");
	var gender = select.options[select.selectedIndex].value;
	
	var age = document.getElementById('age').value;
	var hobby = document.getElementById('hobby').value;
	var intro = document.getElementById('intro').value;
	
	var url = "/registration";
	var userInfo = {username: username, password: password, portrait: portrait,
					gender: gender, age: age, hobby: hobby, intro: intro};
	var userInfo_str = JSON.stringify(userInfo);
	var params = "userInfo="+userInfo_str;
	console.log(params);
	httpRequest.open("POST", url, true);
	httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	httpRequest.send(params);
}
//===========================registration===========================//
//
//---------------------------login---------------------------//

function login(){
	var username = document.getElementById("usernameLogin").value;
	var password = document.getElementById("passwordLogin").value;
	console.log("value: " + username + "; " +( password == ""));
	if(username != "" && password != "" ){
		
		var httpRequest = new XMLHttpRequest();
		if (!httpRequest){
			alert("Error!");
			return false;
		}
		httpRequest.onreadystatechange = () => {
			if(httpRequest.readyState === XMLHttpRequest.DONE){
				if(httpRequest.status === 200){
					if(httpRequest.response == "BAD"){
						alert("invalid username or password!");
					}else{
						alert("session will expire in 1000s");
						var url = "/main.html";
						window.location = url;
					}
				}
			}
		}
		
		var url = "/login/" + username + "/" + password;
		httpRequest.open("GET", url);
		httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		httpRequest.send();
	}else{
		alert("please fill out your username and password")
	}
}

//===========================login===========================//
//
//---------------------------genderAndPortrait---------------------------//
if(window.location.href.includes("register.html")){
	var gender = document.getElementById('gender');
	gender.addEventListener("change", genderSwitch);
}

function genderSwitch() {
	var portrait = document.getElementById("portrait");
	var temp = portrait.src.split("/");
	var imgName = temp[temp.length-1];
	if(imgName == "male.png" || imgName == "female.png" || imgName == "questionMark.png"){
		if(gender.value === "Male"){
			// Do stuff
			portrait.src = "/img/male.png";
		}
		else if(gender.value === "Female"){
			portrait.src = "/img/female.png";
		}
		else{
			portrait.src = "/img/questionMark.png";
		}
	}

}
//===========================genderAndPortrait===========================//
//
//---------------------------loadPortrait---------------------------//
function loadFile(event) {
	var output = document.getElementById('portrait');
	output.src = URL.createObjectURL(event.target.files[0]); //get the file
	output.onload = function() {
		URL.revokeObjectURL(output.src) // free memory
	}
//	document.getElementById('FileUpload2').click();
};
//===========================loadPortrait===========================//
//
//---------------------------addPortrait---------------------------//
function addPortrait(){
	document.getElementById("FileUpload1").click();
}
//===========================addPortrait===========================//