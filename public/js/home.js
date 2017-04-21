window.onload = function() {
	var numImages = 2;
    var randomNumber = Math.floor(Math.random() * numImages) + 1;
	$("#backgroundImageID").css("background-image", "url(images/background_" + randomNumber + ".jpg");
}

$(document).ready(function(){

	console.log("USER: " + username);

	var span = document.getElementsByClassName("close")[0];

	if (username === "") {
		$("#username").hide();
		$("#profile").hide();
		$("#signOut").hide();
		$("#upload").hide();
	} else {
		$("#profile").html(username + "'s profile");
		$("#signIn").hide();
		$("#signUp").hide();
	}

	$("#signUp").click(function() {
	    $("#signUpModal")[0].style.display = "flex";
		$("#signUpModal")[0].style.backgroundColor = "hsla(0,0%,0%,0.5)";
	});

	$("#signIn").click(function() {
	    $("#signInModal")[0].style.display = "flex";
		$("#signInModal")[0].style.backgroundColor = "hsla(0,0%,0%,0.5)";
	});

	$("#menu_item #profile").click(function() {

	});

	$(document).click(function(event) {
    	if (event.target == $("#signUpModal")[0]) {
			$("#signUpModal")[0].style.display = "none";
		}
	});

	$(document).click(function(event) {
    	if (event.target == $("#signInModal")[0]) {
			$("#signInModal")[0].style.display = "none";
		}
	});

	$("#search").keyup(function(event){
	    if(event.keyCode == 13){
	        document.getElementById("body_words").remove();
	    	document.getElementById("body_text").display="block";
		    document.getElementById("body_text").style.top="75px"; 

		    document.getElementById("header").style.height = "50px";


		    document.getElementById("nav_bar_title").style.fontSize = "20px";
		    document.getElementById("news").style.fontSize = "15px";
		    document.getElementById("about").style.fontSize = "15px";
		    document.getElementById("signIn").style.fontSize = "15px";
		    document.getElementById("signUp").style.fontSize = "15px";

		    document.getElementById("upload").style.fontSize = "15px";
		    document.getElementById("profile").style.fontSize = "15px";
		    document.getElementById("signOut").style.fontSize = "15px";

		    document.getElementById("search_results").style.visibility="visible";
	    }
	});

});
