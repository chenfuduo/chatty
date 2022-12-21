/**
 * Fuduo Chen
 * CSC 337 Final Project
 * 
 * This is the local host version of server file. 
 * hostname and port are designed for local running only. 
 * 
 * hostname and port in DigitalOcean file are following: 
 * hostname: 64.227.7.155
 * port: 80
 */

const express = require("express");
const mongoose = require("mongoose");
const parser = require("body-parser");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const multer = require('multer');
const crypto = require("crypto");

const app = express();

const db = mongoose.connection
const mongoDBURL = "mongodb://127.0.0.1/chats";
mongoose.connect(mongoDBURL, {useNewUrlParser: true, useUnifiedTopology: true });
db.on('error' , console.error.bind(console, 'MongoDB connection error:'));

//const hostname = "127.0.0.1";
//const hostname = "192.168.35.166"
const hostname = "localhost"
	
app.use(cookieParser());
app.use(parser.json());							//
app.use(parser.urlencoded({extended: true}));	//

// Setup schema
var Schema = mongoose.Schema;
//---------------------------logOut---------------------------//

app.get("/logOut", function(req, res){
	delete sessionKeys[req.cookies.login.username];
//	req.cookies = {};
	res.clearCookie("login");
	console.log("here: ");
	console.log(req.cookies);
	res.send();
})

//===========================logOut===========================//
//
//---------------------------checkFollow---------------------------//

app.get("/checkFollow/:username", function(req, res){
	var username = req.cookies.login.username; 
	var follow = req.params.username
	users.find({username: username}).exec(function(error, results){
		if(results[0].followings.includes(follow)){
			res.send("followed");
		}
	})
})

//===========================checkFollow===========================//
//
//---------------------------unfollow---------------------------//

app.get("/unfollow/:username", function(req, res){
	var username = req.cookies.login.username; 
	var follow = req.params.username
	//remove follow to user's followings' list
	users.find({username: username}).exec(function(error, results){
		if(results[0].followings.includes(follow)){
			var index = results[0].followings.indexOf(follow);
			results[0].followings.splice(index, 1);
			results[0].save(function(err) {if(err) console.log("error")});
		}
	});
	//remove user to follow's followers' list
	users.find({username: follow}).exec(function(error, results){
		if(results[0].followers.includes(username)){
			var index = results[0].followers.indexOf(username);
			results[0].followers.splice(index, 1);
			results[0].save(function(err) {if(err) console.log("error")});
		}
	});
	res.end();
})

//===========================unfollow===========================//
//
//---------------------------follow---------------------------//

app.get("/follow/:username", function(req, res){
	var username = req.cookies.login.username; 
	var follow = req.params.username
	//save follow to user's followings' list
	users.find({username: username}).exec(function(error, results){
		if(!results[0].followings.includes(follow)){
			results[0].followings.push(follow);
			results[0].save(function(err) {if(err) console.log("error")});
		}
	});
	//save user to follow's followers' list
	users.find({username: follow}).exec(function(error, results){
		if(!results[0].followers.includes(username)){
			results[0].followers.push(username);
			results[0].save(function(err) {if(err) console.log("error")});
		}
	});
	res.end();
})

//===========================follow===========================//
//
//---------------------------checkFollowing---------------------------//

app.get("/checkFollowing", function(req, res){
	var username = req.cookies.login.username; 
	users.find({username: username}).exec(function(error, results){
		res.send(JSON.stringify(results[0].followings));
//		res.send(JSON.stringify(["buddy", "bro","a","b","c","d","e"]));
	})
})

//===========================checkFollowing===========================//
//
//
//---------------------------changePassword---------------------------//
app.post("/changePassword", function(req, res){
	var password = JSON.parse(req.body.userInfo).password;
//	console.log(password);
	var response = "?";
	var username = req.cookies.login.username;
	users.find({username: username}).exec(function(error, results){
		console.log("original: " + results[0].password); 
		console.log("current: " + password); 
		console.log("boolean" + (results[0].password == password));
		if(results[0].password == password){
			response = "same password!";
		}else{
			results[0].password = password;
			results[0].save(function(err) {if(err) console.log("error"); });
			response = "success!"
		}
		res.send(response);
	})
})
//===========================changePassword===========================//
//
//---------------------------saveInfo---------------------------//
app.post("/saveInfo", function(req, res){
	var userInfo = JSON.parse(req.body.userInfo);
	var username = req.cookies.login.username;
	users.find({username: username}).exec(function(err, results){
		if(results.length == 1){
			results[0].gender = userInfo.gender;
			results[0].age = userInfo.age;
			results[0].hobby = userInfo.hobby;
			results[0].intro = userInfo.intro;
			
			results[0].portrait = userInfo.portrait;
			
			results[0].save(function(err) {if(err) console.log("error"); });
		}
	})
	res.send("/info.html")
	
})
//===========================saveInfo===========================//
//
//---------------------------uploadRegisterPortrait---------------------------//
var storage = multer.diskStorage({
	destination: "./public_html/img/",
	filename: function(req, file, cb){
		cb(null, file.originalname)
	}
})

