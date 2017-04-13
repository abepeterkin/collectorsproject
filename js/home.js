window.onload = function() {
	var numImages = 2;
    var randomNumber = Math.floor(Math.random() * numImages) + 1;
	$("#backgroundImageID").css("background-image", "url(images/background_" + randomNumber + ".jpg");
}

$(document).ready(function(){
/*	$("#menu_item a").click(function() {
		PopupCenter('/pages/signup.html','xtf','900','500');  
    });*/
	
	var span = document.getElementsByClassName("close")[0];

	$("#menu_item #signUp").click(function() {
	    $("#signUpModal")[0].style.display = "flex";
		$("#signUpModal")[0].style.backgroundColor = "hsla(0,0%,0%,0.5)";
	});
	
	$("#menu_item #signIn").click(function() {
	    $("#signInModal")[0].style.display = "flex";
		$("#signInModal")[0].style.backgroundColor = "hsla(0,0%,0%,0.5)";
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
});