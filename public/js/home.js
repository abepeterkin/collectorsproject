window.onload = function() {
	var numImages = 2;
    var randomNumber = Math.floor(Math.random() * numImages) + 1;
	$("#backgroundImageID").css("background-image", "url(images/background_" + randomNumber + ".jpg");
}

$(document).ready(function(){
/*	$("#menu_item a").click(function() {
		PopupCenter('/pages/signup.html','xtf','900','500');
    });*/

	console.log("USER: " + username);

	var span = document.getElementsByClassName("close")[0];

	if (username === "") {
		$("#nav_bar_signed_in").hide();
	} else {
		$("#nav_bar").hide();
	}

	$("#menu_item #signUp").click(function() {
	    $("#signUpModal")[0].style.display = "flex";
		$("#signUpModal")[0].style.backgroundColor = "hsla(0,0%,0%,0.5)";
	});

	$("#menu_item #signIn").click(function() {
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
	        document.getElementById("body_text").remove();
		    document.getElementById("search").style.top="100px";

		    document.getElementById("nav_bar_title").style.fontSize = "20px";
		    document.getElementById("news").style.fontSize = "15px";
		    document.getElementById("about").style.fontSize = "15px";
		    document.getElementById("signIn").style.fontSize = "15px";
		    document.getElementById("signUp").style.fontSize = "15px";


		    document.getElementById("search_results").style.visibility="visible";
	    }
	});

});