const uploadRegisterPortrait = multer({storage: storage}).single("portrait");

app.post('/uploadRegisterPortrait', uploadRegisterPortrait, (req, res) => {
	
	res.redirect("/register.html");
});

//===========================uploadRegisterPortrait===========================//
//
//---------------------------uploadSelfPortrait---------------------------//


const uploadSelfPortrait = multer({storage: storage}).single("portrait");

app.post('/uploadSelfPortrait', uploadSelfPortrait, (req, res) => {
// save uploaded files name to uploadedFile[]
	users.find({username: req.cookies.login.username}).exec(function (error, results){
//		console.log(req.file);
		if (results.length == 1){
			if(req.file != undefined){
				results[0].portrait = "/img/" + req.file.filename;
				results[0].save(function(err) {if(err) console.log("error"); });//
			}
		}else{
			
		}
		
	})
	res.redirect("/info.html");
});
//===========================uploadSelfPortrait===========================//
//
//---------------------------loadSelfInfo---------------------------//

app.get("/loadSelfInfo", function(req, res){
	var username = req.cookies.login.username;
	users.find({username: username}).exec(function(err, results){
		//when there exist a user
		if(results.length == 1){
			var info = {portrait: results[0].portrait, gender: results[0].gender,
						age: results[0].age, hobby: results[0].hobby, 
						intro: results[0].intro, username: results[0].username,
						following: results[0].followings, follower: results[0].followers}
			res.send(JSON.stringify(info));
		}else if(results.length == 0){
			//doing registration
			res.send("/img/questionMark.png");
		}
	})
})

//===========================loadSelfInfo===========================//
//
//---------------------------loadUserInfo---------------------------//

app.get("/loadUserInfo/:username", function(req, res){
	var username = req.params.username;
	users.find({username: username}).exec(function(error, results){
		if(results.length > 0){
			var info = {portrait: results[0].portrait, gender: results[0].gender,
						age: results[0].age, hobby: results[0].hobby, 
						intro: results[0].intro, username: results[0].username,
						following: results[0].followings, follower: results[0].followers}
		}
		res.send(JSON.stringify(info));
	})
//	res.send("123");
})

//===========================loadUserInfo===========================//
//
//---------------------------getUserIdentity---------------------------//

app.get("/getUserIdentity/:username", function(req, res){
	var username = req.params.username;
	if(username == req.cookies.login.username){
		res.send("info.html");
	}else{
		res.send("personal.html")
	}
})

//===========================getUserIdentity===========================//
//
//---------------------------addPortrait---------------------------//

//app.get("/addPortrait/")

//===========================addPortrait===========================//
//
//---------------------------displayFileOnDashboard---------------------------//
app.get("/displayFile/:filename", function (req, res){
	//get list of file name and send it back to client
//	users.find({username: req.cookies.login.username}).exec(function (error, results){
//		
//	})
	var string	= 	"<a href=\"/uploadedFiles/" + req.params.filename + "\">" + req.params.filename + "</a>" +
					"&nbsp;&nbsp;&nbsp;" +
					"<a href=\"/uploadedFiles/" + req.params.filename + "\" download=\"\">download</a>" ;
//	res.send(req.params.filename);
	var line = new chat({name: req.cookies.login.username, sentence: string});
	line.save(function(err) {if(err) console.log("error"); });
	res.end();
});
//===========================displayFileOnDashboard===========================//
//
//---------------------------shareFile---------------------------//
app.get("/shareFile", function (req, res){
	//get list of file name and send it back to client
	users.find({username: req.cookies.login.username}).exec(function (error, results){
		if(results.length == 1){
			res.send(JSON.stringify(results[0].uploadedFile));
		}else{
			res.end();
		}
	})
});
//===========================shareFile===========================//
//
//---------------------------uploadFile---------------------------//
//upload


var storage = multer.diskStorage({
	destination: "./public_html/uploadedFiles/",
	filename: function(req, file, cb){
		cb(null, file.originalname)
	}
})

const upload = multer({storage: storage}).array("file", 5);

app.post('/upload', upload, (req, res) => {
// save uploaded files name to uploadedFile[]
	users.find({username: req.cookies.login.username}).exec(function (error, results){
		if (results.length == 1){
			for(i in req.files){
				results[0].uploadedFile.push(req.files[i].filename);
				results[0].save(function(err) {if(err) console.log("error"); });//
			}
		}else{
		}
		
	})
	res.redirect("main.html");
});

//===========================uploadFile===========================//
//
//---------------------------displayEmoji---------------------------//
app.get("/getEmoji", function(req, res){
	var data = fs.readFileSync("public_html/emoji/emoji.txt", "utf8");
	res.send(data);
})
//===========================displayEmoji===========================//
//
//---------------------------		session		---------------------------//

//avoid conflicting logins
app.get("/getSessions", function(req, res){
	var now = Date.now();
	//var returnedValue = "session update!";
	for (e in sessionKeys){
		if(sessionKeys[e][1] < (now - 1000000)){
			//returnedValue = "session expired!";
			delete sessionKeys[e];
			res.send("session expired!");
			return;
		}
	}
	res.send("session update!");
})
var currentUser = {};
var sessionKeys = {};

app.use("/getCurrent", function(req, res){
	res.send(req.cookies.login.username);
})

function authenticate(req, res, next){
	console.log(req.cookies);
	console.log(sessionKeys);
	if (Object.keys(req.cookies).length > 0){
		var u = req.cookies.login.username; //req.query.username; 
		var key = req.cookies.login.key;
		if (Object.keys(sessionKeys).length > 0){
			if(Object.keys(sessionKeys[u]).length > 0 && 
				sessionKeys[u][0] == key){
				next();
			}else{
				res.clearCookie("login"); //avoid repetitive redirect to '/index.html'
				res.redirect("/index.html");
			}
		}else{
			res.clearCookie("login"); //avoid repetitive redirect to '/index.html'
			res.redirect("/index.html");
		}
	}else{
		res.redirect("/index.html");
	}
}

app.get("/main.html", authenticate);

//app.use("/", express.static("public_html"));
app.use(express.static("public_html"));

app.get("/checkInitialSession", function (req,res){
	if(req.cookies.login !== undefined){
		res.send("exist");
	}else{
		res.send("none");
	}
})

app.get("/login/:username/:password", (req, res)=>{
	let username = req.params.username;
	let password = req.params.password;
	users.find({username: username}).exec(function(error, results){
		if(results.length == 1){
			var salt = results[0].salt;
			var iteration = 1000;
			crypto.pbkdf2(password, salt, iteration, 64, "sha512", (err, hash)=>{
				if(err) throw err;
				var hashStr = hash.toString("base64");
				if(results[0].hash == hashStr){
					var sessionKey = Math.floor(Math.random() * 100000);
					sessionKeys[username] = [sessionKey, Date.now()]; 
					res.cookie("login", {username: username, key: sessionKey}, {maxAge: 1000000});
					res.send(username);
				}else{
					res.send("BAD");
				}
			})
		}else{
			res.send("BAD");
		}
	})
})

app.get("/getUsername", function(req, res){
	console.log("cookies: " + req.cookies);
	res.send(req.cookies.login.username);
})

//===========================		session		===========================//
//
//---------------------------	registration	---------------------------//

var UsersSchema = new Schema({
	username: String,
	salt: String,
	hash: String,
	portrait: String,
	uploadedFile: [],
	gender: String,
	age: Number,
	hobby: String,
	intro: String,
	followings:[],
	followers: []
});

var users = mongoose.model("users", UsersSchema);

app.post("/registration", function(req, res){
	var userInfo = JSON.parse(req.body.userInfo);
	
	users.find({username: userInfo.username}).exec( function(error, results) {
		if(results.length == 0){
			var password = userInfo.password;
			
			var salt = crypto.randomBytes(64).toString("base64");
			var iterations = 1000;
			
			crypto.pbkdf2(password, salt, iterations, 64, "sha512", (err, hash)=>{
				if(err) throw err;
				var hashStr = hash.toString("base64");
				var newUser = new users(	{username: userInfo.username, salt: salt, hash: hashStr, 
											portrait: userInfo.portrait, uploadedFile: [], gender: userInfo.gender, 
											age: userInfo.age, hobby: userInfo.hobby, intro: userInfo.intro ,
											followings:[], followers: []});
				newUser.save();
			})
			
			//registration complete
			
			
			res.end();
		}else{
			//registration fail
			res.send("username taken!");
		}
	})
	
})

//===========================	registration	===========================//
//
//---------------------------		login		---------------------------//

//app.get("/login/:username/:password", (req, res)=>{
//	let u = req.params.username;
//	let p = req.params.password;
//	users.find({username: u}).exec(function(error, results){
//		if(results.length == 1){
//			var sessionKey = Math.floor(Math.random() * 1000);
//			sessionKeys[u] = [sessionKey, Date.now()]; 
//			res.cookie("login", {username: u, key: sessionKey}, {maxAge: 100000});
//			res.send("OK");
//		}else{
//			res.send("BAD");
//		}
//	})
//})

//===========================login===========================//
//
//---------------------------Chating---------------------------//

var ChatInfoSchema = new Schema({
	name: String,
	sentence: String
});

var chat = mongoose.model("ChatInfo", ChatInfoSchema);

//set up default mongoose connection

app.get("/displayImg", function (req, res){
	users.find({}).exec(function(error, results){
		var returned = {};
		for(i in results){
			returned[results[i].username] = results[i].portrait;
		}
//		console.log(JSON.stringify(returned));
		res.send(JSON.stringify(returned));
	})
	
//	console.log("img displaying");
})

//retrieve all info and return it to html for displaying to users
app.get("/chats", function (req, res){
//	var chat = mongoose.model("ChatInfo", ChatInfoSchema);
	chat.find({}).exec(function(error, results){
		let response = "";
		var curUser = req.cookies.login;
		if(curUser != undefined){
			for (i in results){
				if(curUser.username == results[i].name){
					response +=	"<div style = 'padding-top: 10px; padding-bottom: 10px; display: block;padding-left: 70%;'>" +
									"<img src = '' onclick='showInfo(\"" + results[i].name + "\")'  " +
									"class = '" + results[i].name + "'" +
									"style = 'border-radius: 50%; float:left; width: 50px; cursor:pointer;' />" + 
									"<div onclick = \"showInfo(\'" + results[i].name.toString() + "\')\" " +
										"style='cursor:pointer; margin: 10px; margin-left: 20px; width: 200px;" +
										"'>" + results[i].name + ":" +
									"</div>" +
									"<div style = 'margin-left:50px;  background-color:#f3f3f3; width: 50%;" +
										"	padding: 10px; border: 2px solid #ebecf1; border-radius: 20px;word-wrap: break-word;'>" + 
										results[i].sentence + 
									"</div>" +
								"</div>";
				}else{
	
					response +=	"<div style = 'padding-top: 10px; padding-bottom: 10px; display: block; margin-left: 20px;'>" +
									"<img src = '' onclick='showInfo(\"" + results[i].name + "\")'  " +
									"class = '" + results[i].name + "'" +
									"style = 'border-radius: 50%; float:left; width: 50px; cursor:pointer;' />" + 
									"<div onclick = \"showInfo('" + results[i].name.toString() + "')\" " +
										"style='cursor:pointer; margin: 10px; margin-left: 20px; width: 200px;" +
										"'>" + results[i].name + ":" +
									"</div>" +
									"<div style = 'margin-left:50px; width:15%; background-color:#84a9ac;" +
										"	padding: 10px; border: 2px solid #3b6978; border-radius: 20px;word-wrap: break-word;'>" + 
										results[i].sentence + 
									"</div>" +
								"</div>";
				}
			}
			res.send(response);
		}
	})
});

app.get("/chats/post/:name/:text", function (req, res){
	var line = new chat({name: req.params.name, sentence: decodeURIComponent(req.params.text)});
	line.save(function(err) {if(err) console.log("error"); });
	res.send();
});

//===========================Chating===========================//
//
//---------------------------Auto-scroll Text---------------------------//
app.get("/autoScroll", function (req, res){
	chat.find({}).exec(function(error, results){
		var length = results.length;
		res.send(length.toString());
//		console.log(results.length);
	})
})
//===========================Auto-scroll Text===========================//

app.get("/get/users/", function(req, res){
	users.find({}).exec(function(error, results){
		res.setHeader("Content-Type", "text/plain");
		res.send(JSON.stringify(results, null, 4));
	})
})

app.use(express.static("public_html"));


//const port = 3000; 
const port = 4123

app.listen(port, hostname, function(){
	console.log("server has started");
});